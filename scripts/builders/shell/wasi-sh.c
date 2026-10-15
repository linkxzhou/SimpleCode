/* wasi-sh: a single-process shell for WASI preview1.
 * Builtins run in this instance. Pipes between builtins use a memory buffer.
 * There is no fork, exec, or host pipe, so external programs cannot run.
 * SPDX-License-Identifier: MIT
 */
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SCRIPT (1024 * 1024)

static const char *P;
static const char *PEND;
static int line_no = 1;
static int last_status;
static int syntax_error;

typedef struct Var {
  char *name;
  char *value;
  struct Var *next;
} Var;
static Var *vars;
static char *pos[64];
static int npos;
static char *arg0 = (char *)"sh";

typedef struct Word {
  char *raw;
  struct Word *next;
} Word;

typedef struct Redir {
  int kind; /* 1 '<', 2 '>', 3 '>>' */
  char *target;
  struct Redir *next;
} Redir;

typedef enum { NK_CMD, NK_BIN, NK_PIPE, NK_IF, NK_WHILE, NK_FOR } NKind;

typedef struct Node {
  NKind kind;
  int op; /* '&' and, '|' or, ';' seq */
  struct Node *a, *b, *c;
  Word *words;
  Redir *redirs;
  char *name;
} Node;

typedef struct {
  int kind; /* 0 stdin, 1 mem, 2 file */
  const char *mem;
  size_t len, pos;
  FILE *fp;
} In;

typedef struct {
  int kind; /* 0 stdout, 1 mem, 2 file, 3 stderr */
  char *mem;
  size_t len, cap;
  FILE *fp;
} Out;

static void *xmalloc(size_t n) {
  void *p = malloc(n ? n : 1);
  if (!p) {
    fprintf(stderr, "shell: out of memory\n");
    exit(1);
  }
  return p;
}

static char *xdup(const char *s) {
  size_t n = strlen(s);
  char *p = xmalloc(n + 1);
  memcpy(p, s, n + 1);
  return p;
}

static char *xdupn(const char *s, size_t n) {
  char *p = xmalloc(n + 1);
  memcpy(p, s, n);
  p[n] = 0;
  return p;
}

static void out_put(Out *o, const char *s, size_t n) {
  if (o->kind == 1) {
    if (o->len + n + 1 > o->cap) {
      size_t c = o->cap ? o->cap : 64;
      while (c < o->len + n + 1) c *= 2;
      o->mem = realloc(o->mem, c);
      if (!o->mem) exit(1);
      o->cap = c;
    }
    memcpy(o->mem + o->len, s, n);
    o->len += n;
    o->mem[o->len] = 0;
    return;
  }
  FILE *fp = o->kind == 3 ? stderr : o->kind == 2 ? o->fp : stdout;
  if (n) fwrite(s, 1, n, fp);
  fflush(fp);
}

static void out_puts(Out *o, const char *s) { out_put(o, s, strlen(s)); }

static int in_getc(In *in) {
  if (in->kind == 1) {
    if (in->pos >= in->len) return EOF;
    return (unsigned char)in->mem[in->pos++];
  }
  FILE *fp = in->kind == 2 ? in->fp : stdin;
  return fgetc(fp);
}

static int in_line(In *in, char **out) {
  size_t cap = 64, n = 0;
  char *buf = xmalloc(cap);
  int any = 0;
  for (;;) {
    int c = in_getc(in);
    if (c == EOF) {
      if (!any) {
        free(buf);
        *out = NULL;
        return 1;
      }
      break;
    }
    any = 1;
    if (c == '\n') break;
    if (n + 1 >= cap) {
      cap *= 2;
      buf = realloc(buf, cap);
      if (!buf) exit(1);
    }
    buf[n++] = (char)c;
  }
  buf[n] = 0;
  *out = buf;
  return 0;
}

static const char *var_get(const char *name) {
  for (Var *v = vars; v; v = v->next)
    if (strcmp(v->name, name) == 0) return v->value;
  return "";
}

static void var_set(const char *name, const char *value) {
  for (Var *v = vars; v; v = v->next) {
    if (strcmp(v->name, name) == 0) {
      free(v->value);
      v->value = xdup(value);
      return;
    }
  }
  Var *v = xmalloc(sizeof(*v));
  v->name = xdup(name);
  v->value = xdup(value);
  v->next = vars;
  vars = v;
}

static int is_name_char(int c) { return isalnum(c) || c == '_'; }

typedef struct {
  char *data;
  size_t len, cap;
} Buf;

static void buf_add(Buf *b, const char *s, size_t n) {
  if (b->len + n + 1 > b->cap) {
    size_t c = b->cap ? b->cap : 32;
    while (c < b->len + n + 1) c *= 2;
    b->data = realloc(b->data, c);
    if (!b->data) exit(1);
    b->cap = c;
  }
  memcpy(b->data + b->len, s, n);
  b->len += n;
  b->data[b->len] = 0;
}

static void buf_adds(Buf *b, const char *s) { buf_add(b, s, strlen(s)); }

static const char *expand_param(const char *s, Buf *b) {
  if (*s == '{') {
    s++;
    const char *start = s;
    while (*s && *s != '}') s++;
    char *name = xdupn(start, (size_t)(s - start));
    if (*s == '}') s++;
    if (name[0] >= '0' && name[0] <= '9' && name[1] == 0) {
      int i = name[0] - '0';
      buf_adds(b, i == 0 ? arg0 : (i <= npos ? pos[i - 1] : ""));
    } else buf_adds(b, var_get(name));
    free(name);
    return s;
  }
  if (*s == '?') {
    char tmp[16];
    snprintf(tmp, sizeof tmp, "%d", last_status);
    buf_adds(b, tmp);
    return s + 1;
  }
  if (*s == '#') {
    char tmp[16];
    snprintf(tmp, sizeof tmp, "%d", npos);
    buf_adds(b, tmp);
    return s + 1;
  }
  if (*s == '$') {
    buf_adds(b, "1");
    return s + 1;
  }
  if (*s >= '0' && *s <= '9') {
    int i = *s - '0';
    buf_adds(b, i == 0 ? arg0 : (i <= npos ? pos[i - 1] : ""));
    return s + 1;
  }
  if (!(isalpha((unsigned char)*s) || *s == '_')) {
    buf_add(b, "$", 1);
    return s;
  }
  const char *start = s;
  while (is_name_char((unsigned char)*s)) s++;
  char *name = xdupn(start, (size_t)(s - start));
  buf_adds(b, var_get(name));
  free(name);
  return s;
}

static char *expand(const char *raw) {
  Buf b = {0};
  const char *s = raw;
  while (*s) {
    if (*s == '\'') {
      s++;
      while (*s && *s != '\'') buf_add(&b, s++, 1);
      if (*s == '\'') s++;
    } else if (*s == '"') {
      s++;
      while (*s && *s != '"') {
        if (*s == '\\' && (s[1] == '$' || s[1] == '"' || s[1] == '\\' || s[1] == '`')) {
          buf_add(&b, s + 1, 1);
          s += 2;
        } else if (*s == '$') {
          s = expand_param(s + 1, &b);
        } else buf_add(&b, s++, 1);
      }
      if (*s == '"') s++;
    } else if (*s == '\\') {
      if (s[1]) {
        buf_add(&b, s + 1, 1);
        s += 2;
      } else s++;
    } else if (*s == '$') {
      s = expand_param(s + 1, &b);
    } else buf_add(&b, s++, 1);
  }
  if (!b.data) b.data = xdup("");
  return b.data;
}

static void skip_hws(void) {
  for (;;) {
    while (P < PEND && (*P == ' ' || *P == '\t' || *P == '\r')) P++;
    if (P + 1 < PEND && P[0] == '\\' && P[1] == '\n') {
      P += 2;
      line_no++;
      continue;
    }
    if (P < PEND && *P == '#') {
      while (P < PEND && *P != '\n') P++;
      continue;
    }
    break;
  }
}

static int op_start(void) {
  if (P >= PEND) return 1;
  char c = *P;
  return c == '|' || c == '&' || c == ';' || c == '<' || c == '>' || c == '\n';
}

static char *lex_word(void) {
  skip_hws();
  if (P >= PEND || op_start()) return NULL;
  size_t cap = 32, n = 0;
  char *buf = xmalloc(cap);
  while (P < PEND && !op_start()) {
    if (*P == ' ' || *P == '\t' || *P == '\r') break;
    char c = *P;
    if (c == '\'' || c == '"') {
      char q = c;
      if (n + 1 >= cap) {
        cap *= 2;
        buf = realloc(buf, cap);
      }
      buf[n++] = *P++;
      while (P < PEND && *P != q) {
        if (*P == '\n') line_no++;
        if (q == '"' && *P == '\\' && P + 1 < PEND) {
          if (n + 2 >= cap) {
            cap *= 2;
            buf = realloc(buf, cap);
          }
          buf[n++] = *P++;
          buf[n++] = *P++;
          continue;
        }
        if (n + 1 >= cap) {
          cap *= 2;
          buf = realloc(buf, cap);
        }
        buf[n++] = *P++;
      }
      if (P < PEND && *P == q) {
        if (n + 1 >= cap) {
          cap *= 2;
          buf = realloc(buf, cap);
        }
        buf[n++] = *P++;
      }
      continue;
    }
    if (c == '\\' && P + 1 < PEND && P[1] == '\n') {
      P += 2;
      line_no++;
      continue;
    }
    if (n + 1 >= cap) {
      cap *= 2;
      buf = realloc(buf, cap);
    }
    if (c == '\\' && P + 1 < PEND) {
      buf[n++] = *P++;
      buf[n++] = *P++;
      continue;
    }
    buf[n++] = *P++;
  }
  buf[n] = 0;
  return buf;
}

static int word_is(const char *raw, const char *kw) {
  return raw && strcmp(raw, kw) == 0;
}

static char *peek_word(void) {
  const char *save = P;
  int save_line = line_no;
  char *w = lex_word();
  P = save;
  line_no = save_line;
  return w;
}

static int peek_is(const char *kw) {
  char *w = peek_word();
  int yes = word_is(w, kw);
  free(w);
  return yes;
}

static void add_word(Word **head, Word **tail, char *raw) {
  Word *w = xmalloc(sizeof(*w));
  w->raw = raw;
  w->next = NULL;
  if (*tail) (*tail)->next = w;
  else *head = w;
  *tail = w;
}

static Node *node_new(NKind k) {
  Node *n = xmalloc(sizeof(*n));
  memset(n, 0, sizeof(*n));
  n->kind = k;
  return n;
}

static int syntax(const char *msg) {
  if (!syntax_error) fprintf(stderr, "shell: line %d: %s\n", line_no, msg);
  syntax_error = 1;
  return -1;
}

static Node *parse_list(const char *stop1, const char *stop2, const char *stop3);

static Node *parse_simple(void) {
  Node *n = node_new(NK_CMD);
  Word *tail = NULL;
  for (;;) {
    skip_hws();
    if (P >= PEND || *P == '\n' || *P == ';' || *P == '|' || *P == '&') break;
    if (*P == '<' || *P == '>') {
      int kind = 2;
      if (*P == '<') kind = 1;
      else if (P + 1 < PEND && P[1] == '>') {
        kind = 3;
        P++;
      }
      P++;
      char *target = lex_word();
      if (!target) {
        syntax("missing redirection target");
        return n;
      }
      Redir *r = xmalloc(sizeof(*r));
      r->kind = kind;
      r->target = target;
      r->next = n->redirs;
      n->redirs = r;
      continue;
    }
    char *w = lex_word();
    if (!w) break;
    if (!n->words && (word_is(w, "if") || word_is(w, "while") || word_is(w, "for") || word_is(w, "then") ||
                      word_is(w, "do") || word_is(w, "done") || word_is(w, "fi") || word_is(w, "else") ||
                      word_is(w, "elif"))) {
      free(w);
      syntax("unexpected keyword");
      return n;
    }
    add_word(&n->words, &tail, w);
  }
  return n;
}

static Node *parse_pipeline(void);

static Node *parse_command(void) {
  skip_hws();
  if (peek_is("if")) {
    free(lex_word());
    Node *n = node_new(NK_IF);
    n->a = parse_list("then", NULL, NULL);
    if (!peek_is("then")) syntax("expected then");
    else free(lex_word());
    n->b = parse_list("else", "elif", "fi");
    Node *tail = n;
    while (peek_is("elif")) {
      free(lex_word());
      Node *e = node_new(NK_IF);
      e->a = parse_list("then", NULL, NULL);
      if (!peek_is("then")) syntax("expected then");
      else free(lex_word());
      e->b = parse_list("else", "elif", "fi");
      tail->c = e;
      tail = e;
    }
    if (peek_is("else")) {
      free(lex_word());
      tail->c = parse_list("fi", NULL, NULL);
    }
    if (!peek_is("fi")) syntax("expected fi");
    else free(lex_word());
    return n;
  }
  if (peek_is("while")) {
    free(lex_word());
    Node *n = node_new(NK_WHILE);
    n->a = parse_list("do", NULL, NULL);
    if (!peek_is("do")) syntax("expected do");
    else free(lex_word());
    n->b = parse_list("done", NULL, NULL);
    if (!peek_is("done")) syntax("expected done");
    else free(lex_word());
    return n;
  }
  if (peek_is("for")) {
    free(lex_word());
    Node *n = node_new(NK_FOR);
    char *name = lex_word();
    if (!name) {
      syntax("expected name after for");
      return n;
    }
    n->name = name;
    char *inw = lex_word();
    if (!word_is(inw, "in")) syntax("expected in");
    free(inw);
    Word *tail = NULL;
    for (;;) {
      skip_hws();
      if (P >= PEND || *P == ';' || *P == '\n') break;
      if (peek_is("do")) break;
      char *w = lex_word();
      if (!w) break;
      add_word(&n->words, &tail, w);
    }
    skip_hws();
    if (P < PEND && (*P == ';' || *P == '\n')) {
      if (*P == '\n') line_no++;
      P++;
    }
    skip_hws();
    while (P < PEND && *P == '\n') {
      P++;
      line_no++;
      skip_hws();
    }
    if (!peek_is("do")) syntax("expected do");
    else free(lex_word());
    n->b = parse_list("done", NULL, NULL);
    if (!peek_is("done")) syntax("expected done");
    else free(lex_word());
    return n;
  }
  return parse_simple();
}

static Node *parse_pipeline(void) {
  Node *left = parse_command();
  for (;;) {
    skip_hws();
    if (P + 1 < PEND && P[0] == '|' && P[1] == '|') break;
    if (P < PEND && *P == '|') {
      P++;
      Node *right = parse_command();
      Node *p = node_new(NK_PIPE);
      p->a = left;
      p->b = right;
      left = p;
      continue;
    }
    break;
  }
  return left;
}

static Node *parse_andor(void) {
  Node *left = parse_pipeline();
  for (;;) {
    skip_hws();
    int op = 0;
    if (P + 1 < PEND && P[0] == '&' && P[1] == '&') op = '&';
    else if (P + 1 < PEND && P[0] == '|' && P[1] == '|') op = '|';
    else break;
    P += 2;
    Node *right = parse_pipeline();
    Node *b = node_new(NK_BIN);
    b->op = op;
    b->a = left;
    b->b = right;
    left = b;
  }
  return left;
}

static void skip_separators(void) {
  for (;;) {
    skip_hws();
    if (P < PEND && *P == ';') {
      P++;
      continue;
    }
    if (P < PEND && *P == '\n') {
      P++;
      line_no++;
      continue;
    }
    break;
  }
}

static Node *parse_list(const char *stop1, const char *stop2, const char *stop3) {
  skip_separators();
  if (P >= PEND) return NULL;
  if ((stop1 && peek_is(stop1)) || (stop2 && peek_is(stop2)) || (stop3 && peek_is(stop3))) return NULL;
  Node *left = parse_andor();
  for (;;) {
    const char *save = P;
    int save_line = line_no;
    skip_hws();
    if (!(P < PEND && (*P == ';' || *P == '\n'))) {
      P = save;
      line_no = save_line;
      break;
    }
    skip_separators();
    if (P >= PEND) break;
    if ((stop1 && peek_is(stop1)) || (stop2 && peek_is(stop2)) || (stop3 && peek_is(stop3))) break;
    Node *right = parse_andor();
    Node *s = node_new(NK_BIN);
    s->op = ';';
    s->a = left;
    s->b = right;
    left = s;
  }
  return left;
}

static int ident_assign(const char *raw, char **name, char **value) {
  if (!raw || !(isalpha((unsigned char)raw[0]) || raw[0] == '_')) return 0;
  if (strchr(raw, '\'') || strchr(raw, '"') || raw[0] == '\\') return 0;
  const char *eq = strchr(raw, '=');
  if (!eq || eq == raw) return 0;
  for (const char *s = raw; s < eq; s++)
    if (!is_name_char((unsigned char)*s)) return 0;
  *name = xdupn(raw, (size_t)(eq - raw));
  *value = expand(eq + 1);
  return 1;
}

static int exec_node(Node *n, In *in, Out *out);

static int run_echo(char **argv, int argc, Out *out) {
  int nl = 1, i = 1;
  if (i < argc && strcmp(argv[i], "-n") == 0) {
    nl = 0;
    i++;
  }
  for (int k = i; k < argc; k++) {
    if (k > i) out_put(out, " ", 1);
    out_puts(out, argv[k]);
  }
  if (nl) out_put(out, "\n", 1);
  return 0;
}

static int run_printf(char **argv, int argc, Out *out) {
  if (argc < 2) {
    fprintf(stderr, "shell: printf: missing format\n");
    return 2;
  }
  const char *fmt = argv[1];
  int ai = 2;
  while (*fmt) {
    if (*fmt == '\\') {
      fmt++;
      char c = *fmt ? *fmt++ : '\\';
      if (c == 'n') out_put(out, "\n", 1);
      else if (c == 't') out_put(out, "\t", 1);
      else if (c == 'r') out_put(out, "\r", 1);
      else {
        char ch = c;
        out_put(out, &ch, 1);
      }
      continue;
    }
    if (*fmt != '%') {
      out_put(out, fmt++, 1);
      continue;
    }
    fmt++;
    if (*fmt == '%') {
      out_put(out, "%", 1);
      fmt++;
      continue;
    }
    if (*fmt == 's' || *fmt == 'd') {
      const char *arg = ai < argc ? argv[ai++] : "";
      if (*fmt == 's') out_puts(out, arg);
      else {
        char tmp[32];
        snprintf(tmp, sizeof tmp, "%ld", strtol(arg, NULL, 10));
        out_puts(out, tmp);
      }
      fmt++;
      continue;
    }
    out_put(out, "%", 1);
  }
  return 0;
}

static int run_test(char **argv, int argc, int bracket) {
  int n = argc - 1;
  char **a = argv + 1;
  if (bracket) {
    if (n == 0 || strcmp(a[n - 1], "]") != 0) {
      fprintf(stderr, "shell: [: missing ]\n");
      return 2;
    }
    n--;
  }
  if (n == 0) return 1;
  if (n == 1) return a[0][0] ? 0 : 1;
  if (n == 2 && strcmp(a[0], "-z") == 0) return a[1][0] ? 1 : 0;
  if (n == 2 && strcmp(a[0], "-n") == 0) return a[1][0] ? 0 : 1;
  if (n == 3) {
    if (strcmp(a[1], "=") == 0) return strcmp(a[0], a[2]) == 0 ? 0 : 1;
    if (strcmp(a[1], "!=") == 0) return strcmp(a[0], a[2]) != 0 ? 0 : 1;
    long x = strtol(a[0], NULL, 10);
    long y = strtol(a[2], NULL, 10);
    int ok = 0;
    if (strcmp(a[1], "-eq") == 0) ok = x == y;
    else if (strcmp(a[1], "-ne") == 0) ok = x != y;
    else if (strcmp(a[1], "-lt") == 0) ok = x < y;
    else if (strcmp(a[1], "-le") == 0) ok = x <= y;
    else if (strcmp(a[1], "-gt") == 0) ok = x > y;
    else if (strcmp(a[1], "-ge") == 0) ok = x >= y;
    else {
      fprintf(stderr, "shell: test: unknown operator %s\n", a[1]);
      return 2;
    }
    return ok ? 0 : 1;
  }
  fprintf(stderr, "shell: test: unsupported expression\n");
  return 2;
}

static int copy_in(In *in, Out *out) {
  char buf[512];
  size_t n = 0;
  for (;;) {
    int c = in_getc(in);
    if (c == EOF) break;
    buf[n++] = (char)c;
    if (n == sizeof buf) {
      out_put(out, buf, n);
      n = 0;
    }
  }
  if (n) out_put(out, buf, n);
  return 0;
}

static int run_cat(char **argv, int argc, In *in, Out *out) {
  if (argc == 1) return copy_in(in, out);
  for (int i = 1; i < argc; i++) {
    FILE *fp = fopen(argv[i], "rb");
    if (!fp) {
      fprintf(stderr, "shell: cat: %s: %s\n", argv[i], strerror(errno));
      return 1;
    }
    char buf[512];
    size_t n;
    while ((n = fread(buf, 1, sizeof buf, fp)) > 0) out_put(out, buf, n);
    fclose(fp);
  }
  return 0;
}

static int exec_simple(Node *n, In *in, Out *out) {
  char *exp_store[64];
  char *argv[64];
  int argc = 0;
  int assign_only = 1;
  for (Word *w = n->words; w; w = w->next) {
    char *name = NULL, *value = NULL;
    if (assign_only && ident_assign(w->raw, &name, &value)) {
      var_set(name, value);
      free(name);
      free(value);
      continue;
    }
    assign_only = 0;
    if (argc >= 63) break;
    exp_store[argc] = expand(w->raw);
    argv[argc] = exp_store[argc];
    argc++;
  }
  argv[argc] = NULL;
  if (argc == 0) return 0;

  In lin = *in;
  Out file_out;
  Out *dest = out;
  int replaced_in = 0;
  FILE *opened_in = NULL, *opened_out = NULL;
  for (Redir *r = n->redirs; r; r = r->next) {
    char *path = expand(r->target);
    if (r->kind == 1) {
      FILE *fp = fopen(path, "rb");
      if (!fp) {
        fprintf(stderr, "shell: %s: %s\n", path, strerror(errno));
        free(path);
        for (int i = 0; i < argc; i++) free(exp_store[i]);
        return 1;
      }
      memset(&lin, 0, sizeof lin);
      lin.kind = 2;
      lin.fp = fp;
      replaced_in = 1;
      if (opened_in) fclose(opened_in);
      opened_in = fp;
    } else {
      FILE *fp = fopen(path, r->kind == 3 ? "ab" : "wb");
      if (!fp) {
        fprintf(stderr, "shell: %s: %s\n", path, strerror(errno));
        free(path);
        for (int i = 0; i < argc; i++) free(exp_store[i]);
        return 1;
      }
      memset(&file_out, 0, sizeof file_out);
      file_out.kind = 2;
      file_out.fp = fp;
      dest = &file_out;
      if (opened_out) fclose(opened_out);
      opened_out = fp;
    }
    free(path);
  }

  int st = 0;
  const char *cmd = argv[0];
  if (strcmp(cmd, "echo") == 0) st = run_echo(argv, argc, dest);
  else if (strcmp(cmd, "printf") == 0) st = run_printf(argv, argc, dest);
  else if (strcmp(cmd, ":") == 0 || strcmp(cmd, "true") == 0) st = 0;
  else if (strcmp(cmd, "false") == 0) st = 1;
  else if (strcmp(cmd, "exit") == 0) {
    int code = argc >= 2 ? (int)strtol(argv[1], NULL, 10) : last_status;
    exit(code);
  }
  else if (strcmp(cmd, "read") == 0) {
    char *line = NULL;
    int eof = in_line(&lin, &line);
    if (eof) st = 1;
    else {
      if (argc >= 2) var_set(argv[1], line);
      st = 0;
    }
    free(line);
  } else if (strcmp(cmd, "cat") == 0) st = run_cat(argv, argc, &lin, dest);
  else if (strcmp(cmd, "test") == 0) st = run_test(argv, argc, 0);
  else if (strcmp(cmd, "[") == 0) st = run_test(argv, argc, 1);
  else {
    fprintf(stderr, "shell: %s: external commands are not available (no fork)\n", cmd);
    st = 127;
  }
  if (!replaced_in && in->kind == 1) in->pos = lin.pos;
  if (opened_in) fclose(opened_in);
  if (opened_out) fclose(opened_out);
  for (int i = 0; i < argc; i++) free(exp_store[i]);
  return st;
}

static int exec_node(Node *n, In *in, Out *out) {
  if (!n) return 0;
  if (n->kind == NK_CMD) return exec_simple(n, in, out);
  if (n->kind == NK_BIN) {
    int st = exec_node(n->a, in, out);
    last_status = st;
    if (n->op == '&' && st != 0) return st;
    if (n->op == '|' && st == 0) return st;
    st = exec_node(n->b, in, out);
    return st;
  }
  if (n->kind == NK_PIPE) {
    Out cap = {0};
    cap.kind = 1;
    int st = exec_node(n->a, in, &cap);
    last_status = st;
    In feed = {0};
    feed.kind = 1;
    feed.mem = cap.mem ? cap.mem : "";
    feed.len = cap.len;
    st = exec_node(n->b, &feed, out);
    free(cap.mem);
    return st;
  }
  if (n->kind == NK_IF) {
    int st = exec_node(n->a, in, out);
    last_status = st;
    st = exec_node(st == 0 ? n->b : n->c, in, out);
    return st;
  }
  if (n->kind == NK_WHILE) {
    int st = 0;
    int spins = 0;
    for (;;) {
      if (++spins > 100000) {
        fprintf(stderr, "shell: too many loop iterations\n");
        return 1;
      }
      int c = exec_node(n->a, in, out);
      last_status = c;
      if (c != 0) break;
      st = exec_node(n->b, in, out);
      last_status = st;
    }
    return st;
  }
  if (n->kind == NK_FOR) {
    char *name = expand(n->name);
    int st = 0;
    if (!n->words) {
      for (int i = 0; i < npos; i++) {
        var_set(name, pos[i]);
        st = exec_node(n->b, in, out);
        last_status = st;
      }
    } else {
      for (Word *w = n->words; w; w = w->next) {
        char *val = expand(w->raw);
        var_set(name, val);
        free(val);
        st = exec_node(n->b, in, out);
        last_status = st;
      }
    }
    free(name);
    return st;
  }
  return 0;
}

static char *read_file(const char *path, size_t *len) {
  FILE *fp = fopen(path, "rb");
  if (!fp) {
    fprintf(stderr, "shell: %s: %s\n", path, strerror(errno));
    return NULL;
  }
  char *buf = xmalloc(MAX_SCRIPT + 1);
  size_t n = fread(buf, 1, MAX_SCRIPT + 1, fp);
  fclose(fp);
  if (n > MAX_SCRIPT) {
    fprintf(stderr, "shell: script is too large\n");
    free(buf);
    return NULL;
  }
  buf[n] = 0;
  *len = n;
  return buf;
}

int main(int argc, char **argv) {
  if (argc < 2) {
    fprintf(stderr, "shell: usage: shell script\n");
    return 2;
  }
  arg0 = argv[1];
  npos = 0;
  for (int i = 2; i < argc && npos < 64; i++) pos[npos++] = argv[i];
  size_t len = 0;
  char *src = read_file(argv[1], &len);
  if (!src) return 127;
  P = src;
  PEND = src + len;
  line_no = 1;
  Node *prog = parse_list(NULL, NULL, NULL);
  skip_separators();
  if (syntax_error) return 2;
  if (P < PEND) {
    fprintf(stderr, "shell: line %d: unexpected token\n", line_no);
    return 2;
  }
  In in = {0};
  Out out = {0};
  int st = exec_node(prog, &in, &out);
  fflush(stdout);
  fflush(stderr);
  return st;
}

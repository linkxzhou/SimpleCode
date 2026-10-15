import { book } from "./rich.mjs";

const links = `- [Beej's Guide to C Programming](https://beej.us/guide/bgc/)（仅链接）
- [Modern C](https://gustedt.gitlabpages.inria.fr/modern-c/)（仅链接）
- [learn-c.org](https://www.learn-c.org/)（仅链接）`;
const credit = "正文为原创。知识点范围参考了 Beej's Guide to C、Modern C 与 learn-c.org，没有逐字搬用原文。";

const s = (title, code, expect, extra = {}) => ({ title, code, expect, ...extra });
const tail = { links, credit };

const chapters = [
  {
    chapter: 0,
    slug: "index",
    title: "概览：C 在这个抽屉里",
    goals: ["写出能编译的 main", "用 printf 看见结果", "知道警告会让编译失败"],
    prose: `C 在这里先由 clang 编译成 wasm，再运行编译结果。点代码块上的 Run，编辑器里的单文件会经过编译和链接。警告当成错误，未使用的变量、格式不对的 printf 都会让这次运行失败。

每次运行都是新进程。没有线程，没有网络，也没有第二份源文件。程序从 main 开始，main 返回 int。要核对的文字用 printf 打到标准输出，并自己写换行。

期望是输出里的子串。编译失败时终端里是诊断，不是你 printf 的那句话。`,
    samples: [
      s("只读", "/* 没有线程，也不要在可运行示例里访问网络。\n   警告会让编译失败，不要留未使用的变量。 */", "", { norun: true }),
      s("相加", "#include <stdio.h>\nint main(void) {\n  printf(\"%d\\n\", 19 + 23);\n  return 0;\n}", "42"),
      s("问候", "#include <stdio.h>\nint main(void) {\n  printf(\"%s\\n\", \"你好\");\n  return 0;\n}", "你好"),
    ],
    mistakes: [
      "留下声明了却没用的变量，编译被 -Werror 拦住。",
      "printf 忘了 \\n，下一行结果粘在一起。",
      "main 不返回 int，或走到末尾却没有 return。",
    ],
    practices: [
      "每个示例都是一份能单独编译的完整程序。",
      "格式串用字面量，参数类型和 %d、%s 对齐。",
      "做不到的事用只读块标出来。",
    ],
    summary: "C 101 的例子经 clang 编译后运行。main 返回 int，结果靠 printf。警告就是失败。",
    exercises: [
      { title: "参考答案：语言名", prompt: "打印一行 C。", code: "#include <stdio.h>\nint main(void) {\n  printf(\"%s\\n\", \"C\");\n  return 0;\n}", expect: "C" },
      { title: "参考答案：乘积", prompt: "打印 6 和 7 的乘积。", code: "#include <stdio.h>\nint main(void) {\n  printf(\"%d\\n\", 6 * 7);\n  return 0;\n}", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 1,
    slug: "hello",
    title: "printf 与 main",
    level: "beginner",
    goals: ["用 printf 打出文本和数字", "写出注释", "让 main 返回 0"],
    prose: `程序从 main 进入。写成 int main(void)，表示不读取参数，结束时返回一个 int。return 0 表示这次按我们的约定成功。

printf 的第一个参数是格式串。%d 配 int，%s 配以空字符结尾的字符串。格式串里的 \\n 是换行。普通字符会原样打出。参数个数必须和格式说明一样多，否则编译失败。

注释用 /* */。注释不会出现在输出里。注释写错不会让编译失败，却会让你按错误的说明去改对的代码。`,
    samples: [
      s("两行", "#include <stdio.h>\nint main(void) {\n  printf(\"%s\\n\", \"Ada\");\n  printf(\"%s\\n\", \"Lovelace\");\n  return 0;\n}", "Ada"),
      s("同一行", "#include <stdio.h>\nint main(void) {\n  printf(\"%s\", \"A\");\n  printf(\"%s\\n\", \"B\");\n  return 0;\n}", "AB"),
      s("注释", "#include <stdio.h>\nint main(void) {\n  printf(\"%s\\n\", \"可见\");\n  /* 这一行不会出现 */\n  printf(\"%d\\n\", 2026);\n  return 0;\n}", "可见"),
    ],
    mistakes: [
      "把 %d 配给字符串，或把 %s 配给 int。",
      "格式串里少写一个说明，多传了一个参数。",
      "注释里写了和代码相反的话。",
    ],
    practices: [
      "一次 printf 对应一行需要核对的输出。",
      "格式串保持字面量。",
      "main 的每条路径都 return。",
    ],
    summary: "main 返回 int。printf 用格式串决定怎么打印。\\n 负责换行，注释不会进入输出。",
    exercises: [
      { title: "参考答案：两行数字", prompt: "打印 1 和 2，各占一行。", code: "#include <stdio.h>\nint main(void) {\n  printf(\"%d\\n\", 1);\n  printf(\"%d\\n\", 2);\n  return 0;\n}", expect: "1" },
      { title: "参考答案：连在一起", prompt: "打印 AB，中间不换行。", code: "#include <stdio.h>\nint main(void) {\n  printf(\"%s\", \"A\");\n  printf(\"%s\\n\", \"B\");\n  return 0;\n}", expect: "AB" },
    ],
    ...tail,
  },
  {
    chapter: 2,
    slug: "types",
    title: "类型与运算",
    level: "beginner",
    goals: ["区分整数除法和余数", "给变量一个用得到的类型", "知道 char 数组以空字符结尾"],
    prose: `整数相除仍是整数，小数部分直接丢掉。20 / 6 得到 3，余数用 %，20 % 6 得到 2。需要小数时用 double，并在 printf 里用 %f 或先把结果收成你能核对的整数。

变量要先声明再使用。声明了却从不用，编译会失败。所以示例里每个变量都参与 printf 或运算。int 够放下本教程的小整数。不要为了「以后可能用」先声明一串。

字符串字面量的类型是以空字符结尾的字符序列。strlen 数的是字节，不是你看到的字数。英文 "Ada" 是 3。中文「你好」在 UTF-8 里是 6 个字节。打印长度时用 %d，并把 strlen 的结果转成 int，避免格式警告。`,
    samples: [
      s("整除", "#include <stdio.h>\nint main(void) {\n  printf(\"%d\\n\", 20 / 6);\n  printf(\"%d\\n\", 20 % 6);\n  return 0;\n}", "3"),
      s("长度", "#include <stdio.h>\n#include <string.h>\nint main(void) {\n  printf(\"%d\\n\", (int)strlen(\"Ada\"));\n  printf(\"%d\\n\", (int)strlen(\"你好\"));\n  return 0;\n}", "3"),
      s("相加", "#include <stdio.h>\nint main(void) {\n  int a = 20;\n  int b = 22;\n  printf(\"%d\\n\", a + b);\n  return 0;\n}", "42"),
    ],
    mistakes: [
      "以为 20 / 6 会得到带小数的结果。",
      "把 strlen(\"你好\") 理解成 2。它数的是字节。",
      "声明了变量却没用，被警告拦住。",
    ],
    practices: [
      "要整数商时确认两边都是整数。",
      "讲中文长度时写明是字节。",
      "每个局部变量都参与结果。",
    ],
    summary: "整数相除丢掉小数，余数用 %。strlen 按字节计数。没用到的变量不能留在 -Werror 的程序里。",
    exercises: [
      { title: "参考答案：商", prompt: "打印 17 除以 5 的整数商。", code: "#include <stdio.h>\nint main(void) {\n  printf(\"%d\\n\", 17 / 5);\n  return 0;\n}", expect: "3" },
      { title: "参考答案：和", prompt: "把 19 和 23 放进变量再相加打印。", code: "#include <stdio.h>\nint main(void) {\n  int a = 19;\n  int b = 23;\n  printf(\"%d\\n\", a + b);\n  return 0;\n}", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 3,
    slug: "control",
    title: "分支与循环",
    level: "beginner",
    goals: ["用 if 和 else 分支", "用 for 做有限次数", "写出能停下来的循环"],
    prose: `if 的条件为 0 时走 else，其他值都走 if。这和 Ruby 相反：在 C 里 0 是假。比较用 ==，赋值用 =。写成 if (n = 0) 是赋值，值是 0，分支总走 else，而且常常不是你想做的事。

for 适合次数清楚的循环。先写出每一轮哪一个变量在靠近结束。while 也一样。说不出靠近结束的量，就先别运行。死循环会占住运行，页面上需要停止之后才能跑下一例。

循环里累加时，把总和初始化为 0。忘了初始化就去读，是未定义行为，本教程不写。`,
    samples: [
      s("奇数和", "#include <stdio.h>\nint main(void) {\n  int total = 0;\n  for (int n = 1; n <= 5; n++) {\n    if (n % 2 == 1) total += n;\n  }\n  printf(\"%d\\n\", total);\n  return 0;\n}", "9"),
      s("数到三", "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  while (n < 3) n += 1;\n  printf(\"%d\\n\", n);\n  return 0;\n}", "3"),
      s("零是假", "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  if (n) printf(\"%s\\n\", \"yes\");\n  else printf(\"%s\\n\", \"no\");\n  return 0;\n}", "no"),
    ],
    mistakes: [
      "把 == 写成 =。",
      "循环里不改变条件用到的变量。",
      "总和没有先写成 0 就累加。",
    ],
    practices: [
      "知道次数时用 for。",
      "条件里需要比较时写 ==。",
      "循环变量的结束条件写在循环头上。",
    ],
    summary: "0 是假，其余数字是真。for 和 while 都必须有变量靠近结束。比较用 ==。",
    exercises: [
      { title: "参考答案：一到四", prompt: "把 1 到 4 加起来并打印。包含 4。", code: "#include <stdio.h>\nint main(void) {\n  int total = 0;\n  for (int n = 1; n <= 4; n++) total += n;\n  printf(\"%d\\n\", total);\n  return 0;\n}", expect: "10" },
      { title: "参考答案：三次", prompt: "从 0 开始加三次，打印结果。", code: "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  for (int i = 0; i < 3; i++) n += 1;\n  printf(\"%d\\n\", n);\n  return 0;\n}", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 4,
    slug: "functions",
    title: "函数",
    level: "intermediate",
    goals: ["把计算写成函数", "用参数传入、用返回值传出", "在调用之前看见声明"],
    prose: `函数把一段计算命名。参数是输入，返回值是输出。调用处要能看见函数的声明或定义，所以本教程把被调用的函数写在 main 上面。

C 按值传递。函数里给参数赋值，不会改调用者的变量。要改调用者的对象，传指针，那是后面一章的事。这一章的函数只返回一个 int。

函数如果写了却没人调用，可能被当成未使用。示例里每个函数都从 main 调用，并把返回值打印出来。不要依赖没有 printf 的返回值自己出现在终端。`,
    samples: [
      s("相加", "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n  printf(\"%d\\n\", add(41, 1));\n  return 0;\n}", "42"),
      s("两倍", "#include <stdio.h>\nint twice(int n) { return n * 2; }\nint main(void) {\n  printf(\"%d\\n\", twice(21));\n  return 0;\n}", "42"),
      s("奇数", "#include <stdio.h>\nint odd(int n) { return n % 2 == 1; }\nint main(void) {\n  int total = 0;\n  for (int n = 1; n <= 5; n++) if (odd(n)) total += n;\n  printf(\"%d\\n\", total);\n  return 0;\n}", "9"),
    ],
    mistakes: [
      "在定义之前调用，又没有事先声明。",
      "以为改了参数就会改到调用者的变量。",
      "函数有返回值，main 里却不接收也不打印。",
    ],
    practices: [
      "被调用的函数写在 main 前面。",
      "要给调用者的结果用 return。",
      "main 里 printf 这个返回值。",
    ],
    summary: "函数用参数接收、用 return 交回。传递的是值。终端只看见 printf，不看见返回值本身。",
    exercises: [
      { title: "参考答案：平方", prompt: "写函数返回参数的平方，用 6 调用并打印。", code: "#include <stdio.h>\nint sq(int n) { return n * n; }\nint main(void) {\n  printf(\"%d\\n\", sq(6));\n  return 0;\n}", expect: "36" },
      { title: "参考答案：较大", prompt: "写函数返回两个数里较大的一个，打印 3 和 9 的结果。", code: "#include <stdio.h>\nint larger(int a, int b) { return a > b ? a : b; }\nint main(void) {\n  printf(\"%d\\n\", larger(3, 9));\n  return 0;\n}", expect: "9" },
    ],
    ...tail,
  },
  {
    chapter: 5,
    slug: "arrays",
    title: "数组与字符串",
    level: "intermediate",
    goals: ["用下标访问数组", "知道数组长度要自己记", "按空字符处理字符串"],
    prose: `数组的下标从 0 开始。元素个数不会存在数组里，循环的上限要你自己写对。多走一格是越界，本教程的循环上限写成初始化时的个数。

字符数组如果要当字符串用，最后要有 '\\0'。字面量 "Ada" 已经带上。自己逐个填字符时，别忘了结尾。strlen 停在第一个空字符，不会数出你分配的容量。

数组作为参数时，函数只拿到指向第一个元素的指针，仍然不知道长度。把长度用另一个 int 传进去。`,
    samples: [
      s("求和", "#include <stdio.h>\nint main(void) {\n  int a[] = {1, 2, 3, 4};\n  int total = 0;\n  for (int i = 0; i < 4; i++) total += a[i];\n  printf(\"%d\\n\", total);\n  return 0;\n}", "10"),
      s("前四个", "#include <stdio.h>\nint main(void) {\n  const char *s = \"SimpleCode\";\n  printf(\"%c%c%c%c\\n\", s[0], s[1], s[2], s[3]);\n  return 0;\n}", "Simp"),
      s("带长度", "#include <stdio.h>\nint sum(const int *a, int n) {\n  int total = 0;\n  for (int i = 0; i < n; i++) total += a[i];\n  return total;\n}\nint main(void) {\n  int a[] = {1, 2, 3};\n  printf(\"%d\\n\", sum(a, 3));\n  return 0;\n}", "6"),
    ],
    mistakes: [
      "用一个不存在的 length 字段当上限。",
      "字符数组忘了 '\\0'，strlen 一直读下去。",
      "函数参数写成数组，却以为能在函数里得到元素个数。",
    ],
    practices: [
      "循环上限写成你初始化的个数。",
      "把数组交给函数时同时交长度。",
      "字符串字面量优先，少手写结尾。",
    ],
    summary: "数组下标从 0 开始，长度要另记。字符串停在空字符。函数参数里的数组只是指针加你传入的长度。",
    exercises: [
      { title: "参考答案：三个", prompt: "把 {3, 1, 2} 里的最小值打印出来。", code: "#include <stdio.h>\nint main(void) {\n  int a[] = {3, 1, 2};\n  int m = a[0];\n  for (int i = 1; i < 3; i++) if (a[i] < m) m = a[i];\n  printf(\"%d\\n\", m);\n  return 0;\n}", expect: "1" },
      { title: "参考答案：字节", prompt: "打印 Simple 的字节数。", code: "#include <stdio.h>\n#include <string.h>\nint main(void) {\n  printf(\"%d\\n\", (int)strlen(\"Simple\"));\n  return 0;\n}", expect: "6" },
    ],
    ...tail,
  },
  {
    chapter: 6,
    slug: "pointers",
    title: "指针",
    level: "intermediate",
    goals: ["用 & 取地址、用 * 取值", "通过指针改调用者的变量", "不使用没有指向对象的指针"],
    prose: `指针保存地址。& 取一个对象的地址，* 顺着地址读或写那个对象。类型写成 int *p，表示 p 指向 int。

函数要修改调用者的 int，就接收 int *。调用时传入 &变量。函数里写 *p = ...。这是输出参数。返回值仍然可以同时用来表示成功或失败，这一章只演示修改。

没有指向有效对象的指针不能解引用。示例里的指针都来自 &局部变量，或者指向数组元素。不写空指针解引用。`,
    samples: [
      s("读", "#include <stdio.h>\nint main(void) {\n  int n = 42;\n  int *p = &n;\n  printf(\"%d\\n\", *p);\n  return 0;\n}", "42"),
      s("改", "#include <stdio.h>\nvoid inc(int *p) { *p += 1; }\nint main(void) {\n  int n = 41;\n  inc(&n);\n  printf(\"%d\\n\", n);\n  return 0;\n}", "42"),
      s("交换", "#include <stdio.h>\nvoid swap(int *a, int *b) {\n  int t = *a;\n  *a = *b;\n  *b = t;\n}\nint main(void) {\n  int x = 1;\n  int y = 2;\n  swap(&x, &y);\n  printf(\"%d\\n\", x);\n  return 0;\n}", "2"),
    ],
    mistakes: [
      "调用 inc(n) 却忘了 &，类型对不上。",
      "解引用一个没有赋值的指针。",
      "把 * 只理解成乘法，写 *p += 1 时看错。",
    ],
    practices: [
      "指针在解引用之前指向一个还活着的对象。",
      "要改调用者的变量就传地址。",
      "局部变量的地址不要从函数里返回。本教程不返回指向局部变量的指针。",
    ],
    summary: "& 取地址，* 访问那个对象。通过指针，函数可以改调用者的变量。指针必须指向还有效的对象。",
    exercises: [
      { title: "参考答案：加一", prompt: "通过指针把 41 加一后打印。", code: "#include <stdio.h>\nint main(void) {\n  int n = 41;\n  int *p = &n;\n  *p += 1;\n  printf(\"%d\\n\", n);\n  return 0;\n}", expect: "42" },
      { title: "参考答案：写入", prompt: "写函数把指针指向的 int 设为 7，打印它。", code: "#include <stdio.h>\nvoid set7(int *p) { *p = 7; }\nint main(void) {\n  int n = 0;\n  set7(&n);\n  printf(\"%d\\n\", n);\n  return 0;\n}", expect: "7" },
    ],
    ...tail,
  },
  {
    chapter: 7,
    slug: "structs",
    title: "结构体",
    level: "intermediate",
    goals: ["把相关的数据放进 struct", "用 . 和 -> 访问字段", "按值传递和按指针传递"],
    prose: `struct 把几个字段放在一个名字下。字段用 . 访问。若你手里是指向结构体的指针，用 ->。

按值传给函数时，函数拿到的是副本，改副本不影响调用者。要改调用者的结构体，传指针。读取一个小结构体时，按值传递更直接，本教程的宽度只有一个 int。

结构体本身没有「方法」。操作写成接收结构体或指针的函数，放在结构体定义下面。初始化时把每个字段都写上，避免读到没有赋值的字段。`,
    samples: [
      s("两倍宽", "#include <stdio.h>\nstruct Line { int width; };\nint span(struct Line line) { return line.width * 2; }\nint main(void) {\n  struct Line line = {5};\n  printf(\"%d\\n\", span(line));\n  return 0;\n}", "10"),
      s("改字段", "#include <stdio.h>\nstruct Line { int width; };\nvoid widen(struct Line *line) { line->width += 1; }\nint main(void) {\n  struct Line line = {41};\n  widen(&line);\n  printf(\"%d\\n\", line.width);\n  return 0;\n}", "42"),
      s("两个字段", "#include <stdio.h>\nstruct Pair { int a; int b; };\nint main(void) {\n  struct Pair p = {19, 23};\n  printf(\"%d\\n\", p.a + p.b);\n  return 0;\n}", "42"),
    ],
    mistakes: [
      "对指针使用 . ，或对对象使用 ->。",
      "按值传入后修改，以为调用者会看见。",
      "字段没有初始化就打印。",
    ],
    practices: [
      "初始化时列出要用的字段。",
      "只读用按值或 const 指针，要改用指针。",
      "函数名写出它做的事，结构体名写出它是什么。",
    ],
    summary: "结构体用字段聚合数据。. 用于对象，-> 用于指针。按值传递不会改到调用者。",
    exercises: [
      { title: "参考答案：和", prompt: "定义有一个 int 字段 n 的结构体，打印 41 加 1。", code: "#include <stdio.h>\nstruct Num { int n; };\nint main(void) {\n  struct Num num = {41};\n  printf(\"%d\\n\", num.n + 1);\n  return 0;\n}", expect: "42" },
      { title: "参考答案：名字长度", prompt: "结构体里放一个字符串指针，打印 Ada 的字节数。", code: "#include <stdio.h>\n#include <string.h>\nstruct Unit { const char *name; };\nint main(void) {\n  struct Unit u = {\"Ada\"};\n  printf(\"%d\\n\", (int)strlen(u.name));\n  return 0;\n}", expect: "3" },
    ],
    ...tail,
  },
  {
    chapter: 8,
    slug: "scanf",
    title: "scanf",
    level: "advanced",
    goals: ["用 scanf 读入一个整数", "检查返回值", "失败时不要使用那个变量"],
    prose: `scanf 从标准输入按格式读。%d 读一个 int，参数必须是 int *，所以写 &n。返回值是成功转换的项数。读一个数时期望返回 1。返回 0 或 EOF 时，n 里的值不能拿来当用户输入。

示例在文档里带上标准输入，测试会把这几个字符送进去并结束输入。你自己在终端跑，就要亲手键入。格式串里不要随便加空格和多余的文字，否则输入必须逐字匹配。

读完再计算。不要在 scanf 没成功时 printf 一个碰巧的旧值。先把 n 设成 0，失败时打印固定的词「失败」，成功时打印算好的数。`,
    samples: [
      s("加一", "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  if (scanf(\"%d\", &n) != 1) {\n    printf(\"%s\\n\", \"失败\");\n    return 0;\n  }\n  printf(\"%d\\n\", n + 1);\n  return 0;\n}", "42", { stdin: "41\n" }),
      s("两个数", "#include <stdio.h>\nint main(void) {\n  int a = 0;\n  int b = 0;\n  if (scanf(\"%d %d\", &a, &b) != 2) {\n    printf(\"%s\\n\", \"失败\");\n    return 0;\n  }\n  printf(\"%d\\n\", a + b);\n  return 0;\n}", "42", { stdin: "20 22\n" }),
      s("不是数字", "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  if (scanf(\"%d\", &n) != 1) printf(\"%s\\n\", \"失败\");\n  else printf(\"%d\\n\", n);\n  return 0;\n}", "失败", { stdin: "no\n" }),
    ],
    mistakes: [
      "scanf 的参数写成 n 而不是 &n。",
      "不看返回值，输入不是数字时仍打印 n。",
      "格式串里多写了必须匹配的文字。",
    ],
    practices: [
      "每个要读的数都检查转换个数。",
      "失败时打印固定的短词。",
      "文档示例写上 stdin，让结果可重复。",
    ],
    summary: "scanf 需要地址，并用返回值说明读入了几项。没读到就不要使用那个变量。",
    exercises: [
      { title: "参考答案：两倍", prompt: "读入一个整数，打印它的两倍。输入是 21。", code: "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  if (scanf(\"%d\", &n) != 1) return 1;\n  printf(\"%d\\n\", n * 2);\n  return 0;\n}", expect: "42", stdin: "21\n" },
      { title: "参考答案：失败", prompt: "读入失败时打印失败。输入是 x。", code: "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  if (scanf(\"%d\", &n) != 1) printf(\"%s\\n\", \"失败\");\n  return 0;\n}", expect: "失败", stdin: "x\n" },
    ],
    ...tail,
  },
  {
    chapter: 9,
    slug: "malloc",
    title: "malloc",
    level: "advanced",
    goals: ["按字节数分配", "检查 NULL", "用完 free"],
    prose: `malloc 向运行时要一块内存，参数是字节数。sizeof *p 让字节数跟着指针的类型走，比手写 sizeof(int) 更不容易和类型脱节。失败时返回 NULL，必须先判断再写入。

这块内存不会在函数返回时自动消失。用完 free。free 之后不再使用这块地址。本教程不 free 两次，也不 free 栈上的变量。

分配一个 int 只是为了看清配对。能放在栈上的小对象不必 malloc。当个数来自输入、编译时还不知道时，再考虑堆。`,
    samples: [
      s("一个数", "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n  int *p = malloc(sizeof *p);\n  if (!p) return 1;\n  *p = 42;\n  printf(\"%d\\n\", *p);\n  free(p);\n  return 0;\n}", "42"),
      s("三个", "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n  int *a = malloc(sizeof *a * 3);\n  if (!a) return 1;\n  a[0] = 1;\n  a[1] = 2;\n  a[2] = 3;\n  printf(\"%d\\n\", a[0] + a[1] + a[2]);\n  free(a);\n  return 0;\n}", "6"),
      s("清零", "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n  int *p = calloc(1, sizeof *p);\n  if (!p) return 1;\n  printf(\"%d\\n\", *p + 42);\n  free(p);\n  return 0;\n}", "42"),
    ],
    mistakes: [
      "不检查 NULL 就写入。",
      "free 之后还通过那个指针读取。",
      "字节数写成元素个数，少乘 sizeof。",
    ],
    practices: [
      "分配用 sizeof *指针。",
      "每一条成功的 malloc 对应一条 free。",
      "小的固定对象放在栈上。",
    ],
    summary: "malloc 按字节分配，失败得到 NULL。用完 free，之后不再碰那块内存。",
    exercises: [
      { title: "参考答案：写入", prompt: "分配一个 int，写入 7，打印后释放。", code: "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n  int *p = malloc(sizeof *p);\n  if (!p) return 1;\n  *p = 7;\n  printf(\"%d\\n\", *p);\n  free(p);\n  return 0;\n}", expect: "7" },
      { title: "参考答案：求和", prompt: "分配两个 int，放入 20 和 22，打印和并释放。", code: "#include <stdio.h>\n#include <stdlib.h>\nint main(void) {\n  int *a = malloc(sizeof *a * 2);\n  if (!a) return 1;\n  a[0] = 20;\n  a[1] = 22;\n  printf(\"%d\\n\", a[0] + a[1]);\n  free(a);\n  return 0;\n}", expect: "42" },
    ],
    ...tail,
  },
  {
    chapter: 10,
    slug: "stdio",
    title: "stdio 里够用的函数",
    level: "advanced",
    goals: ["用 snprintf 先格式化再打印", "用 fgets 读入一行", "用 sscanf 从一行里取数"],
    prose: `stdio 这一章只留在单文件里够用的几件：printf、snprintf、fgets、sscanf。不打开磁盘文件，因为示例不依赖下次还在的路径。

snprintf 把格式化结果写进你提供的缓冲区，并保证以空字符结尾（只要容量大于 0）。容量用 sizeof buf。然后再 printf 这个缓冲区，这样格式逻辑和输出分开。

fgets 读入一行，包含换行，除非这一行长过缓冲区。读到的文本再用 sscanf 取出数字。比直接 scanf 多一步，但你能看见整行。缓冲区要够放下示例输入。`,
    samples: [
      s("先格式化", "#include <stdio.h>\nint main(void) {\n  char buf[32];\n  snprintf(buf, sizeof buf, \"%d\", 6 * 7);\n  printf(\"%s\\n\", buf);\n  return 0;\n}", "42"),
      s("读一行", "#include <stdio.h>\nint main(void) {\n  char buf[32];\n  if (!fgets(buf, sizeof buf, stdin)) return 1;\n  printf(\"%s\", buf);\n  return 0;\n}", "Ada", { stdin: "Ada\n" }),
      s("从一行取数", "#include <stdio.h>\nint main(void) {\n  char buf[32];\n  int n = 0;\n  if (!fgets(buf, sizeof buf, stdin)) return 1;\n  if (sscanf(buf, \"%d\", &n) != 1) return 1;\n  printf(\"%d\\n\", n + 1);\n  return 0;\n}", "42", { stdin: "41\n" }),
    ],
    mistakes: [
      "snprintf 的容量写成一个拍脑袋的小数，结果被截断还当成功。",
      "fgets 的缓冲区装不下一行，却只处理一次。",
      "打开一个磁盘路径，以为下次运行文件还在。",
    ],
    practices: [
      "缓冲区容量用 sizeof。",
      "fgets 和 sscanf 的失败都要判断。",
      "教学示例不依赖外部文件。",
    ],
    summary: "snprintf 写入缓冲区，fgets 读一行，sscanf 从这行取数。容量和失败都要处理。不靠磁盘文件。",
    exercises: [
      { title: "参考答案：缓冲", prompt: "用 snprintf 放入 7，再打印。", code: "#include <stdio.h>\nint main(void) {\n  char buf[16];\n  snprintf(buf, sizeof buf, \"%d\", 7);\n  printf(\"%s\\n\", buf);\n  return 0;\n}", expect: "7" },
      { title: "参考答案：行里的和", prompt: "从一行读两个整数并打印和。输入是 20 22。", code: "#include <stdio.h>\nint main(void) {\n  char buf[32];\n  int a = 0;\n  int b = 0;\n  if (!fgets(buf, sizeof buf, stdin)) return 1;\n  if (sscanf(buf, \"%d %d\", &a, &b) != 2) return 1;\n  printf(\"%d\\n\", a + b);\n  return 0;\n}", expect: "42", stdin: "20 22\n" },
    ],
    ...tail,
  },
  {
    chapter: 11,
    slug: "lines",
    title: "行计数小项目",
    level: "advanced",
    goals: ["数标准输入里的行", "跳过空行", "把规则写成函数"],
    prose: `小项目读标准输入，数出非空的行。范围限制在一次运行。没有网络，也不写文件。输入结束时 fgets 返回 NULL，循环停下。

空行在去掉末尾换行后长度为 0。只含换行的行不算。函数接收一行，返回它算不算。main 只负责读和累加，最后 printf 一个数。

示例的标准输入在文档里写好。你改计数规则时，只改函数，再看打印的数。不要在循环里留下没用的变量。`,
    samples: [
      s("所有换行", "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  for (const char *p = \"a\\nb\\n\"; *p; p++) if (*p == '\\n') n++;\n  printf(\"%d\\n\", n);\n  return 0;\n}", "2"),
      s("跳过空行", "#include <stdio.h>\n#include <string.h>\nint counted(char *line) {\n  size_t n = strlen(line);\n  if (n && line[n - 1] == '\\n') line[n - 1] = '\\0';\n  return line[0] != '\\0';\n}\nint main(void) {\n  char buf[64];\n  int n = 0;\n  while (fgets(buf, sizeof buf, stdin)) if (counted(buf)) n++;\n  printf(\"%d\\n\", n);\n  return 0;\n}", "2", { stdin: "Ada\n\nGrace\n" }),
      s("函数相加", "#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main(void) {\n  printf(\"%d\\n\", add(1, 2));\n  return 0;\n}", "3"),
    ],
    mistakes: [
      "把只含换行的行算成有内容。",
      "fgets 失败和读到空行混成同一种处理。",
      "在计数函数里直接读 stdin，测试必须绑死在循环上。",
    ],
    practices: [
      "空行判断放进函数，循环只累加。",
      "去掉换行再看第一个字符。",
      "只打印最终的个数。",
    ],
    summary: "行计数是一次运行里的 fgets 循环。空行不算。规则放在函数里，main 只打印个数。",
    exercises: [
      { title: "参考答案：三行", prompt: "数字符串里的换行。文本是 a、b、c 各占一行。", code: "#include <stdio.h>\nint main(void) {\n  int n = 0;\n  for (const char *p = \"a\\nb\\nc\\n\"; *p; p++) if (*p == '\\n') n++;\n  printf(\"%d\\n\", n);\n  return 0;\n}", expect: "3" },
      { title: "参考答案：非空", prompt: "从输入数非空行。输入是 x、空行、y。", code: "#include <stdio.h>\n#include <string.h>\nint counted(char *line) {\n  size_t n = strlen(line);\n  if (n && line[n - 1] == '\\n') line[n - 1] = '\\0';\n  return line[0] != '\\0';\n}\nint main(void) {\n  char buf[64];\n  int n = 0;\n  while (fgets(buf, sizeof buf, stdin)) if (counted(buf)) n++;\n  printf(\"%d\\n\", n);\n  return 0;\n}", expect: "2", stdin: "x\n\ny\n" },
    ],
    ...tail,
  },
];

export const pages = book("c", ["beej-c", "modern-c", "learn-c"], chapters);

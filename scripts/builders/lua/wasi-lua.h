/*
 * WASI compatibility for Lua 5.4, included via -include.
 *
 * Do not define LUA_USE_POSIX. That switch makes ldo.c call _setjmp/_longjmp,
 * which LLVM's wasm sjlj pass does not rewrite. Plain setjmp/longjmp (the ISO
 * path) plus -mllvm -wasm-enable-sjlj -lsetjmp is what makes pcall/error work.
 */

/* wasi-libc declares tmpnam but does not define L_tmpnam. os.tmpname() fails. */
#define LUA_TMPNAMBUFSIZE 32
#define lua_tmpnam(b, e) \
  do {                   \
    (void)(b);           \
    (e) = 1;             \
  } while (0)

/* No host shell. os.execute(cmd) fails; os.execute() with no args is false. */
#define l_system(cmd) ((cmd) == NULL ? 0 : -1)

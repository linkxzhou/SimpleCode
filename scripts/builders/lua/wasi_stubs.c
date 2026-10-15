/* tmpfile is declared by wasi-libc and not provided. io.tmpfile() then fails. */
#include <stdio.h>

FILE *tmpfile(void) { return 0; }

---
language: c
chapter: 19
title: "C File I/O"
level: beginner
minutes: 8
goals:
  - "Know this page does not depend on a host path"
  - "Prepare one line with sprintf"
  - "Read the number back with sscanf"
sources:
  - learn-c
updated: "2026-10-16"
---

On your own machine, `fopen` can open a path. This compiled program has no disk it can rely on, so the runnable samples only handle one line kept in memory.

### Keep fopen for reading

A path such as `note.txt` is not guaranteed here. `fopen` and `fclose` are shown so you can read the calls.

```c norun title="Do not write the disk"
#include <stdio.h>
int main(void) {
  FILE *fp = fopen("note.txt", "w");
  if (fp) fclose(fp);
  return 0;
}
```

This environment does not provide that file, so the sample is not run.

### Write into a buffer

`sprintf` places formatted characters into an array. `printf` then writes the contents of `buf`.

```c run expect="茶 18" title="One line of text"
#include <stdio.h>
int main(void) {
  char buf[32];
  sprintf(buf, "茶 %d", 18);
  printf("%s\n", buf);
  return 0;
}
```

The output contains `茶 18`.

### Read it back

`sscanf` applies a format to text already in memory. The characters `18` are converted into the `int` named `n`.

```c run expect="18" title="Read back"
#include <stdio.h>
int main(void) {
  int n = 0;
  sscanf("18", "%d", &n);
  printf("%d\n", n);
  return 0;
}
```

The output contains `18`.

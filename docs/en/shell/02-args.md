---
language: shell
chapter: 2
title: "Shell Arguments"
level: beginner
minutes: 8
goals:
  - "Expect no arguments from the Run button"
  - "Count arguments with $#"
  - "Read the first argument with $1"
sources:
  - wasi-sh
updated: "2026-10-16"
---

The Run button hands the script to the shell and attaches no further arguments. `$#` is therefore 0, and `$1` is empty.

### The count

`$#` is how many arguments were attached. With this button the count is 0.

```sh run expect="0" title="No extra arguments"
printf '%s\n' $#
```

The line shows `0`.

### The first argument is empty

`$1` holds no characters. The letters written on both sides meet.

```sh run expect="xy" title="An empty argument"
printf '%s\n' "x${1}y"
```

The line shows `xy`.

### The script name is set

`$0` is the path of this script. When that path is non-empty, the script prints `has`.

```sh run expect="has" title="The script name is set"
if [ -n "$0" ]; then
  printf '%s\n' has
fi
```

The line shows `has`.

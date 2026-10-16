---
language: shell
chapter: 16
title: "Shell read"
level: beginner
minutes: 8
goals:
  - "Read one line with read"
  - "Leave the newline out of the variable"
  - "Provide standard input with the example"
sources:
  - wasi-sh
updated: "2026-10-16"
---

`read` stops at a newline. The input supplied with the example must end with a newline.

### A name

The input is the letters Ada plus a newline. The variable keeps Ada and drops the newline.

```sh run stdin="Ada\n" expect="Ada" title="Read Ada"
read name
printf '%s\n' "$name"
```

The line shows `Ada`.

### A prefix in front

The format can place characters ahead of the stored word. Here the prefix is Hello, and the name follows it.

```sh run stdin="Ada\n" expect="Hello, Ada" title="With a prefix"
read name
printf '%s\n' "Hello, $name"
```

The line shows `Hello, Ada`.

### From a pipe

`printf` on the left writes the line into the pipe. `read` stores it, and the next command prints it.

```sh run expect="pen" title="From the pipe"
printf '%s\n' pen | read item
printf '%s\n' "$item"
```

The line shows `pen`.

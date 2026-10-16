---
language: shell
chapter: 20
title: "Shell External Commands"
level: beginner
minutes: 8
goals:
  - "Treat cd as unavailable"
  - "Treat command substitution as unavailable"
  - "Produce output with a builtin"
sources:
  - wasi-sh
updated: "2026-10-16"
---

A name this shell cannot find exits with status 127. The message says external commands are not available, because there is no fork. The `cd` and `$()` samples below are for reading.

### cd does not run

`cd` and `pwd` are both outside the builtin commands. Calling either name ends with status 127.

```sh norun title="Cannot change directory"
cd /tmp
pwd
```

The block stays unread. The error text says there is no fork.

### Command substitution does not run

Backticks and `$()` do not launch another program. The sample shows that spelling for reading only.

```sh norun title="No command substitution"
item=$(echo 茶)
printf '%s\n' "$item"
```

Run skips the sample. Nothing inside `$()` is started.

### A builtin is enough

The line you need can come from `printf` alone. No external program has to be named.

```sh run expect="茶" title="Builtin output"
printf '%s\n' 茶
```

The line shows `茶`.

### The colon is a builtin too

`:` succeeds and writes nothing. The line after it is what shows up.

```sh run expect="就绪" title="Ready"
:
printf '%s\n' 就绪
```

The line shows `就绪`.

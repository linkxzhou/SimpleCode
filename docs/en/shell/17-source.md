---
language: shell
chapter: 17
title: "Shell File Inclusion"
level: beginner
minutes: 8
goals:
  - "Treat source as unavailable"
  - "Keep the commands in this file"
  - "Avoid a second script"
sources:
  - wasi-sh
updated: "2026-10-16"
---

Neither `source` nor `.` opens another file. Put every command that should run into this file.

### source is unread

There is no other.sh to pull in. `source` is not a builtin, so the line cannot run.

```sh norun title="Cannot include a file"
source other.sh
```

Run skips the sample. Keep the commands you need in the script that is already open.

### One file, two lines

These two `printf` commands are the whole script. Both of them live in this file.

```sh run expect="first" title="The first line"
printf '%s\n' first
printf '%s\n' second
```

The earlier line is `first`. The later line is `second`.

### Skip the dot as well

A dot on its own searches for an external command. This sample calls `true`, then prints next.

```sh run expect="next" title="Continue in this file"
true
printf '%s\n' next
```

The line shows `next`.

---
language: shell
chapter: 25
title: "Shell status"
level: intermediate
minutes: 8
goals:
  - "See the 1 from false in $?"
  - "See status 0 after a successful command"
  - "Know that trap is not registered"
sources:
  - wasi-sh
updated: "2026-10-20"
---

After each command, $? is its exit status. false is 1. true and printf are 0. trap is not a builtin, so it cannot hang another command on exit.

### After false, $? is 1

false sets the status to 1. The next printf reads 1 while expanding $?, because expansion happens before printf itself returns.

```sh run expect="1" title="Status 1"
false
printf '%s\n' $?
```

### After true, $? is 0

true succeeds, so the status is 0. printf prints that 0.

```sh run expect="0" title="Status 0"
true
printf '%s\n' $?
```

### A failure prints bad

After false, if looks at the previous status. A non-zero status takes else and prints bad. The last command is printf, so the script still exits 0.

```sh run expect="bad" title="Failure becomes bad"
false
if [ $? -eq 0 ]; then
  printf '%s\n' ok
else
  printf '%s\n' bad
fi
```

### trap stays unread

trap is treated as an external command. This shell cannot register printf on EXIT. Read $? from the samples above when you need the status.

```sh norun title="No trap"
trap 'printf %s\n bye' EXIT
printf '%s\n' hi
```

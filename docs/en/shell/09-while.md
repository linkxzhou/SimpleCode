---
language: shell
chapter: 9
title: "Shell while"
level: beginner
minutes: 8
goals:
  - "Repeat with while until the test fails"
  - "Change the condition inside the loop"
  - "Leave arithmetic expansion unused"
sources:
  - wasi-sh
updated: "2026-10-16"
---

There is no `$((...))` here, so a counter cannot be increased by one. Change the condition inside the loop until the test fails.

### Once

The test passes on entry. The body stores 0 in `n`, and the loop stops after that pass.

```sh run expect="一次" title="Only once"
n=1
while [ "$n" = 1 ]
do
  printf '%s\n' 一次
  n=0
done
```

The line shows `一次`.

### The body never runs

The test is already false, so control never enters the loop. The print after `done` is what appears.

```sh run expect="跳过" title="The body is skipped"
n=0
while [ "$n" = 1 ]
do
  printf '%s\n' 不该出现
done
printf '%s\n' 跳过
```

The line shows `跳过`.

### Arithmetic expansion is unread

`$((1+1))` is not a form this shell evaluates. The sample stays on the page for reading.

```sh norun title="No arithmetic expansion"
n=$((1+1))
echo "$n"
```

Run leaves the block alone. The `$((` form does not add the numbers.

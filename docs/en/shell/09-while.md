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

```sh run expect="once" title="Only once"
n=1
while [ "$n" = 1 ]
do
  printf '%s\n' once
  n=0
done
```

The line shows `once`.

### The body never runs

The test is already false, so control never enters the loop. The print after `done` is what appears.

```sh run expect="skip" title="The body is skipped"
n=0
while [ "$n" = 1 ]
do
  printf '%s\n' absent
done
printf '%s\n' skip
```

The line shows `skip`.

### Arithmetic expansion is unread

`$((1+1))` is not a form this shell evaluates. The sample stays on the page for reading.

```sh norun title="No arithmetic expansion"
n=$((1+1))
echo "$n"
```

Run leaves the block alone. The `$((` form does not add the numbers.

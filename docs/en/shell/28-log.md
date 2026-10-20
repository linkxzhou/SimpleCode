---
language: shell
chapter: 28
title: "Shell log tally"
level: intermediate
minutes: 8
goals:
  - "Count tea with tally marks"
  - "Remember the last line of the log"
  - "Mark only cup"
sources:
  - wasi-sh
updated: "2026-10-20"
---

This shell has no arithmetic expansion, so n=$((n+1)) is unavailable. A count is a string of x marks. Each time the target appears, one more x is added. printf emits the log lines with several %s conversions.

### tea appears three times, so the tally is xxx

The four lines are tea, tea, cup, and tea. Only tea appends an x. After the loop the line is xxx.

```sh run expect="xxx" title="Three x marks"
n=
printf '%s\n%s\n%s\n%s\n' tea tea cup tea | while read item
do
  if [ "$item" = tea ]; then
    n=${n}x
  fi
done
printf '%s\n' "$n"
```

### The last line is mug

The three lines are tea, cup, and mug. Each read overwrites last. When the loop ends, the line is mug.

```sh run expect="mug" title="Final line mug"
last=
printf '%s\n%s\n%s\n' tea cup mug | while read item
do
  last=$item
done
printf '%s\n' "$last"
```

### cup appears once, so the tally is x

Only the middle of the three lines is cup. The tally grows from an empty string to a single x.

```sh run expect="x" title="One x"
n=
printf '%s\n%s\n%s\n' tea cup mug | while read item
do
  if [ "$item" = cup ]; then
    n=${n}x
  fi
done
printf '%s\n' "$n"
```

### Arithmetic expansion stays unread

$((n+1)) does not add. Parentheses after the dollar sign are not syntax. Counts stay on the tally string shown above.

```sh norun title="No arithmetic expansion"
n=1
n=$((n+1))
printf '%s\n' "$n"
```

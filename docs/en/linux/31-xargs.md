---
language: linux
chapter: 31
title: "Linux xargs"
level: intermediate
minutes: 8
goals:
  - "Hand two lines to echo"
  - "Read a file through xargs"
  - "Limit each invocation to one argument with -n"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

xargs reads words from standard input and passes them as arguments to the next command. With one word per line, echo joins them with spaces on one line.

### Two lines become tea cup

printf writes tea and cup on separate lines. xargs echo gathers them into the one line tea cup.

```linux run expect="tea cup" title="One line"
printf 'tea\ncup\n' | xargs echo
```

### xargs cat reads tea

tea is written to /tmp/sip.txt, then that path is handed to xargs cat. The output is tea.

```linux run expect="tea" title="Read tea"
printf 'tea\n' > /tmp/sip.txt
printf '/tmp/sip.txt\n' | xargs cat
```

### -n 1 makes echo run once per word

-n 1 means one argument per run. tea and cup are separate lines again, and the expected text locks onto cup.

```linux run expect="cup" title="One at a time"
printf 'tea\ncup\n' | xargs -n 1 echo
```

### Empty input still runs the command once

With no words, BusyBox xargs still runs echo once by default and prints a blank line. -r would skip that run. This sample prints mark after the default echo.

```linux run expect="mark" title="After empty input"
printf '' | xargs echo
echo mark
```

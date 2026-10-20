---
language: shell
chapter: 23
title: "Shell multiline text"
level: intermediate
minutes: 8
goals:
  - "Print two lines with repeated %s"
  - "Write two lines to a file and read them back"
  - "Know that a here-doc cannot be parsed"
sources:
  - wasi-sh
updated: "2026-10-20"
---

printf in wasi-sh does not reuse its format. One %s consumes one argument. Multiline text puts the newlines in the format string. << is not a here-doc, and the redirect would miss its target.

### Print tea and cup in one call

The format contains two %s conversions and two newlines. tea and cup each occupy one line. The expected text locks onto the second line, cup.

```sh run expect="cup" title="Second line is cup"
printf '%s\n%s\n' tea cup
```

### The second line in the file is mug

Two printf calls write tea and mug into note.txt. cat reads the file back, and mug is in the output.

```sh run expect="mug" title="Read mug back"
printf '%s\n' tea > note.txt
printf '%s\n' mug >> note.txt
cat note.txt
```

### The last of three lines is pen

Three %s conversions take tea, cup, and pen. The last line is pen. The format has to spell out every newline.

```sh run expect="pen" title="Last is pen"
printf '%s\n%s\n%s\n' tea cup pen
```

### A here-doc stays unread

<<STOP is parsed as an input redirect, and the following STOP does not start a body. Parsing fails immediately, so this block is not run.

```sh norun title="No here-doc"
cat <<STOP
tea
STOP
```

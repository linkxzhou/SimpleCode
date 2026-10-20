---
language: linux
chapter: 35
title: "Linux signals"
level: intermediate
minutes: 8
goals:
  - "Use kill -0 to see that the current shell is alive"
  - "See the signal name HUP"
  - "Do not send a terminating signal to process 1"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

kill can query a process or send a signal. kill -0 sends no real signal. It only checks that the process exists. A snippet that would stop init stays in a reading block.

### The current shell prints alive

$$ is the current shell's process id. When kill -0 succeeds, && runs echo alive.

```linux run expect="alive" title="Shell is alive"
kill -0 $$ && echo alive
```

### The signal list includes HUP

kill -l lists signal names. HUP is hangup. The expected text locks onto that name, not onto the order of the whole list.

```linux run expect="HUP" title="List HUP"
kill -l
```

### Signal 0 checks this shell

kill -s 0 checks, the same way kill -0 does. On success the line is ok.

```linux run expect="ok" title="Check passed"
kill -s 0 $$ && echo ok
```

### Stopping process 1 stays unread

kill -9 1 would hit init inside the guest. The chapter does not run that line. Use -0 and -l above to look at signals.

```linux norun title="Do not stop init"
kill -9 1
```

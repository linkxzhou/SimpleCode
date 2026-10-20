---
language: shell
chapter: 24
title: "Shell options"
level: intermediate
minutes: 8
goals:
  - "Recognize -n in a word list"
  - "Print no when -n is absent"
  - "Know that getopts is not a builtin"
sources:
  - wasi-sh
updated: "2026-10-20"
---

The Run button does not pass options. To show an option, write -n and the other words in a for list and recognize it with test. getopts ends at status 127.

### A list that contains -n prints yes

for visits -n and then tea. On -n it sets found to yes. After the loop the line is yes.

```sh run expect="yes" title="See -n"
found=no
for item in -n tea
do
  if [ "$item" = -n ]; then
    found=yes
  fi
done
printf '%s\n' "$found"
```

### Without -n the flag stays no

The list is only tea and cup. The equality never holds, so found stays no.

```sh run expect="no" title="No -n"
found=no
for item in tea cup
do
  if [ "$item" = -n ]; then
    found=yes
  fi
done
printf '%s\n' "$found"
```

### -n still counts in the middle

tea comes first, -n is in the middle, and cup is last. One match is enough, so the result is yes.

```sh run expect="yes" title="-n in the middle"
found=no
for item in tea -n cup
do
  if [ "$item" = -n ]; then
    found=yes
  fi
done
printf '%s\n' "$found"
```

### getopts stays unread

getopts is not a builtin. Calling it reports that no external command exists and exits 127. The for loop above is the scan this shell can run.

```sh norun title="No getopts"
getopts "n" opt
printf '%s\n' "$opt"
```

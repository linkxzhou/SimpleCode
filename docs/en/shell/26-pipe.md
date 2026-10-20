---
language: shell
chapter: 26
title: "Shell pipes"
level: intermediate
minutes: 8
goals:
  - "Hand one line to read through a pipe"
  - "Know that command substitution does not run"
  - "Add a prefix to the word read from a pipe"
sources:
  - wasi-sh
updated: "2026-10-20"
---

A pipe between builtins joins them with a memory buffer in this same process. A variable set by read on the right is still visible after the left side finishes. $(...) does not start a subcommand.

### The pipe reads mug

printf writes mug and a newline. read stores that line in sku, and the next printf prints got-mug.

```sh run expect="got-mug" title="Read mug"
printf '%s\n' mug | read sku
printf '%s\n' "got-$sku"
```

### Add a cat in the middle

tea passes through cat and then into read. The variable is still tea, so the line is seen-tea. The pipe does not put read in another process.

```sh run expect="seen-tea" title="Through cat"
printf '%s\n' tea | cat | read sku
printf '%s\n' "seen-$sku"
```

### Two lines in a pipe keep only the last

The printf format writes the two lines tea and cup. Each read overwrites sku, so sku is cup when the loop ends.

```sh run expect="cup" title="Last is cup"
printf '%s\n%s\n' tea cup | while read sku
do
  last=$sku
done
printf '%s\n' "$last"
```

### Command substitution stays unread

$(printf ...) does not run the inner printf. A parenthesis after the dollar sign is not expansion syntax. Use a pipe to take another command's output.

```sh norun title="No command substitution"
printf '%s\n' "$(printf %s tea)"
```

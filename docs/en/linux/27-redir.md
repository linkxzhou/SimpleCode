---
language: linux
chapter: 27
title: "Linux Redirection"
level: advanced
minutes: 7
goals:
  - "Store output in a file with >"
  - "Add more text with >>"
  - "Feed a file to standard input with <"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

ash sets up redirection before it starts the command. Put the files in /tmp. Do not write them beside the script for this run under /mnt.

### > stores standard output in a file

If the file already exists, it is truncated. cat should then show only the word written on this pass.

```linux run expect="ada" title="Overwrite the file"
echo ada > /tmp/out && cat /tmp/out
```

The file holds `ada`.

### >> adds text at the end

Appending leaves the earlier bytes in place. A later cat should still find more at the end of the file.

```linux run expect="more" title="Text added at the end"
echo ada > /tmp/out && echo more >> /tmp/out && cat /tmp/out
```

The file ends with `more`.

### < feeds a file to standard input

cat with an empty argument list reads standard input. The less-than sign connects /tmp/out, so ada shows up once more.

```linux run expect="ada" title="Read the file as input"
echo ada > /tmp/out && cat < /tmp/out
```

The same word `ada` comes back.

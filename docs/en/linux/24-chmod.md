---
language: linux
chapter: 24
title: "Linux chmod"
level: advanced
minutes: 7
goals:
  - "Write a mode as three octal digits"
  - "Add owner execute with u+x"
  - "Confirm the file bytes stay the same"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

chmod changes permission bits. It does not rewrite the bytes stored in the file. The samples still use the tmpfs mounted at /tmp.

### A numeric mode packs nine bits into three octal digits

644 means rw-r--r--. The digit 6 is read and write for the owner. The digit 4 is read-only. The first column from ls should show that string.

```linux run expect="-rw-r--r--" title="Octal 644"
echo x > /tmp/bit && chmod 644 /tmp/bit && ls --color=never -l /tmp/bit
```

The column shows `-rw-r--r--`.

### u+x adds execute for the owner alone

Applied to 644, u+x turns the owner into rwx. Group and others remain r--. The column becomes -rwxr--r--, which is not the everyone-executes pattern of 755.

```linux run expect="-rwxr--r--" title="Owner execute only"
echo x > /tmp/bit && chmod 644 /tmp/bit && chmod u+x /tmp/bit && ls --color=never -l /tmp/bit
```

The column shows `-rwxr--r--`.

### The bits change and the bytes do not

The mode is different, yet cat still reads the original character. Both checks share one run.

```linux run expect="x" title="The bytes are still x"
echo x > /tmp/bit && chmod 755 /tmp/bit && cat /tmp/bit
```

The file still contains `x`.

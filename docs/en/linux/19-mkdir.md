---
language: linux
chapter: 19
title: "Linux mkdir"
level: intermediate
minutes: 6
goals:
  - "Create one directory"
  - "Create missing parents with -p"
  - "Expect failure when the name exists"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

mkdir adds one node to the directory tree. If a parent is missing and you omit -p, the command fails.

### Create a single directory

Place the new name under /tmp so it does not collide with a system directory at the root. Success is silent. Use ls to see what appeared.

```linux run expect="only" title="The new directory is visible"
mkdir /tmp/only && ls --color=never -1 /tmp/only/..
```

`only` shows up in the parent listing.

### -p creates any missing parents as well

/tmp/a is not there beforehand. -p builds both a and b. Listing the parent should include b.

```linux run expect="b" title="The child appears under its parent"
mkdir -p /tmp/a/b && ls --color=never -1 /tmp/a
```

The child name is `b`.

### Repeating the name makes mkdir fail

A second mkdir of the same path exits nonzero. Attach a fixed word with || so the script as a whole still exits 0, and the expectation can stay stable.

```linux run expect="exists" title="Create the same name twice"
mkdir /tmp/only && mkdir /tmp/only || echo exists
```

The script prints `exists`.

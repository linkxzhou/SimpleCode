---
language: linux
chapter: 36
title: "Linux environment"
level: intermediate
minutes: 8
goals:
  - "Export SKU and read it back"
  - "Use the default none after unset"
  - "See SKU=tea in env"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

An assignment stays in the current shell. After export, a child command can see it in the environment. unset removes the variable. ${SKU:-none} becomes none when the variable is empty.

### The exported SKU is tea

SKU=tea is followed by export. printf reads $SKU and prints tea.

```linux run expect="tea" title="Read tea"
SKU=tea
export SKU
printf '%s\n' "$SKU"
```

### env contains SKU=tea

After export, env piped to grep keeps only the SKU line. The output is SKU=tea.

```linux run expect="SKU=tea" title="One environment line"
SKU=tea
export SKU
env | grep '^SKU='
```

### After unset the line is none

After unset SKU the variable is empty. ${SKU:-none} becomes none.

```linux run expect="none" title="Back to none"
SKU=tea
unset SKU
printf '%s\n' "${SKU:-none}"
```

### A child cannot see a variable that was not exported

SKU=tea is assigned without export. sh -c is a child shell. It reads an empty value and prints child-none.

```linux run expect="child-none" title="Hidden from the child"
SKU=tea
sh -c 'echo child-${SKU:-none}'
```

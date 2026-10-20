---
language: shell
chapter: 21
title: "Shell braces"
level: intermediate
minutes: 8
goals:
  - "Join a prefix and a suffix with ${sku}"
  - "See that ${1} is empty here"
  - "Know that a default-value form does not expand"
sources:
  - wasi-sh
updated: "2026-10-20"
---

wasi-sh only replaces ${name} with the variable's value. :-, #, and % inside the braces are not operators. The whole text is treated as one variable name.

### Letters sit on both sides of sku

sku is set to tea. ${sku} inside double quotes expands, and printf prints xteay.

```sh run expect="xteay" title="Join xteay"
sku=tea
printf '%s\n' "x${sku}y"
```

### The first positional parameter is empty

The Run button adds no arguments, so ${1} is empty. a and b sit against each other and the line is ab.

```sh run expect="ab" title="The middle is empty"
printf '%s\n' "a${1}b"
```

### Two variables join into teacup

left is tea and right is cup. Both expand inside one pair of double quotes, producing teacup.

```sh run expect="teacup" title="Join teacup"
left=tea
right=cup
printf '%s\n' "${left}${right}"
```

### The default-value form stays unread

${sku:-mug} does not become mug when sku is empty. The whole sku:-mug inside the braces is one variable name, and that name is empty. The line is not run.

```sh norun title="Not a default value"
sku=tea
printf '%s\n' "${sku:-mug}"
```

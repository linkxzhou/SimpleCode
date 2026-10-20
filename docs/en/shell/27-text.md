---
language: shell
chapter: 27
title: "Shell strings"
level: intermediate
minutes: 8
goals:
  - "Join two variables into one word"
  - "Use test to see that two words match"
  - "Know that a suffix cannot be cut by a pattern"
sources:
  - wasi-sh
updated: "2026-10-20"
---

Strings join by expanding side by side. Equality goes to test's = operator. A suffix trim such as ${sku%cup} does not exist here.

### tea and cup join into teacup

sku is tea. Inside double quotes, sku expands and then cup is written, producing teacup.

```sh run expect="teacup" title="Join teacup"
sku=tea
printf '%s\n' "${sku}cup"
```

### Matching words print same

sku is tea. test uses = to compare the expanded value with tea. When they match, the line is same.

```sh run expect="same" title="The words match"
sku=tea
if [ "$sku" = tea ]; then
  printf '%s\n' same
fi
```

### Different words print other

sku is mug, which is not tea. else prints other.

```sh run expect="other" title="The words differ"
sku=mug
if [ "$sku" = tea ]; then
  printf '%s\n' same
else
  printf '%s\n' other
fi
```

### Suffix trimming stays unread

${sku%cup} does not delete a trailing cup. The percent sign is part of the variable name. To drop a piece, split it when you set the variables.

```sh norun title="No suffix trim"
sku=teacup
printf '%s\n' ${sku%cup}
```

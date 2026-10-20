---
language: shell
chapter: 22
title: "Shell branches"
level: intermediate
minutes: 8
goals:
  - "Label tea as cup with if"
  - "Catch mug with elif"
  - "Know that case is not syntax in this shell"
sources:
  - wasi-sh
updated: "2026-10-20"
---

wasi-sh has no case. Branches are written with if, elif, and else, and the condition uses test's = operator. The case keyword would be treated as an external command, so it stays in a reading block.

### tea prints cup

item is set to tea. The first test succeeds, printf prints cup, and the later elif does not run.

```sh run expect="cup" title="tea goes to cup"
item=tea
if [ "$item" = tea ]; then
  printf '%s\n' cup
elif [ "$item" = mug ]; then
  printf '%s\n' bowl
else
  printf '%s\n' none
fi
```

### mug prints bowl

item is mug. The first branch fails, elif succeeds, and the line is bowl.

```sh run expect="bowl" title="mug goes to bowl"
item=mug
if [ "$item" = tea ]; then
  printf '%s\n' cup
elif [ "$item" = mug ]; then
  printf '%s\n' bowl
else
  printf '%s\n' none
fi
```

### Any other word prints none

item is pen. Both equality tests fail, and else prints none.

```sh run expect="none" title="Other words are none"
item=pen
if [ "$item" = tea ]; then
  printf '%s\n' cup
elif [ "$item" = mug ]; then
  printf '%s\n' bowl
else
  printf '%s\n' none
fi
```

### A case statement stays unread

case, in, and esac are not syntax here. Writing them looks up an external command and ends at status 127. The reading block is only a contrast with the if above.

```sh norun title="No case"
case tea in
  tea) printf '%s\n' cup ;;
esac
```

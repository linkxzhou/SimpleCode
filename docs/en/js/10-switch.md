---
language: js
chapter: 10
title: "JavaScript switch Statement"
level: beginner
minutes: 8
goals:
  - "Branch on discrete values"
  - "Prevent fall-through with break"
  - "Cover the other values with default"
sources:
  - lxiy-js
updated: "2026-10-16"
---

`switch` matches with `===`. Omitting `break` lets execution continue into the following case.

### Stop at the matching case

`break` ends the switch once a case has matched. The value 3 selects the third label.

```js run expect="three" title="Third day"
const day = 3;
switch (day) {
  case 1:
    console.log("one");
    break;
  case 3:
    console.log("three");
    break;
  default:
    console.log("other");
}
```

The label printed is `three`.

### When nothing matches

`default` runs if every case fails.

```js run expect="other" title="Everything else"
switch (9) {
  case 1:
    console.log("one");
    break;
  default:
    console.log("other");
}
```

Nine matches no case, so the label is `other`.

### Shared work without a break

Two case labels may fall into one body when they should do the same thing. Both labels share a single log.

```js run expect="earlier" title="One shared body"
const n = 1;
switch (n) {
  case 1:
  case 2:
    console.log("earlier");
    break;
  default:
    console.log("other");
}
```

The shared label is `earlier`.

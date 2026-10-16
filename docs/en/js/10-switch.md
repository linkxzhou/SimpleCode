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

```js run expect="三" title="Third day"
const day = 3;
switch (day) {
  case 1:
    console.log("一");
    break;
  case 3:
    console.log("三");
    break;
  default:
    console.log("其他");
}
```

The label printed is `三`.

### When nothing matches

`default` runs if every case fails.

```js run expect="其他" title="Everything else"
switch (9) {
  case 1:
    console.log("一");
    break;
  default:
    console.log("其他");
}
```

Nine matches no case, so the label is `其他`.

### Shared work without a break

Two case labels may fall into one body when they should do the same thing. Both labels share a single log.

```js run expect="前两天" title="One shared body"
const n = 1;
switch (n) {
  case 1:
  case 2:
    console.log("前两天");
    break;
  default:
    console.log("其他");
}
```

The shared label is `前两天`.

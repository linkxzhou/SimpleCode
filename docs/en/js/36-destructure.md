---
language: js
chapter: 36
title: "JavaScript Destructuring and Spread"
level: intermediate
minutes: 10
goals:
  - "Take the head and the rest from an array"
  - "Take fields from an object and supply a default"
  - "Build a new array with spread"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

Destructuring pulls values by shape on the left of an assignment. Spread lays an existing list into a new one on the right. Neither touches a list you did not mention, unless you change it afterwards.

### The first number and the length of the rest

first receives 4, and rest receives the two items after it. 4 plus the rest length 2 is 6.

```js run expect="6" title="Head and rest"
const [first, ...rest] = [4, 5, 6];
console.log(first + rest.length);
```

The sum is 6.

### Missing milliliters fall back to 1

The object only has name. Destructuring gives ml a default of 1, so the name and the milliliters join into tea1.

```js run expect="tea1" title="Default milliliters"
const { name, ml = 1 } = { name: "tea" };
console.log(name + ml);
```

The joined text is tea1.

### Spread into a new array

left is 1 and 2. The new array inserts 9 in the middle and then spreads left. Index 1 is 9, which shows the original 1 is still at the front.

```js run expect="9" title="Insert 9"
const left = [1, 2];
const merged = [left[0], 9, ...left.slice(1)];
console.log(merged[1]);
```

The middle slot is 9.

### Exercise: swap two names

Swap tea and bun with one destructuring assignment. The first name afterwards should be bun.

```js run expect="bun" title="Swap"
let left = "tea";
let right = "bun";
[left, right] = [right, left];
console.log(left);
```

The left name becomes bun.

### The You Don't Know JS types book

Spread and destructuring have a chapter in You Don't Know JS. That series is NC-ND, so only the link is here: <https://github.com/getify/You-Dont-Know-JS>.

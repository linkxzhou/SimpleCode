---
language: js
chapter: 37
title: "JavaScript Regular Expressions"
level: intermediate
minutes: 10
goals:
  - "Pull a capture group with match"
  - "Ask test whether a word is present"
  - "Replace every match with replace"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

A regular expression is a match rule written between slashes. Parentheses mark a capture group, and a global replace needs g. The sentences here use English words so multibyte characters stay out of the pattern.

### Capture the digits after the hyphen

Inside bun-9, the parentheses capture 9. Index 1 of the array from match is that group. Without g, match stops at the first hit.

```js run expect="9" title="Capture digits"
const found = "tea-4 bun-9".match(/bun-(\d+)/);
console.log(found[1]);
```

The captured text is 9.

### Ask whether cup is present

test only answers whether a match exists. The sentence contains cup, so the sample prints yes. It does not hand the matched text back.

```js run expect="yes" title="Has cup"
const has = /cup/.test("a cup of tea");
console.log(has ? "yes" : "no");
```

The answer is yes.

### Turn every tea into cup

replace with g turns both tea hits into cup. Without g, the second hit would remain.

```js run expect="cup cup" title="Replace all"
console.log("tea tea".replace(/tea/g, "cup"));
```

After the replace, the line is `cup cup`.

### Exercise: add the two captured numbers

Capture 2 and 5 from a2b5, add them, and print 7. Number turns the text into a number.

```js run expect="7" title="Add two numbers"
const found = "a2b5".match(/a(\d+)b(\d+)/);
console.log(Number(found[1]) + Number(found[2]));
```

The sum is 7.

### The javascript.info regexp lessons

The regexp lessons on javascript.info go further. The license does not allow adaptation: <https://javascript.info/>.

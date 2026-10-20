---
language: js
chapter: 34
title: "JavaScript Iterators and Generators"
level: intermediate
minutes: 10
goals:
  - "Pull yielded values with next"
  - "Attach Symbol.iterator to a plain object"
  - "Filter even numbers with a generator"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

An iterator is an object with next. Each call hands back value and done. A generator function, written with function* and yield, builds that object for you.

### Add two next calls

pairs yields 1 and then 2. Adding the value from two next calls gives 3. The generator pauses at each yield instead of running straight through.

```js run expect="3" title="Two yields"
function* pairs() {
  yield 1;
  yield 2;
}
const it = pairs();
console.log(it.next().value + it.next().value);
```

The two pulls add up to 3.

### The object can iterate itself

Giving bag a Symbol.iterator lets the spread operator ask for next. oak and elm join into one comma-separated line.

```js run expect="oak,elm" title="Spread the bag"
const bag = {
  names: ["oak", "elm"],
  [Symbol.iterator]() {
    let i = 0;
    const names = this.names;
    return {
      next() {
        if (i >= names.length) return { done: true };
        const value = names[i];
        i += 1;
        return { value: value, done: false };
      },
    };
  },
};
console.log([...bag].join(","));
```

The joined line is oak,elm.

### A generator can contain if

evens yields only even numbers. From 0, 1, 2, 3 it yields 0 and 2, and join produces 0,2.

```js run expect="0,2" title="Only evens"
function* evens(limit) {
  for (let n = 0; n < limit; n += 1) {
    if (n % 2 === 0) yield n;
  }
}
console.log([...evens(4)].join(","));
```

The evens are 0,2.

### Exercise: yield three squares

Write a generator that yields the squares of 1, 2, and 3. After spreading, join should be 1,4,9.

```js run expect="1,4,9" title="Three squares"
function* squares() {
  yield 1 * 1;
  yield 2 * 2;
  yield 3 * 3;
}
console.log([...squares()].join(","));
```

The squares are 1,4,9.

### Eloquent JavaScript is only a link

Eloquent JavaScript is CC-BY-NC, so its iterator chapter is not adapted: <https://eloquentjavascript.net/>.

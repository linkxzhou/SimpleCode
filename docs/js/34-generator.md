---
language: js
chapter: 34
title: "JavaScript 迭代器与生成器"
level: intermediate
minutes: 10
goals:
  - "用 next 取出 yield 的值"
  - "给普通对象装上 Symbol.iterator"
  - "用生成器筛出偶数"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

迭代器是有 next 方法的对象，每次交回 value 和 done。生成器函数用 function* 和 yield 把这种对象造出来。

### 两次 next 加在一起

pairs 先让出 1，再让出 2。两次 next 的 value 相加是 3。生成器停在每个 yield，不会一次跑完。

```js run expect="3" title="两次让出"
function* pairs() {
  yield 1;
  yield 2;
}
const it = pairs();
console.log(it.next().value + it.next().value);
```

两次相加是 3。

### 对象自己会迭代

给 bag 配上 Symbol.iterator，展开运算符就会来要 next。oak 和 elm 用逗号拼成一行。

```js run expect="oak,elm" title="展开袋子"
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

拼出来是 oak,elm。

### 生成器里可以写 if

evens 只让出偶数。0、1、2、3 里让出 0 和 2，join 得到 0,2。

```js run expect="0,2" title="只要偶数"
function* evens(limit) {
  for (let n = 0; n < limit; n += 1) {
    if (n % 2 === 0) yield n;
  }
}
console.log([...evens(4)].join(","));
```

偶数是 0,2。

### 练习：让出三个平方

写一个生成器，对 1、2、3 让出平方。展开后 join 应是 1,4,9。

```js run expect="1,4,9" title="三个平方"
function* squares() {
  yield 1 * 1;
  yield 2 * 2;
  yield 3 * 3;
}
console.log([...squares()].join(","));
```

平方是 1,4,9。

### Eloquent JavaScript 只链接

Eloquent JavaScript 是 CC-BY-NC，迭代器那章不改编：<https://eloquentjavascript.net/> 。

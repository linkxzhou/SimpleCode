---
language: js
chapter: 9
title: "迭代器与生成器"
level: advanced
minutes: 12
goals:
  - "让对象能被 for...of"
  - "用 function* 产出序列"
  - "只取前几项"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`for...of` 会找 `Symbol.iterator`。生成器函数返回的对象自带这个方法，`yield` 一次给一个值。

不要依赖 `setTimeout`。需要「稍后」时，用已经完成的 Promise，下一章再讲。

```js run expect="6" title="范围"
function* range(start, end) {
  for (let n = start; n <= end; n++) yield n;
}
let sum = 0;
for (const n of range(1, 3)) sum += n;
console.log(sum);
```

```js run expect="0,1,1,2,3,5" title="斐波那契"
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
const out = [];
for (const n of fibs()) {
  if (out.length === 6) break;
  out.push(n);
}
console.log(out.join(","));
```

```js run expect="3,1" title="自定义迭代"
const bag = {
  data: [3, 1],
  [Symbol.iterator]() {
    let i = 0;
    const data = this.data;
    return {
      next() {
        if (i < data.length) return { value: data[i++], done: false };
        return { done: true };
      },
    };
  },
};
console.log([...bag].join(","));
```

## 练习

生成器产出 2 和 4，打印它们的和。

::: answer 参考答案
```js run expect="6" title="参考答案"
function* evens() {
  yield 2;
  yield 4;
}
let s = 0;
for (const n of evens()) s += n;
console.log(s);
```
:::

## 常见错误

- 对无限生成器直接展开成数组。先限制次数。
- 生成器只能走一遍。再 for 一次不会重新开始，需要再调用函数。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。

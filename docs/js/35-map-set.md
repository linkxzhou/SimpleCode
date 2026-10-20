---
language: js
chapter: 35
title: "JavaScript Map、Set 与 WeakMap"
level: intermediate
minutes: 10
goals:
  - "用 Map 按名字查价格"
  - "用 Set 去掉重复"
  - "用 WeakMap 把对象当键"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

Map 的键可以是任意值，Set 只保留一份。WeakMap 的键必须是对象，这里拿得到的是你放进去的值，拿不到键的列表。

### 按名字取价格

两次 set 之后，get("bun") 取出 6。键是字符串，和对象的字段不是同一套规则。

```js run expect="6" title="小面包的价格"
const prices = new Map();
prices.set("tea", 4);
prices.set("bun", 6);
console.log(prices.get("bun"));
```

bun 的价格是 6。

### 重复的 tea 只留一份

Set 构造时传入两个 tea 和一个 cup。size 只算不同的值，所以是 2。

```js run expect="2" title="去重"
const bag = new Set(["tea", "tea", "cup"]);
console.log(bag.size);
```

不同值有 2 个。

### 对象当 WeakMap 的键

box 是一个空对象。weak.set 把它映到 tea，再用同一个对象 get 回来。换一个新对象就取不到。

```js run expect="tea" title="弱映射"
const box = {};
const weak = new WeakMap();
weak.set(box, "tea");
console.log(weak.get(box));
```

取回的是 tea。

### 练习：Set 里有没有 bun

把 tea 和 bun 放进 Set，用 has 问 bun。有就打印 yes。

```js run expect="yes" title="有没有 bun"
const bag = new Set(["tea", "bun"]);
console.log(bag.has("bun") ? "yes" : "no");
```

回答是 yes。

### MDN 的集合页

Map、Set、WeakMap 的细节在 MDN，许可 CC-BY-SA，本章例子是另写的：<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide> 。

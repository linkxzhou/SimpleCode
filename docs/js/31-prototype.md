---
language: js
chapter: 31
title: "JavaScript 原型"
level: intermediate
minutes: 10
goals:
  - "用 Object.create 接上原型"
  - "区分自有属性和原型属性"
  - "沿原型链找到方法"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

对象自己没有的属性，会到原型上找。原型还可以再有原型。这一章不画浏览器里的图，只打印查找结果。

### kind 在原型上

row 自己只有 ml。kind 放在 proto 上，读取 row.kind 仍能得到 cup。hasOwnProperty 对 kind 是 false，因为它不属于 row 自己。

```js run expect="cup-false" title="原型上的 kind"
const proto = { kind: "cup" };
const row = Object.create(proto);
row.ml = 8;
const own = Object.prototype.hasOwnProperty.call(row, "kind");
console.log(row.kind + "-" + own);
```

读到的是 `cup-false`。

### 自己的属性盖住原型

再给 row 写上 kind，自己的值盖住原型。这时 hasOwnProperty 变成 true，读到的是 mug。

```js run expect="mug-true" title="自己的 kind"
const proto = { kind: "cup" };
const row = Object.create(proto);
row.kind = "mug";
const own = Object.prototype.hasOwnProperty.call(row, "kind");
console.log(row.kind + "-" + own);
```

读到的是 `mug-true`。

### 方法也可以放在原型上

price 写在原型上，this 仍是调用时的那个对象。row.ml 是 4，方法把它乘 3，得到 12。

```js run expect="12" title="原型方法"
const proto = {
  price() { return this.ml * 3; },
};
const row = Object.create(proto);
row.ml = 4;
console.log(row.price());
```

方法得到 12。

### 练习：空对象的原型是谁

Object.getPrototypeOf({}) 应是 Object.prototype。比较这两个引用，打印 yes。

```js run expect="yes" title="默认原型"
const proto = Object.getPrototypeOf({});
console.log(proto === Object.prototype ? "yes" : "no");
```

比较结果是 yes。

### javascript.info 不能改编

javascript.info 是 CC-BY-NC-SA，原型链那一章只作延伸阅读：<https://javascript.info/> 。

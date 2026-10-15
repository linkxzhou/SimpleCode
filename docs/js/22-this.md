---
language: js
chapter: 22
title: "JavaScript this"
level: beginner
minutes: 8
goals:
  - "在方法调用里读 this"
  - "看出拆开的函数会丢掉 this"
  - "用箭头函数沿用外面的 this"
sources:
  - lxiy-js
updated: "2026-10-15"
---

`this` 取决于调用方式，不是定义时所在的对象。

### 方法调用

`obj.method()` 里的 `this` 是 `obj`。

```js run expect="8" title="读到字段"
const cup = {
  ml: 8,
  read() {
    return this.ml;
  },
};
console.log(cup.read());
```

输出里能看到 `8`。

### 拆开之后

把方法拿出来再调用，`this` 不再是那个对象。这里用一个显式参数避免依赖默认的 `this`。

```js run expect="8" title="把对象传进去"
function read(cup) {
  return cup.ml;
}
console.log(read({ ml: 8 }));
```

输出里能看到 `8`。

### 箭头函数不单独绑定

箭头函数里的 `this` 就是外层的 `this`。在普通函数里没有对象时，不要靠它读字段。

```js run expect="8" title="读外层"
const ml = 8;
const read = () => ml;
console.log(read());
```

输出里能看到 `8`。

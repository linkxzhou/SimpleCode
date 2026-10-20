---
language: js
chapter: 32
title: "JavaScript class"
level: intermediate
minutes: 10
goals:
  - "用 class 写构造和方法"
  - "用 extends 覆盖方法"
  - "用 static 做不依赖实例的函数"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

class 是写原型的一种语法。实例字段在构造函数里挂到 this 上。这里仍然没有 DOM。

### 构造函数记下毫升

Cup 把 ml 放在 this 上。double 读这个字段再乘 2。4 毫升的杯子加倍是 8。

```js run expect="8" title="加倍"
class Cup {
  constructor(ml) { this.ml = ml; }
  double() { return this.ml * 2; }
}
console.log(new Cup(4).double());
```

加倍后是 8。

### 子类改写标签

Mug 继承 Cup，label 改成带 mug 前缀。super 这里用不上，因为新方法不调用旧方法。3 毫升打印 mug3。

```js run expect="mug3" title="马克杯"
class Cup {
  constructor(ml) { this.ml = ml; }
  label() { return "cup" + this.ml; }
}
class Mug extends Cup {
  label() { return "mug" + this.ml; }
}
console.log(new Mug(3).label());
```

标签是 mug3。

### 静态方法不需要 new

static 挂在构造函数上，不挂在原型上。Cup.sign(5) 直接得到 c5，不必先造杯子。

```js run expect="c5" title="静态标记"
class Cup {
  static sign(n) { return "c" + n; }
}
console.log(Cup.sign(5));
```

标记是 c5。

### 练习：子类调用 super

Tall 的构造函数用 super(ml) 把毫升交给 Cup，再把自己的 high 设成 true。读 ml 应是 9。

```js run expect="9" title="加高"
class Cup {
  constructor(ml) { this.ml = ml; }
}
class Tall extends Cup {
  constructor(ml) {
    super(ml);
    this.high = true;
  }
}
console.log(new Tall(9).ml);
```

毫升是 9。

### 红宝书只对照目录

《JavaScript高级程序设计》第 4 版可以对照类这一章的难度，句子不搬：<https://book.douban.com/subject/35175321> 。

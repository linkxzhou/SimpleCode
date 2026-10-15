---
language: js
chapter: 7
title: "类与原型"
level: intermediate
minutes: 18
goals:
  - "用 class 声明方法"
  - "用 extends 复用"
  - "知道方法找得到是因为原型链"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

`class` 是原型的语法。方法放在原型上，实例自己的字段放在对象上。`extends` 把原型连起来，子类构造函数要先 `super`。

`instanceof` 沿着这条链判断。

```js run expect="12" title="矩形"
class Rect {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  }
}
console.log(new Rect(3, 4).area());
```

```js run expect="7" title="栈"
class Stack {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v);
  }
  pop() {
    return this.items.pop();
  }
}
const s = new Stack();
s.push(7);
console.log(s.pop());
```

```js run expect="meow" title="继承"
class Animal {
  speak() {
    return "...";
  }
}
class Cat extends Animal {
  speak() {
    return "meow";
  }
}
const pet = new Cat();
console.log(pet.speak());
console.log(pet instanceof Animal);
```

class 是原型的语法。方法放在原型上，实例之间共享同一份函数。字段写在构造函数的 this 上，每个实例各有一份。不要把会变的数据放在原型上。

extends 把原型连起来。子类构造函数如果要写自己的 this，必须先 super。否则还没初始化就使用 this，会抛错。覆盖方法不会自动调用父类，需要时写 super.method()。

instanceof 沿原型链判断。跨窗口或不同副本的类可能失败，本环境只有一个全局，可以放心用。typeof 对实例给出 "object"，区分不了是哪一个类。

私有字段用 #name，类外面访问不到。本章示例用普通字段，方便打印。你如果加上 #，记得在类内部读取，不要在 console.log 里从外面点它。

构造函数里如果忘了 new，严格模式下会失败。教程示例都写 new。方法如果被拆出来单独调用，this 会丢。需要回调时用箭头函数包一层，或者 bind。本章的例子都用 obj.method() 的形式调用，避开这个问题。

覆盖 speak 之后，父类的 speak 仍然可以通过 super 调用。如果你希望子类在父类结果后面加字，就 return super.speak() + "!"。完全换掉就不要调用 super。

instanceof 对原型链上的每一层都为真。Cat 的实例也是 Animal。这是继承想要的结果，不要用它区分「恰好是 Cat 而不是子类」。

class 把方法放在原型上，实例之间共享方法，各自保存自己的字段。构造函数里用 this 挂字段。调用时写 new。忘了 new，在严格模式下会失败。教程示例都写 new。方法如果被拆出来单独调用，this 会丢。需要回调时用箭头函数包一层。本章都用对象点方法的形式调用，避开这个问题。

extends 连接原型链。子类构造函数必须先调用 super，然后才能用 this。super 的参数是父类构造函数需要的那些。覆盖方法后如果还要父类行为，在方法里再调用 super.方法名。不要用子类去改父类原型上的共享数据，那会影响所有父类实例。

instanceof 沿着原型链问「是不是这个构造函数的实例」。它问的是原型关系，不是字段像不像。两个不相关的类即使字段相同，instanceof 也是 false。读错误信息时，先看是不是忘了 super，再看是不是 this 用早了。

字段在构造函数里初始化。不要把会变的数据放在原型上当共享计数，否则所有实例一起变。

### 读「原型方法」

先做这一例。代码收成一行是 `class Box { value() { return 7; } } console.log(new Box().value());`。先盖住终端，用手算结果，纸上的文本里要能找到「7」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「7」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「先 super」

做完上一个再做这一例。代码收成一行是 `class A { constructor(n) { this.n = n; } } class B extends A { constructor() { super(42); } } console.log(new B().n);`。先盖住终端，用手算结果，纸上的文本里要能找到「42」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「42」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：会变的数据放在 this 上，方法放在原型上。 用「原型方法」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：计数两次」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：子类构造函数先 super，再使用 this。 用「先 super」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：计数两次」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：判断实例用 instanceof，不用 typeof。 用「原型方法」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：计数两次」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：写一个类 Counter，构造时把 n 设为 0，方法 inc 加一并返回。连续调用两次后打印。 做完再对照「参考答案：计数两次」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：class 把方法放在原型上，extends 连接原型链。子类要先 super，instanceof 用来识别实例。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```js run expect="7" title="原型方法"
class Box {
  value() { return 7; }
}
console.log(new Box().value());
```

```js run expect="42" title="先 super"
class A { constructor(n) { this.n = n; } }
class B extends A {
  constructor() { super(42); }
}
console.log(new B().n);
```

## 练习

写一个 Queue，enqueue 再 dequeue，打印先放进去的 1。

::: answer 参考答案
```js run expect="1" title="参考答案"
class Queue {
  constructor() { this.items = []; }
  enqueue(v) { this.items.push(v); }
  dequeue() { return this.items.shift(); }
}
const q = new Queue();
q.enqueue(1);
q.enqueue(2);
console.log(q.dequeue());
```
:::

写一个类 Counter，构造时把 n 设为 0，方法 inc 加一并返回。连续调用两次后打印。

::: answer 参考答案：计数两次
```js run expect="2" title="参考答案"
class Counter {
  constructor() { this.n = 0; }
  inc() { this.n += 1; return this.n; }
}
const c = new Counter();
c.inc();
console.log(c.inc());
```
:::

## 最佳实践

- 会变的数据放在 this 上，方法放在原型上。
- 子类构造函数先 super，再使用 this。
- 判断实例用 instanceof，不用 typeof。

## 小结

class 把方法放在原型上，extends 连接原型链。子类要先 super，instanceof 用来识别实例。

## 常见错误

- 在子类构造函数里先用 this 再 super。
- 把方法直接赋到实例上却以为改的是所有对象。那只影响这一个实例。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。

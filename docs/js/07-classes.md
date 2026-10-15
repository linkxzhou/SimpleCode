---
language: js
chapter: 7
title: "class 是写原型的语法"
level: intermediate
minutes: 28
goals:
  - "用构造函数和 class 得到同样的标签行为"
  - "确认方法在原型上，实例之间共享函数体"
  - "避免把可变数组放在原型上"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

上一章的原型是手写的：`Object.create`，自己挂字段，默认值放在另一个对象上。书一旦多起来，你会想要一个「制造一本书」的固定入口，保证每本都有 `title` 和 `pages`，并带一个 `label` 方法。JavaScript 原来的入口是函数加 `new`。`new` 会造一个新对象，让它的原型指向构造函数的 `prototype`，再把这个对象当作 `this` 去运行函数。你在函数里给 `this.title` 赋值，字段就在这本自己身上。你把 `label` 赋到 `Book.prototype` 上，方法就在原型上，所有 `new Book` 出来的书共享这一个函数。

`class` 写的是同一件事。构造器里的 `this.title = title` 仍是自己的字段。方法写在类体里，会被放到 `Entry.prototype` 上，不是每本复制一份函数。`typeof Entry` 是 `"function"`，因为类在运行时就是函数。`instanceof` 沿着原型链问「`Entry.prototype` 在不在这条链上」，它不是在问另一套类型系统里的名义类型。没有单独的「类对象运行时」。剥掉语法之后，还是原型查找加构造函数。

```js run expect="边城/120" title="构造函数把方法放在原型上"
function Book(title, pages) {
  this.title = title;
  this.pages = pages;
}
Book.prototype.label = function () {
  return this.title + "/" + this.pages;
};
const book = new Book("边城", 120);
console.log(book.label());
console.log(Object.getPrototypeOf(book) === Book.prototype);
console.log(typeof Book);
```

三行是 `边城/120`、`true`、`function`。`label` 里的 `this` 仍由调用决定。`book.label()` 的接收者是这本，所以标题对得上。若把 `book.label` 拆出来单独调用，会遇到函数章那个没有接收者的失败。类不会把 `this` 改成词法绑定。写成类只是让方法进原型的写法短一些，调用规则没有换。

用类把同一本书再写一次。

```js run expect="true" title="class 同样链到原型"
class Entry {
  constructor(title, pages) {
    this.title = title;
    this.pages = pages;
  }
  label() {
    return this.title + "/" + this.pages;
  }
}
const book = new Entry("边城", 120);
console.log(book.label());
console.log(Object.getPrototypeOf(book) === Entry.prototype);
console.log(book instanceof Entry);
console.log(typeof Entry);
```

输出里有 `边城/120` 和 `true`。`instanceof` 为真，是因为原型链上有 `Entry.prototype`。你若用 `Object.create(Entry.prototype)` 造一个对象、却不运行构造器，`instanceof` 仍可能为真，但 `title` 是 `undefined`。所以 `instanceof` 证明不了构造器跑过，它只证明链的连接。这是语法糖的一个代价：类看起来像「类型保证」，运行时只保证链，不保证字段已经填好。字段要靠构造器，或者靠你自己检查。

`extends` 把子类的原型对象的原型设为父类的原型，并把构造函数用 `super` 串起来。`super(title)` 必须在使用 `this` 之前调用，否则引擎拒绝，因为子类的 `this` 要等父构造器把对象准备好。`super.label()` 是沿着原型去调用父类的方法，同时把 `this` 仍保持为这本子类实例。所以父方法读到的 `this.title` 是子类实例上的字段。这不是复制了一份父类的数据，是同一次查找规则多走了一级。

```js run expect="完:围城" title="extends 多连一级原型"
class Entry {
  constructor(title) {
    this.title = title;
  }
  label() {
    return this.title;
  }
}
class Finished extends Entry {
  constructor(title) {
    super(title);
    this.done = true;
  }
  label() {
    return "完:" + super.label();
  }
}
const book = new Finished("围城");
console.log(book.label());
console.log(book instanceof Entry);
console.log(book.done);
```

三行是 `完:围城`、`true`、`true`。`book instanceof Entry` 为真，因为链是 `book -> Finished.prototype -> Entry.prototype`。子类实例同时是父类的实例，在这套模型里就是链上的包含，不是两套对象嵌在一起。你没有一个隐藏的父对象来单独存放标题。标题在 `this` 上，只有一份。父类构造器和子类构造器写的是同一个 `this`。若两边都写 `this.title`，后写的盖住先写的。`super(title)` 先写，子类若再写一次就会盖住。想保留父类写的值，就不要再赋值。

类不会在你忘记 `new` 时偷偷当成普通函数。`Entry("边城")` 会抛 `TypeError`。普通构造函数在非严格模式下被直接调用，`this` 可能指到全局，字段会漏到全局上去。类把这条漏缝堵上了。这是语法带来的真实差别，不只是好看。堵上的代价是：你不能再把类构造器当成普通函数传给一个会「直接调用」的旧接口，必须包一层 `function (title) { return new Entry(title); }`。包装之后，调用点不需要记得 `new`，制造仍走构造器。

共享方法是省的，共享可变数据是错的。若有人把数组放在原型上，所有实例的 `push` 都推进同一份数组。阅读清单会串台：《边城》加进去，《围城》那本的标题列表里也有它。

```js run expect="0" title="可变数据不要放在原型上"
class Shelf {
  constructor() {
    this.titles = [];
  }
  add(title) {
    this.titles.push(title);
  }
}
const a = new Shelf();
const b = new Shelf();
a.add("边城");
console.log(a.titles.join(","));
console.log(String(b.titles.length));
```

`b` 的长度是 `0`，因为 `titles` 在构造器里每次 `new` 都是新数组，写在自己身上。若改成 `Shelf.prototype.titles = []`，第二行会变成 `1`。方法 `add` 放在原型上是对的，它不保存某一架的书，它通过 `this.titles` 找到这一架的数组。判断标准就这一句：这个值会不会被某一本改掉。会，就放构造器里的 `this`。不会，函数体可以放原型。

类字段的另一种写法是写在类体顶上，运行时仍是构造期间在 `this` 上赋值，不是放进原型。本课把赋值写在构造器里，让「自己的数据」出现在同一个函数中，读的人不用再猜字段语法落在链的哪一层。取舍是构造器会变长。长，换来位置明确。

`class` 没有改变 `typeof` 对实例的回答。实例仍是 `"object"`。区分「这是不是一本书」用 `instanceof`，而 `instanceof` 会在原型被改动后变化。你可以改 `Object.setPrototypeOf`，实例的身份就变了。这种灵活让对象可以临时借用行为，也让身份不能当作永久证书。阅读清单不需要改原型。造的时候连对，之后只改自己的字段。

静态方法挂在构造函数上，不挂在原型上，实例的查找也找不到它。`Entry.fromJSON` 这种函数负责把检查过的文本变成一本，它不需要 `this` 指向某一本。写成静态方法，调用是 `Entry.fromJSON(raw)`，名字空间落在构造函数上，避免一个全局的 `fromJSON` 和别的清单撞名。把它写成原型方法会误导调用方去 `book.fromJSON`，仿佛一本已经存在的书负责解析文本。解析发生在有书之前。静态和实例方法的差别，就是「还没有实例」和「已经有这一本」的差别。

字段的初始化顺序在子类里容易看错。父类构造器运行时，子类写在构造器里的赋值还没发生。父类方法若在构造过程中被调用，可能看见子类字段仍是空的。因此不要在构造器里调用可以被子类覆盖的方法。构造器只赋值。需要派生行为时，等 `new` 完成后再调用。这个限制使构造器变笨，换来的是你不会在半初始化的对象上跑逻辑。半初始化的书会打出空标题，而 `instanceof` 已经为真，看起来像一本合法的书。

混入是用函数改原型或改对象，而不是 `extends` 一条长链。例如给原型加上 `markDone`，所有书都有这个方法，却不必有一个 `FinishedBook` 子类。子类表达的是「这一本属于另一种构造过程」，混入表达的是「这一段行为可以贴到已有的原型上」。长的继承链让 `super` 的目的地变远，读一个 `label` 要跳三四层。阅读清单的行为只有标签和加入，两层 `extends` 已经够演示链，不要为了分类学再分出「平装」和「精装」子类，除非它们的构造真的不同。分类若只是一个字段，写成 `format: "平装"` 即可。字段能进 JSON，子类的名字不能自动进 JSON。你解析回来的只是数据，类要重新 `new`。所以能用字段表达的差异，不要做成一棵类树。否则每次从文本恢复都要写一个按名字挑子类的表，那张表和类的声明容易各改各的。

`new.target` 能让父构造器知道实际 `new` 的是不是子类。偶尔用来禁止直接 `new` 父类。阅读清单允许直接造普通的书，不需要这个元属性。它增加一种隐式参数，查错时多一个只在构造期间存在的值。公开的规则更简单：想要读完标记，就用带 `done` 的构造，或者造完再赋值。不要用「禁止 new 父类」来模拟抽象类。JavaScript 的类不是一份会在运行前检查抽象方法的合同。缺方法要到调用那一行才失败。

方法若写成箭头并放在类字段里，每一本都会有自己的函数，`this` 在构造时定死。那能避免拆开调用时丢失接收者，代价是每本一份函数，不再共享原型上的那一个。三本书无所谓，几千本就多几千个函数对象。本课的 `label` 放在原型上，调用时写 `book.label()`。若必须把方法交给别人稍后调用，在交出去时 `bind`，而不是把所有方法都改成每本一份箭头。

私有字段以 `#` 开头，只在类的内部看得见，外部的 `book.#pages` 是语法错误，不是 `undefined`。这和普通缺失字段不同，缺失字段静默，私有字段把「不许看」做成语法。这个抽屉的例子不用私有字段，是为了让对象字面量和类的实例在打印字段时用同一种 `book.pages`。若你启用私有字段，调试时 `console.log(book)` 可能仍看不见那一格，或者显示成引擎自己的格式，不适合当期望文本。需要隐藏时再改。隐藏的代价是测试不能直接读，只能通过方法。方法若写错，你少了一条直接观察数据的路。

类表达式 `const Entry = class {}` 和类声明一样会造构造函数，但不会把名字提升到整段脚本的顶部。声明则可以在写 `class` 之前不太依赖顺序，具体规则比函数声明更窄，不要依赖提升。例子都把类写在 `new` 之前。顺序写出来，读的人不用记提升表。

构造器里返回一个对象会取代 `new` 刚造出来的那一个。返回数字或字符串则会被忽略，你仍得到原来的实例。这个规则让工厂可以在特殊情况下交回缓存的旧实例，也让人意外地丢掉刚刚赋的字段。阅读清单的构造器不写 `return`。需要缓存时，用构造器外面的函数去查缓存，决定是 `new` 还是交回旧的。把决定放在外面，`new` 的含义就始终是「造一本新的」。含义稳定比少写一个函数更重要。

类体里的方法默认不可枚举。`for...in` 走实例时看不到 `label`，这是和随手挂到对象上的函数不同的地方。不可枚举让复制字段时不容易把方法当成数据抄走。你若需要一份方法名单，去看原型，而不是枚举实例。实例上应该只剩数据。

## 小结

`class` 把构造函数和原型方法写成一块。实例字段在 `this` 上，方法在 `prototype` 上，`typeof` 类本身仍是函数。`instanceof` 看原型链，不证明构造器的赋值已经发生。`extends` 是多连一级链，`super` 调用父构造器并在方法里继续查找。

忘记 `new` 时类会抛错，这比漏到全局的字段更安全。可变数组放在原型上会被所有实例共享，放在构造器里才是每架一份。下一章处理清单从文本来的时候：`JSON.parse` 要么给你对象，要么抛错，字段形状它并不负责。

## 练习

1. 写类 `Note`，构造器接收 `title`，方法 `label` 返回 `"记:"` 加标题。`new Note("活着")` 后打印 `label()`，并打印 `instanceof Note` 的结果。

::: answer 参考答案
```js run expect="记:活着" title="参考答案"
class Note {
  constructor(title) {
    this.title = title;
  }
  label() {
    return "记:" + this.title;
  }
}
const note = new Note("活着");
console.log(note.label());
console.log(note instanceof Note);
```
:::

2. 写类 `Pile`，构造器里 `this.names = []`，方法 `add` 使用 `push`。造两堆，只往第一堆加入 `"围城"`。打印第一堆的连接结果和第二堆的长度。

::: answer 参考答案
```js run expect="0" title="参考答案"
class Pile {
  constructor() {
    this.names = [];
  }
  add(title) {
    this.names.push(title);
  }
}
const a = new Pile();
const b = new Pile();
a.add("围城");
console.log(a.names.join(","));
console.log(String(b.names.length));
```
:::

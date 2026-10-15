---
language: js
chapter: 6
title: "找不到的属性去问原型"
level: intermediate
minutes: 26
goals:
  - "区分对象自己的字段和原型上的字段"
  - "写一个影子属性盖住原型而不改原型"
  - "用 hasOwnProperty 与 in 得到不同的答案"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

一本书不只是一个标题字符串。它有标题，有页数，也许还有「这本在哪一层架子上」。若每本书都写一遍 `shelf: "在读"`，重复本身不是问题，问题是改架子名称时要改每一本。JavaScript 的对象查找允许把共同的字段放在原型上：自己没有的属性，就去原型对象上找，原型没有再往上，直到没有原型。找到即停。这个机制是共享的另一种形式。数组那一章共享的是整个清单的身份；这里共享的是一份默认字段，每本书仍是自己的对象。

`Object.create(proto)` 造一个新对象，它的原型是 `proto`，自己一开始没有字段。然后给它挂上 `title`。读 `title` 读到自己的字段。读 `shelf` 时自己没有，于是读到原型上的 `"在读"`。打印看起来这本书「有架子」，问它这个字段是不是自己的，答案是否。

```js run expect="false" title="架子在原型上"
const shelfProto = { shelf: "在读" };
const book = Object.create(shelfProto);
book.title = "边城";
console.log(book.title);
console.log(book.shelf);
console.log(Object.prototype.hasOwnProperty.call(book, "title"));
console.log(Object.prototype.hasOwnProperty.call(book, "shelf"));
```

四行是 `边城`、`在读`、`true`、`false`。`hasOwnProperty` 只看自己，不看原型。调用时写成 `Object.prototype.hasOwnProperty.call(book, "shelf")`，是为了不依赖 `book.hasOwnProperty` 这个属性查找。若原型上有人把 `hasOwnProperty` 盖成别的值，`book.hasOwnProperty(...)` 会调用错函数。从 `Object.prototype` 上拿原始函数，再用 `call` 把 `book` 当作 `this`，问的就是这本。这和函数章的 `this` 是同一条规则。

`in` 运算符会沿着原型走。`"shelf" in book` 为真，`"author" in book` 为假。`in` 回答「查找会不会找到」，`hasOwnProperty` 回答「是不是这本自己写的」。删除时两者的差别会变成行为：`delete book.shelf` 在 `shelf` 只存在于原型上时，删不掉原型的字段，它只试图删自己的字段，自己又没有，于是原型上的 `"在读"` 还在。要改所有书的默认架子，改 `shelfProto.shelf`。要让一本书例外，在这本书上写一个同名字段，把自己的查找挡住。这叫影子。影子不修改原型，其他书仍看见原来的默认值。

```js run expect="读完" title="影子挡住原型"
const shelfProto = { shelf: "在读" };
const book = Object.create(shelfProto);
const other = Object.create(shelfProto);
book.title = "边城";
book.shelf = "读完";
console.log(book.shelf);
console.log(other.shelf);
console.log(shelfProto.shelf);
```

三行是 `读完`、`在读`、`在读`。`other` 没有影子，所以仍走到原型。这是原型共享的取舍。改原型，所有没盖住该字段的书一起变，适合真正的默认值，例如架子名称。不适合每个人的阅读进度。进度必须写在自己身上，否则你给《边城》标记读完，原型上的字段一改，《围城》也读完了。方法和默认值适合放原型，因为函数体不携带某一本的页数，页数在调用时从 `this` 取。数据若会按本变化，放在自己身上。

查找失败不是错误。`book.author` 没有这个字段，原型上也没有，结果是 `undefined`。拼写错误和「确实没有作者栏」在结果上一样。这是早期脚本语言的选择：对象像一张可以缺格的表，缺格很常见，不值得每次都抛错。代价是 `book.auther` 这种笔误会静静地变成 `undefined`，再被真值判断跳过，输出里少一本书名，却没有栈。想让笔误响一点，可以在读取前用 `in` 或 `hasOwnProperty` 检查，缺了就抛。响的代价是合法的可选字段也要先声明「可以没有」，否则每次缺作者都是异常。阅读清单把 `title` 当成必有、`author` 当成可选：必有的缺失用检查抓住，可选的缺失保持 `undefined`。

```js run expect="undefined" title="没有的字段是 undefined"
const shelfProto = { shelf: "在读" };
const book = Object.create(shelfProto);
book.title = "围城";
console.log(String(book.author));
console.log("author" in book);
console.log("shelf" in book);
```

`String(undefined)` 得到文本 `"undefined"`，所以第一行看得见。第二行 `false`，第三行 `true`。不要用 `book.author == null` 来同时表示「没有作者」和「作者栏是空」，除非你确定两种都叫缺失。值那一章的约定在这里仍然有效。

对象字面量 `{ title: "边城" }` 的原型是 `Object.prototype`，不是空的。所以每本书都能调用 `toString`，即使你没写这个方法。`toString` 的默认结果不适合当书名打印。这就是为什么本课用自己拼的字符串做输出。原型链的顶端提供这些通用方法，也提供了刚才的 `hasOwnProperty`。你的字段名若叫 `toString` 或 `constructor`，会挡住这些方法。书目数据不要用这些名字。挡住以后，有的库会在调用 `book.toString()` 时期待函数，拿到字符串就会坏。

键一般是字符串。数字下标在数组里其实也是字符串键 `"0"`、`"1"`。普通对象不要拿来模拟有序清单，顺序虽然对字符串键有一套枚举规则，但阅读顺序用数组更直接。对象负责一本里的字段，数组负责很多本的顺序。两者叠在一起：`shelf` 是数组，元素是对象。`map` 仍是浅复制，元素对象仍共享。改 `shelf[0].title`，所有指向该对象的数组都会看见。要得到独立的书，造一个新对象，把字段抄过去，而不是只 `slice` 数组。

`Object.create(null)` 造一个没有原型的对象。它没有 `toString`，也没有 `hasOwnProperty`。用来做纯字典时，可以避免键 `"shelf"` 和原型方法相撞——其实方法名才是风险，键 `"toString"` 才危险。没有原型的对象，`in` 只看自己。本课的书不用这一种，因为我们确实想要原型上的默认架子。知道它可以没有原型，是为了理解「查找走到头」是一种选择，不是所有对象都必须继承 `Object.prototype`。

枚举 `for (const key in book)` 会走到原型上可枚举的字段。`shelf` 若可枚举，循环里会出现 `"shelf"` 和 `"title"`。`hasOwnProperty` 可以在循环里把原型字段滤掉。数组不要用 `for in` 来走下标，它会把别的可枚举属性也走出来，顺序也不是阅读顺序。走数组用下标或 `for...of`。`for...of` 走的是迭代器，下一组章节会讲它怎么暂停。对象默认不能 `for...of`，除非你给它迭代器。现在用数组保存顺序。

`Object.keys` 只列出自己的可枚举字符串键，不列原型上的架子。`for...in` 会列到原型上那些可枚举的键。同一本书，两种遍历给出的字段集合可能不同。复制书目时若用 `for...in` 再赋值，可能把原型上的默认架子抄成自己的字段，之后再改原型，这本书就不再跟着变。那也许是你想要的快照，也许是你把共享意外切断了。要快照就明确抄写你关心的键，例如只抄 `title` 和 `pages`。要继续共享默认架子，就不要把原型字段抄到自己身上。

`Object.assign` 把源对象自己的可枚举字段抄到目标上，属于浅复制。嵌套的对象仍然共享。书若只有标题和页数这些原始值，浅复制就得到独立的一本。书若有一个 `tags` 数组，两本会共享这个数组，对其中一本 `push` 标签，另一本也看得到。这和数组章的浅 `slice` 是同一边界，只是发生在字段里面。深层隔离要自己造新的 `tags` 数组。语言后来提供的结构化克隆能做深拷贝，这个抽屉的例子不依赖它，免得把「克隆一切」写成默认动作。克隆会丢掉函数和原型。书的方法若在原型上，克隆出来的是纯数据，方法没了。数据用复制，行为用原型，不要指望一次克隆两者都在。

冻结是另一端的取舍。`Object.freeze` 阻止再增删改自己的字段，嵌套对象仍可改，除非你也冻它们。冻结之后，`push` 若发生在字段里的数组上，数组本身没被冻就仍然能推进去。冻结适合当成「这本已经归档」的标记，不适合当成安全边界。它抛错或静默失败取决于严格模式。严格模式下改冻结字段会抛 `TypeError`。本课不冻结三本书，因为后面还要给某一本加影子字段。知道冻结的存在，是为了理解「常量」从来不是一个词：`const` 管名字，`freeze` 管对象自己的字段，两者都不自动管到嵌套数组。

读取器 `get` 可以把 `label` 写成看起来像字段的函数。访问 `book.label` 会调用函数，不需要括号。这很像方法，却藏起了调用。调试时你看不见括号，就想不到这里会跑代码。清单的 `label` 用普通方法并写上括号，调用点是明显的。读取器适合真正由别的字段算出来、又不想让调用方传参数的值。一旦计算会改数据，就不要放进读取器。读应该像读。

键的顺序在 `Object.keys` 里有一套规则：整数样的键按数值，其余字符串键按加入顺序。书的字段名是 `title`、`pages`，不是下标，顺序对打印影响很小。不要依赖对象枚举顺序来当阅读顺序。阅读顺序放在数组里。对象只保证你用名字能取回那一格。

计算属性名让键来自一个表达式。`{ [status]: true }` 在 `status` 为 `"done"` 时得到键 `done`。这比先造对象再赋值短，也更容易把键拼错，因为拼错的表达式仍会成功创建一个你没打算要的键。书的字段名是固定的，优先写死 `title` 和 `pages`。只有在把表格行收成字典、键确实来自数据时才用计算属性。数据里的键若包含 `__proto__`，用普通赋值有历史上的风险，用 `Object.create(null)` 做字典可以避开原型污染。阅读清单的键不来自外部字符串，因此用普通对象即可。外部键进字典之前，拒绝 `"__proto__"` 和 `"constructor"` 这类名字。拒绝是边界检查，不是原型机制本身会替你完成的。

`Object.getPrototypeOf` 让你看见链的下一环，调试共享架子时能确认书的原型是不是你创建的那个对象。不要在业务逻辑里靠改这条链来切换「在读」和「读完」。切换用自己的字段。改链会影响 `instanceof` 和方法查找，影响面比改一个布尔大得多。字段改错了，只是这一本的状态错；链改错了，这一本的方法可能全部换掉。

## 小结

属性查找先看对象自己，没有再看原型，直到链结束。结束时得到 `undefined`，不抛错。`hasOwnProperty` 只承认自己的字段，`in` 承认整条链上找得到的字段。给一本书写同名字段会挡住原型，其他书不受影响；改原型上的值则会影响所有没挡住的书。

默认架子可以共享，阅读进度不要共享。方法以后也可以放在原型上共享函数体，实例用 `this` 区分，那是类语法要写的东西。下一章会说明 `class` 并没有引入新的类型系统，它是书写这些原型链接的一种语法。

## 练习

1. 用 `Object.create` 把 `{ place: "架A" }` 当作原型，造一本书，自己的 `title` 是 `"城南旧事"`。打印标题、地点，以及 `place` 是不是自己的字段。最后一行应是 `false`。

::: answer 参考答案
```js run expect="false" title="参考答案"
const proto = { place: "架A" };
const book = Object.create(proto);
book.title = "城南旧事";
console.log(book.title);
console.log(book.place);
console.log(Object.prototype.hasOwnProperty.call(book, "place"));
```
:::

2. 同一原型 `{ place: "架A" }` 上造两本书。只给第一本写 `place: "架B"`。打印两本的 `place`，应分别是 `架B` 和 `架A`。

::: answer 参考答案
```js run expect="架A" title="参考答案"
const proto = { place: "架A" };
const first = Object.create(proto);
const second = Object.create(proto);
first.place = "架B";
console.log(first.place);
console.log(second.place);
```
:::

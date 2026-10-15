---
language: js
chapter: 12
title: "一份带类型的阅读清单"
level: advanced
minutes: 28
goals:
  - "用接口把标题、页数和是否读完放在一起"
  - "写出不修改原数组的未读筛选和页数合计"
  - "在边界上拒绝缺标题的对象而不是依赖断言"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

前面每一章都在同一份阅读清单上多放一件东西：值的种类、字符串比较、真值、闭包、数组身份、原型、类、解析、生成器和微任务。这一章把清单收成一份可以单独运行的记录。围栏仍是 TypeScript。类型写在书、数组和函数上，运行时仍是去掉标注之后的 JavaScript。三本书是固定的：《边城》已读完，120 页；《围城》未读，220 页；《城南旧事》未读，160 页。例子之间不共享变量，所以每段都把这三本再写一遍。重复是为了让每一段能单独运行，不是类型系统要求你复制数据。

一本书的形状用接口固定下来。`title` 是字符串，`pages` 是数字，`done` 是布尔。布尔用来表示读完，不用文本 `"false"`，也不用 `0` 和 `1`。这样真值判断即使被误用在 `done` 上，`false` 仍然表示未读，而不会和零页缠在一起。页数仍然可以是 `0`，它和 `done` 是两个字段。

```ts run expect="边城,围城,城南旧事" title="三本书的标题"
interface Book {
  title: string;
  pages: number;
  done: boolean;
}
const shelf: Book[] = [
  { title: "边城", pages: 120, done: true },
  { title: "围城", pages: 220, done: false },
  { title: "城南旧事", pages: 160, done: false }
];
function titles(list: Book[]): string {
  return list.map((book) => book.title).join(",");
}
console.log(titles(shelf));
```

`titles` 使用 `map`，交回新数组再 `join`，参数 `list` 不会变长，也不会换元素。返回类型写成 `string`，因为打印需要的是一行文字，不是数组。若返回 `Book[]`，调用方还要再决定怎么显示。把显示收成字符串是这一层函数的职责，保持书的数组不动是它的约束。约束没有写进运行时的禁止，只写在「函数体里没有 `push`」这件事上。读代码时看它有没有改参数，比看它的返回类型更可靠，因为返回类型会被去掉。

未读的书要留下标题。条件写 `book.done === false`，不写 `if (!book.done)` 的反面当唯一文档——虽然布尔上两者相同。写 `=== false` 是为了和页数的筛选区分开：页数不能用真值，布尔可以，但清单代码里两种字段挨在一起，显式比较更不容易在复制时把 `pages` 也放进 `if (!book.pages)`。

```ts run expect="围城,城南旧事" title="未读的标题"
interface Book {
  title: string;
  pages: number;
  done: boolean;
}
const shelf: Book[] = [
  { title: "边城", pages: 120, done: true },
  { title: "围城", pages: 220, done: false },
  { title: "城南旧事", pages: 160, done: false }
];
function unfinished(list: Book[]): string {
  const names: string[] = [];
  for (const book of list) {
    if (book.done === false) names.push(book.title);
  }
  return names.join(",");
}
console.log(unfinished(shelf));
console.log(String(shelf.length));
```

第二行是 `3`。`names` 是新数组，`push` 推的是它，不是 `shelf`。`shelf.length` 仍是三本。若有人把 `names` 换成直接 `list.push`，长度会变成四，未读函数就篡改了清单。类型标注成 `Book[]` 不会阻止 `push`。要阻止，要么不把可变操作写进函数，要么在团队的检查器里使用只读数组并打开检查。这里用新数组，是运行时真正有效的那种保护。

页数合计把三本加在一起，包括已经读完的。合计是 `500`。累加器从 `0` 开始，`0` 是数字，不是空串。若初值写成 `""`，第一次加号就会变成拼接，后面会得到一串粘在一起的数字文本。初值的种类决定了加号的含义，这是字符串章的规则，类型标注 `: number` 在这里被去掉之后帮不上忙。所以初值写成数字 `0`，让运行时和标注一致。

```ts run expect="500" title="页数合计"
interface Book {
  title: string;
  pages: number;
  done: boolean;
}
const shelf: Book[] = [
  { title: "边城", pages: 120, done: true },
  { title: "围城", pages: 220, done: false },
  { title: "城南旧事", pages: 160, done: false }
];
function total(list: Book[]): number {
  let sum = 0;
  for (const book of list) {
    sum = sum + book.pages;
  }
  return sum;
}
console.log(total(shelf));
```

空清单的合计是 `0`。这和「没有清单」不同。函数要求参数是数组，调用方若传入 `null`，去掉类型之后会在 `for...of` 上抛错。标注没有挡住。边界若可能接到 JSON，就不要直接把解析结果当作 `Book[]`。先确认它是数组，再确认每个元素的三个字段。确认通过后，再调用 `total`。下面把这个边界写出来，不使用 `as`。

```ts run expect="缺标题" title="边界上检查形状"
interface Book {
  title: string;
  pages: number;
  done: boolean;
}
function accept(value: unknown): Book | string {
  if (typeof value !== "object" || value === null) return "不是对象";
  const rec = value as { title?: unknown; pages?: unknown; done?: unknown };
  if (typeof rec.title !== "string" || rec.title === "") return "缺标题";
  if (typeof rec.pages !== "number") return "页数不是数字";
  if (typeof rec.done !== "boolean") return "读完标记不对";
  const book: Book = { title: rec.title, pages: rec.pages, done: rec.done };
  return book;
}
function line(value: unknown): string {
  const got = accept(value);
  if (typeof got === "string") return got;
  return got.title + "/" + String(got.pages);
}
console.log(line({ title: "边城", pages: 120, done: true }));
console.log(line({ pages: 120, done: false }));
console.log(line(JSON.parse('{"title":"","pages":1,"done":false}')));
```

这里的 `as` 只发生在已经确定 `value` 是非空对象之后，把索引的方式说成「三个可选的未知字段」。它没有把对象声称成 `Book`。真正成为 `Book` 的那一行，是三个 `typeof` 都通过之后的对象字面量。空标题被拒绝，因为清单上不收没有名字的书。`JSON.parse` 放在调用里，合法文本会变成对象再走同一套检查。若文本非法，`JSON.parse` 仍会抛，这一段没有包 `try`，因为三份输入都是我们自己写的合法值。导入外部文本时，把 `try` 包在解析上，再把结果送进 `accept`。两步不要并成一个宽的 `try`，理由在错误那一章已经说过。

`unknown` 比 `any` 更合适做边界参数。`any` 去掉之后和 `unknown` 一样什么都不留，但在有检查器时，`any` 允许你直接读 `value.title` 而不判断。`unknown` 强迫你先收窄。这个抽屉不检查，所以两者都能跑。写 `unknown` 是给下一份会打开检查器的代码留门，也提醒读的人：这里的值还不可信。不可信来自 JSON，不来自上面那份手写的 `shelf`。手写的 `shelf` 用 `Book[]`，因为元素是我们逐个写出来的。两种标注对应两种来源。

未读合计可以叠在已有函数的思路上，而不必改原数组：走一遍，`done === false` 时才把 `pages` 加进去。《围城》220 加《城南旧事》160，是 `380`。《边城》已读，不计入。这个函数和 `total` 的差别只有条件。把条件放进函数，而不是在调用前先 `filter` 再合计，是为了少一次数组分配。清单只有三本，分配无所谓。写成一次循环，是让「未读」和「页数」两个字段的使用出现在同一段里，读的人能看见它们没有被真值表混用。

若要把清单的制造写成闭包，可以让 `add` 记住数组并返回第几本。类型写在返回的函数上，记忆仍是闭包，不是接口的能力。接口描述不了「这个函数记住了哪一个数组」。那是运行时的环境。标注函数类型 ` (title: string) => number ` 只说明参数和返回值。共享数组的可变性要靠你自己不把数组再交出去。项目变大时，这个隐藏的共享比缺一个标注更危险。小清单里，返回新数组的函数比闭包共享更容易推演，所以本章的 `titles` 和 `unfinished` 都不改入参。

类可以和接口并存：`class ShelfItem implements Book` 在有检查器时要求类的实例具备那三个字段。去掉之后 `implements` 不留下代码。本章不用类，因为没有需要共享的方法。打印用的是函数。若 `label` 要共享函数体，再回到类，把数据放在构造器里。不要为了「项目应该面向对象」而加一个没有行为的类。没有行为的类，运行时只是一个必须 `new` 的构造函数，接口加对象字面量更短，也更接近 JSON 的形状。

把三本书的构造收成一个函数，可以减少每一段重复书写时的笔误。函数接收标题、页数和是否读完，返回符合接口的对象。调用方仍然把三个返回值放进数组。这个函数是同步的、纯的，不碰外层数组。它不代替边界检查：参数若已经标注成 `string` 和 `number`，手写调用会按标注去写，外部 JSON 仍要先经过 `unknown` 那一道。两道入口不要合成一个「什么都接受」的函数。合成之后，手写的路径也会被迫处理缺字段，代码变长；或者外部路径偷偷使用断言，检查消失。分开写，手写路径短，外部路径严。

显示一行报告时，把未读本数和总页数放在一起。未读本数是整数，来自数 `done === false` 的次数，不是来自真值。总页数来自上一节的加法。两句打印都用字符串拼接，数字先变成文本再接上汉字说明。说明和数字之间不要依赖 `console.log` 的空格去当格式，因为多个参数的空格容易在以后改成一个参数时消失。格式由你自己的字符串负责，日志函数只负责输出。这样期望子串就是你拼出来的那一行，稳定。

排序不应该改这份作为记录的数组。若要按页数从少到多显示，先 `slice` 再排序，比较函数返回页数差。原数组保持《边城》《围城》《城南旧事》的放入顺序。放入顺序是阅读计划，页数顺序是另一种视图。视图用新数组，计划用原数组。类型上两者都是 `Book[]`，区分不了「这是不是视图」。名字要帮这个忙：`byPages` 表示视图，`shelf` 表示计划。不要把排序的结果赋回 `shelf`，除非你确定计划本身就要改。类型不会阻止这个赋值。

一篇清单脚本的边界就这些：内部数据可信，用接口；外部文本不可信，用 `unknown` 和检查；显示不改数据；合计从数字开始加。类、生成器、Promise 都不需要出现在这一份里。它们解决的问题这一份还没有。没有网络等待，就不要把 `titles` 写成 `async`。没有上千页的懒序列，就不要用生成器交这三本。没有共享方法，就不要 `class`。把用不上的工具加进来，只会让去掉类型之后的脚本更长，并且引入 `this` 或微任务顺序这些这里不需要承担的规则。工具留到问题出现。问题出现时，前面各章已经把代价写过了：`push` 改的是共享的那一份，`==` 会把空串说成零，宽的 `try` 会把缺字段说成坏语法。这份收束的清单避开这三件事，比多写几个高级语法更重要。

报告函数可以返回多行文本，由调用方一次打印。例如第一行是未读书名，第二行是合计。返回值用换行接起来，调用方不再分别拼。这样格式集中在一处，改分隔符不会漏掉某一个 `console.log`。测试时期望子串可以只取其中一行，例如合计的数字，避免整段报告一变就改许多期望。集中格式的代价是函数要知道显示语言。若以后要换一种语言的说明文字，这个函数会变成唯一的修改点，这是好事。不要在循环里直接打印，否则顺序和措辞散落在分支中，你很难一眼看见读者最终读到的版式。

空书架是合法的 `Book[]`。合计为 `0`，未读标题是空字符串。空字符串打印出来是空行，调用方可能以为函数没运行。需要区分时，空清单返回 `"没有书"`，这是显示上的决定，不把空数组改成 `null`。数组留在数据层，句子留在显示层。数据层的空用长度判断，显示层的空用你写的那句说明。两层各有各的空，和整本书里 `null` 与 `undefined` 的分工是同一个习惯：不要让一种空兼任所有含义。

## 小结

带类型的阅读清单把标题、页数和是否读完放在接口里。`map` 和新建数组用来产生标题行，原清单的长度保持不变。合计从数字 `0` 加起，避免加号变成拼接。未读用 `done === false`，不用页数的真值。

从未知值进来时，先排除 `null`，再逐个看字段，通过之后才放进 `Book`。断言只帮助读取未知字段，不代替检查。类型在这个抽屉里会被去掉，所以保护来自没有 `push` 原数组、以及边界上的 `typeof`。清单再增长时，仍用同一份三字段的形状，而不是换一套只存在于注释里的约定。

## 练习

1. 按本章的三本书造 `Book` 数组，写函数只合计 `done === true` 的页数。打印结果，应是 `120`。

::: answer 参考答案
```ts run expect="120" title="参考答案"
interface Book {
  title: string;
  pages: number;
  done: boolean;
}
const shelf: Book[] = [
  { title: "边城", pages: 120, done: true },
  { title: "围城", pages: 220, done: false },
  { title: "城南旧事", pages: 160, done: false }
];
function donePages(list: Book[]): number {
  let sum = 0;
  for (const book of list) {
    if (book.done === true) sum = sum + book.pages;
  }
  return sum;
}
console.log(donePages(shelf));
```
:::

2. 写 `labelOf`，参数类型是 `unknown`。对象有字符串 `title` 时返回 `"《" + title + "》"`，否则返回 `跳过`。对 `{ title: "围城" }` 和 `{ pages: 1 }` 各打印一行。

::: answer 参考答案
```ts run expect="《围城》" title="参考答案"
function labelOf(value: unknown): string {
  if (typeof value !== "object" || value === null) return "跳过";
  const rec = value as { title?: unknown };
  if (typeof rec.title !== "string" || rec.title === "") return "跳过";
  return "《" + rec.title + "》";
}
console.log(labelOf({ title: "围城" }));
console.log(labelOf({ pages: 1 }));
```
:::

---
language: js
chapter: 8
title: "JSON.parse 失败时用 try 接住"
level: intermediate
minutes: 26
goals:
  - "解析一条合法的书目文本并读出标题"
  - "用 try 接住坏 JSON 的 SyntaxError"
  - "把缺字段的 TypeError 和语法错误分开"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

阅读清单不一定写在源码的数组里。它常常先是一段文本，例如 `{"title":"边城","pages":120}`。`JSON.parse` 把这种文本变成值：对象、数组、字符串、数字、布尔或 `null`。它不认识函数，不认识 `undefined`，也不认识注释。单引号、末尾逗号，在 JSON 里都是语法错误。解析成功，你得到普通的对象，没有你的类，也没有原型上的 `label`。解析失败，它抛出 `SyntaxError`，后面的语句不会再执行，除非你把抛出接住。

`try` 后面的块若抛了，就跳到配对的 `catch`。`catch` 拿到错误对象。没有被接住的错误会终止这次脚本，终端里是栈，而不是你准备好的书名。对外部文本来说，语法坏了是预料之中的结果，应该变成清单上的一句「这行不能读」，而不是让整份脚本停掉。对自己写出的 `book.label()` 这种调用，若也用同一个 `catch` 吞掉，笔误就和坏输入长得一样。范围是这一章的判断：`try` 尽量只包住 `JSON.parse`。

```js run expect="边城" title="合法文本变成对象"
const raw = '{"title":"边城","pages":120}';
const book = JSON.parse(raw);
console.log(book.title);
console.log(book.pages);
console.log(typeof book);
```

三行是 `边城`、`120`、`object`。键必须是双引号字符串。数字 `120` 在 JSON 里是数字，解析之后也是数字，不是 `"120"`。这一点和上一章的表单文本不同。若你的文件里页数带了引号，解析结果就是字符串，随后的加法会拼接。解析成功不等于字段种类正确。`JSON.parse` 只保证文本符合 JSON 语法，并给出对应的值。

坏文本用紧的 `try` 接住。

```js run expect="SyntaxError" title="坏文本抛语法错误"
const raw = '{"title":"边城",}';
try {
  JSON.parse(raw);
  console.log("通过");
} catch (err) {
  console.log(err.name);
}
```

末尾逗号让这一行非法。输出是 `SyntaxError`，不会是 `通过`。`err.name` 比 `err.message` 稳定，消息文本会带着位置，不适合当期望子串的全部内容，但可以用来读给自己看。接住之后，函数可以返回一个表示失败的值，例如 `null`，让调用方用值那一章的方式处理。也可以在 `catch` 里再抛一个自己的错误。再抛的取舍是：调用方仍要用 `try`，但错误的含义变成「书目行坏了」，而不是解析器的内部名称。本课在例子里打印名称，让失败看得见。

成功解析之后，形状仍要检查。文本 `{}` 是合法 JSON，对象里没有 `title`。对 `book.title.length` 的访问会抛 `TypeError`，因为 `undefined` 没有 `length`。若这个访问和 `JSON.parse` 写在同一个 `try` 里，`catch` 会同时看见 `SyntaxError` 和 `TypeError`。把两者都说成「坏输入」，你就会去改文本，而文本其实是合法的，缺的是字段。

```js run expect="TypeError" title="过宽的 try 会混进缺字段"
function loadWide(raw) {
  try {
    const book = JSON.parse(raw);
    return "len:" + book.title.length;
  } catch (err) {
    return err.name;
  }
}
console.log(loadWide('{"title":"边城"}'));
console.log(loadWide("{"));
console.log(loadWide("{}"));
```

三行是 `len:2`、`SyntaxError`、`TypeError`。第三行不是坏语法。把 `try` 收紧之后，缺标题可以变成一句自己的话，而不是错误名称。

```js run expect="页数不是数字" title="语法和形状分开处理"
function load(raw) {
  let book;
  try {
    book = JSON.parse(raw);
  } catch (err) {
    return "语法坏了";
  }
  if (typeof book !== "object" || book === null) return "不是对象";
  if (typeof book.title !== "string") return "缺标题";
  if (typeof book.pages !== "number") return "页数不是数字";
  return book.title + "/" + book.pages;
}
console.log(load('{"title":"围城","pages":220}'));
console.log(load("{"));
console.log(load('{"title":"围城","pages":"很多"}'));
console.log(load("null"));
```

`JSON.parse("null")` 成功，得到 `null`。不检查的话，下一行 `book.title` 抛 `TypeError`。值那一章的洞在这里再出现一次：`typeof null` 是 `"object"`，所以检查写成 `typeof book === "object" && book !== null`。四行输出里应有 `围城/220`、`语法坏了`、`页数不是数字`、`不是对象`。页数是文本 `"很多"` 时，语法是好的，我们拒绝它，因为清单需要数字。这个拒绝是我们的规则，不是 JSON 的规则。

`throw` 用来把「不能继续」变成一次跳转。`throw new Error("缺标题")` 会带着消息。自定义时看 `err.message`，也看 `err.name`。不要用 `throw` 来做普通分支：缺一本可选的笔记并不是失败，返回 `null` 更合适。`throw` 的代价是调用方必须记得接，否则整份脚本停。适合停的情况是：程序员把必有的标题写丢了，继续跑只会打印出一串缺字。不适合停的情况是：一份导入文件里有一行坏了，其余行还可以读。对文件里的一行，接住并记录；对程序自己的不变量，让它抛。

`finally` 里的语句无论 try 成功还是失败都会走，用来释放你确实拿着的资源。这个抽屉里没有需要关闭的文件句柄。若 `finally` 里又 `return`，它会盖住 `try` 里准备返回的书名。那很意外。没有资源要释放时，不要写空的 `finally`。它不使代码更安全，只多一条所有路径都会撞上的出口。

`catch` 的参数若不用，仍要接住，否则错误会继续往外。接住之后什么都不做，叫吞掉。吞掉适合你已经用返回值表达了失败、并且确定没有别的错误会混进来的时候。宽 `try` 加上空 `catch` 是最难查的组合：语法错误、笔误、`null` 访问全部消失，输出只是一份少了几本的清单。本课的 `catch` 都把结果写成可见的文字。

解析出来的对象是全新的普通对象。你在类那一章定义的 `Entry.prototype.label` 不会自动出现。想要方法，就用解析出的 `title` 和 `pages` 去 `new Entry(...)`，并在 `new` 之前做完种类检查。不要 `Object.setPrototypeOf` 去硬接原型，除非你非常清楚链上的方法会读哪些字段。硬接之后，缺字段的 `label` 仍会在调用时失败，失败只是来得更晚。早检查比晚接原型更明显。

错误对象上常用的是 `name` 和 `message`。`JSON.parse` 的 `message` 会带出位置，适合人读，不适合拿整句去比测试，因为位置文本可能随着引擎措辞变化。比 `name` 就够。栈在 `stack` 上，同样不稳定，而且可能很长。教学输出不打印栈。你自己排错时可以看栈的第一行，确认抛出点在 `JSON.parse` 还是在后面的 `.length`。第一行若在你的检查函数里，就不是语法问题。

接住之后再抛，要把原因留住。`catch` 里 `throw err` 原样抛出，调用方仍看见 `SyntaxError`。若你 `throw new Error("语法坏了")`，原来的位置信息就断了，除非你把旧错误附在新错误上。这个引擎不一定支持标准的 `cause` 字段被打印出来。小例子里要么原样再抛，要么返回文字，不要造一个丢失位置的新错误还以为自己包了一层更好的说明。包装的价值在于分类，代价是线索变少。只在分类真的帮助调用方分支时才包装。

`JSON.stringify` 对这本书的对象会留下 `title` 和 `pages`，丢掉函数和值为 `undefined` 的字段。`NaN` 和 `Infinity` 会被写成 `null`。若页数因为转换失败变成了 `NaN`，写进文本再读回来会变成 `null`，你分不清当初是「不是数字」还是「明确的空」。所以在 `stringify` 之前就把 `NaN` 拒绝掉，不要让它悄悄变成 `null` 再被下一轮解析接受。往返不是身份保留。它只保留 JSON 能表达的那些值。

循环解析多行时，一行失败不应丢掉已经解析的那些行。函数返回失败说明，调用方把说明推进错误列表，把成功的书推进书架。这和「一抛就停」不同。停适合配置文件只有一份、坏了就不能启动的情况。书架的导入往往是许多本，一本坏标题不应该让前面的《边城》也消失。把「收集错误」和「遇到错误就抛」分成两种函数，名字上写清楚。不要用一个布尔参数切换两种行为，调用点会看不清这次到底停不停。

`finally` 若抛出自己的错误，会盖住 `try` 里原来的 `SyntaxError`。你看见的是收尾失败，语法问题被吞了。收尾代码应是不会失败的清理。没有清理就不要写 `finally`。这个约束比「有 `try` 就配 `finally`」更重要。配对不是语法要求，`catch` 可以单独存在。

解析数字页数时，`JSON.parse` 不会替你把 `"120"` 收成数字。引号里的是字符串，这是合法 JSON。检查 `typeof pages !== "number"` 会拒绝它，然后你可以选择再 `Number` 一次，或要求对方改文件。自动再转一次更宽容，也把 `"120"` 和 `120` 混成同一种书。宽容适合手工表格，严格适合已经约定好的接口。本课的接口约定页数是 JSON 数字，因此拒绝字符串页数，不在解析后偷偷 `Number`。偷偷转换会让「很多」变成 `NaN` 再进入上一节说过的往返陷阱。拒绝则把问题停在边界，消息是「页数不是数字」，调用方知道要改文本而不是改加法。

多个 `catch` 分支在旧语法里做不到按类型分成几块，你只有一个 `catch`，里面自己看 `name`。看 `name` 是普通的 `if`，不是新的控制结构。`SyntaxError` 走「这行文本废了」，`TypeError` 走「我们的检查写漏了，不该出现在这个窄 `try` 里」。若 `TypeError` 出现在只包住 `JSON.parse` 的 `try` 中，优先怀疑解析器以外的代码被你不小心放了进来，而不是数据长得像类型错误。把范围缩回去，比加更多 `if` 更有效。

手动抛出时用 `Error` 或其子类，不要 `throw "缺标题"` 这种字符串。字符串没有 `name`，调用方的 `err.name` 会失败，因为你抛的根本不是对象。统一抛错误对象，`catch` 里才有稳定的形状。自己的子类在这个单文件里可以写成 `class ParseFail extends Error {}`，然后看 `instanceof`。`instanceof` 对跨多个全局环境的错误对象会失灵，这里只有一个环境，可以使用。若只是教学里的一行文本，返回字符串更简单，不需要子类。子类的价值是调用方能用类型分支，而不是用消息文字分支。消息文字会改，类的区分更稳。没有多个调用方时，不要为了一个 `catch` 发明子类。

`JSON.parse` 的第二个参数是复活函数，每遇见一个值就调用，可以改写字段。它能在解析过程中拒绝某些键，也能把数字页数换成别的。复活函数写错会让栈变得难读，因为抛出点在解析内部。本课把检查放在解析成功之后的普通代码里，调试时栈在我们自己的函数上。少一个钩子，多一段直直的判断，对这份短文本是更好的交换。

空字符串不是合法的 JSON 文本。`JSON.parse("")` 会抛 `SyntaxError`，和解析 `"null"` 成功得到 `null` 不同。导入文件里的空白行要在解析前跳过，不要交给 `JSON.parse` 再当成坏书。跳过空白是格式问题，坏括号才是语法问题。两者分开，日志里才知道该删空行还是该补引号。

## 小结

`JSON.parse` 把合法文本变成值，把非法文本变成 `SyntaxError`。`try` 只包住解析，形状用解析之后的 `typeof` 和 `=== null` 来查。过宽的 `try` 会把缺标题的 `TypeError` 和坏语法混在同一个 `catch` 里。

预料之中的坏行用返回值记下；程序不该继续的不变量用 `throw`。解析结果不是类的实例，要方法就在检查通过之后再构造。下一章不再一次造出全部页码，而是写一个生成器，每次只交出下一本或下一页。

## 练习

1. 解析 `'{"title":"活着","pages":190}'`，打印 `title` 和 `pages`。再对文本 `"["` 做解析，接住错误并打印 `err.name`。

::: answer 参考答案
```js run expect="SyntaxError" title="参考答案"
const book = JSON.parse('{"title":"活着","pages":190}');
console.log(book.title);
console.log(book.pages);
try {
  JSON.parse("[");
  console.log("通过");
} catch (err) {
  console.log(err.name);
}
```
:::

2. 写函数 `titleOf`，只在 `try` 里解析。成功且 `title` 是字符串时返回标题，否则返回 `不能读`。分别用于 `'{"title":"边城"}'`、`'{'` 和 `'{"pages":1}'`。

::: answer 参考答案
```js run expect="不能读" title="参考答案"
function titleOf(raw) {
  let book;
  try {
    book = JSON.parse(raw);
  } catch (err) {
    return "不能读";
  }
  if (typeof book !== "object" || book === null) return "不能读";
  if (typeof book.title !== "string") return "不能读";
  return book.title;
}
console.log(titleOf('{"title":"边城"}'));
console.log(titleOf("{"));
console.log(titleOf('{"pages":1}'));
```
:::

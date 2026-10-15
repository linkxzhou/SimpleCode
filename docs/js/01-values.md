---
language: js
chapter: 1
title: "大约七种值"
level: beginner
minutes: 26
goals:
  - "认出 undefined、null、布尔、数字、字符串、符号和对象"
  - "把缺页和明确的空页分成两种值"
  - "知道 typeof null 会回答 object"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

上一章的阅读清单只有一个标题。标题是字符串，页数是数字，这两样已经够做一个最小的条目。真正开始记账时，你会碰到第三种情况：这一格还没填。JavaScript 没有用一个统一的「空」把所有没填的格子收走，它留了两个值，`undefined` 和 `null`。本章先把语言里常见的值种类摊开，再专门看这两个，因为后面的相等、条件和对象查找都会回到这里。

说「大约七种」，是因为标准里的分类和 `typeof` 的回答并不整齐。你经常会遇到的是：`undefined`、`null`、布尔、数字、字符串、符号，以及对象。后来又加入了 `bigint`，`typeof` 对函数还会单独回答 `"function"`，尽管函数也是对象。数得刚好像七种的时候，总有一个兄弟站在边上。与其背一个会被下一版标准改写的整数，不如学会向值提问，并记住哪一种回答在撒谎。

`typeof` 对 `null` 的回答是 `"object"`。这是早期实现留下的洞，不是你的清单写错了。`null` 不是对象，它没有属性，你不能给它加 `title`。它只是一个表示「这里有意留空」的原始值。若你用 `typeof x === "object"` 来判断「这是一条书目」，`null` 会混进去。判断空位要写 `x === null`。判断没写要写 `x === undefined`，或者看 `typeof x === "undefined"`。两种写法对 `undefined` 是一致的，对 `null` 则完全不同。

```js run expect="object" title="typeof 对 null 的回答"
const missing = undefined;
const blank = null;
console.log(typeof missing);
console.log(typeof blank);
console.log(typeof true);
console.log(typeof 120);
console.log(typeof "边城");
console.log(typeof Symbol("shelf"));
console.log(typeof { title: "边城" });
```

七行依次是 `undefined`、`object`、`boolean`、`number`、`string`、`symbol`、`object`。第一行和第六行的 `symbol` 容易被忽略，因为日常清单用不到符号当键。符号的价值是：每个 `Symbol("shelf")` 都是一个新值，描述文字可以相同，值本身不相等。用它做属性名，不容易和字符串键 `"shelf"` 撞车。代价是它打印出来不直观，也不能直接放进 JSON。本章只把它算进种类，不拿它当书名。最后一行的对象和 `null` 那一行都显示 `object`，这就是那个洞。看输出时不要把第二行读成「空位其实是一个对象」。

数字这一类里还有 `NaN` 和 `bigint`。`Number("页")` 得不到页数，得到 `NaN`，意思是「不是一个数字」。`NaN === NaN` 为假，这是浮点规则，不是比较运算符坏了。要问「这个结果是不是失败的转换」，用 `Number.isNaN`。`bigint` 写成 `120n`，`typeof` 回答 `"bigint"`。它和普通数字不能直接相加，引擎会抛错。页数用普通数字就够，本章不把清单改成大整数。知道有这个兄弟，是为了以后看见 `n` 后缀时不要把它当成字符串。

函数的 `typeof` 是 `"function"`。把函数放进「大约七种」的对象那一格，是因为它可以被调用，同时又是对象，能挂属性。调用和挂属性是两件事。下一组章节才会用到调用。这里只要别写 `typeof fn === "object"` 来找函数，那一问会失败。

现在回到清单。一本书可以有标题，页数却还没填。属性不存在时，读出来是 `undefined`。你也可以把属性写成 `undefined`，读出来仍是 `undefined`，但 `"pages" in card` 为真，因为键在。第三种写法是把页数明确设为 `null`，表示「查过了，没有页数」，键当然也在。三种情况打印时很像，结构不同。

```js run expect="没写页数" title="没写、写成 undefined、写成 null"
function pagesOf(card) {
  if (!Object.prototype.hasOwnProperty.call(card, "pages")) {
    return "没写页数";
  }
  if (card.pages === undefined) {
    return "键在但值未定";
  }
  if (card.pages === null) {
    return "明确没有页数";
  }
  return "页数" + card.pages;
}
console.log(pagesOf({ title: "边城" }));
console.log(pagesOf({ title: "围城", pages: undefined }));
console.log(pagesOf({ title: "城南旧事", pages: null }));
console.log(pagesOf({ title: "活着", pages: 190 }));
```

四行分别对应：对象里根本没有 `pages`、键在而值是 `undefined`、值是 `null`、值是数字。若你只用 `card.pages === undefined` 来表示「没填」，前两种会并成一句，调用方就不知道该去补字段，还是该接受「字段在，只是还没决定」。这就是两个空值同时存在的原因。`undefined` 是语言的默认：参数没传、属性没有、函数没返回，都会落到它。`null` 是写程序的人放进去的空。默认值不该占用「我认真想过」的位置，所以语言没有把它们合成一个。

代价也很具体。每个读字段的人要决定自己认哪一种空。有的代码库禁止 `null`，缺了就用 `undefined`，少一个分支。有的接口用 `null` 表示删除或清空，用省略表示不修改。两种约定都能工作，混在同一份清单里就会互相误伤。本课的阅读清单采用一条本地规则：属性不出现表示还没录入；出现且为 `null` 表示录入过、确认没有；数字表示页数。不要用 `0` 表示「没有页数」，`0` 是一本零页的书，和空位不是一回事。零页在条件里还会被当成假，那是控制流那一章的坑，这里先把值留成数字 `0`，别塞进 `null`。

`==` 会把 `null` 和 `undefined` 说成相等，`===` 不会。本章的例子全部使用 `===`，就是为了不让这条宽松规则把刚刚分开的两种空再粘上。宽松相等的其他例子，尤其是空字符串和 `0`，放到字符串那一章用同一份页数字段来演示。现在如果提前写 `card.pages == null`，它会同时接住 `null` 和 `undefined`，有时这正是你要的「无论哪种空都跳过」，有时它会把「没写」和「确认没有」一起扔掉。选 `== null` 是一种压缩，压缩之前要确定两种空在这里真的同义。

布尔值只有 `true` 和 `false`。不要把字符串 `"false"` 当成布尔，那是四个字符的文本。不要把数字 `1` 和 `0` 当成布尔，尽管条件语句对它们另眼相看。清单上的「读完」若用布尔，就写成 `done: true`，不要写成 `done: "true"`。后者在严格相等里永远不等于 `true`。

```js run expect="false" title="字符串 false 不是布尔"
const done = "false";
console.log(done === false);
console.log(typeof done);
console.log(typeof false);
```

符号值得多看一行，因为它最容易被当成「另一种字符串」。`Symbol("shelf") === Symbol("shelf")` 为假。描述相同，值不同。对象那一章会用字符串键。若两个模块都想用 `"id"` 做内部字段，就会互相覆盖；符号键可以避开这件事。交换条件是：你不能指望 `JSON.stringify` 把符号键带出去，也不能用点号写 `book.某个符号`。大多数阅读清单用字符串键就够。知道符号是独立的值，是为了看见 `typeof` 回答 `"symbol"` 时不要把它修成对象。

对象是袋子，数组也是对象，`typeof []` 同样是 `"object"`。要区分数组，用 `Array.isArray`，不要靠 `typeof`。函数那一章之前，我们先不往袋子里放行为。这一章的对象只用来装标题和页数，让 `null` 有一个对照：对象可以加点，`null` 一点就抛错。`TypeError` 是引擎在保护你，不是清单数据坏了。把可能为 `null` 的条目先用 `=== null` 挡在属性访问之外，是读外部数据时的基本顺序。JSON 那一章会遇到解析结果，这里先记住访问之前要知道自己拿着的是袋子还是空位。

`undefined` 还可以来自函数没有 `return`。调用这样的函数，得到的就是 `undefined`，不是空字符串，也不是 `null`。打印它会看到单词 `undefined`。若你把返回值直接拼进标题，会得到 `"undefined"` 这几个字母混进句子里，那是字符串化的结果，原值并没有变成字符串，除非你用了加号或 `String`。这又是值和显示的差别。上一章说过 `console.log` 负责显示。显示成长得像单词，不代表程序里多了一个字符串值。

正零和负零在 `===` 里相等，在 `Object.is` 里不相等。页数用不到负零，除法却可能造出它。`1 / -0` 走向负无穷，而 `1 / 0` 走向正无穷。若你的目的是问「这是不是零页」，`=== 0` 会把负零算作零，阅读清单应该这样问。若你在查一个已经出错的比值，`Object.is` 能把符号留住。语言同时留下两种相等，是因为算法通常想把两个零当成同一个数，而有些数值过程想保留方向。不要在书目字段里存放负零，也不要写一个分支专门打印它。

`void` 把表达式的结果换成 `undefined`。旧代码写 `void 0`，是因为那时候全局名字 `undefined` 还能被改掉，人们需要一个造出未定义值的办法。严格模式下那个全局名字是只读的，直接写 `undefined` 就够。看见 `void` 不要把它读成函数调用，它也不产生 `null`。本课的例子不使用它，避免多一个看起来像空位的语法。

包装对象会打乱种类。`new Boolean(false)` 的 `typeof` 是 `"object"`，放进条件却算真，因为非空对象都算真。你手里以为是假，分支却走进去。`new Number(0)` 和 `new String("")` 同样不是原始值。方法调用时引擎会短暂把原始值包一下，`"边城".length` 就是这样取到 `2` 的，包完即丢。自己 `new` 出来的包装会留下来，真值、严格相等和 `JSON` 都会对它另眼相看。清单里只放字面量。

文本往返会吞掉一种空。`JSON.stringify` 省略值为 `undefined` 的字段，却会写下 `null`。解析回来之后，「键在且未定义」不再存在，只剩字段消失或 `null`。若你的约定必须区分这两种空，就不能只靠 JSON 文本。这是用 `null` 表示「确认过的空」的实际理由：它能穿过文本。`undefined` 适合还停在内存里的对象，例如函数没传的参数。符号键也过不了这份文本，导出前要改回字符串键。符号负责一次运行内部避免撞名，字符串负责你以后还读得懂的书名。

`bigint` 和普通数字相加会直接抛错，而不是悄悄得到一个浮点。页数保持 `number`。只有在整数大到不能用安全整数表达时才值得换成 `120n` 这种写法，并且整条计算都要用大整数，不能混用。安全整数的边界大约是 `2` 的 `53` 次方，书的页数离它很远。提前换成大整数，会让每一处加法都多一个后缀，却不增加正确性。

还有一种容易误认的值是函数参数的默认缺口。调用 `fn(title)` 时第二个参数若没写，函数内部那个名字的值就是 `undefined`，不是 `null`，也不是空串。你无法从调用括号里看见这个 `undefined`，它是语言补上的。因此「调用者没提页数」和「调用者写了 `null`」在函数里可以分开，只要你的参数不设默认值。一旦写成 `pages = 0`，没传和你本来就想区分的缺口都会变成 `0`，零页和缺页再次粘在一起。默认值是便利，便利的代价是一种调用方式消失了。清单的构造函数若要保留「没写」，就不要给这个参数默认值，让 `undefined` 留到函数体内再决定。

## 小结

常见的值可以粗分成未定义、空位、布尔、数字、字符串、符号和对象，再外加 `bigint` 和「函数」这种 `typeof` 的单独回答。`typeof null` 回答 `"object"` 是历史漏洞，判断空位要用 `=== null`。`NaN` 不等于自己，转换失败要用 `Number.isNaN` 来认。

阅读清单里，字段不存在和字段值为 `undefined` 读出来一样，但 `hasOwnProperty` 能把它们分开。`null` 表示认真留下的空，不要用 `0` 或 `""` 顶替。`==` 会把 `null` 和 `undefined` 看成相等，本章用 `===` 保住这个差别。下一章看字符串：空字符串和数字 `0` 在宽松相等里会相遇，而严格相等会拒绝这场相遇。

## 练习

1. 写一个 `kind` 函数，对 `undefined` 打印 `未定义`，对 `null` 打印 `空位`，对字符串打印 `文本`，其他打印 `其他`。用它分别处理 `undefined`、`null` 和 `"边城"`。不要用 `typeof` 判断 `null`。

::: answer 参考答案
```js run expect="空位" title="参考答案"
function kind(v) {
  if (v === undefined) return "未定义";
  if (v === null) return "空位";
  if (typeof v === "string") return "文本";
  return "其他";
}
console.log(kind(undefined));
console.log(kind(null));
console.log(kind("边城"));
```
:::

2. 构造三本书：没有 `note` 字段、`note` 为 `null`、`note` 为 `"再读"`。打印三行，分别是 `没有注`、`空注`、`再读`。用 `hasOwnProperty` 区分第一本和第二本。

::: answer 参考答案
```js run expect="空注" title="参考答案"
function noteOf(card) {
  if (!Object.prototype.hasOwnProperty.call(card, "note")) return "没有注";
  if (card.note === null) return "空注";
  return card.note;
}
console.log(noteOf({ title: "边城" }));
console.log(noteOf({ title: "围城", note: null }));
console.log(noteOf({ title: "城南旧事", note: "再读" }));
```
:::

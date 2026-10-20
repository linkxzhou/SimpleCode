---
language: js
chapter: 37
title: "JavaScript 正则表达式"
level: intermediate
minutes: 10
goals:
  - "用 match 取出捕获组"
  - "用 test 问一句里有没有词"
  - "用 replace 换掉全部匹配"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-20"
---

正则是写在斜杠里的匹配规则。捕获组用圆括号，全局替换要加 g。这一章的句子都是英文单词，避免和多字节字符搅在一起。

### 捕获横线后面的数字

bun-9 里，圆括号抓住 9。match 返回的数组下标 1 就是这个组。没有 g 时，match 只找第一处。

```js run expect="9" title="捕获数字"
const found = "tea-4 bun-9".match(/bun-(\d+)/);
console.log(found[1]);
```

捕获到的是 9。

### 问有没有 cup

test 只回答有或没有。句子里有 cup，所以打印 yes。它不把匹配到的文字交回来。

```js run expect="yes" title="有没有 cup"
const has = /cup/.test("a cup of tea");
console.log(has ? "yes" : "no");
```

回答是 yes。

### 把每个 tea 换成 cup

replace 配上 g，两处 tea 都会换成 cup。没有 g 的话，第二处会留下。

```js run expect="cup cup" title="全部替换"
console.log("tea tea".replace(/tea/g, "cup"));
```

换完是 `cup cup`。

### 练习：取出两个数字之和

从 a2b5 里捕获 2 和 5，相加后打印 7。Number 用来把文字变成数字。

```js run expect="7" title="两数相加"
const found = "a2b5".match(/a(\d+)b(\d+)/);
console.log(Number(found[1]) + Number(found[2]));
```

和是 7。

### javascript.info 的正则课

javascript.info 的正则课程更长，许可不允许改编：<https://javascript.info/> 。

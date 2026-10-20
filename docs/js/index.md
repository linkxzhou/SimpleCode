---
language: js
chapter: 0
title: "JavaScript 教程"
minutes: 8
goals:
  - "用 console.log 把结果送到终端"
  - "知道这里没有网页和 DOM"
  - "认出 TypeScript 会先被去掉类型"
sources:
  - lxiy-js
updated: "2026-10-15"
---

这一本在 QuickJS 里运行。没有页面，也没有 npm。结果要自己打印出来。

### 打印一行

`console.log` 会在末尾补换行。

```js run expect="Hi" title="第一行"
console.log("Hi");
```

输出里能看到 `Hi`。

### 没有 document

浏览器对象不存在。读写页面的代码只作阅读。

```js norun title="没有页面"
document.body.textContent = "Hi";
```

### 语句以分号隔开

课程里每条语句都写上分号，避免自动插入插到你不想要的位置。

```js run expect="5" title="加法"
console.log(2 + 3);
```

输出里能看到 `5`。

### 第 30 章起进入语言机制

闭包、原型、class、单文件里的模块函数、迭代器、Map、解构、正则和微任务排在前面，接着是 TypeScript 泛型、工具类型，以及一份没有页面的待办列表。import 和 setTimeout 在正文里标明不能在这里跑。

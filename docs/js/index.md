---
language: js
chapter: 0
title: "概览：没有页面的 JavaScript"
minutes: 8
goals:
  - "区分引擎和浏览器"
  - "用 console.log 输出"
  - "不使用 DOM、fetch 和 import"
sources:
  - mdn-js
  - lxiy-js
  - javascript-info
updated: "2026-10-15"
---

这里的 JavaScript 跑在 QuickJS 上，不是浏览器页面。没有 `document`、`window`、`fetch`，也不能 `import` 别的文件。`console.log` 的多个参数会用空格拼在一起。

TypeScript 章节会先去掉类型再运行，编辑器里看到的是转译后的 JavaScript，并带一行说明注释。工具栏上的 JS / TS 开关是另一条路：你自己写的 `.ts` 草稿会在点击 Run 时用同一套转译。

```js run expect="你好" title="问候"
console.log("你好")
```

```js norun title="不存在的 API"
// 只读：这里没有页面，也没有网络。
// document.querySelector('#app')
// fetch('https://example.com')
```

```js run expect="42" title="运算"
console.log(6 * 7)
```

## 练习

打印一行你自己的问候。

::: answer 参考答案
```js run expect="你好，杭州" title="参考答案"
console.log("你好，杭州")
```
:::

## 常见错误

- 把教程里的浏览器示例原样贴进来。document 在这里是未定义的。
- 用 import 或 export。程序必须是单个文件。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。

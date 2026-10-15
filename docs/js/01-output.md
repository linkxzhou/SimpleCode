---
language: js
chapter: 1
title: "JavaScript 输出"
level: beginner
minutes: 8
goals:
  - "用 console.log 输出多个值"
  - "把数组拼成一行"
  - "不用 alert"
sources:
  - lxiy-js
updated: "2026-10-15"
---

这个运行环境只看终端。弹窗和改写网页都没有落点。

### 多个参数

参数之间会插入空格。

```js run expect="茶 18" title="两项"
console.log("茶", 18);
```

输出里能看到 `茶 18`。

### 拼成一个字符串

`join` 用你给的分隔符，不会多出一个空格。

```js run expect="茶-水" title="连接"
console.log(["茶", "水"].join("-"));
```

输出里能看到 `茶-水`。

### alert 不存在

弹窗是浏览器 API。这里改用终端。

```js norun title="没有弹窗"
alert("你好");
```

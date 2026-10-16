---
language: js
chapter: 29
title: "TypeScript 类型断言"
level: beginner
minutes: 8
goals:
  - "用 as 告诉编译器具体类型"
  - "知道断言不会在运行时检查"
  - "优先用缩小而不是断言"
sources:
  - lxiy-js
updated: "2026-10-15"
---

断言只影响转译前的检查。运行时不会因此多做一次判断。

### 断言成字符串

值已经是字符串时，`as string` 让类型标注通过。

```ts run expect="1" title="一个字"
const value: unknown = "t";
console.log((value as string).length);
```

输出里能看到 `1`。

### 断言不会转换

`as number` 不会把字符串变成数字。这里先真正转换，再标注。

```ts run expect="13" title="先转换"
const text = "12";
const n = Number(text) as number;
console.log(n + 1);
```

输出里能看到 `13`。

### 缩小更稳妥

`typeof` 判断之后，分支里的类型已经收窄，不必再断言。

```ts run expect="1" title="判断之后"
function len(value: unknown): number {
  if (typeof value === "string") return value.length;
  return 0;
}
console.log(len("t"));
```

输出里能看到 `1`。

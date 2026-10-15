---
language: js
chapter: 12
title: "TS 进阶与小项目"
level: advanced
minutes: 16
goals:
  - "用枚举表示有限状态"
  - "在联合类型上收窄"
  - "把状态机写成一张表"
sources:
  - ts-handbook
  - mdn-js
updated: "2026-10-15"
---

Sucrase 会把枚举编成一个对象。数字枚举可以拿来做状态编号。状态机用当前状态加事件决定下一状态，不需要类也能写清楚。

下面的机器从 `idle` 遇到 `start` 进入 `run`，再遇到 `stop` 回到 `idle`。

```ts run expect="1" title="枚举"
enum Phase {
  Idle = 0,
  Run = 1,
}
console.log(Phase.Idle + Phase.Run);
```

```ts run expect="run" title="状态机"
type State = "idle" | "run";
type Event = "start" | "stop";
function step(state: State, event: Event): State {
  if (state === "idle" && event === "start") return "run";
  if (state === "run" && event === "stop") return "idle";
  return state;
}
let state: State = "idle";
state = step(state, "start");
console.log(state);
state = step(state, "stop");
console.log(state);
```

```ts run expect="3" title="对象参数"
interface Move {
  dx: number;
  dy: number;
}
function length(m: Move): number {
  return Math.abs(m.dx) + Math.abs(m.dy);
}
console.log(length({ dx: 1, dy: -2 }));
```

::: note
枚举编译后的赋值细节不用背。要确认的是：数字成员能相加，字符串成员能当键。复杂的 const enum 不必在这里用。
:::

## 练习

从 run 状态接收 stop，打印 idle。

::: answer 参考答案
```ts run expect="idle" title="参考答案"
type State = "idle" | "run";
function stop(state: State): State {
  return state === "run" ? "idle" : state;
}
console.log(stop("run"));
```
:::

## 常见错误

- 数字枚举的反向映射让对象上同时有名字和数字。打印整个枚举对象时会看到两套键。
- 把状态写成任意字符串。联合类型在转译后不会帮你挡掉拼写错误。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。

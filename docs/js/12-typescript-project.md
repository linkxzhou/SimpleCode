---
language: js
chapter: 12
title: "TS 进阶与小项目"
level: advanced
minutes: 18
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

枚举在转译后变成对象。数字枚举可以相加，也可以当状态编号。打印整个枚举对象会同时看见名字和反向映射，测试时打印具体成员，不要打印整个对象。

字符串联合类型适合状态机。转译后它就是字符串，拼写错误不会被拦住，所以分支要有默认：不认识的事件保持原状态，而不是崩溃。把转移写成函数，输入状态和事件，返回新状态，比在界面代码里散落 if 更容易测。

接口描述参数形状。函数只读取自己声明的字段，调用方可以多给字段，转译后那些字段还在对象上，只是函数不看。这和「类型会删掉多余字段」不是一回事，删的是标注，不是值。

小项目到此为止：一个状态、一种事件、一个纯函数。不要加 DOM，也不要加计时器。打印每一次转移后的状态，期望输出就是那几个单词。

状态机的纯函数好测：给入状态和事件，看返回值。不需要创建对象。打印两次转移，期望里写两行，读终端时能看见路径，而不只是终点。

数字枚举的反向映射意味着对象上既有 Idle: 0 也有 0: "Idle"。用它当字典遍历时会看到两套键。只读取 Phase.Run 这种成员，不 for...in 整个枚举。

字符串状态不要写成任意 string。即便转译后守不住，源码里的联合类型仍然是给人读的契约。默认分支返回原状态，脏事件不会把状态变成 undefined。

这一章把类型放进一个小状态机，而不是再介绍新的语法。状态用字符串联合表示，转译之后就是普通字符串。函数接收当前状态，返回下一个状态，不修改外部变量。这样给入同一个状态，输出就稳定，测试只看打印的文本。

枚举若被转译成对象，运行时可以读取它的值。不要依赖枚举的反向映射这种容易变化的细节。教学示例直接用字符串，打印 "idle" 或 "run"，期望写这些看得见的字。事件也用字符串。非法事件返回原状态或一个明确的错误字符串，不要抛到栈顶，除非这一章就是在练异常。

纯函数好测：不创建对象，不读输入。打印两次转移，期望里写两行，读终端时能看见路径，而不只是终点。曼哈顿长度这类小计算放在旁边，用来练习带类型的数字函数，和状态机无关，但同样在转译后只剩运算。

做练习时先忽略类型，把转移表在纸上画出来，再把类型加回去。类型写错但逻辑对，这里仍然能跑；逻辑错了，类型写得再满也通不过期望。最后看编辑器，确认留下的是 JavaScript 和转译注释。

### 读「保持原状态」

先做这一例。代码收成一行是 `type State = 'idle' | 'run'; function step(state: State): State { return state; } console.log(step('idle'));`。先盖住终端，用手算结果，纸上的文本里要能找到「idle」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「idle」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

### 读「绝对值曼哈顿」

做完上一个再做这一例。代码收成一行是 `function len(dx: number, dy: number): number { return Math.abs(dx) + Math.abs(dy); } console.log(len(2, -5));`。先盖住终端，用手算结果，纸上的文本里要能找到「7」。这是子串：前面可以有别的输出，后面通常有换行，不要要求整屏只有这几个字。

然后点这个代码块上的 Run，不要点工具栏。代码块会先备份草稿，再把示例写进编辑器并执行。终端里用眼睛找「7」。退出码不是 0 时，先读错误的类型和最后一行，此时不要改期望。退出码是 0 但找不到这段文字，说明打印了别的值，回到产生该值的表达式，只改一处。

改过之后再点代码块上的 Run，会把你的修改盖掉。要验证修改，点工具栏上的 Run。预测和新输出一致后，点撤销，把草稿还给自己。一次只改这一例，不要连着改两个代码块。

实践 1 写成一句就是：打印枚举的成员，不打印整个枚举对象。 用「保持原状态」当检查对象。删掉一个保护条件，或把比较符号反过来，看失败是报错还是静默地打出另一个数。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：进入 run」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 2 写成一句就是：状态转移写成纯函数，不认识的事件保持原状态。 用「绝对值曼哈顿」当检查对象。把本该新建的对象改成复用已有的名字，看两个名字会不会一起变。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：进入 run」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

实践 3 写成一句就是：类型删不掉对象上的值，函数只读取自己用到的字段。 用「保持原状态」当检查对象。少写一个边界：少一次循环、少一个参数或少接住一个返回值，看输出正好差在哪。 看完失败的样子再改回来。看起来没变化的违反最危险，因为期望子串可能仍然在，换一个输入才暴露。参考答案「参考答案：进入 run」按这一条来写。打开答案之前，先用自己的版本对着练习说明里的输入算一遍。

练习先不看折叠答案。题目是：从 idle 遇到 start 进入 run，打印结果。用普通函数即可，参数写成联合类型。 做完再对照「参考答案：进入 run」。能说出自己的写法和答案差在哪一行，这道题才算完成。本章的另一道练习查的不是同一件事，两道都做。

收束时用一句话复述：枚举变成对象，联合类型变成字符串。状态机用纯函数表达，转译后逻辑仍在，类型检查不在。 若只能留下三句，就留下上面三条实践，并为每一条记住一个你刚刚故意做错的反例。

```ts run expect="idle" title="保持原状态"
type State = 'idle' | 'run';
function step(state: State): State {
  return state;
}
console.log(step('idle'));
```

```ts run expect="7" title="绝对值曼哈顿"
function len(dx: number, dy: number): number {
  return Math.abs(dx) + Math.abs(dy);
}
console.log(len(2, -5));
```

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

从 idle 遇到 start 进入 run，打印结果。用普通函数即可，参数写成联合类型。

::: answer 参考答案：进入 run
```ts run expect="run" title="参考答案"
type State = 'idle' | 'run';
function go(state: State): State {
  return state === 'idle' ? 'run' : state;
}
console.log(go('idle'));
```
:::

## 最佳实践

- 打印枚举的成员，不打印整个枚举对象。
- 状态转移写成纯函数，不认识的事件保持原状态。
- 类型删不掉对象上的值，函数只读取自己用到的字段。

## 小结

枚举变成对象，联合类型变成字符串。状态机用纯函数表达，转译后逻辑仍在，类型检查不在。

## 常见错误

- 数字枚举的反向映射让对象上同时有名字和数字。打印整个枚举对象时会看到两套键。
- 把状态写成任意字符串。联合类型在转译后不会帮你挡掉拼写错误。

## 延伸阅读

- [javascript.info](https://javascript.info/)（CC BY-NC-SA，仅链接）
- [Eloquent JavaScript](https://eloquentjavascript.net/)（CC BY-NC，仅链接）

## 参考与致谢

正文为原创。知识点范围参考了 MDN JavaScript Guide（CC BY-SA 2.5）和 Learn X in Y minutes — JavaScript（CC BY-SA 3.0）。TypeScript 章节的概念范围参考 TypeScript Handbook（CC BY 4.0）。没有逐字搬用这些文档。

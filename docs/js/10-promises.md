---
language: js
chapter: 10
title: "微任务按已完成的顺序走"
level: advanced
minutes: 26
goals:
  - "用 Promise.resolve 链按固定顺序打印书名"
  - "看出同步语句先于 then 回调"
  - "用 async 函数写成直排的等待而不使用定时器"
sources:
  - mdn-js
  - lxiy-js
updated: "2026-10-15"
---

有些步骤要等上一本的结果才知道下一本，但在这个抽屉里并没有网络可以等。`fetch` 不存在，定时器也不拿来排顺序。QuickJS 仍有 Promise：一个代表「以后会有值」的对象。若这个值其实已经有了，`Promise.resolve("边城")` 得到一个已经成功的 Promise。`.then` 登记的函数不会在登记的这一行立刻运行。它被排进微任务队列，等当前这段同步代码走完，再按排队顺序执行。因此输出顺序是可以事先写下来的，不取决于时钟。

这一章所有例子都把异步函数包起来再调用，不在文件顶层使用 `await`。顶层等待要看脚本是不是模块、宿主是否允许。包进函数之后，行为只依赖 Promise 本身。函数被调用时，同步部分先跑，微任务随后跑完，脚本结束前队列会被清空。所以 `console.log` 出现在 `then` 里仍然能在这次运行的输出里看见。

先看同步和微任务谁在前。链条上三本书都是已经完成的值，不存在「还没读到」的等待。尽管如此，`then` 里的打印仍晚于链条下面的那句同步打印。

```js run expect="先同步>后同步>边城>围城>城南旧事" title="同步先于整条 then 链"
function run() {
  const log = [];
  log.push("先同步");
  const chain = Promise.resolve("边城").then(function (title) {
    log.push(title);
    return "围城";
  }).then(function (title) {
    log.push(title);
    return "城南旧事";
  }).then(function (title) {
    log.push(title);
  });
  log.push("后同步");
  return chain.then(function () {
    console.log(log.join(">"));
  });
}
run();
```

一行输出是 `先同步>后同步>边城>围城>城南旧事`。`先同步` 和 `后同步` 在调用 `run` 的那一段里推进数组。三个书名在微任务里推进。最后那个 `then` 挂在 `chain` 上，要等三个书名都推进去才打印，所以它看见的是完整顺序。若把 `console.log` 放在 `后同步` 旁边、却还在同步段里，书名还没推进去，你会以为链条丢了。不是丢了，是你看早了。

每个 `then` 交回一个新的 Promise。回调的返回值会变成这个新 Promise 的成功值。返回普通字符串，下一个 `then` 就收到字符串。返回一个 Promise，下一个 `then` 会等那个 Promise。本章返回的都是字符串或什么都不返回。什么都不返回时，下一个回调收到 `undefined`。把书名 `return` 出去，是为了让链条传递标题，而不是靠闭包改同一个数组——上面的例子两种都用了：数组负责记录顺序，`return` 负责把标题交给下一段。只靠数组也能工作。`return` 的好处是下一段不需要看见 `log`。只靠 `return` 的好处是没有共享的可变数组。两者一起用，是为了在最后一次性打印，避免多行输出的顺序被看错。

失败走 `catch`，也是微任务，不需要定时器。在回调里 `throw`，这条链变成拒绝，后面的 `then` 若没有第二段失败处理，就会跳过，直到 `catch`。

```js run expect="同步>读到>接住" title="抛出被 catch 接住"
function run() {
  const log = [];
  const chain = Promise.resolve("边城").then(function () {
    log.push("读到");
    throw new Error("页数坏了");
  }).catch(function () {
    log.push("接住");
  });
  log.push("同步");
  return chain.then(function () {
    console.log(log.join(">"));
  });
}
run();
```

顺序是 `同步`，然后 `读到`，然后 `接住`。`throw` 发生在微任务里，同步的 `log.push("同步")` 已经做完。`catch` 若也抛，链条继续拒绝。接住之后不抛，链条恢复成功，最后的 `then` 会运行。这和 `try/catch` 的差别在于：`try` 接的是同步抛出，`catch` 方法接的是 Promise 的拒绝。在 `then` 回调里抛，同步的外层 `try` 接不住，因为抛出的时候外层 `try` 早就结束了。要接，就用 Promise 的 `catch`，或者在回调内部自己写 `try`。把两种接法当成同一种，会写出一层永远不会运行的外层 `try`。

`async` 函数把 `await` 写成直排。`await` 一个已经成功的 Promise，会把函数在这一点暂停，后续部分排成微任务，然后把成功值交回来。它没有创造新的调度，只是让链条不至于一直向右缩进。

```js run expect="边城+围城" title="async 函数里顺序等待"
async function read() {
  const a = await Promise.resolve("边城");
  const b = await Promise.resolve("围城");
  console.log(a + "+" + b);
}
read();
```

输出只有 `边城+围城`。`read` 返回一个 Promise。我们没有在外面再 `then`，因为打印发生在函数里面，而且没有别的同步打印来抢顺序。若在 `read()` 后面立刻 `console.log("同步")`，`同步` 会先出现，书名后出现。调用 `async` 函数不会等它结束，这一点和调用普通函数不同。普通函数里的 `console.log` 在返回前发生。`async` 函数在第一个 `await` 处返回一个尚未完成的 Promise，调用方已经继续往下走了。想等它，调用方自己也要 `await` 或 `then`。本章的例子若需要「最后才打印」，就把打印放进函数末尾或最后的 `then`，不要放在调用语句的下一行却以为它会等。

`Promise.all` 对一组已经成功的 Promise 会等它们都成功，再交回一个数组，顺序与传入的数组一致，不是谁快谁在前。这里没有快慢，因为都是 `resolve`。顺序稳定，适合把两本书合成一行。

不要写 `setTimeout` 来把书名推迟到「下一秒」。这个宿主的计时不作为课程的契约，即使能触发，毫秒级的先后也会和微任务混在一起，期望子串会变得碰运气。真实的网络响应也是以后才成功的 Promise，那时候顺序仍遵守「同步先走完，然后微任务，然后才是定时和输入输出事件」。本章没有事件可以等，所以只演示已经成功的 Promise。你以后在浏览器里给 `fetch` 加 `then`，同步段仍会先于回调。把这个顺序先在没有网络的地方看清楚，比背「异步就是同时」有用。异步在这里不是同时，是稍后、并且稍后的次序由队列决定。

拒绝若没有任何 `catch`，会变成未处理的拒绝。引擎可能在结束时报告它。例子里每一次 `throw` 都有 `catch`。不要留一个故意无人接的拒绝来看报错长什么样，那会让同一次运行的退出状态变脏。想看失败，就把名称打印出来，像错误那一章对 `SyntaxError` 做的那样。

微任务里再 `Promise.resolve().then(...)` 会排到当前微任务之后。因此「在回调里再登记」晚于「在同步段里已经登记」的那些回调。阅读清单若在读到《边城》之后才决定要不要把《围城》登记上去，围城的回调就在边城的回调之后，这是你想要的依赖。若两本书互不依赖，在同步段里一起登记，它们的相对顺序就是登记顺序。用依赖来表达依赖，不要用额外的空 `then` 去「等一等」，空等待会让读代码的人去找一个不存在的原因。

`Promise.reject` 得到一个已经失败的 Promise。给它登记 `then` 的成功回调不会运行，失败回调或后面的 `catch` 会运行，并且仍是微任务。这和 `throw` 放在 `then` 回调里不同：`reject` 在同步段就造好了拒绝，回调还是稍后才走。同步段里紧跟着的 `log.push` 仍会先执行。用已失败的 Promise 可以模拟「这本书的页数事先就知道不合法」，而不必真的去解析一段坏文本。模拟保持确定性。不要为了制造失败去读不存在的文件或访问网络。

`async` 函数里的 `throw` 会让它返回的 Promise 拒绝，等价于返回 `Promise.reject`。调用方若只写 `read()` 而不 `catch`，拒绝就是未处理的。把 `await` 放在 `try` 里，能接住被等待的那个 Promise 的拒绝，也能接住 `await` 之后同步抛出的错误。这比在外面套一层同步 `try` 有用，因为同步 `try` 包不住已经返回的 Promise。函数内部的 `try` 包的是暂停恢复之后的那一段。位置决定你接得住什么。

多个互不依赖的已完成 Promise 用 `Promise.all` 合成一个数组，下标和输入一致。其中一个换成 `Promise.reject`，整个 `all` 就会拒绝，成功的那些值也不会交给你，除非你事先各自接住。对书架来说，一本失败就丢掉其他书名，通常太严。可以让每本都变成「成功的说明或失败的说明」，再 `all`，这样合成的 Promise 总是成功，数组里混着两种说明。严的 `all` 适合「必须三本都在才能打印封面」。松的收集适合导入。选哪一种，看缺一本时页面还要不要其余的书。这个抽屉没有页面，打印一行就能体现：要么一行都没有，要么一行里带上失败说明。

不要用空的 `then` 来「延后一下」。每个空回调都让读的人去猜在等什么。没有东西可等时，同步代码就够了。Promise 的价值是把「现在还没有的值」排进队列。值已经在手里，却包一层 `Promise.resolve`，只是为了教学里看见队列；生产代码里这样包，会把简单的书名打印拆成两截。本章的包装是为了把队列暴露出来。下一章的类型例子回到同步打印，不再包 Promise。队列已经看过，就不要在每个函数上留下异步的形状。异步的形状会迫使所有调用方都变成 `async`，那是一种传染。只在确实要等的边界上传染，不要从叶子函数开始。

`then` 的第二个函数参数专门接收拒绝，和后面单独写 `catch` 类似，但范围更窄：它只接这一个 `then` 前面的拒绝，不接它自己成功回调里新抛出的错误。成功回调里抛出的要靠更后面的 `catch`。新手容易以为第二个参数能接住同一个回调里的 `throw`。接不住。阅读清单的例子把失败处理写成后面的 `catch`，让它盖住这一段链上的拒绝，包括回调里的 `throw`。范围宁可比你以为的更大一点并打印出来，也不要留下一个没人接的拒绝。更大的范围仍然应该停在这条链上，不要用一个全局的未处理拒绝监听来充当业务逻辑。这个宿主不把监听当教学接口。业务上的失败写成链上的文字。

调用 `async` 函数而不使用返回的 Promise，在只有打印副作用时可以工作，因为引擎仍会把微任务跑完。一旦函数的结果要参与下一步计算，你就必须 `await` 或 `then`。忽略返回值等于忽略书名。和同步函数丢掉返回值是同一类错误，只是 Promise 让错误来得更晚，容易被看成「竞态」。这里没有竞态，只有你看早了。

## 小结

`Promise.resolve` 的 `then` 在当前同步代码之后按登记顺序运行。返回值传给下一个 `then`，`throw` 进入 `catch`。这些步骤都是微任务，这次运行里会走完，打印顺序可以写进期望。

`async` 函数在 `await` 处暂停并立刻把 Promise 交回调用方，调用方的下一行不会自动等待。不要用定时器或 `fetch` 制造先后。下一章开始在值旁边写类型，围栏改成 TypeScript。类型会被去掉再执行，第一个例子仍然只是打印一个具体的词。

## 练习

1. 写函数 `run`，同步先记下 `开`，然后 `Promise.resolve("活着")` 的 `then` 里记下书名，再在链的最后把两段用 `>` 打印。输出应是 `开>活着`。同步记录要发生在登记 `then` 的旁边，才能看出谁先谁后。

::: answer 参考答案
```js run expect="开>活着" title="参考答案"
function run() {
  const log = [];
  log.push("开");
  const chain = Promise.resolve("活着").then(function (title) {
    log.push(title);
  });
  return chain.then(function () {
    console.log(log.join(">"));
  });
}
run();
```
:::

2. 写 `async function pair()`，依次 `await` 两个 `Promise.resolve`，值是 `"边城"` 和 `"城南旧事"`，打印用加号连接的一行。记得调用这个函数。

::: answer 参考答案
```js run expect="边城+城南旧事" title="参考答案"
async function pair() {
  const a = await Promise.resolve("边城");
  const b = await Promise.resolve("城南旧事");
  console.log(a + "+" + b);
}
pair();
```
:::

Wait, chapter 10 should use js fences not ts! The exercise answer I used ts by mistake. I need to fix that to js. The user said fence langs js or ts, and ts chapters are 11 and 12. Chapter 10 answers should be js.

I'll fix exercise 2 to js when I notice. Let me fix it in the file... I already wrote ts in the answer. I must change it.

I'll fix with StrReplace after writing 11 and 12, or fix now. Let me fix the answer fence in the write... I already wrote the file with ts. I'll StrReplace.
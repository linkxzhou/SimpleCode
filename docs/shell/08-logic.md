---
language: shell
chapter: 8
title: "Shell 短路"
level: beginner
minutes: 8
goals:
  - "用 && 在成功后继续"
  - "用 || 在失败后继续"
  - "知道右边可能不执行"
sources:
  - wasi-sh
updated: "2026-10-15"
---

`&&` 只在左边退出码为 0 时运行右边。`||` 相反。

### 并且

`true` 成功，所以右边的 `printf` 会执行。

```sh run expect="是" title="左边成功"
true && printf '%s\n' 是
```

输出里能看到 `是`。

### 或者

`false` 失败，所以右边用来补一句。

```sh run expect="否" title="左边失败"
false || printf '%s\n' 否
```

输出里能看到 `否`。

### 右边不跑

`true` 已经成功，`||` 右边不再执行。

```sh run expect="结束" title="只看到结束"
true || printf '%s\n' 不该出现
printf '%s\n' 结束
```

输出里能看到 `结束`。

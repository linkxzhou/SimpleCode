---
language: shell
chapter: 21
title: "Shell 花括号"
level: intermediate
minutes: 8
goals:
  - "用 ${sku} 拼出前后缀"
  - "确认 ${1} 在这里是空的"
  - "知道带默认值的写法不会展开"
sources:
  - wasi-sh
updated: "2026-10-20"
---

wasi-sh 只把 ${名字} 换成变量的值。花括号里的 :-、#、% 不会被当成运算符，整段会被当成一个变量名。

### sku 两边拼上字母

sku 赋成 tea。双引号里的 ${sku} 展开后，printf 打出 xteay。

```sh run expect="xteay" title="拼成 xteay"
sku=tea
printf '%s\n' "x${sku}y"
```

### 第一个位置参数是空的

运行按钮不附加参数，所以 ${1} 是空字符串。a 和 b 贴在一起，打出 ab。

```sh run expect="ab" title="中间是空的"
printf '%s\n' "a${1}b"
```

### 两个变量接成 teacup

left 是 tea，right 是 cup。同一个双引号里先后展开，得到 teacup。

```sh run expect="teacup" title="接成 teacup"
left=tea
right=cup
printf '%s\n' "${left}${right}"
```

### 默认值写法只供阅读

${sku:-mug} 不会在 sku 为空时换成 mug。花括号里的整段 sku:-mug 被当成变量名，读出来是空的。所以这一行不运行。

```sh norun title="不会换成默认值"
sku=tea
printf '%s\n' "${sku:-mug}"
```

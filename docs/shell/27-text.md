---
language: shell
chapter: 27
title: "Shell 字符串"
level: intermediate
minutes: 8
goals:
  - "把两个变量接成一个词"
  - "用 test 判断两个词相同"
  - "知道不能按模式砍掉后缀"
sources:
  - wasi-sh
updated: "2026-10-20"
---

字符串靠并列展开接在一起。相同与否交给 test 的 =。${sku%cup} 这种砍后缀的写法这里不存在。

### tea 和 cup 接成 teacup

sku 是 tea。双引号里先展开 sku，再写上 cup，得到 teacup。

```sh run expect="teacup" title="接成 teacup"
sku=tea
printf '%s\n' "${sku}cup"
```

### 相同的词打印 same

sku 是 tea。test 用 = 比较展开后的值和 tea。成立时打印 same。

```sh run expect="same" title="两词相同"
sku=tea
if [ "$sku" = tea ]; then
  printf '%s\n' same
fi
```

### 不同的词打印 other

sku 是 mug，和 tea 不相等。else 打印 other。

```sh run expect="other" title="两词不同"
sku=mug
if [ "$sku" = tea ]; then
  printf '%s\n' same
else
  printf '%s\n' other
fi
```

### 砍后缀只供阅读

${sku%cup} 不会删掉结尾的 cup。百分号被算进变量名。要去掉一段，得在写变量时就分成两截。

```sh norun title="不会砍后缀"
sku=teacup
printf '%s\n' ${sku%cup}
```

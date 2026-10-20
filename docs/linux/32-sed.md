---
language: linux
chapter: 32
title: "Linux sed"
level: intermediate
minutes: 8
goals:
  - "把 tea 换成 mug"
  - "替换一行里的两处 tea"
  - "只打印第二行"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

sed 按行改文本。s/旧/新/ 换第一次，末尾加 g 换这一行里的每一次。-n 配合 p 可以只打印选中的行。

### tea 换成 mug

只有一处 tea。s/tea/mug/ 把它换成 mug，并打印这一行。

```linux run expect="mug" title="换成 mug"
printf 'tea\n' | sed 's/tea/mug/'
```

### 一行里两处都换掉

tea tea 中间有空格。加上 g 之后两处都变成 mug，输出 mug mug。

```linux run expect="mug mug" title="两处都换"
printf 'tea tea\n' | sed 's/tea/mug/g'
```

### 只留下第二行 b

-n 先关掉自动打印。2p 只把第二行 b 打出来。

```linux run expect="b" title="第二行"
printf 'a\nb\n' | sed -n '2p'
```

### 删掉含 cup 的行

/cup/d 删掉匹配的行。剩下 tea。cup 不再出现。

```linux run expect="tea" title="删掉 cup"
printf 'tea\ncup\n' | sed '/cup/d'
```

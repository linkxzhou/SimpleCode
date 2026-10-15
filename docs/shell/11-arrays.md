---
language: shell
chapter: 11
title: "Shell 数组"
level: beginner
minutes: 8
goals:
  - "知道圆括号数组不是这只壳的语法"
  - "用 for 代替下标"
  - "用变量记住当前一项"
sources:
  - wasi-sh
updated: "2026-10-15"
---

bash 的 `items=(茶 笔)` 这里不能运行。一列词用 `for ... in` 走过。

### 数组语法不运行

圆括号加等号不是赋值，也不是内建。

```sh norun title="没有数组"
items=(茶 笔)
echo "${items[0]}"
```

### 用 for 代替

茶和笔仍按书写顺序出现。

```sh run expect="笔" title="第二项"
for item in 茶 笔
do
  printf '%s\n' "$item"
done
```

输出里能看到 `笔`。

### 记住一项

循环结束时，变量里是最后一个词。

```sh run expect="墨" title="留下来"
item=无
for item in 墨
do
  :
done
printf '%s\n' "$item"
```

输出里能看到 `墨`。

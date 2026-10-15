---
language: shell
chapter: 9
title: "Shell while 循环"
level: beginner
minutes: 8
goals:
  - "用 while 重复到条件失败"
  - "在循环里改掉条件"
  - "知道这里没有算术展开"
sources:
  - wasi-sh
updated: "2026-10-15"
---

没有 `$((...))`，计数不能靠加一。循环里直接把条件改成不再成立。

### 做一次

条件先成立，循环体里把 `n` 改成 0，于是只打出一次。

```sh run expect="一次" title="只一次"
n=1
while [ "$n" = 1 ]
do
  printf '%s\n' 一次
  n=0
done
```

输出里能看到 `一次`。

### 一开始就不进

条件一开始就是失败，循环体不执行。

```sh run expect="跳过" title="没有进入"
n=0
while [ "$n" = 1 ]
do
  printf '%s\n' 不该出现
done
printf '%s\n' 跳过
```

输出里能看到 `跳过`。

### 算术展开不运行

`$((1+1))` 不是这只壳的写法。

```sh norun title="没有算术展开"
n=$((1+1))
echo "$n"
```

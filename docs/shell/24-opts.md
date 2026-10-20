---
language: shell
chapter: 24
title: "Shell 选项"
level: intermediate
minutes: 8
goals:
  - "在词表里认出 -n"
  - "没有 -n 时打印 no"
  - "知道 getopts 不是内建"
sources:
  - wasi-sh
updated: "2026-10-20"
---

运行按钮不会传入选项。要演示选项，就把 -n 和别的词写在 for 的列表里，自己用 test 认出它。getopts 会以 127 结束。

### 列表里有 -n 就打印 yes

for 依次看到 -n 和 tea。遇到 -n 时把 found 改成 yes。循环结束后打印 yes。

```sh run expect="yes" title="看见 -n"
found=no
for item in -n tea
do
  if [ "$item" = -n ]; then
    found=yes
  fi
done
printf '%s\n' "$found"
```

### 没有 -n 时保持 no

列表只有 tea 和 cup。等号一次都不成立，found 保持 no。

```sh run expect="no" title="没有 -n"
found=no
for item in tea cup
do
  if [ "$item" = -n ]; then
    found=yes
  fi
done
printf '%s\n' "$found"
```

### -n 出现在中间也算

tea 在前，-n 在中，cup 在后。只要有一次相等，结果就是 yes。

```sh run expect="yes" title="中间的 -n"
found=no
for item in tea -n cup
do
  if [ "$item" = -n ]; then
    found=yes
  fi
done
printf '%s\n' "$found"
```

### getopts 只供阅读

getopts 不是内建。调用它会提示没有外部命令，退出码 127。选项扫描用上面的 for 代替。

```sh norun title="没有 getopts"
getopts "n" opt
printf '%s\n' "$opt"
```

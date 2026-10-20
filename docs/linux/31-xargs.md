---
language: linux
chapter: 31
title: "Linux xargs"
level: intermediate
minutes: 8
goals:
  - "把两行交给 echo"
  - "用 xargs 读出文件内容"
  - "用 -n 限制每次一个参数"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

xargs 从标准输入读词，再当作参数交给下一条命令。一行一个词时，echo 会把它们用空格接在同一行。

### 两行变成 tea cup

printf 打出 tea 和 cup 各一行。xargs echo 把它们收成一行 tea cup。

```linux run expect="tea cup" title="合成一行"
printf 'tea\ncup\n' | xargs echo
```

### xargs cat 读出 tea

先把 tea 写进 /tmp/sip.txt，再把这个路径交给 xargs cat。输出是 tea。

```linux run expect="tea" title="读出 tea"
printf 'tea\n' > /tmp/sip.txt
printf '/tmp/sip.txt\n' | xargs cat
```

### -n 1 让 echo 各打一行

-n 1 表示每次只带一个参数。tea 和 cup 又分成两行，期望锁定 cup。

```linux run expect="cup" title="每次一个"
printf 'tea\ncup\n' | xargs -n 1 echo
```

### 空输入时 xargs 仍会跑一次

没有词时，BusyBox 的 xargs 默认仍执行一次 echo。打出的是空行。用 -r 可以不跑，这里先看默认行为并打印 mark。

```linux run expect="mark" title="空输入之后"
printf '' | xargs echo
echo mark
```

---
language: linux
chapter: 35
title: "Linux 信号"
level: intermediate
minutes: 8
goals:
  - "用 kill -0 确认当前壳还在"
  - "看见 HUP 这个信号名"
  - "不向 1 号进程发送结束信号"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

kill 可以查询进程，也可以发信号。kill -0 不发真正的信号，只检查进程是否存在。结束 init 的写法只留在阅读块里。

### 当前壳还在就打印 alive

$$ 是当前壳的进程号。kill -0 成功时用 && 接上 echo alive。

```linux run expect="alive" title="壳还在"
kill -0 $$ && echo alive
```

### 信号列表里有 HUP

kill -l 列出信号名。HUP 是挂起。期望只锁定这个名字，不锁定整张表的顺序。

```linux run expect="HUP" title="列出 HUP"
kill -l
```

### 向自己发 0 号检查

kill -s 0 与 kill -0 一样只检查。成功后打印 ok。

```linux run expect="ok" title="检查通过"
kill -s 0 $$ && echo ok
```

### 结束 1 号进程只供阅读

kill -9 1 会冲击客户机里的 init。文档不运行这一行。要看信号，用上面的 -0 和 -l。

```linux norun title="不结束 init"
kill -9 1
```

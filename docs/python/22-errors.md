---
language: python
chapter: 22
title: "Python3 错误和异常"
level: beginner
minutes: 8
goals:
  - "用 try 接住异常"
  - "区分不同的异常类型"
  - "用 raise 主动报告失败"
sources:
  - lxiy-python
updated: "2026-10-15"
---

异常表示这一步做不成。接住它，程序可以改走另一支。

### 接住除零

整数除以零会抛出 `ZeroDivisionError`。

```python run expect="除零" title="接住"
try:
    print(1 // 0)
except ZeroDivisionError:
    print("除零")
```

输出里能看到 `除零`。

### 类型要对上

接 `ValueError` 接不住除零。要接的类型和实际抛出的一致。

```python run expect="除零" title="第二个分支"
try:
    1 // 0
    print("过了")
except ValueError:
    print("值错误")
except ZeroDivisionError:
    print("除零")
```

输出里能看到 `除零`。

### 主动抛出

`raise` 让调用方必须处理，或者让程序停在这里。

```python run expect="数量不够" title="自己抛出"
def sell(n):
    if n < 1:
        raise ValueError("数量不够")
    return n
try:
    sell(0)
except ValueError as err:
    print(err)
```

输出里能看到 `数量不够`。

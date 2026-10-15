---
language: python
chapter: 2
title: "Python3 基础语法"
level: beginner
minutes: 8
goals:
  - "用缩进表示代码块"
  - "写出带返回值的函数"
  - "知道一行通常是一条语句"
sources:
  - lxiy-python
updated: "2026-10-15"
---

Python 用缩进分层，不靠花括号。同一层的语句左边要对齐。

### 缩进就是块

函数体比 `def` 多缩进一层。返回值用 `return`。

```python run expect="7" title="两数相加"
def add(a, b):
    return a + b
print(add(2, 5))
```

输出里能看到 `7`。

### 冒号引出下一层

`if` 和 `for` 的下一行必须缩进，否则解释器认为块是空的。

```python run expect="正" title="条件块"
n = 2
if n > 0:
    print("正")
```

输出里能看到 `正`。

### 一行一条简单语句

分号可以把两句挤在一行，但课程里仍一行写一句，方便对照输出。

```python run expect="甲" title="两行输出"
print("甲")
print("乙")
```

输出里能看到 `甲`。

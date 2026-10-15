---
language: python
chapter: 4
title: "Python3 数据类型转换"
level: beginner
minutes: 8
goals:
  - "用 int 和 float 做显式转换"
  - "用 str 把数字变成文本"
  - "接住转换失败"
sources:
  - lxiy-python
updated: "2026-10-15"
---

Python 不会把字符串偷偷当成数字去加。要转换就写出目标类型。

### 文本变成整数

`int` 只接受整数样子的文本。小数点会让它失败。

```python run expect="13" title="加一"
print(int("12") + 1)
```

输出里能看到 `13`。

### 丢掉小数部分

`int` 作用在小数上时直接砍掉小数，不是四舍五入。

```python run expect="3" title="截断"
print(int(3.9))
```

输出里能看到 `3`。

### 转换失败要接住

非法文本会抛出 `ValueError`。接住之后程序还能继续打印。

```python run expect="失败" title="非法文本"
try:
    int("no")
    print("过了")
except ValueError:
    print("失败")
```

输出里能看到 `失败`。

---
language: python
chapter: 7
title: "Python3 数字(Number)"
level: beginner
minutes: 8
goals:
  - "使用 abs 和 round"
  - "用 math 做开方"
  - "知道很大的整数不会溢出"
sources:
  - lxiy-python
updated: "2026-10-15"
---

数字分整数和浮点。整数可以很长，浮点有精度限制。

### 绝对值和四舍五入

`abs` 去掉负号。`round` 按通常的规则收到整数。

```python run expect="4 2" title="绝对值"
print(abs(-4), round(1.6))
```

输出里能看到 `4 2`。

### 开平方

`math.sqrt` 返回浮点。平方后再开方，整数 9 会变成 3.0。

```python run expect="3.0" title="平方根"
import math
print(math.sqrt(9))
```

输出里能看到 `3.0`。

### 大整数

Python 的整数不固定在 64 位里。乘上很大的数仍然是精确整数。

```python run expect="1099511627776" title="四十次方"
print(2 ** 40)
```

输出里能看到 `1099511627776`。

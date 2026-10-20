---
language: numpy
chapter: 6
title: "向量化"
level: beginner
minutes: 8
goals:
  - "用乘法代替逐项循环"
  - "计算点积"
  - "沿轴取平均"
sources:
  - numpy-manual
updated: "2026-10-20"
---

能写成整组运算就不要写 Python 的 for。数组乘法一次作用到全部元素，点积和按轴归约也是同样的思路。

### 平方和

x * x 得到每一项的平方，再 sum。0 到 4 的平方和是 30。循环累加在这里只是更慢的写法。

```numpy run expect="30" title="平方和"
import numpy as np
# 不用循环
x = np.arange(5)
print(int((x * x).sum()))
```

结果是整数 30。

### 点积

np.dot 把对应位置相乘再相加。1*4 + 2*5 + 3*6 等于 32。两个向量长度必须相同。

```numpy run expect="32.0" title="点积"
import numpy as np
# 三项对齐
a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 5.0, 6.0])
print(float(np.dot(a, b)))
```

打印带一位小数。

### 沿轴归约

mean(axis=0) 对每一列求平均，得到的长度等于列数。axis=1 则压缩行。忘记写 axis 时，均值是全部元素的一个数。

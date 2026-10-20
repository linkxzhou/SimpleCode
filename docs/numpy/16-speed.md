---
language: numpy
chapter: 16
title: "NumPy 向量化"
level: intermediate
minutes: 9
goals:
  - "用数组乘法代替逐个平方"
  - "用 where 把奇数换成 0"
  - "用两个数组相乘得到金额"
sources:
  - numpy-100
updated: "2026-10-20"
---

向量化是让一轮运算覆盖整个数组，而不是在 Python 里逐个元素循环。结果应当和循环相同。这一页不比较耗时，因为浏览器里的计时会抖动，只检查两边算出来的数。

### 循环和平方和一致

Python 循环把 1、2、3 的平方加起来得到 14。a * a 再 sum 也是 14。两份都打印出来。

```numpy run expect="14 14" title="两种 14"
import numpy as np
def squares(xs):
    total = 0
    for x in xs:
        total += int(x) * int(x)
    return total
a = np.array([1, 2, 3])
print(squares(a), int((a * a).sum()))
```

### 偶数留下

where 在偶数为真时留下原值，否则写成 0。2 和 4 相加是 6。

```numpy run expect="6" title="偶数之和"
import numpy as np
a = np.array([1, 2, 3, 4])
print(int(np.where(a % 2 == 0, a, 0).sum()))
```

### 单价乘数量

4*2、1*5、3*1 分别是 8、5、3。向量乘积的和是 16。

```numpy run expect="16" title="金额 16"
import numpy as np
price = np.array([4, 1, 3])
qty = np.array([2, 5, 1])
print(int((price * qty).sum()))
```

### reduce 和 sum

三个 2 的和是 6。add.reduce 做的是同一件加法，第二个数也是 6。

```numpy run expect="6 6" title="两种 6"
import numpy as np
a = np.array([2, 2, 2])
print(int(a.sum()), int(np.add.reduce(a)))
```

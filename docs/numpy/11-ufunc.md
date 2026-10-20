---
language: numpy
chapter: 11
title: "NumPy 通用函数"
level: intermediate
minutes: 8
goals:
  - "用 add 给每个元素加 1 再求和"
  - "用 maximum 抬高小于 2 的元素"
  - "看平均值四舍五入到一位"
sources:
  - numpy-100
updated: "2026-10-20"
---

通用函数按元素计算，并且会在需要时广播。它们返回新的数组，不改调用者手里的原件，除非你写进同一个变量。下面的例子都把结果收成一个数再打印。

### 每个元素加 1

1、2、3 各自加 1 变成 2、3、4。sum 得到 9。np.add 和 a + 1 在这个整数数组上结果一样。

```numpy run expect="9" title="加一后求和"
import numpy as np
a = np.array([1, 2, 3])
print(int(np.add(a, 1).sum()))
```

### 小于 2 的被抬高

maximum 逐个比较数组和 2。1 变成 2，2 和 3 保持。总和是 7。

```numpy run expect="7" title="抬到 2"
import numpy as np
a = np.array([1, 2, 3])
print(int(np.maximum(a, 2).sum()))
```

### 平均值是 2.0

三个浮点数的平均数是 2。round 到一位小数后打印 2.0，避免二进制小数把终端弄乱。

```numpy run expect="2.0" title="一位小数"
import numpy as np
a = np.array([1.0, 2.0, 3.0])
print(round(float(np.mean(a)), 1))
```

### 平方和

multiply 把 1、4、2 各自平方，得到 1、16、4。加起来是 21。

```numpy run expect="21" title="平方再加"
import numpy as np
a = np.array([1, 4, 2])
print(int(np.multiply(a, a).sum()))
```

numpy-100 是 MIT。这里的数组和打印是另写的，没有照搬题面：https://github.com/rougier/numpy-100 。《Python数据科学手册》只作延伸阅读：https://book.douban.com/subject/27667378 。

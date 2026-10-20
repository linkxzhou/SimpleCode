---
language: numpy
chapter: 7
title: "线性代数"
level: intermediate
minutes: 8
goals:
  - "计算对角阵的行列式"
  - "用 @ 做矩阵乘"
  - "读取单位阵的迹"
sources:
  - numpy-manual
updated: "2026-10-20"
---

np.linalg 放着行列式、求逆和最小二乘。日常的矩阵乘用 @ 就够，不必先转成 matrix 类型。

### 对角阵的行列式

对角元是 2 和 3 时，行列式就是它们的乘积 6。非对角为 0，没有交叉项。

```numpy run expect="6.0" title="行列式"
import numpy as np
# 对角阵
a = np.array([[2.0, 0.0], [0.0, 3.0]])
print(float(np.linalg.det(a)))
```

结果是 6.0。

### 矩阵乘向量

@ 按线性代数的规则相乘，不是逐项相乘。左边 2×2 乘上 2×1，得到第一列的两行，也就是 1 和 3。

```numpy run expect="[1.0, 3.0]" title="矩阵乘"
import numpy as np
# 取第一列
a = np.array([[1.0, 2.0], [3.0, 4.0]])
b = np.array([[1.0], [0.0]])
print((a @ b).reshape(-1).tolist())
```

reshape 把列向量摊平再打印。

### 迹是对角线之和

np.eye(3) 的对角线是三个 1，trace 等于 3。矩阵必须是方阵，否则迹没有定义，调用会报错。

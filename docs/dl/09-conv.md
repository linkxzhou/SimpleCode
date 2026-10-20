---
language: dl
chapter: 9
title: "卷积一眼"
level: advanced
minutes: 8
goals:
  - "用一维核做差分"
  - "用手写二维拉普拉斯核"
  - "用最大值做一次池化"
sources:
  - numpy-manual
updated: "2026-10-20"
---

卷积是把一个小核滑过输入，每个位置做一个点积。这一章只用 NumPy 看清三个位置的结果，不训练卷积层。

### 一维差分

核 [1, 0, -1] 用左边减去右边。在 1、2、3、4、5 上滑动三次，每次都得到 -2。

```numpy run expect="[-2.0, -2.0, -2.0]" title="一维核"
import numpy as np
# 三次点积
image = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
kernel = np.array([1.0, 0.0, -1.0])
out = np.array([float(np.dot(image[i:i + 3], kernel)) for i in range(3)])
print(out.tolist())
```

三个位置都是 -2.0。

### 最大值池化

池化不乘核，只在小窗口里取最大。2×2 的四格里最大是 4。它降低分辨率，也丢掉位置细节。

```numpy run expect="4.0" title="最大池化"
import numpy as np
# 四格
x = np.array([[1.0, 2.0], [3.0, 4.0]])
print(float(x.max()))
```

打印 4.0。

### 二维核看中心

拉普拉斯核中心是 -4，上下左右是 1。把它盖在 0 到 8 排成的 3×3 上，中心贡献 -16，四邻域贡献 16，加总为 0。训练真正的卷积层需要更多实现，这里只核对这个常数。

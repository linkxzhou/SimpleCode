---
language: python
chapter: 20
title: "Python3 模块"
level: beginner
minutes: 8
goals:
  - "导入标准库模块"
  - "知道本页只有当前这一份源码"
  - "用 if __name__ 区分入口"
sources:
  - lxiy-python
updated: "2026-10-15"
---

模块是一份可以被导入的 Python 文件。这个抽屉不能再去读你电脑上的另一个文件。

### 导入标准库

`import` 后面写模块名，用点取出里面的函数。

```python run expect="3" title="向上取整"
import math
print(math.ceil(2.1))
```

输出里能看到 `3`。

### 自己的文件找不到

解释器没有 `shop.py` 这份邻居。下面的导入只作阅读。

```python norun title="没有这份模块"
import shop
```

### 主程序标记

直接运行这份文件时，`__name__` 是 `__main__`。被别人导入时不是。

```python run expect="True" title="当前就是入口"
print(__name__ == "__main__")
```

输出里能看到 `True`。

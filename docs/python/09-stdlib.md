---
language: python
chapter: 9
title: "模块与标准库"
level: intermediate
minutes: 12
goals:
  - "导入 math、datetime、itertools"
  - "固定随机序列"
  - "只用标准库完成小计算"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

`import` 只在当前进程里生效，而且这里没有 pip。日期、数学、排列这些常见需求，标准库已经够用。

`datetime.date` 做日历运算不需要时区数据。`itertools.islice` 可以从无限计数器里只取前几项。

```python run expect="14" title="日期差"
from datetime import date
start = date(2026, 10, 1)
end = date(2026, 10, 15)
print((end - start).days)
```

```python run expect="12" title="math"
import math
print(math.gcd(24, 36))
print(round(math.sqrt(2), 3))
```

```python run expect="[1, 2, 3]" title="itertools"
import itertools
print(list(itertools.islice(itertools.count(1), 3)))
print(list(itertools.product("AB", "12")))
```

## 练习

用 `itertools.permutations` 打印 `"AB"` 的全部排列，每行一个。

::: answer 参考答案：排列
```python run expect="AB\nBA" title="参考答案"
import itertools
for item in itertools.permutations("AB"):
    print("".join(item))
```
:::

## 常见错误

- import requests。这个环境没有第三方包，也没有网络。
- 依赖 random.random() 的具体小数。换版本可能变化，测试应比较同一颗种子的两次结果。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

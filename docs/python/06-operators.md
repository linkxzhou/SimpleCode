---
language: python
chapter: 6
title: "Python3 运算符"
level: beginner
minutes: 8
goals:
  - "区分 / 和 //"
  - "使用比较和逻辑运算"
  - "知道幂运算用 **"
sources:
  - lxiy-python
updated: "2026-10-15"
---

运算符把值组合成新的值。整数和小数的除法不一样。

### 除法与整除

`/` 得到小数，`//` 丢掉余数，`%` 只留余数。

```python run expect="2 1" title="商和余数"
print(21 // 10, 21 % 10)
```

输出里能看到 `2 1`。

### 比较得到布尔

`==` 看值是否相等，`!=` 看是否不等。

```python run expect="True False" title="比较"
print(3 > 1, 3 == 1)
```

输出里能看到 `True False`。

### 逻辑与幂

`and` 两边都真才真。`**` 是乘方，不是按位异或。

```python run expect="8 False" title="乘方"
print(2 ** 3, True and False)
```

输出里能看到 `8 False`。

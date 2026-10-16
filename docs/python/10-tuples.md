---
language: python
chapter: 10
title: "Python3 元组"
level: beginner
minutes: 8
goals:
  - "用圆括号写出元组"
  - "知道元组不能按下标改"
  - "一次解开多个名字"
sources:
  - lxiy-python
updated: "2026-10-15"
---

元组和列表一样有序，但创建之后不能改某一项。

### 按下标读

小括号里的值用下标读取，和列表一样从 0 开始。

```python run expect="8" title="第一项"
pair = (8, 9)
print(pair[0])
```

输出里能看到 `8`。

### 不能改某一项

对元组赋值会失败。需要改内容时用列表。

```python run expect="noedit" title="只读"
pair = (8, 9)
try:
    pair[0] = 1
    print("changed")
except TypeError:
    print("noedit")
```

输出里能看到 `noedit`。

### 解开

左边放同样个数的名字，右边的元组会按位置赋过去。

```python run expect="tea 18" title="两个名字"
name, price = ("tea", 18)
print(name, price)
```

输出里能看到 `tea 18`。

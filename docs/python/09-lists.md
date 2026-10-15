---
language: python
chapter: 9
title: "Python3 列表"
level: beginner
minutes: 8
goals:
  - "用下标读取列表"
  - "用 append 增加元素"
  - "区分改原列表和切片复制"
sources:
  - lxiy-python
updated: "2026-10-15"
---

列表用方括号，长度可以变。下标从 0 开始。

### 按下标读取

第一个元素的下标是 0。负数下标从末尾数。

```python run expect="茶" title="第二项"
items = ["水", "茶"]
print(items[1])
```

输出里能看到 `茶`。

### 追加

`append` 改的是原来的列表，并返回 `None`。要看结果，打印列表本身。

```python run expect="2" title="接到末尾"
nums = [1]
nums.append(2)
print(nums[1])
```

输出里能看到 `2`。

### 切片是新列表

`[:]` 复制出另一份。改副本不会动原来的第一项。

```python run expect="4 1" title="复制"
a = [4, 5]
b = a[:]
b[0] = 1
print(a[0], b[0])
```

输出里能看到 `4 1`。

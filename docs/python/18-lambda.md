---
language: python
chapter: 18
title: "Python3 lambda"
level: beginner
minutes: 8
goals:
  - "用 lambda 写一个表达式函数"
  - "把它传给 sorted"
  - "知道它不能包含语句"
sources:
  - lxiy-python
updated: "2026-10-15"
---

`lambda` 适合一行能写完的小函数。复杂逻辑仍用 `def`。

### 两数相加

冒号右边是返回值，不能写 `return`。

```python run expect="5" title="匿名函数"
add = lambda a, b: a + b
print(add(2, 3))
```

输出里能看到 `5`。

### 当作排序的键

`sorted` 的 `key` 决定比较时看哪一项。

```python run expect="water" title="按数量排序"
rows = [("water", 2), ("tea", 9)]
rows = sorted(rows, key=lambda row: row[1])
print(rows[0][0])
```

输出里能看到 `water`。

### 不能写多条语句

需要 `if` 块或循环时，改用 `def`。下面只演示条件表达式仍能放进 lambda。

```python run expect="pos" title="条件表达式"
label = lambda n: "pos" if n > 0 else "badnum"
print(label(3))
```

输出里能看到 `pos`。

---
language: python
chapter: 28
title: "Python3 推导式进阶"
level: intermediate
minutes: 10
goals:
  - "用字典推导记下名字和长度"
  - "用集合推导收拢余数"
  - "用双层 for 铺开坐标"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

花括号推导和双层循环仍是先写结果、再写来源。这一章不重复方括号列表，只练字典、集合，以及把两层 for 摊成坐标。

### 字典记下长度

键放在冒号左边，值放在右边。短名单里 tea 的长度是 3，cup 同样是 3，两项一起进新字典。

```python run expect="tea': 3" title="名字和长度"
print({name: len(name) for name in ["tea", "cup"]})
```

打印出来的字典里能找到 `tea': 3`。

### 余数放进集合

集合会吞掉重复项。0 到 5 对 3 取余，只留下 0、1、2。外面套 sorted，是为了不让集合自己的顺序晃动。

```python run expect="[0, 1, 2]" title="余数集合"
print(sorted({n % 3 for n in range(6)}))
```

排序后的余数是 `[0, 1, 2]`。

### 两层循环铺坐标

外层 a 取 0 和 1，内层 b 也取 0 和 1。四个点一次进列表，最后一个是 (1, 1)。

```python run expect="(1, 1)" title="四个坐标"
pairs = [(a, b) for a in range(2) for b in range(2)]
print(pairs[-1])
```

列表末尾这个点是 `(1, 1)`。

### 留下贵一点的键

只保留价格不低于 6 的键，再按字母序打印。tea 的 4 会被滤掉，bun 和 cake 留下。这是这一章的小练习，下面这段就是一种写法。

```python run expect="['bun', 'cake']" title="按价格过滤"
prices = {"tea": 4, "cake": 9, "bun": 6}
kept = {k: v for k, v in prices.items() if v >= 6}
print(sorted(kept))
```

排序后的键是 `['bun', 'cake']`。

### 书外的目录

《流畅的Python》只用来对照难度，不搬句子：<https://book.douban.com/subject/27028517> 。上面四段程序是按这个练习场现写的。

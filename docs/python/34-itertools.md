---
language: python
chapter: 34
title: "Python3 itertools 与 functools"
level: intermediate
minutes: 11
goals:
  - "用 accumulate 做前缀和"
  - "用 groupby 按键分组"
  - "用 partial 和 lru_cache 收参数与重复计算"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

itertools 处理一串已经有的值，functools 处理函数本身。两边都不需要网络，也不写文件。

### 前缀和

accumulate 默认做加法。1、2、3 的前缀和是 1，然后 1+2，然后 1+2+3。

```python run expect="[1, 3, 6]" title="累加"
from itertools import accumulate
print(list(accumulate([1, 2, 3])))
```

前缀和是 `[1, 3, 6]`。

### 相邻且键相同才成一组

groupby 只把紧挨着、键又相同的行收成一组。先按键排好，a 的两行才会在一起。这里的键是每行的第一个字母。

```python run expect="ab" title="两组键"
from itertools import groupby
rows = [("a", 1), ("a", 2), ("b", 3)]
keys = [k for k, _group in groupby(rows, key=lambda row: row[0])]
print("".join(keys))
```

键拼起来是 ab。

### 先固定一个乘数

partial(mul, 2) 得到一个只等第二个参数的函数。double(5) 就是 2 乘 5。

```python run expect="10" title="固定成两倍"
from functools import partial

def mul(a, b):
    return a * b

double = partial(mul, 2)
print(double(5))
```

两倍的 5 是 10。

### 练习：缓存斐波那契

lru_cache 让每个 n 只算一次。fib(6) 的值是 8，0 到 6 各算一次，计数是 7。

```python run expect="8 7" title="缓存后的次数"
from functools import lru_cache

calls = {"n": 0}

@lru_cache(maxsize=8)
def fib(n):
    calls["n"] += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(6), calls["n"])
```

值和次数是 `8 7`。

### 再翻一页流畅的 Python

这一章的工具在《流畅的Python》里也有专章，那本书仍只作大纲：<https://book.douban.com/subject/27028517> 。

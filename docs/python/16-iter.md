---
language: python
chapter: 16
title: "Python3 迭代器与生成器"
level: beginner
minutes: 8
goals:
  - "用 iter 和 next 逐个取值"
  - "用 yield 写出生成器"
  - "知道生成器不能倒回去"
sources:
  - lxiy-python
updated: "2026-10-15"
---

迭代器每次交出下一个值。生成器函数用 `yield` 暂停。

### next 取一个

`iter` 把列表变成迭代器，`next` 只拿出当前这一个。

```python run expect="7" title="第一个"
it = iter([7, 8])
print(next(it))
```

输出里能看到 `7`。

### yield

调用生成器函数得到生成器，还不会立刻跑完函数体。

```python run expect="1" title="让出一个"
def pairs():
    yield 1
    yield 2
print(next(pairs()))
```

输出里能看到 `1`。

### 取完再取会失败

没有更多值时 `next` 抛出 `StopIteration`。

```python run expect="没有了" title="用尽"
it = iter([1])
next(it)
try:
    next(it)
    print("还有")
except StopIteration:
    print("没有了")
```

输出里能看到 `没有了`。

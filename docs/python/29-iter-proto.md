---
language: python
chapter: 29
title: "Python3 迭代器协议"
level: intermediate
minutes: 10
goals:
  - "自己实现 __iter__ 和 __next__"
  - "把游标和容器拆开"
  - "用尽之后抛出 StopIteration"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

前面用过 iter 和 yield。这一章自己写类：容器负责交出游标，游标负责记住走到哪。

### 倒着数三个数

CountDown 把自己当成游标。__next__ 先交出当前数字，再把 n 减一；减到 0 以后再取，就抛 StopIteration。list 会一直取到停。

```python run expect="[3, 2, 1]" title="倒计时"
class CountDown:
    def __init__(self, start):
        self.n = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        current = self.n
        self.n -= 1
        return current

print(list(CountDown(3)))
```

三次取值得到 `[3, 2, 1]`。

### 容器和游标分开

Bag 只保存名单。每次 __iter__ 都新造一个 Cursor，游标自己的 __iter__ 返回自己，否则 join 会拒绝它。同一只袋子可以再从头走一遍。

```python run expect="mint,bean" title="两粒豆子"
class Bag:
    def __init__(self, items):
        self.items = list(items)
    def __iter__(self):
        return Cursor(self.items)

class Cursor:
    def __init__(self, items):
        self.items = items
        self.i = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.i >= len(self.items):
            raise StopIteration
        value = self.items[self.i]
        self.i += 1
        return value

print(",".join(Bag(["mint", "bean"])))
```

拼出来的是 `mint,bean`。

### 手动 next 两次

不经过 list 时，自己拿 iter 再 next。Pair 里先放 oak 再放 pine，两下 next 就按这个顺序交出来。

```python run expect="oak pine" title="两次 next"
class Pair:
    def __init__(self):
        self.left = ["oak", "pine"]
    def __iter__(self):
        return self
    def __next__(self):
        if not self.left:
            raise StopIteration
        return self.left.pop(0)

it = iter(Pair())
print(next(it), next(it))
```

两下分别是 oak 和 pine。

### 偶数台阶

练习：写一个从 2 开始、每次加 2、超过 6 就停的游标。list 应收下 2、4、6。下面是一种写法。

```python run expect="[2, 4, 6]" title="偶数游标"
class Evens:
    def __init__(self):
        self.n = 0
    def __iter__(self):
        return self
    def __next__(self):
        self.n += 2
        if self.n > 6:
            raise StopIteration
        return self.n

print(list(Evens()))
```

收下来的是 `[2, 4, 6]`。

### 入门书只作对照

《Python编程：从入门到实践》的目录可以对照节奏，句子和例子都不要搬：<https://book.douban.com/subject/26829016> 。

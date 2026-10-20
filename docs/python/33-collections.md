---
language: python
chapter: 33
title: "Python3 collections"
level: intermediate
minutes: 10
goals:
  - "用 Counter 找出现最多的字符"
  - "用 defaultdict 累计次数"
  - "用 deque 从左边弹出"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

collections 提供几种现成的容器。Counter 计数，defaultdict 补默认值，deque 两头都能进出，namedtuple 给字段起名。

### 哪个字符最多

Counter 统计 teat 里每个字符。most_common(1) 的第一项是一对：字符和次数。t 出现两次，排在前面。

```python run expect="('t', 2)" title="最多的字符"
from collections import Counter
print(Counter("teat").most_common(1)[0])
```

排第一的是 `('t', 2)`。

### 缺了就从 0 开始加

defaultdict(int) 在第一次碰到某个键时给 0。tea 出现两次，所以累计到 2。

```python run expect="2" title="茶出现两次"
from collections import defaultdict
bag = defaultdict(int)
for word in ["tea", "tea", "cup"]:
    bag[word] += 1
print(bag["tea"])
```

tea 的次数是 2。

### 从左边拿走先来的人

deque 的 popleft 拿走最先放进去的元素。a 先进，所以先出来；c 是后加的，还留在右边。

```python run expect="a" title="队首"
from collections import deque
line = deque(["a", "b"])
line.append("c")
print(line.popleft())
```

先出来的是 a。

### 练习：给座位起字段名

namedtuple 让 row 和 num 能用点号读。Seat(3, 8) 的 row 应打印 3。

```python run expect="3" title="座位行号"
from collections import namedtuple
Seat = namedtuple("Seat", ["row", "num"])
spot = Seat(3, 8)
print(spot.row)
```

行号是 3。

### 自动化那本不能改编

Automate the Boring Stuff 是 CC-BY-NC-SA，只放链接：<https://automatetheboringstuff.com/> 。

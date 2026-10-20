---
language: python
chapter: 37
title: "Python3 协程"
level: advanced
minutes: 12
goals:
  - "用 send 把协程往前推一步"
  - "连续 await 两个纯计算"
  - "知道 asyncio.run 在这里起不来"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

async 函数一调用就得到协程对象，函数体先不跑。这份 WASI 上的 CPython 没有可用的 selector 事件循环，所以下面用一个很小的驱动器代替 asyncio.run。

### 自己把协程跑完

drive 碰到 StopIteration 就取出返回值。add(3) 只做加法，没有睡眠，所以不需要时钟。3 加 4 得到 7。

```python run expect="7" title="推进一步"
def drive(coro):
    stack = [coro]
    value = None
    while stack:
        try:
            yielded = stack[-1].send(value)
        except StopIteration as stop:
            value = stop.value
            stack.pop()
            continue
        stack.append(yielded)
        value = None
    return value

async def add(n):
    return n + 4

async def main():
    return await add(3)

print(drive(main()))
```

驱动结果是 7。

### 两个 await 串起来

main 先等 add(2)，再把结果交给第二次 add。驱动器负责在 await 时进入里面的协程，所以 2 加 5 再加 1 得到 8。

```python run expect="8" title="两段加法"
def drive(coro):
    stack = [coro]
    value = None
    while stack:
        try:
            yielded = stack[-1].send(value)
        except StopIteration as stop:
            value = stop.value
            stack.pop()
            continue
        stack.append(yielded)
        value = None
    return value

async def add(n, k):
    return n + k

async def main():
    left = await add(2, 5)
    return await add(left, 1)

print(drive(main()))
```

两段加完是 8。

### asyncio.run 留在阅读里

这份运行时创建 UnixSelectorEventLoop 时缺少 _ssock，asyncio.run 会在收尾时抛 AttributeError，协程也没被等待。下面这段不要点 Run。

```python norun title="循环起不来"
import asyncio

async def main():
    print("awake")

asyncio.run(main())
```

这段只供阅读。

### 练习：三笔小账相加

写三个 await，把 1、2、4 加起来。驱动器跑完应打印 7。

```python run expect="7" title="三笔相加"
def drive(coro):
    stack = [coro]
    value = None
    while stack:
        try:
            yielded = stack[-1].send(value)
        except StopIteration as stop:
            value = stop.value
            stack.pop()
            continue
        stack.append(yielded)
        value = None
    return value

async def take(n):
    return n

async def main():
    a = await take(1)
    b = await take(2)
    c = await take(4)
    return a + b + c

print(drive(main()))
```

三笔之和是 7。

### 事件循环的延伸阅读

官方文档的 asyncio 页描述的是完整事件循环，和这里的小驱动器不是同一件事：<https://docs.python.org/3/library/asyncio.html> 。

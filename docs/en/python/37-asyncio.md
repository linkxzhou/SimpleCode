---
language: python
chapter: 37
title: "Python Coroutines"
level: advanced
minutes: 12
goals:
  - "Step a coroutine with send"
  - "Await two pure computations in a row"
  - "See why asyncio.run cannot start here"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

Calling an async function returns a coroutine object and does not run the body yet. This WASI CPython has no usable selector event loop, so a tiny driver stands in for asyncio.run.

### Finish the coroutine yourself

drive reads the return value from StopIteration. add(3) only adds; it does not sleep, so it needs no clock. 3 plus 4 is 7.

```python run expect="7" title="One step"
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

The driver prints 7.

### Chain two awaits

main waits for add(2), then passes that result into a second add. The driver enters the inner coroutine at each await, so 2 plus 5 plus 1 is 8.

```python run expect="8" title="Two additions"
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

The two additions print 8.

### asyncio.run stays unread

Creating UnixSelectorEventLoop on this runtime fails while closing because _ssock is missing. asyncio.run then raises AttributeError, and the coroutine was never awaited. Do not press Run on the next block.

```python norun title="Loop will not start"
import asyncio

async def main():
    print("awake")

asyncio.run(main())
```

This block is for reading only.

### Exercise: add three small amounts

Write three awaits that add 1, 2, and 4. The driver should print 7.

```python run expect="7" title="Three amounts"
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

The three amounts sum to 7.

### Further reading on the event loop

The asyncio page in the official docs describes a full event loop, which is not the same thing as the small driver here: <https://docs.python.org/3/library/asyncio.html>.

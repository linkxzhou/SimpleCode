---
language: python
chapter: 11
title: "迭代器与生成器"
level: advanced
minutes: 12
goals:
  - "用 yield 暂停函数"
  - "只取无限序列的前几项"
  - "把生成器串成管道"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

含有 `yield` 的函数返回生成器。每次 `next` 或 for 循环才往下走一步，做到哪算到哪，不会先把无限序列放进内存。

生成器表达式和列表推导式很像，只是用圆括号，而且是惰性的。

```python run expect="[0, 1, 4, 9]" title="有限生成器"
def squares(limit):
    n = 0
    while n < limit:
        yield n * n
        n += 1

print(list(squares(4)))
```

```python run expect="[1, 2, 3]" title="只取前几项"
def positives():
    n = 1
    while True:
        yield n
        n += 1

def take(source, count):
    result = []
    for item in source:
        if len(result) == count:
            break
        result.append(item)
    return result

print(take(positives(), 3))
```

```python run expect="[(1, 2), (2, 3), (3, 4)]" title="滑动窗口"
def window(items, size):
    for i in range(len(items) - size + 1):
        yield tuple(items[i:i + size])

print(list(window([1, 2, 3, 4], 2)))
```

## 练习

写一个生成器，依次产出前 4 个偶数：0 2 4 6。

::: answer 参考答案：偶数
```python run expect="[0, 2, 4, 6]" title="参考答案"
def evens(count):
    n = 0
    while n < count:
        yield n * 2
        n += 1

print(list(evens(4)))
```
:::

## 常见错误

- 对无限生成器直接 list()。它永远不会结束。先限制次数。
- 生成器只能向前走。用过一次再 for，不会重新开始，需要再调用函数。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

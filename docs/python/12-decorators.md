---
language: python
chapter: 12
title: "装饰器与上下文管理器"
level: advanced
minutes: 12
goals:
  - "用闭包记住外层变量"
  - "用装饰器包住函数"
  - "用 with 管理进入和离开"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

装饰器是「接收函数、返回函数」的函数。`@twice` 写在 def 上面，等价于 `inc = twice(inc)`。

`with` 会调用对象的 `__enter__` 和 `__exit__`。适合成对出现的动作：打开然后一定关闭。这里不碰真实文件，只用打印把顺序展示出来。

```python run expect="3" title="调用两次"
def twice(fn):
    def inner(x):
        return fn(fn(x))
    return inner

@twice
def inc(n):
    return n + 1

print(inc(1))
```

```python run expect="55" title="缓存"
def cache(fn):
    saved = {}
    def inner(n):
        if n not in saved:
            saved[n] = fn(n)
        return saved[n]
    return inner

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
```

```python run expect="open\nin\nclose" title="with"
class Box:
    def __enter__(self):
        print("open")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("close")
        return False

with Box():
    print("in")
```

## 练习

写一个装饰器 `shout`，让函数的字符串返回值变成大写。

::: answer 参考答案：大写装饰器
```python run expect="HELLO" title="参考答案"
def shout(fn):
    def inner():
        return fn().upper()
    return inner

@shout
def greet():
    return "hello"

print(greet())
```
:::

## 常见错误

- 装饰器里忘记 return inner。被装饰的名字会变成 None。
- __exit__ 返回 True 会把异常吞掉。只有确实处理了错误才返回真。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

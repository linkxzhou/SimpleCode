---
language: python
chapter: 19
title: "Python3 装饰器"
level: beginner
minutes: 8
goals:
  - "写出接收函数的函数"
  - "用 @ 套在函数定义上"
  - "知道被套之后名字会变"
sources:
  - lxiy-python
updated: "2026-10-15"
---

装饰器是一个接收函数、再返回函数的函数。`@` 是调用它的简写。

### 手动套一层

先定义内部函数，再返回它。调用结果时才会进到原来的函数。

```python run expect="你好!" title="手动包装"
def shout(fn):
    def wrap():
        return fn() + "!"
    return wrap
def hi():
    return "你好"
print(shout(hi)())
```

输出里能看到 `你好!`。

### 用 @ 写在定义上方

`@shout` 等价于定义完再赋值 `hi = shout(hi)`。

```python run expect="你好!" title="语法糖"
def shout(fn):
    def wrap():
        return fn() + "!"
    return wrap
@shout
def hi():
    return "你好"
print(hi())
```

输出里能看到 `你好!`。

### 名字变成内部函数

不复制元数据时，`__name__` 看到的是包装函数的名字。

```python run expect="wrap" title="函数名"
def shout(fn):
    def wrap():
        return fn()
    return wrap
@shout
def hi():
    return "你好"
print(hi.__name__)
```

输出里能看到 `wrap`。

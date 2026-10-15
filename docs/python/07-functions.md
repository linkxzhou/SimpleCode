---
language: python
chapter: 7
title: "函数"
level: intermediate
minutes: 12
goals:
  - "定义带默认值的参数"
  - "用 *args 收集多余位置参数"
  - "理解局部变量和返回值"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

函数把一段计算收成名字。参数默认值在定义时求值一次，所以默认值不要用可变对象。没有 `return` 时结果是 `None`。

`*args` 把多出来的位置参数收成元组。lambda 只能写一个表达式，适合很短的变换。

```python run expect="42" title="计算器"
def apply(op, a, b):
    if op == "+":
        return a + b
    if op == "*":
        return a * b
    return None

print(apply("+", 20, 22))
print(apply("*", 6, 7))
```

```python run expect="6\n60" title="可变参数"
def total(*nums, scale=1):
    return sum(nums) * scale

print(total(1, 2, 3))
print(total(1, 2, 3, scale=10))
```

```python run expect="120" title="递归与 lambda"
def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

print(fact(5))
print((lambda n: n + 1)(41))
```

## 练习

写一个函数，返回斐波那契数列的第 n 项（0, 1, 1, 2, 3, 5…），并打印第 8 项。

::: answer 参考答案：斐波那契
```python run expect="21" title="参考答案"
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(8))
```
:::

## 常见错误

- 默认参数写成 def add(item, bag=[])。这个列表会在多次调用之间共享。
- 递归没有终止条件，最后会 RecursionError。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

---
language: python
chapter: 8
title: "异常处理"
level: intermediate
minutes: 12
goals:
  - "用 try / except 接住失败"
  - "用 finally 做收尾"
  - "抛出自己的异常类型"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

异常是一种控制流：出错的地方 `raise`，愿意处理的地方 `except`。只接住你准备处理的类型，不要写裸的 `except:`。

`finally` 无论是否出错都会执行。自定义异常继承 `Exception`，这样调用者可以按类型区分。

```python run expect="5.0" title="安全除法"
def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "undefined"

print(divide(10, 2))
print(divide(1, 0))
```

```python run expect="空白" title="自定义异常"
class EmptyInput(Exception):
    pass

def parse(text):
    if text.strip() == "":
        raise EmptyInput("空白")
    return int(text)

try:
    parse("  ")
except EmptyInput as err:
    print(err)
```

```python run expect="bad" title="非零退出" exit="2"
import sys
print("bad")
sys.exit(2)
```

## 练习

读入一行，能转成整数就打印它，否则打印「不是整数」。

::: answer 参考答案：解析整数
```python run stdin="3.14\n" expect="不是整数" title="参考答案"
try:
    print(int(input()))
except ValueError:
    print("不是整数")
```
:::

## 常见错误

- 用异常代替普通的 if。找不到键可以先用 in 判断，不必每次 KeyError。
- except Exception 把 KeyboardInterrupt 以外几乎所有错误都吞掉，真实的缺陷会被藏住。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

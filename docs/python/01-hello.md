---
language: python
chapter: 1
title: "你好，Python"
level: beginner
minutes: 12
goals:
  - "用 print 输出文本"
  - "写出注释"
  - "用缩进表示代码块"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

`print` 把对象变成文本写到标准输出，默认在末尾加换行。`#` 后面直到行尾是注释，解释器会跳过。

缩进在 Python 里是语法，不是装饰。同一块里的行必须使用相同的空格数。本教程统一用 4 个空格。

```python run expect="Ada Lovelace" title="名片"
print("Ada Lovelace")
print("数学家")
# 这一行不会出现在输出里
print(2026)
```

```python run expect="*\n**\n***" title="三行星号"
print("*")
print("**")
print("***")
```

::: note
输出里的引号属于源代码，不会打印出来。要打印引号，需要写在字符串里面。
:::

```python run expect="她说：你好" title="字符串内容"
print("她说：你好")
```

## 练习

打印一个三行的直角三角形，每行分别是 1、2、3 个加号。

::: answer 参考答案：加号三角形
```python run expect="+++" title="参考答案"
print("+")
print("++")
print("+++")
```
:::

## 常见错误

- 混用 Tab 和空格。缩进不一致会直接报 IndentationError。
- 忘记字符串两端的引号，解释器会把文字当成变量名。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

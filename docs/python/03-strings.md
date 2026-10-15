---
language: python
chapter: 3
title: "字符串与输入输出"
level: beginner
minutes: 12
goals:
  - "用 f-string 拼出句子"
  - "用切片取出一段文本"
  - "用 input 读取一行"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

字符串是不可变的字符序列。f-string 在花括号里写表达式，运行时再填上结果。`input` 读入一行并去掉末尾换行；提示文字会先写到输出。

```python run stdin="Ada\n" expect="你好，Ada！" title="问候"
name = input("名字？")
print(f"你好，{name}！")
```

```python run expect="Simple" title="切片"
word = "SimpleCode"
print(word[:6])
print(word[-4:])
print(len(word))
```

```python run expect="是回文" title="回文"
text = "abba"
print("是回文" if text == text[::-1] else "不是")
```

::: note
样例输入显示在代码块下方。取消「使用样例输入」后，程序会改从终端读取你键入的内容。
:::

## 练习

读入一行文本，忽略大小写后判断是不是回文，打印「是」或「否」。

::: answer 参考答案：忽略大小写
```python run stdin="Level\n" expect="是" title="参考答案"
text = input().strip().lower()
print("是" if text == text[::-1] else "否")
```
:::

## 常见错误

- 把 input 的结果直接当数字用。它永远是字符串，计算前要 float 或 int。
- 切片的右端点是开区间：word[:6] 不含下标 6。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

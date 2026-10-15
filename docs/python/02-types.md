---
language: python
chapter: 2
title: "变量与类型"
level: beginner
minutes: 12
goals:
  - "区分 int、float、str、bool"
  - "用 type 查看类型"
  - "在数字和文本之间转换"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

名字指向对象。`=` 是绑定，不是数学里的相等。`type` 告诉你对象属于哪一类。

整数除法 `/` 得到浮点数；只要整数商用 `//`。`int`、`float`、`str` 负责转换，转换失败会抛出异常。

```python run expect="212" title="温度换算"
celsius = 100
fahrenheit = celsius * 9 / 5 + 32
print(int(fahrenheit))
print(type(celsius).__name__)
```

```python run expect="bool" title="类型转换"
flag = True
print(type(flag).__name__)
print(int("36") + 1)
print(str(6) + "7")
```

```python run expect="3\n1" title="整除与余数"
print(7 // 2)
print(7 % 2)
```

## 练习

从标准输入读入身高（米）和体重（千克）两行，按 BMI = 体重 / 身高² 打印一位小数。

::: answer 参考答案：BMI
```python run stdin="1.7\n68\n" expect="23.5" title="参考答案"
height = float(input())
weight = float(input())
bmi = weight / (height * height)
print(f"{bmi:.1f}")
```
:::

## 常见错误

- 用 == 给变量赋值。比较用 ==，绑定用 =。
- 把还没转换的文本和数字相加。文本 6 和数字 7 不能直接相加，先 int 或先 str。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

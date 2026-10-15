---
language: python
chapter: 4
title: "条件与循环"
level: beginner
minutes: 12
goals:
  - "用 if / elif / else 分支"
  - "用 for 和 while 重复"
  - "让随机数在固定种子下可复现"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

条件后面的冒号和缩进组成一个块。`for` 常配合 `range`：`range(3)` 产生 0、1、2。`break` 立刻离开循环。

随机数只要种子相同，序列就相同。下面不打印具体骰子点数，只检查同一颗种子是否给出同一个数，这样换 Python 小版本也不会把测试绑死。

```python run expect="B" title="等级"
score = 86
if score >= 90:
    grade = "A"
elif score >= 60:
    grade = "B"
else:
    grade = "C"
print(grade)
```

```python run expect="稳定" title="固定种子"
import random
a = random.Random(1).randrange(1, 100)
b = random.Random(1).randrange(1, 100)
print("稳定" if a == b else "不稳")
print("范围内" if 1 <= a < 100 else "越界")
```

下面这个循环不会自己停。自动化测试会跳过它；你在页面上运行后，请点击停止。

```python run title="死循环" smoke="skip"
# 故意不停。运行后请按停止，否则后面的示例需要先确认才能接手。
while True:
    pass
```

```python run expect="1 2 Fizz 4 Buzz Fizz 7" title="FizzBuzz"
lines = []
for n in range(1, 8):
    if n % 15 == 0:
        lines.append("FizzBuzz")
    elif n % 3 == 0:
        lines.append("Fizz")
    elif n % 5 == 0:
        lines.append("Buzz")
    else:
        lines.append(str(n))
print(" ".join(lines))
```

## 练习

用 while 打印 3 到 1，最后一行是「出发」。

::: answer 参考答案：倒计时
```python run expect="出发" title="参考答案"
n = 3
while n > 0:
    print(n)
    n -= 1
print("出发")
```
:::

## 常见错误

- 在 if 同一行后面再写本该缩进的语句。那一行会无条件执行。
- range(1, 8) 不含 8。右端点永远到不了。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

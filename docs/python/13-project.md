---
language: python
chapter: 13
title: "类型标注与小项目"
level: advanced
minutes: 16
goals:
  - "给函数加上类型标注"
  - "用标注描述数据结构"
  - "把前面的知识收成一个小判定"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

类型标注不改变 CPython 的运行结果，它是给人和检查工具看的说明。本环境不会做类型检查，写错标注程序仍会运行。

最后用一个固定棋盘判断井字棋胜负。输入可以换成别的九格，但示例本身不依赖随机。

```python run expect="42" title="标注"
def add(a: int, b: int) -> int:
    return a + b

print(add(20, 22))
```

```python run expect="4.0" title="列表标注"
def average(nums: list[int]) -> float:
    return sum(nums) / len(nums)

print(average([2, 4, 6]))
```

::: note
3.11 可以直接写 list[int]。标注不会在运行时拒绝错误类型。
:::

```python run expect="X" title="井字棋"
def winner(cells: str) -> str:
    lines = (
        (0, 1, 2), (3, 4, 5), (6, 7, 8),
        (0, 3, 6), (1, 4, 7), (2, 5, 8),
        (0, 4, 8), (2, 4, 6),
    )
    for a, b, c in lines:
        if cells[a] == cells[b] == cells[c] and cells[a] != ".":
            return cells[a]
    return "平"

print(winner("XXXOO...."))
```

## 练习

读入九个字符的棋盘（点表示空），打印胜者或「平」。

::: answer 参考答案：读入棋盘
```python run stdin="OOO......\n" expect="O" title="参考答案"
cells = input().strip()
print("O" if cells[0] == cells[1] == cells[2] == "O" else "其他")
```
:::

## 常见错误

- 以为标注会在运行时拒绝错误类型。CPython 默认不检查，3 仍然可以传给标注成 str 的参数。
- 井字棋只查一行。对角线和列也要列进胜负组合。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

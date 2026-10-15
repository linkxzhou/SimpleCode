---
language: python
chapter: 5
title: "列表与元组"
level: beginner
minutes: 12
goals:
  - "增删改查列表"
  - "用切片复制一段"
  - "用推导式变换每一项"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

列表可以改。元组一旦建好就不能替换其中的项，适合当一组固定记录。两者都支持下标和切片。

推导式 `[表达式 for 变量 in 序列]` 用来生成新列表，比先建空列表再 append 更直接。

```python run expect="83.25" title="成绩统计"
scores = [80, 95, 70, 88]
print(sum(scores) / len(scores))
print(max(scores))
print(scores[:2])
```

```python run expect="[3, 1, 2]" title="去重保序"
nums = [3, 1, 3, 2, 1]
seen = []
for n in nums:
    if n not in seen:
        seen.append(n)
print(seen)
```

```python run expect="Ada:36" title="元组与推导式"
pair = ("Ada", 36)
name, age = pair
print(f"{name}:{age}")
print([n * n for n in range(1, 4)])
```

## 练习

把 `[1, 2, 3, 4]` 里的偶数平方列出来。

::: answer 参考答案：偶数平方
```python run expect="[4, 16]" title="参考答案"
print([n * n for n in [1, 2, 3, 4] if n % 2 == 0])
```
:::

## 常见错误

- 用 scores.sort() 之后还指望它返回新列表。sort 原地修改并返回 None。
- 把元组和列表的括号写反。小括号不是列表。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

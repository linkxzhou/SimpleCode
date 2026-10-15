---
language: python
chapter: 6
title: "字典与集合"
level: beginner
minutes: 12
goals:
  - "用字典按键查找"
  - "做集合的交与并"
  - "统计词频"
sources:
  - lxiy-python
  - byte-of-python
  - python-tutorial
updated: "2026-10-15"
---

字典把键映射到值，查找不需要从头扫描。集合只关心「在不在」，重复元素会自动丢掉。

遍历字典时默认走键。要同时拿到值，用 `.items()`。

```python run expect="2" title="词频"
text = "to be or not to be"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
print(counts["to"])
print(counts["be"])
```

```python run expect="[3]" title="集合运算"
a = {1, 2, 3}
b = {3, 4}
print(sorted(a & b))
print(sorted(a | b))
```

```python run expect="[('a', 2)]" title="Counter"
from collections import Counter
print(Counter("aab").most_common(1))
```

## 练习

判断两个词是不是字母异位词：排序后的字母相同。

::: answer 参考答案：异位词
```python run expect="是" title="参考答案"
left, right = "listen", "silent"
print("是" if sorted(left) == sorted(right) else "否")
```
:::

## 常见错误

- 用列表当字典的键。键必须可哈希，列表不行，元组可以。
- 集合是无序的。要稳定输出，先 sorted。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

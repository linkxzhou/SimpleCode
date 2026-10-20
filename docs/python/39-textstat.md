---
language: python
chapter: 39
title: "Python3 文本统计"
level: advanced
minutes: 12
goals:
  - "数非空行和单词"
  - "找出出现最多的单词"
  - "丢掉一个停用词再统计"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

这一章把前面的计数收成一个小工具。文本放在字符串里，不打开磁盘文件。每次运行都从这份字符串重新数。

### 行和词分开数

splitlines 按换行切开，空行用 if line 丢掉。split 不带参数时按空白切开单词。这段样例有 2 行、5 个词。

```python run expect="2 5" title="行与词"
text = "tea tea cup\nbun tea\n"
lines = [line for line in text.splitlines() if line]
words = text.split()
print(len(lines), len(words))
```

行数和词数是 `2 5`。

### 出现最多的词

Counter 按单词计数。tea 出现 3 次，比 cup 和 bun 都多。most_common 的第一项同时给出词和次数。

```python run expect="tea 3" title="冠军词"
from collections import Counter
text = "tea tea cup\nbun tea\n"
top, count = Counter(text.split()).most_common(1)[0]
print(top, count)
```

冠军是 `tea 3`。

### 把三个数并成一行

行数、词数、冠军词和它的次数可以打在同一行，方便以后对答案。样例仍是 2 行 5 词，tea 出现 3 次。

```python run expect="2 5 tea 3" title="一行摘要"
from collections import Counter
text = "tea tea cup\nbun tea\n"
lines = [line for line in text.splitlines() if line]
words = text.split()
top, count = Counter(words).most_common(1)[0]
print(len(lines), len(words), top, count)
```

摘要是 `2 5 tea 3`。

### 练习：丢掉 the

统计前先去掉 the。剩下 oak、oak、elm，冠军应是 oak，次数是 2，词数是 3。

```python run expect="3 oak 2" title="去掉 the"
from collections import Counter
text = "the oak the oak elm"
words = [word for word in text.split() if word != "the"]
top, count = Counter(words).most_common(1)[0]
print(len(words), top, count)
```

去掉之后是 `3 oak 2`。

### 项目想法来自大纲

Automate the Boring Stuff 有文本处理的路线，许可证不允许改编，只留链接：<https://automatetheboringstuff.com/> 。

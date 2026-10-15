---
language: python
chapter: 26
title: "Python3 正则表达式"
level: beginner
minutes: 8
goals:
  - "用 search 找第一处"
  - "用 findall 找出全部"
  - "用 sub 替换"
sources:
  - lxiy-python
updated: "2026-10-15"
---

`re` 按模式扫描字符串。模式写在原始字符串里，反斜杠不用再转义一层。

### 第一处数字

`search` 找到就给出匹配对象，取 `group` 得到文本。

```python run expect="18" title="一处"
import re
print(re.search(r"\d+", "房号 18").group())
```

输出里能看到 `18`。

### 全部找出来

`findall` 返回列表。这里有两段数字。

```python run expect="2" title="两段"
import re
print(len(re.findall(r"\d+", "房号 18 室 2")))
```

输出里能看到 `2`。

### 替换空白

`sub` 把匹配换成给定文本。

```python run expect="a b" title="压成一个空格"
import re
print(re.sub(r"\s+", " ", "a  b"))
```

输出里能看到 `a b`。

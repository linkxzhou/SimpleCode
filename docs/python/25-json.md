---
language: python
chapter: 25
title: "Python3 JSON"
level: beginner
minutes: 8
goals:
  - "把文本解析成字典"
  - "把字典序列化成文本"
  - "接住损坏的文本"
sources:
  - lxiy-python
updated: "2026-10-15"
---

`json` 在文本和 Python 的字典、列表之间转换。

### 解析

`loads` 读字符串。键在 JSON 里必须是双引号。

```python run expect="3" title="读出数字"
import json
print(json.loads('{"n": 3}')["n"])
```

输出里能看到 `3`。

### 序列化

`dumps` 得到文本。`ensure_ascii=False` 会按原文写出非 ASCII；下面的键和值本身就是 ASCII。

```python run expect="{\"thing\": \"tea\"}" title="写成文本"
import json
print(json.dumps({"thing": "tea"}, ensure_ascii=False))
```

输出里能看到 `{"thing": "tea"}`。

### 损坏的文本

少一个括号时 `loads` 抛出 `JSONDecodeError`。

```python run expect="broken" title="解析失败"
import json
try:
    json.loads("{")
    print("passed")
except json.JSONDecodeError:
    print("broken")
```

输出里能看到 `broken`。

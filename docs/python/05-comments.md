---
language: python
chapter: 5
title: "Python3 注释"
level: beginner
minutes: 8
goals:
  - "用井号写行注释"
  - "知道注释不产生输出"
  - "不要把说明写成会执行的字符串"
sources:
  - lxiy-python
updated: "2026-10-15"
---

注释给读代码的人看，解释器会跳过它。

### 井号到行尾

`#` 后面的字不会执行。

```python run expect="shown" title="注释被跳过"
print("shown")  # 这一句才执行
```

输出里能看到 `shown`。

### 整行注释

单独一行的 `#` 可以写下你暂时不想跑的式子。

```python run expect="kept" title="整行跳过"
# print("隐藏")
print("kept")
```

输出里能看到 `kept`。

### 文档字符串仍是值

函数开头的三引号字符串如果没人读取，就不会出现在输出里。

```python run expect="ok" title="返回值不是文档"
def ready():
    """ready now"""
    return "ok"
print(ready())
```

输出里能看到 `ok`。

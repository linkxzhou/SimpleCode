---
language: python
chapter: 11
title: "Python3 字典"
level: beginner
minutes: 8
goals:
  - "用键读取值"
  - "判断键是否存在"
  - "知道列表不能当键"
sources:
  - lxiy-python
updated: "2026-10-15"
---

字典用花括号，按键找值，不靠位置。

### 按键读取

方括号里写键。键不存在时会抛出 `KeyError`。

```python run expect="18" title="单价"
price = {"茶": 18}
print(price["茶"])
```

输出里能看到 `18`。

### get 给出默认

没有这个键时，`get` 返回你准备的默认值，而不是中断。

```python run expect="0" title="缺键"
price = {"茶": 18}
print(price.get("水", 0))
```

输出里能看到 `0`。

### 键必须能哈希

列表不能当键。字符串和整数可以。

```python run expect="不能当键" title="列表做键"
try:
    {["茶"]: 18}
    print("过了")
except TypeError:
    print("不能当键")
```

输出里能看到 `不能当键`。

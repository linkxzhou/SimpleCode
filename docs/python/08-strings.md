---
language: python
chapter: 8
title: "Python3 字符串"
level: beginner
minutes: 8
goals:
  - "用 input 读入一行名字"
  - "按字符数而不是字节数取长度"
  - "用方法去掉空白和替换文字"
sources:
  - lxiy-python
updated: "2026-10-15"
---

字符串是一串字符。`len` 数的是字符个数，一个汉字算一个。

### 读入一行

第一个可运行例子按名字问候。`input` 的提示会和答案连在同一行，期望只核对问候本身。标准输入末尾要有换行，否则解释器会一直等。

```python run stdin="Ada\n" expect="你好，Ada！" title="按名字问候"
name = input("名字？")
print(f"你好，{name}！")
```

输出里能看到 `你好，Ada！`。

### 长度按字符计

`len` 看到两个汉字就是 2，不是 UTF-8 的 6 个字节。

```python run expect="2" title="两个字"
print(len("你好"))
```

输出里能看到 `2`。

### 去掉两端空白

`strip` 去掉两头的空格，中间的字保留。

```python run expect="茶" title="去空白"
print("  茶  ".strip())
```

输出里能看到 `茶`。

### 替换一段

`replace` 返回新字符串，原来的那份不变。

```python run expect="绿茶" title="替换"
print("红茶".replace("红", "绿"))
```

输出里能看到 `绿茶`。

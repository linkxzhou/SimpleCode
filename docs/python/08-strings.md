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

字符串是一串字符。`len` 数的是字符个数。

### 读入一行

第一个可运行例子按名字问候。`input` 的提示会和答案连在同一行，期望只核对问候本身。标准输入末尾要有换行，否则解释器会一直等。

```python run stdin="Ada\n" expect="Hello, Ada!" title="按名字问候"
name = input("Name?")
print(f"Hello, {name}!")
```

输出里能看到 `Hello, Ada!`。

### 长度按字符计

`len("Hi")` 是 2。这几个字母各占一个字节。

```python run expect="2" title="两个字"
print(len("Hi"))
```

输出里能看到 `2`。

### 去掉两端空白

`strip` 去掉两头的空格，中间的字保留。

```python run expect="tea" title="去空白"
print("  tea  ".strip())
```

输出里能看到 `tea`。

### 替换一段

`replace` 返回新字符串，原来的那份不变。

```python run expect="greentea" title="替换"
print("redtea".replace("red", "green"))
```

输出里能看到 `greentea`。

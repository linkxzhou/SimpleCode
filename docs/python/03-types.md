---
language: python
chapter: 3
title: "Python3 基本数据类型"
level: beginner
minutes: 8
goals:
  - "区分整数、小数、布尔和字符串"
  - "用 type 查看类型名"
  - "知道空容器在条件里为假"
sources:
  - lxiy-python
updated: "2026-10-15"
---

每个值都有类型。类型决定能做哪些运算。

### 四种常见值

整数、小数、布尔和字符串可以放在同一次打印里，中间会有空格。

```python run expect="int float bool" title="类型名"
print(type(3).__name__, type(1.5).__name__, type(True).__name__)
```

输出里能看到 `int float bool`。

### 字符串用引号

单引号和双引号都可以。引号里面的字是文本，不是变量名。

```python run expect="tea" title="文本"
item = "tea"
print(item)
```

输出里能看到 `tea`。

### 空值在条件里为假

`0`、空串和空列表都当作假。非空的数和文本当作真。

```python run expect="False False True" title="真假"
print(bool(0), bool(""), bool([1]))
```

输出里能看到 `False False True`。

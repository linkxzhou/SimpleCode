---
language: python
chapter: 17
title: "Python3 函数"
level: beginner
minutes: 8
goals:
  - "定义带参数的函数"
  - "给参数默认值"
  - "避免用可变对象当默认值"
sources:
  - lxiy-python
updated: "2026-10-15"
---

函数把一段计算收成名字。参数按位置传入。

### 定义和调用

参数写在括号里，调用时按顺序给值。

```python run expect="12" title="面积"
def area(w, h):
    return w * h
print(area(3, 4))
```

输出里能看到 `12`。

### 默认参数

调用时可以省略已经有默认值的参数。

```python run expect="你好，客人" title="省略名字"
def greet(name="客人"):
    return "你好，" + name
print(greet())
```

输出里能看到 `你好，客人`。

### 默认可变参数会记住上次

默认值只在定义时创建一次。列表当默认值时，下一次调用还能看见上一次放进去的元素。

```python run expect="1 2" title="共享的默认列表"
def push(item, box=[]):
    box.append(item)
    return len(box)
print(push("茶"), push("水"))
```

输出里能看到 `1 2`。

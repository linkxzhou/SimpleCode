---
language: python
chapter: 24
title: "Python3 命名空间和作用域"
level: beginner
minutes: 8
goals:
  - "区分函数内的名字和外面的名字"
  - "看出内层赋值不会改外层"
  - "用 global 时知道它会改外层"
sources:
  - lxiy-python
updated: "2026-10-15"
---

函数里第一次赋值的名字属于这个函数。读外层的名字可以，赋值默认不是改外层。

### 内层的新名字

函数里给 `city` 赋值，外面的 `city` 还是原来的。

```python run expect="苏州 杭州" title="互不影响"
city = "杭州"
def show():
    city = "苏州"
    return city
print(show(), city)
```

输出里能看到 `苏州 杭州`。

### 只读外层

函数里不赋值，用到的就是外面的那个名字。

```python run expect="克" title="读到外层"
unit = "克"
def show():
    return unit
print(show())
```

输出里能看到 `克`。

### global 会改外层

声明 `global` 之后，函数里的赋值写到模块那一层。课程里少用，避免远处的名字被悄悄改掉。

```python run expect="1" title="改外层"
count = 0
def bump():
    global count
    count += 1
bump()
print(count)
```

输出里能看到 `1`。

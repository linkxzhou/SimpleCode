---
language: python
chapter: 36
title: "Python3 属性与描述符"
level: advanced
minutes: 11
goals:
  - "用 property 挡住负数"
  - "用描述符在赋值时夹住数值"
  - "区分读到描述符自己和读到实例值"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

property 写在一个类里面。描述符是另一个类，放进宿主类的类属性里，拦截这个属性的读取和赋值。

### 负数容量改成 0

Cup.ml 的 setter 看见小于 0 的数就改成 0。创建时是 10，随后赋成 -3，读出来应是 0。

```python run expect="0" title="容量夹住"
class Cup:
    def __init__(self, ml):
        self._ml = ml
    @property
    def ml(self):
        return self._ml
    @ml.setter
    def ml(self, value):
        self._ml = 0 if value < 0 else value

cup = Cup(10)
cup.ml = -3
print(cup.ml)
```

读出来是 0。

### 描述符记住私有名

Positive.__set_name__ 在类创建时拿到字段名 gap，真正的数存在 _gap。赋值小于等于 0 时写成 0。Meter(-4) 的 gap 因此是 0。

```python run expect="0" title="正数闸门"
class Positive:
    def __set_name__(self, owner, name):
        self.private = "_" + name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private, 0)
    def __set__(self, obj, value):
        setattr(obj, self.private, value if value > 0 else 0)

class Meter:
    gap = Positive()
    def __init__(self, gap):
        self.gap = gap

print(Meter(-4).gap)
```

夹住之后是 0。

### 从类上读到的是描述符

obj 是 None 时 __get__ 返回描述符自己。Meter.gap 因此是 Positive 的实例，它的类名可以打出来。

```python run expect="Positive" title="类上的属性"
class Positive:
    def __set_name__(self, owner, name):
        self.private = "_" + name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private, 0)
    def __set__(self, obj, value):
        setattr(obj, self.private, value if value > 0 else 0)

class Meter:
    gap = Positive()

print(type(Meter.gap).__name__)
```

类名是 Positive。

### 练习：空白名字改成 anon

用 property 把空字符串收成 anon。传入空串再读，应得到 anon。

```python run expect="anon" title="空白改名"
class Badge:
    def __init__(self, name):
        self.name = name
    @property
    def name(self):
        return self._name
    @name.setter
    def name(self, value):
        self._name = value if value else "anon"

print(Badge("").name)
```

空名字变成 anon。

### 入门书的后半本

《Python编程：从入门到实践》后半本的项目目录可以当路线，不搬代码：<https://book.douban.com/subject/26829016> 。

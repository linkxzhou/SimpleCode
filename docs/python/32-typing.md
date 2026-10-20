---
language: python
chapter: 32
title: "Python3 类型注解"
level: intermediate
minutes: 10
goals:
  - "给参数和返回值写注解"
  - "用 list[str] 标一串字符串"
  - "用 get_type_hints 读回注解"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

注解存在函数的 __annotations__ 里，解释器不会按它拦下错误的实参。想检查，要另外写测试或外部工具。

### 标注不会改乘法

twice 标了 int 进、int 出。真正执行的仍是 n * 2，4 乘 2 得到 8。

```python run expect="8" title="乘二"
def twice(n: int) -> int:
    return n * 2

print(twice(4))
```

结果是 8。

### 列表元素的标注

list[str] 表示期望一串字符串。first 只是取下标 0，tea 会原样出来。

```python run expect="tea" title="第一个名字"
def first(items: list[str]) -> str:
    return items[0]

print(first(["tea", "cup"]))
```

取到的是 tea。

### 运行时仍能读到标注

get_type_hints 把 points 这个名字映回 int。打印类型的 __name__，得到 int 这个词。

```python run expect="int" title="读标注"
from typing import get_type_hints

def score(name: str, points: int) -> str:
    return name

hints = get_type_hints(score)
print(hints["points"].__name__)
```

points 的标注名是 int。

### 传错类型也不会拦

练习：label 标了 int，却传入 tea。函数体用 str 拼起来，所以仍打印 n=tea。这就是注解不执法。

```python run expect="n=tea" title="不拦截"
def label(n: int) -> str:
    return "n=" + str(n)

print(label("tea"))
```

拼出来的是 n=tea。

### 官方教程只作链接

Python 官方教程的 typing 章节可以接着读，正文不搬：<https://docs.python.org/3/tutorial/> 。

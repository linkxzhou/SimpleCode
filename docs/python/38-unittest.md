---
language: python
chapter: 38
title: "Python3 unittest 与 doctest"
level: advanced
minutes: 11
goals:
  - "用文档字符串里的例子做 doctest"
  - "用 TestCase 跑一条断言"
  - "失败时自己抛 AssertionError"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

测试在同一份解释器里跑完。doctest 对照文档字符串里的例子，unittest 把方法收成套件。两边都不去连网。

### 文档里的例子要对上

tax 的文档字符串写了一次调用和期望的 12。testmod 发现没有失败时，failed 是 0。

```python run expect="failed 0" title="文档测试"
def tax(price):
    """
    >>> tax(10)
    12
    """
    return price + 2

import doctest
print("failed", doctest.testmod().failed)
```

失败条数是 `failed 0`。

### 一条单元测试

PriceTest.test_tax 断言 10 加 2 等于 12。verbosity 设成 0 仍会打出 OK，我们自己再打印 fail 和失败条数。

```python run expect="fail 0" title="单价税"
import unittest

class PriceTest(unittest.TestCase):
    def test_tax(self):
        self.assertEqual(10 + 2, 12)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(PriceTest)
result = unittest.TextTestRunner(verbosity=0).run(suite)
print("fail", len(result.failures))
```

自己的那一行是 `fail 0`。

### 手写的检查

不想拉起整套 runner 时，函数自己比对应有的值和期望值。相等就返回 ok。

```python run expect="ok" title="手写断言"
def check(got, want):
    if got != want:
        raise AssertionError(want)
    return "ok"

print(check(3 + 4, 7))
```

检查通过时是 ok。

### 练习：两条测试都过

再加一条 test_double，断言 6 乘 2 等于 12。testsRun 应是 2，失败条数仍是 0。

```python run expect="ran 2 fail 0" title="两条都过"
import unittest

class DoubleTest(unittest.TestCase):
    def test_add(self):
        self.assertEqual(1 + 1, 2)
    def test_double(self):
        self.assertEqual(6 * 2, 12)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(DoubleTest)
result = unittest.TextTestRunner(verbosity=0).run(suite)
print("ran", result.testsRun, "fail", len(result.failures))
```

汇总是 `ran 2 fail 0`。

### Think Python 的练习另看

Think Python 里的练习题版权不允许搬过来，需要时自己打开：<https://greenteapress.com/wp/think-python-3rd-edition/> 。

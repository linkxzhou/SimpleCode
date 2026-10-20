---
language: python
chapter: 38
title: "Python unittest and doctest"
level: advanced
minutes: 11
goals:
  - "Run an example stored in a docstring with doctest"
  - "Run one assertion with TestCase"
  - "Raise AssertionError yourself on failure"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

The tests finish inside this same interpreter. doctest checks examples stored in a docstring, and unittest gathers methods into a suite. Neither one opens a network connection.

### The example in the docstring must match

The docstring of tax records one call and the expected 12. When testmod finds no failure, failed is 0.

```python run expect="failed 0" title="Doctest"
def tax(price):
    """
    >>> tax(10)
    12
    """
    return price + 2

import doctest
print("failed", doctest.testmod().failed)
```

The failure count is `failed 0`.

### One unit test

PriceTest.test_tax asserts that 10 plus 2 equals 12. verbosity 0 still prints OK, and the sample also prints fail plus the failure count.

```python run expect="fail 0" title="Price tax"
import unittest

class PriceTest(unittest.TestCase):
    def test_tax(self):
        self.assertEqual(10 + 2, 12)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(PriceTest)
result = unittest.TextTestRunner(verbosity=0).run(suite)
print("fail", len(result.failures))
```

Our own line is `fail 0`.

### A check written by hand

When you do not want the whole runner, a function can compare the value it got with the value it wanted. Equality returns ok.

```python run expect="ok" title="Hand-written check"
def check(got, want):
    if got != want:
        raise AssertionError(want)
    return "ok"

print(check(3 + 4, 7))
```

A passing check prints ok.

### Exercise: both tests pass

Add test_double and assert that 6 times 2 equals 12. testsRun should be 2, and the failure count should stay 0.

```python run expect="ran 2 fail 0" title="Both pass"
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

The summary is `ran 2 fail 0`.

### Think Python exercises are elsewhere

Exercises in Think Python cannot be copied here. Open the book when you want them: <https://greenteapress.com/wp/think-python-3rd-edition/>.

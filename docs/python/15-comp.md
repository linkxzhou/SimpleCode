---
language: python
chapter: 15
title: "Python3 推导式"
level: beginner
minutes: 8
goals:
  - "用列表推导收集结果"
  - "在推导里过滤"
  - "用生成器表达式求和"
sources:
  - lxiy-python
updated: "2026-10-15"
---

推导式把循环收成一个表达式，用来造新的列表或直接交给函数。

### 列出平方

方括号里先写结果，再写 `for`。

```python run expect="[0, 1, 4]" title="三个平方"
print([n * n for n in range(3)])
```

输出里能看到 `[0, 1, 4]`。

### 只留偶数

`if` 放在 `for` 后面，不满足的项不会进来。

```python run expect="[0, 2, 4]" title="偶数"
print([n for n in range(5) if n % 2 == 0])
```

输出里能看到 `[0, 2, 4]`。

### 生成器直接求和

圆括号里的推导不会先造出完整列表。`sum` 逐个取数。

```python run expect="6" title="0 到 3 的和"
print(sum(n for n in range(4)))
```

输出里能看到 `6`。

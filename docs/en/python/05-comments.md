---
language: python
chapter: 5
title: "Python Comments"
level: beginner
minutes: 8
goals:
  - "Write a line comment with a hash"
  - "Expect no output from a comment"
  - "Keep notes out of a string that runs"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Comments are for the person reading the code. The interpreter skips them.

### From the hash to the end of the line

Characters after `#` do not run.

```python run expect="可见" title="The comment is skipped"
print("可见")  # 这一句才执行
```

Only `可见` is printed.

### A whole-line comment

A `#` on its own line can hold an expression you do not want to run yet.

```python run expect="留下" title="Skip the whole line"
# print("隐藏")
print("留下")
```

The line that remains is `留下`.

### A docstring is still a value

A triple-quoted string at the start of a function does not show up in the output if nobody reads it.

```python run expect="好" title="The return value is not the docstring"
def ready():
    """准备完成"""
    return "好"
print(ready())
```

The function returns `好`.

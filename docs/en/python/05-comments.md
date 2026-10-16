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

```python run expect="shown" title="The comment is skipped"
print("shown")  # this line runs
```

Only `shown` is printed.

### A whole-line comment

A `#` on its own line can hold an expression you do not want to run yet.

```python run expect="kept" title="Skip the whole line"
# print("hidden")
print("kept")
```

The line that remains is `kept`.

### A docstring is still a value

A triple-quoted string at the start of a function does not show up in the output if nobody reads it.

```python run expect="ok" title="The return value is not the docstring"
def ready():
    """ready now"""
    return "ok"
print(ready())
```

The function returns `ok`.

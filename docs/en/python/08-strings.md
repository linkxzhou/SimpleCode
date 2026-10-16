---
language: python
chapter: 8
title: "Python Strings"
level: beginner
minutes: 8
goals:
  - "Read a name with input"
  - "Count characters rather than bytes"
  - "Strip whitespace and replace text with methods"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A string is a sequence of characters. `len` counts characters, and one Chinese character counts as one.

### Read one line

The first runnable sample greets someone by name. The prompt from `input` sits on the same line as the answer, and the check looks only at the greeting. Standard input must end with a newline, or the interpreter keeps waiting.

```python run stdin="Ada\n" expect="你好，Ada！" title="Greet by name"
name = input("名字？")
print(f"你好，{name}！")
```

The greeting is `你好，Ada！`.

### Length counts characters

`len` sees two Chinese characters as 2, not as the six bytes of their UTF-8 encoding.

```python run expect="2" title="Two characters"
print(len("你好"))
```

The length is `2`.

### Strip both ends

`strip` removes spaces at both ends and keeps the characters in the middle.

```python run expect="茶" title="Strip whitespace"
print("  茶  ".strip())
```

What remains is `茶`.

### Replace a piece

`replace` returns a new string. The original string stays as it was.

```python run expect="绿茶" title="Replace"
print("红茶".replace("红", "绿"))
```

The new text is `绿茶`.

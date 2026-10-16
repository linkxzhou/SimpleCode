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

A string is a sequence of characters. `len` counts characters.

### Read one line

The first runnable sample greets someone by name. The prompt from `input` sits on the same line as the answer, and the check looks only at the greeting. Standard input must end with a newline, or the interpreter keeps waiting.

```python run stdin="Ada\n" expect="Hello, Ada!" title="Greet by name"
name = input("Name?")
print(f"Hello, {name}!")
```

The greeting is `Hello, Ada!`.

### Length counts characters

`len("Hi")` is 2. Each of these letters is one byte.

```python run expect="2" title="Two characters"
print(len("Hi"))
```

The length is `2`.

### Strip both ends

`strip` removes spaces at both ends and keeps the characters in the middle.

```python run expect="tea" title="Strip whitespace"
print("  tea  ".strip())
```

What remains is `tea`.

### Replace a piece

`replace` returns a new string. The original string stays as it was.

```python run expect="greentea" title="Replace"
print("redtea".replace("red", "green"))
```

The new text is `greentea`.

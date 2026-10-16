---
language: python
chapter: 9
title: "Python Lists"
level: beginner
minutes: 8
goals:
  - "Read a list by index"
  - "Add an element with append"
  - "Tell an in-place change from a slice copy"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A list uses square brackets, and its length can change. Indexes start at 0.

### Read by index

The first element has index 0. A negative index counts back from the end.

```python run expect="茶" title="The second item"
items = ["水", "茶"]
print(items[1])
```

Index 1 holds `茶`.

### Append

`append` changes the original list and returns `None`. To see the result, print the list itself.

```python run expect="2" title="Append at the end"
nums = [1]
nums.append(2)
print(nums[1])
```

The new last item prints `2`.

### A slice is a new list

`[:]` copies the list. Changing the copy does not touch the first item of the original.

```python run expect="4 1" title="Copy"
a = [4, 5]
b = a[:]
b[0] = 1
print(a[0], b[0])
```

The two first items are `4 1`.

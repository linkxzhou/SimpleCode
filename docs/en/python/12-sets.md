---
language: python
chapter: 12
title: "Python Sets"
level: beginner
minutes: 8
goals:
  - "Drop duplicates with a set"
  - "Compute an intersection"
  - "Test whether an element is in a set"
sources:
  - lxiy-python
updated: "2026-10-16"
---

Elements in a set are distinct. A set has no index.

### Duplicates drop out

If the same value is inserted twice, the length counts it once.

```python run expect="2" title="Two distinct numbers"
nums = {1, 1, 2}
print(len(nums))
```

The set length is `2`.

### Intersection

`&` keeps elements that appear on both sides.

```python run expect="1" title="The shared 2"
print(len({1, 2} & {2, 3}))
```

The overlap has length `1`.

### Membership

`in` asks whether this value sits in the set.

```python run expect="True" title="Present or not"
print("茶" in {"茶", "水"})
```

The membership test prints `True`.

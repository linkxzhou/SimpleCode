---
language: python
chapter: 12
title: "Python3 集合"
level: beginner
minutes: 8
goals:
  - "用集合去掉重复"
  - "做交集"
  - "判断元素是否在集合里"
sources:
  - lxiy-python
updated: "2026-10-15"
---

集合里的元素互不相同，也没有下标。

### 自动去重

同一个值放进去两次，长度只算一次。

```python run expect="2" title="两个不同的数"
nums = {1, 1, 2}
print(len(nums))
```

输出里能看到 `2`。

### 交集

`&` 留下两边都有的元素。

```python run expect="1" title="共同的 2"
print(len({1, 2} & {2, 3}))
```

输出里能看到 `1`。

### 成员测试

`in` 用来问这个值在不在集合里。

```python run expect="True" title="在不在"
print("茶" in {"茶", "水"})
```

输出里能看到 `True`。

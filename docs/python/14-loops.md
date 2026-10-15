---
language: python
chapter: 14
title: "Python3 循环语句"
level: beginner
minutes: 8
goals:
  - "用 for 遍历一段整数"
  - "用 while 减到零"
  - "把死循环标成不参与冒烟"
sources:
  - lxiy-python
updated: "2026-10-15"
---

循环重复同一块代码。`for` 走完序列就停，`while` 看条件。

### for 累加

`range(1, 4)` 含 1 不含 4。三轮加出来是 6。

```python run expect="6" title="从 1 加到 3"
total = 0
for i in range(1, 4):
    total += i
print(total)
```

输出里能看到 `6`。

### while 倒计

条件变假之后循环结束。别忘了在块里改变条件用到的变量。

```python run expect="0" title="减到零"
left = 2
while left > 0:
    left -= 1
print(left)
```

输出里能看到 `0`。

### break

`break` 立刻离开这一层循环。

```python run expect="3" title="数到 3 就停"
for i in range(10):
    if i == 3:
        break
print(i)
```

输出里能看到 `3`。

### 不停的循环

条件永远为真、块里又没有 `break` 时，这一次运行不会自己结束。冒烟不执行它。

```python run smoke=skip title="死循环"
while True:
    pass
```

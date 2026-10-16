---
language: python
chapter: 14
title: "Python Loops"
level: beginner
minutes: 8
goals:
  - "Walk a span of integers with for"
  - "Count down to zero with while"
  - "Mark an infinite loop so smoke tests skip it"
sources:
  - lxiy-python
updated: "2026-10-16"
---

A loop repeats one block of code. `for` stops after the sequence ends. `while` keeps going while its condition holds.

### Sum with for

`range(1, 4)` includes 1 and excludes 4. Three passes add up to 6.

```python run expect="6" title="Add from 1 to 3"
total = 0
for i in range(1, 4):
    total += i
print(total)
```

The total is `6`.

### Count down with while

The loop ends once the condition becomes false. Change, inside the block, the variable that condition uses.

```python run expect="0" title="Down to zero"
left = 2
while left > 0:
    left -= 1
print(left)
```

The counter finishes at `0`.

### break

`break` leaves the current loop at once.

```python run expect="3" title="Stop at 3"
for i in range(10):
    if i == 3:
        break
print(i)
```

The loop stops on `3`.

### A loop that does not stop

When the condition stays true and the block contains no `break`, the run will not finish on its own. Smoke testing skips that block.

```python run smoke=skip title="Infinite loop"
while True:
    pass
```

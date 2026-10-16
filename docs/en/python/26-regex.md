---
language: python
chapter: 26
title: "Python Regular Expressions"
level: beginner
minutes: 8
goals:
  - "Find the first match with search"
  - "Collect every match with findall"
  - "Replace matches with sub"
sources:
  - lxiy-python
updated: "2026-10-16"
---

`re` scans a string with a pattern. Put that pattern in a raw string so each backslash needs no extra escape.

### The first run of digits

`search` returns a match object when it finds something. Call `group` on that object to take the matched text.

```python run expect="18" title="One match"
import re
print(re.search(r"\d+", "room 18").group())
```

The matched digits are `18`.

### Find every match

`findall` returns a list. The sample string holds two separate runs of digits.

```python run expect="2" title="Two spans"
import re
print(len(re.findall(r"\d+", "room 18 slot 2")))
```

The count of those runs is `2`.

### Replace whitespace

`sub` swaps each match for the replacement text you supply.

```python run expect="a b" title="Collapse to one space"
import re
print(re.sub(r"\s+", " ", "a  b"))
```

The collapsed string is `a b`.

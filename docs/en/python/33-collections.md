---
language: python
chapter: 33
title: "Python collections"
level: intermediate
minutes: 10
goals:
  - "Find the most common character with Counter"
  - "Tally with defaultdict"
  - "Pop from the left of a deque"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

collections ships a few ready-made containers. Counter tallies, defaultdict fills in a default, deque accepts both ends, and namedtuple names the fields.

### Which character wins

Counter tallies each character in teat. The first item of most_common(1) is a pair: the character and its count. t appears twice and sorts first.

```python run expect="('t', 2)" title="Top character"
from collections import Counter
print(Counter("teat").most_common(1)[0])
```

The top pair is `('t', 2)`.

### Start from zero when the key is missing

defaultdict(int) supplies 0 the first time a key is touched. tea appears twice, so the tally reaches 2.

```python run expect="2" title="Tea twice"
from collections import defaultdict
bag = defaultdict(int)
for word in ["tea", "tea", "cup"]:
    bag[word] += 1
print(bag["tea"])
```

The tea tally is 2.

### Take the earliest person from the left

popleft on a deque removes the element that arrived first. a went in first, so it comes out first; c was appended later and stays on the right.

```python run expect="a" title="Front of the line"
from collections import deque
line = deque(["a", "b"])
line.append("c")
print(line.popleft())
```

The first one out is a.

### Exercise: name the seat fields

namedtuple lets row and num be read with a dot. Seat(3, 8) should print 3 for row.

```python run expect="3" title="Seat row"
from collections import namedtuple
Seat = namedtuple("Seat", ["row", "num"])
spot = Seat(3, 8)
print(spot.row)
```

The row number is 3.

### The automate book stays unadapted

Automate the Boring Stuff with Python is CC-BY-NC-SA, so only the link belongs here: <https://automatetheboringstuff.com/>.

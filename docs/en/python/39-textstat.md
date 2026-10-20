---
language: python
chapter: 39
title: "Python Word Tally"
level: advanced
minutes: 12
goals:
  - "Count non-empty lines and words"
  - "Find the word that appears most often"
  - "Drop one stop word and tally again"
sources:
  - byte-of-python
  - lxiy-python
updated: "2026-10-20"
---

This chapter turns the earlier counting tools into a small utility. The text lives in a string, and no disk file is opened. Each run counts that string from scratch.

### Count lines and words apart

splitlines cuts on newlines, and if line drops a blank line. split with no argument cuts words on whitespace. This sample has 2 lines and 5 words.

```python run expect="2 5" title="Lines and words"
text = "tea tea cup\nbun tea\n"
lines = [line for line in text.splitlines() if line]
words = text.split()
print(len(lines), len(words))
```

The line count and word count are `2 5`.

### The word that appears most

Counter tallies by word. tea appears 3 times, more than cup or bun. The first item from most_common gives both the word and the count.

```python run expect="tea 3" title="Top word"
from collections import Counter
text = "tea tea cup\nbun tea\n"
top, count = Counter(text.split()).most_common(1)[0]
print(top, count)
```

The winner is `tea 3`.

### Put the three numbers on one line

Line count, word count, the winning word, and its count can share one line so the answer is easy to check. The sample is still 2 lines, 5 words, and tea three times.

```python run expect="2 5 tea 3" title="One-line summary"
from collections import Counter
text = "tea tea cup\nbun tea\n"
lines = [line for line in text.splitlines() if line]
words = text.split()
top, count = Counter(words).most_common(1)[0]
print(len(lines), len(words), top, count)
```

The summary is `2 5 tea 3`.

### Exercise: drop the

Drop the before counting. oak, oak, and elm remain, so the winner should be oak with count 2, and the word count should be 3.

```python run expect="3 oak 2" title="Without the"
from collections import Counter
text = "the oak the oak elm"
words = [word for word in text.split() if word != "the"]
top, count = Counter(words).most_common(1)[0]
print(len(words), top, count)
```

After the drop, the line is `3 oak 2`.

### The project idea came from an outline

Automate the Boring Stuff with Python sketches a text-processing route. Its license does not allow adaptation, so only the link is here: <https://automatetheboringstuff.com/>.

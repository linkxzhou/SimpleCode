---
language: python
chapter: 25
title: "Python JSON"
level: beginner
minutes: 8
goals:
  - "Parse text into a dictionary"
  - "Serialize a dictionary into text"
  - "Catch damaged text"
sources:
  - lxiy-python
updated: "2026-10-16"
---

The `json` module reads text into dictionaries and lists. It can also write those objects back out as text.

### Parse

`loads` reads a string. A JSON key must be wrapped in double quotes.

```python run expect="3" title="Read the number"
import json
print(json.loads('{"n": 3}')["n"])
```

The number stored under `n` is `3`.

### Serialize

`dumps` returns text. By default, Chinese characters become `\u` escapes. Pass `ensure_ascii=False` when those characters should stay as written.

```python run expect="{\"物\": \"茶\"}" title="Write as text"
import json
print(json.dumps({"物": "茶"}, ensure_ascii=False))
```

The text is `{"物": "茶"}`.

### Damaged text

A missing brace makes `loads` raise `JSONDecodeError`.

```python run expect="坏了" title="Parse failure"
import json
try:
    json.loads("{")
    print("过了")
except json.JSONDecodeError:
    print("坏了")
```

The failure prints `坏了`.

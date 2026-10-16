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

`dumps` returns text. `ensure_ascii=False` keeps non-ASCII as written. The key and value below are ASCII, so they appear as themselves.

```python run expect="{\"thing\": \"tea\"}" title="Write as text"
import json
print(json.dumps({"thing": "tea"}, ensure_ascii=False))
```

The text is `{"thing": "tea"}`.

### Damaged text

A missing brace makes `loads` raise `JSONDecodeError`.

```python run expect="broken" title="Parse failure"
import json
try:
    json.loads("{")
    print("passed")
except json.JSONDecodeError:
    print("broken")
```

The failure prints `broken`.

---
language: python
chapter: 0
title: "Python Tutorial"
minutes: 8
goals:
  - "Run the current source with the interpreter"
  - "Write a first print call"
  - "Spot another language nested in the page"
sources:
  - lxiy-python
updated: "2026-10-16"
---

This book splits the language into short chapters. Press Run and the interpreter executes only the Python in front of you. It does not open a project outside the editor.

### The first print

A program has to hand its result back. `print` adds a newline at the end.

```python run expect="你好" title="Say hello"
print("你好")
```

The line you get is `你好`.

### The network library stays unread

This interpreter has no network for you. An import like the one below is for reading only. The button will not contact an outside site.

```python norun title="Do not send a request here"
import urllib.request
urllib.request.urlopen("https://example.com")
```

### Plain text is not a program

A fence with no language tag is there for people to read. The drawer will not treat it as Python.

```text run title="Explanatory text"
这一段只是说明，不是源码。
```

### A Ruby block can sit in the page

A few fences name another language. At run time the page switches to that language instead of forcing Python to read the text.

```ruby run expect="来自 Ruby 的 42" title="One line in another language"
puts "来自 Ruby 的 42"
```

The Ruby line prints `来自 Ruby 的 42`.

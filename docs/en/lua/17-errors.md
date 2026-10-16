---
language: lua
chapter: 17
title: "Lua Error Handling"
level: beginner
minutes: 8
goals:
  - "Catch error with pcall"
  - "Read true as the first result on success"
  - "Leave os.execute uncalled"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

`pcall` turns a failed call into ordinary return values. Runnable examples leave `os.execute` uncalled.

### Catch the failure

The second argument of `error` is 0, so the message has no line number. `pcall` then returns false.

```lua run expect="false" title="Failure first"
local ok, err = pcall(function()
  error("拒绝", 0)
end)
print(ok)
print(err)
```

The output shows `false`, followed by `拒绝`.

### Success

When the function returns normally, the first result is true. The second result is the number it returned.

```lua run expect="true" title="Success first"
local ok, value = pcall(function()
  return 18
end)
print(ok)
print(value)
```

The output shows `true`.

### An external command does not run

`os.execute` would start a program outside this interpreter.

```lua norun title="Do not run an external command"
os.execute("echo 你好")
```

This block is not run.

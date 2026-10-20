---
language: lua
chapter: 29
title: "Lua 状态机"
level: intermediate
minutes: 8
goals:
  - "从 idle 走到 run"
  - "从 run 走到 done"
  - "认不出的事件保持原状态"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

三个状态写成字符串：idle、run、done。step 按照当前状态和事件改写它，认不出的事件不改状态。

### go 把 idle 变成 run

机器从 idle 起步。事件 go 只在 idle 时生效，打印变成 run。

```lua run expect="run" title="进入 run"
local state = "idle"
local function step(ev)
  if state == "idle" and ev == "go" then
    state = "run"
  elseif state == "run" and ev == "finish" then
    state = "done"
  end
  return state
end
print(step("go"))
```

### finish 把 run 变成 done

先走一步 go，再走一步 finish。第二次返回 done，说明 run 上的 finish 被接住了。

```lua run expect="done" title="进入 done"
local state = "idle"
local function step(ev)
  if state == "idle" and ev == "go" then
    state = "run"
  elseif state == "run" and ev == "finish" then
    state = "done"
  end
  return state
end
step("go")
print(step("finish"))
```

### idle 上的 finish 被忽略

还停在 idle 时收到 finish。条件对不上，状态保持 idle。

```lua run expect="idle" title="仍是 idle"
local state = "idle"
local function step(ev)
  if state == "idle" and ev == "go" then
    state = "run"
  elseif state == "run" and ev == "finish" then
    state = "done"
  end
  return state
end
print(step("finish"))
```

### done 上再 go 也不动

走到 done 之后再发送 go。两个分支都不满足，打印仍然是 done。

```lua run expect="done" title="停在 done"
local state = "idle"
local function step(ev)
  if state == "idle" and ev == "go" then
    state = "run"
  elseif state == "run" and ev == "finish" then
    state = "done"
  end
  return state
end
step("go")
step("finish")
print(step("go"))
```

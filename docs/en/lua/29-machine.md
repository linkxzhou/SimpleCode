---
language: lua
chapter: 29
title: "Lua state machine"
level: intermediate
minutes: 8
goals:
  - "Step from idle to run"
  - "Step from run to done"
  - "Keep the state when the event is unknown"
sources:
  - lxiy-lua
updated: "2026-10-20"
---

The three states are the strings idle, run, and done. step rewrites the state from the current name and the event. An unknown event leaves the state alone.

### go turns idle into run

The machine starts at idle. The event go applies only in idle, and the printed state becomes run.

```lua run expect="run" title="Enter run"
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

### finish turns run into done

The first step is go and the second is finish. The second return is done, so finish was accepted while the machine was in run.

```lua run expect="done" title="Enter done"
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

### finish is ignored while idle

finish arrives while the machine is still idle. The condition does not match, so the state stays idle.

```lua run expect="idle" title="Stays idle"
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

### go does nothing once done

After the machine reaches done, another go matches neither branch. The printed state is still done.

```lua run expect="done" title="Stays done"
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

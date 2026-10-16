---
language: lua
chapter: 1
title: "Lua Environment Setup"
level: beginner
minutes: 8
goals:
  - "Start Lua with the run button"
  - "Keep install commands out of the script"
  - "Print one line to confirm the interpreter"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

The run button already includes the interpreter. Put only Lua statements in the script.

### A line that runs

This statement does not depend on an install path. It asks `print` for one line.

```lua run expect="ready" title="Ready"
print("ready")
```

The output shows `ready`.

### Leave the version text alone

The lesson does not compare the wording of `_VERSION`. It checks that ordinary addition works.

```lua run expect="3" title="Addition"
print(1 + 2)
```

The output shows `3`.

### An install command is not a script

The line that names the `lua` program is a terminal command. The interpreter does not treat it as a statement.

```lua norun title="Not a Lua statement"
lua main.lua
```

Keep that line in the shell. This block is not run.

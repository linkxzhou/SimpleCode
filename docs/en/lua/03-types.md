---
language: lua
chapter: 3
title: "Lua Data Types"
level: beginner
minutes: 8
goals:
  - "Inspect a number and a string with type"
  - "Tell nil apart from false"
  - "Recognize a table as its own type"
sources:
  - lxiy-lua
updated: "2026-10-16"
---

Common values are numbers, strings, booleans, nil, and tables. `type` returns the name of a value's kind.

### Numbers and strings

`type` answers `number` for 18. The same call answers `string` for text.

```lua run expect="number" title="The number comes first"
print(type(18))
print(type("茶"))
```

The output shows `number`.

### False and nil

Both `false` and `nil` fail an `if` test. `type` still reports them as different kinds.

```lua run expect="boolean" title="Boolean first"
print(type(false))
print(type(nil))
```

The output shows `boolean`.

### A table

A pair of braces builds a table. `type` reports that value as `table`.

```lua run expect="table" title="One table"
print(type({}))
```

The output shows `table`.

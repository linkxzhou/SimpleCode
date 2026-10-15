---
language: lua
chapter: 17
title: "Lua 错误处理"
level: beginner
minutes: 8
goals:
  - "用 pcall 接住 error"
  - "成功时第一个结果是 true"
  - "不调用 os.execute"
sources:
  - lxiy-lua
updated: "2026-10-15"
---

`pcall` 把失败变成返回值。`os.execute` 不在可运行的例子里。

### 接住

`error` 的第二参数写成 0，消息里就没有行号。

```lua run expect="false" title="先是失败"
local ok, err = pcall(function()
  error("拒绝", 0)
end)
print(ok)
print(err)
```

输出里能看到 `false`。

### 成功

没有 `error` 时，第一个结果是 true，第二个是返回值。

```lua run expect="true" title="先是成功"
local ok, value = pcall(function()
  return 18
end)
print(ok)
print(value)
```

输出里能看到 `true`。

### 外部命令不运行

`os.execute` 会离开这只解释器。

```lua norun title="不执行外部命令"
os.execute("echo 你好")
```

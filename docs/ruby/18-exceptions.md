---
language: ruby
chapter: 18
title: "Ruby 异常"
level: beginner
minutes: 8
goals:
  - "用 begin 和 rescue 接住失败"
  - "按异常类型分支"
  - "用 raise 主动报告"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

失败会跳出当前路径。`rescue` 接住指定类型之后可以改打印一句。

### 接住转换失败

`Integer` 遇到非数字会抛出 `ArgumentError`。

```ruby run expect="failed" title="非法文本"
begin
  Integer("no")
  puts "passed"
rescue ArgumentError
  puts "failed"
end
```

输出里能看到 `failed`。

### 除零

整数除以零抛出 `ZeroDivisionError`。

```ruby run expect="divzero" title="接住"
begin
  1 / 0
rescue ZeroDivisionError
  puts "divzero"
end
```

输出里能看到 `divzero`。

### 主动抛出

`raise` 让调用方处理。

```ruby run expect="not enough" title="自己抛出"
def sell(n)
  raise "not enough" if n < 1
  n
end
begin
  sell(0)
rescue
  puts "not enough"
end
```

输出里能看到 `not enough`。

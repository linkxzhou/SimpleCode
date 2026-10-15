---
language: ruby
chapter: 8
title: "Ruby 循环"
level: beginner
minutes: 8
goals:
  - "用 times 重复固定次数"
  - "用 while 减到零"
  - "用 break 离开循环"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

Ruby 的循环常常写成次数或块。`while` 仍按条件重复。

### times

从 0 开始，重复 3 次，累加得到 3。

```ruby run expect="3" title="三次"
sum = 0
3.times { |i| sum += 1 }
puts sum
```

输出里能看到 `3`。

### while

条件变假就停。

```ruby run expect="0" title="减到零"
left = 2
while left > 0
  left -= 1
end
puts left
```

输出里能看到 `0`。

### break

`break` 离开最近的一层循环。

```ruby run expect="3" title="停在 3"
n = 0
loop do
  n += 1
  break if n == 3
end
puts n
```

输出里能看到 `3`。

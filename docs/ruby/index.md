---
language: ruby
chapter: 0
title: "Ruby 教程"
minutes: 8
goals:
  - "用 puts 输出一行"
  - "知道这里不能 gem install"
  - "写出带注释的最小程序"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

这一本用 Ruby 3.2 解释当前文件。没有网页，也没有额外的 gem。

### 第一行

`puts` 在末尾补换行。

```ruby run expect="你好" title="打招呼"
puts "你好"
```

输出里能看到 `你好`。

### 不能安装 gem

`gem install` 需要网络和本机目录。按钮不会执行它。

```ruby norun title="不是源码"
gem install rails
```

### 井号是注释

注释不会出现在输出里。

```ruby run expect="留下" title="跳过注释"
puts "留下" # 隐藏
```

输出里能看到 `留下`。

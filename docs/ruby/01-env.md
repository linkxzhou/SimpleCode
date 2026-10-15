---
language: ruby
chapter: 1
title: "Ruby 环境"
level: beginner
minutes: 8
goals:
  - "分清本页运行和本机安装"
  - "知道解释器已经准备好"
  - "只用随语言提供的库"
sources:
  - lxiy-ruby
updated: "2026-10-15"
---

本机安装要区分 Linux 和 Windows。这个抽屉里解释器已经在，不必再选安装包。

### 直接运行

点 Run 就执行当前文本。

```ruby run expect="已就绪" title="无需安装"
puts "已就绪"
```

输出里能看到 `已就绪`。

### 命令行选项不在源码里

`ruby -v` 是启动解释器的参数，写进文件不会变成版本查询。

```ruby norun title="不是语句"
ruby -v
```

### 标准库可以 require

`stringio` 随 Ruby 提供，不用再下载。

```ruby run expect="茶" title="内存缓冲"
require "stringio"
b = StringIO.new
b.write("茶")
puts b.string
```

输出里能看到 `茶`。

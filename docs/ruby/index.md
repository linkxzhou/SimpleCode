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

```ruby run expect="Hi" title="打招呼"
puts "Hi"
```

输出里能看到 `Hi`。

### 不能安装 gem

`gem install` 需要网络和本机目录。按钮不会执行它。

```ruby norun title="不是源码"
gem install rails
```

### 井号是注释

注释不会出现在输出里。

```ruby run expect="kept" title="跳过注释"
puts "kept" # 隐藏
```

输出里能看到 `kept`。

### 第 23 章以后

Proc 把 2 和 5 加成 7，lambda 少参数时打印 arity，Enumerable 的 select 与 tally 处理短表，Struct 保存 sku 和 qty，Comparable 按毫升排序，method_missing 返回方法名，define_method 装上 sku，freeze 之后再改会得到 locked，instance_eval 写下菜单名。

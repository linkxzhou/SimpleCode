---
language: rust
chapter: 22
title: "Rust 集合与字符串"
level: intermediate
minutes: 8
goals:
  - "用 Vec 追加元素"
  - "用 HashMap 按名字查"
  - "用 String 拼接"
sources:
  - runoob-rust
updated: "2026-10-16"
---
`Vec` 和 `HashMap` 都在堆上增长。`String` 是可修改的文本，和 `&str` 不是同一个类型。

### 追加后再求和

`push` 把新元素放到末尾。

```rust run expect="42" title="追加二十三"
fn main() {
    let mut fares = vec![4, 15];
    fares.push(23);
    let total: i32 = fares.iter().sum();
    println!("{total}");
}
```
三项加在一起是 42。

### 按名字查票价

键不存在时用索引会中止。这里两个键都先放进去了。

```rust run expect="42" title="茶加笔"
use std::collections::HashMap;

fn main() {
    let mut bag = HashMap::new();
    bag.insert("tea", 18);
    bag.insert("pen", 24);
    println!("{}", bag["tea"] + bag["pen"]);
}
```
18 与 24 相加。

### 拼接字符串

`push_str` 把切片接到 `String` 尾部。

```rust run expect="night" title="接上一个字"
fn main() {
    let mut line = String::from("nite");
    line.push_str("shift");
    println!("{line}");
}
```
两个字合成夜班。

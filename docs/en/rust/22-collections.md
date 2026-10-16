---
language: rust
chapter: 22
title: "Rust Collections and Strings"
level: intermediate
minutes: 8
goals:
  - "Append an element with Vec"
  - "Look up a name with HashMap"
  - "Concatenate with String"
sources:
  - runoob-rust
updated: "2026-10-16"
---

`Vec` and `HashMap` both grow on the heap. `String` is owned, mutable text. It is a different type from `&str`.

### Push, then sum

`push` places the new element at the end.

```rust run expect="42" title="Push twenty-three"
fn main() {
    let mut fares = vec![4, 15];
    fares.push(23);
    let total: i32 = fares.iter().sum();
    println!("{total}");
}
```

The three items add to 42.

### Look up fares by name

Indexing a missing key aborts. Both keys are inserted before the lookup.

```rust run expect="42" title="Tea plus pen"
use std::collections::HashMap;

fn main() {
    let mut bag = HashMap::new();
    bag.insert("茶", 18);
    bag.insert("笔", 24);
    println!("{}", bag["茶"] + bag["笔"]);
}
```

18 and 24 add to 42.

### Append onto a String

`push_str` attaches a slice to the end of a `String`.

```rust run expect="夜班" title="Append one character"
fn main() {
    let mut line = String::from("夜");
    line.push_str("班");
    println!("{line}");
}
```

The two characters form `夜班`.

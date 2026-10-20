---
language: rust
chapter: 29
title: "Rust trait 对象"
level: intermediate
minutes: 9
goals:
  - "用 dyn 调用一个方法"
  - "把两种类型放进同一个向量"
  - "按标志选择具体类型"
sources:
  - rust-book
updated: "2026-10-20"
---

dyn Score 是一种固定大小的胖指针，指向具体值和一张方法表。不同类型因此能放进同一个 Vec。对象安全的方法不能返回 Self，也不能带泛型参数。

### 透过 dyn 取 4

show 的参数类型是 &dyn Score，函数体内看不到 A 这个具体名字。A 的 get 返回 4。

```rust run expect="4" title="动态分发"
trait Score {
    fn get(&self) -> i32;
}
struct A;
impl Score for A {
    fn get(&self) -> i32 {
        4
    }
}
fn show(s: &dyn Score) -> i32 {
    s.get()
}
fn main() {
    println!("{}", show(&A));
}
```

### 向量里两种分数

Box<dyn Score> 让 A 和 B 的尺寸不再影响向量格子。4 加 5 得到 9。

```rust run expect="9" title="4 加 5"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        4
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        5
    }
}
fn main() {
    let items: Vec<Box<dyn Score>> = vec![Box::new(A), Box::new(B)];
    let mut sum = 0;
    for item in items.iter() {
        sum += item.get();
    }
    println!("{sum}");
}
```

### 标志为假时取 B

pick 的返回类型是 Box<dyn Score>。flag 为 false 时放进 B，get 是 1。调用者只按 trait 来用返回值。

```rust run expect="1" title="选中 B"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        8
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        1
    }
}
fn pick(flag: bool) -> Box<dyn Score> {
    if flag { Box::new(A) } else { Box::new(B) }
}
fn main() {
    println!("{}", pick(false).get());
}
```

### 两个对象相加

both 接受两个 &dyn Score。3 和 6 相加打印 9。这一题和上面的向量无关，参数直接是引用。

```rust run expect="9" title="3 加 6"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        3
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        6
    }
}
fn both(x: &dyn Score, y: &dyn Score) -> i32 {
    x.get() + y.get()
}
fn main() {
    println!("{}", both(&A, &B));
}
```

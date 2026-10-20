---
language: rust
chapter: 28
title: "Rust trait 进阶"
level: intermediate
minutes: 9
goals:
  - "调用带默认实现的方法"
  - "用关联类型规定打包结果"
  - "在具体类型上改掉默认值"
sources:
  - rust-book
  - rust-by-example
updated: "2026-10-20"
---

trait 可以带默认方法，也可以用关联类型说明这个实现处理哪一种值。这里没有 Cargo，实现都写在同一个文件里。过程宏仍然加载不了。

### 默认方法返回 0

Price 的 cents 默认是 0，Tea 只实现 label。4 加 0 得到 4。没写的方法不必在每个类型上再抄一遍。

```rust run expect="4" title="默认加标签"
trait Price {
    fn cents(&self) -> i32 {
        0
    }
    fn label(&self) -> i32;
}
struct Tea;
impl Price for Tea {
    fn label(&self) -> i32 {
        4
    }
}
fn main() {
    let tea = Tea;
    println!("{}", tea.cents() + tea.label());
}
```

### 关联类型加一

Pack 的 Item 在 Id 上定为 i32。pack 收到 6，返回 7。换一个实现可以把 Item 定成别的具体类型，调用处仍然写 pack。

```rust run expect="7" title="打包 6"
trait Pack {
    type Item;
    fn pack(&self, v: Self::Item) -> Self::Item;
}
struct Id;
impl Pack for Id {
    type Item = i32;
    fn pack(&self, v: i32) -> i32 {
        v + 1
    }
}
fn main() {
    println!("{}", Id.pack(6));
}
```

### 盖住默认的 0

Cup 把 cents 改成 3，label 是 6。相加打印 9。默认实现只在没有自己的方法时才用。

```rust run expect="9" title="杯子是 9"
trait Price {
    fn cents(&self) -> i32 {
        0
    }
    fn label(&self) -> i32;
}
struct Cup;
impl Price for Cup {
    fn cents(&self) -> i32 {
        3
    }
    fn label(&self) -> i32 {
        6
    }
}
fn main() {
    let cup = Cup;
    println!("{}", cup.cents() + cup.label());
}
```

### 两个实现相加

A 给出 2，B 给出 5。total 用 impl Trait 接收任意实现了 Score 的引用，结果是 7。

```rust run expect="7" title="2 加 5"
trait Score {
    fn get(&self) -> i32;
}
struct A;
struct B;
impl Score for A {
    fn get(&self) -> i32 {
        2
    }
}
impl Score for B {
    fn get(&self) -> i32 {
        5
    }
}
fn total(a: &impl Score, b: &impl Score) -> i32 {
    a.get() + b.get()
}
fn main() {
    println!("{}", total(&A, &B));
}
```

《Rust程序设计》只作延伸阅读：https://book.douban.com/subject/36547630 。正文和示例没有从书里搬。

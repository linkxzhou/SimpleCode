---
language: rust
chapter: 31
title: "Rust Box、Rc 与 RefCell"
level: advanced
minutes: 10
goals:
  - "用 Box 把一个整数放到堆上"
  - "看克隆之后的强引用计数"
  - "用 RefCell 在不可变绑定上改值"
sources:
  - rust-book
updated: "2026-10-20"
---

Box 独占堆上的值。Rc 让一份数据有多个所有者，但只能共享读。RefCell 把借用检查挪到运行时，所以不可变绑定也能 borrow_mut。同时存在可变借用和别的借用会恐慌，那种写法标成只读。

### 堆上的 4

Box::new(4) 把整数放到堆上，星号解引用后打印 4。离开作用域时 Box 会释放这块内存。

```rust run expect="4" title="解引用"
fn main() {
    let boxed = Box::new(4);
    println!("{}", *boxed);
}
```

### 强引用变成 2

Rc::new 开始时计数是 1。clone 增加一个所有者，strong_count 变成 2。这不是深拷贝里面的 7。

```rust run expect="2" title="两个所有者"
use std::rc::Rc;
fn main() {
    let value = Rc::new(7);
    let _copy = Rc::clone(&value);
    println!("{}", Rc::strong_count(&value));
}
```

### 运行时借用

cell 绑定本身不可变。borrow_mut 借出里面的 1，加上 3 后变 4。同一时刻只有这一次可变借用。

```rust run expect="4" title="改成 4"
use std::cell::RefCell;
fn main() {
    let cell = RefCell::new(1);
    *cell.borrow_mut() += 3;
    println!("{}", *cell.borrow());
}
```

### 盒子里的长度

Box 也可以装字符串 tea。len 按字节数，三个字母是 3。

```rust run expect="3" title="三个字节"
fn main() {
    let word = Box::new(String::from("tea"));
    println!("{}", word.len());
}
```

### 重叠借用会恐慌

先 borrow 再 borrow_mut 会在运行时恐慌。不要把这种顺序放进可运行块。需要共享修改时，先结束前一次借用。

```rust norun title="不要运行"
let cell = RefCell::new(1);
let _keep = cell.borrow();
let _edit = cell.borrow_mut();
```

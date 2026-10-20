---
language: rust
chapter: 36
title: "Rust unsafe 入门"
level: advanced
minutes: 9
goals:
  - "用裸指针读一个局部整数"
  - "通过可变裸指针把 1 改成 6"
  - "知道空指针解引用不能运行"
sources:
  - rust-book
updated: "2026-10-20"
---

unsafe 块允许解引用裸指针，并不关闭借用检查的其余规则。指针必须指向仍然活着的值。空指针和悬垂指针是未定义行为，只放在阅读块里。

### 读出局部的 4

n 活在 main 里。把引用转成 *const i32 后，unsafe 块里解引用，打印 4。

```rust run expect="4" title="裸指针读取"
fn main() {
    let n = 4;
    let p = &n as *const i32;
    unsafe {
        println!("{}", *p);
    }
}
```

### 写成 6

可变裸指针来自 &mut slot。unsafe 里把 1 改成 6，再从安全的绑定上打印。写的时候没有别的引用存在。

```rust run expect="6" title="裸指针写入"
fn main() {
    let mut slot = 1;
    let p = &mut slot as *mut i32;
    unsafe {
        *p = 6;
    }
    println!("{slot}");
}
```

### 两个格子的和

练习从数组取出两个裸指针，分别读 2 和 5，相加打印 7。数组本身活到打印结束。

```rust run expect="7" title="指针相加"
fn main() {
    let xs = [2, 5];
    let p = xs.as_ptr();
    unsafe {
        println!("{}", *p + *p.add(1));
    }
}
```

### 空指针不能解引用

null 不指向任何活着的整数。解引用是未定义行为，可能在 wasm 里直接陷阱。这段只说明危险，不执行。

```rust norun title="不要运行"
let p: *const i32 = std::ptr::null();
unsafe {
    println!("{}", *p);
}
```

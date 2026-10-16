---
language: rust
chapter: 27
title: "Rust 异步"
level: advanced
minutes: 8
goals:
  - "用普通函数代替异步加载"
  - "用枚举表示尚未完成"
  - "知道没有异步运行时"
sources:
  - runoob-rust
updated: "2026-10-16"
---
`async fn` 返回的是一个未来值，需要执行器去 poll。这里没有 tokio，也没有多线程运行时。

### 同步拿到票价

调用立刻返回，不挂起。

```rust run expect="42" title="同步加载"
fn load_fare() -> i32 {
    42
}

fn main() {
    println!("{}", load_fare());
}
```
这就是异步例子在本环境里能跑的对应写法。

### 自己 poll 一次

枚举把“还在等”和“已经有数”分成两个变体。

```rust run expect="42" title="轮询一次"
enum Step {
    Wait,
    Done(i32),
}

fn poll(step: Step) -> Step {
    match step {
        Step::Wait => Step::Done(42),
        done => done,
    }
}

fn main() {
    let step = poll(Step::Wait);
    if let Step::Done(n) = step {
        println!("{n}");
    }
}
```
从 Wait 走进 Done，数是 42。

### async 块不运行

没有执行器时，`async` 块产生的未来值不会自己往下走。

```rust norun title="不写 async"
fn main() {
    println!("no executor");
}
```

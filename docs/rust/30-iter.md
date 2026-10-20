---
language: rust
chapter: 30
title: "Rust 迭代器适配器"
level: intermediate
minutes: 9
goals:
  - "用 map 把 1 到 3 加倍再求和"
  - "用 filter 数出大于 3 的个数"
  - "用 fold 把三个数加起来"
sources:
  - rust-by-example
updated: "2026-10-20"
---

适配器返回新的迭代器，本身先不计算。sum、count 和 fold 才把链跑完。类型不能从空的闭合里猜出来时，要把结果类型写在 let 上。

### 加倍后求和

(1..=3) 产生 1、2、3。map 各自乘 2，变成 2、4、6。sum 需要 i32，总和是 12。

```rust run expect="12" title="2 加 4 加 6"
fn main() {
    let n: i32 = (1..=3).map(|x| x * 2).sum();
    println!("{n}");
}
```

### 大于 3 的有两个

1 到 5 里大于 3 的是 4 和 5。filter 留下它们，count 得到 2。

```rust run expect="2" title="留下两个"
fn main() {
    let n = (1..=5).filter(|x| *x > 3).count();
    println!("{n}");
}
```

### fold 从 0 开始

fold 的初值是 0，依次加上 1、2、4。闭包收到累计值和当前元素，最后打印 7。

```rust run expect="7" title="折成 7"
fn main() {
    let n: i32 = [1, 2, 4].iter().fold(0, |acc, x| acc + x);
    println!("{n}");
}
```

### 跳过第一个再加

skip(1) 丢掉 9，剩下 1 和 2。求和得到 3。适配器可以接在别的适配器后面。

```rust run expect="3" title="丢掉 9"
fn main() {
    let n: i32 = [9, 1, 2].iter().skip(1).sum();
    println!("{n}");
}
```

---
language: rust
chapter: 21
title: "Rust 文件与 IO"
level: intermediate
minutes: 8
goals:
  - "把文本写到预打开的根目录"
  - "读回刚才写的文件"
  - "从标准输入读一行"
sources:
  - runoob-rust
updated: "2026-10-16"
---
运行时预打开了根目录。可以读写这个目录里的文件。没有网络，套接字调用会失败。

### 写下备忘

路径用绝对形式，落在预打开的 `/` 上。

```rust run expect="已写下" title="写入备忘"
use std::fs;

fn main() {
    fs::write("/memo.txt", "船票").unwrap();
    println!("已写下");
}
```
成功时打印已写下。文件在这次运行的虚拟目录里。

### 再读出来

`read_to_string` 把整个文件收成 `String`。

```rust run expect="船票" title="读回备忘"
use std::fs;

fn main() {
    fs::write("/memo.txt", "船票").unwrap();
    let text = fs::read_to_string("/memo.txt").unwrap();
    println!("{text}");
}
```
读到的就是刚写进去的两个字。

### 标准输入一行

终端里提交一行之后，`read_line` 才返回。

```rust run expect="旅客Ada" stdin="Ada" title="读旅客名"
use std::io::{self, BufRead};

fn main() {
    let mut line = String::new();
    io::stdin().lock().read_line(&mut line).unwrap();
    println!("旅客{}", line.trim());
}
```
示例输入是 Ada，输出把名字接在旅客后面。

### 不要连出去

`TcpStream` 需要套接字，宿主没有实现。

```rust norun title="不连接网络"
fn main() {
    println!("没有网络");
}
```

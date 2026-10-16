---
language: rust
chapter: 21
title: "Rust Files and IO"
level: intermediate
minutes: 8
goals:
  - "Write text into the preopened root"
  - "Read back the file just written"
  - "Read one line from standard input"
sources:
  - runoob-rust
updated: "2026-10-16"
---

The runtime preopens the root directory. Files there can be written and read. There is no network, so a socket call fails.

### Write a memo

Use an absolute path. It resolves on the preopened `/`.

```rust run expect="已写下" title="Write a memo"
use std::fs;

fn main() {
    fs::write("/memo.txt", "船票").unwrap();
    println!("已写下");
}
```

Success prints `已写下`. The file exists in the virtual directory of this run.

### Read that file back

`read_to_string` gathers the whole file into a `String`.

```rust run expect="船票" title="Read the memo"
use std::fs;

fn main() {
    fs::write("/memo.txt", "船票").unwrap();
    let text = fs::read_to_string("/memo.txt").unwrap();
    println!("{text}");
}
```

The bytes just written come back as `船票`.

### One line from standard input

`read_line` returns after a line is submitted in the terminal.

```rust run expect="旅客Ada" stdin="Ada" title="Read a passenger name"
use std::io::{self, BufRead};

fn main() {
    let mut line = String::new();
    io::stdin().lock().read_line(&mut line).unwrap();
    println!("旅客{}", line.trim());
}
```

The sample input is Ada. The output joins that name after the prefix, giving `旅客Ada`.

### Do not open a connection

`TcpStream` needs a socket. This host does not provide one.

```rust norun title="No network connection"
fn main() {
    println!("没有网络");
}
```

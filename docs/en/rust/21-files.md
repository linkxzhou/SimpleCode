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

```rust run expect="wrote" title="Write a memo"
use std::fs;

fn main() {
    fs::write("/memo.txt", "pass").unwrap();
    println!("wrote");
}
```

Success prints `wrote`. The file exists in the virtual directory of this run.

### Read that file back

`read_to_string` gathers the whole file into a `String`.

```rust run expect="pass" title="Read the memo"
use std::fs;

fn main() {
    fs::write("/memo.txt", "pass").unwrap();
    let text = fs::read_to_string("/memo.txt").unwrap();
    println!("{text}");
}
```

The bytes just written come back as `pass`.

### One line from standard input

`read_line` returns after a line is submitted in the terminal.

```rust run expect="riderAda" stdin="Ada" title="Read a passenger name"
use std::io::{self, BufRead};

fn main() {
    let mut line = String::new();
    io::stdin().lock().read_line(&mut line).unwrap();
    println!("rider{}", line.trim());
}
```

The sample input is Ada. The output joins that name after the prefix, giving `riderAda`.

### Do not open a connection

`TcpStream` needs a socket. This host does not provide one.

```rust norun title="No network connection"
fn main() {
    println!("no network");
}
```

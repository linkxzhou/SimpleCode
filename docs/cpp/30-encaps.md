---
language: cpp
chapter: 30
title: "C++ 数据封装"
level: beginner
minutes: 8
goals:
  - "把余额放在 private 里"
  - "拒绝非正数的存入"
  - "只通过方法修改"
sources:
  - learncpp
updated: "2026-10-15"
---

外面不能直接改余额。方法先检查，再决定是否写入。

### 存入成功

存入 18 之后，余额就是 18。

```cpp run expect="18" title="存入"
#include <iostream>
class Wallet {
 public:
  Wallet() : cents_(0) {}
  bool deposit(int n) {
    if (n <= 0) return false;
    cents_ += n;
    return true;
  }
  int cents() const { return cents_; }
 private:
  int cents_;
};
int main() {
  Wallet wallet;
  wallet.deposit(18);
  std::cout << wallet.cents() << "\n";
  return 0;
}
```

输出里能看到 `18`。

### 拒绝

0 不是有效存入。余额保持 0，返回值打印 0。

```cpp run expect="0 0" title="没有写入"
#include <iostream>
class Wallet {
 public:
  Wallet() : cents_(0) {}
  bool deposit(int n) {
    if (n <= 0) return false;
    cents_ += n;
    return true;
  }
  int cents() const { return cents_; }
 private:
  int cents_;
};
int main() {
  Wallet wallet;
  bool ok = wallet.deposit(0);
  std::cout << ok << " " << wallet.cents() << "\n";
  return 0;
}
```

输出里能看到 `0 0`。

### 两次存入

两次正数会累加。

```cpp run expect="18" title="累加"
#include <iostream>
class Wallet {
 public:
  Wallet() : cents_(0) {}
  bool deposit(int n) {
    if (n <= 0) return false;
    cents_ += n;
    return true;
  }
  int cents() const { return cents_; }
 private:
  int cents_;
};
int main() {
  Wallet wallet;
  wallet.deposit(10);
  wallet.deposit(8);
  std::cout << wallet.cents() << "\n";
  return 0;
}
```

输出里能看到 `18`。

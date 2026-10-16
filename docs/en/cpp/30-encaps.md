---
language: cpp
chapter: 30
title: "C++ Data Encapsulation"
level: beginner
minutes: 8
goals:
  - "Keep the balance in a private field"
  - "Reject a deposit that is not positive"
  - "Change the balance only through a method"
sources:
  - learncpp
updated: "2026-10-16"
---

Outside code cannot assign to the balance directly. `deposit` checks the amount first, then decides whether to write it.

### A deposit that succeeds

Depositing 18 passes the check. After that call, `cents` returns 18.

```cpp run expect="18" title="Deposit"
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

The balance line is `18`.

### A deposit that is refused

0 is not a valid deposit. The balance stays 0, and the returned flag prints as 0.

```cpp run expect="0 0" title="Nothing written"
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

The balance line is `0 0`.

### Two deposits

Two positive amounts add together. 10 followed by 8 leaves a balance of 18.

```cpp run expect="18" title="Running total"
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

The balance line is `18`.

---
language: java
chapter: 34
title: "Java record 与 sealed"
level: advanced
minutes: 11
goals:
  - "用 record 记下名字和分数"
  - "用访问器而不是字段"
  - "用 sealed 限定实现类"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

record 会生成构造器、访问器和 equals。sealed 限制谁可以去实现这个接口。TeaVM 的 javac 能编下面这几种短例子。辅助类仍然不能是 public。

### 访问器叫做 name

Score 的两个成分是 name 和 points。访问器是 name()，不是 getName。Ada 和 91 拼在一行。

```java run expect="Ada91" title="一条分数"
record Score(String name, int points) {}

public class Main {
    public static void main(String[] args) {
        Score row = new Score("Ada", 91);
        System.out.println(row.name() + row.points());
    }
}
```

拼出来是 Ada91。

### 成分相同就相等

record 生成的 equals 比较每个成分。两个 tea/4 应打印 yes。

```java run expect="yes" title="两条相同"
record Item(String name, int price) {}

public class Main {
    public static void main(String[] args) {
        Item left = new Item("tea", 4);
        Item right = new Item("tea", 4);
        System.out.println(left.equals(right) ? "yes" : "no");
    }
}
```

相等时是 yes。

### 只允许 Ok

Result 用 sealed 和 permits 点名 Ok。Ok 必须是 final，否则编译器还要它再说明子类。字段 n 取出来是 7。

```java run expect="7" title="唯一实现"
sealed interface Result permits Ok {}
final class Ok implements Result {
    int n;
    Ok(int n) { this.n = n; }
}

public class Main {
    public static void main(String[] args) {
        Ok row = new Ok(7);
        System.out.println(row.n);
    }
}
```

数字是 7。

### 练习：再记一个座位号

record 三个成分：name、row、seat。Ada 在第 2 行第 8 座，打印 2-8。

```java run expect="2-8" title="座位"
record Seat(String name, int row, int seat) {}

public class Main {
    public static void main(String[] args) {
        Seat spot = new Seat("Ada", 2, 8);
        System.out.println(spot.row() + "-" + spot.seat());
    }
}
```

位置是 2-8。

### 两本版权书的目录

record 和 sealed 在《Java核心技术》和《Effective Java》里的位置只作对照：<https://book.douban.com/subject/35920145> 。

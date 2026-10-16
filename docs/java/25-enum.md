---
language: java
chapter: 25
title: "Java 枚举"
level: beginner
minutes: 8
goals:
  - "打印枚举名和序数"
  - "用 values 数常量个数"
  - "读第一个常量的序数"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

枚举把有限的几种硬币列在一起。每个常量有名字和从 0 开始的序数，values 返回全部常量。

### 名字接上序数

SILVER 是第二个常量，序数是 1。name() 得到 SILVER，和序数接成 SILVER1。

```java run expect="SILVER1" title="名字与序数"
enum Coin {
    COPPER,
    SILVER
}

public class Main {
    public static void main(String[] args) {
        // 银币的名字和序数
        Coin c = Coin.SILVER;
        System.out.println(c.name() + c.ordinal());
    }
}
```

中间没有空格。

### values 的长度

Coin 里只有 COPPER 和 SILVER。values() 得到的数组长度是 2。

```java run expect="2" title="常量个数"
enum Coin {
    COPPER,
    SILVER
}

public class Main {
    public static void main(String[] args) {
        // 两种硬币
        System.out.println(Coin.values().length);
    }
}
```

个数打成一行。

### 第一个序数是 0

COPPER 写在枚举最前面，ordinal() 是 0。后面的常量不会把这个起点改掉。

```java run expect="0" title="起点序数"
enum Coin {
    COPPER,
    SILVER
}

public class Main {
    public static void main(String[] args) {
        // 铜币排在第一
        System.out.println(Coin.COPPER.ordinal());
    }
}
```

打印 0。

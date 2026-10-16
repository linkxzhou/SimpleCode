---
language: java
chapter: 1
title: "Java 简介"
level: beginner
minutes: 8
goals:
  - "认出 main 的参数"
  - "区分字符串和整数"
  - "看清加法何时变成拼接"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

程序从 main 进去。这一章只看参数数组、字面量，以及加号在整数和字符串上的不同结果。

### 参数数组是空的

main 的参数是字符串数组。练习场不会塞进命令行参数，所以长度是 0。

```java run expect="0" title="空参数"
public class Main {
    public static void main(String[] args) {
        // 参数个数
        System.out.println(args.length);
    }
}
```

把长度打出来即可。

### 字面量两种写法

双引号包住的是字符串。不带引号的整数按数值打印。两句 println 各占一行。

```java run expect="token" title="两种字面量"
public class Main {
    public static void main(String[] args) {
        // 字符串和整数各一行
        System.out.println("token");
        System.out.println(7);
    }
}
```

先看字符串，再看数字。

### 加号看左右类型

两个整数相加仍是算术。整数一旦碰到字符串，后面的加号就改成拼接。

```java run expect="42" title="相加与拼接"
public class Main {
    public static void main(String[] args) {
        // 先算再拼
        System.out.println(20 + 22);
        System.out.println("n" + 20 + 22);
    }
}
```

第一行是和，第二行是接起来的文本。

---
language: java
chapter: 13
title: "Java 方法"
level: beginner
minutes: 8
goals:
  - "用 return 带回一个整数"
  - "把两个参数加起来"
  - "用同名方法区分参数个数"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

方法把票价计算收进一个名字。调用时传入参数，return 把整数交回给 main。

### 无参数也要返回

fare 不接收参数，方法体里直接 return 7。main 打印的是这次调用的返回值，不是方法的名字。

```java run expect="7" title="返回底价"
public class Main {
    static int fare() {
        return 7;
    }
    public static void main(String[] args) {
        // 调用无参方法
        System.out.println(fare());
    }
}
```

终端上这一行是 7。

### 两个参数相加

add 收下 a 和 b，return 它们的和。调用处写 add(4, 5)，实参按顺序对上形参。

```java run expect="9" title="参数相加"
public class Main {
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        // 两个实参
        System.out.println(add(4, 5));
    }
}
```

4 加 5 的结果单独占一行。

### 同名方法看参数个数

两个 add 可以同名。只传一个 int 时走单参数版本，传两个 int 时走另一个。这就是按个数重载。

```java run expect="3 6" title="重载"
public class Main {
    static int add(int a) {
        return a;
    }

    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        // 按参数个数挑选
        System.out.println(add(3) + " " + add(1, 5));
    }
}
```

输出把两次调用的结果隔开。

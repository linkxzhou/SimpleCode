---
language: java
chapter: 16
title: "Java 接口"
level: beginner
minutes: 8
goals:
  - "用 implements 兑现 total"
  - "实现一个返回字符串的方法"
  - "实现带两个参数的方法"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

接口只列出方法，不写方法体。类用 implements 接上接口，并且把每个方法补成 public。

### 按件数算总价

Sale 要求 total(int)。Window 用 8 乘以件数。new Window().total(3) 就是 8 乘 3。

```java run expect="24" title="接口总价"
interface Sale {
    public int total(int n);
}

class Window implements Sale {
    public int total(int n) {
        return 8 * n;
    }
}

public class Main {
    public static void main(String[] args) {
        // 窗口按件数计价
        System.out.println(new Window().total(3));
    }
}
```

三件的总价是 24。

### 实现返回字符串

Tag 只有 name()。Copper 把返回值写成 cop。接口自己不保存这个单词。

```java run expect="cop" title="名字方法"
interface Tag {
    public String name();
}

class Copper implements Tag {
    public String name() {
        return "cop";
    }
}

public class Main {
    public static void main(String[] args) {
        // 铜牌的名字
        System.out.println(new Copper().name());
    }
}
```

打印的是实现类给出的单词。

### 两个参数一起读

Meter.read 接收两个 int。Desk 把它们相加后返回。调用时 4 和 5 按顺序传进去。

```java run expect="9" title="双参数"
interface Meter {
    public int read(int a, int b);
}

class Desk implements Meter {
    public int read(int a, int b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        // 柜台把两个数相加
        System.out.println(new Desk().read(4, 5));
    }
}
```

和是 9。

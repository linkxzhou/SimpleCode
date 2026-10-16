---
language: java
chapter: 26
title: "Java 静态"
level: beginner
minutes: 8
goals:
  - "用静态方法累加计数"
  - "用静态方法返回底价"
  - "改写静态字段"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

static 成员属于类，不属于某一张票。还没 new，就可以用类名点出方法和字段。

### 静态计数加两次

Counter.n 一开始是 0。bump 每次把 n 加 1。调用两次之后，n 是 2。

```java run expect="2" title="静态计数"
class Counter {
    static int n;

    static void bump() {
        n = n + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        // 类上的计数
        Counter.bump();
        Counter.bump();
        System.out.println(Counter.n);
    }
}
```

不需要先 new Counter。

### 静态方法直接返回

Fare.base 不依赖对象，return 6。用类名调用即可。

```java run expect="6" title="静态返回"
class Fare {
    static int base() {
        return 6;
    }
}

public class Main {
    public static void main(String[] args) {
        // 类方法给出底价
        System.out.println(Fare.base());
    }
}
```

打印 6。

### 静态字段可以改写

Desk.fare 初值是 3。加上 4 之后再读，得到 7。所有地方看到的是同一份字段。

```java run expect="7" title="改静态字段"
class Desk {
    static int fare = 3;
}

public class Main {
    public static void main(String[] args) {
        // 改类上的票价
        Desk.fare = Desk.fare + 4;
        System.out.println(Desk.fare);
    }
}
```

结果是改过之后的数。

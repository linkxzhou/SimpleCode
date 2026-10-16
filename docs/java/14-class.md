---
language: java
chapter: 14
title: "Java 对象和类"
level: beginner
minutes: 8
goals:
  - "给对象一个字段"
  - "在构造器里写 this"
  - "准备两个构造器"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

类是票的模板，new 才得到一张具体的票。字段记在对象上，构造器在 new 的时候填值。

### 字段记在对象上

Ticket 里的 seats 初值是 4。new Ticket() 造出对象之后，用点号读这个字段。

```java run expect="4" title="对象字段"
class Ticket {
    int seats = 4;
}

public class Main {
    public static void main(String[] args) {
        // 读出座位数
        System.out.println(new Ticket().seats);
    }
}
```

打印出来的是初值。

### this 指向正在构造的票

构造器参数也叫 n。this.fare 明确写到对象自己的字段上，避免和参数搅在一起。

```java run expect="6" title="this 赋值"
class Ticket {
    int fare;

    Ticket(int n) {
        this.fare = n;
    }
}

public class Main {
    public static void main(String[] args) {
        // 构造时写入票价
        System.out.println(new Ticket(6).fare);
    }
}
```

传入 6，字段就是 6。

### 两个构造器分工

无参构造器把票价定成 1。带 int 的构造器采用传入的数。new 时写不写括号里的数，决定走哪一个。

```java run expect="1 5" title="两个构造器"
class Ticket {
    int fare;

    Ticket() {
        this.fare = 1;
    }

    Ticket(int n) {
        this.fare = n;
    }
}

public class Main {
    public static void main(String[] args) {
        // 一张默认，一张指定
        Ticket a = new Ticket();
        Ticket b = new Ticket(5);
        System.out.println(a.fare + " " + b.fare);
    }
}
```

两张票的票价打在同一行。

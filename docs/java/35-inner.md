---
language: java
chapter: 35
title: "Java 内部类与匿名类"
level: advanced
minutes: 10
goals:
  - "让内部类读到外层的字段"
  - "用匿名类实现接口"
  - "在方法里写一个局部类"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

内部类挂在外层实例上，所以能读外层的字段。匿名类没有自己的名字，适合只用一次的接口实现。局部类写在方法里面。

### 内部类读到毫升

Cup 是 Main 的内部类，read 直接用外层的 ml。先 new Main，再用 host.new Cup() 造内部对象。8 毫升读出来是 8。

```java run expect="8" title="内部杯子"
public class Main {
    int ml = 8;
    class Cup {
        int read() { return ml; }
    }
    public static void main(String[] args) {
        Main host = new Main();
        System.out.println(host.new Cup().read());
    }
}
```

读到的是 8。

### 匿名类算总价

new Sale() { ... } 当场把 total 补上。3 乘 8 是 24。这个对象没有单独的类名。

```java run expect="24" title="匿名计价"
interface Sale {
    int total(int n);
}

public class Main {
    public static void main(String[] args) {
        Sale sale = new Sale() {
            public int total(int n) { return n * 8; }
        };
        System.out.println(sale.total(3));
    }
}
```

总价是 24。

### 方法里的局部类

Tag 写在 main 里面，只在这个方法里看得见。它记下 bun，label 交回这个词。

```java run expect="bun" title="局部标签"
public class Main {
    public static void main(String[] args) {
        class Tag {
            String name;
            Tag(String name) { this.name = name; }
            String label() { return name; }
        }
        System.out.println(new Tag("bun").label());
    }
}
```

标签是 bun。

### 练习：匿名类加一

Step 只有 one。匿名类把参数加 1。传入 6 应打印 7。

```java run expect="7" title="加一"
interface Step {
    int one(int n);
}

public class Main {
    public static void main(String[] args) {
        Step step = new Step() {
            public int one(int n) { return n + 1; }
        };
        System.out.println(step.one(6));
    }
}
```

加一后是 7。

### JavaGuide 不摘内部类段落

JavaGuide 有内部类的笔记，许可 Apache-2.0。这里没有复制它的段落：<https://github.com/Snailclimb/JavaGuide> 。

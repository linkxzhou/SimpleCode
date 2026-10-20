---
language: java
chapter: 31
title: "Java Lambda"
level: intermediate
minutes: 10
goals:
  - "用 lambda 实现一个方法的接口"
  - "把 lambda 传进方法"
  - "用无参数 lambda 交回一个词"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

lambda 是只写方法体的一种写法，对应一个只有一个抽象方法的接口。TeaVM 能编这种调用。块里面仍然只有一个 public 类，名字是 Main。

### 按件数计价

Sale 只有 total。lambda 的参数 n 乘 8。3 件是 24。圆括号里的参数可以只有一个。

```java run expect="24" title="件数"
interface Sale {
    int total(int n);
}

public class Main {
    public static void main(String[] args) {
        Sale sale = (n) -> n * 8;
        System.out.println(sale.total(3));
    }
}
```

总价是 24。

### 把运算交进去

apply 接收一个 Op，把 10 交给它。传入的 lambda 加 2，所以打印 12。

```java run expect="12" title="加二"
interface Op {
    int apply(int n);
}

public class Main {
    static int run(Op op, int n) { return op.apply(n); }
    public static void main(String[] args) {
        System.out.println(run((n) -> n + 2, 10));
    }
}
```

结果是 12。

### 没有参数的 lambda

Word 没有参数。lambda 写成 () ->，交回 tea。调用 read 得到这个词。

```java run expect="tea" title="无参"
interface Word {
    String read();
}

public class Main {
    public static void main(String[] args) {
        Word word = () -> "tea";
        System.out.println(word.read());
    }
}
```

读到的是 tea。

### 练习：lambda 判断偶数

Check 接收一个 int，返回 boolean。传入 4，偶数应打印 yes。

```java run expect="yes" title="偶数"
interface Check {
    boolean ok(int n);
}

public class Main {
    public static void main(String[] args) {
        Check even = (n) -> n % 2 == 0;
        System.out.println(even.ok(4) ? "yes" : "no");
    }
}
```

回答是 yes。

### 核心技术只对照位置

《Java核心技术》把 lambda 放在后面的章节，这里不搬例子：<https://book.douban.com/subject/35920145> 。

---
language: java
chapter: 18
title: "Java Scanner"
level: beginner
minutes: 8
goals:
  - "用 nextLine 读一整行"
  - "用 nextInt 读一个整数"
  - "用 hasNextInt 把整数加完"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Scanner 包住 System.in。这里的 Scanner 只提供 next、nextLine、nextInt 和对应的 hasNext，没有正则。

### nextLine 读到换行

预填的一行是 Ada。nextLine 把换行前的字符收成字符串，前面再接上 Hello, 。

```java run stdin="Ada\n" expect="Hello, Ada" title="读一行"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // 读入旅客名
        Scanner in = new Scanner(System.in);
        String name = in.nextLine();
        System.out.println("Hello, " + name);
    }
}
```

问候语里能看到这个名字。

### nextInt 读一个整数

输入 21 后面有换行。nextInt 跳过空白，解析出 21，再乘 2。

```java run stdin="21\n" expect="42" title="读整数"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // 读整数再翻倍
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n * 2);
    }
}
```

打印的是乘过之后的数。

### hasNextInt 停在非数字前

循环在还有整数时调用 nextInt 并累加。输入只有 4 和 5，读完就结束。

```java run stdin="4\n5\n" expect="9" title="整数求和"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // 把剩余整数加完
        Scanner in = new Scanner(System.in);
        int sum = 0;
        while (in.hasNextInt()) {
            sum = sum + in.nextInt();
        }
        System.out.println(sum);
    }
}
```

两数之和是 9。

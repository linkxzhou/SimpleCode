---
language: java
chapter: 3
title: "Java 基础语法"
level: beginner
minutes: 8
goals:
  - "用分号结束语句"
  - "用花括号包住方法"
  - "区分大小写"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

语法靠近 C。语句用分号收尾，类和方法用花括号包住，标识符区分大小写。

### 分号结束一句

漏掉分号时，javac 会指出这一行。两句打印各自带上分号，输出才是两行。

```java run expect="semi" title="分号两句"
public class Main {
    public static void main(String[] args) {
        // 两句都有分号
        System.out.println("semi");
        System.out.println(3);
    }
}
```

先看单词，再看数字。

### 花括号成对出现

main 的方法体从左花括号开始，到右花括号结束。类的花括号再在外面套一层。

```java run expect="braces" title="花括号"
public class Main {
    public static void main(String[] args) {
        // 方法体在花括号里
        System.out.println("braces");
    }
}
```

花括号本身不会被打印。

### 大小写是两个名字

Main 是类，main 是方法。写成 Main 当方法名，编译器找不到入口。

```java run expect="9" title="大小写"
public class Main {
    public static void main(String[] args) {
        // Fare 和 fare 是两个变量
        int Fare = 4;
        int fare = 5;
        System.out.println(Fare + fare);
    }
}
```

变量名同样区分大小写。

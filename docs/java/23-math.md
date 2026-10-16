---
language: java
chapter: 23
title: "Java Math"
level: beginner
minutes: 8
goals:
  - "取较大值并截断平方根"
  - "用 abs 和 min"
  - "用嵌套的 min 取最小"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Math 上的方法都是静态的。max、min、abs 和 sqrt 足够做这几道票价算术，结果再用 int 截断。

### 较大值和整数平方根

Math.max(3, 9) 得到 9。16 的平方根是 4.0，转成 int 仍是 4。两个数打在同一行。

```java run expect="9 4" title="最大与平方根"
public class Main {
    public static void main(String[] args) {
        // 较大值和平方根
        System.out.println(Math.max(3, 9) + " " + (int) Math.sqrt(16));
    }
}
```

中间有一个空格。

### 绝对值和较小值

Math.abs 把 -3 变成 3。Math.min(9, 4) 留下 4。

```java run expect="3 4" title="绝对值"
public class Main {
    public static void main(String[] args) {
        // 绝对值再取较小
        System.out.println(Math.abs(-3) + " " + Math.min(9, 4));
    }
}
```

这一行是 3 和 4。

### 两次 min 取最小

里层先比 5 和 9，得到 5。外层再和 2 比，留下 2。

```java run expect="2" title="最小"
public class Main {
    public static void main(String[] args) {
        // 嵌套比较
        System.out.println(Math.min(Math.min(5, 9), 2));
    }
}
```

最小的数是 2。

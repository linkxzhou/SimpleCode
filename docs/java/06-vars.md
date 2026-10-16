---
language: java
chapter: 6
title: "Java 变量类型"
level: beginner
minutes: 8
goals:
  - "声明并赋值"
  - "用 final 固定一个数"
  - "在同一作用域里不重复声明"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

变量要先写出类型。赋值之后可以再改，除非前面加了 final。

### 先声明再使用

int 变量在使用前要有值。先写成 0，再累加，打印的是累加之后的数。

```java run expect="8" title="声明后赋值"
public class Main {
    public static void main(String[] args) {
        // 先归零再累加
        int seats = 0;
        seats = seats + 8;
        System.out.println(seats);
    }
}
```

未赋值就使用会被 javac 拦住。

### final 不能再改

final 适合票价这种定下来就不变的数。后面只能读取，不能写成别的值。

```java run expect="5" title="固定底价"
public class Main {
    public static void main(String[] args) {
        // 底价不再改写
        final int base = 4;
        System.out.println(base + 1);
    }
}
```

读取 final 再加一。

### 同名只能声明一次

同一个方法里，int fare 不能再声明第二遍。要改值，直接赋值。

```java run expect="9" title="再次赋值"
public class Main {
    public static void main(String[] args) {
        // 覆盖原来的值
        int fare = 6;
        fare = 9;
        System.out.println(fare);
    }
}
```

第二次是赋值，不是新声明。

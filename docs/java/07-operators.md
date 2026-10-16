---
language: java
chapter: 7
title: "Java 运算符"
level: beginner
minutes: 8
goals:
  - "做加减乘"
  - "使用比较和逻辑与"
  - "区分整数相等和字符串相等"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

运算符和 C 接近。整数用 == 比较，字符串要用 equals，不能靠 ==。

### 算术四则里的三项

加、减、乘按从左到右和优先级计算。括号能让减法先发生。

```java run expect="11" title="算术"
public class Main {
    public static void main(String[] args) {
        // 括号改变优先级
        System.out.println((8 - 3) * 2 + 1);
    }
}
```

括号里的差再乘二。

### 比较和逻辑与

&& 两边都为真，整个表达式才是 true。有一边失败就不再看需要短路的后半段。

```java run expect="true" title="逻辑与"
public class Main {
    public static void main(String[] args) {
        // 两个比较都要成立
        boolean ok = 4 > 1 && 2 < 9;
        System.out.println(ok);
    }
}
```

两个比较同时成立。

### 字符串不要用 ==

new String 造出另一个对象。equals 比较内容，== 比较是不是同一个对象。

```java run expect="true false" title="字符串相等"
public class Main {
    public static void main(String[] args) {
        // 内容相同但不是同一对象
        String a = new String("hi");
        System.out.println(a.equals("hi") + " " + (a == "hi"));
    }
}
```

输出是内容相同、对象不同。

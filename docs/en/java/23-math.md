---
language: java
chapter: 23
title: "Java Math"
level: beginner
minutes: 8
goals:
  - "Take the larger value and truncate a square root"
  - "Use abs and min"
  - "Take the smallest with nested min"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Methods on Math are static. max, min, abs, and sqrt are enough for these fare calculations, and an int cast truncates the result.

### The larger value and an integer square root

Math.max of 3 and 9 is 9. The square root of 16 is 4.0, and the int cast is still 4. Both numbers share one line.

```java run expect="9 4" title="Max and square root"
public class Main {
    public static void main(String[] args) {
        // Larger value and square root
        System.out.println(Math.max(3, 9) + " " + (int) Math.sqrt(16));
    }
}
```

A space sits between them.

### Absolute value and the smaller value

Math.abs turns -3 into 3. Math.min of 9 and 4 keeps 4.

```java run expect="3 4" title="Absolute value"
public class Main {
    public static void main(String[] args) {
        // Absolute value, then the smaller
        System.out.println(Math.abs(-3) + " " + Math.min(9, 4));
    }
}
```

This line is 3 and 4.

### Two min calls take the smallest

The inner call compares 5 and 9 and gets 5. The outer call then compares that with 2 and keeps 2.

```java run expect="2" title="Smallest"
public class Main {
    public static void main(String[] args) {
        // Nested comparison
        System.out.println(Math.min(Math.min(5, 9), 2));
    }
}
```

The smallest number is 2.

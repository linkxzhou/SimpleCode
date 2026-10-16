---
language: java
chapter: 6
title: "Java Variable Types"
level: beginner
minutes: 8
goals:
  - "Declare and assign"
  - "Freeze a number with final"
  - "Avoid a second declaration in one scope"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A variable starts with its type. It can be assigned again unless final stands in front.

### Declare before use

An int must have a value before use. Start at 0, then add, and print the value after the addition.

```java run expect="8" title="Assign after declare"
public class Main {
    public static void main(String[] args) {
        // Start at zero, then add
        int seats = 0;
        seats = seats + 8;
        System.out.println(seats);
    }
}
```

javac stops a use that has no assignment yet.

### final cannot be assigned again

final fits a fare that should stay fixed. Later code may read it and may not store a new value.

```java run expect="5" title="Fixed base"
public class Main {
    public static void main(String[] args) {
        // The base fare is not rewritten
        final int base = 4;
        System.out.println(base + 1);
    }
}
```

Read the final value and add one.

### One name is declared once

Inside one method, int fare cannot be declared a second time. To change it, assign to the existing name.

```java run expect="9" title="Assign again"
public class Main {
    public static void main(String[] args) {
        // Replace the previous value
        int fare = 6;
        fare = 9;
        System.out.println(fare);
    }
}
```

The second line assigns. It does not declare again.

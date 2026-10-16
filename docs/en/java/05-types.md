---
language: java
chapter: 5
title: "Java Basic Datatypes"
level: beginner
minutes: 8
goals:
  - "Use int and double"
  - "Truncate a floating value to int"
  - "Use boolean and char"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

The common primitive types are int, double, boolean, and char. Each section looks at one conversion.

### Integer division drops the fraction

Dividing ints keeps only the quotient. 7 divided by 2 is 3. The remainder needs a separate percent operator.

```java run expect="3 1" title="Integer division"
public class Main {
    public static void main(String[] args) {
        // Quotient and remainder
        System.out.println(7 / 2 + " " + (7 % 2));
    }
}
```

Quotient and remainder share one line.

### Truncate double to int

Casting 3.9 to int drops the fraction. The result is 3, not a rounded 4.

```java run expect="3" title="Truncation"
public class Main {
    public static void main(String[] args) {
        // Drop the fractional part
        double price = 3.9;
        System.out.println((int) price);
    }
}
```

The cast sits in parentheses.

### Booleans and characters

A comparison produces a boolean, printed as true or false. The character A cast to int is 65.

```java run expect="true" title="Boolean and char"
public class Main {
    public static void main(String[] args) {
        // A boolean and a character code
        boolean open = 3 > 1;
        System.out.println(open);
        System.out.println((int) 'A');
    }
}
```

The two results use two lines.

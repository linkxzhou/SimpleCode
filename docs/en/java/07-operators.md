---
language: java
chapter: 7
title: "Java Operators"
level: beginner
minutes: 8
goals:
  - "Add, subtract, and multiply"
  - "Use comparison and logical and"
  - "Separate int equality from string equality"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Operators sit close to C. Compare ints with ==. Compare strings with equals, not with ==.

### Three arithmetic operations

Add, subtract, and multiply follow precedence and left-to-right order. Parentheses make the subtraction happen first.

```java run expect="11" title="Arithmetic"
public class Main {
    public static void main(String[] args) {
        // Parentheses change precedence
        System.out.println((8 - 3) * 2 + 1);
    }
}
```

The difference inside parentheses is then doubled.

### Comparison and logical and

&& is true only when both sides are true. A false left side skips the right side.

```java run expect="true" title="Logical and"
public class Main {
    public static void main(String[] args) {
        // Both comparisons must hold
        boolean ok = 4 > 1 && 2 < 9;
        System.out.println(ok);
    }
}
```

Both comparisons hold.

### Do not use == on strings

new String builds another object. equals compares contents. == asks whether both sides are the same object.

```java run expect="true false" title="String equality"
public class Main {
    public static void main(String[] args) {
        // Same contents, different object
        String a = new String("hi");
        System.out.println(a.equals("hi") + " " + (a == "hi"));
    }
}
```

The output says the contents match and the objects differ.

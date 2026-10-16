---
language: java
chapter: 9
title: "Java Arrays"
level: beginner
minutes: 8
goals:
  - "Build an array with an initializer"
  - "Read by index"
  - "Sum with for-each"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

An array length is fixed at creation. Indexes start at 0. length is a field, not a method.

### An initializer lists the elements

Three numbers inside braces form an int array. length is the element count.

```java run expect="3" title="Array length"
public class Main {
    public static void main(String[] args) {
        // Three fares
        int[] fares = { 4, 15, 23 };
        System.out.println(fares.length);
    }
}
```

Print the length.

### Indexes start at 0

The first element is fares[0]. An index past the end throws at run time, so the sample stays in range.

```java run expect="15" title="By index"
public class Main {
    public static void main(String[] args) {
        // The second element
        int[] fares = { 4, 15, 23 };
        System.out.println(fares[1]);
    }
}
```

Print the middle value.

### for-each accumulates

for (int v : fares) visits each element. The accumulator starts at 0 and ends at the total.

```java run expect="42" title="Sum"
public class Main {
    public static void main(String[] args) {
        // Walk and sum
        int[] fares = { 4, 15, 23 };
        int sum = 0;
        for (int v : fares) {
            sum = sum + v;
        }
        System.out.println(sum);
    }
}
```

The sum of 4, 15, and 23 is 42.

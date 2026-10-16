---
language: java
chapter: 12
title: "Java Loop Control"
level: beginner
minutes: 8
goals:
  - "Accumulate with while"
  - "Count with for"
  - "Leave early with break"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A loop repeats a block. while tests before each pass, for keeps the counter in its header, and break leaves at once.

### while tests first

n moves from 1 through 4. When the test fails, the loop stops and sum is already 10.

```java run expect="10" title="while sum"
public class Main {
    public static void main(String[] args) {
        // Add through 4
        int n = 1;
        int sum = 0;
        while (n <= 4) {
            sum = sum + n;
            n = n + 1;
        }
        System.out.println(sum);
    }
}
```

Change n inside the loop, or it never stops.

### for keeps three parts together

Initialization, test, and update share one pair of parentheses. i runs from 0 to 2 and adds three fares.

```java run expect="42" title="for count"
public class Main {
    public static void main(String[] args) {
        // Walk by index
        int[] fares = { 4, 15, 23 };
        int sum = 0;
        for (int i = 0; i < fares.length; i = i + 1) {
            sum = sum + fares[i];
        }
        System.out.println(sum);
    }
}
```

The result is still 42.

### break ends early

Once sum reaches 6, break runs. Later numbers are not added.

```java run expect="6" title="Leave early"
public class Main {
    public static void main(String[] args) {
        // Leave once the sum is enough
        int sum = 0;
        for (int n = 1; n <= 9; n = n + 1) {
            sum = sum + n;
            if (sum >= 6) {
                break;
            }
        }
        System.out.println(sum);
    }
}
```

It stops after 1 plus 2 plus 3.

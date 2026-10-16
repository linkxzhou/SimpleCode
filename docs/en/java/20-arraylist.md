---
language: java
chapter: 20
title: "Java ArrayList"
level: beginner
minutes: 8
goals:
  - "Read size after add"
  - "Fetch index 1 with get"
  - "Remove index 0"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

An ArrayList length changes with add and remove. Indexes still start at 0. Both get and remove work by index.

### Add twice, then read the length

Put a in first, then b. size returns the current element count, which is 2 here.

```java run expect="2" title="List length"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Two passengers join the list
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("a");
        xs.add("b");
        System.out.println(xs.size());
    }
}
```

The length prints as one line.

### get fetches by index

Index 0 is a and index 1 is b. get(1) fetches the one added later.

```java run expect="b" title="Fetch by index"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Fetch the second
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("a");
        xs.add("b");
        System.out.println(xs.get(1));
    }
}
```

Print b.

### remove deletes by index

remove(0) deletes a, and b shifts to index 0. The next get(0) is b.

```java run expect="b" title="After removal"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Delete the first
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("a");
        xs.add("b");
        xs.remove(0);
        System.out.println(xs.get(0));
    }
}
```

The remaining name is b.

---
language: java
chapter: 32
title: "Java Streams"
level: intermediate
minutes: 11
goals:
  - "Sum with filter and mapToInt"
  - "Count what remains"
  - "Rewrite strings with map and take the first"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

A Stream turns a few steps over a list into one pipeline. Those steps do not rewrite the source list. This TeaVM class library includes java.util.stream, so the pipelines below can run.

### Add the even numbers

The even numbers from 1 to 4 are 2 and 4. filter keeps them, mapToInt makes an int stream, and sum is 6.

```java run expect="6" title="Even sum"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> xs = Arrays.asList(1, 2, 3, 4);
        int sum = xs.stream().filter(n -> n % 2 == 0).mapToInt(n -> n).sum();
        System.out.println(sum);
    }
}
```

The even sum is 6.

### Count words longer than 3

tea and cup have length 3, and cake has length 4. After filter, count is 1. count returns a long, and the print is 1.

```java run expect="1" title="Longer word"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("tea", "cake", "cup");
        long n = words.stream().filter(w -> w.length() > 3).count();
        System.out.println(n);
    }
}
```

The count is 1.

### Uppercase, then take the first

map uppercases each word. findFirst returns an Optional, and orElse is used only when it is empty. The first item is TEA.

```java run expect="TEA" title="First upper"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("tea", "bun");
        String first = words.stream().map(w -> w.toUpperCase()).findFirst().orElse("none");
        System.out.println(first);
    }
}
```

The first item is TEA.

### Exercise: how many positives

Count how many of -1, 4, 0, and 2 are greater than 0. The print should be 2.

```java run expect="2" title="Positive count"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> xs = Arrays.asList(-1, 4, 0, 2);
        long n = xs.stream().filter(v -> v > 0).count();
        System.out.println(n);
    }
}
```

There are 2 positives.

### The JavaGuide collections pages

JavaGuide is published under Apache-2.0, and it discusses Stream near the collections pages. The pipelines here were written separately: <https://github.com/Snailclimb/JavaGuide>.

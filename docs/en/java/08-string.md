---
language: java
chapter: 8
title: "Java Strings"
level: beginner
minutes: 8
goals:
  - "Read the length"
  - "Cut out a slice"
  - "Change letter case"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A string is an object. Length, slicing, and case are methods. Indexes start at 0, and the end index is excluded.

### length counts characters

Hello has 5 characters. These examples stay in ASCII, so one character is one byte.

```java run expect="5" title="Length"
public class Main {
    public static void main(String[] args) {
        // Five characters
        String word = "Hello";
        System.out.println(word.length());
    }
}
```

Print the length.

### substring excludes the end

substring(1, 4) starts at index 1 and stops before index 4. Hello yields ell.

```java run expect="ELL" title="Slice"
public class Main {
    public static void main(String[] args) {
        // Slice, then upper-case
        String word = "Hello";
        System.out.println(word.substring(1, 4).toUpperCase());
    }
}
```

Upper case then makes ELL.

### Join with plus

Plus joins two strings into a new string. The original variable stays unchanged.

```java run expect="cop copper" title="Join"
public class Main {
    public static void main(String[] args) {
        // The original string remains
        String left = "cop";
        String both = left + "per";
        System.out.println(left + " " + both);
    }
}
```

Join first, then print the original prefix.

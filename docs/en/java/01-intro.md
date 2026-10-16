---
language: java
chapter: 1
title: "Java Introduction"
level: beginner
minutes: 8
goals:
  - "Recognize the main parameter"
  - "Separate strings from ints"
  - "See when addition becomes concatenation"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Execution enters main. This chapter covers the argument array, literals, and how plus behaves on ints versus strings.

### The argument array is empty

The main parameter is a string array. The playground does not supply command-line arguments, so the length is 0.

```java run expect="0" title="Empty arguments"
public class Main {
    public static void main(String[] args) {
        // Argument count
        System.out.println(args.length);
    }
}
```

Printing the length is enough.

### Two ways to write a literal

Text in double quotes is a string. A bare integer prints as a number. Two println calls take two lines.

```java run expect="token" title="Two literals"
public class Main {
    public static void main(String[] args) {
        // String and int on separate lines
        System.out.println("token");
        System.out.println(7);
    }
}
```

The string comes first, then the number.

### Plus follows the types beside it

Two integers still use arithmetic. After an integer meets a string, later plus signs switch to concatenation.

```java run expect="42" title="Add versus join"
public class Main {
    public static void main(String[] args) {
        // Add, then join
        System.out.println(20 + 22);
        System.out.println("n" + 20 + 22);
    }
}
```

The first line is a sum. The second line is joined text.

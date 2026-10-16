---
language: java
chapter: 17
title: "Java Exceptions"
level: beginner
minutes: 8
goals:
  - "Catch a number-format exception"
  - "Let finally rewrite the result"
  - "Keep the value when parsing works"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

When a statement inside try throws, control jumps to the matching catch. finally runs again whether or not anything was thrown.

### A letter is not an integer

Integer.parseInt throws NumberFormatException on x. catch takes that exception and prints bad instead of stopping the program.

```java run expect="bad" title="Format exception"
public class Main {
    public static void main(String[] args) {
        // Catch the format error
        try {
            Integer.parseInt("x");
            System.out.println("ok");
        } catch (NumberFormatException ex) {
            System.out.println("bad");
        }
    }
}
```

The success line does not run.

### finally always runs

try changes n to 2. Before leaving try, finally changes n to 3. The print happens after both steps.

```java run expect="3" title="finally"
public class Main {
    public static void main(String[] args) {
        // Rewrite on the way out
        int n = 1;
        try {
            n = 2;
        } finally {
            n = 3;
        }
        System.out.println(n);
    }
}
```

What remains is 3.

### A successful parse skips catch

The string 4 parses as an integer. The -1 inside catch is not stored, so n stays 4.

```java run expect="4" title="Parse succeeds"
public class Main {
    public static void main(String[] args) {
        // The normal path skips catch
        int n = 0;
        try {
            n = Integer.parseInt("4");
        } catch (NumberFormatException ex) {
            n = -1;
        }
        System.out.println(n);
    }
}
```

Print the parsed number.

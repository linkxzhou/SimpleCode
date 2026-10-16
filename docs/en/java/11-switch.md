---
language: java
chapter: 11
title: "Java switch Statement"
level: beginner
minutes: 8
goals:
  - "Branch on an int"
  - "Remember break"
  - "Give a string a default"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

switch picks a case from one value. Without break, execution falls into the next case. These samples include break.

### An int case

A case label is a constant. A match on 2 prints bee, then break leaves the switch.

```java run expect="bee" title="Int cases"
public class Main {
    public static void main(String[] args) {
        // Match lane two
        int lane = 2;
        switch (lane) {
            case 1:
                System.out.println("a");
                break;
            case 2:
                System.out.println("bee");
                break;
            default:
                System.out.println("c");
        }
    }
}
```

Other numbers do not enter.

### default catches the rest

default runs when no case matches. Feeding 0 prints other.

```java run expect="other" title="Default branch"
public class Main {
    public static void main(String[] args) {
        // No case matched
        int lane = 0;
        switch (lane) {
            case 1:
                System.out.println("a");
                break;
            default:
                System.out.println("other");
        }
    }
}
```

default usually comes last.

### A string can switch too

The switch expression may be a string. A case matches when the contents are equal.

```java run expect="B" title="String cases"
public class Main {
    public static void main(String[] args) {
        // Match on string contents
        String code = "b";
        switch (code) {
            case "a":
                System.out.println("A");
                break;
            case "b":
                System.out.println("B");
                break;
            default:
                System.out.println("Z");
        }
    }
}
```

b prints a capital B.

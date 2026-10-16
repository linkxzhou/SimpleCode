---
language: java
chapter: 25
title: "Java Enums"
level: beginner
minutes: 8
goals:
  - "Print an enum name and its ordinal"
  - "Count constants with values"
  - "Read the ordinal of the first constant"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

An enum lists a fixed set of coins. Each constant has a name and an ordinal starting at 0. values returns every constant.

### Name followed by the ordinal

SILVER is the second constant, so its ordinal is 1. name() yields SILVER, and joining the ordinal makes SILVER1.

```java run expect="SILVER1" title="Name and ordinal"
enum Coin {
    COPPER,
    SILVER
}

public class Main {
    public static void main(String[] args) {
        // Name and ordinal of the silver coin
        Coin c = Coin.SILVER;
        System.out.println(c.name() + c.ordinal());
    }
}
```

There is no space between them.

### The length of values

Coin contains only COPPER and SILVER. The array from values() has length 2.

```java run expect="2" title="Constant count"
enum Coin {
    COPPER,
    SILVER
}

public class Main {
    public static void main(String[] args) {
        // Two coins
        System.out.println(Coin.values().length);
    }
}
```

The count prints as one line.

### The first ordinal is 0

COPPER is written first in the enum, so ordinal() is 0. Later constants do not change that starting point.

```java run expect="0" title="Starting ordinal"
enum Coin {
    COPPER,
    SILVER
}

public class Main {
    public static void main(String[] args) {
        // The copper coin is first
        System.out.println(Coin.COPPER.ordinal());
    }
}
```

Print 0.

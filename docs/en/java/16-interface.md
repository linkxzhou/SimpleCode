---
language: java
chapter: 16
title: "Java Interfaces"
level: beginner
minutes: 8
goals:
  - "Fulfill total with implements"
  - "Implement a method that returns a string"
  - "Implement a method with two parameters"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

An interface lists methods and writes no body. A class connects with implements and fills each method in as public.

### Total from a count

Sale requires total(int). Window multiplies 8 by the count. new Window().total(3) is 8 times 3.

```java run expect="24" title="Interface total"
interface Sale {
    public int total(int n);
}

class Window implements Sale {
    public int total(int n) {
        return 8 * n;
    }
}

public class Main {
    public static void main(String[] args) {
        // The window prices by count
        System.out.println(new Window().total(3));
    }
}
```

Three items total 24.

### Implement a string return

Tag only has name(). Copper returns the word cop. The interface does not store that word itself.

```java run expect="cop" title="Name method"
interface Tag {
    public String name();
}

class Copper implements Tag {
    public String name() {
        return "cop";
    }
}

public class Main {
    public static void main(String[] args) {
        // Name of the copper tag
        System.out.println(new Copper().name());
    }
}
```

What prints is the word from the implementing class.

### Read two parameters together

Meter.read receives two ints. Desk adds them and returns the sum. The call passes 4 and 5 in that order.

```java run expect="9" title="Two parameters"
interface Meter {
    public int read(int a, int b);
}

class Desk implements Meter {
    public int read(int a, int b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        // The desk adds the two numbers
        System.out.println(new Desk().read(4, 5));
    }
}
```

The sum is 9.

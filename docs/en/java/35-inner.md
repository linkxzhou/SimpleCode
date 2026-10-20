---
language: java
chapter: 35
title: "Java Inner and Anonymous Classes"
level: advanced
minutes: 10
goals:
  - "Let an inner class read an outer field"
  - "Implement an interface with an anonymous class"
  - "Write a local class inside a method"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

An inner class is tied to an outer instance, so it can read the outer fields. An anonymous class has no name of its own and fits an interface you implement once. A local class is written inside a method.

### The inner class reads the milliliters

Cup is an inner class of Main, and read uses the outer ml directly. Construct Main first, then build the inner object with host.new Cup(). 8 milliliters read back as 8.

```java run expect="8" title="Inner cup"
public class Main {
    int ml = 8;
    class Cup {
        int read() { return ml; }
    }
    public static void main(String[] args) {
        Main host = new Main();
        System.out.println(host.new Cup().read());
    }
}
```

The value read is 8.

### An anonymous class computes the total

new Sale() { ... } fills in total on the spot. 3 times 8 is 24. That object has no separate class name.

```java run expect="24" title="Anonymous price"
interface Sale {
    int total(int n);
}

public class Main {
    public static void main(String[] args) {
        Sale sale = new Sale() {
            public int total(int n) { return n * 8; }
        };
        System.out.println(sale.total(3));
    }
}
```

The total is 24.

### A local class inside the method

Tag is written inside main and is visible only in that method. It stores bun, and label hands that word back.

```java run expect="bun" title="Local tag"
public class Main {
    public static void main(String[] args) {
        class Tag {
            String name;
            Tag(String name) { this.name = name; }
            String label() { return name; }
        }
        System.out.println(new Tag("bun").label());
    }
}
```

The label is bun.

### Exercise: an anonymous class adds one

Step has only one. The anonymous class adds 1 to the argument. Passing 6 should print 7.

```java run expect="7" title="Add one"
interface Step {
    int one(int n);
}

public class Main {
    public static void main(String[] args) {
        Step step = new Step() {
            public int one(int n) { return n + 1; }
        };
        System.out.println(step.one(6));
    }
}
```

After adding one, the value is 7.

### JavaGuide inner-class text is not quoted

JavaGuide has notes on inner classes under Apache-2.0. None of those paragraphs are copied: <https://github.com/Snailclimb/JavaGuide>.

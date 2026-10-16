---
language: java
chapter: 26
title: "Java static"
level: beginner
minutes: 8
goals:
  - "Accumulate a count with a static method"
  - "Return a base fare from a static method"
  - "Rewrite a static field"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A static member belongs to the class, not to one ticket. You can reach the method or field through the class name before any new.

### A static count increments twice

Counter.n starts at 0. Each bump adds 1 to n. After two calls, n is 2.

```java run expect="2" title="Static count"
class Counter {
    static int n;

    static void bump() {
        n = n + 1;
    }
}

public class Main {
    public static void main(String[] args) {
        // A count on the class
        Counter.bump();
        Counter.bump();
        System.out.println(Counter.n);
    }
}
```

There is no need to new Counter first.

### A static method returns directly

Fare.base does not depend on an object and returns 6. Call it through the class name.

```java run expect="6" title="Static return"
class Fare {
    static int base() {
        return 6;
    }
}

public class Main {
    public static void main(String[] args) {
        // The class method supplies the base fare
        System.out.println(Fare.base());
    }
}
```

Print 6.

### A static field can be rewritten

Desk.fare starts at 3. After adding 4, a read gets 7. Every use sees that same field.

```java run expect="7" title="Change a static field"
class Desk {
    static int fare = 3;
}

public class Main {
    public static void main(String[] args) {
        // Change the fare on the class
        Desk.fare = Desk.fare + 4;
        System.out.println(Desk.fare);
    }
}
```

The result is the number after the change.

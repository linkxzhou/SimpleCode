---
language: java
chapter: 34
title: "Java Records and Sealed Types"
level: advanced
minutes: 11
goals:
  - "Store a name and a score in a record"
  - "Use the accessor instead of a field"
  - "Limit the implementing class with sealed"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

A record generates a constructor, accessors, and equals. sealed limits who may implement the interface. TeaVM javac can compile the short samples below. Helper classes still must not be public.

### The accessor is named name

The two components of Score are name and points. The accessor is name(), not getName. Ada and 91 share one line.

```java run expect="Ada91" title="One score"
record Score(String name, int points) {}

public class Main {
    public static void main(String[] args) {
        Score row = new Score("Ada", 91);
        System.out.println(row.name() + row.points());
    }
}
```

The joined line is Ada91.

### Equal components mean equal records

The generated equals compares every component. Two tea/4 records should print yes.

```java run expect="yes" title="Two equal rows"
record Item(String name, int price) {}

public class Main {
    public static void main(String[] args) {
        Item left = new Item("tea", 4);
        Item right = new Item("tea", 4);
        System.out.println(left.equals(right) ? "yes" : "no");
    }
}
```

Equality prints yes.

### Only Ok is allowed

Result uses sealed and permits to name Ok. Ok must be final, or the compiler would ask it to explain its subclasses. The field n reads as 7.

```java run expect="7" title="Only implementation"
sealed interface Result permits Ok {}
final class Ok implements Result {
    int n;
    Ok(int n) { this.n = n; }
}

public class Main {
    public static void main(String[] args) {
        Ok row = new Ok(7);
        System.out.println(row.n);
    }
}
```

The number is 7.

### Exercise: also store a seat number

A record with three components: name, row, and seat. Ada in row 2 seat 8 should print 2-8.

```java run expect="2-8" title="Seat"
record Seat(String name, int row, int seat) {}

public class Main {
    public static void main(String[] args) {
        Seat spot = new Seat("Ada", 2, 8);
        System.out.println(spot.row() + "-" + spot.seat());
    }
}
```

The place is 2-8.

### Outlines from two copyrighted books

Where records and sealed types sit in Core Java and Effective Java is only an outline check: <https://book.douban.com/subject/35920145>.

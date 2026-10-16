---
language: java
chapter: 14
title: "Java Objects and Classes"
level: beginner
minutes: 8
goals:
  - "Give an object a field"
  - "Write this inside a constructor"
  - "Provide two constructors"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A class is the template for a ticket. new builds one ticket. Fields live on the object, and constructors fill them during new.

### A field lives on the object

seats inside Ticket starts at 4. After new Ticket() builds the object, a dot reads that field.

```java run expect="4" title="Object field"
class Ticket {
    int seats = 4;
}

public class Main {
    public static void main(String[] args) {
        // Read the seat count
        System.out.println(new Ticket().seats);
    }
}
```

What prints is the starting value.

### this is the ticket being built

The constructor parameter is also named n. this.fare writes the object's own field, so it does not mix with the parameter.

```java run expect="6" title="Assign through this"
class Ticket {
    int fare;

    Ticket(int n) {
        this.fare = n;
    }
}

public class Main {
    public static void main(String[] args) {
        // Store the fare while constructing
        System.out.println(new Ticket(6).fare);
    }
}
```

Pass 6 and the field is 6.

### Two constructors split the work

The constructor with no parameters sets the fare to 1. The constructor that takes an int uses the passed number. The arguments at new choose which one runs.

```java run expect="1 5" title="Two constructors"
class Ticket {
    int fare;

    Ticket() {
        this.fare = 1;
    }

    Ticket(int n) {
        this.fare = n;
    }
}

public class Main {
    public static void main(String[] args) {
        // One default ticket, one chosen fare
        Ticket a = new Ticket();
        Ticket b = new Ticket(5);
        System.out.println(a.fare + " " + b.fare);
    }
}
```

The two fares share one line.

---
language: java
chapter: 30
title: "Java Iterator and Comparable"
level: intermediate
minutes: 10
goals:
  - "Take the first item with Iterator"
  - "Decide order with Comparable"
  - "Read the smallest name after sorting"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Iterator packs walking forward into hasNext and next. Comparable lets an object answer which one is smaller. Collections.sort calls compareTo.

### The first item from the iterator

The list stores mint and then bean. The first next from the iterator is mint. This sample does not use get by index.

```java run expect="mint" title="First item"
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("mint");
        xs.add("bean");
        Iterator<String> it = xs.iterator();
        System.out.println(it.next());
    }
}
```

The first item is mint.

### Stop when the walk is finished

next runs only while hasNext is true. After both trees are visited, the count is 2. The loop does not ask for another item at the end.

```java run expect="2" title="Count two steps"
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("oak");
        xs.add("elm");
        int n = 0;
        Iterator<String> it = xs.iterator();
        while (it.hasNext()) {
            it.next();
            n += 1;
        }
        System.out.println(n);
    }
}
```

The step count is 2.

### Sort by row number

Seat implements Comparable, and compareTo subtracts row numbers. bo is on row 3 and ada is on row 1. After sorting, the first name is ada.

```java run expect="ada" title="Smallest row"
import java.util.ArrayList;
import java.util.Collections;

class Seat implements Comparable<Seat> {
    String name;
    int row;
    Seat(String name, int row) {
        this.name = name;
        this.row = row;
    }
    public int compareTo(Seat other) {
        return this.row - other.row;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Seat> rows = new ArrayList<Seat>();
        rows.add(new Seat("bo", 3));
        rows.add(new Seat("ada", 1));
        Collections.sort(rows);
        System.out.println(rows.get(0).name);
    }
}
```

The first name is ada.

### Exercise: compare prices

Tag compares by price. After sorting 8 and 3, the first name should be bun.

```java run expect="bun" title="Cheaper"
import java.util.ArrayList;
import java.util.Collections;

class Tag implements Comparable<Tag> {
    String name;
    int price;
    Tag(String name, int price) {
        this.name = name;
        this.price = price;
    }
    public int compareTo(Tag other) {
        return this.price - other.price;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Tag> tags = new ArrayList<Tag>();
        tags.add(new Tag("cake", 8));
        tags.add(new Tag("bun", 3));
        Collections.sort(tags);
        System.out.println(tags.get(0).name);
    }
}
```

The cheaper name is bun.

### The doocs repository license

doocs/advanced-java is CC-BY-SA-4.0. This chapter does not quote it. A later adaptation of its text would keep that license: <https://github.com/doocs/advanced-java>.

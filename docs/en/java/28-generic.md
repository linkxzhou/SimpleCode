---
language: java
chapter: 28
title: "Java Generics"
level: intermediate
minutes: 10
goals:
  - "Write a box with a type parameter"
  - "Accept any list with a wildcard"
  - "Declare a type parameter on one method"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Generics remember what a box should hold while the compiler is running. TeaVM javac accepts these forms. At runtime the value you take out is still an ordinary object, and the sample prints that value.

### The box hands back the stored word

The type parameter T on Box is String at construction. tea goes in, and get hands tea back. The helper class is not public.

```java run expect="tea" title="String box"
class Box<T> {
    T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

public class Main {
    public static void main(String[] args) {
        Box<String> box = new Box<String>("tea");
        System.out.println(box.get());
    }
}
```

The word handed back is tea.

### A wildcard only asks for the length

List<?> means the list holds some element type, but this method does not read an element. It only asks for size. One tea makes the length 1.

```java run expect="1" title="Length only"
import java.util.ArrayList;
import java.util.List;

public class Main {
    static int len(List<?> xs) { return xs.size(); }
    public static void main(String[] args) {
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("tea");
        System.out.println(len(xs));
    }
}
```

The length is 1.

### A type parameter that belongs to the method

echo declares T on the method, and the call infers it from the argument. Passing 4 prints 4. The class name does not need a type parameter.

```java run expect="4" title="T on the method"
public class Main {
    static <T> T echo(T value) { return value; }
    public static void main(String[] args) {
        System.out.println(echo(4));
    }
}
```

The value prints as 4.

### Exercise: add the numbers from two boxes

Two Box<Integer> values hold 3 and 5. Adding what you take out should print 8.

```java run expect="8" title="Add two boxes"
class Box<T> {
    T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

public class Main {
    public static void main(String[] args) {
        Box<Integer> left = new Box<Integer>(3);
        Box<Integer> right = new Box<Integer>(5);
        System.out.println(left.get() + right.get());
    }
}
```

The sum is 8.

### The copyrighted book is only an outline

Core Java Volume I can show where generics sit in a long book. Do not copy its sentences or samples: <https://book.douban.com/subject/35920145>. The programs here were written separately, and the topic list also consulted JavaGuide (Apache-2.0).

---
language: java
chapter: 0
title: "Java Tutorial"
minutes: 8
goals:
  - "Print one line with println"
  - "Keep the public class named Main"
  - "Separate TeaVM from a full JDK"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

This book compiles the Main.java in the editor. The browser compiler is TeaVM, and the class library belongs to TeaVM.

### Print one line first

println ends the line. Plus joins a string and an integer so the fare window can report one total.

```java run expect="Hello from Java 42" title="First window line"
public class Main {
    public static void main(String[] args) {
        // First line at the fare window
        System.out.println("Hello from Java " + 42);
    }
}
```

The terminal should show that total.

### The class stays Main

The source file is Main.java. javac rejects a public class with any other name. Helper classes are not public.

```java run expect="class Main" title="Name lines up"
public class Main {
    public static void main(String[] args) {
        // Class name matches the file
        System.out.println("class Main");
    }
}
```

The next line only prints the class name.

### This is not a full JDK

os.name on this class library is TeaVM. Printing, collections, and a short pause work. Disk files and reflection stay in chapter 27 as reading-only notes.

```java run expect="TeaVM" title="Runtime name"
public class Main {
    public static void main(String[] args) {
        // Read the runtime name
        System.out.println(System.getProperty("os.name"));
    }
}
```

Confirm the runtime name first.

### After chapter 27

Generics, collections, Iterator, lambdas, Stream, Optional, records, inner classes, threads, and AtomicInteger are written for this TeaVM build. CountDownLatch and disk files remain reading-only. Chapter 39 tallies grades in a list.

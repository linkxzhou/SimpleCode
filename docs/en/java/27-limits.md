---
language: java
chapter: 27
title: "Limits of this Java playground"
level: beginner
minutes: 8
goals:
  - "Treat the file sample as reading only"
  - "Treat the reflection sample as reading only"
  - "Confirm that printing and lists still run"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Printing, collections, sleep, and standard input from the earlier chapters can run. Disk files and reflection are unreliable on this TeaVM class library, so those two samples are for reading only.

### A file does not really appear

new File does not create a.txt in the browser. Even if exists can be called, it does not mean the file is on a disk. This sample is marked for reading only.

```java norun title="File for reading"
import java.io.File;

public class Main {
    public static void main(String[] args) {
        // Reading only, no file is created
        System.out.println(new File("a.txt").exists());
    }
}
```

Do not treat it as proof that the playground has a file system.

### Reflection is unavailable

Class.forName fails on this class library. The code below shows the shape, and the run button does not execute it.

```java norun title="Reflection for reading"
public class Main {
    public static void main(String[] args) {
        // Reflection for reading only
        System.out.println(Class.forName("Main"));
    }
}
```

Do not treat a class-name string as a class that can be loaded.

### Printing still works

The limits sit on files and reflection. An ordinary println still goes from main to the terminal.

```java run expect="still prints" title="Still prints"
public class Main {
    public static void main(String[] args) {
        // Ordinary output is unaffected
        System.out.println("still prints");
    }
}
```

This line shows that output is still there.

### Lists remain too

ArrayList is one of the collections used earlier. Adding ok and reading index 0 shows that this chapter is not entirely unable to run.

```java run expect="ok" title="List still runs"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // The list can still run
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("ok");
        System.out.println(xs.get(0));
    }
}
```

The word read back is ok.

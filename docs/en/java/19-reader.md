---
language: java
chapter: 19
title: "Java Character Streams"
level: beginner
minutes: 8
goals:
  - "Read one line with readLine"
  - "Read two lines and join them with a slash"
  - "Use the length to confirm the character count"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

BufferedReader plus InputStreamReader can also read System.in. One byte becomes one character here, and the input stays ASCII.

### readLine drops the newline

readLine returns the text before the newline. A prefix of line and a space shows which row arrived.

```java run stdin="Ada\n" expect="line Ada" title="Read one line"
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        // Buffered read of one line
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("line " + in.readLine());
    }
}
```

This line ends with Ada.

### Join two lines into one

Two readLine calls return Ada and Lee. A slash between them prints as one line, so the expected text does not depend on a raw break.

```java run stdin="Ada\nLee\n" expect="Ada/Lee" title="Two lines"
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        // Two passengers
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String a = in.readLine();
        String b = in.readLine();
        System.out.println(a + "/" + b);
    }
}
```

The result is Ada/Lee.

### Length counts characters

cop has three characters. readLine does not keep the trailing newline in the string, so length is 3.

```java run stdin="cop\n" expect="3" title="Line length"
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        // The newline is not counted
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        System.out.println(in.readLine().length());
    }
}
```

The digit 3 stands on its own line.

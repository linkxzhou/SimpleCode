---
language: java
chapter: 18
title: "Java Scanner"
level: beginner
minutes: 8
goals:
  - "Read a whole line with nextLine"
  - "Read an integer with nextInt"
  - "Add integers while hasNextInt"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Scanner wraps System.in. The Scanner here only offers next, nextLine, nextInt, and the matching hasNext methods. It has no regular expressions.

### nextLine reads until the newline

The preset line is Ada. nextLine collects the characters before the newline, and the print puts Hello, in front.

```java run stdin="Ada\n" expect="Hello, Ada" title="Read one line"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Read the passenger name
        Scanner in = new Scanner(System.in);
        String name = in.nextLine();
        System.out.println("Hello, " + name);
    }
}
```

The greeting contains that name.

### nextInt reads one integer

The input is 21 followed by a newline. nextInt skips whitespace, parses 21, and the program multiplies by 2.

```java run stdin="21\n" expect="42" title="Read an int"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Read an int, then double it
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(n * 2);
    }
}
```

What prints is the number after multiplying.

### hasNextInt stops before a non-number

The loop calls nextInt and adds while another integer remains. The input is only 4 and 5, so it ends after those.

```java run stdin="4\n5\n" expect="9" title="Sum of ints"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Add the remaining integers
        Scanner in = new Scanner(System.in);
        int sum = 0;
        while (in.hasNextInt()) {
            sum = sum + in.nextInt();
        }
        System.out.println(sum);
    }
}
```

The sum of the two numbers is 9.

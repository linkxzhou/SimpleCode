---
language: java
chapter: 13
title: "Java Methods"
level: beginner
minutes: 8
goals:
  - "Return one integer"
  - "Add two parameters"
  - "Overload by parameter count"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A method names a fare calculation. The call passes arguments, and return hands an integer back to main.

### Return without a parameter

fare takes no parameter and returns 7 from its body. main prints the value of that call, not the method name.

```java run expect="7" title="Returned base"
public class Main {
    static int fare() {
        return 7;
    }
    public static void main(String[] args) {
        // Call the method with no arguments
        System.out.println(fare());
    }
}
```

That line on the terminal is 7.

### Add two parameters

add receives a and b, then returns their sum. The call add(4, 5) lines the arguments up in order.

```java run expect="9" title="Add the arguments"
public class Main {
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        // Two arguments
        System.out.println(add(4, 5));
    }
}
```

The sum of 4 and 5 occupies its own line.

### The same name looks at the count

Two methods may share the name add. One int selects the single-parameter version. Two ints select the other. That is overloading by count.

```java run expect="3 6" title="Overload"
public class Main {
    static int add(int a) {
        return a;
    }

    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        // Pick by how many arguments
        System.out.println(add(3) + " " + add(1, 5));
    }
}
```

The output separates the two call results.

---
language: java
chapter: 3
title: "Java Basic Syntax"
level: beginner
minutes: 8
goals:
  - "End a statement with a semicolon"
  - "Wrap a method in braces"
  - "Respect case"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

The syntax sits near C. Statements end with semicolons, classes and methods use braces, and identifiers are case-sensitive.

### A semicolon ends a statement

javac points at the line when a semicolon is missing. Two prints each keep a semicolon, so the output is two lines.

```java run expect="semi" title="Two semicolons"
public class Main {
    public static void main(String[] args) {
        // Both statements keep a semicolon
        System.out.println("semi");
        System.out.println(3);
    }
}
```

The word comes first, then the number.

### Braces come in pairs

The body of main starts at a left brace and ends at a right brace. The class braces wrap that pair.

```java run expect="braces" title="Braces"
public class Main {
    public static void main(String[] args) {
        // The body sits inside braces
        System.out.println("braces");
    }
}
```

The braces themselves are not printed.

### Case makes two names

Main is the class and main is the method. Naming the method Main means the compiler finds no entry.

```java run expect="9" title="Letter case"
public class Main {
    public static void main(String[] args) {
        // Fare and fare are two variables
        int Fare = 4;
        int fare = 5;
        System.out.println(Fare + fare);
    }
}
```

Variable names are case-sensitive too.

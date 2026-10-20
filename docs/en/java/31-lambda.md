---
language: java
chapter: 31
title: "Java Lambdas"
level: intermediate
minutes: 10
goals:
  - "Implement a one-method interface with a lambda"
  - "Pass a lambda into a method"
  - "Return a word from a lambda with no parameter"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

A lambda writes only the method body. It matches an interface with one abstract method. TeaVM can compile this call. The block still has one public class, and its name is Main.

### Price by the piece

Sale has only total. The lambda multiplies the parameter n by 8. Three pieces cost 24. A single parameter can sit in parentheses.

```java run expect="24" title="Piece count"
interface Sale {
    int total(int n);
}

public class Main {
    public static void main(String[] args) {
        Sale sale = (n) -> n * 8;
        System.out.println(sale.total(3));
    }
}
```

The total is 24.

### Pass the operation in

apply receives an Op and hands it 10. The lambda that was passed adds 2, so the print is 12.

```java run expect="12" title="Add two"
interface Op {
    int apply(int n);
}

public class Main {
    static int run(Op op, int n) { return op.apply(n); }
    public static void main(String[] args) {
        System.out.println(run((n) -> n + 2, 10));
    }
}
```

The result is 12.

### A lambda with no parameter

Word has no parameter. The lambda is written () -> and hands back tea. Calling read yields that word.

```java run expect="tea" title="No parameter"
interface Word {
    String read();
}

public class Main {
    public static void main(String[] args) {
        Word word = () -> "tea";
        System.out.println(word.read());
    }
}
```

The word read is tea.

### Exercise: a lambda tests even numbers

Check takes an int and returns boolean. Passing 4, an even number, should print yes.

```java run expect="yes" title="Even"
interface Check {
    boolean ok(int n);
}

public class Main {
    public static void main(String[] args) {
        Check even = (n) -> n % 2 == 0;
        System.out.println(even.ok(4) ? "yes" : "no");
    }
}
```

The answer is yes.

### Core Java only for placement

Core Java places lambdas in a later chapter. The samples are not copied: <https://book.douban.com/subject/35920145>.

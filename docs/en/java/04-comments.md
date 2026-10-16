---
language: java
chapter: 4
title: "Java Comments"
level: beginner
minutes: 8
goals:
  - "Write a // comment"
  - "Write a /* */ comment"
  - "Confirm comments are not printed"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Comments are for the person reading the source. The compiler drops them, so the terminal never shows those words.

### Two slashes comment out one line

Everything from // to the end of the line stays out of the compile. The Chinese book puts notes in this kind of comment.

```java run expect="kept" title="Line comment"
public class Main {
    public static void main(String[] args) {
        // This comment line stays out of the output
        // ignored line
        System.out.println("kept");
    }
}
```

Only the word outside the comment is printed.

### A block comment can span lines

Text between /* and */ is dropped as well. Do not hide string data with that syntax.

```java run expect="after" title="Block comment"
public class Main {
    public static void main(String[] args) {
        // The block comment covers two lines
        /* hidden
           still hidden */
        System.out.println("after");
    }
}
```

The statement after the block comment still runs.

### Comments do not change the result

The same executable code should print the same result after the comment text changes. The default sample swaps only comments when the UI language changes.

```java run expect="21" title="Addition beside a comment"
public class Main {
    public static void main(String[] args) {
        // Inline block comment
        int left = 19; /* note */
        System.out.println(left + 2);
    }
}
```

The two numbers add, and the comment takes no part.

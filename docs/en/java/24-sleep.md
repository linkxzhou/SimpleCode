---
language: java
chapter: 24
title: "Java Thread Sleep"
level: beginner
minutes: 8
goals:
  - "Sleep between two prints"
  - "Separate tick and tock with a short sleep"
  - "Add after the sleep ends"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Thread.sleep pauses this stretch for a few dozen milliseconds. main returns to the browser first, and the later println appears after the pause.

### Print, pause, then print

before appears at once. sleep of 40 pauses for 40 milliseconds, and only then after prints. Both lines remain.

```java run expect="after" title="After the pause"
public class Main {
    public static void main(String[] args) throws Exception {
        // Pause in the middle
        System.out.println("before");
        Thread.sleep(40);
        System.out.println("after");
    }
}
```

The expected text includes after.

### Even a tiny pause waits

tick is before the pause and tock is after it. sleep of 1 is only one millisecond, and the second line still follows the first.

```java run expect="tock" title="Short pause"
public class Main {
    public static void main(String[] args) throws Exception {
        // One millisecond still uses the timer
        System.out.println("tick");
        Thread.sleep(1);
        System.out.println("tock");
    }
}
```

tock means the pause has finished.

### Do the arithmetic after waking

The sum of 3 and 4 is computed only after sleep of 20 ends. The addition does not depend on the pause; it is simply placed after it.

```java run expect="7" title="Add after sleep"
public class Main {
    public static void main(String[] args) throws Exception {
        // Add after waking
        Thread.sleep(20);
        System.out.println(3 + 4);
    }
}
```

The sum is 7.

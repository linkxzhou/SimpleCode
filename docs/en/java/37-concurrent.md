---
language: java
chapter: 37
title: "Java Concurrent Utilities"
level: advanced
minutes: 11
goals:
  - "Add with AtomicInteger"
  - "Run a short task list on the current thread"
  - "See that CountDownLatch is not in this class library"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

java.util.concurrent is incomplete in this class library. AtomicInteger can run. CountDownLatch has no matching class, so that block is for reading only. The queue you can actually watch runs one task after another inside main.

### Add 5 atomically

AtomicInteger starts at 2, and addAndGet(5) hands back the value after the add. Only one thread adds here, and the print is 7.

```java run expect="7" title="Atomic add"
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) {
        AtomicInteger n = new AtomicInteger(2);
        System.out.println(n.addAndGet(5));
    }
}
```

After the add, the value is 7.

### Tasks sit in one line

Two Runnable values sit in an array, and main calls run on each. This is not a thread pool. It only lines the work up. Add 1 and then 10, and the result is 11.

```java run expect="11" title="Run in order"
public class Main {
    public static void main(String[] args) {
        final int[] box = new int[] { 0 };
        Runnable[] tasks = new Runnable[] {
            new Runnable() { public void run() { box[0] += 1; } },
            new Runnable() { public void run() { box[0] += 10; } },
        };
        for (Runnable task : tasks) task.run();
        System.out.println(box[0]);
    }
}
```

After the queue, the value is 11.

### CountDownLatch cannot be compiled in

This class library has no CountDownLatch. If the import below ran, javac would say it cannot find the symbol. It stays as reading, so you remember that a full JDK has this latch.

```java norun title="No latch"
import java.util.concurrent.CountDownLatch;

public class Main {
    public static void main(String[] args) throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        latch.countDown();
        latch.await();
        System.out.println("open");
    }
}
```

This block is for reading only.

### Exercise: two addAndGet calls

Start at 0, add 4, then add 6. The value returned by the second addAndGet should be 10.

```java run expect="10" title="Two atomic adds"
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) {
        AtomicInteger n = new AtomicInteger(0);
        n.addAndGet(4);
        System.out.println(n.addAndGet(6));
    }
}
```

The second call hands back 10.

### License note for the advanced repository

Adapting concurrency prose from doocs/advanced-java would keep CC-BY-SA-4.0 on the derivative text. This chapter does not do that: <https://github.com/doocs/advanced-java>.

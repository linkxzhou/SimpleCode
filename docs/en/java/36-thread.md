---
language: java
chapter: 36
title: "Java Threads"
level: advanced
minutes: 11
goals:
  - "Start one thread and join it"
  - "Let two threads write an array in order"
  - "Remember these are not operating-system threads"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Thread.start queues run on the TeaVM timers. If main calls join, it waits until that piece has written before printing further. This is not multicore parallelism. Both tasks still sit on one event loop.

### After join the read is 7

The worker writes 7 into slot 0 of the array. After join returns, main prints that slot, so you see 7 rather than the 0 that was there before the write.

```java run expect="7" title="Wait for the write"
public class Main {
    public static void main(String[] args) throws Exception {
        final int[] box = new int[] { 0 };
        Thread worker = new Thread(new Runnable() {
            public void run() {
                box[0] = 7;
            }
        });
        worker.start();
        worker.join();
        System.out.println(box[0]);
    }
}
```

The value read is 7.

### Parent prints before the child

start only queues the work. The println that follows in main prints parent first, and the child's child comes after. join makes sure both lines remain.

```java run expect="parent" title="Parent first"
public class Main {
    public static void main(String[] args) throws Exception {
        Thread worker = new Thread(new Runnable() {
            public void run() {
                System.out.println("child");
            }
        });
        worker.start();
        System.out.println("parent");
        worker.join();
    }
}
```

The earlier line is parent.

### Add two writes

The first thread writes 2 and join returns before the second thread writes 5. Starting both and only then joining can end the run on this host before the sum is printed, so the sample finishes one thread before it starts the next. The sum is still 7.

```java run expect="7" title="Add both writes"
public class Main {
    public static void main(String[] args) throws Exception {
        final int[] box = new int[] { 0, 0 };
        Thread left = new Thread(new Runnable() {
            public void run() { box[0] = 2; }
        });
        Thread right = new Thread(new Runnable() {
            public void run() { box[1] = 5; }
        });
        left.start();
        left.join();
        right.start();
        right.join();
        System.out.println(box[0] + box[1]);
    }
}
```

The two slots sum to 7.

### Exercise: double a number inside the thread

The slot starts at 6. The thread multiplies it by 2. After join, the print should be 12.

```java run expect="12" title="Double"
public class Main {
    public static void main(String[] args) throws Exception {
        final int[] box = new int[] { 6 };
        Thread worker = new Thread(new Runnable() {
            public void run() { box[0] = box[0] * 2; }
        });
        worker.start();
        worker.join();
        System.out.println(box[0]);
    }
}
```

After doubling, the value is 12.

### The concurrency notes are only a link

The concurrency pages in advanced-java are CC-BY-SA-4.0. This chapter does not carry those paragraphs over: <https://github.com/doocs/advanced-java>.

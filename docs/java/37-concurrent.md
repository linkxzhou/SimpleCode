---
language: java
chapter: 37
title: "Java 并发工具"
level: advanced
minutes: 11
goals:
  - "用 AtomicInteger 做加法"
  - "在当前线程上跑一小串任务"
  - "知道 CountDownLatch 不在这份类库里"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

java.util.concurrent 在这份类库里不完整。AtomicInteger 可以跑。CountDownLatch 没有对应的类，下面那段只供阅读。能演示的队列就在 main 里依次执行。

### 原子加 5

AtomicInteger 从 2 开始，addAndGet(5) 交回加完的值。这里只有一条线程在加，打印 7。

```java run expect="7" title="原子加"
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) {
        AtomicInteger n = new AtomicInteger(2);
        System.out.println(n.addAndGet(5));
    }
}
```

加完是 7。

### 任务排成一列

两个 Runnable 放进数组，main 逐个 run。这不是线程池，只是把要做的事排好。先加 1 再加 10，结果是 11。

```java run expect="11" title="依次执行"
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

排完是 11。

### CountDownLatch 不能编译进来

类库里没有 CountDownLatch。下面的 import 如果运行，javac 会说找不到符号。它留在阅读里，用来记住完整 JDK 里有这种门闩。

```java norun title="没有门闩"
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

这段只供阅读。

### 练习：两次 addAndGet

从 0 开始先加 4 再加 6。第二次 addAndGet 的返回值应是 10。

```java run expect="10" title="两次原子加"
import java.util.concurrent.atomic.AtomicInteger;

public class Main {
    public static void main(String[] args) {
        AtomicInteger n = new AtomicInteger(0);
        n.addAndGet(4);
        System.out.println(n.addAndGet(6));
    }
}
```

第二次交回 10。

### 进阶仓库的协议说明

若改编 doocs/advanced-java 的并发原文，衍生文字需保持 CC-BY-SA-4.0。本章没有这样做：<https://github.com/doocs/advanced-java> 。

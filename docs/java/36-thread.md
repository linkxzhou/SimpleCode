---
language: java
chapter: 36
title: "Java 线程基础"
level: advanced
minutes: 11
goals:
  - "启动一条线程并 join"
  - "让两条线程按顺序写数组"
  - "知道这里不是操作系统线程"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Thread.start 会把 run 排进 TeaVM 的计时器。main 里如果 join，就会等到那一段写完再往下打印。这不是多核并行，两条任务仍排在同一条事件循环上。

### join 之后读到 7

工作线程把数组第 0 格写成 7。join 返回以后，main 再打印这一格，所以看得到 7，而不是还没写上的 0。

```java run expect="7" title="等到写完"
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

读到的是 7。

### 先父后子的打印顺序

start 只是排队。main 里紧接着的 println 先打出 parent，子线程的 child 排在后面。join 保证两行都会留下。

```java run expect="parent" title="先打 parent"
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

先出现的是 parent。

### 两段写入相加

第一条线程先把格子写成 2，join 回来以后，第二条再写成 5。两条都 start 完才 join 时，这份宿主可能在和数打印前就把运行收掉，所以例子改成做完一条再做下一条。和仍是 7。

```java run expect="7" title="两段相加"
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

两格之和是 7。

### 练习：线程里把数翻倍

格子里先放 6。线程把它乘 2。join 之后应打印 12。

```java run expect="12" title="翻倍"
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

翻倍后是 12。

### 并发笔记只作链接

advanced-java 的并发篇是 CC-BY-SA-4.0，本章没有搬它的段落：<https://github.com/doocs/advanced-java> 。

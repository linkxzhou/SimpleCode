---
language: java
chapter: 24
title: "Java 线程休眠"
level: beginner
minutes: 8
goals:
  - "在两句打印之间休眠"
  - "用很短的休眠隔开 tick 和 tock"
  - "休眠结束后再做加法"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

Thread.sleep 让当前这段停几十毫秒。main 会先回到浏览器，停够之后再把后面的 println 打出来。

### 先打印再停再打印

before 立刻出现。sleep(40) 停 40 毫秒，然后才打印 after。两行都会留下来。

```java run expect="after" title="停顿之后"
public class Main {
    public static void main(String[] args) throws Exception {
        // 中间停一下
        System.out.println("before");
        Thread.sleep(40);
        System.out.println("after");
    }
}
```

期望里看得到 after。

### 极短停顿也要等完

tick 在休眠前，tock 在休眠后。sleep(1) 虽然只有 1 毫秒，后一句仍然晚于前一句。

```java run expect="tock" title="短暂停"
public class Main {
    public static void main(String[] args) throws Exception {
        // 一毫秒也走计时器
        System.out.println("tick");
        Thread.sleep(1);
        System.out.println("tock");
    }
}
```

tock 说明已经醒了。

### 醒了再做算术

sleep(20) 结束之后才计算 3 加 4。加法本身不依赖休眠，只是排在它后面。

```java run expect="7" title="停完再算"
public class Main {
    public static void main(String[] args) throws Exception {
        // 醒了再相加
        Thread.sleep(20);
        System.out.println(3 + 4);
    }
}
```

和是 7。

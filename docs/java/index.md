---
language: java
chapter: 0
title: "Java 教程"
minutes: 8
goals:
  - "用 println 打出一行"
  - "让 public 类保持 Main"
  - "分清 TeaVM 和完整 JDK"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

这一本只编译编辑器里的 Main.java。浏览器里的编译器是 TeaVM，类库也是它自己的。

### 先打出一行

println 在末尾换行。加号把字符串和整数接到同一行，票窗用它报总数。

```java run expect="Hello from Java 42" title="窗口第一行"
public class Main {
    public static void main(String[] args) {
        // 票窗的第一行
        System.out.println("Hello from Java " + 42);
    }
}
```

终端里应出现这一行总数。

### 类名必须是 Main

源文件名固定是 Main.java。public 类改了名字，javac 会直接拒绝。辅助类不要写成 public。

```java run expect="class Main" title="类名对齐"
public class Main {
    public static void main(String[] args) {
        // 类名与文件名一致
        System.out.println("class Main");
    }
}
```

下面这一行只是把类名打出来。

### 这里不是完整 JDK

os.name 在这份类库上是 TeaVM。打印、集合和短暂停顿能用。磁盘文件和反射放到最后一章，只给阅读。

```java run expect="TeaVM" title="运行时名字"
public class Main {
    public static void main(String[] args) {
        // 读取运行时名字
        System.out.println(System.getProperty("os.name"));
    }
}
```

先确认运行时的名字。

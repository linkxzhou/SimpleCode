---
language: java
chapter: 2
title: "Java 环境设置"
level: beginner
minutes: 8
goals:
  - "知道工具链何时下载"
  - "看进度条的位置"
  - "不要去找本机 javac"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

选中侧栏的 Java 之后，浏览器才去取 TeaVM 的四份文件。本机不需要安装 JDK。

### 第一次才会下载

四份文件合计约 6.6 MB，放在同源的 wasm/java。teavm.org 没有 CORS，页面不会直接去那里取。

```java run expect="toolchain ready" title="工具链问候"
public class Main {
    public static void main(String[] args) {
        // 工具链就绪后的问候
        System.out.println("toolchain ready");
    }
}
```

下载完成后，同一句问候可以反复运行。

### 进度在按钮底边

下载时语言按钮最底下有一条 2 像素的进度。它和按钮同宽，不另起一行。

```java run expect="bar" title="底边进度"
public class Main {
    public static void main(String[] args) {
        // 进度条不影响输出
        System.out.println("bar");
    }
}
```

编过的程序仍从 main 开始。

### 没有本机 javac 命令

终端里看到的诊断来自浏览器里的编译器。不要输入 javac Main.java，那条命令不属于这个练习场。

```java run expect="editor source" title="编辑器源码"
public class Main {
    public static void main(String[] args) {
        // 跑的是编辑器里的源码
        System.out.println("editor source");
    }
}
```

能跑的仍是编辑器里的源码。

---
language: java
chapter: 4
title: "Java 注释"
level: beginner
minutes: 8
goals:
  - "写一行 // 注释"
  - "写一块 /* */ 注释"
  - "确认注释不会被打印"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

注释给读代码的人看。编译器丢掉它们，终端里不会出现注释里的字。

### 双斜杠注释一行

从 // 到行尾都不参与编译。中文书把说明写在这种注释里。

```java run expect="kept" title="单行注释"
public class Main {
    public static void main(String[] args) {
        // 这一行注释不会出现在输出里
        // ignored line
        System.out.println("kept");
    }
}
```

打印的只有注释外面的单词。

### 块注释可以跨行

/* 和 */ 之间的文字同样被丢掉。不要在字符串里误用这个写法来隐藏内容。

```java run expect="after" title="块注释"
public class Main {
    public static void main(String[] args) {
        // 块注释跨了两行
        /* hidden
           still hidden */
        System.out.println("after");
    }
}
```

块注释结束后，下一句仍然执行。

### 注释不改变结果

同一段可执行代码，换掉注释文字，打印结果应保持不变。界面中英切换默认示例时，也只换注释。

```java run expect="21" title="注释旁的加法"
public class Main {
    public static void main(String[] args) {
        // 行内块注释
        int left = 19; /* note */
        System.out.println(left + 2);
    }
}
```

下面两个数相加，注释不参与。

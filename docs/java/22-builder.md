---
language: java
chapter: 22
title: "Java StringBuilder"
level: beginner
minutes: 8
goals:
  - "append 接成 pass"
  - "insert 在中间塞入字符"
  - "用 length 数可变串"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

StringBuilder 可以在原对象上改内容。append 加在末尾，insert 按位置塞进去，length 只数当前字符。

### append 接在末尾

先 append pa，再 append ss。toString 得到的是接好的 pass。

```java run expect="pass" title="追加"
public class Main {
    public static void main(String[] args) {
        // 两次追加
        StringBuilder sb = new StringBuilder();
        sb.append("pa");
        sb.append("ss");
        System.out.println(sb.toString());
    }
}
```

四个字母连在一起。

### insert 插到下标 1

一开始是 ad。insert(1, "x") 把 x 放在 a 和 d 之间，变成 axd。

```java run expect="axd" title="插入"
public class Main {
    public static void main(String[] args) {
        // 中间插入
        StringBuilder sb = new StringBuilder("ad");
        sb.insert(1, "x");
        System.out.println(sb.toString());
    }
}
```

三个字母的新串被打印出来。

### length 只看当前内容

cop 放进构造器之后，length 是 3。它不会把容量当成字符数。

```java run expect="3" title="当前长度"
public class Main {
    public static void main(String[] args) {
        // 三个字母
        StringBuilder sb = new StringBuilder("cop");
        System.out.println(sb.length());
    }
}
```

打印 3。

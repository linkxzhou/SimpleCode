---
language: java
chapter: 8
title: "Java 字符串"
level: beginner
minutes: 8
goals:
  - "读取长度"
  - "截取一段"
  - "转换大小写"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

字符串是对象。长度、截取和大小写都是方法，下标从 0 开始，end 不含在结果里。

### length 按字符计

Hello 有 5 个字符。这里的例子全是 ASCII，一个字符就是一个字节。

```java run expect="5" title="长度"
public class Main {
    public static void main(String[] args) {
        // 五个字符
        String word = "Hello";
        System.out.println(word.length());
    }
}
```

把长度打出来。

### substring 不含结尾

substring(1, 4) 从下标 1 取到下标 3。Hello 得到 ell。

```java run expect="ELL" title="截取"
public class Main {
    public static void main(String[] args) {
        // 截取后转大写
        String word = "Hello";
        System.out.println(word.substring(1, 4).toUpperCase());
    }
}
```

再转成大写就是 ELL。

### 拼接用加号

两个字符串用加号接成一个新字符串。原来的变量不会被改掉。

```java run expect="cop copper" title="拼接"
public class Main {
    public static void main(String[] args) {
        // 原字符串还在
        String left = "cop";
        String both = left + "per";
        System.out.println(left + " " + both);
    }
}
```

先接再打印原来的前半段。

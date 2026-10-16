---
language: java
chapter: 17
title: "Java 异常处理"
level: beginner
minutes: 8
goals:
  - "接住数字格式异常"
  - "让 finally 改写结果"
  - "在解析成功时留下原值"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

try 里的语句一旦抛出异常，就跳进匹配的 catch。finally 无论是否抛出，都会再走一遍。

### 字母不能当成整数

Integer.parseInt 遇到 x 会抛出 NumberFormatException。catch 接住它，打印 bad，而不是让程序停掉。

```java run expect="bad" title="格式异常"
public class Main {
    public static void main(String[] args) {
        // 接住格式错误
        try {
            Integer.parseInt("x");
            System.out.println("ok");
        } catch (NumberFormatException ex) {
            System.out.println("bad");
        }
    }
}
```

成功那句不会执行。

### finally 一定会执行

try 里把 n 改成 2。离开 try 之前 finally 再把 n 改成 3。打印发生在这两步之后。

```java run expect="3" title="finally"
public class Main {
    public static void main(String[] args) {
        // 收尾时改写
        int n = 1;
        try {
            n = 2;
        } finally {
            n = 3;
        }
        System.out.println(n);
    }
}
```

最后留下的是 3。

### 解析成功就不进 catch

字符串 4 可以解析成整数。catch 里的 -1 不会写上去，n 保持 4。

```java run expect="4" title="解析成功"
public class Main {
    public static void main(String[] args) {
        // 正常路径不进 catch
        int n = 0;
        try {
            n = Integer.parseInt("4");
        } catch (NumberFormatException ex) {
            n = -1;
        }
        System.out.println(n);
    }
}
```

打印解析得到的数。

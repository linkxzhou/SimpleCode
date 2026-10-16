---
language: java
chapter: 5
title: "Java 基本数据类型"
level: beginner
minutes: 8
goals:
  - "使用 int 和 double"
  - "把浮点数截成整数"
  - "使用 boolean 和 char"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

常用的基本类型有 int、double、boolean 和 char。这一章每节只看一种转换。

### 整数除法丢掉小数

int 相除只保留商。7 除以 2 得到 3，余数要用百分号另算。

```java run expect="3 1" title="整除"
public class Main {
    public static void main(String[] args) {
        // 商和余数
        System.out.println(7 / 2 + " " + (7 % 2));
    }
}
```

商和余数打在同一行。

### double 截断成 int

把 3.9 转成 int 会丢掉小数，结果是 3，不会四舍五入到 4。

```java run expect="3" title="截断"
public class Main {
    public static void main(String[] args) {
        // 丢掉小数部分
        double price = 3.9;
        System.out.println((int) price);
    }
}
```

强转写在括号里。

### 布尔和字符

比较的结果是 boolean，打印出来是 true 或 false。字符 'A' 转成 int 是 65。

```java run expect="true" title="布尔与字符"
public class Main {
    public static void main(String[] args) {
        // 布尔值以及字符编码
        boolean open = 3 > 1;
        System.out.println(open);
        System.out.println((int) 'A');
    }
}
```

两句输出分两行。

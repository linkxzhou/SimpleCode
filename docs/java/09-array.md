---
language: java
chapter: 9
title: "Java 数组"
level: beginner
minutes: 8
goals:
  - "用初始化器建数组"
  - "按下标读取"
  - "用 for-each 求和"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

数组长度在创建时定下。下标从 0 开始，length 是字段，不是方法。

### 初始化器列出元素

花括号里的三个数构成 int 数组。length 就是元素个数。

```java run expect="3" title="数组长度"
public class Main {
    public static void main(String[] args) {
        // 三个票价
        int[] fares = { 4, 15, 23 };
        System.out.println(fares.length);
    }
}
```

打印长度。

### 下标从 0 开始

第一个元素是 fares[0]。越界会在运行时抛出异常，示例停在合法下标。

```java run expect="15" title="按下标"
public class Main {
    public static void main(String[] args) {
        // 第二个元素
        int[] fares = { 4, 15, 23 };
        System.out.println(fares[1]);
    }
}
```

把中间那个数打出来。

### for-each 累加

for (int v : fares) 依次取出每个元素。累加器从 0 加到总和。

```java run expect="42" title="求和"
public class Main {
    public static void main(String[] args) {
        // 遍历求和
        int[] fares = { 4, 15, 23 };
        int sum = 0;
        for (int v : fares) {
            sum = sum + v;
        }
        System.out.println(sum);
    }
}
```

4、15、23 的和是 42。

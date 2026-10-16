---
language: java
chapter: 12
title: "Java 循环结构"
level: beginner
minutes: 8
goals:
  - "用 while 累加"
  - "用 for 计数"
  - "用 break 提前离开"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

循环重复一段语句。while 先判断再执行，for 把计数器写在括号里，break 立刻离开。

### while 先判断

n 从 1 加到 4。条件失败时循环停止，sum 已是 10。

```java run expect="10" title="while 求和"
public class Main {
    public static void main(String[] args) {
        // 加到 4
        int n = 1;
        int sum = 0;
        while (n <= 4) {
            sum = sum + n;
            n = n + 1;
        }
        System.out.println(sum);
    }
}
```

记得在循环里改变 n，否则停不下来。

### for 把三件事放一起

初始化、条件和更新写在同一对括号里。i 从 0 到 2，累加三个票价。

```java run expect="42" title="for 计数"
public class Main {
    public static void main(String[] args) {
        // 按下标遍历
        int[] fares = { 4, 15, 23 };
        int sum = 0;
        for (int i = 0; i < fares.length; i = i + 1) {
            sum = sum + fares[i];
        }
        System.out.println(sum);
    }
}
```

结果仍是 42。

### break 提前结束

循环里一旦 sum 达到 6 就 break。后面的数不再加入。

```java run expect="6" title="提前离开"
public class Main {
    public static void main(String[] args) {
        // 够了就离开
        int sum = 0;
        for (int n = 1; n <= 9; n = n + 1) {
            sum = sum + n;
            if (sum >= 6) {
                break;
            }
        }
        System.out.println(sum);
    }
}
```

1 加 2 加 3 之后停住。

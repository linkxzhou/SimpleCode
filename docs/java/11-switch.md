---
language: java
chapter: 11
title: "Java switch 语句"
level: beginner
minutes: 8
goals:
  - "按整数分支"
  - "记得 break"
  - "给字符串一个 default"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

switch 用一个值挑选 case。漏掉 break 会继续执行后面的 case，示例都写上 break。

### 整数 case

case 后面是常量。匹配到 2 就打印 bee，然后 break 离开。

```java run expect="bee" title="整数分支"
public class Main {
    public static void main(String[] args) {
        // 匹配第二车道
        int lane = 2;
        switch (lane) {
            case 1:
                System.out.println("a");
                break;
            case 2:
                System.out.println("bee");
                break;
            default:
                System.out.println("c");
        }
    }
}
```

别的数字不会进来。

### default 接住其余

没有任何 case 相等时走 default。把 0 放进来，就会打印 other。

```java run expect="other" title="默认分支"
public class Main {
    public static void main(String[] args) {
        // 没有匹配的 case
        int lane = 0;
        switch (lane) {
            case 1:
                System.out.println("a");
                break;
            default:
                System.out.println("other");
        }
    }
}
```

default 通常写在最后。

### 字符串也可以分支

switch 的表达式可以是字符串。匹配的是内容相等的 case。

```java run expect="B" title="字符串分支"
public class Main {
    public static void main(String[] args) {
        // 按字符串内容匹配
        String code = "b";
        switch (code) {
            case "a":
                System.out.println("A");
                break;
            case "b":
                System.out.println("B");
                break;
            default:
                System.out.println("Z");
        }
    }
}
```

b 打出大写 B。

---
language: java
chapter: 28
title: "Java 泛型"
level: intermediate
minutes: 10
goals:
  - "写一个带着类型参数的盒子"
  - "用通配符接收任意列表"
  - "在方法上单独声明类型参数"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

泛型在编译期记住盒子里应该放什么。TeaVM 的 javac 接受这些写法。运行时取出来的仍是普通对象，打印的是值。

### 盒子交出放进去的词

Box 的类型参数 T 在创建时写成 String。放进 tea，get 交回 tea。辅助类不要写成 public。

```java run expect="tea" title="字符串盒子"
class Box<T> {
    T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

public class Main {
    public static void main(String[] args) {
        Box<String> box = new Box<String>("tea");
        System.out.println(box.get());
    }
}
```

交回的词是 tea。

### 通配符只问长度

List<?> 表示列表里有某种元素，但这个方法不取出元素，只问 size。放进一个 tea，长度是 1。

```java run expect="1" title="只问长度"
import java.util.ArrayList;
import java.util.List;

public class Main {
    static int len(List<?> xs) { return xs.size(); }
    public static void main(String[] args) {
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("tea");
        System.out.println(len(xs));
    }
}
```

长度是 1。

### 方法自己的类型参数

echo 在方法上声明 T，调用时由实参推断。传入 4，打印 4。不需要在类名上写类型参数。

```java run expect="4" title="方法上的 T"
public class Main {
    static <T> T echo(T value) { return value; }
    public static void main(String[] args) {
        System.out.println(echo(4));
    }
}
```

原样打出 4。

### 练习：两个盒子相加

两个 Box<Integer> 分别放 3 和 5。取出后相加，应打印 8。

```java run expect="8" title="两盒相加"
class Box<T> {
    T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

public class Main {
    public static void main(String[] args) {
        Box<Integer> left = new Box<Integer>(3);
        Box<Integer> right = new Box<Integer>(5);
        System.out.println(left.get() + right.get());
    }
}
```

和是 8。

### 版权书只作大纲

《Java核心技术》卷 I 可以对照泛型在书里的位置，句子和例子不搬：<https://book.douban.com/subject/35920145> 。本章程序是另写的，主题也参考了 JavaGuide（Apache-2.0）。

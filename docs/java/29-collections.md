---
language: java
chapter: 29
title: "Java 集合框架"
level: intermediate
minutes: 11
goals:
  - "用 HashSet 去掉重复"
  - "用 LinkedList 从队首拿走"
  - "用 HashMap 按名字累计"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

集合框架把列表、集合和映射分成几种接口。这里能跑的是 ArrayList、LinkedList、HashSet 和 HashMap。TreeSet 不在这份类库的公开名字里，所以不用它。

### 重复的 tea 只计一次

HashSet 不保留重复元素。两次 add tea，size 仍是 1。顺序不稳定，所以只打印个数。

```java run expect="1" title="集合去重"
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> bag = new HashSet<String>();
        bag.add("tea");
        bag.add("tea");
        System.out.println(bag.size());
    }
}
```

个数是 1。

### 链表从左边弹出

LinkedList 可以当队列。先放 tea 再放 cup，removeFirst 拿走 tea。

```java run expect="tea" title="队首"
import java.util.LinkedList;

public class Main {
    public static void main(String[] args) {
        LinkedList<String> line = new LinkedList<String>();
        line.add("tea");
        line.add("cup");
        System.out.println(line.removeFirst());
    }
}
```

先出来的是 tea。

### 映射累计次数

HashMap 的键是名字，值是次数。tea 出现两次，get 得到 2。没有这个键时 get 会是 null，所以先放 0 再加。

```java run expect="2" title="茶的次数"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> bag = new HashMap<String, Integer>();
        String[] words = new String[] { "tea", "cup", "tea" };
        for (String word : words) {
            int n = bag.containsKey(word) ? bag.get(word) : 0;
            bag.put(word, n + 1);
        }
        System.out.println(bag.get("tea"));
    }
}
```

tea 的次数是 2。

### 练习：ArrayList 的最后一个

依次放入 oak、elm、ash。最后一项的下标是 size 减 1，应打印 ash。

```java run expect="ash" title="最后一棵"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> trees = new ArrayList<String>();
        trees.add("oak");
        trees.add("elm");
        trees.add("ash");
        System.out.println(trees.get(trees.size() - 1));
    }
}
```

最后一棵是 ash。

### Effective Java 不搬条目

《Effective Java》第 3 版有集合相关的条目，只作延伸阅读：<https://book.douban.com/subject/30412517> 。

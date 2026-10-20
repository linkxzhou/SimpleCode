---
language: java
chapter: 30
title: "Java Iterator 与 Comparable"
level: intermediate
minutes: 10
goals:
  - "用 Iterator 取出第一项"
  - "用 Comparable 决定排序"
  - "排序后看最小的名字"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Iterator 把往后走的动作收成 hasNext 和 next。Comparable 让对象自己回答谁更小。Collections.sort 会调用 compareTo。

### 迭代器的第一项

列表里先放 mint 再放 bean。iterator 的第一次 next 是 mint。这里不再用 get 按下标取。

```java run expect="mint" title="第一项"
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("mint");
        xs.add("bean");
        Iterator<String> it = xs.iterator();
        System.out.println(it.next());
    }
}
```

第一项是 mint。

### 走完才停

hasNext 为真才 next。两棵树都走完，计数是 2。这样不会在尽头再要一项。

```java run expect="2" title="数两步"
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("oak");
        xs.add("elm");
        int n = 0;
        Iterator<String> it = xs.iterator();
        while (it.hasNext()) {
            it.next();
            n += 1;
        }
        System.out.println(n);
    }
}
```

步数是 2。

### 按行号排序

Seat 实现 Comparable，compareTo 用行号相减。bo 在第 3 行，ada 在第 1 行。排序后第一项的名字是 ada。

```java run expect="ada" title="行号最小"
import java.util.ArrayList;
import java.util.Collections;

class Seat implements Comparable<Seat> {
    String name;
    int row;
    Seat(String name, int row) {
        this.name = name;
        this.row = row;
    }
    public int compareTo(Seat other) {
        return this.row - other.row;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Seat> rows = new ArrayList<Seat>();
        rows.add(new Seat("bo", 3));
        rows.add(new Seat("ada", 1));
        Collections.sort(rows);
        System.out.println(rows.get(0).name);
    }
}
```

排在前面的是 ada。

### 练习：比价格

Tag 按 price 比较。8 和 3 排序后，第一项的名字应是 bun。

```java run expect="bun" title="更便宜"
import java.util.ArrayList;
import java.util.Collections;

class Tag implements Comparable<Tag> {
    String name;
    int price;
    Tag(String name, int price) {
        this.name = name;
        this.price = price;
    }
    public int compareTo(Tag other) {
        return this.price - other.price;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Tag> tags = new ArrayList<Tag>();
        tags.add(new Tag("cake", 8));
        tags.add(new Tag("bun", 3));
        Collections.sort(tags);
        System.out.println(tags.get(0).name);
    }
}
```

更便宜的是 bun。

### doocs 仓库的协议

doocs/advanced-java 是 CC-BY-SA-4.0。本章没有摘录它的段落，若以后改编其中文字，衍生部分要保持同一协议：<https://github.com/doocs/advanced-java> 。

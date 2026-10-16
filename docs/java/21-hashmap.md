---
language: java
chapter: 21
title: "Java HashMap"
level: beginner
minutes: 8
goals:
  - "用同一个键覆盖旧值"
  - "用 containsKey 区分有无"
  - "看两项时的 size"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

HashMap 用键找值。同一个键再 put 一次会换掉旧值，不会变成两条记录。

### 后一次 put 覆盖

键 k 先放 40，再放 42。get("k") 只看到后一次写入的 42。

```java run expect="42" title="覆盖"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // 同键覆盖
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("k", 40);
        map.put("k", 42);
        System.out.println(map.get("k"));
    }
}
```

旧的 40 已经不在。

### containsKey 回答有没有

已经放入的 k 得到 true。从来没放的 z 得到 false。两个答案打在同一行。

```java run expect="true false" title="是否包含"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // 查有和没有
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("k", 1);
        System.out.println(map.containsKey("k") + " " + map.containsKey("z"));
    }
}
```

中间用空格隔开。

### 两个键才是两项

a 和 b 是不同的键，所以 size 是 2。值是多少不影响条数。

```java run expect="2" title="映射条数"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // 两项记录
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("a", 1);
        map.put("b", 2);
        System.out.println(map.size());
    }
}
```

条数单独成行。

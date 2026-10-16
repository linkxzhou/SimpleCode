---
language: java
chapter: 21
title: "Java HashMap"
level: beginner
minutes: 8
goals:
  - "Overwrite a value with the same key"
  - "Tell presence with containsKey"
  - "Read size when two entries exist"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A HashMap finds a value by its key. put with the same key replaces the old value and does not become a second entry.

### The later put replaces

Key k stores 40 first, then 42. get of k sees only the later 42.

```java run expect="42" title="Overwrite"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // Same key, new value
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("k", 40);
        map.put("k", 42);
        System.out.println(map.get("k"));
    }
}
```

The old 40 is already gone.

### containsKey answers whether it is there

A stored k yields true. A z that was never stored yields false. Both answers share one line.

```java run expect="true false" title="Contains or not"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // Ask about a present key and a missing key
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("k", 1);
        System.out.println(map.containsKey("k") + " " + map.containsKey("z"));
    }
}
```

A space separates them.

### Two keys make two entries

a and b are different keys, so size is 2. The stored numbers do not change the count.

```java run expect="2" title="Map size"
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // Two entries
        HashMap<String, Integer> map = new HashMap<String, Integer>();
        map.put("a", 1);
        map.put("b", 2);
        System.out.println(map.size());
    }
}
```

The count is its own line.

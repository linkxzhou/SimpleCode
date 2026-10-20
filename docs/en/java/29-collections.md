---
language: java
chapter: 29
title: "Java Collections"
level: intermediate
minutes: 11
goals:
  - "Drop duplicates with HashSet"
  - "Take the front of a LinkedList"
  - "Tally by name with HashMap"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

The collections framework splits lists, sets, and maps into several interfaces. ArrayList, LinkedList, HashSet, and HashMap run here. TreeSet is not among the public names in this class library, so it is not used.

### Duplicate tea counts once

HashSet does not keep a duplicate element. Two add calls of tea still leave size at 1. Order is not stable, so the sample prints only the count.

```java run expect="1" title="Set dedup"
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

The count is 1.

### A linked list pops from the left

LinkedList can act as a queue. tea goes in first, then cup, and removeFirst takes tea.

```java run expect="tea" title="Front of the queue"
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

The first one out is tea.

### A map tallies counts

HashMap keys are names and values are counts. tea appears twice, so get returns 2. get is null when the key is missing, so the loop stores 0 before adding.

```java run expect="2" title="Tea count"
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

The tea count is 2.

### Exercise: the last ArrayList item

Add oak, elm, and ash in that order. The last index is size minus 1, and it should print ash.

```java run expect="ash" title="Last tree"
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

The last tree is ash.

### Effective Java items are not copied

Effective Java, 3rd edition, has items about collections. They are further reading only: <https://book.douban.com/subject/30412517>.

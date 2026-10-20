---
language: java
chapter: 32
title: "Java Stream"
level: intermediate
minutes: 11
goals:
  - "用 filter 和 mapToInt 求和"
  - "用 count 数出剩下的项"
  - "用 map 改写字符串再找第一项"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Stream 把列表上的几步收成一条管道。源列表本身不被这几步改掉。这份 TeaVM 类库带了 java.util.stream，下面的管道可以运行。

### 偶数相加

1 到 4 里的偶数是 2 和 4。filter 留下它们，mapToInt 变成 int 流，sum 得到 6。

```java run expect="6" title="偶数和"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> xs = Arrays.asList(1, 2, 3, 4);
        int sum = xs.stream().filter(n -> n % 2 == 0).mapToInt(n -> n).sum();
        System.out.println(sum);
    }
}
```

偶数之和是 6。

### 数出长度大于 3 的词

tea 和 cup 长度是 3，cake 是 4。filter 之后 count 是 1。count 返回 long，打印时会是 1。

```java run expect="1" title="较长的词"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("tea", "cake", "cup");
        long n = words.stream().filter(w -> w.length() > 3).count();
        System.out.println(n);
    }
}
```

个数是 1。

### 改成大写再取第一项

map 把每个词收成大写。findFirst 得到 Optional，orElse 在空的时候才用到。第一项是 TEA。

```java run expect="TEA" title="第一项大写"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("tea", "bun");
        String first = words.stream().map(w -> w.toUpperCase()).findFirst().orElse("none");
        System.out.println(first);
    }
}
```

第一项是 TEA。

### 练习：正数的个数

在 -1、4、0、2 里数出大于 0 的个数。应打印 2。

```java run expect="2" title="正数个数"
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> xs = Arrays.asList(-1, 4, 0, 2);
        long n = xs.stream().filter(v -> v > 0).count();
        System.out.println(n);
    }
}
```

正数有 2 个。

### JavaGuide 的集合篇

JavaGuide 用 Apache-2.0 发布，Stream 的讲解放在集合附近。本章管道是另写的：<https://github.com/Snailclimb/JavaGuide> 。

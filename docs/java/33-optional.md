---
language: java
chapter: 33
title: "Java Optional"
level: intermediate
minutes: 10
goals:
  - "用 of 装上一个一定有的值"
  - "用 empty 和 orElse 提供缺省"
  - "用 map 在有值时改写"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Optional 用来显式表示可能没有值，而不是用 null 到处传。这份类库有 java.util.Optional。没有值时用 orElse，不要先 get。

### 一定有的名字

Optional.of 不能接收 null。这里放 Ada，orElse 用不上，打印 Ada。

```java run expect="Ada" title="有值"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> name = Optional.of("Ada");
        System.out.println(name.orElse("none"));
    }
}
```

打印 Ada。

### 空的时候用 none

Optional.empty 表示没有值。orElse 交出 none。这比在空引用上调用方法更直白。

```java run expect="none" title="缺省"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> missing = Optional.empty();
        System.out.println(missing.orElse("none"));
    }
}
```

缺省词是 none。

### 有值才改写

map 在有值时把 tea 收成大写。空 Optional 的 map 仍是空的，这里有值，所以是 TEA。

```java run expect="TEA" title="改写"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> name = Optional.of("tea");
        System.out.println(name.map(w -> w.toUpperCase()).orElse("none"));
    }
}
```

改写后是 TEA。

### 练习：按是否有值选词

ofNullable 可以接收 null。传入 null 时 orElse 应给出 guest。

```java run expect="guest" title="空则客人"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        String raw = null;
        System.out.println(Optional.ofNullable(raw).orElse("guest"));
    }
}
```

缺省是 guest。

### Effective Java 的 Optional 条目

《Effective Java》把 Optional 写成一条建议，正文不搬：<https://book.douban.com/subject/30412517> 。

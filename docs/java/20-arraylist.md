---
language: java
chapter: 20
title: "Java ArrayList"
level: beginner
minutes: 8
goals:
  - "add 之后看 size"
  - "用 get 取下标 1"
  - "remove 掉下标 0"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

ArrayList 的长度会随 add 和 remove 变化。下标仍然从 0 开始，get 和 remove 都按下标工作。

### add 两次再看长度

先放入 a，再放入 b。size 返回当前元素个数，这里是 2。

```java run expect="2" title="列表长度"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // 两名乘客入列
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("a");
        xs.add("b");
        System.out.println(xs.size());
    }
}
```

长度打成一行。

### get 按下标取

下标 0 是 a，下标 1 是 b。get(1) 取的是后放进去的那个。

```java run expect="b" title="按下标取"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // 取第二个
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("a");
        xs.add("b");
        System.out.println(xs.get(1));
    }
}
```

打印 b。

### remove 按下标删除

remove(0) 删掉 a，后面的 b 挪到下标 0。再 get(0) 就是 b。

```java run expect="b" title="删除之后"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // 删掉头一个
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("a");
        xs.add("b");
        xs.remove(0);
        System.out.println(xs.get(0));
    }
}
```

剩下的名字是 b。

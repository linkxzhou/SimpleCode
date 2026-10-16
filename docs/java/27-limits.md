---
language: java
chapter: 27
title: "Java 在这个练习场的限制"
level: beginner
minutes: 8
goals:
  - "知道文件例子只供阅读"
  - "知道反射例子只供阅读"
  - "确认打印和列表仍然能跑"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

前面各章用到的打印、集合、休眠和标准输入可以运行。磁盘文件和反射在这份 TeaVM 类库上不可靠，那两段只供阅读。

### 文件不会真的出现

new File 不会在浏览器里创建 a.txt。exists 即使能调用，也不能当成磁盘上有这个文件。这段标成仅供阅读。

```java norun title="文件只读"
import java.io.File;

public class Main {
    public static void main(String[] args) {
        // 仅供阅读，不会创建文件
        System.out.println(new File("a.txt").exists());
    }
}
```

不要根据它判断练习场有文件系统。

### 反射不可用

Class.forName 在这份类库上会失败。下面的代码展示写法，运行按钮不会执行它。

```java norun title="反射只读"
public class Main {
    public static void main(String[] args) {
        // 仅供阅读的反射
        System.out.println(Class.forName("Main"));
    }
}
```

不要把类名字符串当成可加载的类。

### 打印仍然可用

限制落在文件和反射上。普通的 println 还是从 main 打到终端。

```java run expect="still prints" title="仍能打印"
public class Main {
    public static void main(String[] args) {
        // 普通输出不受影响
        System.out.println("still prints");
    }
}
```

这一行证明输出还在。

### 列表也还在

ArrayList 属于前面用过的集合。放入 ok 再取下标 0，说明这一章不是整章都不能跑。

```java run expect="ok" title="列表仍在"
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // 列表仍可运行
        ArrayList<String> xs = new ArrayList<String>();
        xs.add("ok");
        System.out.println(xs.get(0));
    }
}
```

取出来的单词是 ok。

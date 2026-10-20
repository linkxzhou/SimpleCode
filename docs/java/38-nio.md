---
language: java
chapter: 38
title: "Java 文件与内存缓冲"
level: advanced
minutes: 11
goals:
  - "知道 java.nio 不拿来当磁盘"
  - "用字符串按行切开"
  - "用字节数组模拟一小段缓冲"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

第 27 章说过，这份练习场没有真正的磁盘文件。java.nio.file 和 java.io.File 不再放进可运行块。下面用字符串和字节数组演示读一行、数字节。

### Files 留在阅读里

Path 和 Files 在完整 JDK 里用来问磁盘。这里就算类名还在，也不把它们当成可运行例子。下面这段不会点 Run。

```java norun title="不读磁盘"
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println(Files.exists(Path.of("a.txt")));
    }
}
```

这段只供阅读。

### 字符串里的两行

text 里用换行隔开 tea 和 cup，末尾不再多一个换行。split 之后长度是 2。这就是内存里的按行读。

```java run expect="2" title="两行"
public class Main {
    public static void main(String[] args) {
        String text = "tea\ncup";
        String[] lines = text.split("\n");
        System.out.println(lines.length);
    }
}
```

行数是 2。

### 字节缓冲的长度

getBytes 会把 ByteBuffer 编进来，这份 Wasm GC 不接受那个方法。这里改用 int 数组记下每个字符的编码，tea 仍然是 3 格。这不是 FileChannel。

```java run expect="3" title="三个字节"
public class Main {
    public static void main(String[] args) {
        String word = "tea";
        int[] codes = new int[word.length()];
        for (int i = 0; i < word.length(); i++) codes[i] = word.charAt(i);
        System.out.println(codes.length);
    }
}
```

字节数是 3。

### 练习：拼回一行

两行 tea 和 cup 用竖线拼回去，应打印 tea|cup。循环自己加分隔符，避免依赖没把握的库方法。

```java run expect="tea|cup" title="拼行"
public class Main {
    public static void main(String[] args) {
        String[] lines = new String[] { "tea", "cup" };
        String out = "";
        for (int i = 0; i < lines.length; i++) {
            if (i > 0) out = out + "|";
            out = out + lines[i];
        }
        System.out.println(out);
    }
}
```

拼出来是 tea|cup。

### NIO 的书只作目录

《Java核心技术》的 NIO 章假设有文件系统。这里对不上，只留书目链接：<https://book.douban.com/subject/35920145> 。

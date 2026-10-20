---
language: java
chapter: 38
title: "Java Files and an In-Memory Buffer"
level: advanced
minutes: 11
goals:
  - "Leave java.nio out of the runnable samples"
  - "Split a string into lines"
  - "Simulate a short buffer with a byte array"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Chapter 27 already said this playground has no real disk files. java.nio.file and java.io.File stay out of the runnable blocks. Strings and byte arrays below stand in for reading a line and counting bytes.

### Files stays unread

Path and Files ask the disk on a full JDK. Even if some of those names exist here, they are not runnable samples. The next block is not run.

```java norun title="Do not read the disk"
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println(Files.exists(Path.of("a.txt")));
    }
}
```

This block is for reading only.

### Two lines inside a string

text separates tea and cup with a newline and does not add an extra newline at the end. After split, the length is 2. That is a line read kept in memory.

```java run expect="2" title="Two lines"
public class Main {
    public static void main(String[] args) {
        String text = "tea\ncup";
        String[] lines = text.split("\n");
        System.out.println(lines.length);
    }
}
```

The line count is 2.

### The length of a byte buffer

getBytes pulls in ByteBuffer, and this Wasm GC build rejects that method. An int array stores each character code instead, and tea is still 3 slots. This is not a FileChannel.

```java run expect="3" title="Three bytes"
public class Main {
    public static void main(String[] args) {
        String word = "tea";
        int[] codes = new int[word.length()];
        for (int i = 0; i < word.length(); i++) codes[i] = word.charAt(i);
        System.out.println(codes.length);
    }
}
```

The byte count is 3.

### Exercise: join a line back

Join the two lines tea and cup with a bar. The print should be tea|cup. The loop adds the separator itself, so it does not depend on a library method you are unsure about.

```java run expect="tea|cup" title="Join lines"
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

The joined line is tea|cup.

### The NIO book is only an outline

The NIO chapter in Core Java assumes a file system. That does not match this playground, so only the catalog link remains: <https://book.douban.com/subject/35920145>.

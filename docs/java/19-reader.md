---
language: java
chapter: 19
title: "Java 字符流"
level: beginner
minutes: 8
goals:
  - "用 readLine 读一行"
  - "连续读两行再用斜杠接上"
  - "用长度确认读到的字符数"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

BufferedReader 配上 InputStreamReader 也能读 System.in。这里一个字节当成一个字符，输入保持 ASCII。

### readLine 去掉换行

readLine 返回换行之前的内容。前面加上 line 和一个空格，就能看出读到了哪一行。

```java run stdin="Ada\n" expect="line Ada" title="读一行"
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        // 缓冲读入一行
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("line " + in.readLine());
    }
}
```

这一行以 Ada 结尾。

### 两行拼成一段

连续两次 readLine 分别得到 Ada 和 Lee。中间插入斜杠，打印成一行，避免和换行混在期望里。

```java run stdin="Ada\nLee\n" expect="Ada/Lee" title="两行"
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        // 两名旅客
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String a = in.readLine();
        String b = in.readLine();
        System.out.println(a + "/" + b);
    }
}
```

结果是 Ada/Lee。

### 长度按字符计算

cop 有三个字符。readLine 不会把末尾换行算进字符串，所以 length 是 3。

```java run stdin="cop\n" expect="3" title="行长度"
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws Exception {
        // 不算换行符
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        System.out.println(in.readLine().length());
    }
}
```

数字 3 单独成行。

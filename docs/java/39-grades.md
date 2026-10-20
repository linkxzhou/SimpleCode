---
language: java
chapter: 39
title: "Java 成绩小项目"
level: advanced
minutes: 12
goals:
  - "把成绩放进列表"
  - "数出及格人数"
  - "算出平均分的整数部分"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

成绩放在同一个文件的列表里。没有数据库，也没有文件。及格线是 60。平均分只取整数除法的商，避免把格式化库编进来。

### 两条成绩的及格人数

Ada 是 90，Bo 是 40。只有 Ada 不低于 60，及格人数是 1。

```java run expect="1" title="及格人数"
import java.util.ArrayList;

class Grade {
    String name;
    int points;
    Grade(String name, int points) {
        this.name = name;
        this.points = points;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Grade> rows = new ArrayList<Grade>();
        rows.add(new Grade("Ada", 90));
        rows.add(new Grade("Bo", 40));
        int pass = 0;
        for (Grade row : rows) {
            if (row.points >= 60) pass += 1;
        }
        System.out.println(pass);
    }
}
```

及格人数是 1。

### 平均分的整数部分

90 和 70 的和是 160，两条相除的整数商是 80。先加总再除以 size。

```java run expect="80" title="平均分"
import java.util.ArrayList;

class Grade {
    int points;
    Grade(int points) { this.points = points; }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Grade> rows = new ArrayList<Grade>();
        rows.add(new Grade(90));
        rows.add(new Grade(70));
        int sum = 0;
        for (Grade row : rows) sum += row.points;
        System.out.println(sum / rows.size());
    }
}
```

整数平均是 80。

### 找出最高分的名字

从 Ada 91 和 Bo 88 里留下更高的那条。名字应是 Ada。比较发生在循环里，不用排序库。

```java run expect="Ada" title="最高分"
import java.util.ArrayList;

class Grade {
    String name;
    int points;
    Grade(String name, int points) {
        this.name = name;
        this.points = points;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Grade> rows = new ArrayList<Grade>();
        rows.add(new Grade("Ada", 91));
        rows.add(new Grade("Bo", 88));
        Grade best = rows.get(0);
        for (Grade row : rows) {
            if (row.points > best.points) best = row;
        }
        System.out.println(best.name);
    }
}
```

最高分的名字是 Ada。

### 练习：不及格的名字

三条成绩里只有 Bo 低于 60。把第一个不及格的名字打出来，应是 Bo。

```java run expect="Bo" title="不及格"
import java.util.ArrayList;

class Grade {
    String name;
    int points;
    Grade(String name, int points) {
        this.name = name;
        this.points = points;
    }
}

public class Main {
    public static void main(String[] args) {
        ArrayList<Grade> rows = new ArrayList<Grade>();
        rows.add(new Grade("Ada", 90));
        rows.add(new Grade("Bo", 40));
        rows.add(new Grade("Cy", 70));
        String fail = "none";
        for (Grade row : rows) {
            if (row.points < 60) { fail = row.name; break; }
        }
        System.out.println(fail);
    }
}
```

不及格的是 Bo。

### 小项目不来自某一本书的原题

成绩表在很多 Java 书里都有，这里的字段和打印是按练习场重写的。《Effective Java》仍只作链接：<https://book.douban.com/subject/30412517> 。

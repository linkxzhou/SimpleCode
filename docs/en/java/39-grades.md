---
language: java
chapter: 39
title: "Java Grade Book"
level: advanced
minutes: 12
goals:
  - "Store grades in a list"
  - "Count how many passed"
  - "Compute the integer part of the average"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Grades live in a list in the same file. There is no database and no file. The pass line is 60. The average keeps the quotient of integer division, so the formatting library stays out of the program.

### How many of two grades passed

Ada scored 90 and Bo scored 40. Only Ada is at least 60, so the pass count is 1.

```java run expect="1" title="Pass count"
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

The pass count is 1.

### The integer part of the average

90 plus 70 is 160, and the integer quotient of two rows is 80. Add first, then divide by size.

```java run expect="80" title="Average"
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

The integer average is 80.

### Find the name with the top score

From Ada 91 and Bo 88, keep the higher row. The name should be Ada. The comparison happens in the loop, without a sort library.

```java run expect="Ada" title="Top score"
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

The top name is Ada.

### Exercise: the name that failed

Of three grades, only Bo is below 60. Print the first failing name. It should be Bo.

```java run expect="Bo" title="Did not pass"
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

The failing name is Bo.

### The project is not a copied exercise

Grade tables show up in many Java books. The fields and prints here were rewritten for this playground. Effective Java remains only a link: <https://book.douban.com/subject/30412517>.

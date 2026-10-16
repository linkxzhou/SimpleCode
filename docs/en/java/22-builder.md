---
language: java
chapter: 22
title: "Java StringBuilder"
level: beginner
minutes: 8
goals:
  - "append into pass"
  - "insert a character in the middle"
  - "Count a builder with length"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A StringBuilder can change its contents on the same object. append adds at the end, insert puts text at an index, and length counts the current characters.

### append adds at the end

append pa first, then append ss. toString yields the joined pass.

```java run expect="pass" title="Append"
public class Main {
    public static void main(String[] args) {
        // Two appends
        StringBuilder sb = new StringBuilder();
        sb.append("pa");
        sb.append("ss");
        System.out.println(sb.toString());
    }
}
```

The four letters stay together.

### insert at index 1

The builder starts as ad. insert at 1 of x places x between a and d, which makes axd.

```java run expect="axd" title="Insert"
public class Main {
    public static void main(String[] args) {
        // Insert in the middle
        StringBuilder sb = new StringBuilder("ad");
        sb.insert(1, "x");
        System.out.println(sb.toString());
    }
}
```

The new three-letter string is printed.

### length looks at the current contents

After cop is passed to the constructor, length is 3. It does not treat capacity as the character count.

```java run expect="3" title="Current length"
public class Main {
    public static void main(String[] args) {
        // Three letters
        StringBuilder sb = new StringBuilder("cop");
        System.out.println(sb.length());
    }
}
```

Print 3.

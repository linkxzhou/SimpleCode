---
language: java
chapter: 15
title: "Java Inheritance"
level: beginner
minutes: 8
goals:
  - "Take a parent field with extends"
  - "Call the parent method with super"
  - "Override get in the child"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

A child class follows the parent with extends. The parent field remains. A method can stay as it is, or the child can replace it.

### The child uses the parent field

Lane sets fare to 8. Night only writes extends Lane and declares no field of its own. new Night() can still read fare.

```java run expect="8" title="Inherited field"
class Lane {
    int fare = 8;
}

class Night extends Lane {
}

public class Main {
    public static void main(String[] args) {
        // The night ticket keeps the lane fare
        System.out.println(new Night().fare);
    }
}
```

The value read is the parent's 8.

### super asks the parent first

Base.get returns 2. After Child overrides it, super.get() fetches that 2 and then adds 3.

```java run expect="5" title="super call"
class Base {
    int get() {
        return 2;
    }
}

class Child extends Base {
    int get() {
        return super.get() + 3;
    }
}

public class Main {
    public static void main(String[] args) {
        // Add to the parent result
        System.out.println(new Child().get());
    }
}
```

The child result is 5.

### Override runs the child version

Gift.get returns 1. Box replaces that method and returns 4. The object is a Box, so the call runs the version inside Box.

```java run expect="4" title="Overridden method"
class Gift {
    int get() {
        return 1;
    }
}

class Box extends Gift {
    int get() {
        return 4;
    }
}

public class Main {
    public static void main(String[] args) {
        // The child substitutes its own return
        System.out.println(new Box().get());
    }
}
```

The terminal shows 4, not 1.

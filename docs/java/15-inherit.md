---
language: java
chapter: 15
title: "Java 继承"
level: beginner
minutes: 8
goals:
  - "用 extends 接上父类字段"
  - "用 super 调用父类方法"
  - "在子类里覆盖 get"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

子类用 extends 接在父类后面。父类的字段还在，方法可以原样使用，也可以在子类里换掉。

### 子类直接用父类字段

Lane 把 fare 设成 8。Night 只写 extends Lane，自己不再声明字段。new Night() 仍然读得到 fare。

```java run expect="8" title="继承字段"
class Lane {
    int fare = 8;
}

class Night extends Lane {
}

public class Main {
    public static void main(String[] args) {
        // 夜间票沿用车道票价
        System.out.println(new Night().fare);
    }
}
```

读到的是父类给的 8。

### super 先问父类

Base.get 返回 2。Child 覆盖之后用 super.get() 取回父类的 2，再加 3。

```java run expect="5" title="super 调用"
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
        // 在父类结果上加
        System.out.println(new Child().get());
    }
}
```

子类结果是 5。

### 覆盖后走子类版本

Gift.get 返回 1。Box 用同名方法改成返回 4。变量虽然是子类对象，调用 get 时执行的是 Box 里的版本。

```java run expect="4" title="覆盖方法"
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
        // 子类换成自己的返回值
        System.out.println(new Box().get());
    }
}
```

终端上是 4，不是 1。

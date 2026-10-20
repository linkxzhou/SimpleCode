---
language: java
chapter: 33
title: "Java Optional"
level: intermediate
minutes: 10
goals:
  - "Wrap a present value with of"
  - "Supply a fallback with empty and orElse"
  - "Rewrite with map only when a value is present"
sources:
  - javaguide
  - advanced-java
updated: "2026-10-20"
---

Optional makes a possibly missing value explicit, instead of passing null around. This class library has java.util.Optional. When the value is missing, use orElse. Do not call get first.

### A name that is present

Optional.of cannot receive null. Ada is stored, orElse is not used, and the print is Ada.

```java run expect="Ada" title="Present"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> name = Optional.of("Ada");
        System.out.println(name.orElse("none"));
    }
}
```

The print is Ada.

### Use none when it is empty

Optional.empty means there is no value. orElse hands back none. That is plainer than calling a method on an empty reference.

```java run expect="none" title="Fallback"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> missing = Optional.empty();
        System.out.println(missing.orElse("none"));
    }
}
```

The fallback word is none.

### Rewrite only when a value is present

map uppercases tea when a value is present. map on an empty Optional stays empty. This one has a value, so the result is TEA.

```java run expect="TEA" title="Rewrite"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> name = Optional.of("tea");
        System.out.println(name.map(w -> w.toUpperCase()).orElse("none"));
    }
}
```

After rewriting, the word is TEA.

### Exercise: pick a word from presence

ofNullable may receive null. When null is passed, orElse should supply guest.

```java run expect="guest" title="Guest if null"
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        String raw = null;
        System.out.println(Optional.ofNullable(raw).orElse("guest"));
    }
}
```

The fallback is guest.

### The Effective Java Optional item

Effective Java writes Optional as one item of advice. The text is not copied: <https://book.douban.com/subject/30412517>.

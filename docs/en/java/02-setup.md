---
language: java
chapter: 2
title: "Java Environment Setup"
level: beginner
minutes: 8
goals:
  - "Know when the toolchain downloads"
  - "See where the progress bar sits"
  - "Skip a local javac"
sources:
  - runoob-java
  - oracle-java-tutorial
updated: "2026-10-16"
---

The browser fetches the four TeaVM files only after Java is selected in the sidebar. A local JDK is unnecessary.

### The download happens once

The four files add up to about 6.6 MB and live at the same origin under wasm/java. teavm.org sends no CORS headers, so the page never fetches that host.

```java run expect="toolchain ready" title="Toolchain greeting"
public class Main {
    public static void main(String[] args) {
        // Greeting after the toolchain is ready
        System.out.println("toolchain ready");
    }
}
```

After the download, the same greeting can run again.

### Progress sits on the button edge

While bytes arrive, a 2 pixel bar sits on the bottom edge of the language button. It matches the button width and does not start a new row.

```java run expect="bar" title="Edge progress"
public class Main {
    public static void main(String[] args) {
        // The bar does not change output
        System.out.println("bar");
    }
}
```

A compiled program still starts at main.

### There is no local javac command

Diagnostics in the terminal come from the in-browser compiler. Do not type javac Main.java. That command is outside this playground.

```java run expect="editor source" title="Editor source"
public class Main {
    public static void main(String[] args) {
        // What runs is the editor source
        System.out.println("editor source");
    }
}
```

What runs is still the source in the editor.

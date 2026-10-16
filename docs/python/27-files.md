---
language: python
chapter: 27
title: "Python3 文件"
level: beginner
minutes: 8
goals:
  - "知道本页不写宿主机磁盘"
  - "用 StringIO 在内存里写文本"
  - "按行切开已经放在字符串里的内容"
sources:
  - lxiy-python
updated: "2026-10-15"
---

本机可以用 `open` 写文件。这个解释器不依赖你的磁盘，可运行例子只用内存里的文本。

### open 留在阅读里

真实路径在这里没有保证。不要在可运行例子里创建文件。

```python norun title="不写磁盘"
open("note.txt", "w").write("tea\n")
```

### 内存里的文件

`io.StringIO` 有 `write` 和 `getvalue`，形状接近文件，但不碰路径。

```python run expect="tea" title="写入内存"
import io
buf = io.StringIO()
buf.write("tea\n")
print(buf.getvalue().strip())
```

输出里能看到 `tea`。

### 按行切开

内容已经在字符串里时，`splitlines` 按换行切开，并丢掉换行符本身。

```python run expect="2" title="两行"
text = "tea\nwater\n"
print(len(text.splitlines()))
```

输出里能看到 `2`。

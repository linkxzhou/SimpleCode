---
language: python
chapter: 1
title: "Python3 环境搭建"
level: beginner
minutes: 8
goals:
  - "分清本页运行和本机安装"
  - "知道按钮不会执行 pip"
  - "确认标准库可以直接导入"
sources:
  - lxiy-python
updated: "2026-10-15"
---

本机学习时要安装解释器并设置命令。这个抽屉里解释器已经在。

### 不必再安装

点 Run 就把当前文本交给已经准备好的解释器。没有 `python.org` 的安装向导。

```python run expect="已就绪" title="直接运行"
print("已就绪")
```

输出里能看到 `已就绪`。

### pip 不在按钮里

`pip install` 是终端命令，不是 Python 语句。写进源码也不会去下载包。

```python norun title="这不是源码"
pip install requests
```

### 标准库随解释器提供

`math` 这一类模块不用单独下载。

```python run expect="3" title="向下取整"
import math
print(math.floor(3.9))
```

输出里能看到 `3`。

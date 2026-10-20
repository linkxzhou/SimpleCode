---
language: python
chapter: 0
title: "Python3 教程"
minutes: 8
goals:
  - "知道本页用解释器执行当前这一份源码"
  - "写出第一句 print"
  - "认出文档里夹着的另一种语言"
sources:
  - lxiy-python
updated: "2026-10-15"
---

这一本按语法点分成短节。点 Run 会执行你眼前的这一段 Python，不会打开编辑器以外的工程。

### 第一句输出

程序要自己把结果交出来。`print` 会在末尾补一个换行。

```python run expect="Hi" title="打个招呼"
print("Hi")
```

输出里能看到 `Hi`。

### 网络库不在这一次运行里

解释器没有给你的网络。下面这种导入留在阅读里，按钮不会去连外站。

```python norun title="不要在这里发请求"
import urllib.request
urllib.request.urlopen("https://example.com")
```

### 纯文本不是程序

没有语言标记的围栏只给人看，抽屉不会把它当成 Python。

```text run title="说明文字"
这一段只是说明，不是源码。
```

### 文档里可以夹 Ruby

个别围栏标明了另一种语言。运行时会换成那一门，而不是硬拿 Python 去读。

```ruby run expect="42 from Ruby" title="另一门语言的一行"
puts "42 from Ruby"
```

输出里能看到 `42 from Ruby`。

### 进阶从第 28 章开始

第 28 章到第 39 章接着讲字典推导、迭代器协议、with、dataclass、类型注解、collections、itertools、魔术方法、描述符、协程、测试，以及一段内存里的词频统计。解释器仍是这一份，不另开工程。

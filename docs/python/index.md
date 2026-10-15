---
language: python
chapter: 0
title: "概览：Python 是什么"
minutes: 8
goals:
  - "知道本环境每次运行都是新进程"
  - "分清可运行示例和只读示例"
  - "用运行按钮把代码放进编辑器"
sources:
  - python-tutorial
  - lxiy-python
  - norvig-ten
updated: "2026-10-15"
---

Python 在这里由 CPython 3.11 解释执行。点击代码块上的「运行」，示例会替换主编辑器里的内容，并立刻执行。编辑器原来的草稿会先备份，可以撤销。

每次运行都从空白内存开始：没有网络，写过的文件也不会留到下一次。适合学习语法，不适合安装第三方包。

```text title="纯文本"
这段没有对应的运行时，所以没有运行按钮。
```

```python norun title="不执行"
# 只读示例：本环境没有网络，不要在可运行代码里访问外网。
# import urllib.request
```

```python run expect="你好" title="第一声问候"
print("你好")
```

同一本书里也可以放别的语言。下面这段会切换到 Ruby，并在需要时下载 Ruby 运行时。

```ruby run expect="来自 Ruby 的 42" title="跨语言示例"
puts "来自 Ruby 的 42"
```

## 练习

把问候改成你所在的城市，再运行一次。

::: answer 参考答案：城市问候
```python run expect="你好，杭州" title="参考答案"
print("你好，杭州")
```
:::

## 常见错误

- 把 Python 2 的 print 语句写进来。3.11 里 print 是函数，必须加括号。
- 以为上一次运行的变量还在。每次运行都是新进程。

## 延伸阅读

- [The Python Tutorial](https://docs.python.org/3/tutorial/)（PSF，仅链接）
- [Think Python 3e](https://greenteapress.com/wp/think-python-3rd-edition/)（CC BY-NC-SA，仅链接）
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)（CC BY-NC-SA，仅链接）

## 参考与致谢

正文为原创。示例的知识点范围参考了 Learn X in Y minutes — Python（CC BY-SA 3.0）与 A Byte of Python（CC BY-SA 4.0），没有逐字搬用原文。

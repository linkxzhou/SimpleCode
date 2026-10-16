# 编写 {Language} 快速入门

正文用中文原创撰写，标准在 plan/LEARN.md §18。参考资料只决定可以链接什么，不翻译、不粘贴原文。
`little-go-book` 等 `adapt: false` 的来源只出现在延伸阅读里。

## 每章结构

frontmatter（见 plan/LEARN.md §6）之后是一篇短文，不是固定骨架：

1. 先写这个设计在回避什么，再给会变动的例子。后一个可运行块沿用前一个的名字或数据。
2. 去掉围栏后的汉字不少于 2500。至少 3 个带 `expect` 的可运行块。
3. 坑写在概念旁边。不要再使用每章相同的「常见错误」「最佳实践」标题。
4. 以 `## 小结` 和 `## 练习` 收束。练习至少两道，答案放在 `::: answer` 里，答案代码同样用 `run` + `expect`。
5. `goals` 仍写在 frontmatter 里，由渲染器放在文首。

## 代码块

````markdown
```python run stdin="Ada\n" expect="Hello, Ada!" title="问候"
name = input("Name?")
print(f"Hello, {name}!")
```
````

- 可运行语言默认显示运行按钮；只读块写 `norun`。
- 输出必须稳定：固定随机种子，不打印当前时间、内存地址。
- 单文件、无网络、无第三方包。需要输入时必须给 `stdin`。
- 会停住的示例（死循环）加 `smoke="skip"`，避免冒烟测试挂起。
- 多文件示例不要标成可运行（`file` / `group` 只会提供复制）。

## 提示容器

```markdown
::: note
补充说明。
:::

::: tip
小技巧。
:::

::: warning
运行时限制或容易踩坑的地方。
:::
```

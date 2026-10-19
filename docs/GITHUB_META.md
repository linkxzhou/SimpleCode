# GitHub 仓库元数据（建议）

只提案，不写回 GitHub。不要用 `gh repo edit` 改 description、homepage 或 topics。

数据来源：2026-10-19 用 `gh repo view linkxzhou/SimpleCode` 读到的 About。源码树里没有另一份演示地址。

## Description

下面这一整段（含中文）249 个字符，低于 GitHub 的 350 字上限。

```
In-browser code playground. Python, Rust, Go, Java, Lua, C/C++ and more run locally via WebAssembly and WASI, including an in-browser rustc and javac. No server, no sign-up. Bilingual tutorials and 200 LeetCode problems. 浏览器里的代码运行器：本地 Wasm 执行，无需服务器。
```

当前线上描述是：`In-browser multi-language code runner (Vue 3 + Monaco + WASI/Runno)`。上面那段换成它，搜索里更容易碰到 playground、WASI、LeetCode 和具体语言。

## Homepage

已配置，建议保持：

https://simple-code-liard.vercel.app

2026-10-19 该地址返回 200，`title` 是 SimpleCode。文档响应没有 `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy`，页面靠 `coi-serviceworker.js` 补隔离头。README 里的「在线演示」指向这里。

## Topics

最多 20 个。当前 `repositoryTopics` 为空。

1. webassembly
2. wasi
3. wasm
4. playground
5. code-runner
6. leetcode
7. python
8. rust
9. golang
10. java
11. lua
12. cpp
13. javascript
14. vue
15. monaco-editor
16. typescript
17. compiler
18. education
19. sqlite
20. linux

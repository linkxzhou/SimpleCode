# LeetCode 题库数据

这里不是第十四本快速入门。`scripts/docs/render.ts` 跳过 `leetcode/`，`BOOKS` 也不含它。十三本书的篇幅、ASCII 和 `docs-smoke` 不读这些 JSON。

中文题名、摘要、样例和题解在本目录。英文题名、摘要和样例说明在 `docs/en/leetcode/`，文件名与题号相同。题解只有一份，不复制到英文目录。

题面不入库。每题是自写短摘要、自写小样例，以及 `leetcode.cn` / `leetcode.com` 的链接。摘要中文 40–180 个汉字，英文 30–120 个词。样例输入输出只用 ASCII，规模不超过一百。

题解从 `SOURCES.md` 列出的四个仓库拷贝。每个 `problems/NNNN/*.py` 文件头写仓库、commit、许可证和修改。MIT 全文在 `LICENSES/MIT.txt`。CC BY-SA 4.0 全文在 `LICENSES/CC-BY-SA-4.0.txt`。包装模板在 `harness/`，本身是 MIT，不含上游题解正文。

重新生成：把 pin 住的检出放到 `thirdparty/cache/leetcode`（或 `LEETCODE_SRC`），再运行 `node scripts/leetcode/import.mjs`。`sources.lock.json` 记录检索日和 commit。

这一批是核心题 200 道，只有 Python 题解。其他语言的模板在，文件还没有。

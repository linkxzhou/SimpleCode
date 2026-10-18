# 题单和题解来源

检索日期：2026-10-18。运行时不访问 GitHub。commit 以 `sources.lock.json` 为准。

## 题号

只保存力扣前端题号。不保存题面、官方示例、配图、出现次数、公司或面经。

| 键 | 来源 | commit | 入库 |
|---|---|---|---|
| hot100 | [kernelvale/leetcode-hot100](https://github.com/kernelvale/leetcode-hot100) 的题号文件，用来核对公开的 Top 100 Liked。学习计划页当时返回 403 | `e55875275c6ce2d55141196cb1a025a112f43684` | 100 个题号。不拷贝该仓库的题面和题解 |
| blind75 | [neetcode-gh/leetcode](https://github.com/neetcode-gh/leetcode) `.problemSiteData.json` 的 `blind75` | `d5ebb3ea8bd4b52d605bc7aa179e22af684d31bb` | 75 个题号 |
| neetcode150 | 同一份 JSON 的 `neetcode150` | 同上 | 150 个题号 |
| codetop | [afatcoder/LeetcodeTop](https://github.com/afatcoder/LeetcodeTop)。该仓库没有 SPDX 许可证。README 要求使用频度数据时注明仓库地址 | `7105c17a4d3f61baa242f8a36a7056b5bbd0baf0` | 只抽取题号。不保存出现次数、公司、部门和面经。补充题丢掉 |
| top200 | [hoangcaobao/LeetCode](https://github.com/hoangcaobao/LeetCode) README 表，MIT | `64660b9f3a001aa840ec173ceb0b90dfd2f93b41` | 题号和难度列。不拷贝他的题解 |
| pattern500 | [tiationg-kho/leetcode-pattern-500](https://github.com/tiationg-kho/leetcode-pattern-500) README 表，MIT | `c3ee9ee6e40d386600e0a3545844350a264c5b56` | 题号。笔记和思维导图不拷贝 |

难度和英文题名只取自 NeetCode JSON、top200 README、pattern500 表，按这个顺序。三处都没有的题不进入这一批，也不猜测难度。中文题名只取力扣公开题名。

核心题是 hot100、blind75、neetcode150、top200 的并集，按 `plan/LEETCODE.md` §4.2 收到 200。Blind 75 全部保留。`extended` 这一批没有入库。

## 题解

白名单只有下面四个仓库。同一语言只留一个上游。Python 的顺序按 §7.1：kamyu104，然后 neetcode，然后 pattern-500，然后 doocs。

| 仓库 | commit | 许可证 |
|---|---|---|
| [kamyu104/LeetCode-Solutions](https://github.com/kamyu104/LeetCode-Solutions) | `8e29ccd49e73439f0dc36b6bdd0f3bded259c7b3` | MIT，Copyright (c) 2018 https://github.com/kamyu104/LeetCode-Solutions |
| [neetcode-gh/leetcode](https://github.com/neetcode-gh/leetcode) | `d5ebb3ea8bd4b52d605bc7aa179e22af684d31bb` | MIT，Copyright (c) 2022 neetcode-gh |
| [tiationg-kho/leetcode-pattern-500](https://github.com/tiationg-kho/leetcode-pattern-500) | `c3ee9ee6e40d386600e0a3545844350a264c5b56` | MIT，Copyright (c) 2023 Tiationg Kho |
| [doocs/leetcode](https://github.com/doocs/leetcode) | `88c8c2c29f19c186d7cc05c9db17245d9ae3df43` | CC BY-SA 4.0 |

doocs 的 `solution/*/README.md` 与 `README_EN.md` 不拷贝。`lcof/`、`lcof2/`、`lcci/` 不进入题单，也不进入题解。

本项目著作权归 GitHub 开源社区 Doocs 所有，商业转载请联系 @yanglbme 获得授权，非商业转载请注明出处。

从 doocs 改编的文件保持 CC BY-SA 4.0，不能改标成 MIT。文件头包含许可证 URL、改编仍须使用 CC BY-SA 4.0，以及 `contact@yanglibin.info`。相同方式共享只覆盖这些题解文件，不覆盖界面、运行时和十三本书。

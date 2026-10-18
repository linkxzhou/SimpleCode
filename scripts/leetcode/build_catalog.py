#!/usr/bin/env python3
"""Build docs/leetcode from the pinned upstream checkouts.

The checkout directory (LEETCODE_SRC, default thirdparty/cache/leetcode) must
contain the list sources and the MIT solution trees. import.mjs prepares it.
This script does not download problem statements.
"""

from __future__ import annotations

import ast
import json
import os
import random
import re
import subprocess
import sys
import textwrap
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(os.environ.get("LEETCODE_SRC", ROOT / "thirdparty/cache/leetcode"))
OUT = ROOT / "docs/leetcode"
OUT_EN = ROOT / "docs/en/leetcode"

KAMYU_SHA = "8e29ccd49e73439f0dc36b6bdd0f3bded259c7b3"
NEET_SHA = "d5ebb3ea8bd4b52d605bc7aa179e22af684d31bb"
PAT_SHA = "c3ee9ee6e40d386600e0a3545844350a264c5b56"
DOOCS_SHA = "88c8c2c29f19c186d7cc05c9db17245d9ae3df43"
HOT_SHA = "e55875275c6ce2d55141196cb1a025a112f43684"
TOP_SHA = "64660b9f3a001aa840ec173ceb0b90dfd2f93b41"
CODETOP_SHA = "7105c17a4d3f61baa242f8a36a7056b5bbd0baf0"
RETRIEVED = "2026-10-18"

REPOS = {
    "kamyu104/LeetCode-Solutions": {
        "sha": KAMYU_SHA,
        "license": "MIT",
        "spdx": "MIT",
        "attribution": "Copyright (c) 2018 https://github.com/kamyu104/LeetCode-Solutions",
        "shareAlike": False,
    },
    "neetcode-gh/leetcode": {
        "sha": NEET_SHA,
        "license": "MIT",
        "spdx": "MIT",
        "attribution": "Copyright (c) 2022 neetcode-gh",
        "shareAlike": False,
    },
    "tiationg-kho/leetcode-pattern-500": {
        "sha": PAT_SHA,
        "license": "MIT",
        "spdx": "MIT",
        "attribution": "Copyright (c) 2023 Tiationg Kho",
        "shareAlike": False,
    },
    "doocs/leetcode": {
        "sha": DOOCS_SHA,
        "license": "CC-BY-SA-4.0",
        "spdx": "CC-BY-SA-4.0",
        "attribution": "Copyright Doocs contributors",
        "shareAlike": True,
    },
}

PATTERN_TAGS = {
    "Arrays & Hashing": ["array", "hash"],
    "Two Pointers": ["two-pointers"],
    "Sliding Window": ["sliding-window"],
    "Stack": ["stack"],
    "Binary Search": ["binary-search"],
    "Linked List": ["linked-list"],
    "Trees": ["tree"],
    "Trie": ["design"],
    "Tries": ["design"],
    "Heap / Priority Queue": ["heap"],
    "Backtracking": ["backtracking"],
    "Graphs": ["graph"],
    "Advanced Graphs": ["graph"],
    "1-D DP": ["dp"],
    "2-D DP": ["dp"],
    "Greedy": ["greedy"],
    "Intervals": ["interval"],
    "Math & Geometry": ["math"],
    "Bit Manipulation": ["bit"],
}

TAGS_ZH = {
    "array": "数组",
    "hash": "哈希",
    "two-pointers": "双指针",
    "sliding-window": "滑动窗口",
    "stack": "栈",
    "binary-search": "二分查找",
    "linked-list": "链表",
    "tree": "树",
    "graph": "图",
    "heap": "堆",
    "backtracking": "回溯",
    "dp": "动态规划",
    "greedy": "贪心",
    "interval": "区间",
    "bit": "位运算",
    "math": "数学",
    "design": "设计",
}
TAGS_EN = {
    "array": "Array",
    "hash": "Hash",
    "two-pointers": "Two pointers",
    "sliding-window": "Sliding window",
    "stack": "Stack",
    "binary-search": "Binary search",
    "linked-list": "Linked list",
    "tree": "Tree",
    "graph": "Graph",
    "heap": "Heap",
    "backtracking": "Backtracking",
    "dp": "Dynamic programming",
    "greedy": "Greedy",
    "interval": "Interval",
    "bit": "Bit",
    "math": "Math",
    "design": "Design",
}

# Original command scripts. Numbers are not the samples printed on the problem sites.
DESIGNS = {
    146: ("LRUCache", "2\nput 1 10\nput 2 20\nget 1\nput 3 30\nget 2\nget 3\n"),
    155: ("MinStack", "push 3\npush 1\npush 2\ngetMin\ntop\npop\ngetMin\n"),
    208: ("Trie", "insert solo\nsearch solo\nsearch so\nstartsWith so\nstartsWith s\n"),
    211: ("WordDictionary", "addWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch bad\nsearch .ad\nsearch b..\n"),
    271: ("Codec", "3\nhello\nworld\ncode\n"),
    295: ("MedianFinder", "addNum 2\naddNum 8\nfindMedian\naddNum 4\nfindMedian\n"),
    297: ("Codec", "5\n1 2 3 . 4\n"),
    355: ("Twitter", "postTweet 1 5\ngetNewsFeed 1\nfollow 1 2\npostTweet 2 6\ngetNewsFeed 1\nunfollow 1 2\ngetNewsFeed 1\n"),
    622: ("MyCircularQueue", "3\nenQueue 1\nenQueue 2\nenQueue 3\nenQueue 4\nRear\nisFull\ndeQueue\nenQueue 4\nRear\n"),
    703: ("KthLargest", "3\n4\n4 5 8 2\nadd 3\nadd 5\nadd 10\n"),
    706: ("MyHashMap", "put 1 1\nput 2 2\nget 1\nget 3\nremove 2\nget 2\n"),
    707: ("MyLinkedList", "addAtHead 7\naddAtTail 9\naddAtIndex 1 8\nget 1\ndeleteAtIndex 1\nget 1\n"),
    981: ("TimeMap", "set foo bar 1\nset foo baz 4\nget foo 4\nget foo 3\nget foo 1\n"),
    2013: ("DetectSquares", "add 3 10\nadd 11 2\nadd 3 2\ncount 11 10\ncount 14 8\n"),
    449: ("Codec", "3\n2 1 3\n"),
}


def die(msg: str) -> None:
    print(msg, file=sys.stderr)
    raise SystemExit(1)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def hanzi(text: str) -> int:
    return len(re.findall(r"[\u4e00-\u9fff]", text))


def words(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9']+", text))


def norm_type(raw: str | None) -> str | None:
    if not raw:
        return None
    t = raw.strip().replace("typing.", "").replace("'", "").replace('"', "")
    t = re.sub(r"\s+", "", t)
    t = t.replace("ListNode", "§LN").replace("TreeNode", "§TN")
    t = t.replace("List", "list").replace("Tuple", "list").replace("Dict", "dict").replace("Set", "set")
    t = t.replace("§LN", "ListNode").replace("§TN", "TreeNode")
    aliases = {
        "long": "int",
        "integer": "int",
        "boolean": "bool",
        "string": "str",
        "double": "float",
        "character": "str",
        "void": "none",
        "None": "none",
        "null": "none",
    }
    if t in aliases:
        return aliases[t]
    nullable = False
    m = re.fullmatch(r"Optional\[(.+)\]", t)
    if m:
        t = m.group(1)
        nullable = True
    else:
        m = re.fullmatch(r"Union\[(.+),None\]", t) or re.fullmatch(r"Union\[None,(.+)\]", t)
        if m:
            t = m.group(1)
            nullable = True
    t = re.sub(r"Optional\[([^\[\]]+)\]", r"\1", t)
    if t in aliases:
        t = aliases[t]
    if nullable and not t.endswith("?"):
        t += "?"
    return t


def base_type(t: str) -> str:
    return t[:-1] if t.endswith("?") else t


SUPPORTED = {
    "int",
    "float",
    "bool",
    "str",
    "none",
    "list[int]",
    "list[str]",
    "list[float]",
    "list[bool]",
    "list[list[int]]",
    "list[list[str]]",
    "ListNode",
    "TreeNode",
    "list[ListNode]",
    "Node",
    "NodeGraph",
    "NodeRandom",
    "NodeMulti",
}


def supported(t: str | None) -> bool:
    if not t:
        return False
    return base_type(t) in SUPPORTED


def ann_of(node: ast.AST | None) -> str | None:
    if node is None:
        return None
    try:
        return ast.unparse(node)
    except Exception:
        return None


def docstring_types(fn: ast.FunctionDef) -> tuple[list[tuple[str, str]], str | None]:
    doc = ast.get_docstring(fn) or ""
    params = [(n, t.strip()) for n, t in re.findall(r":type\s+(\w+)\s*:\s*([^\n]+)", doc)]
    ret = re.search(r":rtype:\s*([^\n]+)", doc)
    return params, (ret.group(1).strip() if ret else None)


def slug_camel(slug: str) -> str:
    parts = [p for p in slug.split("-") if p]
    if not parts:
        return slug
    return parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])


def parse_solution(src: str, slug: str) -> tuple[str, list[tuple[str, str]], str] | None:
    try:
        tree = ast.parse(src)
    except SyntaxError:
        return None
    sol = next((n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "Solution"), None)
    if sol is None:
        return None
    methods = [n for n in sol.body if isinstance(n, ast.FunctionDef) and not n.name.startswith("_")]
    if not methods:
        return None
    want = slug_camel(slug)
    primary = [m for m in methods if m.name == want]
    if not primary:
        primary = [m for m in methods if not re.search(r"\d$", m.name)]
    fn = (primary or methods)[0]
    args = [a for a in fn.args.args if a.arg != "self"]
    doc_params, doc_ret = docstring_types(fn)
    doc_map = {n: t for n, t in doc_params}
    params: list[tuple[str, str]] = []
    for a in args:
        raw = ann_of(a.annotation) or doc_map.get(a.arg)
        nt = norm_type(raw)
        if not supported(nt):
            return None
        params.append((a.arg, nt or "int"))
    ret_raw = ann_of(fn.returns) or doc_ret
    ret = norm_type(ret_raw)
    if ret is None or not supported(ret):
        return None
    def shape(typ: str) -> str:
        if base_type(typ) != "Node":
            return typ
        if fn.name == "cloneGraph":
            return "NodeGraph" + ("?" if typ.endswith("?") else "")
        if fn.name == "copyRandomList":
            return "NodeRandom" + ("?" if typ.endswith("?") else "")
        if fn.name == "flatten":
            return "NodeMulti" + ("?" if typ.endswith("?") else "")
        return typ

    params = [(name, shape(typ)) for name, typ in params]
    ret = shape(ret)
    if any(not supported(typ) for _, typ in params) or not supported(ret):
        return None
    return fn.name, params, ret


def defines_class(src: str, name: str) -> bool:
    try:
        tree = ast.parse(src)
    except SyntaxError:
        return False
    return any(isinstance(n, ast.ClassDef) and n.name == name for n in tree.body)


def class_defined(src: str, name: str) -> bool:
    return defines_class(src, name)


def strip_main(src: str) -> str:
    lines = src.splitlines()
    out: list[str] = []
    skipping = False
    for line in lines:
        if re.match(r"""if __name__\s*==\s*['\"]__main__['\"]\s*:""", line):
            skipping = True
            continue
        if skipping:
            if line.startswith((" ", "\t")) or line.strip() == "":
                continue
            skipping = False
        out.append(line)
    return "\n".join(out).rstrip() + "\n"


def clean_source(src: str) -> tuple[str, list[str]]:
    notes: list[str] = []
    src = strip_main(src)
    src = re.sub(r"(?m)^from __future__ import .*\n", "", src)

    def repl_doc(m: re.Match[str]) -> str:
        body = m.group(0)
        changed = False
        if re.search(r"Example\s*:|Constraints\s*:|给定|示例", body):
            changed = True
            kept = [ln.strip() for ln in body.splitlines() if re.search(r":type|:rtype:", ln) and not re.search(r"[^\x00-\x7F]", ln)]
            body = '"""\n' + "\n".join(kept) + '\n"""' if kept else '""'
        if re.search(r"[^\x00-\x7F]", body):
            changed = True
            kept = [ln.strip() for ln in body.splitlines() if re.search(r":type|:rtype:", ln) and not re.search(r"[^\x00-\x7F]", ln)]
            body = '"""\n' + "\n".join(kept) + '\n"""' if kept else '""'
        if changed and "removed problem-statement comments" not in notes:
            notes.append("removed problem-statement comments")
        return body

    src2 = re.sub(r'("""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\')', repl_doc, src)
    kept_lines = []
    for line in src2.splitlines():
        if re.match(r"\s*#", line) and re.search(r"Example\s*:|Constraints\s*:|Input\s*:|Output\s*:|给定|示例", line):
            if "removed problem-statement comments" not in notes:
                notes.append("removed problem-statement comments")
            continue
        kept_lines.append(line)
    return "\n".join(kept_lines).rstrip() + "\n", notes


def non_ascii_code(src: str) -> bool:
    i = 0
    n = len(src)
    while i < n:
        c = src[i]
        if c == "#":
            while i < n and src[i] != "\n":
                i += 1
            continue
        if c in "\"'":
            q = c
            if src.startswith(q * 3, i):
                end = src.find(q * 3, i + 3)
                chunk = src[i:] if end < 0 else src[i : end + 3]
                if re.search(r"[^\x00-\x7F]", chunk):
                    return True
                i = n if end < 0 else end + 3
                continue
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                    continue
                if src[i] == q:
                    i += 1
                    break
                if ord(src[i]) > 127:
                    return True
                i += 1
            continue
        if ord(c) > 127:
            return True
        i += 1
    return False


HELPERS = '''
def __sc_cell(x):
    if isinstance(x, bool):
        return "true" if x else "false"
    if isinstance(x, float):
        if x.is_integer():
            return str(int(x))
        text = "{:.6f}".format(x).rstrip("0")
        if text.endswith("."):
            text = text[:-1]
        return text
    return str(x)

def __sc_show(v):
    if v is None:
        print("null")
        return
    if isinstance(v, bool):
        print("true" if v else "false")
        return
    if isinstance(v, float):
        print(__sc_cell(v))
        return
    if isinstance(v, int):
        print(v)
        return
    if isinstance(v, str):
        print(v)
        return
    if isinstance(v, tuple) or isinstance(v, set):
        v = list(v)
    if isinstance(v, list):
        if any(isinstance(x, list) for x in v):
            print(len(v))
            for row in v:
                print(" ".join(__sc_cell(x) for x in row))
        else:
            print(" ".join(__sc_cell(x) for x in v))
        return
    if hasattr(v, "val") and hasattr(v, "next") and not hasattr(v, "left") and not hasattr(v, "neighbors"):
        out = []
        seen = set()
        cur = v
        while cur is not None and id(cur) not in seen and len(out) < 200:
            seen.add(id(cur))
            out.append(str(cur.val))
            cur = cur.next
        print(" ".join(out))
        return
    if hasattr(v, "val") and (hasattr(v, "left") or hasattr(v, "right")):
        print(" ".join(__sc_dump_tree(v)))
        return
    if hasattr(v, "neighbors"):
        print(" ".join(__sc_dump_graph(v)))
        return
    print(v)

def __sc_tree(vals):
    if not vals or vals[0] is None:
        return None
    root = TreeNode(vals[0])
    queue = [root]
    i = 1
    while queue and i < len(vals):
        node = queue.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            queue.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            queue.append(node.right)
        i += 1
    return root

def __sc_dump_tree(root):
    if root is None:
        return ["."]
    queue = [root]
    out = []
    while queue:
        node = queue.pop(0)
        if node is None:
            out.append(".")
            continue
        out.append(str(node.val))
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] == ".":
        out.pop()
    return out or ["."]

def __sc_link(vals):
    head = None
    tail = None
    for val in vals:
        node = ListNode(val)
        if head is None:
            head = tail = node
        else:
            tail.next = node
            tail = node
    return head

def __sc_graph(n, edges):
    if n <= 0:
        return None
    nodes = [Node(i + 1) for i in range(n)]
    for i, nbrs in enumerate(edges):
        for j in nbrs:
            if 1 <= j <= n:
                nodes[i].neighbors.append(nodes[j - 1])
    return nodes[0]

def __sc_dump_graph(node):
    if node is None:
        return ["0"]
    order = []
    seen = set()
    stack = [node]
    while stack:
        cur = stack.pop()
        if cur is None or cur.val in seen:
            continue
        seen.add(cur.val)
        order.append(cur)
        for nbr in cur.neighbors or []:
            stack.append(nbr)
    order.sort(key=lambda item: item.val)
    parts = [str(len(order))]
    for cur in order:
        nbrs = sorted(n.val for n in (cur.neighbors or []))
        parts.append(str(cur.val))
        parts.append(str(len(nbrs)))
        parts.extend(str(x) for x in nbrs)
    return parts
'''

LIST_NODE = '''
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
'''

TREE_NODE = '''
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
'''

GRAPH_NODE = '''
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
'''

RANDOM_NODE = '''
class Node:
    def __init__(self, x, next=None, random=None):
        self.val = x
        self.next = next
        self.random = random
'''


def header_for(repo: str, path: str, mods: list[str]) -> str:
    meta = REPOS[repo]
    url = f"https://github.com/{repo}/blob/{meta['sha']}/{path}"
    lines = [f"# SPDX-License-Identifier: {meta['spdx']}", f"# Source: {url}", f"# {meta['attribution']}"]
    if meta["shareAlike"]:
        lines.append("# Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/")
    lines.append("# Modifications by SimpleCode: " + "; ".join(mods) + ".")
    if meta["shareAlike"]:
        lines.append("# Adaptations of this file must stay under CC BY-SA 4.0.")
        lines.append("# The Doocs README also asks commercial reprints to contact contact@yanglibin.info.")
    else:
        lines.append("# The MIT license text is in docs/leetcode/LICENSES/MIT.txt")
    return "\n".join(lines) + "\n"


def gen_tokens(typ: str, rng: random.Random, name: str, attempt: int) -> list[str]:
    kind = base_type(typ)
    small = attempt >= 4
    if kind == "int":
        if name in ("m", "n", "k", "amount", "numCourses", "capacity", "row", "col"):
            return [str(rng.randint(1, 3 if small else 4))]
        return [str(rng.randint(0, 5 if small else 8))]
    if kind == "float":
        return [str(rng.choice([1, 2, 3, 4]))]
    if kind == "bool":
        return [rng.choice(["true", "false"])]
    if kind == "str":
        alphabet = "abc"
        if "paren" in name or name in ("s",) and rng.random() < 0.3:
            alphabet = "()[]"
        n = rng.randint(1, 3 if small else 5)
        return ["".join(rng.choice(alphabet) for _ in range(n))]
    if kind == "list[int]":
        n = rng.randint(0 if attempt else 1, 3 if small else 5)
        return [str(n)] + [str(rng.randint(0, 6)) for _ in range(n)]
    if kind == "list[str]":
        n = rng.randint(1, 2 if small else 3)
        items = []
        for _ in range(n):
            items.append("".join(rng.choice("ab") for _ in range(rng.randint(1, 3))))
        return [str(n)] + items
    if kind == "list[float]":
        n = rng.randint(1, 3)
        return [str(n)] + [str(rng.randint(1, 5)) for _ in range(n)]
    if kind == "list[bool]":
        n = rng.randint(1, 3)
        return [str(n)] + [rng.choice(["true", "false"]) for _ in range(n)]
    if kind == "list[list[int]]":
        rows = rng.randint(0 if attempt else 1, 2 if small else 3)
        cols = rng.randint(1, 3)
        out = [str(rows)]
        for _ in range(rows):
            out.append(str(cols))
            out.extend(str(rng.randint(0, 5)) for _ in range(cols))
        return out
    if kind == "list[list[str]]":
        rows = rng.randint(1, 2)
        cols = rng.randint(1, 2)
        out = [str(rows)]
        for _ in range(rows):
            out.append(str(cols))
            out.extend("".join(rng.choice("ab") for _ in range(2)) for _ in range(cols))
        return out
    if kind == "ListNode":
        n = rng.randint(0 if attempt else 1, 3 if small else 4)
        return [str(n)] + [str(rng.randint(0, 9)) for _ in range(n)]
    if kind == "TreeNode":
        vals = [str(rng.randint(0, 9))]
        extra = 0 if attempt > 6 else rng.choice([0, 2, 2, 4])
        for _ in range(extra):
            vals.append(str(rng.randint(0, 9)))
        return [str(len(vals))] + vals
    if kind == "list[ListNode]":
        k = rng.randint(1, 2 if small else 3)
        out = [str(k)]
        for _ in range(k):
            n = rng.randint(0, 3)
            out.append(str(n))
            out.extend(str(rng.randint(0, 9)) for _ in range(n))
        return out
    if kind == "NodeGraph":
        n = rng.randint(1, 3)
        out = [str(n)]
        for i in range(n):
            nbrs = [j + 1 for j in range(n) if j != i and rng.random() < 0.5]
            out.append(str(len(nbrs)))
            out.extend(str(x) for x in nbrs)
        return out
    if kind == "NodeRandom":
        n = rng.randint(1, 3)
        return [str(n)] + [str(rng.randint(0, 9)) for _ in range(n)]
    if kind == "NodeMulti":
        return ["3", "1", "2", "4", "1", "1", "8"]
    raise ValueError(typ)


def gen_arg_tokens(params: list[tuple[str, str]], rng: random.Random, attempt: int, method: str = "") -> list[str]:
    if method == "letterCombinations":
        n = rng.randint(1, 3)
        return ["".join(rng.choice("23456789") for _ in range(n))]
    if method == "evalRPN":
        expr = ["2", "1", "+", "3", "*"]
        return [str(len(expr))] + expr
    if method == "isValidSudoku":
        out = ["9"]
        for _ in range(9):
            out.append("9")
            out.extend(["."] * 9)
        return out
    if method == "lowestCommonAncestor":
        return ["3", "2", "1", "3", "1", "3"]
    if len(params) == 2 and base_type(params[0][1]) == "int" and base_type(params[1][1]) == "list[list[int]]":
        n = rng.randint(1, 4)
        edges = rng.randint(0, 3)
        tokens = [str(n), str(edges)]
        for _ in range(edges):
            tokens += ["2", str(rng.randint(0, n - 1)), str(rng.randint(0, n - 1))]
        return tokens
    if len(params) == 2 and base_type(params[0][1]) == "list[int]" and params[1][0] in ("target", "k"):
        n = rng.randint(2, 4)
        nums = [rng.randint(0, 8) for _ in range(n)]
        if params[1][0] == "target":
            target = nums[0] + nums[-1]
            return [str(n)] + [str(x) for x in nums] + [str(target)]
        return [str(n)] + [str(x) for x in nums] + [str(rng.randint(1, n))]
    tokens: list[str] = []
    for name, typ in params:
        tokens.extend(gen_tokens(typ, rng, name, attempt))
    return tokens


def parse_lines(params: list[tuple[str, str]]) -> list[str]:
    lines = ["    data = sys.stdin.read().split()", "    i = 0", "    def take():", "        nonlocal i", "        v = data[i]", "        i += 1", "        return v"]
    for name, typ in params:
        lines.extend("    " + ln if ln else "" for ln in parse_block(name, typ).splitlines())
    return lines


def parse_block(name: str, typ: str) -> str:
    kind = base_type(typ)
    if kind == "int":
        return f"{name} = int(take())"
    if kind == "float":
        return f"{name} = float(take())"
    if kind == "bool":
        return f'{name} = take() in ("1", "true", "True")'
    if kind == "str":
        return f"{name} = take()"
    if kind == "list[int]":
        return f"{name} = [int(take()) for _ in range(int(take()))]"
    if kind == "list[float]":
        return f"{name} = [float(take()) for _ in range(int(take()))]"
    if kind == "list[bool]":
        return f'{name} = [take() in ("1", "true", "True") for _ in range(int(take()))]'
    if kind == "list[str]":
        return f"{name} = [take() for _ in range(int(take()))]"
    if kind == "list[list[int]]":
        return (
            f"{name} = []\n"
            f"__rows = int(take())\n"
            f"for __r in range(__rows):\n"
            f"    __cols = int(take())\n"
            f"    {name}.append([int(take()) for _ in range(__cols)])"
        )
    if kind == "list[list[str]]":
        return (
            f"{name} = []\n"
            f"__rows = int(take())\n"
            f"for __r in range(__rows):\n"
            f"    __cols = int(take())\n"
            f"    {name}.append([take() for _ in range(__cols)])"
        )
    if kind == "ListNode":
        return f"__ln = int(take())\n{name} = __sc_link([int(take()) for _ in range(__ln)])"
    if kind == "TreeNode":
        return (
            f"__tn = int(take())\n"
            f"__tv = []\n"
            f"for _ in range(__tn):\n"
            f"    __tok = take()\n"
            f'    __tv.append(None if __tok == "." else int(__tok))\n'
            f"{name} = __sc_tree(__tv)"
        )
    if kind == "list[ListNode]":
        return (
            f"{name} = []\n"
            f"__k = int(take())\n"
            f"for _ in range(__k):\n"
            f"    __ln = int(take())\n"
            f"    {name}.append(__sc_link([int(take()) for _ in range(__ln)]))"
        )
    if kind == "NodeGraph":
        return (
            f"__gn = int(take())\n"
            f"__ge = []\n"
            f"for _ in range(__gn):\n"
            f"    __gd = int(take())\n"
            f"    __ge.append([int(take()) for _ in range(__gd)])\n"
            f"{name} = __sc_graph(__gn, __ge)"
        )
    if kind == "NodeRandom":
        return (
            f"__rn = int(take())\n"
            f"__rvals = [int(take()) for _ in range(__rn)]\n"
            f"__rnodes = [Node(v) for v in __rvals]\n"
            f"for __i in range(len(__rnodes) - 1):\n"
            f"    __rnodes[__i].next = __rnodes[__i + 1]\n"
            f"{name} = __rnodes[0] if __rnodes else None"
        )
    if kind == "NodeMulti":
        return (
            f"__mn = int(take())\n"
            f"__mvals = [int(take()) for _ in range(__mn)]\n"
            f"__mnodes = [Node(v, None, None, None) for v in __mvals]\n"
            f"for __i in range(len(__mnodes) - 1):\n"
            f"    __mnodes[__i].next = __mnodes[__i + 1]\n"
            f"    __mnodes[__i + 1].prev = __mnodes[__i]\n"
            f"__ci = int(take())\n"
            f"__cn = int(take())\n"
            f"__cvals = [int(take()) for _ in range(__cn)]\n"
            f"__cnodes = [Node(v, None, None, None) for v in __cvals]\n"
            f"for __i in range(len(__cnodes) - 1):\n"
            f"    __cnodes[__i].next = __cnodes[__i + 1]\n"
            f"    __cnodes[__i + 1].prev = __cnodes[__i]\n"
            f"if __cnodes:\n"
            f"    __mnodes[__ci].child = __cnodes[0]\n"
            f"{name} = __mnodes[0] if __mnodes else None"
        )
    raise ValueError(typ)


def functional_main(method: str, params: list[tuple[str, str]], ret: str) -> str:
    if method == "lowestCommonAncestor":
        return textwrap.dedent(
            """
            def __sc_main():
                import sys
                data = sys.stdin.read().split()
                count = int(data[0])
                vals = []
                for tok in data[1:1 + count]:
                    vals.append(None if tok == "." else int(tok))
                pval = int(data[1 + count])
                qval = int(data[2 + count])
                root = __sc_tree(vals)
                found = {}
                stack = [root]
                while stack:
                    node = stack.pop()
                    if node is None:
                        continue
                    found[node.val] = node
                    stack.append(node.left)
                    stack.append(node.right)
                __sc_show(Solution().lowestCommonAncestor(root, found[pval], found[qval]))

            __sc_main()
            """
        )
    mutable = next((name for name, typ in params if base_type(typ).startswith(("list", "ListNode", "TreeNode", "Node"))), None)
    call = f"Solution().{method}({', '.join(name for name, _ in params)})"
    body = parse_lines(params)
    if base_type(ret) == "none" and mutable:
        body.append(f"    {call}")
        body.append(f"    __sc_show({mutable})")
    else:
        body.append(f"    __sc_show({call})")
    return "def __sc_main():\n    import sys\n" + "\n".join(body) + "\n\n__sc_main()\n"


def design_main(pid: int, class_name: str) -> str:
    if pid == 271:
        return textwrap.dedent(
            """
            def __sc_main():
                import sys
                lines = sys.stdin.read().splitlines()
                n = int(lines[0])
                items = lines[1:1 + n]
                back = Codec().decode(Codec().encode(items))
                print(len(back))
                for item in back:
                    print(item)

            __sc_main()
            """
        )
    if pid in (297, 449):
        return textwrap.dedent(
            """
            def __sc_main():
                import sys
                data = sys.stdin.read().split()
                i = 0
                def take():
                    nonlocal i
                    v = data[i]
                    i += 1
                    return v
                count = int(take())
                vals = []
                for _ in range(count):
                    tok = take()
                    vals.append(None if tok == "." else int(tok))
                root = __sc_tree(vals)
                codec = Codec()
                back = codec.deserialize(codec.serialize(root))
                print(" ".join(__sc_dump_tree(back)))

            __sc_main()
            """
        )
    if pid == 703:
        return textwrap.dedent(
            f"""
            def __sc_main():
                import sys
                data = sys.stdin.read().split()
                k = int(data[0])
                n = int(data[1])
                nums = [int(x) for x in data[2:2 + n]]
                obj = {class_name}(k, nums)
                i = 2 + n
                while i < len(data):
                    __sc_show(obj.add(int(data[i + 1])))
                    i += 2

            __sc_main()
            """
        )
    if pid == 622:
        return textwrap.dedent(
            f"""
            def __sc_main():
                import sys
                lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
                obj = {class_name}(int(lines[0]))
                for ln in lines[1:]:
                    parts = ln.split()
                    args = [int(x) for x in parts[1:]]
                    __sc_show(getattr(obj, parts[0])(*args))

            __sc_main()
            """
        )
    if pid == 2013:
        return textwrap.dedent(
            """
            def __sc_main():
                import sys
                obj = DetectSquares()
                for ln in sys.stdin.read().splitlines():
                    parts = ln.split()
                    if not parts:
                        continue
                    point = [int(parts[1]), int(parts[2])]
                    if parts[0] == "add":
                        __sc_show(obj.add(point))
                    else:
                        __sc_show(obj.count(point))

            __sc_main()
            """
        )
    if pid in (146,):
        return textwrap.dedent(
            f"""
            def __sc_main():
                import sys
                lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
                obj = {class_name}(int(lines[0]))
                for ln in lines[1:]:
                    parts = ln.split()
                    args = [int(x) for x in parts[1:]]
                    __sc_show(getattr(obj, parts[0])(*args))

            __sc_main()
            """
        )
    # Command stream. Integers stay ints; other tokens stay strings.
    return textwrap.dedent(
        f"""
        def __sc_main():
            import sys
            lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
            obj = {class_name}()
            for ln in lines:
                parts = ln.split()
                args = []
                for tok in parts[1:]:
                    if re.fullmatch(r"-?\\d+", tok):
                        args.append(int(tok))
                    else:
                        args.append(tok)
                __sc_show(getattr(obj, parts[0])(*args))

        __sc_main()
        """
    ).replace("import sys\n", "import re\n    import sys\n")


def needs_name(src: str, name: str) -> bool:
    if not re.search(rf"\b{name}\b", src):
        return False
    return not class_defined(src, name)


def assemble(repo: str, rel: str, body: str, mods: list[str], extra: str) -> str:
    parts = [
        header_for(repo, rel, mods),
        "from __future__ import annotations\n",
        "from typing import Any, Dict, List, Optional, Set, Tuple\n",
    ]
    if needs_name(body + extra, "ListNode"):
        parts.append(LIST_NODE)
    if needs_name(body + extra, "TreeNode"):
        parts.append(TREE_NODE)
    blob = body + extra
    if needs_name(blob, "Node") and not class_defined(body, "Node"):
        if "NodeRandom" in extra or "copyRandomList" in blob:
            parts.append(RANDOM_NODE)
        else:
            parts.append(GRAPH_NODE)
    parts.append(body)
    if not body.endswith("\n"):
        parts.append("\n")
    parts.append(HELPERS)
    parts.append(extra)
    return "".join(parts)


def run_py(src: str, stdin: str) -> subprocess.CompletedProcess[str] | None:
    path = Path("/tmp/sc-leetcode-try.py")
    path.write_text(src, encoding="utf-8")
    try:
        return subprocess.run(
            [sys.executable, str(path)],
            input=stdin,
            text=True,
            capture_output=True,
            timeout=3,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return None


def accept_run(result: subprocess.CompletedProcess[str] | None) -> bool:
    if result is None or result.returncode != 0:
        return False
    if "Traceback" in result.stderr or "Traceback" in result.stdout:
        return False
    if result.stdout == "" or len(result.stdout) > 5000:
        return False
    if re.search(r"[^\x00-\x7F]", result.stdout):
        return False
    if re.search(r"\d+\.\d{8,}", result.stdout):
        return False
    return True


def io_kind(params: list[tuple[str, str]], ret: str) -> dict[str, str]:
    kinds = [base_type(t) for _, t in params]
    mapping = {
        ("list[int]", "int"): "int-array-and-int",
        ("list[list[int]",): "int-matrix",
        ("ListNode",): "linked-list",
        ("TreeNode",): "tree",
        ("str",): "string",
        ("list[str]",): "string-array",
    }
    key = tuple(kinds)
    kind = mapping.get(key)
    if kind is None:
        kind = "+".join(kinds) if kinds else "design"
    out = base_type(ret)
    out_name = {
        "list[int]": "int-list",
        "int": "int",
        "bool": "bool",
        "str": "string",
        "ListNode": "linked-list",
        "TreeNode": "tree",
        "list[list[int]]": "int-matrix",
        "list[str]": "string-array",
        "none": "none",
        "float": "float",
    }.get(out, out)
    if kind == "int-array-and-int" and out == "list[int]":
        out_name = "int-pair" if True else out_name
    return {"kind": kind, "out": out_name}


def describe_io(kind: str, out: str) -> tuple[str, str, str, str]:
    zh_in = {
        "int-array-and-int": "整数个数、同一行上的各个整数，以及最后的目标整数",
        "int-matrix": "行数，以及每一行的列数和整数",
        "linked-list": "结点个数和每个结点上的整数",
        "tree": "层序结点个数，空孩子用点号表示",
        "string": "一段不含空格的文本",
        "string-array": "字符串个数和随后的各个字符串",
        "design": "若干条操作，每条一行",
    }.get(kind, "按参数顺序排列的若干记号")
    en_in = {
        "int-array-and-int": "a count, that many integers, and one target integer",
        "int-matrix": "a row count, then each row as a column count followed by integers",
        "linked-list": "a node count followed by the integer stored in each node",
        "tree": "a level-order node count, using a dot for a missing child",
        "string": "one token of text without spaces",
        "string-array": "a count followed by that many strings",
        "design": "one command per line",
    }.get(kind, "tokens in the same order as the method parameters")
    zh_out = {
        "int-pair": "一行里用空格隔开的下标",
        "int-list": "一行里用空格隔开的整数",
        "int": "一个整数",
        "bool": "true 或 false",
        "string": "一行文本",
        "linked-list": "一行里用空格隔开的结点值",
        "tree": "一行层序，空孩子用点号",
        "int-matrix": "先写行数，再逐行写整数",
        "string-array": "每行一个字符串",
        "none": "被改过的那份输入",
        "float": "一个数",
        "design": "每条操作的结果各占一行",
    }.get(out, "一行结果")
    en_out = {
        "int-pair": "indexes on one line, separated by a space",
        "int-list": "integers on one line, separated by spaces",
        "int": "one integer",
        "bool": "the word true or false",
        "string": "one line of text",
        "linked-list": "node values on one line, separated by spaces",
        "tree": "one level-order line, with a dot for a missing child",
        "int-matrix": "a row count and then one line of integers per row",
        "string-array": "one string per line",
        "none": "the input value after the method updates it",
        "float": "one number",
        "design": "one result line for each command",
    }.get(out, "one line of output")
    return zh_in, en_in, zh_out, en_out


def summaries(title_zh: str, title_en: str, kind: str, out: str) -> tuple[str, str, str, str]:
    zh_in, en_in, zh_out, en_out = describe_io(kind, out)
    zh = (
        f"公开题名是「{title_zh}」。"
        f"从标准输入读取{zh_in}，只根据这些值完成题名所说的计算，把结果写成{zh_out}。"
        f"下面的样例是我们另拟的一小段数据，用来在编辑器里对照输出，不是官网示例的原文。"
        f"数据规模不超过一百，方便在浏览器里很快跑完。"
    )
    en = (
        f"The public title of this exercise is {title_en}. "
        f"Read {en_in} from standard input and compute the result named by that title, using only those values. "
        f"Print the result as {en_out}. "
        f"The sample below is a short input written for this playground so the printed line can be checked locally. "
        f"It is not a copy of an example from the problem site. "
        f"The input stays under one hundred elements so it finishes quickly in the browser."
    )
    note_zh = f"对照时去掉末尾换行后再比较。输入是{zh_in}。"
    note_en = f"Compare after trimming trailing newlines. The input is {en_in}."
    if not 40 <= hanzi(zh) <= 180:
        raise RuntimeError(f"zh summary length {hanzi(zh)} for {title_zh}: {zh}")
    if not 30 <= words(en) <= 120:
        raise RuntimeError(f"en summary length {words(en)} for {title_en}: {en}")
    return zh, en, note_zh, note_en


def infer_tags(pattern: str, slug: str, design: bool) -> list[str]:
    if design:
        return ["design"]
    if pattern in PATTERN_TAGS:
        return PATTERN_TAGS[pattern]
    rules = [
        ("linked-list", ("linked-list", "list-cycle", "reverse-nodes", "merge-k-sorted", "merge-two-sorted")),
        ("tree", ("tree", "bst", "binary-tree")),
        ("graph", ("graph", "course-schedule", "island", "clone-graph")),
        ("heap", ("heap", "kth-largest", "median")),
        ("stack", ("stack", "parenthes", "asteroid")),
        ("backtracking", ("combination", "permutation", "sudoku", "n-queens")),
        ("binary-search", ("binary-search", "rotated-sorted", "search-in")),
        ("sliding-window", ("sliding-window", "minimum-window", "substring")),
        ("dp", ("house-robber", "coin-change", "longest-common", "edit-distance", "unique-paths", "climb")),
        ("interval", ("interval", "meeting")),
        ("bit", ("bit", "single-number")),
        ("math", ("pow", "roman", "palindrome-number", "sqrt")),
        ("hash", ("anagram", "group-anagram", "two-sum", "contains-duplicate")),
        ("two-pointers", ("container", "trapping", "3sum", "move-zero")),
    ]
    for tag, keys in rules:
        if any(k in slug for k in keys):
            return [tag]
    return ["array"]


def load_lists() -> dict:
    neet = json.loads(read(SRC / "neetcode.json"))
    meta = {}
    blind, nc = set(), set()
    for row in neet:
        m = re.match(r"(\d+)-(.+)", row["code"])
        if not m:
            continue
        pid = int(m.group(1))
        meta[pid] = {
            "slug": m.group(2),
            "title": row["problem"],
            "diff": str(row["difficulty"]).lower(),
            "pattern": row.get("pattern") or "",
        }
        if row.get("blind75"):
            blind.add(pid)
        if row.get("neetcode150"):
            nc.add(pid)
    hot = set(json.loads(read(SRC / "hot100.json")))
    top, topdiff, toptitle, topslug = set(), {}, {}, {}
    for line in read(SRC / "hoang.md").splitlines():
        m = re.search(r"\|\s*(\d+)\s*\|\s*\[([^\]]+)\](?:\((https://leetcode.com/problems/[^)\s]+)\))?", line)
        if not m:
            continue
        pid = int(m.group(1))
        top.add(pid)
        toptitle[pid] = m.group(2).strip()
        dm = re.search(r"\|\s*(Easy|Medium|Hard)\s*\|", line)
        if dm:
            topdiff[pid] = dm.group(1).lower()
        if m.group(3):
            slug = m.group(3).rstrip("/").split("/")[-1]
            if slug and not slug.startswith("#"):
                topslug[pid] = slug
    pat, pattitle, patslug = set(), {}, {}
    for line in read(SRC / "pattern.md").splitlines():
        m = re.search(r"\[(\d+)\.\s+([^\]]+)\]\(https://leetcode.com/problems/([^)/]+)", line)
        if not m:
            continue
        pid = int(m.group(1))
        pat.add(pid)
        pattitle[pid] = m.group(2).strip()
        patslug[pid] = m.group(3).strip("/")
    codetop = set()
    for path in (SRC / "codetop").rglob("*.md"):
        for line in read(path).splitlines():
            m = re.match(r"\|(\d+)\.\s+", line.strip())
            if m:
                codetop.add(int(m.group(1)))
    return {
        "meta": meta,
        "hot": hot,
        "blind": blind,
        "nc": nc,
        "top": top,
        "topdiff": topdiff,
        "toptitle": toptitle,
        "topslug": topslug,
        "pat": pat,
        "pattitle": pattitle,
        "patslug": patslug,
        "codetop": codetop,
    }


def choose(lists: dict) -> list[int]:
    hot, blind, nc, top = lists["hot"], lists["blind"], lists["nc"], lists["top"]
    core = hot | blind | nc | top

    def count(pid: int) -> int:
        return sum(pid in group for group in (hot, blind, nc, top))

    def eligible(pid: int) -> bool:
        meta = lists["meta"].get(pid)
        diff = meta["diff"] if meta else lists["topdiff"].get(pid)
        slug = None
        if meta:
            slug = meta["slug"]
        slug = slug or lists["patslug"].get(pid) or lists["topslug"].get(pid)
        title = (meta or {}).get("title") or lists["toptitle"].get(pid) or lists["pattitle"].get(pid)
        return bool(diff and slug and title)

    ranked = sorted(core, key=lambda pid: (-count(pid), 0 if pid in nc else 1, pid))
    # Drop ids whose difficulty or English title is missing from the three list sources.
    ranked = [pid for pid in ranked if eligible(pid)]
    if len(core) > 220:
        selected = ranked[:200]
    else:
        selected = ranked
    if not (set(selected) >= blind):
        die(f"Blind 75 was not retained: missing {sorted(blind - set(selected))[:10]}")
    if not 180 <= len(selected) <= 220:
        die(f"core size {len(selected)} is outside 180-220")
    return selected


def slug_of(lists: dict, pid: int) -> str:
    meta = lists["meta"].get(pid)
    if meta:
        return meta["slug"]
    return lists["patslug"].get(pid) or lists["topslug"][pid]


def title_en(lists: dict, pid: int) -> str:
    meta = lists["meta"].get(pid)
    if meta:
        return meta["title"]
    return lists["toptitle"].get(pid) or lists["pattitle"][pid]


def diff_of(lists: dict, pid: int) -> str:
    meta = lists["meta"].get(pid)
    if meta:
        return meta["diff"]
    return lists["topdiff"][pid]


def pattern_files(pid: int) -> list[Path]:
    root = SRC / "pattern"
    if not root.exists():
        return []
    return [p for p in root.rglob("*.py") if re.match(rf"^{pid}-", p.name)]


def candidates(pid: int, slug: str) -> list[tuple[str, Path, str]]:
    found = []
    kamyu = SRC / "kamyu" / "Python" / f"{slug}.py"
    if kamyu.exists():
        found.append(("kamyu104/LeetCode-Solutions", kamyu, f"Python/{kamyu.name}"))
    neet = SRC / "neetcode" / "python" / f"{pid:04d}-{slug}.py"
    if neet.exists():
        found.append(("neetcode-gh/leetcode", neet, f"python/{neet.name}"))
    pats = pattern_files(pid)
    if pats:
        rel = pats[0].relative_to(SRC / "pattern").as_posix()
        found.append(("tiationg-kho/leetcode-pattern-500", pats[0], rel))
    return found


_doocs_index: dict[str, list[str]] | None = None


def doocs_file(pid: int) -> tuple[str, Path, str] | None:
    global _doocs_index
    cache = SRC / "doocs"
    cache.mkdir(parents=True, exist_ok=True)
    lo = (pid // 100) * 100
    folder = f"{lo:04d}-{lo + 99:04d}"
    local = cache / f"{pid:04d}.py"
    if local.exists() and local.stat().st_size > 0:
        # Recover the upstream path from the first line we stored, if present.
        rel = f"solution/{folder}/{pid:04d}.py"
        sidecar = cache / f"{pid:04d}.path"
        if sidecar.exists():
            rel = sidecar.read_text(encoding="utf-8").strip()
        return ("doocs/leetcode", local, rel)
    if os.environ.get("LEETCODE_NO_DOOCS") == "1":
        return None
    if _doocs_index is None:
        _doocs_index = {}
    if folder not in _doocs_index:
        url = f"https://api.github.com/repos/doocs/leetcode/contents/solution/{folder}?ref={DOOCS_SHA}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "simplecode-leetcode-import"})
            with urllib.request.urlopen(req, timeout=60) as res:
                payload = json.load(res)
            _doocs_index[folder] = [item["name"] for item in payload]
        except Exception as exc:
            print(f"doocs list {folder} failed: {exc}", file=sys.stderr)
            _doocs_index[folder] = []
    prefix = f"{pid:04d}."
    name = next((item for item in _doocs_index[folder] if item.startswith(prefix)), None)
    if not name:
        return None
    rel = f"solution/{folder}/{name}/Solution.py"
    raw = f"https://raw.githubusercontent.com/doocs/leetcode/{DOOCS_SHA}/{urllib.parse.quote(rel)}"
    try:
        req = urllib.request.Request(raw, headers={"User-Agent": "simplecode-leetcode-import"})
        with urllib.request.urlopen(req, timeout=60) as res:
            text = res.read().decode("utf-8", "replace")
    except Exception as exc:
        print(f"doocs fetch {rel} failed: {exc}", file=sys.stderr)
        return None
    local.write_text(text, encoding="utf-8")
    (cache / f"{pid:04d}.path").write_text(rel, encoding="utf-8")
    return ("doocs/leetcode", local, rel)


import urllib.parse  # noqa: E402  (used by doocs_file)


def fetch_titles(slugs: list[str]) -> dict[str, dict]:
    cache_path = SRC / "title-cache.json"
    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}
    missing = [slug for slug in slugs if slug not in cache]
    for index, slug in enumerate(missing, 1):
        query = (
            '{ question(titleSlug: "%s") { questionFrontendId title translatedTitle difficulty isPaidOnly } }'
            % slug.replace('"', "")
        )
        req = urllib.request.Request(
            "https://leetcode.cn/graphql",
            data=json.dumps({"query": query}).encode(),
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            payload = json.load(res)
        question = payload.get("data", {}).get("question")
        if not question or not question.get("translatedTitle"):
            die(f"missing Chinese title for {slug}")
        cache[slug] = {
            "zh": question["translatedTitle"],
            "en": question["title"],
            "premium": bool(question.get("isPaidOnly")),
            "id": int(question["questionFrontendId"]),
        }
        if index % 25 == 0:
            cache_path.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
            print(f"titles {index}/{len(missing)}")
    cache_path.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    return cache


def repair_runtime(src: str, notes: list[str]) -> str:
    if re.search(r"\bxrange\b", src):
        src = re.sub(r"\bxrange\b", "range", src)
        notes.append("replaced xrange with range")
    for mod in ("heapq", "collections", "functools", "bisect", "itertools", "math", "copy"):
        used = re.search(rf"\b{mod}\b", src)
        imported = re.search(rf"(?m)^(?:import {mod}\b|from {mod} )", src)
        if used and not imported:
            src = f"import {mod}\n" + src
            notes.append(f"added import {mod}")
    return src


def try_source(pid: int, slug: str, repo: str, path: Path, rel: str, design: bool) -> dict | None:
    raw = read(path)
    body, notes = clean_source(raw)
    body = repair_runtime(body, notes)
    if pid == 445 and "used floor division" not in notes:
        folded = re.sub(r"/=", "//=", body)
        folded = re.sub(r"(?<=[\w\)])\s*/\s*(?=[\w\(])", "//", folded)
        if folded != body:
            body = folded
            notes.append("used floor division for Python 3")
    if design:
        class_name = DESIGNS[pid][0]
        if not class_defined(body, class_name):
            return None
        extra = design_main(pid, class_name)
        stdin = DESIGNS[pid][1]
        if "import re" in extra and "re." in body:
            pass
        mods = notes + ["appended the stdin harness"]
        if "ListNode" in extra or "TreeNode" in extra:
            mods.append("added node constructors used by the stdin harness")
        src = assemble(repo, rel, body, mods, extra)
        if non_ascii_code(src):
            return None
        result = run_py(src, stdin)
        if not accept_run(result):
            return None
        return {"src": src, "stdin": stdin, "stdout": result.stdout, "mods": mods, "repo": repo, "rel": rel, "io": {"kind": "design", "out": "design"}}
    parsed = parse_solution(body, slug)
    if not parsed:
        return None
    method, params, ret = parsed
    mods = notes + ["appended the stdin harness"]
    extra = functional_main(method, params, ret)
    src = assemble(repo, rel, body, mods, extra)
    if non_ascii_code(src):
        return None
    if pid == 1:
        attempts = [( "3\n1 4 8\n9\n",)]
    else:
        attempts = []
    for attempt in range(10):
        rng = random.Random(pid * 100 + attempt)
        tokens = gen_arg_tokens(params, rng, attempt, method)
        attempts.append((" ".join(tokens) + "\n",))
    for (stdin,) in attempts:
        result = run_py(src, stdin)
        expects_float = base_type(ret) == "float" or "float" in ret
        if result and "." in result.stdout and not expects_float:
            continue
        if accept_run(result):
            return {
                "src": src,
                "stdin": stdin if stdin.endswith("\n") else stdin + "\n",
                "stdout": result.stdout if result.stdout.endswith("\n") else result.stdout + "\n",
                "mods": mods,
                "repo": repo,
                "rel": rel,
                "io": io_kind(params, ret),
            }
    return None


def lists_for(lists: dict, pid: int) -> list[str]:
    order = [
        ("hot100", "hot"),
        ("blind75", "blind"),
        ("neetcode150", "nc"),
        ("top200", "top"),
        ("pattern500", "pat"),
        ("codetop", "codetop"),
    ]
    return [name for name, key in order if pid in lists[key]]


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    if not (SRC / "neetcode.json").exists():
        die(f"missing sources in {SRC}; run node scripts/leetcode/import.mjs")
    lists = load_lists()
    selected = choose(lists)
    slugs = [slug_of(lists, pid) for pid in selected]
    titles = fetch_titles(slugs)
    index_zh = []
    index_en = []
    failed = []
    for n, pid in enumerate(selected, 1):
        slug = slug_of(lists, pid)
        design = pid in DESIGNS
        built = None
        sources = candidates(pid, slug)
        for repo, path, rel in sources:
            built = try_source(pid, slug, repo, path, rel, design)
            if built:
                break
        if not built:
            extra = doocs_file(pid)
            if extra:
                built = try_source(pid, slug, extra[0], extra[1], extra[2], design)
        if not built:
            failed.append(pid)
            print(f"FAIL {pid} {slug}")
            continue
        info = titles[slug]
        if int(info["id"]) != pid:
            die(f"id mismatch {pid} vs {info['id']} for {slug}")
        zh_title = info["zh"].strip()
        en_title = title_en(lists, pid).strip()
        kind = built["io"]["kind"]
        out = built["io"]["out"]
        summary_zh, summary_en, note_zh, note_en = summaries(zh_title, en_title, kind, out)
        meta = REPOS[built["repo"]]
        diff = diff_of(lists, pid)
        tags = infer_tags(lists["meta"].get(pid, {}).get("pattern", ""), slug, design)
        member = lists_for(lists, pid)
        folder = OUT / "problems" / f"{pid:04d}"
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "python.py").write_text(built["src"], encoding="utf-8")
        url = f"https://github.com/{built['repo']}/blob/{meta['sha']}/{urllib.parse.quote(built['rel'])}"
        problem = {
            "id": pid,
            "slug": slug,
            "summary": summary_zh,
            "samples": [{"stdin": built["stdin"], "stdout": built["stdout"], "note": note_zh}],
            "links": {"cn": f"https://leetcode.cn/problems/{slug}/", "en": f"https://leetcode.com/problems/{slug}/"},
            "io": built["io"],
            "solutions": {
                "python": {
                    "file": "python.py",
                    "sourceRepo": built["repo"],
                    "sourceUrl": url,
                    "sourceRevision": meta["sha"],
                    "license": meta["license"],
                    "spdx": meta["spdx"],
                    "attribution": meta["attribution"],
                    "shareAlike": meta["shareAlike"],
                    "modifications": built["mods"],
                }
            },
        }
        write_json(folder / "problem.json", problem)
        en_dir = OUT_EN / "problems" / f"{pid:04d}"
        en_dir.mkdir(parents=True, exist_ok=True)
        write_json(en_dir / "problem.json", {"id": pid, "summary": summary_en, "notes": [note_en]})
        entry = {
            "id": pid,
            "slug": slug,
            "title": zh_title,
            "difficulty": diff,
            "tags": tags,
            "lists": member,
            "tier": "core",
            "premium": info["premium"],
            "langs": ["python"],
        }
        index_zh.append(entry)
        index_en.append({**entry, "title": en_title})
        print(f"OK {n:3} {pid} {built['repo'].split('/')[0]} {kind}")
    if failed:
        die(f"{len(failed)} problems had no runnable solution: {failed}")
    index_zh.sort(key=lambda row: row["id"])
    index_en.sort(key=lambda row: row["id"])
    write_json(OUT / "index.json", index_zh)
    write_json(OUT_EN / "index.json", index_en)
    write_json(OUT / "tags.json", TAGS_ZH)
    write_json(OUT_EN / "tags.json", TAGS_EN)
    write_json(
        OUT / "sources.lock.json",
        {
            "retrieved": RETRIEVED,
            "lists": {
                "hot100": {"repo": "kernelvale/leetcode-hot100", "commit": HOT_SHA, "note": "problem ids only, cross-check of the public Top 100 Liked plan"},
                "blind75": {"repo": "neetcode-gh/leetcode", "commit": NEET_SHA, "file": ".problemSiteData.json", "field": "blind75"},
                "neetcode150": {"repo": "neetcode-gh/leetcode", "commit": NEET_SHA, "file": ".problemSiteData.json", "field": "neetcode150"},
                "codetop": {"repo": "afatcoder/LeetcodeTop", "commit": CODETOP_SHA, "note": "problem ids only"},
                "top200": {"repo": "hoangcaobao/LeetCode", "commit": TOP_SHA, "file": "README.md"},
                "pattern500": {"repo": "tiationg-kho/leetcode-pattern-500", "commit": PAT_SHA, "file": "README.md"},
            },
            "solutions": {name: {"commit": meta["sha"], "license": meta["license"]} for name, meta in REPOS.items()},
        },
    )
    by = {}
    for row in index_zh:
        by[row["difficulty"]] = by.get(row["difficulty"], 0) + 1
    print(f"wrote {len(index_zh)} problems {by}")


if __name__ == "__main__":
    main()

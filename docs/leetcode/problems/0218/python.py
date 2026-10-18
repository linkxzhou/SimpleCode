# SPDX-License-Identifier: MIT
# Source: https://github.com/tiationg-kho/leetcode-pattern-500/blob/c3ee9ee6e40d386600e0a3545844350a264c5b56/[P]segment-tree/[P]segment-tree/218-the-skyline-problem.py
# Copyright (c) 2023 Tiationg Kho
# Modifications by SimpleCode: appended the stdin harness.
# The MIT license text is in docs/leetcode/LICENSES/MIT.txt
from __future__ import annotations
from typing import Any, Dict, List, Optional, Set, Tuple
class Node:
    def __init__(self, start, end):
        self.start = start
        self.end = end
        self.mid = (start + end) // 2
        self.left = None
        self.right = None
        self.val = 0
        self.lazy = 0

class SegmentTree:
    def __init__(self, start, end):
        self.root = Node(start, end)

    def push_down(self, node):
        if not node.left:
            node.left = Node(node.start, node.mid)
        if not node.right:
            node.right = Node(node.mid + 1, node.end)
        if node.lazy == 0:
            return
        node.left.val = max(node.left.val, node.lazy)
        node.right.val = max(node.right.val, node.lazy)
        node.left.lazy = max(node.left.lazy, node.lazy)
        node.right.lazy = max(node.right.lazy, node.lazy)
        node.lazy = 0

    def push_up(self, node):
        node.val = max(node.left.val, node.right.val)

    def update(self, node, start, end, val):
        if start <= node.start and node.end <= end:
            node.val = max(node.val, val)
            node.lazy = max(node.lazy, val)
            return
        self.push_down(node)
        if start <= node.mid:
            self.update(node.left, start, end, val)
        if end >= node.mid + 1:
            self.update(node.right, start, end, val)
        self.push_up(node)

    def query(self, node, start, end):
        if start <= node.start and node.end <= end:
            return node.val
        self.push_down(node)
        res = 0
        if start <= node.mid:
            res = max(res, self.query(node.left, start, end))
        if end >= node.mid + 1:
            res = max(res, self.query(node.right, start, end))
        return res

class Solution:
    def getSkyline(self, buildings: List[List[int]]) -> List[List[int]]:
        st = SegmentTree(0, 2**31-1)
        lines = []
        for p, q, h in buildings:
            lines.append(p)
            lines.append(q)
            st.update(st.root, p, q - 1, h)
        
        lines.sort()
        res = []
        for p in lines:
            h = st.query(st.root, p, p)
            if not res or res[- 1][1] != h:
                res.append([p, h])
        return res

# time O(nlogC + nlogn)
# space O(n), due to segment tree
# using segment tree and max type segment tree and line sweep

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
def __sc_main():
    import sys
    data = sys.stdin.read().split()
    i = 0
    def take():
        nonlocal i
        v = data[i]
        i += 1
        return v
    buildings = []
    __rows = int(take())
    for __r in range(__rows):
        __cols = int(take())
        buildings.append([int(take()) for _ in range(__cols)])
    __sc_show(Solution().getSkyline(buildings))

__sc_main()

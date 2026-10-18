# SPDX-License-Identifier: MIT
# Source: https://github.com/neetcode-gh/leetcode/blob/d5ebb3ea8bd4b52d605bc7aa179e22af684d31bb/python/0054-spiral-matrix.py
# Copyright (c) 2022 neetcode-gh
# Modifications by SimpleCode: appended the stdin harness.
# The MIT license text is in docs/leetcode/LICENSES/MIT.txt
from __future__ import annotations
from typing import Any, Dict, List, Optional, Set, Tuple
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []
        left, right = 0, len(matrix[0])
        top, bottom = 0, len(matrix)

        while left < right and top < bottom:
            # get every i in the top row
            for i in range(left, right):
                res.append(matrix[top][i])
            top += 1
            # get every i in the right col
            for i in range(top, bottom):
                res.append(matrix[i][right - 1])
            right -= 1
            if not (left < right and top < bottom):
                break
            # get every i in the bottom row
            for i in range(right - 1, left - 1, -1):
                res.append(matrix[bottom - 1][i])
            bottom -= 1
            # get every i in the left col
            for i in range(bottom - 1, top - 1, -1):
                res.append(matrix[i][left])
            left += 1

        return res

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
    matrix = []
    __rows = int(take())
    for __r in range(__rows):
        __cols = int(take())
        matrix.append([int(take()) for _ in range(__cols)])
    __sc_show(Solution().spiralOrder(matrix))

__sc_main()

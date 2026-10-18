# SPDX-License-Identifier: MIT
# Source: https://github.com/kamyu104/LeetCode-Solutions/blob/8e29ccd49e73439f0dc36b6bdd0f3bded259c7b3/Python/find-median-from-data-stream.py
# Copyright (c) 2018 https://github.com/kamyu104/LeetCode-Solutions
# Modifications by SimpleCode: appended the stdin harness.
# The MIT license text is in docs/leetcode/LICENSES/MIT.txt
from __future__ import annotations
from typing import Any, Dict, List, Optional, Set, Tuple
# Time:  O(nlogn) for total n addNums, O(logn) per addNum, O(1) per findMedian.
# Space: O(n), total space

from heapq import heappush, heappop

class MedianFinder(object):
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.__max_heap = []
        self.__min_heap = []

    def addNum(self, num):
        """
        Adds a num into the data structure.
        :type num: int
        :rtype: void
        """
        # Balance smaller half and larger half.
        if not self.__max_heap or num > -self.__max_heap[0]:
            heappush(self.__min_heap, num)
            if len(self.__min_heap) > len(self.__max_heap) + 1:
                heappush(self.__max_heap, -heappop(self.__min_heap))
        else:
            heappush(self.__max_heap, -num)
            if len(self.__max_heap) > len(self.__min_heap):
                heappush(self.__min_heap, -heappop(self.__max_heap))

    def findMedian(self):
        """
        Returns the median of current data stream
        :rtype: float
        """
        return (-self.__max_heap[0] + self.__min_heap[0]) / 2.0 \
               if len(self.__min_heap) == len(self.__max_heap) \
               else self.__min_heap[0]

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
    import re
    import sys
    lines = [ln.strip() for ln in sys.stdin.read().splitlines() if ln.strip()]
    obj = MedianFinder()
    for ln in lines:
        parts = ln.split()
        args = []
        for tok in parts[1:]:
            if re.fullmatch(r"-?\d+", tok):
                args.append(int(tok))
            else:
                args.append(tok)
        __sc_show(getattr(obj, parts[0])(*args))

__sc_main()

# SPDX-License-Identifier: MIT
# Source: https://github.com/kamyu104/LeetCode-Solutions/blob/8e29ccd49e73439f0dc36b6bdd0f3bded259c7b3/Python/serialize-and-deserialize-binary-tree.py
# Copyright (c) 2018 https://github.com/kamyu104/LeetCode-Solutions
# Modifications by SimpleCode: appended the stdin harness.
# The MIT license text is in docs/leetcode/LICENSES/MIT.txt
from __future__ import annotations
from typing import Any, Dict, List, Optional, Set, Tuple
# Time:  O(n)
# Space: O(h)

class TreeNode(object):
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None


class Codec(object):

    def serialize(self, root):
        """Encodes a tree to a single string.

        :type root: TreeNode
        :rtype: str
        """
        def serializeHelper(node):
            if not node:
                vals.append('#')
                return
            vals.append(str(node.val))
            serializeHelper(node.left)
            serializeHelper(node.right)
        vals = []
        serializeHelper(root)
        return ' '.join(vals)


    def deserialize(self, data):
        """Decodes your encoded data to tree.

        :type data: str
        :rtype: TreeNode
        """
        def deserializeHelper():
            val = next(vals)
            if val == '#':
                return None
            node = TreeNode(int(val))
            node.left = deserializeHelper()
            node.right = deserializeHelper()
            return node
        def isplit(source, sep):
            sepsize = len(sep)
            start = 0
            while True:
                idx = source.find(sep, start)
                if idx == -1:
                    yield source[start:]
                    return
                yield source[start:idx]
                start = idx + sepsize
        vals = iter(isplit(data, ' '))
        return deserializeHelper()


# time: O(n)
# space: O(n)

class Codec2(object):

    def serialize(self, root):
        """Encodes a tree to a single string.
        
        :type root: TreeNode
        :rtype: str
        """
        def gen_preorder(node):
            if not node:
                yield '#'
            else:
                yield str(node.val)
                for n in gen_preorder(node.left):
                    yield n
                for n in gen_preorder(node.right):
                    yield n
                
        return ' '.join(gen_preorder(root))
        
    def deserialize(self, data):
        """Decodes your encoded data to tree.
        
        :type data: str
        :rtype: TreeNode
        """
        def builder(chunk_iter):
            val = next(chunk_iter)
            if val == '#':
                return None
            node = TreeNode(int(val))
            node.left = builder(chunk_iter)
            node.right = builder(chunk_iter)
            return node
        
        # https://stackoverflow.com/a/42373311/568901
        chunk_iter = iter(data.split())
        return builder(chunk_iter)

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

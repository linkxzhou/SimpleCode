# SPDX-License-Identifier: MIT
# Source: https://github.com/kamyu104/LeetCode-Solutions/blob/8e29ccd49e73439f0dc36b6bdd0f3bded259c7b3/Python/longest-increasing-subsequence.py
# Copyright (c) 2018 https://github.com/kamyu104/LeetCode-Solutions
# Modifications by SimpleCode: replaced xrange with range; appended the stdin harness.
# The MIT license text is in docs/leetcode/LICENSES/MIT.txt
from __future__ import annotations
from typing import Any, Dict, List, Optional, Set, Tuple
# Time:  O(nlogn)
# Space: O(n)

import bisect


class Solution(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        LIS = []
        def insert(target):
            left = bisect.bisect_left(LIS, target)
            # If not found, append the target.
            if left == len(LIS):
                LIS.append(target)
            else:
                LIS[left] = target
    
        for num in nums:
            insert(num)
        return len(LIS)


# Time:  O(nlogn)
# Space: O(n)
class Solution2(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        LIS = []
        def insert(target):
            left, right = 0, len(LIS) - 1
            # Find the first index "left" which satisfies LIS[left] >= target
            while left <= right:
                mid = left + (right - left) // 2
                if LIS[mid] >= target:
                    right = mid - 1
                else:
                    left = mid + 1
            # If not found, append the target.
            if left == len(LIS):
                LIS.append(target)
            else:
                LIS[left] = target

        for num in nums:
            insert(num)

        return len(LIS)


# Time:  O(nlogn)
# Space: O(n)
# bit, fenwick tree
class Solution3(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        class BIT(object):  # 0-indexed.
            def __init__(self, n, default=0, fn=lambda x, y: x+y):
                self.__bit = [default]*(n+1)  # Extra one for dummy node.
                self.__default = default
                self.__fn = fn

            def update(self, i, val):
                i += 1  # Extra one for dummy node.
                while i < len(self.__bit):
                    self.__bit[i] = self.__fn(self.__bit[i], val)
                    i += (i & -i)

            def query(self, i):
                i += 1  # Extra one for dummy node.
                ret = self.__default
                while i > 0:
                    ret = self.__fn(ret, self.__bit[i])
                    i -= (i & -i)
                return ret
    
        lookup = {x:i for i, x in enumerate(sorted(set(nums)))}
        bit = BIT(len(lookup), fn=max)
        for x in nums:
            bit.update(lookup[x], bit.query(lookup[x]-1)+1)
        return bit.query(len(lookup)-1)


# Range Maximum Query
class SegmentTree(object):  # 0-based index
    def __init__(self, N,
                 build_fn=lambda x, y: [y]*(2*x),
                 query_fn=lambda x, y: y if x is None else max(x, y),  # (lambda x, y: y if x is None else min(x, y))
                 update_fn=lambda x, y: y,
                 default_val=0):
        self.N = N
        self.H = (N-1).bit_length()
        self.query_fn = query_fn
        self.update_fn = update_fn
        self.default_val = default_val
        self.tree = build_fn(N, default_val)
        self.lazy = [None]*N

    def __apply(self, x, val):
        self.tree[x] = self.update_fn(self.tree[x], val)
        if x < self.N:
            self.lazy[x] = self.update_fn(self.lazy[x], val)

    def update(self, L, R, h):  # Time: O(logN), Space: O(N)
        def pull(x):
            while x > 1:
                x //= 2
                self.tree[x] = self.query_fn(self.tree[x*2], self.tree[x*2+1])
                if self.lazy[x] is not None:
                    self.tree[x] = self.update_fn(self.tree[x], self.lazy[x])

        L += self.N
        R += self.N
        L0, R0 = L, R
        while L <= R:
            if L & 1:  # is right child
                self.__apply(L, h) 
                L += 1
            if R & 1 == 0:  # is left child
                self.__apply(R, h)
                R -= 1
            L //= 2
            R //= 2
        pull(L0)
        pull(R0)

    def query(self, L, R):  # Time: O(logN), Space: O(N)
        def push(x):
            n = 2**self.H
            while n != 1:
                y = x // n
                if self.lazy[y] is not None:
                    self.__apply(y*2, self.lazy[y])
                    self.__apply(y*2 + 1, self.lazy[y])
                    self.lazy[y] = None
                n //= 2

        result = None
        if L > R:
            return result

        L += self.N
        R += self.N
        push(L)
        push(R)
        while L <= R:
            if L & 1:  # is right child
                result = self.query_fn(result, self.tree[L])
                L += 1
            if R & 1 == 0:  # is left child
                result = self.query_fn(result, self.tree[R])
                R -= 1
            L //= 2
            R //= 2
        return result
    
    def __str__(self):
        showList = []
        for i in range(self.N):
            showList.append(self.query(i, i))
        return ",".join(map(str, showList))


# Time:  O(nlogn)
# Space: O(n)
# optimized from Solution5
class Solution4(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        val_to_idx = {num:i for i, num in enumerate(sorted(set(nums)))}
        st = SegmentTree(len(val_to_idx))
        for x in nums:
            st.update(val_to_idx[x], val_to_idx[x], st.query(0, val_to_idx[x]-1)+1 if val_to_idx[x] >= 1 else 1)
        return st.query(0, len(val_to_idx)-1) if len(val_to_idx) >= 1 else 0


# Time:  O(n^2)
# Space: O(n)
# Traditional DP solution.
class Solution5(object):
    def lengthOfLIS(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        dp = []  # dp[i]: the length of LIS ends with nums[i]
        for i in range(len(nums)):
            dp.append(1)
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp) if dp else 0

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
    nums = [int(take()) for _ in range(int(take()))]
    __sc_show(Solution().lengthOfLIS(nums))

__sc_main()

---
language: linux
chapter: 11
title: "Linux Users and Groups"
level: intermediate
minutes: 6
goals:
  - "Read uid and gid with id"
  - "Confirm only root exists"
  - "Skip useradd"
sources:
  - v86-buildroot
updated: "2026-10-16"
---

The teaching image has a single user, root. The group is root as well. Nothing here provides a writable account database.

### id prints the uid and the gid

Both numbers are 0, and the name sits in parentheses. That one line comes from BusyBox id, not from the long procps table.

```linux run expect="gid=0(root)" title="User and group"
id
```

The line includes `gid=0(root)`.

### Only root is present

`whoami` can print only root. Home is /root, and the tilde in the prompt points at that same directory.

```linux run expect="root" title="Login name"
whoami
```

The login name is `root`.

### useradd is missing from the image

Creating a user or a group needs the matching applet and a writable account file. Neither is prepared on this guest. The sample is here for comparison only.

```linux norun title="Do not add a user"
useradd student
```

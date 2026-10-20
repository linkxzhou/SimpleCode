---
language: linux
chapter: 37
title: "Linux archives"
level: intermediate
minutes: 8
goals:
  - "Pack note.txt into a tar and list it"
  - "Gzip a file and decompress it"
  - "Read tea back after extracting the archive"
sources:
  - v86-buildroot
updated: "2026-10-20"
---

tar -c packs, -t only lists names, and -C chooses the directory to enter before adding files. gzip -c writes to standard output, and -d decompresses. Each Run gets a fresh /tmp.

### The archive lists note.txt

note.txt is written under /tmp/pack. tar -cf builds /tmp/box.tar, and -tf lists note.txt.

```linux run expect="note.txt" title="List the note"
mkdir -p /tmp/pack
printf 'tea\n' > /tmp/pack/note.txt
tar -cf /tmp/box.tar -C /tmp/pack note.txt
tar -tf /tmp/box.tar
```

### Decompression still yields tea

gzip -c compresses note.txt, and gzip -dc decompresses it. The text is still tea.

```linux run expect="tea" title="Decompress tea"
mkdir -p /tmp/pack
printf 'tea\n' > /tmp/pack/note.txt
gzip -c /tmp/pack/note.txt | gzip -dc
```

### Extracting the archive prints tea

tar in this BusyBox build does not accept -z. Compression stays with gzip in the previous section. tar only packs and extracts. After extracting into /tmp/out, cat prints tea.

```linux run expect="tea" title="Read the extract"
mkdir -p /tmp/pack /tmp/out
printf 'tea\n' > /tmp/pack/note.txt
tar -cf /tmp/box.tar -C /tmp/pack note.txt
tar -xf /tmp/box.tar -C /tmp/out
cat /tmp/out/note.txt
```

### reboot stays unread

reboot would try to restart the guest. These snapshot lessons do not run it. Pack and compress with tar and gzip above.

```linux norun title="Do not reboot"
reboot
```

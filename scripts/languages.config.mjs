// Language definitions ported from thirdparty/runno/packages/runtime/lib/commands.ts
// `{entry}` is replaced with the program path (/program) at run time.
export const assets = {
  "python-wasm": "python-3.11.3.wasm",
  "python-fs": "python-3.11.3.tar.gz",
  "ruby-wasm": "ruby-3.2.0.wasm",
  "ruby-fs": "ruby-3.2.0.tar.gz",
  "quickjs-wasm": "wasmedge_quickjs.wasm",
  "sqlite-wasm": "sqlite.wasm",
  "php-wasm": "php-cgi-8.2.0.wasm",
  "clang-wasm": "clang.wasm",
  "wasm-ld": "wasm-ld.wasm",
  "clang-fs": "clang-fs.tar.gz",
};

const clangLink = (extra) => ({
  step: "link",
  asset: "wasm-ld",
  binaryName: "wasm-ld",
  args: [
    "--no-threads", "--export-dynamic", "-z", "stack-size=1048576",
    "-L/sys/lib/wasm32-wasi", "/sys/lib/wasm32-wasi/crt1.o", "/program.o",
    ...extra, "-o", "/program.wasm",
  ],
});

export const languages = [
  {
    id: "python", label: "Python", short: "Py", version: "3.11.3", syntax: "python", fileName: "main.py",
    run: { asset: "python-wasm", binaryName: "python", args: ["{entry}"], baseFS: "python-fs" },
  },
  {
    id: "ruby", label: "Ruby", short: "Rb", version: "3.2.0", syntax: "ruby", fileName: "main.rb",
    run: { asset: "ruby-wasm", binaryName: "ruby", args: ["-r", "/ruby-3.2.0/.rubyopts.rb", "{entry}"], baseFS: "ruby-fs" },
  },
  {
    id: "quickjs", label: "QuickJS", short: "JS", version: "wasmedge", syntax: "javascript", fileName: "main.js",
    run: { asset: "quickjs-wasm", binaryName: "quickjs", args: ["{entry}"] },
  },
  {
    id: "sqlite", label: "SQLite", short: "SQL", version: "3", syntax: "sql", fileName: "main.sql",
    run: { asset: "sqlite-wasm", binaryName: "sqlite", args: ["-batch", "-cmd", ".read {entry}"] }, autoEOF: true,
  },
  {
    id: "clang", label: "C", short: "C", version: "clang 8", syntax: "c", fileName: "main.c",
    prepare: [
      {
        step: "compile", asset: "clang-wasm", binaryName: "clang", baseFS: "clang-fs",
        args: [
          "-cc1", "-Werror", "-triple", "wasm32-unkown-wasi", "-isysroot", "/sys",
          "-internal-isystem", "/sys/include", "-internal-isystem", "/sys/lib/clang/8.0.1/include",
          "-ferror-limit", "4", "-fmessage-length", "80", "-fcolor-diagnostics", "-O2",
          "-emit-obj", "-o", "/program.o", "{entry}",
        ],
      },
      clangLink(["-lc"]),
    ],
    run: { fsPath: "/program.wasm", binaryName: "program", args: [] },
  },
  {
    id: "clangpp", label: "C++", short: "C++", version: "clang 8", syntax: "cpp", fileName: "main.cpp",
    prepare: [
      {
        step: "compile", asset: "clang-wasm", binaryName: "clang", baseFS: "clang-fs",
        args: [
          "-cc1", "-Werror", "-emit-obj", "-disable-free", "-isysroot", "/sys",
          "-internal-isystem", "/sys/include/c++/v1", "-internal-isystem", "/sys/include",
          "-internal-isystem", "/sys/lib/clang/8.0.1/include", "-ferror-limit", "4",
          "-fmessage-length", "80", "-fcolor-diagnostics", "-O2", "-o", "/program.o",
          "-x", "c++", "{entry}",
        ],
      },
      clangLink(["-lc", "-lc++", "-lc++abi"]),
    ],
    run: { fsPath: "/program.wasm", binaryName: "program", args: [] },
  },
  {
    id: "php-cgi", label: "PHP", short: "PHP", version: "8.2.0", syntax: "php", fileName: "main.php",
    run: { asset: "php-wasm", binaryName: "php", args: ["-q", "{entry}"] },
  },
];

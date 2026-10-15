import { writeBook } from "./lib.mjs";
import { pages as python } from "./books/python.mjs";
import { pages as js } from "./books/js.mjs";
import { pages as go } from "./books/go.mjs";
import { pages as ruby } from "./books/ruby.mjs";
import { pages as sqlite } from "./books/sqlite.mjs";
import { pages as c } from "./books/c.mjs";

const root = new URL("../..", import.meta.url).pathname;
writeBook(root, "python", python);
writeBook(root, "js", js);
writeBook(root, "go", go);
writeBook(root, "ruby", ruby);
writeBook(root, "sqlite", sqlite);
writeBook(root, "c", c);
console.log(`wrote python ${python.length}, js ${js.length}, go ${go.length}, ruby ${ruby.length}, sqlite ${sqlite.length}, c ${c.length}`);

import { writeBook } from "./lib.mjs";
import { pages as python } from "./books/python.mjs";
import { pages as js } from "./books/js.mjs";
import { pages as go } from "./books/go.mjs";
import { pages as ruby } from "./books/ruby.mjs";

const root = new URL("../..", import.meta.url).pathname;
writeBook(root, "python", python);
writeBook(root, "js", js);
writeBook(root, "go", go);
writeBook(root, "ruby", ruby);
console.log(`wrote python ${python.length}, js ${js.length}, go ${go.length}, ruby ${ruby.length}`);

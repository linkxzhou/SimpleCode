import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  COMMENT_THEME_COLOR,
  EDITOR_FONT_SIZE,
  EDITOR_LINE_HEIGHT,
  commentFontSize,
  commentTypographyCss,
  findCommentTokenClass,
} from "../src/core/commentFont.ts";

const sampleCss = `
.mtk1 { color: #000000; }
.mtk8 { color: #008000; }
.mtk12 { color: #608b4e; }
.mtki { font-style: italic; }
`;

describe("comment font", () => {
  it("is one pixel smaller than the editor font", () => {
    assert.equal(EDITOR_FONT_SIZE, 14);
    assert.equal(commentFontSize(EDITOR_FONT_SIZE), 13);
    assert.equal(EDITOR_LINE_HEIGHT, 22);
  });

  it("finds the comment class by its dedicated color", () => {
    assert.equal(findCommentTokenClass(sampleCss, COMMENT_THEME_COLOR["simplecode-light"]), "mtk8");
    assert.equal(findCommentTokenClass(sampleCss, COMMENT_THEME_COLOR["simplecode-dark"]), "mtk12");
    assert.equal(findCommentTokenClass(sampleCss, "ff00ff"), null);
  });

  it("does not treat a longer color as the comment color", () => {
    const css = ".mtk3 { color: #008000aa; }\n.mtk4 { color: #008000; }";
    assert.equal(findCommentTokenClass(css, "008000"), "mtk4");
  });

  it("locks line height and does not recolor the token", () => {
    const css = commentTypographyCss("mtk8");
    assert.match(css, /span\.mtk8/);
    assert.match(css, /font-size:\s*13px/);
    assert.match(css, /line-height:\s*22px/);
    assert.equal(css.includes("color"), false);
    assert.equal(css.includes("letter-spacing"), false);
  });

  it("gives each theme its own comment color in the Monaco theme", () => {
    const source = readFileSync(new URL("../src/core/monaco.ts", import.meta.url), "utf8");
    assert.match(source, /token:\s*"comment",\s*foreground:\s*COMMENT_THEME_COLOR\["simplecode-light"\]/);
    assert.match(source, /token:\s*"comment",\s*foreground:\s*COMMENT_THEME_COLOR\["simplecode-dark"\]/);
    assert.notEqual(COMMENT_THEME_COLOR["simplecode-light"].toLowerCase(), COMMENT_THEME_COLOR["simplecode-dark"].toLowerCase());
  });
});

import { expect, it, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { ruby } from "../../packages/mdit-ruby/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkRuby } from "../../packages/remd-ruby/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(ruby).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRuby)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src)
    )
  );

describe("ruby + attrs: ruby with heading attrs", () => {
  const input = "## Kanji {.kanji}\n\n{漢字|かんじ}";
  const expected =
    '<h2 class="kanji">Kanji</h2><p><ruby>漢字<rt>かんじ</rt></ruby></p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("ruby + attrs: ruby and block attrs coexist", () => {
  const input = "Read {漢字|かんじ} carefully. {.note}";
  const expected =
    '<p class="note">Read <ruby>漢字<rt>かんじ</rt></ruby> carefully.</p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("ruby + attrs: ruby and attrs coexist without interference", () => {
  const input = "{日本|にほん}語\n\n{漢字|かんじ}";
  const expected =
    "<p><ruby>日本<rt>にほん</rt></ruby>語</p><p><ruby>漢字<rt>かんじ</rt></ruby></p>";

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

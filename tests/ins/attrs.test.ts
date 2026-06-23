import { expect, it, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { ins } from "../../packages/mdit-ins/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkIns } from "../../packages/remd-ins/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(ins).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkIns)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src)
    )
  );

describe("ins + attrs: ins inline with class attr", () => {
  const input = "++inserted++{.new}";
  const expected = '<p><ins class="new">inserted</ins></p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("ins + attrs: ins inline with id attr", () => {
  const input = "++added++{#ins-1}";
  const expected = '<p><ins id="ins-1">added</ins></p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("ins + attrs: ins with heading attrs", () => {
  const input = "## New Section {.new}\n\n++inserted content++";
  const expected =
    '<h2 class="new">New Section</h2><p><ins>inserted content</ins></p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("ins + attrs: ins and block attrs coexist", () => {
  const input = "Some ++inserted++ text here. {.updated}";
  const expected = '<p class="updated">Some <ins>inserted</ins> text here.</p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

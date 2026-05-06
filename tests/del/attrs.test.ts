import { expect, test, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { del } from "../../packages/mdit-del/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkDel } from "../../packages/remd-del/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(del).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkDel)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src),
    ),
  );

describe("del + attrs: del inline with class attr", () => {
  const input = "--deleted--{.removed}";
  const expected = '<p><del class="removed">deleted</del></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("del + attrs: del inline with id attr", () => {
  const input = "--removed--{#del-1}";
  const expected = '<p><del id="del-1">removed</del></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("del + attrs: del with heading attrs", () => {
  const input = "## Old Title {.deprecated}\n\n--deprecated--";
  const expected = '<h2 class="deprecated">Old Title</h2><p><del>deprecated</del></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("del + attrs: del and block attrs coexist", () => {
  const input = "Some --deleted-- text and more. {.updated}";
  const expected = '<p class="updated">Some <del>deleted</del> text and more.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

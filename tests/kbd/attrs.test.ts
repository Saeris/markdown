import { expect, test, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { kbd } from "../../packages/mdit-kbd/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkKbd } from "../../packages/remd-kbd/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(kbd).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkKbd)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src),
    ),
  );

describe("kbd + attrs: kbd inline with class attr", () => {
  const input = "[[Ctrl]]{.key}";
  const expected = '<p><kbd class="key">Ctrl</kbd></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("kbd + attrs: kbd inline with id attr", () => {
  const input = "[[Enter]]{#enter-key}";
  const expected = '<p><kbd id="enter-key">Enter</kbd></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("kbd + attrs: kbd with heading attrs", () => {
  const input = "## Shortcuts {.shortcuts}\n\nPress [[Ctrl]].";
  const expected = '<h2 class="shortcuts">Shortcuts</h2><p>Press <kbd>Ctrl</kbd>.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("kbd + attrs: kbd and block attrs coexist", () => {
  const input = "Press [[Ctrl]] to copy text. {.tip}";
  const expected = '<p class="tip">Press <kbd>Ctrl</kbd> to copy text.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

import { expect, test, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { mark } from "../../packages/mdit-mark/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkMark } from "../../packages/remd-mark/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(mark).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMark)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src),
    ),
  );

describe("mark + attrs: mark inline with class attr", () => {
  const input = "==highlighted=={.highlight}";
  const expected = '<p><mark class="highlight">highlighted</mark></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("mark + attrs: mark inline with id attr", () => {
  const input = "==important=={#key-point}";
  const expected = '<p><mark id="key-point">important</mark></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("mark + attrs: mark with heading attrs", () => {
  const input = "## Key Terms {.terms}\n\n==highlighted== text.";
  const expected = '<h2 class="terms">Key Terms</h2><p><mark>highlighted</mark> text.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("mark + attrs: mark and block attrs coexist", () => {
  const input = "See ==important== note here. {.callout}";
  const expected = '<p class="callout">See <mark>important</mark> note here.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

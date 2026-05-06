import { expect, test, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { sup } from "../../packages/mdit-sup/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkSup } from "../../packages/remd-sup/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(sup).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkSup)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src),
    ),
  );

describe("sup + attrs: sup inline with class attr", () => {
  const input = "E=mc^2^{.physics}";
  const expected = '<p>E=mc<sup class="physics">2</sup></p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("sup + attrs: sup with heading attrs", () => {
  const input = "## References {.refs}\n\nSee note^1^.";
  const expected = '<h2 class="refs">References</h2><p>See note<sup>1</sup>.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

describe("sup + attrs: sup and block attrs coexist", () => {
  const input = "Area is r^2^ × π. {.math}";
  const expected = '<p class="math">Area is r<sup>2</sup> × π.</p>';

  test("markdown-it", () => expect(normalizeHtml(md.render(input))).toBe(expected));
  test("remark", () => expect(remd(input)).toBe(expected));
});

import { expect, it, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { sub } from "../../packages/mdit-sub/src";
import { attrs } from "../../packages/mdit-attrs/src";
import { remarkSub } from "../../packages/remd-sub/src";
import { remarkAttrs } from "../../packages/remd-attrs/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(sub).use(attrs);

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm, { singleTilde: false })
        .use(remarkSub)
        .use(remarkAttrs)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(src)
    )
  );

describe("sub + attrs: sub inline with block attr on paragraph", () => {
  const input = "H~2~O molecule. {.chemical}";
  const expected = '<p class="chemical">H<sub>2</sub>O molecule.</p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("sub + attrs: sub with heading attrs", () => {
  const input = "## Formulas {.formulas}\n\nH~2~O";
  const expected = '<h2 class="formulas">Formulas</h2><p>H<sub>2</sub>O</p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

describe("sub + attrs: sub and block attrs coexist", () => {
  const input = "Water is H~2~O and CO~2~. {.chemistry}";
  const expected =
    '<p class="chemistry">Water is H<sub>2</sub>O and CO<sub>2</sub>.</p>';

  it("markdown-it", () =>
    expect(normalizeHtml(md.render(input))).toBe(expected));
  it("remark", () => expect(remd(input)).toBe(expected));
});

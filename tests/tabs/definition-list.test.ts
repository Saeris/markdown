import { expect, it, describe } from "vite-plus/test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkTabs, tabsHastHandlers } from "../../packages/remd-tabs/src";
import {
  remarkDefinitionList,
  defListHastHandlers
} from "../../packages/remd-definition-list/src";
import { normalizeHtml } from "../utils/index.js";

const remd = (src: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkDefinitionList)
        .use(remarkTabs)
        .use(remarkRehype, {
          handlers: { ...defListHastHandlers, ...tabsHastHandlers } as never
        })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .processSync(src)
    )
  );

describe("tabs + definition-list", () => {
  describe("definition list inside a Demo/Code tab pair", () => {
    const src = `% Demo
> Apple
> : A round fruit with red or green skin.
> : Also a technology company.
% Code
> \`\`\`\`markdown
> Apple
> : A round fruit with red or green skin.
> : Also a technology company.
> \`\`\`\``;

    it("remark: Demo and Code are sibling tabs", () => {
      const html = remd(src);
      const labels = [
        ...html.matchAll(/class="markdown-tabs-label"[^>]*>([^<]+)</g)
      ].map((m) => m[1]);
      expect(labels).toEqual(["Demo", "Code"]);
    });

    it("remark: Demo panel contains a definition list", () => {
      const html = remd(src);
      const demoPanel =
        /<section[^>]*aria-label="Demo">.*?<\/section>/s.exec(html)?.[0] ?? "";
      expect(demoPanel).toContain("<dl>");
      expect(demoPanel).toContain("<dt>");
      expect(demoPanel).toContain("<dd>");
    });

    it("remark: Code panel contains a code fence, not a definition list", () => {
      const html = remd(src);
      const codePanel =
        /<section[^>]*aria-label="Code">.*?<\/section>/s.exec(html)?.[0] ?? "";
      expect(codePanel).toContain("<pre>");
      expect(codePanel).not.toContain("<dl>");
    });
  });

  describe("definition list with multiple terms inside Demo/Code", () => {
    const src = `% Demo
> HTTP
> HTTPS
> : Protocols for transferring data on the web.
% Code
> \`\`\`\`markdown
> HTTP
> HTTPS
> : Protocols for transferring data on the web.
> \`\`\`\``;

    it("remark: Demo and Code are sibling tabs", () => {
      const html = remd(src);
      const labels = [
        ...html.matchAll(/class="markdown-tabs-label"[^>]*>([^<]+)</g)
      ].map((m) => m[1]);
      expect(labels).toEqual(["Demo", "Code"]);
    });

    it("remark: % Code is not absorbed into the definition list body", () => {
      const html = remd(src);
      const demoPanel =
        /<section[^>]*aria-label="Demo">.*?<\/section>/s.exec(html)?.[0] ?? "";
      expect(demoPanel).not.toContain("% Code");
    });
  });
});

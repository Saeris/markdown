import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkDel } from "@saeris/remd-del";
import { normalizeHtml } from "../utils/index.js";

const fixture = readFileSync(join(import.meta.dirname, "fixtures/del.md"), "utf8");
const expected = normalizeHtml(
  readFileSync(join(import.meta.dirname, "expected/del.html"), "utf8"),
);

const processor = unified().use(remarkParse).use(remarkDel).use(remarkRehype).use(rehypeStringify);

test("del (remark)", () => {
  expect(normalizeHtml(String(processor.processSync(fixture)))).toBe(expected);
});

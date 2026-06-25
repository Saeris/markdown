import type MarkdownIt from "markdown-it";
import { attrs } from "@mirrordown/mdit-attrs";

export function extendMarkdownIt(md: MarkdownIt): MarkdownIt {
  return md.use(attrs);
}

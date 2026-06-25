import type MarkdownIt from "markdown-it";
import { dl } from "@mirrordown/mdit-definition-list";

export function extendMarkdownIt(md: MarkdownIt): MarkdownIt {
  return md.use(dl);
}

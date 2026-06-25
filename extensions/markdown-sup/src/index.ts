import type MarkdownIt from "markdown-it";
import { sup } from "@mirrordown/mdit-sup";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(sup)
});

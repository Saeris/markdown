import type MarkdownIt from "markdown-it";
import { ins } from "@mirrordown/mdit-ins";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(ins)
});

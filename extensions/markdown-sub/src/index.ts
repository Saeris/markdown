import type MarkdownIt from "markdown-it";
import { sub } from "@mirrordown/mdit-sub";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(sub)
});

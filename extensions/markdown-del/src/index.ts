import type MarkdownIt from "markdown-it";
import { del } from "@mirrordown/mdit-del";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(del)
});

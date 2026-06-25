import type MarkdownIt from "markdown-it";
import { ruby } from "@mirrordown/mdit-ruby";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(ruby)
});

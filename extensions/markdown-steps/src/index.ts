import type MarkdownIt from "markdown-it";
import { steps } from "@mirrordown/mdit-steps";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(steps)
});

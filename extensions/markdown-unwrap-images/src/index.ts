import type MarkdownIt from "markdown-it";
import { unwrapImages } from "@mirrordown/mdit-unwrap-images";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(unwrapImages)
});

import type MarkdownIt from "markdown-it";
import { unwrapImages } from "@saeris/mdit-unwrap-images";

export const activate = () => ({
  extendMarkdownIt: (md: MarkdownIt) => md.use(unwrapImages)
});

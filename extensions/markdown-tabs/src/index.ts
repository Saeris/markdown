import type MarkdownIt from "markdown-it";
import { tabs } from "@saeris/mdit-tabs";

export const activate = () => ({
  extendMarkdownIt: (md: MarkdownIt) => md.use(tabs)
});

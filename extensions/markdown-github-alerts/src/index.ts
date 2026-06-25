import type MarkdownIt from "markdown-it";
import { githubAlerts } from "@mirrordown/mdit-github-alerts";

export const activate = (): {
  extendMarkdownIt: (md: MarkdownIt) => MarkdownIt;
} => ({
  extendMarkdownIt: (md: MarkdownIt): MarkdownIt => md.use(githubAlerts)
});

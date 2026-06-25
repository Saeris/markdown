import type MarkdownIt from "markdown-it";
import { plugin } from "@mirrordown/mdit-<name>";

export function extendMarkdownIt(md: MarkdownIt): MarkdownIt {
  return md.use(plugin);
}

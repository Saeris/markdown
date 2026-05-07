import type { PluginSimple } from "markdown-it";

export const unwrapImages: PluginSimple = (md) => {
  md.core.ruler.push("unwrap_images", (state) => {
    const tokens = state.tokens;
    let i = 0;

    while (i < tokens.length) {
      const open = tokens[i];

      if (open?.type !== "paragraph_open") {
        i++;
        continue;
      }

      const inline = tokens[i + 1];
      const close = tokens[i + 2];

      if (inline?.type !== "inline" || close?.type !== "paragraph_close") {
        i++;
        continue;
      }

      const children = inline.children ?? [];

      // A paragraph is unwrappable if every non-softbreak child is an image,
      // and there is at least one image.
      let hasImage = false;
      let hasOther = false;

      for (const child of children) {
        if (child.type === "image") {
          hasImage = true;
        } else if (child.type !== "softbreak") {
          hasOther = true;
          break;
        }
      }

      if (!hasImage || hasOther) {
        i++;
        continue;
      }

      // Replace paragraph_open + inline + paragraph_close with
      // individual inline tokens for each image child.
      const replacements = children.filter((c) => c.type !== "softbreak");
      tokens.splice(i, 3, ...replacements);
      i += replacements.length;
    }
  });
};

import { SKIP, visit } from "unist-util-visit";
import { whitespace } from "hast-util-whitespace";
import type { Element, Root } from "hast";
import type { Plugin } from "unified";

// Inline of hast-util-interactive: an element is interactive if it is
// an anchor or button (the only interactive elements that can wrap images).
const isInteractive = (node: Element): boolean => node.tagName === "a" || node.tagName === "button";

const unknown = 1 as const;
const containsImage = 2 as const;
const containsOther = 3 as const;
type Result = typeof unknown | typeof containsImage | typeof containsOther;

const applicable = (node: Element, inLink: boolean): Result => {
  let image: Result = unknown;

  for (const child of node.children) {
    if (child.type === "text" && whitespace(child.value)) {
      // whitespace-only text is fine
    } else if (child.type === "element" && child.tagName === "img") {
      image = containsImage;
    } else if (!inLink && child.type === "element" && isInteractive(child)) {
      const linkResult = applicable(child, true);
      if (linkResult === containsOther) return containsOther;
      if (linkResult === containsImage) image = containsImage;
    } else {
      return containsOther;
    }
  }

  return image;
};

export const rehypeUnwrapImages: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, index, parent) => {
    if (
      node.tagName === "p" &&
      parent &&
      typeof index === "number" &&
      applicable(node, false) === containsImage
    ) {
      parent.children.splice(index, 1, ...node.children);
      return [SKIP, index];
    }
  });
};

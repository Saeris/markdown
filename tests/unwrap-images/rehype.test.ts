import { expect, test, describe } from "vite-plus/test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeUnwrapImages } from "../../packages/remd-unwrap-images/src";
import { normalizeHtml } from "../utils/index.js";

const process = (html: string) =>
  normalizeHtml(
    String(
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeUnwrapImages)
        .use(rehypeStringify)
        .processSync(html),
    ),
  );

describe("unwrap-images (rehype): block image — sole image in paragraph", () => {
  const input = "![alt](example.png)";
  const expected = '<img src="example.png" alt="alt">';
  test("unwraps", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): block image with title", () => {
  const input = '![alt](example.png "a title")';
  const expected = '<img src="example.png" alt="alt" title="a title">';
  test("unwraps", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): two block images separated by blank line", () => {
  const input = "![first](a.png)\n\n![second](b.png)";
  const expected = '<img src="a.png" alt="first"><img src="b.png" alt="second">';
  test("unwraps both", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): block image surrounded by paragraphs", () => {
  const input = "Paragraph before\n\n![alt](img.png)\n\nParagraph after";
  const expected = '<p>Paragraph before</p><img src="img.png" alt="alt"><p>Paragraph after</p>';
  test("unwraps only the image paragraph", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): inline image within text — not unwrapped", () => {
  const input = "Here is an inline ![alt](img.png) image.";
  const expected = '<p>Here is an inline <img src="img.png" alt="alt"> image.</p>';
  test("leaves paragraph intact", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): image in a link — unwrapped", () => {
  const input = "[![alt](img.png)](https://example.com)";
  const expected = '<a href="https://example.com"><img src="img.png" alt="alt"></a>';
  test("unwraps the linked image", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): image in link with other text — not unwrapped", () => {
  const input = "[![alt](img.png) caption](https://example.com)";
  const expected = '<p><a href="https://example.com"><img src="img.png" alt="alt"> caption</a></p>';
  test("leaves paragraph intact", () => expect(process(input)).toBe(expected));
});

describe("unwrap-images (rehype): plain text paragraph — not unwrapped", () => {
  const input = "Just some text.";
  const expected = "<p>Just some text.</p>";
  test("leaves paragraph intact", () => expect(process(input)).toBe(expected));
});

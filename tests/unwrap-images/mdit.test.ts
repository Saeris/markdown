import { expect, test, describe } from "vite-plus/test";
import MarkdownIt from "markdown-it";
import { unwrapImages } from "../../packages/mdit-unwrap-images/src";
import { normalizeHtml } from "../utils/index.js";

const md = new MarkdownIt().use(unwrapImages);
const render = (src: string) => normalizeHtml(md.render(src));

describe("unwrap-images (markdown-it): block image — sole image on its own paragraph", () => {
  const input = "![alt text](example.png)";
  const expected = '<img src="example.png" alt="alt text">';
  test("unwraps", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): block image with title", () => {
  const input = '![alt text](example.png "a title")';
  const expected = '<img src="example.png" alt="alt text" title="a title">';
  test("unwraps", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): block image with trailing whitespace", () => {
  const input = "![alt text](example.png)   ";
  const expected = '<img src="example.png" alt="alt text">';
  test("unwraps", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): two consecutive block images separated by blank line", () => {
  const input = "![first](a.png)\n\n![second](b.png)";
  const expected = '<img src="a.png" alt="first"><img src="b.png" alt="second">';
  test("unwraps both", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): block image surrounded by paragraphs", () => {
  const input = "Paragraph before\n\n![alt](img.png)\n\nParagraph after";
  const expected = '<p>Paragraph before</p><img src="img.png" alt="alt"><p>Paragraph after</p>';
  test("unwraps only the image paragraph", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): inline image within text — not unwrapped", () => {
  const input = "Here is an inline ![alt](img.png) image.";
  const expected = '<p>Here is an inline <img src="img.png" alt="alt"> image.</p>';
  test("leaves paragraph intact", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): image preceded by text on same paragraph — not unwrapped", () => {
  const input = "Text before\n![alt](img.png)";
  const expected = '<p>Text before\n<img src="img.png" alt="alt"></p>';
  test("leaves paragraph intact", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): image followed by text on same paragraph — not unwrapped", () => {
  const input = "![alt](img.png)\ntext after";
  const expected = '<p><img src="img.png" alt="alt">\ntext after</p>';
  test("leaves paragraph with text after intact", () => expect(render(input)).toBe(expected));
});

describe("unwrap-images (markdown-it): two images without blank line between — unwrapped", () => {
  const input = "![first](a.png)\n![second](b.png)";
  const expected = '<img src="a.png" alt="first"><img src="b.png" alt="second">';
  test("unwraps both images", () => expect(render(input)).toBe(expected));
});

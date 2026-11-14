import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentBlocks, ContentRoot, OptionView } from "./ContentBlocks";
import { SAMPLE_QUESTIONS } from "./samples";

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("renderer", () => {
  for (const q of SAMPLE_QUESTIONS) {
    it(`draws the ${q.id} sample without problems`, () => {
      const out = html(
        <ContentRoot>
          <ContentBlocks content={q.question} />
          {q.options.map((o) => <OptionView key={o.label} option={o} />)}
          <ContentBlocks content={q.explanation} />
        </ContentRoot>,
      );
      expect(out).not.toContain("cf-problem");
      expect(out).not.toContain("NaN");
      expect(out).not.toContain("undefined");
      const diagrams = [...q.question, ...q.explanation].filter((b) => b.type === "diagram").length;
      expect((out.match(/class="cf-dg"/g) ?? []).length).toBe(diagrams);
    });
  }

  it("renders a legacy string as text with maths and bold", () => {
    const out = html(<ContentBlocks content={"Find **x** if $x^2 = 4$.\n- one\n- two"} />);
    expect(out).toContain("<strong>x</strong>");
    expect(out).toContain('class="katex"');
    expect((out.match(/<li>/g) ?? []).length).toBe(2);
  });

  it("never passes raw HTML through", () => {
    const out = html(<ContentBlocks content={'<img src=x onerror="alert(1)"> <script>alert(1)</script>'} />);
    expect(out).not.toContain("<script>");
    expect(out).not.toContain("<img src=x");
    expect(out).toContain("&lt;script&gt;");
  });

  it("only shows http(s) or data images from text", () => {
    expect(html(<ContentBlocks content={"![fig](https://res.cloudinary.com/a.webp)"} />)).toContain('src="https://res.cloudinary.com/a.webp"');
    expect(html(<ContentBlocks content={"![fig](javascript:alert(1))"} />)).not.toContain("<img");
  });

  it("shows what is wrong instead of a broken diagram", () => {
    const out = html(<ContentBlocks content={[{ type: "diagram", diagram: { kind: "pie", slices: [{ label: "a", value: 50 }] } }]} />);
    expect(out).toContain("cf-problem");
    expect(out).toContain("add up to 50%");
    expect(out).not.toContain("cf-dg");
  });

  it("marks generated diagrams as not to scale", () => {
    const out = html(
      <ContentBlocks content={[{ type: "diagram", diagram: { kind: "geometry", generated: true, points: { A: [0, 0], B: [3, 0] }, segments: [["A", "B"]] } }]} />,
    );
    expect(out).toContain("NOT TO SCALE");
  });

  it("uses commas in a question series and arrows in an explanation series", () => {
    const q = html(<ContentBlocks content={[{ type: "series", items: [1, 2, "?"] }]} />);
    expect(q).toContain("cf-s-comma");
    expect(q).not.toContain("cf-s-arrow");
    expect(q).toContain("cf-ask");
    const e = html(<ContentBlocks content={[{ type: "series", items: [1, 2, 3], diffs: ["+1", "+1"], found: 2 }]} />);
    expect(e).toContain("cf-s-arrow");
    expect(e).toContain("cf-found");
  });
});

describe("number line", () => {
  it("names each marked value above its own dot", () => {
    const out = renderToStaticMarkup(
      <ContentBlocks content={[{ type: "diagram", diagram: { kind: "numberline", min: 0, max: 9, marks: [5, 6, 7], marksLabel: "5, 6, 7" } }]} />,
    );
    const dots = [...out.matchAll(/<circle cx="([\d.]+)" cy="[\d.]+" r="4" class="right-fill"/g)].map((m) => Number(m[1]));
    const names = [...out.matchAll(/<text x="([\d.]+)"[^>]*class="small mono bold right-text">(\d+)<\/text>/g)].map((m) => [Number(m[1]), m[2]]);
    expect(names).toEqual(dots.map((x, i) => [x, String([5, 6, 7][i])]));
    // the label only repeats the numbers, so it isn't drawn a second time
    expect(out).not.toContain(">5, 6, 7<");
  });
  it("keeps a label that adds information", () => {
    const out = renderToStaticMarkup(
      <ContentBlocks content={[{ type: "diagram", diagram: { kind: "numberline", min: 0, max: 9, marks: [5, 6, 7], marksLabel: "3 integers" } }]} />,
    );
    expect(out).toContain(">3 integers<");
  });
});

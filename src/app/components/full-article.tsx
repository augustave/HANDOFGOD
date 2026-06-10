import { Fragment, type ReactNode } from "react";
import { ARTICLE } from "../data/article";
import { TornEdge } from "./dossier-components";

// Inline emphasis: **bold**, *italic*, _italic_.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) nodes.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3] !== undefined) nodes.push(<em key={key++}>{m[3]}</em>);
    else if (m[4] !== undefined) nodes.push(<em key={key++}>{m[4]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { type: "h1" | "h2" | "p" | "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "hr" };

// Split the body into blocks on blank lines, classify each.
function parseBlocks(body: string): Block[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      if (/^-{3,}$/.test(chunk)) return { type: "hr" };
      const lines = chunk.split("\n").map((l) => l.trim());
      if (lines.every((l) => /^[-•]\s+/.test(l))) {
        return { type: "ul", items: lines.map((l) => l.replace(/^[-•]\s+/, "")) };
      }
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      if (chunk.startsWith("# ")) return { type: "h1", text: chunk.slice(2).trim() };
      if (chunk.startsWith("> ")) {
        const text = chunk
          .split("\n")
          .map((l) => l.replace(/^>\s?/, ""))
          .join(" ")
          .trim();
        return { type: "quote", text };
      }
      return { type: "p", text: chunk.split("\n").join(" ") };
    });
}

export function FullArticle() {
  const blocks = parseBlocks(ARTICLE.body);

  return (
    <article className="max-w-3xl mx-auto">
      <TornEdge />

      <div className="font-mono text-[11px] text-stamp-red font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 flex items-center gap-3">
        <span className="w-3 h-px bg-stamp-red" /> {ARTICLE.code} // FULL TRANSCRIPT
      </div>

      <h1 className="text-[clamp(2.5rem,10vw,5rem)] md:text-7xl font-black mb-6 tracking-normal uppercase leading-[0.85] text-ink-black">
        {ARTICLE.title}
      </h1>

      {ARTICLE.subtitle && (
        <p className="text-2xl md:text-3xl font-serif italic text-ink-black/55 mb-16 leading-snug">
          {ARTICLE.subtitle}
        </p>
      )}

      <div className="space-y-8 text-xl md:text-2xl leading-relaxed opacity-95 text-ink-black/90">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "hr":
              return <div key={i} className="w-24 h-px bg-ink-black/20 my-16 mx-auto" />;
            case "ul":
              return (
                <ul key={i} className="list-disc pl-8 space-y-3 marker:text-stamp-red">
                  {block.items.map((item, j) => (
                    <li key={j}>{renderInline(item)}</li>
                  ))}
                </ul>
              );
            case "h1":
              return (
                <h2
                  key={i}
                  className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.9] text-ink-black pt-12"
                >
                  {renderInline(block.text)}
                </h2>
              );
            case "h2":
              return (
                <h3
                  key={i}
                  className="text-2xl md:text-3xl font-black uppercase tracking-tight text-ink-black pt-8"
                >
                  {renderInline(block.text)}
                </h3>
              );
            case "quote":
              return (
                <blockquote
                  key={i}
                  className="border-l-4 border-stamp-red pl-6 md:pl-8 italic text-ink-black/80"
                >
                  {renderInline(block.text)}
                </blockquote>
              );
            default:
              return (
                <p key={i}>
                  <Fragment>{renderInline(block.text)}</Fragment>
                </p>
              );
          }
        })}
      </div>
    </article>
  );
}

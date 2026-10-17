import type { Block } from "@/content/types";

/** Texto con enlaces en formato [texto](https://...) — solo enlaces absolutos a fuentes oficiales. */
export function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<a key={i++} href={m[2]} rel="noopener" target="_blank">{m[1]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-block">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h2": return <h2 key={i} id={b.id} className="mb-4 mt-14 max-w-prose">{b.text}</h2>;
          case "p": return <p key={i}><Inline text={b.text} /></p>;
          case "list": return <ul key={i} className="my-4 list-disc space-y-2 pl-5">{b.items.map((x, j) => <li key={j}><Inline text={x} /></li>)}</ul>;
          case "steps": return (
            <ol key={i} className="my-6 max-w-prose space-y-5">
              {b.items.map((s, j) => (
                <li key={j} className="grid grid-cols-[2.25rem_1fr] gap-2">
                  <span className="font-bold text-teal" style={{ fontStretch: "75%", fontSize: "1.4rem", lineHeight: 1.1 }}>{j + 1}</span>
                  <div><h3>{s.title}</h3><p className="mt-1 text-muted"><Inline text={s.text} /></p></div>
                </li>
              ))}
            </ol>
          );
          case "table": return (
            <div key={i} className="my-6 max-w-[80ch] overflow-x-auto">
              <table className="reg-table">
                <thead><tr>{b.head.map((h, j) => <th key={j} scope="col">{h}</th>)}</tr></thead>
                <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>)}</tbody>
              </table>
            </div>
          );
          case "note": return <p key={i} className="my-6 max-w-prose border-l-4 border-teal bg-sheet px-4 py-3"><Inline text={b.text} /></p>;
        }
      })}
    </div>
  );
}

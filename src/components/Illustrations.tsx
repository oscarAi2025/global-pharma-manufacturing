/**
 * Ilustraciones técnicas propias (SVG): formas farmacéuticas dibujadas como plano de especificación.
 * Sin fotografías ni instalaciones inventadas.
 */
type IconProps = { className?: string; title?: string; size?: number };
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function FormIcon({ form, className, title, size }: IconProps & { form: string }) {
  const body = (() => {
    switch (form) {
      case "tablets": return (<>
        <ellipse cx="32" cy="36" rx="22" ry="9" {...S} /><path d="M10 30v6M54 30v6" {...S} /><ellipse cx="32" cy="30" rx="22" ry="9" {...S} fill="var(--sheet)" />
        <path d="M22 26.5l20 7" {...S} /></>);
      case "capsules": return (<g transform="rotate(-30 32 32)">
        <path d="M14 26h18v12H14a6 6 0 0 1 0-12z" {...S} fill="var(--teal)" fillOpacity=".9" />
        <path d="M32 26h18a6 6 0 0 1 0 12H32z" {...S} fill="var(--sheet)" /></g>);
      case "softgels": return (<>
        <ellipse cx="32" cy="32" rx="22" ry="12" {...S} fill="var(--amber-soft)" /><path d="M14 30c6-6 30-6 36 0" {...S} opacity=".5" />
        <ellipse cx="24" cy="27" rx="5" ry="2" fill="var(--sheet)" opacity=".8" /></>);
      case "gummies": return (<>
        <path d="M14 42c-3-8 2-22 18-22s21 14 18 22c-2 6-8 8-18 8s-16-2-18-8z" {...S} fill="var(--teal-soft)" />
        <path d="M20 30c4-4 9-5 12-5" {...S} opacity=".6" />
        <circle cx="24" cy="38" r="1" fill="currentColor" /><circle cx="31" cy="34" r="1" fill="currentColor" /><circle cx="38" cy="39" r="1" fill="currentColor" /><circle cx="42" cy="33" r="1" fill="currentColor" /><circle cx="28" cy="43" r="1" fill="currentColor" /></>);
      case "powders": return (<>
        <path d="M16 12h32v40H16z" {...S} fill="var(--sheet)" /><path d="M16 12l3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 2 3" {...S} />
        <path d="M22 34h20M22 40h14" {...S} /><circle cx="30" cy="24" r="1.4" fill="currentColor" /><circle cx="36" cy="26" r="1" fill="currentColor" /><circle cx="27" cy="27" r="1" fill="currentColor" /></>);
      case "liquids": return (<>
        <path d="M26 10h12v6l4 4v32a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2V20l4-4z" {...S} fill="var(--sheet)" />
        <path d="M22 34c6 3 14-3 20 0v18a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2z" fill="var(--teal)" fillOpacity=".85" /><path d="M24 10h16" {...S} /></>);
      case "topicals": return (<>
        <path d="M14 22h28l8 10-8 10H14a2 2 0 0 1-2-2V24a2 2 0 0 1 2-2z" {...S} fill="var(--sheet)" /><path d="M50 32h6" {...S} />
        <path d="M18 28h16M18 36h10" {...S} /></>);
      case "private-label": return (<>
        <path d="M20 14h24v6l4 4v28a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V24l4-4z" {...S} fill="var(--sheet)" />
        <rect x="19" y="30" width="26" height="14" rx="1" {...S} fill="var(--teal-soft)" /><path d="M24 36h16M24 40h10" {...S} /></>);
      default: return <circle cx="32" cy="32" r="18" {...S} />;
    }
  })();
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}{body}
    </svg>
  );
}

/** Plano de especificación para la portada: formas en una retícula con cotas y referencias numeradas. */
export function SpecPlate({ labels }: { labels: string[] }) {
  const items = [
    { f: "capsules", x: 46, y: 40 }, { f: "tablets", x: 196, y: 40 }, { f: "softgels", x: 346, y: 40 },
    { f: "gummies", x: 46, y: 200 }, { f: "powders", x: 196, y: 200 }, { f: "liquids", x: 346, y: 200 },
  ];
  return (
    <svg viewBox="0 0 480 380" className="h-auto w-full text-ink" role="img" aria-label={labels.join(", ")}>
      <defs>
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="var(--rule)" strokeWidth=".6" /></pattern>
        <marker id="tick" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M3 0v6" stroke="currentColor" strokeWidth="1" /></marker>
      </defs>
      <rect x=".5" y=".5" width="479" height="379" fill="var(--sheet)" stroke="var(--rule)" />
      <rect x="12" y="12" width="456" height="356" fill="url(#grid)" />
      {items.map((it, i) => (
        <g key={it.f}>
          <rect x={it.x - 18} y={it.y - 12} width="124" height="132" fill="var(--sheet)" stroke="var(--rule)" />
          <g transform={`translate(${it.x + 4} ${it.y + 2})`}><FormIcon form={it.f} size={80} /></g>
          <path d={`M${it.x - 6} ${it.y + 96}h100`} stroke="currentColor" strokeWidth=".8" markerStart="url(#tick)" markerEnd="url(#tick)" />
          <circle cx={it.x + 94} cy={it.y + 2} r="9" fill="var(--ink)" />
          <text x={it.x + 94} y={it.y + 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--paper)">{i + 1}</text>
          <text x={it.x - 6} y={it.y + 112} fontSize="11.5" fontWeight="600" fill="currentColor" style={{ fontStretch: "85%" }}>{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

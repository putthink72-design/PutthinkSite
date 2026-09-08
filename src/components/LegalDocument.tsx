import { parseLegal } from "@/lib/legal";

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function isEmail(value: string) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

function withMailtos(text: string) {
  const parts = text.split(EMAIL_RE);
  return parts.map((part, i) =>
    isEmail(part) ? (
      <a key={`${part}-${i}`} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      <span key={`${part}-${i}`}>{part}</span>
    ),
  );
}

export function LegalDocument({ source }: { source: string }) {
  const { title, blocks } = parseLegal(source);

  return (
    <article className="legal">
      <h1>{title}</h1>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "updated":
            return (
              <p key={i} className="legal-updated mono">
                {b.text}
              </p>
            );
          case "heading":
            return <h2 key={i}>{b.text}</h2>;
          case "paragraph":
            return <p key={i}>{withMailtos(b.text)}</p>;
          case "bullets":
            return (
              <ul key={i}>
                {b.items.map((item) => (
                  <li key={item}>{withMailtos(item)}</li>
                ))}
              </ul>
            );
          case "link":
            return (
              <p key={i}>
                <a href={b.href} target="_blank" rel="noopener noreferrer">
                  {b.href}
                </a>
              </p>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}

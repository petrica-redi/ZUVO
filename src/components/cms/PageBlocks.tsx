import Link from "next/link";
import type { PageBlock, Align } from "@/lib/cms/blocks";

function alignClass(align?: Align): string {
  if (align === "center") return "text-center items-center";
  if (align === "right") return "text-right items-end";
  return "text-left items-start";
}

function Band({
  bg,
  children,
}: {
  bg?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={bg ? { background: bg } : undefined}>
      <div className="mx-auto max-w-3xl px-5 md:px-8">{children}</div>
    </div>
  );
}

/** Renders a page-builder block array into a real page. */
export function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const size =
              block.level === 1
                ? "clamp(2rem, 1.4rem + 2.6vw, 3.25rem)"
                : block.level === 2
                  ? "clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem)"
                  : "clamp(1.15rem, 1rem + 0.8vw, 1.5rem)";
            return (
              <Band key={block.id} bg={block.bg}>
                <div className={`flex flex-col py-6 ${alignClass(block.align)}`}>
                  <h2
                    className="font-headline leading-tight"
                    style={{ fontSize: size, color: block.color || "var(--color-text-primary)" }}
                  >
                    {block.text}
                  </h2>
                </div>
              </Band>
            );
          }
          case "text":
            return (
              <Band key={block.id} bg={block.bg}>
                <div className={`flex flex-col py-4 ${alignClass(block.align)}`}>
                  <p
                    className="max-w-2xl whitespace-pre-line text-[15px] leading-relaxed md:text-base"
                    style={{ color: block.color || "var(--color-text-secondary)" }}
                  >
                    {block.text}
                  </p>
                </div>
              </Band>
            );
          case "image":
            if (!block.src) return null;
            return (
              <Band key={block.id} bg={block.bg}>
                <figure className={`flex flex-col gap-2 py-5 ${alignClass(block.align)}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.src}
                    alt={block.alt || ""}
                    className={`w-full ${block.rounded ? "rounded-3xl" : ""} shadow-2`}
                    loading="lazy"
                  />
                  {block.caption ? (
                    <figcaption className="text-xs text-[var(--color-text-muted)]">
                      {block.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Band>
            );
          case "video":
            if (!block.src) return null;
            return (
              <Band key={block.id} bg={block.bg}>
                <div className="py-5">
                  <video
                    src={block.src}
                    poster={block.poster}
                    controls
                    autoPlay={block.autoplay}
                    muted={block.autoplay}
                    loop={block.autoplay}
                    playsInline
                    className="w-full rounded-3xl shadow-2"
                  />
                </div>
              </Band>
            );
          case "button":
            return (
              <Band key={block.id} bg={block.bg}>
                <div className={`flex py-4 ${block.align === "center" ? "justify-center" : block.align === "right" ? "justify-end" : "justify-start"}`}>
                  <Link
                    href={block.href || "/"}
                    className={
                      block.style === "outline"
                        ? "inline-flex min-h-[3rem] items-center rounded-2xl border-2 border-[var(--color-border-strong)] px-6 text-sm font-bold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-text-primary)]"
                        : "btn-brand"
                    }
                  >
                    {block.label}
                  </Link>
                </div>
              </Band>
            );
          case "steps":
            return (
              <Band key={block.id} bg={block.bg}>
                <div className="grid gap-4 py-6 sm:grid-cols-2">
                  {block.items.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-1"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full tile-brand text-sm font-extrabold text-white">
                        {i + 1}
                      </div>
                      <h3 className="font-headline text-lg text-[var(--color-text-primary)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </Band>
            );
          case "spacer": {
            const h = block.size === "lg" ? "h-16" : block.size === "sm" ? "h-4" : "h-8";
            return <div key={block.id} className={h} style={block.bg ? { background: block.bg } : undefined} />;
          }
          default:
            return null;
        }
      })}
    </div>
  );
}

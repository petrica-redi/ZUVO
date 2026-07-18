"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  Upload,
  ExternalLink,
  Loader2,
  Type,
  Heading,
  Image as ImageIcon,
  Video,
  MousePointerClick,
  ListOrdered,
  Minus,
} from "lucide-react";
import { savePlatformConfig } from "@/lib/admin/actions";
import {
  BLOCK_LABELS,
  DEFAULT_SLUG,
  createBlock,
  parsePageMap,
  type BlockType,
  type PageBlock,
  type PageMap,
} from "@/lib/cms/blocks";

const BLOCK_ICONS: Record<BlockType, typeof Type> = {
  heading: Heading,
  text: Type,
  image: ImageIcon,
  video: Video,
  button: MousePointerClick,
  steps: ListOrdered,
  spacer: Minus,
};

const ADD_ORDER: BlockType[] = [
  "heading",
  "text",
  "image",
  "video",
  "button",
  "steps",
  "spacer",
];

export function PageBuilder({ initial }: { initial: unknown }) {
  const [pages, setPages] = useState<PageMap>(() => {
    const parsed = parsePageMap(initial);
    if (Object.keys(parsed).length === 0) parsed[DEFAULT_SLUG] = [];
    return parsed;
  });
  const [slug, setSlug] = useState<string>(() => {
    const keys = Object.keys(parsePageMap(initial));
    return keys[0] || DEFAULT_SLUG;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const blocks = useMemo(() => pages[slug] ?? [], [pages, slug]);

  const setBlocks = useCallback(
    (next: PageBlock[]) => {
      setPages((prev) => ({ ...prev, [slug]: next }));
    },
    [slug],
  );

  const addBlock = (type: BlockType) => setBlocks([...blocks, createBlock(type)]);

  const updateBlock = (id: string, patch: Partial<PageBlock>) =>
    setBlocks(
      blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as PageBlock) : b)),
    );

  const removeBlock = (id: string) => setBlocks(blocks.filter((b) => b.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    const i = blocks.findIndex((b) => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setBlocks(next);
  };

  const addPage = () => {
    const raw = window.prompt("New page slug (letters, numbers, dashes):", "");
    if (!raw) return;
    const clean = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
    if (!clean) return;
    setPages((prev) => ({ ...prev, [clean]: prev[clean] ?? [] }));
    setSlug(clean);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await savePlatformConfig({ pageBlocks: pages });
    setMessage(
      res.success
        ? { type: "success", text: "Page saved. Open the live link to view it." }
        : { type: "error", text: res.error || "Failed to save." },
    );
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Page controls */}
      <section className="admin-cms-section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="admin-cms-label !normal-case !tracking-normal">Page</span>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="glass-input cursor-pointer rounded-xl px-3 py-2 text-sm"
            >
              {Object.keys(pages).map((s) => (
                <option key={s} value={s}>
                  /p/{s}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addPage}
              className="admin-btn-secondary inline-flex cursor-pointer items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> New page
            </button>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/p/${slug}`}
              target="_blank"
              rel="noopener"
              className="admin-btn-secondary inline-flex cursor-pointer items-center gap-1.5"
            >
              <ExternalLink className="h-4 w-4" /> View live
            </a>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="admin-btn-primary inline-flex cursor-pointer items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save page"}
            </button>
          </div>
        </div>
        {message ? (
          <div
            className={`mt-3 rounded-xl border px-3 py-2 text-sm font-medium ${
              message.type === "success"
                ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                : "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]"
            }`}
          >
            {message.text}
          </div>
        ) : null}
      </section>

      {/* Block list */}
      {blocks.length === 0 ? (
        <div className="admin-cms-section text-center text-sm text-[var(--color-text-secondary)]">
          This page is empty. Add your first block below.
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, i) => (
            <BlockEditor
              key={block.id}
              block={block}
              first={i === 0}
              last={i === blocks.length - 1}
              onChange={(patch) => updateBlock(block.id, patch)}
              onMove={(dir) => move(block.id, dir)}
              onRemove={() => removeBlock(block.id)}
            />
          ))}
        </div>
      )}

      {/* Add block palette */}
      <section className="admin-cms-section">
        <h2 className="admin-cms-section__title">
          <Plus className="h-5 w-5 text-[var(--color-text-secondary)]" />
          Add block
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ADD_ORDER.map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="press flex items-center gap-2 rounded-2xl border border-[var(--color-border-default)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-ink-900)] hover:bg-[var(--color-surface-subtle)]"
              >
                <Icon className="h-4 w-4 text-[var(--color-brand-700)]" />
                {BLOCK_LABELS[type]}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function fieldCls() {
  return "glass-input w-full rounded-xl px-3 py-2 text-sm";
}

function BlockEditor({
  block,
  first,
  last,
  onChange,
  onMove,
  onRemove,
}: {
  block: PageBlock;
  first: boolean;
  last: boolean;
  onChange: (patch: Partial<PageBlock>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const Icon = BLOCK_ICONS[block.type];
  return (
    <section className="admin-cms-section">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-text-primary)]">
          <Icon className="h-4 w-4 text-[var(--color-brand-700)]" />
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1">
          <IconBtn label="Move up" disabled={first} onClick={() => onMove(-1)}>
            <ArrowUp className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Move down" disabled={last} onClick={() => onMove(1)}>
            <ArrowDown className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Delete" danger onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      <BlockFields block={block} onChange={onChange} />

      {/* Shared band controls */}
      {block.type !== "spacer" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Align
            <select
              value={block.align ?? "left"}
              onChange={(e) => onChange({ align: e.target.value as PageBlock["align"] })}
              className={`${fieldCls()} mt-1 cursor-pointer`}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Background (fond)
            <ColorField value={block.bg ?? ""} onChange={(v) => onChange({ bg: v })} />
          </label>
        </div>
      ) : null}
    </section>
  );
}

function BlockFields({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (patch: Partial<PageBlock>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-3">
          <input
            className={fieldCls()}
            value={block.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Heading text"
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Size
              <select
                value={block.level}
                onChange={(e) => onChange({ level: Number(e.target.value) as 1 | 2 | 3 })}
                className={`${fieldCls()} mt-1 cursor-pointer`}
              >
                <option value={1}>Large (H1)</option>
                <option value={2}>Medium (H2)</option>
                <option value={3}>Small (H3)</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Text color
              <ColorField value={block.color ?? ""} onChange={(v) => onChange({ color: v })} />
            </label>
          </div>
        </div>
      );
    case "text":
      return (
        <div className="space-y-3">
          <textarea
            className={fieldCls()}
            rows={4}
            value={block.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Paragraph text"
          />
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Text color
            <ColorField value={block.color ?? ""} onChange={(v) => onChange({ color: v })} />
          </label>
        </div>
      );
    case "image":
      return (
        <div className="space-y-3">
          <MediaField
            accept="image/*"
            value={block.src}
            onChange={(url) => onChange({ src: url })}
          />
          <input
            className={fieldCls()}
            value={block.alt ?? ""}
            onChange={(e) => onChange({ alt: e.target.value })}
            placeholder="Alt text (accessibility)"
          />
          <input
            className={fieldCls()}
            value={block.caption ?? ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Caption (optional)"
          />
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={block.rounded ?? true}
              onChange={(e) => onChange({ rounded: e.target.checked })}
            />
            Rounded corners
          </label>
        </div>
      );
    case "video":
      return (
        <div className="space-y-3">
          <MediaField
            accept="video/*"
            value={block.src}
            onChange={(url) => onChange({ src: url })}
          />
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={block.autoplay ?? false}
              onChange={(e) => onChange({ autoplay: e.target.checked })}
            />
            Autoplay (muted, looped)
          </label>
        </div>
      );
    case "button":
      return (
        <div className="space-y-3">
          <input
            className={fieldCls()}
            value={block.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Button label"
          />
          <input
            className={fieldCls()}
            value={block.href}
            onChange={(e) => onChange({ href: e.target.value })}
            placeholder="Link (e.g. /auth/register or https://…)"
          />
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Style
            <select
              value={block.style ?? "primary"}
              onChange={(e) => onChange({ style: e.target.value as "primary" | "outline" })}
              className={`${fieldCls()} mt-1 cursor-pointer`}
            >
              <option value="primary">Primary (brand)</option>
              <option value="outline">Outline</option>
            </select>
          </label>
        </div>
      );
    case "steps":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-muted)]">
                  Step {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ items: block.items.filter((_, j) => j !== i) })
                  }
                  className="text-xs font-bold text-[var(--color-danger-accent)]"
                >
                  Remove
                </button>
              </div>
              <input
                className={`${fieldCls()} mb-2`}
                value={item.title}
                onChange={(e) =>
                  onChange({
                    items: block.items.map((it, j) =>
                      j === i ? { ...it, title: e.target.value } : it,
                    ),
                  })
                }
                placeholder="Step title"
              />
              <textarea
                className={fieldCls()}
                rows={2}
                value={item.body}
                onChange={(e) =>
                  onChange({
                    items: block.items.map((it, j) =>
                      j === i ? { ...it, body: e.target.value } : it,
                    ),
                  })
                }
                placeholder="Step description"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ items: [...block.items, { title: "New step", body: "" }] })
            }
            className="admin-btn-secondary inline-flex cursor-pointer items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add step
          </button>
        </div>
      );
    case "spacer":
      return (
        <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
          Height
          <select
            value={block.size ?? "md"}
            onChange={(e) => onChange({ size: e.target.value as "sm" | "md" | "lg" })}
            className={`${fieldCls()} mt-1 cursor-pointer`}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
      );
    default:
      return null;
  }
}

function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-1 flex items-center gap-2">
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-10 cursor-pointer rounded-lg border border-[var(--color-border-default)] bg-white"
      />
      <input
        className={fieldCls()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs font-bold text-[var(--color-text-muted)]"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

function MediaField({
  accept,
  value,
  onChange,
}: {
  accept: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = accept.startsWith("video");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          className={fieldCls()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a URL or upload…"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="admin-btn-secondary inline-flex shrink-0 cursor-pointer items-center gap-1.5 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="text-xs font-semibold text-[var(--color-danger-accent)]">{error}</p> : null}
      {value ? (
        isVideo ? (
          <video src={value} className="max-h-40 rounded-xl" controls muted />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt="" className="max-h-40 rounded-xl object-contain" />
        )
      ) : null}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-white transition-colors disabled:opacity-30 ${
        danger
          ? "text-[var(--color-danger-accent)] hover:border-[var(--color-danger-accent)]"
          : "text-[var(--color-text-secondary)] hover:border-[var(--color-ink-900)] hover:text-[var(--color-text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

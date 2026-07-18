/**
 * Visual page-builder block model (Elementor-style).
 * Stored as JSON in platform_config.pageBlocks keyed by page slug.
 */

export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "steps"
  | "spacer";

export type Align = "left" | "center" | "right";

export type BaseBlock = {
  id: string;
  type: BlockType;
  /** Optional background color for the block band (the "fond"). */
  bg?: string;
  align?: Align;
};

export type HeadingBlock = BaseBlock & {
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
  color?: string;
};

export type TextBlock = BaseBlock & {
  type: "text";
  text: string;
  color?: string;
};

export type ImageBlock = BaseBlock & {
  type: "image";
  src: string;
  alt?: string;
  rounded?: boolean;
  caption?: string;
};

export type VideoBlock = BaseBlock & {
  type: "video";
  src: string;
  poster?: string;
  autoplay?: boolean;
};

export type ButtonBlock = BaseBlock & {
  type: "button";
  label: string;
  href: string;
  style?: "primary" | "outline";
};

export type StepItem = { title: string; body: string };
export type StepsBlock = BaseBlock & {
  type: "steps";
  items: StepItem[];
};

export type SpacerBlock = BaseBlock & {
  type: "spacer";
  size?: "sm" | "md" | "lg";
};

export type PageBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | StepsBlock
  | SpacerBlock;

export type PageMap = Record<string, PageBlock[]>;

export const DEFAULT_SLUG = "home";

export function createBlock(type: BlockType): PageBlock {
  const id = `b_${Math.random().toString(36).slice(2, 9)}`;
  switch (type) {
    case "heading":
      return { id, type, text: "New heading", level: 2, align: "left" };
    case "text":
      return {
        id,
        type,
        text: "Write your paragraph here…",
        align: "left",
      };
    case "image":
      return { id, type, src: "", alt: "", rounded: true, align: "center" };
    case "video":
      return { id, type, src: "", align: "center" };
    case "button":
      return { id, type, label: "Button", href: "/", style: "primary", align: "left" };
    case "steps":
      return {
        id,
        type,
        items: [
          { title: "Step 1", body: "Describe the first step." },
          { title: "Step 2", body: "Describe the second step." },
        ],
      };
    case "spacer":
      return { id, type, size: "md" };
    default:
      return { id, type: "text", text: "" } as PageBlock;
  }
}

export function parsePageMap(value: unknown): PageMap {
  if (!value || typeof value !== "object") return {};
  const out: PageMap = {};
  for (const [slug, blocks] of Object.entries(value as Record<string, unknown>)) {
    if (Array.isArray(blocks)) {
      out[slug] = blocks.filter(
        (b): b is PageBlock =>
          !!b && typeof b === "object" && typeof (b as PageBlock).type === "string",
      );
    }
  }
  return out;
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  text: "Text",
  image: "Image",
  video: "Video",
  button: "Button / CTA",
  steps: "Steps",
  spacer: "Spacer",
};

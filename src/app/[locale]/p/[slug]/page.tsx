import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlatformConfig } from "@/lib/admin/actions";
import { parsePageMap } from "@/lib/cms/blocks";
import { PageBlocks } from "@/components/cms/PageBlocks";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ProfileShellOptOut } from "@/components/landing/ProfileShellOptOut";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return { title: `${title} — Redi Health` };
}

export default async function BuilderPage({ params }: Props) {
  const { locale, slug } = await params;
  const config = await getPlatformConfig();
  const pages = parsePageMap(config?.pageBlocks);
  const blocks = pages[slug];

  if (!blocks || blocks.length === 0) {
    notFound();
  }

  return (
    <>
      <ProfileShellOptOut />
      <LandingHeader logoUrl={config?.logoUrl || undefined} />
      <main id="main-content" className="min-h-[60vh] bg-[var(--color-bg-canvas)] pt-24 pb-16">
        <PageBlocks blocks={blocks} />
      </main>
      <LandingFooter locale={locale} />
    </>
  );
}

import { Quote } from "lucide-react";
import { getTranslations } from "next-intl/server";

const TESTIMONIALS = ["t1", "t2", "t3"] as const;

/**
 * Community voices from rural Romania.
 */
export async function TestimonialsSection() {
  const t = await getTranslations("landing");

  return (
    <section
      aria-labelledby="testimonials-title"
      className="section-marketing bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="mb-10 text-center md:mb-14">
          <p className="eyebrow justify-center">{t("testimonialsEyebrow")}</p>
          <h2
            id="testimonials-title"
            className="font-headline mt-3 leading-[1.05] text-[var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem)" }}
          >
            {t("testimonialsTitle")}
          </h2>
        </header>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {TESTIMONIALS.map((id) => (
            <blockquote
              key={id}
              className="relative rounded-3xl border border-[var(--color-border-subtle)] bg-white p-7 shadow-2"
            >
              <Quote
                className="lucide absolute right-6 top-6 h-8 w-8 text-[var(--color-accent-soft)]"
                strokeWidth={1.5}
              />
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-[15px]">
                &ldquo;{t(`testimonial${id.charAt(1)}Quote` as "testimonial1Quote")}&rdquo;
              </p>
              <footer className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
                <p className="font-display text-sm font-extrabold text-[var(--color-text-primary)]">
                  {t(`testimonial${id.charAt(1)}Name` as "testimonial1Name")}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {t(`testimonial${id.charAt(1)}Location` as "testimonial1Location")}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

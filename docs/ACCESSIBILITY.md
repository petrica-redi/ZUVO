# Accessibility Statement — Redi Health

> WCAG 2.1 Level AA target. This statement supports public-sector procurement
> (Romania OG 784/2022 transposition, Italy Legge Stanca / AGID requirements).

## 1. Commitment

Redi Health is designed for communities with **low literacy, limited connectivity, and
mobile-first access**. Accessibility is a core product requirement, not an add-on.

## 2. Conformance status

**Target:** WCAG 2.1 Level AA  
**Current self-assessment:** Partially conformant — see known limitations below.

## 3. Measures implemented

| Area | Implementation |
|---|---|
| **Perceivable** | Semantic HTML; `aria-*` on interactive components; colour contrast tokens in `globals.css` (teal on cream meets 4.5:1 for body text); `prefers-reduced-motion` respected in Framer Motion usage |
| **Operable** | Keyboard-navigable chat and navigator; persistent SOS reachable from all pages; 44px minimum touch targets on primary actions |
| **Understandable** | Plain-language UI; 16 locales including Romani; voice input on chat for low-literacy users |
| **Robust** | Progressive enhancement; offline SOS and navigator content cached |

## 4. Known limitations

| Issue | Impact | Remediation plan |
|---|---|---|
| Body map symptom selector | Partial keyboard coverage on SVG regions | Add focusable region list alternative |
| PDF report export | Generated client-side; screen-reader structure varies by browser | Structured HTML report option |
| Third-party map links (providers) | External Google Maps may not meet AA | ASL contact text alternative provided |
| Student academy animations | Decorative motion on journey map | `prefers-reduced-motion` disables path animation |

## 5. Assistive technology tested

- VoiceOver (iOS Safari) — chat, navigator, SOS
- TalkBack (Android Chrome) — landing, mediator dashboard
- Keyboard-only (desktop Chrome) — primary flows

## 6. Feedback and enforcement

| Channel | Contact |
|---|---|
| Accessibility feedback | accessibility@redi.healthcare |
| DPO (privacy overlap) | dpo@redi.healthcare |
| Response SLA | 30 days for acknowledged receipt; 90 days for material fixes |

## 7. Technical specifications

- HTML5, CSS3, JavaScript (React 19 / Next.js 16)
- Supported browsers: last two versions of Chrome, Firefox, Safari, Edge; iOS Safari 16+; Android Chrome 110+

## 8. Assessment method

Self-assessment against WCAG 2.1 AA checklist, supplemented by Lighthouse accessibility
audits in CI (see `.github/workflows` E2E + Lighthouse job).

## 9. Review date

Last updated: June 2026. Next review: December 2026 or upon major UI redesign.

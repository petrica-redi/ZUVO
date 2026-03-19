# Zuvo — Complete Redesign Spec

> **For Cursor: read this file FIRST. It overrides all previous design decisions.**
> The old version was a weak learning management system. This is a complete product rethink.

---

## PRODUCT VISION

Zuvo is NOT a learning app. It is **a trusted health companion that fights misinformation and helps Roma families navigate healthcare systems that were not built for them**.

The user experience should feel like **WhatsApp meets Calm meets Revolut** — fast, beautiful, personal, and zero friction.

---

## 10 WOW FEATURES

### 1. AI Health Advisor (Chat) — THE CORE
- Full-screen chat interface, WhatsApp-style
- Voice input (tap mic, speak in any language, get answer in that language)
- Streaming responses with typing animation
- Suggested questions that rotate based on season, location, trending misinformation
- Emergency detection → auto-surfaces SOS button
- Chat history saved locally (encrypted)
- Share a response as image (screenshot card) to send on WhatsApp/Viber

### 2. Misinformation Scanner
- "Someone sent me this" button → paste text, URL, or screenshot from Facebook/TikTok/WhatsApp
- AI analyzes the claim and returns: VERIFIED / MISLEADING / FALSE with clear explanation
- Shows the real evidence with field stories from the mediator voice
- "Share the truth" → generates a shareable card to send back to whoever sent the misinformation
- Trending misinformation alerts based on what's circulating in Roma communities

### 3. SOS Emergency Mode
- Persistent red SOS button in top corner of every screen
- One tap → full-screen emergency mode:
  - Auto-detects country from locale/GPS
  - Shows 112 with one-tap call
  - Country-specific emergency numbers (ambulance, police, fire)
  - Domestic violence hotlines
  - Poisoning center
  - Nearest hospital with map link (Google Maps deep link)
- First aid quick cards: choking, bleeding, burns, CPR, seizure
- Works fully offline (emergency info cached on first load)

### 4. Voice-First Everything
- Every screen has a mic button
- Speak your question → speech-to-text → AI answers → text-to-speech reads it back
- Critical for low-literacy users
- Use Web Speech API (free, works on Android Chrome)
- Language auto-detection from speech

### 5. Family Health Hub
- One account, multiple family profiles (no registration required — local storage)
- Tap avatar to switch: "Me", "My child (Alina, 3)", "My mother (Maria, 62)"
- Each profile has: vaccination tracker, medication reminders, health log
- Pregnancy tracker for expecting mothers (week by week, auto-calculated from due date)
- Child growth tracker (weight/height by age, plotted against WHO curves)

### 6. Interactive Body Map Symptom Checker
- Full-body visual (male/female/child)
- Tap where it hurts → get guided questions → get plain-language guidance
- Traffic light triage: GREEN (manage at home), AMBER (see doctor this week), RED (go now)
- Never diagnoses — always explains what to watch for and when to escalate
- All powered by the same Claude AI with mediator persona

### 7. Healthcare Navigator
- "I need to see a doctor" → guided flow:
  - What's the issue? (quick select: fever, pregnancy, chronic, mental, emergency)
  - Do you have insurance/health card? (Yes/No/Don't know)
  - Country-specific step-by-step guide to access care
  - What to bring, what to say, your rights
  - Option to call health mediator directly
- Generates a "doctor visit card" in national language that summarizes the patient's concern (to hand to the doctor)

### 8. Community Stories (Video)
- Short video testimonials (30-60 sec) from Roma community members
- Topics: "I got vaccinated and here's what happened", "I was scared of the hospital but...", "How I manage diabetes"
- Roma voices, Roma faces, Roma languages
- Carousel on home screen
- More powerful than any fact — social proof from people who look like you

### 9. Smart Notifications & Seasonal Alerts
- Vaccination reminders based on child's birthdate
- Seasonal health alerts: flu season prep, summer hydration, winter heating safety
- Trending misinformation alerts: "A viral post is circulating about X — here's the truth"
- Health mediator broadcasts: local campaigns, free screening events
- All opt-in, never spammy

### 10. Offline Mode That Actually Works
- Core chat responses for top 50 questions cached locally
- Emergency info always available
- Health logs saved locally, sync when online
- Family profiles 100% offline
- Vaccination schedule viewable offline
- Body map works offline with basic guidance

---

## UI DESIGN SYSTEM

### Visual Language
- **Clean, generous whitespace** — like Apple Health or Calm
- **Rounded corners everywhere** (16-24px radius)
- **Glassmorphism** on header and bottom nav (backdrop-blur)
- **Micro-animations** on every interaction (Framer Motion)
  - Cards scale on tap (0.97)
  - Page transitions (slide up)
  - Loading shimmer (not spinners)
  - Confetti on achievements
  - Pulse on SOS button
- **No flat/boring cards** — use gradients, shadows, depth
- **Dark mode** (toggle in settings)

### Color Palette
```
Primary:     #C0392B (Roma Red) — buttons, CTAs, SOS
Secondary:   #F39C12 (Gold) — achievements, highlights, accent
Surface:     #FAFBFC (near-white), #FFFFFF (cards)
Dark surface: #0F172A (dark mode bg), #1E293B (dark mode cards)
Text:        #0F172A (primary), #64748B (secondary), #94A3B8 (muted)

Health zones:
  Green:   #10B981 (safe / prevention)
  Blue:    #3B82F6 (info / nutrition)
  Purple:  #8B5CF6 (maternal)
  Orange:  #F97316 (children)
  Red:     #EF4444 (chronic / danger)
  Cyan:    #06B6D4 (mental)

Gradients:
  Hero:      linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #F39C12 100%)
  Card warm: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)
  Card cool: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)
  SOS:       linear-gradient(135deg, #DC2626 0%, #991B1B 100%)
```

### Typography
- **Inter** for UI (already installed)
- Headlines: 700 weight, tight tracking (-0.03em)
- Body: 400 weight, relaxed leading (1.6)
- Labels: 500 weight, 11-12px, uppercase tracking

### Iconography
- Lucide React (already installed)
- Consistent 24px stroke width 1.5
- Emoji for health topics (universal, no literacy required)
- Custom illustrations for empty states and onboarding

### Layout
- Max width: 480px (mobile-first, looks great on phone)
- Horizontal padding: 20px
- Card padding: 20-24px
- Gap between sections: 32px
- Bottom nav height: 64px + safe area
- Header height: 56px with blur

---

## NAVIGATION STRUCTURE

### Bottom Navigation (5 tabs)
```
[Home]   [Scan]   [💬 ASK]   [Family]   [More]
                  ↑ elevated red circle, primary action
```

- **Home**: Hero + quick actions + trending + community stories
- **Scan**: Misinformation scanner (paste/screenshot/type)
- **Ask** (center, primary): AI chat with voice input
- **Family**: Family profiles, health logs, vaccination tracker
- **More**: Topics library, healthcare navigator, mediator tools, settings, SOS

### SOS Button
- Floating, always visible in top-right corner
- Red circle with white cross/phone icon
- Gentle pulse animation
- One tap → full-screen emergency overlay

---

## HOME SCREEN REDESIGN

```
┌─────────────────────────────────┐
│ 🔴 SOS          Zuvo    🌐 Lang│  ← Header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │  🌊 Gradient hero card  │    │
│  │                         │    │
│  │  "Got a health question?│    │
│  │   Ask Zuvo."            │    │
│  │                         │    │
│  │  [🎤 Speak]  [⌨️ Type]  │    │  ← Two CTA buttons
│  └─────────────────────────┘    │
│                                 │
│  ⚡ Quick Actions               │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ 🔍   │ │ 👶   │ │ 💊   │    │
│  │ Scan │ │ Baby │ │ Meds │    │
│  │ a    │ │ help │ │ check│    │
│  │ claim│ │      │ │      │    │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
│  🔥 Trending Misinformation     │
│  ┌─────────────────────────┐    │
│  │ ⚠️ "COVID vaccine changes│    │
│  │ your DNA"                │    │
│  │ FALSE — tap to see why   │    │  ← Swipeable cards
│  └─────────────────────────┘    │
│                                 │
│  💬 Community Stories           │
│  ┌─────┐ ┌─────┐ ┌─────┐      │
│  │ 📹  │ │ 📹  │ │ 📹  │      │  ← Horizontal scroll
│  │Maria│ │Ionut│ │Fatos│      │
│  └─────┘ └─────┘ └─────┘      │
│                                 │
│  📚 Health Topics               │
│  ┌──────────┐ ┌──────────┐     │
│  │🛡️Prevent │ │🥗Nutrition│     │
│  │──────────│ │──────────│     │  ← 2-column grid
│  │🤱Maternal│ │👶Children │     │
│  │──────────│ │──────────│     │
│  │💊Chronic │ │🧠Mental  │     │
│  └──────────┘ └──────────┘     │
│                                 │
├─────────────────────────────────┤
│ 🏠  🔍  [💬]  👨‍👩‍👧  •••     │  ← Bottom nav
└─────────────────────────────────┘
```

---

## MISINFORMATION SCANNER SCREEN

```
┌─────────────────────────────────┐
│  "Someone sent you something    │
│   that doesn't sound right?"    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  📋 Paste text or link  │    │
│  │                         │    │
│  │  (multiline input area) │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  — or —                         │
│                                 │
│  [📸 Upload screenshot]         │
│  [🎤 Describe what you heard]   │
│                                 │
│  ┌─────────────────────────┐    │
│  │  [🔍 Check this claim]  │    │  ← Big CTA
│  └─────────────────────────┘    │
│                                 │
│  ─── Recent checks ───          │
│                                 │
│  ✅ "Garlic cures COVID"        │
│     FALSE — checked 2h ago      │
│                                 │
│  ⚠️ "Honey is better than..."   │
│     MISLEADING — checked 1d ago │
│                                 │
└─────────────────────────────────┘
```

After checking, the result card shows:
- 🟢 VERIFIED / 🟡 MISLEADING / 🔴 FALSE badge
- Plain-language explanation from the mediator voice
- "Share the truth" button → generates a beautiful card image to share on WhatsApp

---

## FILE STRUCTURE FOR NEW FEATURES

```
src/
  app/[locale]/
    chat/page.tsx           ← AI chat (already created, needs voice input)
    scan/page.tsx           ← NEW: misinformation scanner
    family/page.tsx         ← NEW: family health hub
    family/[member]/page.tsx ← NEW: individual family member profile
    emergency/page.tsx      ← NEW: full SOS emergency screen
    navigate/page.tsx       ← NEW: healthcare system navigator
    stories/page.tsx        ← NEW: community video stories

  components/
    SosButton.tsx           ← NEW: floating emergency button (every screen)
    SosOverlay.tsx          ← NEW: full-screen emergency mode
    MisinfoScanner.tsx      ← NEW: claim checker UI
    MisinfoResultCard.tsx   ← NEW: verdict display with share
    VoiceInput.tsx          ← NEW: mic button + speech-to-text
    BodyMap.tsx             ← NEW: interactive body symptom selector
    FamilySelector.tsx      ← NEW: avatar switcher for family members
    VaccinationTimeline.tsx ← NEW: visual vaccination schedule
    PregnancyTracker.tsx    ← NEW: week-by-week pregnancy view
    CommunityStories.tsx    ← NEW: video story carousel
    TrendingMisinfo.tsx     ← NEW: swipeable misinformation alerts
    QuickActions.tsx        ← NEW: icon grid for common actions
    HealthNavigator.tsx     ← NEW: guided care access flow
    DoctorVisitCard.tsx     ← NEW: generates printable visit summary

  app/api/
    chat/route.ts           ← Already created (uses OpenAI)
    scan/route.ts           ← NEW: misinformation analysis endpoint
    symptom-check/route.ts  ← NEW: body map → AI triage
    visit-card/route.ts     ← NEW: generate doctor visit summary
```

---

## API ROUTES FOR NEW FEATURES

### POST /api/scan — Misinformation Scanner
```typescript
// Input: { claim: string, type: "text" | "url" | "voice" }
// Output: { verdict: "verified" | "misleading" | "false",
//           explanation: string, shareCardUrl: string }
// Uses same Claude/OpenAI with specialized system prompt for fact-checking
```

### POST /api/symptom-check — Body Map Triage
```typescript
// Input: { bodyArea: string, symptoms: string[], age: number, gender: string }
// Output: { severity: "green" | "amber" | "red",
//           guidance: string, actionStep: string }
```

### POST /api/visit-card — Doctor Visit Card Generator
```typescript
// Input: { concern: string, symptoms: string[], locale: string }
// Output: { cardHtml: string } // Printable card in national language
```

---

## AI SYSTEM PROMPTS

### Misinformation Scanner Prompt
The AI for /api/scan should:
- Classify claims as VERIFIED / MISLEADING / FALSE
- Use the same Roma health mediator voice
- Reference field experience: "I have seen this claim circulate in settlements..."
- Never be condescending about believing misinformation
- Explain WHY the claim is wrong with simple logic
- Provide a one-line "truth" that can be shared
- If the claim has a kernel of truth, acknowledge it before correcting

### Symptom Checker Prompt
The AI for /api/symptom-check should:
- NEVER diagnose
- Always triage into green/amber/red
- RED = "Go to hospital/call 112 NOW" (no hedging)
- AMBER = "See a doctor within 1-3 days"
- GREEN = "Manage at home with these steps"
- Include specific home care instructions for GREEN
- Include what to watch for that would escalate to AMBER or RED

---

## IMPLEMENTATION PRIORITY FOR CURSOR

### Sprint 1 (This Week) — The Wow Demo
1. Redesign home screen (hero, quick actions, trending misinfo)
2. SOS button + emergency overlay on every page
3. Voice input on chat page
4. Misinformation scanner (text input → AI verdict → share card)

### Sprint 2 (Next Week) — Core Value
5. Body map symptom checker
6. Family profiles (local storage, avatar switcher)
7. Healthcare navigator flow
8. Doctor visit card generator

### Sprint 3 (Week After) — Engagement
9. Vaccination tracker with reminders
10. Pregnancy tracker
11. Community stories carousel (placeholder videos)
12. Dark mode
13. PWA manifest (install to homescreen)

---

## CRITICAL: WHAT MAKES THIS A "WOW"

1. **It's beautiful.** Every screen should feel like a premium consumer app, not an NGO website.
2. **It's instant.** Chat responses stream. Misinfo scan takes < 3 seconds. No loading screens — shimmer placeholders.
3. **It speaks your language.** Literally. Voice in, voice out. 15 languages.
4. **It fights back.** The misinfo scanner is a weapon against the Facebook/TikTok health lies killing Roma children.
5. **It's personal.** Family profiles, vaccination reminders with your child's name, pregnancy week-by-week.
6. **It respects you.** No registration. No data collection. No condescending tone. You're in control.
7. **It works offline.** Emergency info, cached FAQ, health logs — all available without internet.
8. **It saves lives.** SOS button + first aid cards + body map triage. When seconds matter.

This is what makes the Council of Europe and the Albanian Ministry say: "We need this. Fund it."

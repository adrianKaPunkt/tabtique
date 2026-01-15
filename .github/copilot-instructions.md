# Tabtique Copilot Instructions

Tabtique is a Next.js 16 marketing website for a Korean-inspired facial treatment clinic in Frankfurt.

## Architecture Overview

**Pages & Routing:**
- Entry point: [app/page.tsx](app/page.tsx) → renders [app/(root)/page.tsx](app/(root)/page.tsx) + [Footer.tsx](app/Footer.tsx)
- Main layout in [app/layout.tsx](app/layout.tsx) with metadata, fonts (Cinzel, Inter, Cormorant)
- Route pattern: `app/(root)` uses route groups for page organization

**Sections Architecture:**
Page built from composable section components in [app/(root)/_sections/](app/(root)/_sections/):
- [HeroSection.tsx](app/(root)/_sections/HeroSection.tsx): Full-viewport hero with background image, logo, and CTA button
- [TreatmentSection.tsx](app/(root)/_sections/TreatmentSection.tsx): 3-column responsive grid of treatment cards
- [AboutSection.tsx](app/(root)/_sections/AboutSection.tsx): 2-column layout (image + list) with granate icon bullets

## Key Patterns

**Styling:**
- Tailwind CSS 4.1 with custom fonts (Cinzel, Inter, Cormorant)
- Custom spacing utilities (e.g., `mt-15`, `w-75`, `w-130`)
- Responsive: `md:` and `xl:` breakpoints for mobile-first design
- Hover effects: grayscale transition on TreatmentCard, button hover state

**Component Patterns:**
- All components are functional, TypeScript-typed with interface suffixes (`Props`)
- Reusable UI: [Button.tsx](components/Button.tsx) (accepts text, optional width), [Headline.tsx](components/Headline.tsx) (section titles with line design), [TreatmentCard.tsx](components/TreatmentCard.tsx) (image + description)
- SVG Logo imports from `/public/` (Logo.tsx, TabiqueLogo.tsx) as React components

**Image Handling:**
- Uses `next/image` component with explicit width/height for optimization
- Images in `/public/` directory: hero-image.jpg, profile.jpg, treatment-1.jpg, granatapfel.png
- Note: TreatmentSection uses same `/treatment-1.jpg` for all cards (likely placeholder)

## Development Workflow

```bash
npm run dev         # Start dev server on :3000
npm run build       # Production build
npm start          # Run production server
npm run lint       # Run ESLint
```

**Critical:** Remove `.next/` cache after config changes (`rm -rf .next`).

## Conventions to Follow

- German content for copy, but code/components in English
- Tailwind spacing system: use multiples (mt-7, my-15, py-3, w-50, w-75, w-130)
- Path alias `@/*` maps to project root (import from `@/components`, `@/public`)
- Section IDs for anchor navigation: `id="hero-section"`, `id="treatment"`, `id="about"`

## External Dependencies

- React 19.2, Next.js 16.1 with App Router
- No backend/API currently; static site with embedded treatment data
- Future: `/imprint` route placeholder (Footer link exists but not implemented)

## Testing & Linting

- ESLint 9 configured via [eslint.config.mjs](eslint.config.mjs)
- No test setup currently; consider Jest + React Testing Library for component tests

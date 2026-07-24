# AGENTS.md — Ways of Work · Kubo redesign

Instructions for the agent (Devin) applying the **Kubo Design System** reskin to the
real Ways of Work codebase. Reskin only: **keep every existing behavior, route, and
feature working.** Change the look, not the logic.

## Sources of truth (in this repo)
**All reference material lives under `docs/design-system/` in this repo.** Read it
before touching any UI.
1. `docs/design-system/_ds/kubo-design-system-6efae607-6438-424b-a2bf-294db454db97/`
   — the design system. Tokens: `tokens/colors.css`, `tokens/typography.css`,
   `tokens/radius.css`; fonts: `fonts/fonts.css`; global entry: `styles.css`;
   components bundle: `_ds_bundle.js`. **Read these before writing any CSS.**
2. `docs/design-system/WaysOfWork.dc.html` — the **reference implementation** of the
   Marketplace + docs screens already reskinned. Match its structure, spacing, and
   component usage. Follow the same shell and tokens for every screen.
3. `docs/design-system/favicon.svg` — the new brand mark (loose amber lightbulb).
4. `docs/design-system/AGENTS.md` — this rules file (also mirror it at the repo root
   so Devin picks it up automatically).

## Non-negotiable rules

### Theme & color
- **MUST** drive all color from the Kubo CSS variables (`var(--background)`,
  `--foreground`, `--card`, `--muted`, `--border`, `--primary`, `--secondary`,
  `--accent`, `--destructive`, `--sidebar-*`, `--ring`). **NEVER** hardcode a hex for
  UI chrome.
- **Default theme is LIGHT.** Dark mode is the `.dark` class on a root ancestor
  (already defined in `colors.css`). Persist the user's choice.
- Primary is the **near-black mono** (`--primary`). Color is reserved for meaning.
- **DELETE the old palette**: no Santander red (`#ec0000`), no Gluon teal
  (`#1fbecb`), no navy background, no blue docs theme, no warm gradients. They are
  replaced by Kubo stone + mono.
- **The one brand color is WOW amber.** Define once: `--wow: #f59e0b;` and
  `--wow-ink: #3a2a06;`. Use amber **only** for: the lightbulb logo, the **New** tag,
  the version-pill tint, the **Docs** CTA button, and the active-filter icon. Nothing
  else. (This is the "reserve color for meaning" principle — amber replaces the old
  pink/teal accents.)

### Brand / logo
- Logo = **loose amber lightbulb** (`assets/favicon.svg`), **no tile / no dark
  square**, beside the "Ways of Work" wordmark (Inter 600, `-0.025em`).
- Tagline is **one line**: EN `Reusable ways of working` · PT `Práticas de trabalho
  reutilizáveis`.
- Set the favicon: `<link rel="icon" type="image/svg+xml" href="/docs/design-system/favicon.svg">` (or copy it to your web root).

### Typography
- **Inter everywhere** (headings included). h1 20px/600 tracking-tight; card & dialog
  title 16px/500; body & UI 14px; meta 12px; fine print 10px. Commands/versions in a
  monospace stack.

### Radii, cards, buttons
- Radii from tokens: pill `--radius-4xl` (buttons, inputs, badges), card
  `--radius-2xl`, etc.
- **Cards are flat** — no border, no drop shadow. Use a ring:
  `box-shadow: 0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)`.
  Hover: amber ring tint + `translateY(-2px)`.
- Buttons: 36px height default, pill, 14px/500; **press = `translateY(1px)`**; hover =
  80% bg opacity; focus = 3px ring at 50%. Destructive is **tinted** (red bg/10 + red
  text), never solid red.
- Inputs: `bg input/30`, 1px `--input` border, pill, 36px; focus 3px ring/50.

### Components & icons
- **Compose from the Kubo components** (in `_ds_bundle.js`): Button, Badge, Card
  (+Header/Title/Description/Content/Footer), Dialog, Input, Select, Switch,
  StatTile, Breadcrumb, PageHeader, Icon, Sidebar pattern. Do **not** re-style raw
  HTML to fake them.
- **Icons = Lucide** via the DS `Icon` set (16px default, stroke 2). **NEVER use
  emoji in the UI** — replace every emoji heading/tile in the docs pages with a Lucide
  glyph in a muted circle. (Emoji only survives inside literal content the product
  itself displays, never as chrome.)

### Layout (app shell)
- Sidebar 256px (`--sidebar`, right border) + header 72px (breadcrumb, left) + main
  `padding:24px; gap:24px`. Page header = h1 + muted description + `separator` below.
- Marketplace sidebar holds the filters: **All Packages**, group **Categories**,
  group **Type** — each an item with a Lucide icon + label + count pill; active item
  uses `--sidebar-accent` bg and an amber icon.

### Bilingual (PT-BR / EN)
- All UI strings **and** package descriptions come from a language dictionary
  (`{ en, pt }`), toggled from the header. Keep both in sync. Do not hardcode
  user-facing strings inline.

### Status tags (New / Updated)
- **New** = published within **30 days** → solid amber pill (`--wow` bg, `--wow-ink`
  text), `sparkles` icon.
- **Updated** = not new AND updated within **30 days** → neutral pill (`--secondary`),
  `clock` icon.
- Wire these to the **real** `published`/`updated` dates from `apm.yml` /
  marketplace metadata (not hardcoded). Show at most one tag per item; New wins over
  Updated. Labels: EN New/Updated · PT Novo/Atualizado.

### Marketplace behavior (preserve)
- Sidebar filters (category / type / all) + free-text search over name + tags +
  description; live "Showing N of M packages" count; **Cards ↔ Table** toggle;
  install **Dialog** with a copy-to-clipboard command (`Copy` → `Copied!`, plus
  `Copy & Close`). Table must scroll horizontally on narrow widths so Tags/Actions
  stay reachable.

### Docs surface (when reskinned)
- Same Kubo shell + tokens + light default. Drop the standalone blue docs theme.
- Phase identity colors (Inception/Implement/Validate/Deploy/Operate/Foundations) may
  stay **as meaning colors** inside diagrams/badges, but page chrome stays mono +
  stone. Convert emoji to Lucide.

### Remove
- The `Powered by APM · View Source` footer.
- The sidebar owner/profile block (unless product asks to keep it).

## Definition of done
- No hardcoded chrome colors; everything resolves from `var(--*)`.
- Light + dark both correct; PT + EN both correct.
- Zero old-palette colors (red/teal/navy/docs-blue) remain in the UI.
- All prior functionality still works.
- Matches `WaysOfWork.dc.html` for the Marketplace screen.

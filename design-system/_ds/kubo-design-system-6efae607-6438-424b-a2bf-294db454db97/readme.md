# Kubo Design System

**Kubo** is a **single-owner personal AI agent atelier** — a web app where one owner collects information (workers), curates knowledge into a citable graph, distributes digests, and builds the workers themselves. Not multi-user, not SaaS. Dense, professional tool UI, near-black mono on warm stone.

**Fixed vocabulary** (use these, not generic terms): **Flow** (not workflow), **Persona** (not agent), **Integração** (not credential), **Worker**, **Run** (execução), **Task**, **Board**, **Gate**, **Destilado**, **Entidade**, **Fonte**. A **Gate** is a task assigned to the Humano persona that halts a flow until the owner approves — surfaced in amber. **Proveniência** (destilado ← item bruto ← fonte ← run) is first-class.

App IA (sidebar): Painel · Conhecimento (Destilados / Entidades / Fontes) · Trabalho (Fluxos / Execuções) · Distribuição (Destinos / Envios) · Catálogos (Integrações / Atores / Modelos). Footer: single owner (Renato Bardi) + light/dark toggle. *(Rótulos de navegação em PT-BR; os termos de domínio — Flow, Persona, Template — seguem no vocabulário conceitual.)*

The visual system was extracted from the **Valmis** web app (shadcn-svelte "maia", stone, Tailwind 4, OKLCH) and ported to framework-agnostic CSS variables + React components; the Kubo product IA above is the real domain the UI kit recreates.

## Sources
- GitHub: https://github.com/renatobardi/valmis — frontend at `apps/web/src` only. Tokens: `src/routes/layout.css`. Components: `src/lib/components/ui/*` (shadcn) and `src/lib/components/custom/*` (product patterns). Explore the repo further for pixel-perfect reference when building new designs.
- `uploads/kubo-design-system.md` — historical source spec from the Valmis extraction (documents the original serif titles + amber primary). **This README and `tokens/` are authoritative for Kubo's final decisions** (Inter everywhere, near-black mono primary); read the spec for source recipes, not for current color/type calls.

## Identity in one paragraph
Inter throughout, the personality holds. Warm stone neutrals with a **near-black mono primary** (ChatGPT-style) — color is reserved for meaning, not chrome. Pill buttons (`--radius-4xl`) that sink 1px on press. Flat cards defined by a `ring`, not shadow or border. Destructive actions always *tinted* (red bg + red text), never solid red. Charts are monochrome stone. Everything runs at 14px density. Persona identity is a monochrome Lucide glyph; the brand mark is a line sakura.

## CONTENT FUNDAMENTALS
- **Tone**: calm, practical, sentence-case. Headings are short nouns: "Home", "Agents", "Sign in", "Recent activity", "Your agents".
- **Descriptions**: one short sentence, ends with period. "An overview of your agents, workflows, and recent activity." / "Enter your credentials to access the dashboard."
- **Second person, contractions welcome**: "Start a chat or run a workflow and it'll show up here." / "Create your first agent to start chatting and building workflows."
- **Meta separators**: middle dot `·` — "3 agents · pick one to start chatting", "Chat · Research Agent", "Enter to send · Shift+Enter for new line".
- **Empty states**: icon in a muted circle + bold one-liner + helper sentence + outline button with a Plus icon.
- **Persona identity**: monochrome **Lucide glyphs** in a muted circle (via `PersonaGlyph` in the UI kit) — personas follow the same monochrome iconography as the rest of the product, not colored emoji. Never emoji in copy or headings.
- Buttons are verb-first and short: "New agent", "View all", "Sign in", "Create a workflow".
- Tagline: **"The art of getting things done"** — rooted in 段取り *(dandori)*, the Japanese art of planning and sequencing steps (maps to agent orchestration + kanban). (Source brand's was "Get work done".)

## VISUAL FOUNDATIONS
- **Color**: warm stone neutrals; primary is **near-black mono** `oklch(0.216 0.006 56)` (dark theme inverts to near-white `0.92`), near-white primary-foreground. Sidebar shares the near-black primary (active nav + logo tile). Dark borders are translucent white (`oklch(1 0 0 / 10%)`). Charts: 5-step monochrome stone ramp. Destructive stays tinted red.
- **Type**: **Inter everywhere**, headings included (ChatGPT-clean). Page h1 20px semibold tracking-tight, card/dialog title 16px medium, body/UI 14px, meta 12px, fine print 10px.
- **Radii**: base 8px. Buttons/inputs/selects/badges = pill 20.8px (`--radius-4xl`). Cards 14.4px (`--radius-2xl`). Textareas 12px. Dialogs 20.8px. Avatars round.
- **Cards**: flat `bg-card` + `ring-1 ring-foreground/10` (render as `box-shadow: 0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)`). No drop shadow, no border. `py-6 gap-6`, sm size `py-4 gap-4`.
- **Buttons**: h-36px default (sm 32, xs 24, lg 40), px-12, 14px medium, pill. Hover = 80% opacity of bg. **Press = translateY(1px)**. Focus = 3px ring at 50% ring color. Disabled = 50% opacity.
- **Destructive**: tinted — `bg destructive/10` (dark /20), text destructive; hover /20 (dark /30).
- **Inputs**: `bg-input/30`, 1px input border, pill, h-36px; focus 3px ring/50 + ring border.
- **Shadows**: essentially none — rings instead. Only small agent/stat cards in source use `shadow-sm` + hover `shadow-md`.
- **Hover states**: background tints (`hover:bg-muted`, `hover:bg-muted/50` rows), color shifts to foreground; card hover: `border-primary/30`. Press: `active:scale-[0.99]` on cards, translate-y-px on buttons.
- **Animation**: fast, subtle — `transition-all`/`transition-colors` ~150ms; dialogs fade+zoom-95 100ms; skeleton pulse; typing dots bounce. No bounces, no long easings.
- **Layout**: sidebar app shell — 256px sidebar (collapses to 48px icons), 72px header (`border-b border/50`, trigger + 1px×16px divider + breadcrumb), main `p-6 gap-6`. Page header: Inter h1 + muted description + actions right + separator mt-16px.
- **Backgrounds**: flat colors only. No gradients, no textures, no imagery. Auth pages sit on `bg-muted/40`.
- **Transparency/blur**: opacity tints everywhere (`/10 /20 /30 /50`); no backdrop blur.
- **Kanban** (Kubo pattern): columns `bg-muted/50 rounded-2xl`, cards = Card size sm, status via Badge variants.

## ICONOGRAPHY
- **Lucide** is the icon system (default 16px, stroke 2; 12px inside badges/xs). Loaded from CDN in this kit: `https://unpkg.com/lucide@latest` — see component cards. Common glyphs: house, bot, message-square, workflow, shield, sparkles, book-open, cpu, user, key, log-out, moon, plus, chevron-*, x, clock, webhook, play, blocks, zap, activity, paperclip, arrow-up.
- Iconify for third-party integration logos (source loads e.g. `/logos/github.svg`).
- **Persona identity is monochrome** — Lucide glyphs in muted circles (`PersonaGlyph`), consistent with the rest of the iconography. No emoji.
- **The Kubo logo is a line sakura mark.** A five-petal cherry blossom drawn in mono line style, beside the "Kubo" wordmark (Inter) — a nod to the "atelier" idea. Theme-aware: pink-filled petals + near-black ink on light, transparent petals + pink outline on dark. In the full lockup the blossom sits loose (no tile); a tiled version (`Logo variant="mark"`) serves as the compact app icon / favicon (`assets/favicon.svg`). The `Sakura` component exposes the bare SVG. Full lockup: loose sakura + "Kubo" + tagline **"The art of getting things done"**. See the "Logo" and "Wordmark" brand cards and `components/brand/Logo.jsx`.

## Index
- `styles.css` — global entry (imports everything below)
- `tokens/` — `colors.css`, `typography.css`, `radius.css`
- `fonts/fonts.css` — Inter + Noto Sans JP via Google Fonts (**substitute**: source uses self-hosted Fontsource variable fonts; ask for binaries)
- `assets/favicon.svg` — app icon (line sakura in a near-black tile)
- `guidelines/` — foundation specimen cards (colors, type, radii, rings)
- `components/actions/` — Button, Badge
- `components/forms/` — Input, Textarea, Label, Select, Switch
- `components/surfaces/` — Card, Dialog, Tooltip, Separator, Skeleton
- `components/navigation/` — Sidebar, Breadcrumb, PageHeader
- `components/kubo/` — AgentAvatar, AgentCard, StatTile, ChatInput (product patterns from `custom/`)
- `components/icons/` — Icon (Lucide glyph wrapper; **intentional addition** — the app uses Lucide throughout)
- `ui_kits/kubo-app/` — interactive recreation of the app (sign in, home dashboard, chat, agents, kanban workflows)
- `templates/kubo-dashboard/` — copyable Kubo app-shell page (sidebar + header + page header + dashboard cards)
- `SKILL.md` — agent skill entry point

### Component inventory notes
Source shadcn inventory: badge, breadcrumb, button, card, command, dialog, dropdown-menu, input, input-group, label, popover, scroll-area, select, separator, sheet, sidebar, skeleton, switch, table, textarea, tooltip. Complex overlay primitives (command ⌘K, dropdown-menu, popover, sheet, scroll-area, input-group, table) are represented inside the UI kit screens rather than as standalone React primitives — styling recipes for them are in `uploads/kubo-design-system.md` §3. **Intentional additions**: PageHeader, StatTile (they exist in source as `page-header.svelte` / `home-stats.svelte`, promoted to primitives here because every screen uses them).

# SP-02 Result — Leptos SSR + WASM Viability

> Spike conducted: 2026-04-17
> Environment: macOS Darwin 25.4.0, Apple Silicon, Rust 1.93.1, Leptos 0.7.8, cargo-leptos 0.3.6

---

## Verdict: GO WITH CONSTRAINTS

Leptos SSR + WASM is viable for Ensi v1 — but requires conscious scope decisions around UI complexity and team familiarity with Rust's ownership model in reactive contexts.

---

## Findings

- **Setup time (zero to first render):** ~15min (toolchain + wasm32 target + cargo-leptos install + project scaffold)
- **Bundle WASM size (release, wasm-opt):** 613 KB uncompressed — **233 KB gzipped**
- **JS glue (release):** 23 KB
- **Cold build time (dev, first ever):** ~48s (downloading 200+ crates); subsequent cold: ~8s
- **Warm build time (dev, incremental):** ~3.9s
- **Release build time:** ~62s
- **HMR / hot reload:** `cargo leptos watch` provides hot reload; page reload latency ~1-2s on code change (not true HMR but acceptable for dev velocity)
- **Server functions ergonomics:** `#[server]` attribute compiles cleanly, type-safe boundary between client/server, async naturally integrates with tokio. Latency on simulated SurrealDB query: imperceptible in dev (50ms server sleep).
- **Axum integration:** Seamless — `leptos_axum::LeptosRoutes` and `generate_route_list` wire up without friction. SSR and static file serving fit naturally into the same Axum `Router`. Single binary confirmed viable.

---

## DX Assessment

**Signals model vs. React hooks:**
Leptos signals (`RwSignal`, `Resource`, `Memo`) are conceptually cleaner than React hooks — no rules-of-hooks, no stale closure bugs from dependency arrays. The reactive graph is explicit. However, the **Rust borrow checker adds friction** in UI code: closures captured by `move` cannot share non-`Copy` values across sibling closures without explicit pre-cloning. This causes compile errors that React devs would never encounter (see issue_board.rs:115). Pattern: always pre-clone signal values before entering multiple `move` closures.

**Reusable components:**
`#[component]` with typed props is ergonomic. Props are plain Rust structs — no JSON serialization overhead. Composing components feels similar to React but with stronger guarantees. Children passing works but requires `Children` type — slightly more ceremonial than JSX spread.

**CSS / Tailwind integration:**
Plain CSS works cleanly via `leptos.toml` `style-file`. Tailwind can be added via `cargo-leptos` integration (PostCSS pipeline) — not tested in this spike but documented as first-class. Design tokens map naturally to CSS custom properties.

**Drag & drop:**
Implementable with native HTML5 drag events (`on:dragstart`, `on:dragover`, `on:drop`) — no library needed for basic use. Full sortable-list DnD would require either a Leptos-native library (ecosystem is thin) or wrapping a JS library via `wasm-bindgen`. This is the most significant DX gap vs. React ecosystem.

---

## UI Complexity Estimates (Leptos vs. Next.js)

| UI | Leptos LOC | Next.js estimated | Complexity relative |
|----|-----------|-----------------|---------------------|
| Issue Board (Kanban + DnD) | 184 | ~150 | slightly harder (borrow checker, DnD ecosystem gap) |
| Pipeline View | 87 | ~70 | similar |
| Server Function (simulated SurrealDB) | ~40 (within board) | ~35 (server action) | similar |
| **Total spike** | **364** | **~280** | **~30% more verbose** |

The verbosity delta is primarily type annotations and clone() calls — not logic. Readability is high once you internalize the pattern.

---

## Recommended approach

**Leptos with reduced drag-and-drop scope for v1.**

Use Leptos fully for SSR, routing, server functions, and all reactive UI. For drag-and-drop (board reordering), use a simplified click-to-move interaction for v1 and defer native DnD to v1.1. This eliminates the main ecosystem risk without sacrificing the Rust/full-stack-single-binary architecture.

---

## Scope recommendation for v1 frontend

| UI | Feasibility | Notes |
|----|-------------|-------|
| Issue Board (column view, status moves) | ✅ Fully viable | Click-to-move for v1, not DnD |
| Issue Board (drag & drop) | ⚠️ Viable but costly | +1 week, thin ecosystem |
| Pipeline View (stages, active state) | ✅ Fully viable | Straightforward signals composition |
| Issue Detail (rich text, comments) | ✅ Viable | Depends on editor library WASM compatibility |
| Real-time updates (SurrealDB live queries) | ✅ Viable | Leptos `Resource` + WebSocket/SSE integrates cleanly |
| Auth flows | ✅ Viable | Axum middleware + server-side session handling |

Realistic estimate: **core board + pipeline + issue detail = 5-6 weeks** for a focused frontend developer familiar with Rust. Learning curve for borrow checker in reactive contexts = ~3-4 days.

---

## Impact on Architecture

1. **Single binary confirmed**: `leptos_axum` + Axum serve both the SSR HTML and the WASM hydration scripts from one binary. No separate Node.js process.

2. **`ensi-frontend` crate design**: Should be a `[[lib]] crate-type = ["cdylib", "rlib"]` with feature flags `ssr` and `hydrate`. The `main.rs` is a thin wrapper that calls into the lib. This is the standard Leptos pattern and it works cleanly.

3. **Server function transport**: `#[server]` uses HTTP POST by default via `gloo-net` on the client side. For Ensi v1, this works. If the architecture moves toward a binary protocol (e.g., WebTransport), the server function transport can be swapped.

4. **WASM budget**: 233 KB gzipped for a dev-mode debug build (including dev instrumentation). A production Ensi app with 5-8 pages will likely land at **350-500 KB gzipped** for the WASM — within acceptable range for a project management tool (users are not on 3G). First load can be optimized with route-based code splitting (Leptos supports `lazy` route loading).

5. **SurrealDB integration**: Server functions run in the Axum context, so `surrealdb` crate (async, tokio-native) integrates naturally. No boundary issues.

6. **Do not use**: `leptos-use` (the Leptos hooks library) is the closest thing to a VueUse/React ecosystem equivalent — evaluate before building low-level reactivity utilities. Worth adding as a dependency.

---

## Risk register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Borrow checker friction in complex UI closures | Medium | Team training + established clone-before-capture pattern |
| Thin ecosystem for DnD, rich text | Medium | Defer DnD to v1.1; evaluate ProseMirror WASM bindings for editor |
| Longer compile times vs. JS | Low | 3.9s warm build is acceptable; use `mold` linker to improve |
| Leptos API stability (v0.7 → v1.0) | Low | v0.7 is production-ready; breaking changes are manageable |

# Patient UI — Visual, A11y, Responsive (Phases 3–6)

## Phase 3 — Visual / tokens

| Check | Result | Bug |
|-------|--------|-----|
| Patient screens use `COLORS.*` | Pass | — |
| Login uses `COLOR_HEX` literals | Partial | PAT-UI-015 |
| Cards `rounded-3xl` + WHITE on GRAY canvas | Pass | — |
| Destructive cancel buttons | Pass | — |
| Compare with Manager dashboard | Consistent shell | — |

## Phase 4 — Edge cases

| Check | Result | Notes |
|-------|--------|-------|
| Wizard unmount on nav change | Fail (by design) | PAT-UI-007 — document or sessionStorage M1 |
| Double-click confirm | Pass | Single state update |
| Empty appointments | Pass | Empty copy shown |
| Logout mid-wizard | Pass | Returns to login |
| Invalid `currentPage` | Fixed P0 | PAT-UI-008 |

## Phase 5 — Accessibility (code review)

| Check | Result | Action |
|-------|--------|--------|
| Form labels login | Pass | `<label>` present |
| Icon Send button | Fixed P0 | `aria-label` |
| Settings decorative | Hidden patient P0 | Reduces confusion |
| Focus ring inputs | Pass | `focus:ring` on login |
| Heading h1 topbar | Pass | Single h1 per view |
| axe scan | Recommend manual | Run on login, wizard confirm, chat |

## Phase 6 — Responsive

| Viewport | Result | Notes |
|----------|--------|-------|
| 1440×900 | Pass | Primary target |
| 1280×720 | Pass | |
| 768×1024 | Partial | Sidebar fixed 224px reduces content |
| 390×844 | Fail | `ml-56` + sidebar — content ~166px; PAT-UI-017 M1 |

**Recommendation M1:** Collapsible sidebar or bottom nav &lt;768px.

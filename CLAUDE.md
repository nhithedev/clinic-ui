# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # tsc -b then Vite production build
npm run preview   # Preview production build
npm run lint      # ESLint (strict — zero-warnings policy)
```

No test suite is configured.

## Architecture

Multi-role clinic management SPA (React 18 + TypeScript + Vite + Tailwind). Four user roles each have dedicated layout wrappers, context providers, and page components:

| Role | Layout Wrapper | Context Provider | Entry in App.tsx |
|------|---------------|-----------------|-----------------|
| Doctor | `DoctorLayoutWrapper` | `DataProvider` | `currentUser.role === 'doctor'` |
| Manager | `ManagerLayoutWrapper` | `ManagerProvider` | `currentUser.role === 'manager'` |
| AI Trainer | `AITrainerLayoutWrapper` | `AITrainerProvider` | `currentUser.role === 'aitrainer'` |
| Patient | `PatientLayoutWrapper` | `PatientProvider` | `currentUser.role === 'patient'` |

**Routing** is state-based — no react-router. `App.tsx` holds `currentPage` state; each role wrapper maps page IDs to components. Valid page IDs are listed in `src/app/components/patient/patient-routes.tsx` (for the patient role) and as constants in each layout wrapper.

**No backend integration.** All data is mocked inside context providers. The Vite config proxies `/api` → `http://localhost:5000` for future use.

### Layout System

`SharedLayout` (`src/app/components/layout/SharedLayout.tsx`) is the root container used by all roles. It composes:
- `Sidebar` — white left nav with active-state highlighting
- `Topbar` — title, description, search, user info
- Optional `rightSidebar` slot — used for the activity calendar and doctor quick-view panels

Role-specific `*LayoutWrapper` components wrap `SharedLayout`, pass the nav config, and render the active page component.

#### SharedLayout height/overflow model (updated 2026-06-03)

```
flex h-screen overflow-hidden                          ← root, prevents body scroll
  flex-1 flex flex-col overflow-hidden ml-56 pt-20    ← main column (sidebar + topbar offsets)
    flex-1 flex flex-col overflow-hidden min-h-0       ← inner column
      main (flex-1 flex flex-col overflow-hidden min-h-0 p-4)
        div.flex-1.items-stretch.gap-4.min-h-0.rounded-3xl.p-4  ← gray container
          section (flex-1 overflow-y-auto h-full)      ← scrollable content, children rendered directly (NO wrapper div)
          aside? (rightSidebarWidth overflow-y-auto h-full)
        footer.flex-shrink-0                           ← always visible, never scrolls
```

**Critical invariants:**
- Children are rendered **directly** inside `<section>` — no `<div className="w-full">` wrapper. This allows `h-full` on child roots to resolve correctly.
- For **scrollable pages** (profile, records): root div is `p-8` with no height constraint — content overflows section, section scrolls via `overflow-y-auto`.
- For **fixed-height pages** (dashboard, consultation-chat, appointments, consultations): root div must be `h-full flex flex-col overflow-hidden` so it fills the section. Toolbar rows use `flex-shrink-0`; scrollable content regions use `flex-1 min-h-0 overflow-y-auto`.
- Footer is `flex-shrink-0` inside `main` (same flex column as the content container) — it is always visible and never covered by content.

#### Doctor layout specifics (updated 2026-06-03)

**DoctorDashboard** (`src/app/components/doctor-dashboard.tsx`):
- Root div: `flex flex-col gap-6 h-full` (fills section, fixed-height page pattern)
- Stats grid: `grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0`
- Chart wrapper: `flex-1 flex flex-col min-h-0` — chart uses `height="100%"` and `redrawOnParentResize: true`

**AppointmentsManagement** (`src/app/components/appointments-management.tsx`) — updated 2026-06-03:
- Root: `h-full flex flex-col overflow-hidden p-6`
- Toolbar (search + filters): `flex-shrink-0`
- **Calendar mode**: wrapped in `flex-1 min-h-0 overflow-y-auto`
- **List mode**: `flex-1 min-h-0 flex gap-6 overflow-hidden` — two independent columns:
  - Left (white card with tabs + list): `flex flex-col min-h-0 bg-white rounded-3xl p-6`, tabs `flex-shrink-0`, list `flex-1 min-h-0 overflow-y-auto`
  - Right (`PatientQuickView`): `flex flex-col min-h-0 overflow-y-auto`, width `flex: 0 0 45%` when open, `0 0 0%` when closed

**PatientQuickView** (`src/app/components/patient-quick-view.tsx`) — updated 2026-06-03:
- Root: `h-full flex flex-col bg-white rounded-3xl border border-[#E5E7EB]` — fills parent column height
- Header: `flex-shrink-0` — always visible
- Content: `flex-1 min-h-0 overflow-y-auto p-6` — scrollable
- Actions (Từ chối / Tiếp nhận): `flex-shrink-0` with `border-t` — pinned at bottom, never obscured by footer

**ConsultationsList** (`src/app/components/consultations-list.tsx`) — updated 2026-06-03:
- Root: `h-full flex flex-col overflow-hidden p-6`
- Stats grid + filter bar: `flex-shrink-0`
- Consultations list: `flex-1 min-h-0 overflow-y-auto space-y-4`

**DoctorLayoutWrapper right sidebar** (`src/app/components/layout/DoctorLayoutWrapper.tsx`):
- Dashboard only (`currentPage === 'dashboard'`), width `w-80`; other pages `w-72`
- Sidebar root: `flex flex-col h-full` — fills the aside height without overflowing footer
- **"Thắc mắc chờ xử lý"** card: `bg-white rounded-3xl flex-shrink-0` — fixed height, max 3 items
- **"Lịch hẹn sắp tới"** card: `bg-white rounded-3xl flex-1 min-h-0 flex flex-col`
  - List uses `absolute inset-0 overflow-y-auto` pattern inside a `relative flex-1 min-h-0` wrapper
  - Fade-out gradient (`bg-gradient-to-t from-white to-transparent pointer-events-none`) at bottom of list
  - Shows all confirmed appointments (no `.slice()` cap) — scroll is meaningful
- Card item backgrounds use `bg-[#F5F5F7]` (COLORS.GRAY) to contrast against white card background

#### CalendarView (`src/app/components/calendar-view.tsx`) — updated 2026-06-03

- **Week starts Monday**: header `['T2','T3','T4','T5','T6','T7','CN']`; offset `(firstDay.getDay() + 6) % 7`
- **Fixed height**: grid always padded to 42 cells (`while (days.length < 42) days.push(null)`) — consistent height across months with 4, 5, or 6 weeks
- **Hướng dẫn popup**: inline instructions removed; replaced with `<Info>` button in the header that toggles an `absolute` popup; closes on click-outside via `useRef` + `useEffect`

#### Responsive notes for next session

- The layout is designed for **desktop only** (sidebar is `fixed w-56`, topbar is `fixed left-56`). There is no mobile breakpoint — adding responsive support would require replacing the fixed sidebar with a drawer/hamburger pattern.
- `DoctorDashboard` stats grid uses `md:grid-cols-3` — collapses to 1 column below md. The chart below it is `h-full` and will collapse if the viewport is too short; a `min-h-[200px]` guard could help on small screens.
- The right sidebar (`w-80`) is never hidden on smaller viewports — this can cause layout compression on screens narrower than ~1200px. A future task: hide right sidebar below `xl` and add a toggle button.
- `AppointmentsManagement` list mode uses two fixed-ratio columns (`55%` / `45%`). On screens narrower than ~1100px, the `PatientQuickView` column can become cramped. A future task: collapse QuickView into a drawer/modal on smaller screens.

### State Management

React Context API only. Each provider holds its role's mock data and exposes setters. No Redux, no Zustand. The patient auth flow (login → register → OTP) uses a local mock OTP `123456`.

## Styling Conventions

`src/styles/tokens.css` is the **single source of truth for all colors** — edit colors here, nowhere else.

`src/styles/colors.ts` exports:
- `COLORS` — CSS `var()` references (for JSX `style` props and layout code)
- `COLOR_HEX` — literal hex values (for Tailwind arbitrary classes like `bg-[#...]`)
- `COLOR_CLASSES` — pre-built Tailwind class combos

Key tokens: `COLORS.BRAND_DARK` (#1F4A51) headers/sidebar, `COLORS.BUTTON_CHOSEN` (#479AA8) primary actions, `COLORS.GRAY` (#F5F5F7) main content background, `COLORS.WHITE` cards.

**Never hardcode hex values in components.** Always reference via `COLORS` or the Tailwind CSS-var extension in `tailwind.config.js`.

UI labels are in **Vietnamese**; code identifiers (variables, props, types, page IDs) are in **English**.

## Key Reference Docs

These files in the repo root give deeper detail:

- `CODING_CONVENTIONS.md` — color usage rules, file placement, language rules
- `DESIGN_TOKENS.md` — full color palette with usage rules
- `LAYOUT_SETUP_GUIDE.md` — SharedLayout API, component props, migration guide
- `SCREEN_MAP.md` — routing table mapping page IDs to components for all roles

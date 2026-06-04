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

#### SharedLayout height/overflow model

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

These files in `docs/` give deeper detail:

- `docs/CODING_CONVENTIONS.md` — color usage rules, file placement, language rules
- `docs/DESIGN_TOKENS.md` — full color palette with usage rules
- `docs/LAYOUT_SETUP_GUIDE.md` — SharedLayout API, component props, migration guide
- `docs/SCREEN_MAP.md` — routing table mapping page IDs to components for all roles

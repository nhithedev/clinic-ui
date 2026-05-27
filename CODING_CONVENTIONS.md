# Coding Conventions — Clinic UI

## Colors

| Context | Use |
|---------|-----|
| Layout (Sidebar, SharedLayout, KPI) | `import { COLORS } from '@/styles/colors'` + `style={{ backgroundColor: COLORS.GRAY }}` |
| Shadcn primitives (`Button`, `Checkbox`) | Tailwind `bg-primary`, `text-destructive` |
| Tailwind arbitrary (legacy) | `COLOR_CLASSES` or `COLOR_HEX` — prefer migrating to `COLORS` / tokens |
| New features | Add `--color-*` in `tokens.css` first |

Do not introduce new hardcoded hex without a token.

## Layout

- Staff and patient shells use `SharedLayout` via role `*LayoutWrapper`.
- Main content canvas: `COLORS.GRAY`, inner cards `WHITE`, `rounded-3xl`.
- Sidebar width: `w-56` (224px); include `logout` item with `id: 'logout'`.

## Language

- UI labels: Vietnamese for user-facing copy.
- Docs: Vietnamese for business/flows; English for IDs, APIs, token names.

## File placement

- Role pages: `src/app/components/` or `src/app/components/patient/`.
- Layout primitives: `src/app/components/layout/`.
- Tokens: `src/styles/`.

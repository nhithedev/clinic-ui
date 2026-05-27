# Color Token Specification — Clinic UI

> **SSOT file:** `src/styles/tokens.css`  
> **TypeScript access:** `import { COLORS } from '@/styles/colors'`  
> **Tailwind / Shadcn:** `bg-primary`, `text-muted-foreground`, etc. via HSL variables in the same file.

---

## Quy tắc sử dụng (Tiếng Việt)

1. **Màn layout staff / patient (sidebar, topbar, KPI):** Ưu tiên `COLORS.*` hoặc `style={{ color: 'var(--color-*)' }}`.
2. **Component Shadcn UI** (`Button`, `Checkbox`, `Dialog`): Dùng class Tailwind `bg-primary`, `text-destructive` — đã map về brand teal / semantic trong `tokens.css`.
3. **Không thêm hex mới** trong feature code; thêm token vào `tokens.css` + export trong `colors.ts` nếu cần màu mới.
4. **Trạng thái đặc biệt** (pending vàng, hover destructive): Dùng `--color-warning-bg`, `--color-destructive-hover`.

---

## Architecture (English)

```text
tokens.css (:root hex + HSL for Tailwind)
    ├── globals.css (@import tokens + scrollbar)
    ├── tailwind.config.js (hsl(var(--primary)) …)
    └── colors.ts (COLORS keys → var(--color-*))
```

`theme.css` and duplicate `:root` in `globals.css` are **deprecated**; content merged into `tokens.css`.

---

## Brand tokens (hex)

| Token key (`COLORS`) | CSS variable | Hex | Usage |
|----------------------|--------------|-----|--------|
| `DARK` | `--color-dark` | `#1F4A51` | Icon boxes, headings |
| `BUTTON_CHOSEN` | `--color-button-chosen` | `#479AA8` | Primary actions, active nav |
| `HOVER` | `--color-hover` | `#F4FDFC` | Row/card hover |
| `LIGHTER` | `--color-lighter` | `#DEF1EF` | KPI footer, alert bg |
| `GRAY` | `--color-gray` | `#F5F5F7` | Main content canvas |
| `WHITE` | `--color-white` | `#FFFFFF` | Cards, sidebar |
| `TEXT_PRIMARY` | `--color-text-primary` | `#1F4A51` | Body headings |
| `TEXT_SECONDARY` | `--color-text-secondary` | `#6B7280` | Descriptions |
| `TEXT_LIGHT` | `--color-text-light` | `#D1D5DB` | Placeholders |
| `BORDER` (via `COLOR_CLASSES`) | `--color-border` | `#E5E7EB` | Borders |

## Semantic tokens

| Key | Variable | Hex |
|-----|----------|-----|
| `SUCCESS` | `--color-success` | `#10B981` |
| `ERROR` | `--color-error` | `#EF4444` |
| `WARNING` | `--color-warning` | `#F59E0B` |
| `INFO` | `--color-info` | `#3B82F6` |
| — | `--color-destructive` | `#d4183d` |
| — | `--color-destructive-hover` | `#b01030` |
| — | `--color-warning-bg` | `#fff4e6` |
| — | `--color-warning-text` | `#f4a261` |

## Chart / demographics

| Key | Variable | Hex |
|-----|----------|-----|
| `CHILDREN` | `--color-chart-children` | `#60A5FA` |
| `ADULTS` | `--color-chart-adults` | `#34D399` |
| `ELDERLY` | `--color-chart-elderly` | `#FBBF24` |

## Tailwind HSL (Shadcn)

| Variable | Maps to |
|----------|---------|
| `--primary` | `BUTTON_CHOSEN` (#479AA8) |
| `--foreground` | `TEXT_PRIMARY` |
| `--background` | white / page |
| `--muted-foreground` | `TEXT_SECONDARY` |
| `--destructive` | `--color-destructive` |
| `--radius` | `0.5rem` (components); cards often `rounded-3xl` in app code |

## Scrollbar (non-token)

Defined in `globals.css`: thumb `#D1D5DB`, hover `#9CA3AF`.

---

## Migration checklist

- [x] Create `tokens.css`
- [x] Import in `globals.css`
- [x] Align `colors.ts` with CSS variables
- [ ] Replace scattered hex in components (incremental)
- [x] Remove unused `theme.css` import path from `index.css` (use tokens only)

---

*See also: [STYLE_GUIDE_GAP.md](./STYLE_GUIDE_GAP.md), [DESIGN_TOKENS.md](../../DESIGN_TOKENS.md) (Phase 2).*

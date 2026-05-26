# Design Tokens — Clinic UI

**SSOT:** [`src/styles/tokens.css`](src/styles/tokens.css)  
**TypeScript:** [`src/styles/colors.ts`](src/styles/colors.ts) — `COLORS`, `COLOR_HEX`, `COLOR_CLASSES`

---

## Màu thương hiệu (Tiếng Việt)

| Tên | Hex | Dùng cho |
|-----|-----|----------|
| Dark | `#1F4A51` | Tiêu đề, icon box KPI |
| Button Chosen | `#479AA8` | Nút chính, sidebar active |
| Hover | `#F4FDFC` | Hover hàng/menu |
| Lighter | `#DEF1EF` | KPI footer, alert nhẹ |
| Gray | `#F5F5F7` | Nền vùng nội dung chính (SharedLayout) |
| White | `#FFFFFF` | Card, sidebar |

## Semantic

Success `#10B981` · Warning `#F59E0B` · Error `#EF4444` · Info `#3B82F6` · Destructive `#d4183d`

## Biểu đồ (DemographicsChart — reserved)

Children `#60A5FA` · Adults `#34D399` · Elderly `#FBBF24`

---

## English — CSS variables

See [docs/design/COLOR_TOKEN_SPEC.md](docs/design/COLOR_TOKEN_SPEC.md) for full `--color-*` and Tailwind HSL mapping.

## Usage rules

1. Layout components: `COLORS.*` or `var(--color-*)`
2. Shadcn UI: `bg-primary`, `text-destructive` (mapped in tokens.css)
3. Do not add new raw hex in feature code

## Component mapping (corrected)

| Area | Background | Notes |
|------|------------|-------|
| Sidebar / Topbar | White | Active item: BUTTON_CHOSEN |
| Main content section | GRAY | `SharedLayout` rounded-3xl wrapper |
| KPI Card top | White | Icon in DARK box; bottom strip LIGHTER |
| KPI Card bottom | LIGHTER | Change % in BUTTON_CHOSEN |

---

*Gap vs external Style Guide: [docs/design/STYLE_GUIDE_GAP.md](docs/design/STYLE_GUIDE_GAP.md)*

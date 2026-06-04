# Color Constants Reference

> **SSOT:** [`src/styles/tokens.css`](src/styles/tokens.css) · Full spec: [DESIGN_TOKENS.md](DESIGN_TOKENS.md)

## Hex Values

```
Primary:
- Dark:            #1F4A51
- Button Chosen:   #479AA8
- Hover:           #F4FDFC
- Lighter:         #DEF1EF
- Gray:            #F5F5F7

Semantic:
- Success:         #10B981
- Error:           #EF4444
- Warning:         #F59E0B
- Info:            #3B82F6
- Destructive:     #d4183d

Demographics (reserved):
- Children:        #60A5FA
- Adults:          #34D399
- Elderly:         #FBBF24

Text:
- Primary:         #1F4A51
- Secondary:       #6B7280
- Light:           #D1D5DB
- Border:          #E5E7EB
```

## Usage

```tsx
import { COLORS, COLOR_CLASSES } from '@/styles/colors';

<div style={{ backgroundColor: COLORS.GRAY, color: COLORS.TEXT_PRIMARY }}>
  Content
</div>
```

Shadcn components: use `bg-primary` (mapped to #479AA8 via tokens).

## Component Color Mapping

| Component | Background | Text | Notes |
|-----------|------------|------|-------|
| Sidebar | WHITE | TEXT_PRIMARY | Active: BUTTON_CHOSEN |
| Topbar | WHITE | TEXT_PRIMARY | |
| Main content area | GRAY | TEXT_PRIMARY | SharedLayout section |
| KPI Card (top) | WHITE | TEXT_PRIMARY | Icon box: DARK |
| KPI Card (bottom) | LIGHTER | BUTTON_CHOSEN change | No cyan divider bar |

## Implementation Checklist

- [x] Central tokens in `tokens.css`
- [x] COLORS references CSS variables
- [x] Scrollbar styling in globals.css
- [x] Shadcn primary aligned to brand teal
- [ ] Migrate remaining hardcoded hex in legacy screens (incremental)
- [ ] DemographicsChart wired to dashboard when needed

# Color Constants Reference

## Hex Values for Quick Copy-Paste

```
Primary:
- Dark:            #1F4A51
- Button Chosen:   #479AA8
- Hover:           #F4FDFC
- Lighter:         #DEF1EF
- Gray:            #F5F5F7
- Cyan Accent:     #06B6D4

Demographics Chart:
- Children (0-12): #60A5FA (Blue)
- Adults (13-59):  #34D399 (Green)
- Elderly (60+):   #FBBF24 (Yellow)

Text:
- Primary Text:    #1F4A51
- Secondary Text:  #6B7280
- Light Text:      #D1D5DB

Borders & Backgrounds:
- Border Light:    #E5E7EB
- White:           #FFFFFF
- Black:           #000000
```

## Usage in TypeScript/React

```tsx
import { COLORS } from '../styles/colors';

// Colors object provides all constants
console.log(COLORS.DARK);           // #1F4A51
console.log(COLORS.BUTTON_CHOSEN);  // #479AA8
console.log(COLORS.CHILDREN);       // #60A5FA

// Direct style usage
<div style={{ backgroundColor: COLORS.DARK, color: COLORS.WHITE }}>
  Content
</div>

// With Tailwind utility
<div className={`${COLORS.DARK}`}>
  This won't work - use inline styles or COLOR_CLASSES
</div>

// Correct Tailwind approach
import { COLOR_CLASSES } from '../styles/colors';
<div className={`${COLOR_CLASSES.DARK}`}>
  Content
</div>
```

## Component Color Mapping

| Component | Background | Text | Border | Accent |
|-----------|-----------|------|--------|--------|
| Sidebar | WHITE | TEXT_PRIMARY | #E5E7EB | BUTTON_CHOSEN |
| Topbar | WHITE | TEXT_PRIMARY | #E5E7EB | BUTTON_CHOSEN |
| Main Content | WHITE | TEXT_PRIMARY | #E5E7EB | - |
| Page Background | GRAY | - | - | - |
| KPI Card | DARK | WHITE | - | CYAN_ACCENT |
| Button Hover | LIGHTER | BUTTON_CHOSEN | #E5E7EB | - |
| Chart Children | - | - | - | CHILDREN |
| Chart Adults | - | - | - | ADULTS |
| Chart Elderly | - | - | - | ELDERLY |

## Implementation Checklist

- [ ] Update all styling to use COLORS constants
- [ ] Replace old color values in all components
- [ ] Apply new scrollbar styling
- [ ] Test contrast ratios for accessibility
- [ ] Verify colors on different screen sizes
- [ ] Test dark mode (if implementing)
- [ ] Update documentation with final colors

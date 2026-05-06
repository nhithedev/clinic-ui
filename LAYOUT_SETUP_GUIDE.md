# Unified Layout System & Color Scheme Setup

## Overview
All components have been redesigned with a unified layout and color system for a cohesive look across all three roles (Doctor, Manager, AI Trainer).

## New Color Palette

All colors are defined in `src/styles/colors.ts`:

```typescript
// Primary Colors
1F4A51 - Dark (dark blue-green)
479AA8 - Button Chosen (teal)
F4FDFC - Hover (very light cyan)
DEF1EF - Lighter (light gray-green)
F5F5F7 - Gray (light gray background)

// Demographics Chart
60A5FA - Children (blue)
34D399 - Adults (green)
FBBF24 - Elderly (yellow)

// Accent
06B6D4 - Cyan Accent
```

## New Layout Components

Located in `src/app/components/layout/`:

### 1. **SharedLayout** - Main container for all pages
```tsx
<SharedLayout
  title="Dashboard"
  description="Brief description"
  sidebarItems={sidebarItems}
  activeItem={activeItem}
  userInfo={{
    name: "User Name",
    role: "Role",
    avatar: "optional"
  }}
  rightSidebar={<OptionalRightComponent />}
  onSidebarItemClick={handleClick}
>
  {/* Page content */}
</SharedLayout>
```

### 2. **Sidebar** - Left navigation
- White background with logo
- Navigation items with hover effects
- Footer credit text
- Active state styling

### 3. **Topbar** - Top navigation
- Page title and description
- Search bar (right side) with icon
- User avatar, name, role
- Settings icon with hover effect

### 4. **KPICard** - Key Performance Indicator cards
For manager dashboard KPIs:
```tsx
<KPICard
  icon={<Activity />}
  label="Today's Visits"
  value="1,294"
  change={12}
  timeframe="vs yesterday"
/>
```
Features:
- Dark background with white text
- Icon in top-right corner
- Cyan divider bar
- Percentage change with trending arrow

### 5. **DemographicsChart** - Column chart for patient demographics
```tsx
<DemographicsChart
  data={demographicsData}
  totalPatients={1000}
  period="This Week"
  onPeriodChange={handlePeriodChange}
/>
```
Features:
- Grouped bars (children, adults, elderly)
- Days of week on X-axis
- Color-coded by age group
- Hover bubbles with details
- Period selector dropdown

### 6. **RightSidebarCalendar** - Calendar with activity tracking
```tsx
<RightSidebarCalendar 
  activities={activities}
  onDateSelect={handleDateSelect}
/>
```
Features:
- Calendar view for nav/manager roles
- Highlights days with activities
- "Back to Today" button
- Activity list for selected date
- Scrollable activity list

### 7. **NotificationBadge** - Account update notifications
```tsx
<NotificationBadge
  count={3}
  onViewDetails={handleView}
  onDismiss={handleDismiss}
/>
```

## Layout Structure

```
┌─────────────────────────────────────────────┐
│          TOPBAR (White, Fixed)              │
├──────────┬──────────────────────┬───────────┤
│          │                      │           │
│ SIDEBAR  │   MAIN CONTENT       │ RIGHT     │
│ (White)  │   (White Card)       │ SIDEBAR   │
│          │                      │ (White)   │
│          │                      │           │
├─────────────────────────────────────────────┤
│           FOOTER (White, Gray text)          │
└─────────────────────────────────────────────┘
```

## Scrollbar Styling

Custom scrollbar with rice-grain appearance:
- Width: 8px
- Thumb color: #D1D5DB (gray)
- Hover: #9CA3AF (darker gray)
- Rounded corners
- Works in Chrome/Edge (webkit) and Firefox

Configuration in `src/styles/globals.css`

## Migration Guide for Existing Components

To update existing components to use the new layout system:

1. **Replace old layout** with SharedLayout
2. **Update colors** to use COLORS constant from `src/styles/colors.ts`
3. **Use new color palette** throughout

Example:
```tsx
// Old
const doctor-dashboard.tsx = () => {
  return <DoctorLayout>...</DoctorLayout>
}

// New
import { SharedLayout, COLORS } from './layout'

const DoctorDashboard = () => {
  const sidebarItems = [...]
  
  return (
    <SharedLayout
      title="Dashboard"
      sidebarItems={sidebarItems}
      userInfo={{name: "Dr. Smith", role: "Doctor"}}
    >
      {/* Content */}
    </SharedLayout>
  )
}
```

## Manager Dashboard Features (New)

### Updated Components:
1. **KPI Cards** - Three cards showing:
   - Daily visits (vs yesterday)
   - Total patients (vs last week)
   - Total appointments (vs today)

2. **Notification Badge** - Yellow alert badge for account updates

3. **Demographics Chart** - Column chart with:
   - Age group breakdown (children, adults, elderly)
   - Daily data
   - Period selector
   - Hover tooltips

4. **Calendar** (Right sidebar):
   - Month navigation
   - Activity indicators
   - Back to today button
   - Activity list

## Files Structure

```
src/
├── styles/
│   ├── colors.ts (NEW)
│   └── globals.css (UPDATED - scrollbar)
├── app/
│   └── components/
│       ├── layout/ (NEW)
│       │   ├── SharedLayout.tsx
│       │   ├── Sidebar.tsx
│       │   ├── Topbar.tsx
│       │   ├── KPICard.tsx
│       │   ├── DemographicsChart.tsx
│       │   ├── RightSidebarCalendar.tsx
│       │   ├── NotificationBadge.tsx
│       │   └── index.ts
│       └── manager-dashboard-new.tsx (NEW)
```

## Next Steps

1. **Update each role's components** to use SharedLayout
2. **Replace all colors** with COLORS constants
3. **Update existing styling** to match new palette
4. **Test responsive design** on different screen sizes
5. **Integrate with existing state management** (contexts)

## Color Usage Examples

```tsx
import { COLORS } from '../styles/colors';

// Direct usage
style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}

// Text
style={{ color: COLORS.TEXT_PRIMARY }}

// Borders
style={{ borderColor: '#E5E7EB' }}

// Or use Tailwind classes
className={`${COLOR_CLASSES.DARK} ${COLOR_CLASSES.TEXT_DARK}`}
```

## Testing

The new `manager-dashboard-new.tsx` includes all new components in action. Test by importing this component to see the complete design system.

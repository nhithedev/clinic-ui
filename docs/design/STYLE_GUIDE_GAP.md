# Phân tích lệch Style Guide — Clinic UI

> **Trạng thái:** Design Direction Package (Phase 0)  
> **Nguyên tắc SSOT:** Giao diện đã implement trong repo (layout staff, `colors.ts`, `SharedLayout`) là chuẩn. Style Guide bên ngoài được **map xuống** code, không ép đổi palette staff trừ khi có quyết định rebrand riêng.

---

## Tóm tắt (Tiếng Việt)

Style Guide mô tả hệ thống teal y tế với Inter, grid 12 cột và nút primary/secondary rõ ràng. Dự án hiện tại dùng teal gần tương đương nhưng **khác hex cụ thể**, thiếu font Inter, dùng `rounded-3xl` nhiều hơn guide, và có **ba nguồn màu** (đã được hợp nhất trong Phase 1 thành `tokens.css`). Patient UI mới sẽ **bám shell staff** (`SharedLayout`), không áp palette `#45939D` từ guide.

### Mức độ lệch

| Mức | Hạng mục |
|-----|----------|
| Cao | Typography (Inter), radius pattern, Shadcn `primary` trước merge |
| Trung bình | Primary hex, text default/muted, grid/container |
| Thấp | Semantic colors, border, background surface |

### Hành động sau khi duyệt

1. Phase 1: `tokens.css` — một nguồn màu, map Shadcn về `#479AA8`.
2. Patient screens: cùng token, `rounded-3xl`, sidebar 224px.
3. Phase 4 (tùy chọn): load Inter, responsive breakpoints theo guide.

---

## Token mapping (English)

| Style Guide token | Guide value | Implemented (SSOT) | CSS variable (post Phase 1) | Action |
|-------------------|-------------|--------------------|-----------------------------|--------|
| Primary | `#45939D` | `#479AA8` | `--color-button-chosen` | Keep implemented; document delta in gap table |
| Primary Dark | `#1E565B` | `#1F4A51` | `--color-dark` | Keep implemented |
| Primary Light | `#E8F4F5` | `#DEF1EF` / `#F4FDFC` | `--color-lighter` / `--color-hover` | Two levels in UI vs one in guide |
| Surface | `#FFFFFF` | `#FFFFFF` | `--color-white` | Aligned |
| Background | `#F4F4F5` | `#F5F5F7` | `--color-gray` | Aligned (main content area) |
| Border | `#E4E4E7` | `#E5E7EB` | `--color-border` | Aligned |
| Text Default | `#183B3E` | `#1F4A51` | `--color-text-primary` | Keep implemented |
| Text Muted | `#71717A` | `#6B7280` | `--color-text-secondary` | Keep implemented |
| Success | `#10B981` | `#10B981` | `--color-success` | Aligned |
| Warning | `#F59E0B` | `#F59E0B` | `--color-warning` | Aligned |
| Error | `#EF4444` | `#EF4444` | `--color-error` | Aligned |
| Info | `#3B82F6` | `#3B82F6` | `--color-info` | Aligned |
| Destructive (Shadcn) | — | `#d4183d` | `--color-destructive` | From legacy theme.css usage |
| Typography | Inter, H1–Caption scale | Browser default | — | Optional Phase 4 |
| Border radius | Subtle rounded | `rounded-3xl` (24px) | `--radius-lg: 1.5rem` | New UI follows staff |
| Icons | Lucide 20–24px | Lucide (varied) | — | Standardize to 20px in conventions |
| Layout grid | 12-col, 1240px | Sidebar `w-56`, fluid main | — | SharedLayout pattern |

---

## Chi tiết theo hạng mục (Tiếng Việt)

### Màu sắc

Guide dùng `#45939D`; staff UI dùng `#479AA8` cho nút active, sidebar chọn, KPI accent. Chênh lệch nhỏ về hue/saturation — người dùng khó phân biệt nhưng **không được trộn hai hex** trên cùng một màn hình. Sau Phase 1 chỉ dùng token.

### Typography

`fonts.css` trống; không import Inter. Tiêu đề màn hình dùng `text-xl` / `text-3xl` ad-hoc. Guide định nghĩa H1 32px → Body 14px; cần quyết định riêng nếu muốn khớp marketing site.

### Components

| Guide | Implemented |
|-------|-------------|
| Primary button filled teal | `COLORS.BUTTON_CHOSEN` / `bg-[#479AA8]` |
| Secondary / text buttons | Gray border, hover `HOVER` |
| Sidebar | `Sidebar.tsx` — white, active teal |
| Modal | Radix Dialog + custom rounded-3xl |
| Status pills | Hex tùy màn (`#fff4e6` pending) → migrate to `--color-warning-bg` |

### Layout

- **Guide:** Top bar + sidebar, filter ngày/trạng thái.  
- **Code:** `Topbar` + `Sidebar` fixed, main `COLORS.GRAY`, optional `rightSidebar`.  
- **Patient:** Cùng `PatientLayoutWrapper` → `SharedLayout`.

---

## Files tham chiếu

| File | Vai trò |
|------|---------|
| [src/styles/tokens.css](../../src/styles/tokens.css) | SSOT màu (Phase 1+) |
| [src/styles/colors.ts](../../src/styles/colors.ts) | `COLORS` / `COLOR_CLASSES` cho React |
| [docs/design/COLOR_TOKEN_SPEC.md](./COLOR_TOKEN_SPEC.md) | Quy ước sử dụng token |
| [COLOR_REFERENCE.md](../../COLOR_REFERENCE.md) | Tham chiếu nhanh (cập nhật Phase 2) |

---

*Cập nhật: Phase 0 deliverable — không thay đổi visual staff khi tạo tài liệu này.*

# Patient UI — Bug Backlog (Triage)

Audit: 2026-05-27 · Matrix: [PATIENT_UI_AUDIT_MATRIX.md](./PATIENT_UI_AUDIT_MATRIX.md)

## P0 — Fixed in this pass

| ID | Title | Severity | Fix |
|----|-------|----------|-----|
| PAT-UI-001 | Mã hẹn success ≠ list/notification | Major | `addAppointment` returns `{ code }`; wizard + notify use same code |
| PAT-UI-003 | Rating không lưu | Major | `rateConsultation` on submit; track `lastConsultationId` |
| PAT-UI-004 | Đổi lịch không cập nhật state | Major | `rescheduleAppointment` in context + wizard UI |
| PAT-UI-008 | `currentPage` invalid → màn trống | Major | `PatientRoutes` fallback to `home` |
| PAT-UI-009 | Search/settings không dùng | Minor | Hidden for patient via `showSearch={false}` |
| PAT-UI-014 | Hủy lịch không confirm | Major | Cancel modal + optional reason |
| PAT-UI-016 | Send thiếu aria-label | Minor | Added `aria-label="Gửi tin nhắn"` |
| PAT-UI-013 | Chọn ngày quá khứ | Minor | `min={today}` on date input |

## P1 — Partial / improved

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| PAT-UI-002 | Không có nhánh mild trong chat | Major | **Improved** — keyword mild + care CTA |
| PAT-UI-006 | Lịch sử khám trống | Major | **Improved** — seed `completed` appointment |

## M1 — Backlog (estimate 3–5d)

| ID | Title | Severity | Estimate | Fix direction |
|----|-------|----------|----------|---------------|
| PAT-UI-007 | Wizard mất progress khi đổi menu | Minor | 1d | `sessionStorage` wizard step |
| PAT-UI-017 | Mobile 390px layout vỡ | Major | 2–3d | Collapsible sidebar / bottom nav |
| PAT-UI-012 | Specialty không có BS | Minor | 0.5d | Empty state + disable continue |
| PAT-UI-005 | Tiếp tục tư vấn cũ | Spec gap | 1d | Resume chat from history |

## M2 — Spec gaps (product decision)

| ID | Title | Notes |
|----|-------|-------|
| PAT-UI-005 | Chi tiết BS riêng, QR thật, upload XN | New screens |
| PAT-UI-010 | F5 mất session | Needs auth persistence |
| PAT-UI-011 | Quên MK copy cho patient | Dedicated patient copy |

## Deferred

| ID | Title |
|----|-------|
| PAT-UI-015 | Login `COLOR_HEX` vs tokens |
| PAT-UI-010 | Session persist on refresh |

## Regression smoke (post-fix)

- [x] `npm run build`
- [ ] Manual: TC-PAT-A01, B06, M02, M03, S04, N02, E02

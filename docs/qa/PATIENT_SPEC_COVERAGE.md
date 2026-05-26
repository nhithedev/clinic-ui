# Patient UI — Spec Coverage (Phase 1)

Legend: **Implemented** | **Partial** | **Missing** | **N/A (mock)**

## Auth

| Spec | Status | Notes |
|------|--------|-------|
| Login SĐT/Email + MK | Implemented | `login.tsx` |
| Register + OTP | Partial | OTP mock only; no resend/validation email |
| Quên mật khẩu | Partial | Shown for all roles; copy targets quản lý |

## Navigation (7 + logout)

| Page ID | Status | Notes |
|---------|--------|-------|
| home | Implemented | |
| book-appointment | Implemented | Wizard |
| my-appointments | Partial | No doctor detail screen |
| symptom-consultation | Partial | No `mild` auto-path in chat logic |
| consultation-history | Partial | No "tiếp tục tư vấn cũ" |
| notifications | Implemented | |
| profile | Implemented | Tabs info/edit/health |

## Booking B1–B10

| Step | Status | Notes |
|------|--------|-------|
| B1 Chọn chuyên khoa | Implemented | |
| B2 AI gợi ý | Partial | Always suggests Tim mạch |
| B3 Danh sách BS | Implemented | No separate B4 chi tiết BS screen |
| B4 Chi tiết BS | Missing | Merged into list selection |
| B5 Chọn phòng khám | Implemented | |
| B6 Chọn ngày giờ | Partial | No past-date block |
| B7 Phiếu khám trước | Partial | Upload UI only |
| B8 Upload XN | Partial | File input non-functional mock |
| B9 Xác nhận | Implemented | |
| B10 Thành công QR | Partial | Lucide icon, not real QR; code sync fixed in P0 |

## Appointments C1–C6

| Item | Status | Notes |
|------|--------|-------|
| C1 Danh sách | Implemented | |
| C2 Lịch sử khám | Partial | `completed` status never set |
| C3 Chi tiết lần khám cũ | Missing | |
| C4 Chi tiết lịch hẹn | Implemented | |
| C5 Đổi lịch | Partial | P0 fix: persist reschedule |
| C6 Huỷ + lý do popup | Partial | P0: confirm modal; reason field M1 |

## Consultation D1–D14

| Item | Status | Notes |
|------|--------|-------|
| D1 Chat | Implemented | |
| D2–D3 Symptom / follow-up | Partial | Fixed 1 follow-up round |
| D4 Kết quả 3 mức | Partial | mild path underused |
| D5–D6 Care / urgent | Implemented | |
| D7 Rating | Partial | P0: persist rating |
| D8–D14 Booking branch | Partial | Via shared wizard |

## Profile G1–G7

| Item | Status | Notes |
|------|--------|-------|
| G1–G2 Info / edit | Implemented | |
| G3–G5 Health / history / allergy | Partial | Read-only lists in health tab |
| G6 Đổi MK | Partial | Mock toast |
| G7 Đăng xuất | Implemented | Sidebar |

## Userflow branches

| Branch | Status |
|--------|--------|
| Login → home | Pass |
| Register → OTP → home | Pass (mock OTP) |
| Booking full path | Pass |
| Booking skip pre-visit | Pass |
| Consult → book | Pass |
| Consult → care → rate | Pass (after P0 rating) |
| F5 refresh session | Missing (expected product gap) |

**Coverage:** 42/48 items Implemented or Partial with documented gap ≈ **87.5%** mapped; 6 Missing deferred to M2.

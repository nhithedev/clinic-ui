# Patient Screen Map / Bản đồ màn hình Bệnh nhân

Unified patient app (đặt lịch khám + tư vấn triệu chứng). Shell: `PatientLayoutWrapper` → `SharedLayout`.

## Navigation / Điều hướng

| Page ID | Title (VI) | EN ID | Component |
|---------|------------|-------|-----------|
| `home` | Trang chủ | `patient_home` | `patient-home.tsx` |
| `book-appointment` | Đặt lịch khám | `book_appointment` | `appointment-booking-wizard.tsx` |
| `my-appointments` | Lịch hẹn của tôi | `my_appointments` | `my-appointments.tsx` |
| `symptom-consultation` | Tư vấn triệu chứng | `symptom_consultation` | `symptom-consultation.tsx` |
| `consultation-history` | Lịch sử tư vấn | `consultation_history` | `consultation-history.tsx` |
| `notifications` | Thông báo | `notifications` | `patient-notifications.tsx` |
| `profile` | Hồ sơ cá nhân | `profile` | `patient-profile.tsx` |

## Booking wizard steps (shared funnel)

| Step | Title (VI) | EN |
|------|------------|-----|
| 1 | Chọn chuyên khoa | `specialty` |
| 2 | Danh sách / Chi tiết bác sĩ | `doctors` |
| 3 | Chọn phòng khám | `clinic` |
| 4 | Chọn ngày giờ | `datetime` |
| 5 | Phiếu khám trước (optional) | `pre_visit` |
| 6 | Xác nhận | `confirm` |
| 7 | Thành công (QR) | `success` |

Entry points: Trang chủ CTA, sidebar, tư vấn → "Đặt lịch".

## Auth screens (unauthenticated)

| Screen | VI | Component |
|--------|-----|-----------|
| Login | Đăng nhập | `login.tsx` |
| Register | Đăng ký | `login.tsx` |
| OTP | Xác thực OTP | `login.tsx` (mock `123456`) |

## Sub-views (within pages)

| Parent | Sub-view | VI |
|--------|----------|-----|
| `my-appointments` | detail | Chi tiết lịch hẹn |
| `my-appointments` | reschedule | Đổi lịch |
| `my-appointments` | history | Lịch sử khám |
| `consultation-history` | detail | Chi tiết cuộc tư vấn |
| `profile` | edit | Chỉnh sửa thông tin |
| `profile` | health | Hồ sơ sức khỏe |

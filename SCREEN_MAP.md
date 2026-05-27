# Screen Map — Clinic UI

## Roles / Vai trò

| Role ID | Label (VI) | Layout wrapper |
|---------|------------|----------------|
| `doctor` | Bác sĩ | `DoctorLayoutWrapper` |
| `manager` | Quản lý | `ManagerLayoutWrapper` |
| `ai-trainer` | Chuyên gia AI | `AITrainerLayoutWrapper` |
| `patient` | Bệnh nhân / Khách hàng | `PatientLayoutWrapper` |

---

## Doctor (`currentPage`)

| Page ID | Title (VI) | Component |
|---------|------------|-----------|
| `dashboard` | Dashboard | `doctor-dashboard` |
| `appointments` | Quản lý lịch hẹn | `appointments-management` (+ Calendar, Patient Quick View) |
| `records` | Hồ sơ khám | `medical-records-updated` |
| `consultations` | Giải đáp thắc mắc | `consultations-list` → `consultation-chat` |
| `profile` | Hồ sơ cá nhân | `doctor-profile` |

## Manager

| Page ID | Title (VI) | Component |
|---------|------------|-----------|
| `dashboard` | Dashboard | `manager-dashboard` |
| `accounts` | Quản lý tài khoản | `account-management-updated` |
| `schedules` | Quản lý lịch làm việc | `schedule-management` |
| `profile` | Hồ sơ cá nhân | `manager-profile` |

## AI Trainer

| Page ID | Title (VI) | Component |
|---------|------------|-----------|
| `dashboard` | Dashboard | `ai-trainer-dashboard` |
| `training` | Quản lý huấn luyện | `training-management` → `request-detail` / `training-results` |
| `prompt-config` | Cấu hình Prompt | `prompt-configuration` |
| `profile` | Hồ sơ | `ai-trainer-profile` |

## Patient

| Page ID | Title (VI) | Component |
|---------|------------|-----------|
| `home` | Trang chủ | `patient/patient-home` |
| `book-appointment` | Đặt lịch khám | `patient/appointment-booking-wizard` |
| `my-appointments` | Lịch hẹn của tôi | `patient/my-appointments` |
| `symptom-consultation` | Tư vấn triệu chứng | `patient/symptom-consultation` |
| `consultation-history` | Lịch sử tư vấn | `patient/consultation-history` |
| `notifications` | Thông báo | `patient/patient-notifications` |
| `profile` | Hồ sơ cá nhân | `patient/patient-profile` |

## Auth (unauthenticated)

| Screen | Component |
|--------|-----------|
| Login (all roles) | `login` |
| Patient register / OTP | `login` (patient flow) |

---

## Reserved components

| Component | Status |
|-----------|--------|
| `DemographicsChart` | Reserved — not on manager dashboard |

## Out of scope (ai-expert spec)

Sections 7–8 in `ai-expert-dashboard.md`: RLHF, guardrails, advanced chat preview — Phase 2 product scope.

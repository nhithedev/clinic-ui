# Task Flow — Clinic UI

> **Mục đích:** Tài liệu này mô tả luồng thao tác của từng vai trò người dùng trong hệ thống quản lý phòng khám. Mỗi luồng bao gồm nhiệm vụ chính, trình tự thao tác và liên kết tới component/màn hình tương ứng.

---

## Mục lục

1. [Luồng xác thực (Auth)](#1-luồng-xác-thực-auth)
2. [Bệnh nhân (Patient)](#2-bệnh-nhân-patient)
3. [Bác sĩ (Doctor)](#3-bác-sĩ-doctor)
4. [Quản lý (Manager)](#4-quản-lý-manager)
5. [AI Trainer](#5-ai-trainer)

---

## 1. Luồng xác thực (Auth)

**Component:** [`src/app/components/login.tsx`](src/app/components/login.tsx)  
**Giao diện:** 5 màn hình dạng carousel trượt ngang

### 1.1 Đăng nhập Bệnh nhân

```
[Màn hình Patient Login]
  → Nhập Email/SĐT + Mật khẩu
  → Nhấn "Đăng nhập"
      ✓ Hợp lệ   → Vào ứng dụng (trang mặc định: Tư vấn triệu chứng)
      ✗ Sai       → Thông báo lỗi inline
  → Nhấn "Đăng ký ngay" → [Màn hình Đăng ký]
  → Nhấn "Đăng nhập với vai trò khác" → [Màn hình Chọn vai trò]
```

### 1.2 Đăng ký Bệnh nhân

```
[Màn hình Đăng ký]
  → Điền: Tên, SĐT*, Email*, Mật khẩu*
  → Nhấn "Tiếp tục"
      ✓ Hợp lệ   → [Màn hình OTP]
      ✗ Thiếu    → Tô đỏ trường bắt buộc
```

### 1.3 Xác thực OTP

```
[Màn hình OTP]
  → Nhập mã 6 chữ số (demo: 123456)
  → Nhấn "Xác thực"
      ✓ Đúng     → Toast thành công → Quay về màn hình Đăng nhập
      ✗ Sai      → Báo lỗi "Mã OTP không đúng"
```

### 1.4 Đăng nhập Nhân viên (Bác sĩ / Quản lý / AI Trainer)

```
[Màn hình Chọn vai trò]
  → Chọn: Bác sĩ | Quản lý | AI Trainer
  → [Màn hình Staff Login]
      → Nhập tên đăng nhập + Mật khẩu
      → Nhấn "Đăng nhập"
          ✓ Hợp lệ → Vào ứng dụng theo vai trò tương ứng
```

| Vai trò    | Tài khoản demo     | Mật khẩu     |
|------------|--------------------|--------------|
| Bác sĩ     | `doctor1`          | `doctor123`  |
| Quản lý    | `manager1`         | `manager123` |
| AI Trainer | `aitrainer1`       | `trainer123` |

---

## 2. Bệnh nhân (Patient)

**Layout:** [`src/app/components/layout/PatientLayoutWrapper.tsx`](src/app/components/layout/PatientLayoutWrapper.tsx)  
**Router:** [`src/app/components/patient/patient-routes.tsx`](src/app/components/patient/patient-routes.tsx)  
**Trang mặc định khi đăng nhập:** `symptom-consultation`

### Sơ đồ điều hướng tổng quát

```
Sidebar (trái)
├── Tư vấn triệu chứng      → symptom-consultation  [badge: không]
├── Tổng quan lịch khám     → appointment-overview  [badge: không]
├── Lịch sử tư vấn          → consultation-history  [badge: không]
├── Tư vấn bác sĩ           → doctor-consultations  [badge: số chờ xử lý]
├── Hồ sơ khám bệnh         → medical-records       [badge: không]
├── Thông báo               → notifications         [badge: số chưa đọc]
└── Hồ sơ cá nhân          → profile               [badge: không]
```

---

### 2.1 Tư vấn triệu chứng (AI Chat)

**Component:** [`src/app/components/patient/symptom-consultation.tsx`](src/app/components/patient/symptom-consultation.tsx)

**Nhiệm vụ chính:** Mô tả triệu chứng → nhận tư vấn từ AI → đặt lịch hoặc gửi cho bác sĩ

#### Trình tự thao tác

```
[pre-chat] Màn hình chào
  ├── Nhấn "Đặt lịch khám bệnh"
  │       → [consult-form] Điền form triệu chứng (mức độ mild/moderate/urgent)
  │       → Gửi → AI phân tích → [post-advice] Xem kết quả tư vấn
  │               ├── "Đặt lịch khám"   → [booking-form]
  │               ├── "Tư vấn thêm"     → [consult-form] (lặp lại)
  │               ├── "Gửi bác sĩ"      → Modal xác nhận → Tạo tư vấn bác sĩ → [free-chat]
  │               └── "Không, cảm ơn"  → [free-chat]
  │
  ├── Nhấn "Tư vấn"
  │       → [consult-form] → (giống trên)
  │
  └── Gõ tin nhắn tự do → [free-chat] hội thoại mở

[booking-form] Điền thông tin đặt lịch
  → [doctor-selection] Chọn bác sĩ từ danh sách phù hợp
      ├── Chọn bác sĩ → [booking-confirm] Xác nhận thông tin
      │       ├── "Có"          → Đặt lịch thành công → Tạo lịch hẹn → [free-chat]
      │       ├── "Không"       → [free-chat]
      │       └── "Đổi bác sĩ"  → [doctor-selection]
      └── "Sửa thông tin"       → [booking-form]

[booking-no-doctor] Không có bác sĩ khả dụng
  ├── "Có" → [booking-form] (chọn lại thời gian)
  └── "Không" → [free-chat]
```

**Hành động bổ sung trong chat:**
- Nút mic → Ghi âm giọng nói (toggle, có chỉ báo trực quan)
- Nút loa trên tin nhắn bot → Nghe phát lại
- Nút lưu → Lưu lịch sử hội thoại

---

### 2.2 Tổng quan lịch khám

**Component:** [`src/app/components/patient/appointment-overview.tsx`](src/app/components/patient/appointment-overview.tsx)

**Nhiệm vụ chính:** Xem, tạo mới, đổi lịch, hủy lịch hẹn

#### Trình tự thao tác

```
[Danh sách lịch hẹn]
  ├── Tab "Chờ xác nhận" | Tab "Đã xác nhận"
  ├── Thanh tìm kiếm (theo chuyên khoa / bác sĩ / phòng khám)
  │
  ├── Nhấn vào một lịch hẹn
  │       → [Panel chi tiết bên phải] Xem thông tin đầy đủ
  │               ├── Nhấn "Đổi lịch"
  │               │       → Chọn ngày mới
  │               │       → Chọn khung giờ
  │               │       → Chọn bác sĩ (tuỳ chọn)
  │               │       → Xác nhận → Cập nhật lịch hẹn
  │               └── Nhấn "Hủy lịch"
  │                       → Nhập lý do hủy (textarea)
  │                       → Xác nhận → Xóa lịch hẹn
  │
  └── Nhấn "Tạo lịch hẹn mới"
          → [Wizard Modal - 5 bước]
              Bước 1: Chọn chuyên khoa
              Bước 2: Chọn bác sĩ
              Bước 3: Chọn phòng khám
              Bước 4: Chọn ngày & khung giờ
              Bước 5: (Tuỳ chọn) Form thông tin trước khám
              → Xác nhận → Tạo lịch hẹn → Hiện mã/QR code
```

---

### 2.3 Lịch sử tư vấn

**Component:** [`src/app/components/patient/consultation-history.tsx`](src/app/components/patient/consultation-history.tsx)

**Nhiệm vụ chính:** Xem lại các cuộc tư vấn AI đã thực hiện

```
[Danh sách lịch sử]  (bảng: ngày, mức độ, tóm tắt)
  └── Nhấn vào một hàng
          → [Chi tiết] Xem toàn bộ hội thoại (chế độ chỉ đọc)
```

---

### 2.4 Tư vấn bác sĩ

**Component:** [`src/app/components/patient/patient-doctor-consultations.tsx`](src/app/components/patient/patient-doctor-consultations.tsx)

**Nhiệm vụ chính:** Nhắn tin với bác sĩ, xem phản hồi và tóm tắt AI

```
[Danh sách tư vấn]  (sắp xếp: Chờ xử lý trước, Đã xử lý sau)
  └── Nhấn vào một tư vấn
          → [Giao diện chat]
                  ├── [Cột trái]  Hội thoại với bác sĩ
                  │       → Nếu trạng thái "Chờ" → Có thể nhập và gửi tin nhắn
                  │       → Nếu "Đã xử lý" → Chỉ đọc
                  ├── [Cột giữa] Tóm tắt AI từ tư vấn gốc
                  └── [Cột phải] Thông tin bác sĩ phụ trách
```

---

### 2.5 Hồ sơ khám bệnh

**Component:** [`src/app/components/patient/patient-medical-records.tsx`](src/app/components/patient/patient-medical-records.tsx)

**Nhiệm vụ chính:** Xem hồ sơ bệnh án, đặt lịch tái khám

```
[Danh sách hồ sơ]
  ├── Thanh tìm kiếm (theo chẩn đoán)
  ├── Bộ lọc theo tháng / năm
  │
  └── Nhấn vào một hồ sơ
          → [Panel chi tiết]
                  Xem: chẩn đoán, triệu chứng, phác đồ điều trị, thuốc, ghi chú, ngày tái khám
                  └── Nhấn "Đặt lịch tái khám"
                          → Chọn khung giờ
                          → Xác nhận → Tạo lịch hẹn (có mã hẹn)
```

---

### 2.6 Thông báo

**Component:** [`src/app/components/patient/patient-notifications.tsx`](src/app/components/patient/patient-notifications.tsx)

```
[Danh sách thông báo]  (badge số chưa đọc trên sidebar)
  ├── Nhấn "Đánh dấu tất cả đã đọc" → Xóa toàn bộ badge
  └── Nhấn vào một thông báo
          → [Chi tiết] Nội dung đầy đủ + dấu thời gian → Đánh dấu đã đọc
```

---

### 2.7 Hồ sơ cá nhân (Bệnh nhân)

**Component:** [`src/app/components/patient/patient-profile.tsx`](src/app/components/patient/patient-profile.tsx)

```
[3 tab]
├── Tab "Thông tin"
│       Xem: tên, SĐT, email, ngày sinh, ...
│       → Nhấn "Đổi mật khẩu" → Form inline
│
├── Tab "Chỉnh sửa"
│       Cập nhật: tên, SĐT, email
│       Quản lý tiền sử bệnh: thêm / xóa mục
│       Quản lý dị ứng: thêm / xóa mục
│       → Nhấn "Lưu" → Cập nhật thông tin
│
└── Tab "Lịch sử khám"
        Lưới các lần khám: chẩn đoán, bác sĩ, triệu chứng, đơn thuốc, ghi chú
```

---

## 3. Bác sĩ (Doctor)

**Layout:** [`src/app/components/layout/DoctorLayoutWrapper.tsx`](src/app/components/layout/DoctorLayoutWrapper.tsx)  
**Trang mặc định:** `dashboard`

### Sơ đồ điều hướng tổng quát

```
Sidebar (trái)
├── Dashboard           → dashboard
├── Quản lý lịch hẹn   → appointments
├── Hồ sơ khám         → records
├── Giải đáp thắc mắc  → consultations
└── Hồ sơ cá nhân     → profile

Sidebar phải (chỉ hiện ở Dashboard)
└── Danh sách thắc mắc chờ xử lý (tối đa 3 mục) → click → consultations
```

---

### 3.1 Dashboard Bác sĩ

**Component:** [`src/app/components/doctor-dashboard.tsx`](src/app/components/doctor-dashboard.tsx)

```
[Dashboard]
  ├── KPI cards: Lịch hẹn chờ | Khám xong hôm nay | Tư vấn chờ xử lý
  │       → Nhấn số tư vấn → Điều hướng tới trang Giải đáp thắc mắc
  │
  └── Card "Lịch hẹn sắp tới"
          Danh sách lịch hẹn đã xác nhận (cuộn được)
          → Nhấn "Xem tất cả" → Điều hướng tới Quản lý lịch hẹn
```

---

### 3.2 Quản lý lịch hẹn

**Component:** [`src/app/components/appointments-management.tsx`](src/app/components/appointments-management.tsx)

**Nhiệm vụ chính:** Duyệt / từ chối lịch hẹn, xem lịch hẹn theo ngày

```
[Thanh công cụ]
  ├── Tìm kiếm (theo tên / SĐT bệnh nhân)
  ├── Bộ lọc (trạng thái, ngày, bác sĩ)
  └── Chuyển chế độ: Danh sách | Lịch

[Chế độ Danh sách]
  ├── Tab "Yêu cầu mới"  (lịch hẹn chờ xác nhận)
  │       → Nhấn vào một lịch hẹn → [PatientQuickView] Panel bên phải
  │               Xem: thông tin bệnh nhân, triệu chứng, ghi chú
  │               ├── "Tiếp nhận"  → Xác nhận lịch hẹn → Chuyển sang tab Đã xác nhận
  │               └── "Từ chối"    → Modal nhập lý do → Xác nhận → Loại khỏi danh sách
  │
  └── Tab "Đã xác nhận"
          Danh sách lịch hẹn đã duyệt (chỉ xem)

[Chế độ Lịch]
  CalendarView: [`src/app/components/calendar-view.tsx`](src/app/components/calendar-view.tsx)
  ├── Xem lịch hẹn theo tuần (bắt đầu Thứ 2)
  ├── Click ô ngày → Xem lịch hẹn ngày đó
  └── Nút Info → Popup hướng dẫn sử dụng
```

---

### 3.3 Hồ sơ khám

**Component:** [`src/app/components/medical-records-updated.tsx`](src/app/components/medical-records-updated.tsx)

**Nhiệm vụ chính:** Tạo và quản lý bệnh án cho bệnh nhân

```
[Danh sách bệnh nhân / hồ sơ]
  ├── Tìm kiếm (theo tên / SĐT bệnh nhân)
  │
  ├── Nhấn "Tạo hồ sơ mới"
  │       → Form: Chọn bệnh nhân, triệu chứng, chẩn đoán, phác đồ điều trị
  │       → Thêm thuốc (tên, liều, tần suất)
  │       → Đặt ngày tái khám (tuỳ chọn)
  │       → Lưu → Tạo bệnh án mới
  │
  └── Nhấn vào một hồ sơ
          → [Chi tiết hồ sơ]
                  Xem: triệu chứng, chẩn đoán, điều trị, thuốc, ghi chú, ngày tái khám
                  ├── Chỉnh sửa nội dung
                  ├── In / Tải về
                  └── Thêm lần khám mới
```

---

### 3.4 Giải đáp thắc mắc

**Component:** [`src/app/components/consultations-list.tsx`](src/app/components/consultations-list.tsx) → [`src/app/components/consultation-chat.tsx`](src/app/components/consultation-chat.tsx)

**Nhiệm vụ chính:** Phản hồi các câu hỏi / tư vấn từ bệnh nhân

```
[Danh sách tư vấn]
  ├── Stats: Tổng | Chờ xử lý | Đang xử lý | Đã xử lý
  ├── Bộ lọc theo trạng thái / mức ưu tiên
  │
  └── Nhấn vào một tư vấn
          → [Giao diện chat]
                  ├── Xem toàn bộ lịch sử hội thoại AI – bệnh nhân
                  ├── Xem tóm tắt AI
                  ├── Nhập và gửi phản hồi cho bệnh nhân
                  └── Đánh dấu "Đã xử lý" → Chuyển trạng thái
```

---

### 3.5 Hồ sơ cá nhân (Bác sĩ)

**Component:** [`src/app/components/doctor-profile.tsx`](src/app/components/doctor-profile.tsx)

```
[Trang hồ sơ]
  ├── Xem thông tin cá nhân (tên, chuyên khoa, email, SĐT, ...)
  ├── Nhấn "Chỉnh sửa" → Form cập nhật thông tin
  └── Nhấn "Đổi mật khẩu" → Form inline
```

---

## 4. Quản lý (Manager)

**Layout:** [`src/app/components/layout/ManagerLayoutWrapper.tsx`](src/app/components/layout/ManagerLayoutWrapper.tsx)  
**Trang mặc định:** `dashboard`

### Sơ đồ điều hướng tổng quát

```
Sidebar (trái)
├── Dashboard              → dashboard
├── Quản lý tài khoản      → accounts
├── Quản lý lịch làm việc  → schedules
└── Hồ sơ cá nhân        → profile

Sidebar phải (Dashboard)
└── Lịch hoạt động + Cảnh báo hồ sơ chưa hoàn thiện
```

---

### 4.1 Dashboard Quản lý

**Component:** [`src/app/components/manager-dashboard.tsx`](src/app/components/manager-dashboard.tsx)

```
[Dashboard]
  ├── KPI cards: Lượt khám hôm nay | Lịch hẹn hôm nay | Bệnh nhân mới tuần này
  ├── Biểu đồ thống kê độ tuổi bệnh nhân (ApexChart)
  └── Feed hoạt động gần đây

[Sidebar phải]
  ├── Lịch hoạt động (đánh dấu ngày có sự kiện)
  └── Danh sách hồ sơ nhân viên chưa hoàn thiện
          → Nhấn vào → Điều hướng tới Quản lý tài khoản + mở form chỉnh sửa
```

---

### 4.2 Quản lý tài khoản

**Component:** [`src/app/components/account-management-updated.tsx`](src/app/components/account-management-updated.tsx)

**Nhiệm vụ chính:** Tạo, chỉnh sửa tài khoản nhân viên

```
[Danh sách nhân viên]
  ├── Tìm kiếm theo tên / bộ phận
  ├── Tab lọc: Tất cả | Hồ sơ chưa hoàn thiện
  │
  ├── Nhấn "Tạo tài khoản"
  │       → Form: Tên, Vai trò, Email, SĐT, ...
  │       → Lưu → Tạo tài khoản mới
  │
  ├── Nhấn vào một tài khoản → Xem chi tiết
  │
  └── Nhấn "Chỉnh sửa" (inline hoặc trong chi tiết)
          → Form cập nhật thông tin
          → Lưu → Cập nhật tài khoản
```

---

### 4.3 Quản lý lịch làm việc

**Component:** [`src/app/components/schedule-management.tsx`](src/app/components/schedule-management.tsx)

**Nhiệm vụ chính:** Phân công ca làm việc cho nhân viên

```
[Lịch làm việc]
  ├── Xem ca làm việc hiện tại (theo tuần / tháng)
  ├── Nhấn "Tạo ca mới"
  │       → Form: Ngày, Khung giờ, Bác sĩ phụ trách
  │       → Lưu → Thêm ca vào lịch
  │
  └── Nhấn vào một ca
          → Chỉnh sửa hoặc Xóa ca làm việc
```

---

## 5. AI Trainer

**Layout:** [`src/app/components/layout/AITrainerLayoutWrapper.tsx`](src/app/components/layout/AITrainerLayoutWrapper.tsx)  
**Trang mặc định:** `dashboard`

### Sơ đồ điều hướng tổng quát

```
Sidebar (trái)
├── Dashboard AI Training  → dashboard
├── Dữ liệu - Huấn luyện  → training
├── Cấu hình Prompt        → prompt-config
└── Hồ sơ cá nhân        → profile
```

---

### 5.1 Dashboard AI Trainer

**Component:** [`src/app/components/ai-trainer-dashboard.tsx`](src/app/components/ai-trainer-dashboard.tsx)

```
[Dashboard]
  ├── Stats: Mô hình đang huấn luyện | Dữ liệu chờ xử lý | Độ chính xác | Cảnh báo
  ├── Cards tiến độ huấn luyện (theo từng dự án)
  │       → Nhấn → Điều hướng tới trang Training (tab tương ứng)
  └── Feed hoạt động khẩn cấp
```

---

### 5.2 Dữ liệu & Huấn luyện

**Component:** [`src/app/components/training-management.tsx`](src/app/components/training-management.tsx) → [`src/app/components/request-detail.tsx`](src/app/components/request-detail.tsx) → [`src/app/components/training-results.tsx`](src/app/components/training-results.tsx)

**Nhiệm vụ chính:** Tạo yêu cầu huấn luyện, quản lý dữ liệu và xem kết quả

```
[3 tab]
├── Tab "Yêu cầu"
│       Danh sách các yêu cầu huấn luyện
│       ├── Nhấn "Tạo yêu cầu mới"
│       │       → Form: Tên dự án, Mô tả, Thông số kỹ thuật
│       │       → Thêm dữ liệu mẫu (cặp triệu chứng – chẩn đoán)
│       │       → Gửi → Tạo yêu cầu mới
│       │
│       └── Nhấn vào một yêu cầu → [Request Detail]
│               Xem thông tin chi tiết yêu cầu
│               ├── Thêm / xóa hàng dữ liệu
│               └── Gửi đi huấn luyện
│
├── Tab "Đang huấn luyện"
│       Danh sách các job đang chạy
│       └── Nhấn vào một job → [Training Results]
│               Xem tiến độ real-time (thanh tiến trình, metrics)
│
└── Tab "Hoàn thành"
        Danh sách mô hình đã huấn luyện xong
        └── Nhấn vào → [Training Results]
                Xem kết quả: độ chính xác, loss curve, confusion matrix, ...
```

---

### 5.3 Cấu hình Prompt

**Component:** [`src/app/components/prompt-configuration.tsx`](src/app/components/prompt-configuration.tsx)

```
[Trang cấu hình]
  ├── Xem / chỉnh sửa System Prompt
  ├── Thêm / xóa các prompt mẫu
  ├── Nhấn "Kiểm thử" → Nhập câu hỏi test → Xem phản hồi mô hình
  └── Lưu cấu hình → Áp dụng cho hệ thống AI tư vấn
```

---

## Ghi chú chung

| Mục              | Chi tiết |
|------------------|----------|
| **Routing**      | State-based (`currentPage` trong `App.tsx`), không dùng react-router |
| **Dữ liệu**      | Toàn bộ mock trong Context providers, chưa có backend thật |
| **Ngôn ngữ UI**  | Tiếng Việt |
| **Ngôn ngữ code**| Tiếng Anh (identifiers, props, page IDs) |
| **Reset state**  | Nhấn lại cùng sidebar item phát sự kiện `window` để reset state component |
| **Auth mock**    | OTP demo: `123456`; phiên đăng nhập được lưu trong `localStorage` |

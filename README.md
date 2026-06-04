# Clinic UI - Setup Guide

## Project Overview / Tổng quan

React + TypeScript + Tailwind clinic management UI for **Doctor**, **Manager**, **AI Trainer**, and **Patient** roles.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # preview production build
```

## Demo accounts / Tài khoản demo

| Role | Username | Password |
|------|----------|----------|
| Bác sĩ | `doctor1` | `doctor123` |
| Quản lý | `manager1` | `manager123` |
| AI Trainer | `aitrainer1` | `trainer123` |
| Bệnh nhân | `patient1` | `patient123` |

Patient registration: use **Đăng ký** on login (mock OTP: `123456`).

## Project Structure

- `src/app/App.tsx` — routing by role
- `src/app/components/doctor/` — doctor role screens
- `src/app/components/manager/` — manager role screens
- `src/app/components/ai-trainer/` — AI trainer role screens
- `src/app/components/patient/` — patient role screens
- `src/app/components/layout/` — SharedLayout, wrappers, KPI
- `src/styles/tokens.css` — **color SSOT**
- `docs/design/` — design direction & patient flows

## User Roles / Vai trò

1. **Doctor** — appointments, records, consultations  
2. **Manager** — accounts, schedules, dashboard  
3. **AI Trainer** — training, prompt config  
4. **Patient** — book appointment, symptom chat, profile (register + OTP)

## Tech Stack

- React 18, TypeScript, Vite  
- Tailwind CSS, tailwindcss-animate  
- Shadcn UI (Radix primitives)  
- recharts, react-apexcharts, react-day-picker, cmdk, vaul, embla-carousel, next-themes  
- React Hook Form, Sonner  

## Available Screens

See [SCREEN_MAP.md](docs/SCREEN_MAP.md).

**Patient:** Symptom consultation (default), Appointment overview, Consultation history, Doctor consultations, Medical records, Notifications, Profile.

**Staff:** Login, dashboards, role-specific pages (see SCREEN_MAP).

## Development Notes

- Context providers hold mock data (no backend required for UI testing).
- API proxy target documented for future backend: `http://localhost:5000`.
- No `.env` file shipped; add locally if needed for API URL overrides.

## Documentation

| Doc | Purpose |
|-----|---------|
| [DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) | Colors & usage (VI + EN) |
| [LAYOUT_SETUP_GUIDE.md](docs/LAYOUT_SETUP_GUIDE.md) | Layout components |
| [docs/design/PATIENT_SCREEN_MAP.md](docs/design/PATIENT_SCREEN_MAP.md) | Patient pages |
| [docs/design/PATIENT_USERFLOWS.md](docs/design/PATIENT_USERFLOWS.md) | Patient flows |

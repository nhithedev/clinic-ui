# Clinic UI - Setup Guide

## Project Overview
This is a React + TypeScript + Tailwind CSS clinic management system UI featuring multiple user roles (Doctor, Manager, AI Trainer).

## Quick Start

### Installation (Already Done)
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Project Structure
- `src/app/App.tsx` - Main application component
- `src/app/components/` - Feature components (doctor, manager, AI trainer layouts & pages)
- `src/app/components/ui/` - Reusable UI components (Shadcn UI)
- `src/styles/` - Global styles and Tailwind CSS configuration
- `src/imports/` - Static assets and data

## User Roles
1. **Doctor** - Manage appointments, medical records, consultations
2. **Manager** - Manage schedule, staff accounts, and resources
3. **AI Trainer** - Manage training data and configuration

## Tech Stack
- React 18
- TypeScript
- Vite (fast build tool)
- Tailwind CSS (styling)
- Shadcn UI (component library)
- React Hook Form (form management)
- Sonner (toast notifications)

## Development Notes
- The app uses context providers for state management
- No backend is required for UI testing - components use mock data
- API calls can be added to interact with a backend at the proxy URL (http://localhost:5000)
- Modify `.env` for custom API endpoints

## Available Screens
- Login
- Doctor Dashboard, Appointments, Medical Records, Profile, Consultations
- Manager Dashboard, Account Management, Schedule Management, Profile
- AI Trainer Dashboard, Training Management, Prompt Configuration, Profile

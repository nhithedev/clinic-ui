# Changelog

## Unreleased

### Fixed (Patient UI QA)
- Unified appointment confirmation code across success screen, list, and notifications.
- Consultation star rating persisted via `rateConsultation`.
- Reschedule and cancel-with-confirmation for patient appointments.
- Invalid patient routes fall back to home; topbar search/settings hidden for patient role.
- Mild consultation path and sample completed appointment for history.

### Added
- Unified color tokens (`src/styles/tokens.css`) — single source for `colors.ts`, Tailwind/Shadcn, and globals.
- Patient role: login/register/OTP (mock), `PatientLayoutWrapper`, unified sidebar navigation.
- Patient screens: home, booking wizard, appointments, symptom consultation, consultation history, notifications, profile.
- Design docs: `docs/design/STYLE_GUIDE_GAP.md`, `docs/design/COLOR_TOKEN_SPEC.md`, `docs/design/PATIENT_*`, `DESIGN_TOKENS.md`, `SCREEN_MAP.md`, `CODING_CONVENTIONS.md`.

### Changed
- `colors.ts` exports CSS `var(--color-*)` references aligned with tokens.
- `globals.css` imports `tokens.css`; removed duplicate `:root` HSL block.
- `LAYOUT_SETUP_GUIDE.md`, `COLOR_REFERENCE.md`, `README.md` updated for factual accuracy.
- `INTEGRATION_EXAMPLES.tsx` import paths and manager sidebar examples.

### Deprecated
- `src/styles/theme.css` — merged into `tokens.css` (do not import).

### Notes
- `DemographicsChart` retained for future manager dashboard use.

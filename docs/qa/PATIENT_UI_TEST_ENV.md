# Patient UI — Test Environment

| Item | Value |
|------|-------|
| App URL | `http://localhost:5173` |
| Start command | `npm run dev` |
| Build verify | `npm run build` |
| Lint | `npm run lint` |

## Accounts

| Role | Username | Password |
|------|----------|----------|
| Patient | `patient1` | `patient123` |
| Patient (email) | `patient@example.com` | `patient123` |
| Register OTP (mock) | — | `123456` |

## Viewports (Phase 6)

| ID | Size | Device |
|----|------|--------|
| VP-1 | 1440×900 | Desktop |
| VP-2 | 1280×720 | Laptop |
| VP-3 | 768×1024 | Tablet |
| VP-4 | 390×844 | Mobile |

## Smoke regression (post P0)

- TC-PAT-A01, N01, B01, B06, S03, M02, X01
- `npm run build`

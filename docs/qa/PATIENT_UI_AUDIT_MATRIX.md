# Patient UI Audit Matrix

Audit date: 2026-05-27 · Build: `npm run build` pass  
Environment: [PATIENT_UI_TEST_ENV.md](./PATIENT_UI_TEST_ENV.md)

| ID | Nguồn | Màn hình | Kết quả mong đợi | Result | Bug ID | Severity |
|----|-------|----------|------------------|--------|--------|----------|
| TC-PAT-A01 | Userflow | auth | Login patient1 → home | Pass | — | — |
| TC-PAT-A02 | Userflow | auth | Sai MK → lỗi | Pass | — | — |
| TC-PAT-A03 | Userflow | auth | Register → OTP 123456 | Pass | — | — |
| TC-PAT-A04 | Heuristic | auth | Đổi role reset tab | Pass | — | — |
| TC-PAT-A05 | Heuristic | auth | Nút Dùng demo | Pass | — | — |
| TC-PAT-A06 | Heuristic | auth | Quên MK patient | Partial | PAT-UI-011 | Minor |
| TC-PAT-A07 | Heuristic | auth | HTML in input renders escaped | Pass | — | — |
| TC-PAT-N01 | Screen map | shell | Sidebar active state | Pass | — | — |
| TC-PAT-N02 | Userflow | shell | Logout → login → home | Pass | — | — |
| TC-PAT-N03 | Edge | shell | Wizard mid → sidebar → reset | Fail→Doc | PAT-UI-007 | Minor |
| TC-PAT-N04 | Screen map | shell | Topbar title map | Pass | — | — |
| TC-PAT-N05 | Heuristic | shell | Search | Pass (hidden) | PAT-UI-009 | Minor |
| TC-PAT-N06 | Heuristic | shell | Settings no-op | Pass (hidden) | PAT-UI-009 | Minor |
| TC-PAT-H01 | Userflow | home | CTA navigate | Pass | — | — |
| TC-PAT-H02 | Screen map | home | Upcoming list | Pass | — | — |
| TC-PAT-H03 | Screen map | home | Unread badge | Pass | — | — |
| TC-PAT-B01 | Userflow | book | Happy path 7 steps | Pass | — | — |
| TC-PAT-B02 | Userflow | book | AI empty symptom toast | Pass | — | — |
| TC-PAT-B03 | Heuristic | book | Specialty no doctors | Partial | PAT-UI-012 | Minor |
| TC-PAT-B04 | Userflow | book | Skip pre-visit | Pass | — | — |
| TC-PAT-B05 | Userflow | book | Chỉnh sửa keeps data | Pass | — | — |
| TC-PAT-B06 | Userflow | book | Code = list + notify | Pass (fixed) | PAT-UI-001 | Major |
| TC-PAT-B07 | Userflow | book | Prefill from consult | Pass | — | — |
| TC-PAT-B08 | Heuristic | book | Past date blocked | Pass (fixed) | PAT-UI-013 | Minor |
| TC-PAT-M01 | Screen map | appointments | List upcoming/cancelled | Pass | — | — |
| TC-PAT-M02 | Userflow | appointments | Cancel → cancelled | Pass (fixed) | PAT-UI-014 | Major |
| TC-PAT-M03 | Userflow | appointments | Reschedule updates list | Pass (fixed) | PAT-UI-004 | Major |
| TC-PAT-M04 | Screen map | appointments | History has completed | Pass (seed) | PAT-UI-006 | Major |
| TC-PAT-S01 | Userflow | consult | Chat → urgent (ngực) | Pass | — | — |
| TC-PAT-S02 | Userflow | consult | Care → rating | Pass | — | — |
| TC-PAT-S03 | Userflow | consult | Book from consult | Pass | — | — |
| TC-PAT-S04 | Userflow | consult | Rating in history | Pass (fixed) | PAT-UI-003 | Major |
| TC-PAT-S05 | Screen map | consult-history | Detail messages | Pass | — | — |
| TC-PAT-S06 | Screen map | consult-history | Tiếp tục chat cũ | NA | PAT-UI-005 | M2 |
| TC-PAT-F01 | Screen map | notifications | Mark read | Pass | — | — |
| TC-PAT-P01 | Screen map | profile | Save profile | Pass | — | — |
| TC-PAT-P02 | Screen map | profile | Đổi MK mock | Partial | — | — |
| TC-PAT-X01 | Integration | cross | Book → home/list/notify | Pass (fixed) | PAT-UI-001 | Major |
| TC-PAT-X02 | Integration | cross | Consult → history | Pass | — | — |
| TC-PAT-X03 | Product | cross | F5 loses session | NA | PAT-UI-010 | Deferred |
| TC-PAT-V01 | Phase 3 | all | COLORS vs tokens | Partial | PAT-UI-015 | Trivial |
| TC-PAT-V02 | Phase 3 | shell | Footer overlap long page | Pass | — | — |
| TC-PAT-E01 | Phase 4 | book | Double confirm booking | Pass | — | — |
| TC-PAT-E02 | Phase 4 | shell | Invalid page empty | Pass (fixed) | PAT-UI-008 | Major |
| TC-PAT-A11 | Phase 5 | consult | Send aria-label | Pass (fixed) | PAT-UI-016 | Minor |
| TC-PAT-R01 | Phase 6 | shell | 390px horizontal scroll | Fail | PAT-UI-017 | Major |
| TC-PAT-R02 | Phase 6 | shell | 768px sidebar | Partial | PAT-UI-017 | Major |

**Pass rate (executable):** 33/35 Pass after P0 fixes · 2 Partial · 2 NA · 1 Deferred (mobile layout)

See [PATIENT_UI_BUGS.md](./PATIENT_UI_BUGS.md) for triage.

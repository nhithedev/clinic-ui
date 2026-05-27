import { PatientHome } from './patient-home';
import { AppointmentBookingWizard } from './appointment-booking-wizard';
import { MyAppointments } from './my-appointments';
import { SymptomConsultation } from './symptom-consultation';
import { ConsultationHistory } from './consultation-history';
import { PatientNotifications } from './patient-notifications';
import { PatientProfile } from './patient-profile';

const PATIENT_PAGES = new Set([
  'home',
  'book-appointment',
  'my-appointments',
  'symptom-consultation',
  'consultation-history',
  'notifications',
  'profile',
]);

export function isValidPatientPage(page: string) {
  return PATIENT_PAGES.has(page);
}

interface PatientRoutesProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PatientRoutes({ currentPage, onNavigate }: PatientRoutesProps) {
  const page = isValidPatientPage(currentPage) ? currentPage : 'home';

  switch (page) {
    case 'book-appointment':
      return <AppointmentBookingWizard onDone={() => onNavigate('home')} />;
    case 'my-appointments':
      return <MyAppointments />;
    case 'symptom-consultation':
      return <SymptomConsultation onBookAppointment={() => onNavigate('book-appointment')} />;
    case 'consultation-history':
      return <ConsultationHistory />;
    case 'notifications':
      return <PatientNotifications />;
    case 'profile':
      return <PatientProfile />;
    case 'home':
    default:
      return <PatientHome onNavigate={onNavigate} />;
  }
}

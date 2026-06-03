import { SymptomConsultation } from './symptom-consultation';
import { ConsultationHistory } from './consultation-history';
import { PatientNotifications } from './patient-notifications';
import { PatientProfile } from './patient-profile';
import { AppointmentOverview } from './appointment-overview';
import { PatientDoctorConsultations } from './patient-doctor-consultations';

const PATIENT_PAGES = new Set([
  'symptom-consultation',
  'appointment-overview',
  'consultation-history',
  'doctor-consultations',
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
  const page = isValidPatientPage(currentPage) ? currentPage : 'symptom-consultation';

  switch (page) {
    case 'appointment-overview':
      return <AppointmentOverview />;
    case 'consultation-history':
      return <ConsultationHistory />;
    case 'doctor-consultations':
      return <PatientDoctorConsultations />;
    case 'notifications':
      return <PatientNotifications />;
    case 'profile':
      return <PatientProfile />;
    case 'symptom-consultation':
    default:
      return <SymptomConsultation onNavigate={onNavigate} />;
  }
}
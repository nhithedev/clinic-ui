import { useState } from 'react';
import { Toaster } from 'sonner';
import { Login } from './components/login';
import { DoctorLayoutWrapper } from './components/layout/DoctorLayoutWrapper';
import { ManagerLayoutWrapper } from './components/layout/ManagerLayoutWrapper';
import { AITrainerLayoutWrapper } from './components/layout/AITrainerLayoutWrapper';
import { PatientLayoutWrapper } from './components/layout/PatientLayoutWrapper';
import { DoctorDashboard, AppointmentsManagement, MedicalRecords, DoctorProfile, ConsultationsList, ConsultationChat } from './components/doctor';
import { ManagerDashboard, AccountManagement, ScheduleManagement, ManagerProfile } from './components/manager';
import { AITrainerDashboard, AITrainerProfile, TrainingManagement, RequestDetail, TrainingResults, PromptConfiguration } from './components/ai-trainer';
import { DataProvider, ManagerProvider, AITrainerProvider, PatientProvider } from './components/contexts';
import { PatientRoutes } from './components/patient/patient-routes';
import { COLORS } from '@/styles/colors';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [trainingView, setTrainingView] = useState<'main' | 'detail' | 'result'>('main');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [consultationView, setConsultationView] = useState<'list' | 'chat'>('list');
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);

  const handleLogin = (role: string) => {
    setCurrentUser(role);
    setCurrentPage(role === 'patient' ? 'symptom-consultation' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('symptom-consultation');
    setTrainingView('main');
    setSelectedRequestId(null);
    setConsultationView('list');
    setSelectedConsultationId(null);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'training') {
      setTrainingView('main');
      setSelectedRequestId(null);
    }
    if (page !== 'consultations') {
      setConsultationView('list');
      setSelectedConsultationId(null);
    }
  };

  const handleViewDetail = (id: number) => {
    setSelectedRequestId(id);
    setTrainingView('detail');
  };

  const handleViewResult = (id: number) => {
    setSelectedRequestId(id);
    setTrainingView('result');
  };

  const handleBackToMain = () => {
    setTrainingView('main');
    setSelectedRequestId(null);
  };

  const handleViewChat = (id: number) => {
    setSelectedConsultationId(id);
    setConsultationView('chat');
  };

  const handleBackToConsultationsList = () => {
    setConsultationView('list');
    setSelectedConsultationId(null);
  };

  if (!currentUser) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  if (currentUser === 'doctor') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <DataProvider>
          <DoctorLayoutWrapper
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            {currentPage === 'dashboard' && <DoctorDashboard onNavigate={handleNavigate} />}
            {currentPage === 'appointments' && <AppointmentsManagement />}
            {currentPage === 'records' && <MedicalRecords />}
            {currentPage === 'consultations' && (
              <>
                {consultationView === 'list' && (
                  <ConsultationsList onViewChat={handleViewChat} />
                )}
                {consultationView === 'chat' && selectedConsultationId && (
                  <ConsultationChat
                    consultationId={selectedConsultationId}
                    onBack={handleBackToConsultationsList}
                  />
                )}
              </>
            )}
            {currentPage === 'profile' && <DoctorProfile />}
          </DoctorLayoutWrapper>
        </DataProvider>
      </>
    );
  }

  if (currentUser === 'manager') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <ManagerProvider>
          <ManagerLayoutWrapper
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            {currentPage === 'dashboard' && <ManagerDashboard />}
            {currentPage === 'accounts' && <AccountManagement />}
            {currentPage === 'schedules' && <ScheduleManagement />}
            {currentPage === 'profile' && <ManagerProfile />}
          </ManagerLayoutWrapper>
        </ManagerProvider>
      </>
    );
  }

  if (currentUser === 'patient') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <PatientProvider>
          <PatientLayoutWrapper
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <PatientRoutes currentPage={currentPage} onNavigate={handleNavigate} />
          </PatientLayoutWrapper>
        </PatientProvider>
      </>
    );
  }

  if (currentUser === 'ai-trainer') {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AITrainerProvider>
          <AITrainerLayoutWrapper
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            {currentPage === 'dashboard' && <AITrainerDashboard />}
            {currentPage === 'training' && (
              <>
                {trainingView === 'main' && (
                  <TrainingManagement
                    onViewDetail={handleViewDetail}
                    onViewResult={handleViewResult}
                  />
                )}
                {trainingView === 'detail' && selectedRequestId && (
                  <RequestDetail
                    requestId={selectedRequestId}
                    onBack={handleBackToMain}
                  />
                )}
                {trainingView === 'result' && selectedRequestId && (
                  <TrainingResults
                    requestId={selectedRequestId}
                    onBack={handleBackToMain}
                  />
                )}
              </>
            )}
            {currentPage === 'prompt-config' && <PromptConfiguration />}
            {currentPage === 'profile' && <AITrainerProfile />}
          </AITrainerLayoutWrapper>
        </AITrainerProvider>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <div
        className="size-full flex items-center justify-center"
        style={{ backgroundColor: COLORS.GRAY }}
      >
        <div className="text-center">
          <h2 className="mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
            Unknown Role
          </h2>
          <button
            type="button"
            onClick={handleLogout}
            className="px-6 py-3 text-white rounded-3xl hover:opacity-90 transition-colors"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
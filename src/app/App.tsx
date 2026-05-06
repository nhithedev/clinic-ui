import { useState } from 'react';
import { Toaster } from 'sonner';
import { Login } from './components/login';
import { DoctorLayoutWrapper } from './components/layout/DoctorLayoutWrapper';
import { DoctorDashboard } from './components/doctor-dashboard';
import { AppointmentsManagement } from './components/appointments-management';
import { MedicalRecords } from './components/medical-records-updated';
import { DoctorProfile } from './components/doctor-profile';
import { ManagerLayoutWrapper } from './components/layout/ManagerLayoutWrapper';
import { ManagerDashboard } from './components/manager-dashboard';
import { AccountManagement } from './components/account-management-updated';
import { ScheduleManagement } from './components/schedule-management';
import { ManagerProfile } from './components/manager-profile';
import { AITrainerLayoutWrapper } from './components/layout/AITrainerLayoutWrapper';
import { AITrainerDashboard } from './components/ai-trainer-dashboard';
import { AITrainerProfile } from './components/ai-trainer-profile';
import { TrainingManagement } from './components/training-management';
import { RequestDetail } from './components/request-detail';
import { TrainingResults } from './components/training-results';
import { PromptConfiguration } from './components/prompt-configuration';
import { ConsultationsList } from './components/consultations-list';
import { ConsultationChat } from './components/consultation-chat';
import { DataProvider } from './components/data-context';
import { ManagerProvider } from './components/manager-context';
import { AITrainerProvider } from './components/ai-trainer-context';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [trainingView, setTrainingView] = useState<'main' | 'detail' | 'result'>('main');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [consultationView, setConsultationView] = useState<'list' | 'chat'>('list');
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);

  const handleLogin = (role: string) => {
    setCurrentUser(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
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
      <div className="size-full flex items-center justify-center bg-[#f8fafb]">
        <div className="text-center">
          <h2 className="text-[#1a3a52] mb-4">Unknown Role</h2>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-[#2c7da0] text-white rounded-lg hover:bg-[#24698a] transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
}
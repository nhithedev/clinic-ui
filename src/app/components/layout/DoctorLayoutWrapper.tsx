import { ReactNode } from 'react';
import { LayoutDashboard, Calendar, FileText, MessageSquare, User, LogOut, ArrowRight, Bot, AlertCircle } from 'lucide-react';
import { SharedLayout } from './SharedLayout';
import { useData } from '../data-context';

interface DoctorLayoutWrapperProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function DoctorLayoutWrapper({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: DoctorLayoutWrapperProps) {
  const { appointments, consultations } = useData();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, onClick: () => onNavigate('dashboard') },
    { id: 'appointments', label: 'Quản lý lịch hẹn', icon: <Calendar />, onClick: () => onNavigate('appointments') },
    { id: 'records', label: 'Hồ sơ khám', icon: <FileText />, onClick: () => onNavigate('records') },
    { id: 'consultations', label: 'Giải đáp thắc mắc', icon: <MessageSquare />, onClick: () => onNavigate('consultations') },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <User />, onClick: () => onNavigate('profile') },
    { id: 'logout', label: 'Đăng xuất', icon: <LogOut />, onClick: () => onLogout() },
  ];

  const getPageTitle = (page: string) => {
    const titleMap: { [key: string]: { title: string; desc: string } } = {
      dashboard: { title: 'Dashboard', desc: 'Chào mừng trở lại, hãy kiểm tra thông tin hôm nay' },
      appointments: { title: 'Quản lý lịch hẹn', desc: 'Xem và quản lý tất cả lịch hẹn của bạn' },
      records: { title: 'Hồ sơ khám', desc: 'Quản lý hồ sơ bệnh nhân chi tiết' },
      consultations: { title: 'Giải đáp thắc mắc', desc: 'Trả lời những câu hỏi từ bệnh nhân' },
      profile: { title: 'Hồ sơ cá nhân', desc: 'Quản lý thông tin cá nhân của bạn' },
    };
    return titleMap[page] || { title: 'Dashboard', desc: 'Trang chủ' };
  };

  const page = getPageTitle(currentPage);

  const recentConsultations = consultations
    .filter((consultation: any) => consultation.status === 'pending')
    .slice(0, 3);

  const upcomingAppointments = appointments
    .filter((apt: any) => apt.status === 'confirmed' && apt.date && apt.time)
    .slice(0, 4)
    .map((apt: any) => ({
      time: apt.time!,
      patient: apt.patient.name,
      reason: apt.reason,
    }));

  const rightSidebar = currentPage === 'dashboard' ? (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#F4FDFC] p-2 rounded-3xl">
            <Bot className="w-5 h-5 text-[#479AA8]" />
          </div>
          <h3 className="text-[#1F4A51] font-semibold">Thắc mắc chờ xử lý</h3>
        </div>

        <div className="space-y-3 flex-1">
          {recentConsultations.length > 0 ? (
            recentConsultations.map((consultation: any) => (
              <div
                key={consultation.id}
                onClick={() => onNavigate('consultations')}
                className="p-4 rounded-3xl transition-colors cursor-pointer bg-white hover:bg-[#F4FDFC] border border-[#E5E7EB]"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[#1F4A51]">{consultation.patient.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    consultation.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : consultation.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {consultation.priority === 'high' ? 'Khẩn cấp' : consultation.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: '#6B7280' }}>{consultation.summary}</p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-[#E5E7EB] p-6 text-center">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-[#479AA8]" />
              <p style={{ color: '#6B7280' }} className="text-sm">Không có thắc mắc chờ xử lý</p>
            </div>
          )}
        </div>

        {recentConsultations.length > 0 && (
          <button
            onClick={() => onNavigate('consultations')}
            className="text-sm flex items-center gap-1 transition-colors text-[#479AA8] hover:text-[#1F4A51] justify-end mt-4"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#F4FDFC] p-2 rounded-3xl">
            <Calendar className="w-5 h-5 text-[#479AA8]" />
          </div>
          <h3 className="text-[#1F4A51] font-semibold">Lịch hẹn sắp tới</h3>
        </div>
        <div className="space-y-3 flex-1">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-3xl bg-white border border-[#E5E7EB]">
                <div className="text-white px-3 py-2 rounded-3xl min-w-[72px] text-center bg-[#479AA8]">
                  <div className="font-medium text-sm">{apt.time}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#1F4A51] truncate">{apt.patient}</p>
                  <p className="text-xs text-[#6B7280] line-clamp-2">{apt.reason}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-sm" style={{ color: '#6B7280' }}>Chưa có lịch hẹn nào</p>
          )}
        </div>
        {upcomingAppointments.length > 0 && (
          <button
            onClick={() => onNavigate('appointments')}
            className="text-sm flex items-center gap-1 transition-colors text-[#479AA8] hover:text-[#1F4A51] justify-end mt-4"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  ) : undefined;

  return (
    <SharedLayout
      title={page.title}
      description={page.desc}
      sidebarItems={sidebarItems}
      activeItem={currentPage}
      userInfo={{
        name: 'Dr. Nguyễn Văn A',
        role: 'Bác sĩ',
      }}
      rightSidebar={rightSidebar}
      rightSidebarWidth={currentPage === 'dashboard' ? 'w-80' : 'w-72'}
      onSidebarItemClick={(id: string) => {
        if (id === 'logout') {
          onLogout();
        } else {
          onNavigate(id);
        }
      }}
    >
      {children}
    </SharedLayout>
  );
}

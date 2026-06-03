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
  const { consultations } = useData();

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

  const rightSidebar = currentPage === 'dashboard' ? (
    <div className="flex flex-col h-full">
      {/* Thắc mắc chờ xử lý */}
      <div className="bg-white rounded-3xl p-4 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#F4FDFC] p-2 rounded-3xl">
            <Bot className="w-5 h-5 text-[#479AA8]" />
          </div>
          <h3 className="text-[#1F4A51] font-semibold">Thắc mắc chờ xử lý</h3>
        </div>

        <div className="flex flex-col gap-3">
          {recentConsultations.length > 0 ? (
            recentConsultations.map((consultation: any) => (
              <div
                key={consultation.id}
                onClick={() => onNavigate('consultations')}
                className="p-3 rounded-3xl transition-colors cursor-pointer bg-[#F5F5F7] hover:bg-[#F4FDFC] border border-[#E5E7EB]"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm text-[#1F4A51]">{consultation.patient.name}</p>
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
                <p className="text-xs line-clamp-1" style={{ color: '#6B7280' }}>{consultation.summary}</p>
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
            className="w-full text-sm flex items-center gap-1 transition-colors text-[#479AA8] hover:text-[#1F4A51] justify-end mt-3 flex-shrink-0"
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
        name: 'BS. Nguyễn Văn A',
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

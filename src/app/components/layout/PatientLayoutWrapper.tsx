import { ReactNode } from 'react';
import {
  CalendarDays,
  History,
  Bell,
  UserCircle,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { SharedLayout } from './SharedLayout';
import { usePatient } from '../patient-context';
import { COLORS } from '@/styles/colors';

interface PatientLayoutWrapperProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function PatientLayoutWrapper({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: PatientLayoutWrapperProps) {
  const { profile, notifications } = usePatient();
  const unread = notifications.filter((n) => !n.read).length;
  const isChatMain = currentPage === 'symptom-consultation';

  const sidebarItems = [
    {
      id: 'symptom-consultation',
      label: 'Chat tư vấn',
      icon: <MessageCircle size={20} />,
      onClick: () => onNavigate('symptom-consultation'),
    },
    {
      id: 'appointment-overview',
      label: 'Tổng quan lịch khám',
      icon: <CalendarDays size={20} />,
      onClick: () => onNavigate('appointment-overview'),
    },
    {
      id: 'consultation-history',
      label: 'Lịch sử tư vấn',
      icon: <History size={20} />,
      onClick: () => onNavigate('consultation-history'),
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: <Bell size={20} />,
      badge: unread,
      onClick: () => onNavigate('notifications'),
    },
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserCircle size={20} />,
      onClick: () => onNavigate('profile'),
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      icon: <LogOut size={20} />,
      onClick: () => onLogout(),
    },
  ];

  const titleMap: Record<string, { title: string; desc: string }> = {
    'symptom-consultation': {
      title: 'Chat tư vấn',
      desc: 'Trao đổi triệu chứng và đặt lịch khám khi cần',
    },
    'appointment-overview': {
      title: 'Tổng quan lịch khám',
      desc: 'Đặt lịch khám và quản lý các lịch hẹn của bạn',
    },
    'consultation-history': {
      title: 'Lịch sử tư vấn',
      desc: 'Xem lại các cuộc tư vấn đã thực hiện',
    },
    notifications: {
      title: 'Thông báo',
      desc: 'Nhắc lịch và cập nhật từ phòng khám',
    },
    profile: {
      title: 'Hồ sơ cá nhân',
      desc: 'Thông tin và sức khỏe của bạn',
    },
  };

  const page = titleMap[currentPage] || titleMap['symptom-consultation'];

    return (
    <SharedLayout
      title={page.title}
      description={page.desc}
      sidebarItems={sidebarItems}
      activeItem={currentPage}
      userInfo={{
        name: profile.name,
        role: 'Bệnh nhân',
      }}
      showSearch={false}
      showSettings={false}
      showTopbar={!isChatMain}
      showFooter={!isChatMain}
      mainClassName={isChatMain ? 'p-0' : 'p-4'}
      mainStyle={isChatMain ? { backgroundColor: COLORS.GRAY } : undefined}
      contentClassName={
        isChatMain
          ? 'flex-1 min-w-0 flex flex-col min-h-0 h-full'
          : 'flex-1 min-w-0 rounded-3xl p-3 flex flex-col min-h-fit'
      }
      contentStyle={{ backgroundColor: COLORS.GRAY }}
    >
      {children}
    </SharedLayout>
  );
}
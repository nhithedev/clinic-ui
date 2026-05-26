import { ReactNode } from 'react';
import {
  Home,
  CalendarPlus,
  CalendarDays,
  MessageCircle,
  History,
  Bell,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { SharedLayout } from './SharedLayout';
import { usePatient } from '../patient-context';

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
  const { profile } = usePatient();

  const sidebarItems = [
    { id: 'home', label: 'Trang chủ', icon: <Home size={20} />, onClick: () => onNavigate('home') },
    {
      id: 'book-appointment',
      label: 'Đặt lịch khám',
      icon: <CalendarPlus size={20} />,
      onClick: () => onNavigate('book-appointment'),
    },
    {
      id: 'my-appointments',
      label: 'Lịch hẹn của tôi',
      icon: <CalendarDays size={20} />,
      onClick: () => onNavigate('my-appointments'),
    },
    {
      id: 'symptom-consultation',
      label: 'Tư vấn triệu chứng',
      icon: <MessageCircle size={20} />,
      onClick: () => onNavigate('symptom-consultation'),
    },
    {
      id: 'consultation-history',
      label: 'Lịch sử tư vấn',
      icon: <History size={20} />,
      onClick: () => onNavigate('consultation-history'),
    },
    { id: 'notifications', label: 'Thông báo', icon: <Bell size={20} />, onClick: () => onNavigate('notifications') },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <UserCircle size={20} />, onClick: () => onNavigate('profile') },
    { id: 'logout', label: 'Đăng xuất', icon: <LogOut size={20} />, onClick: () => onLogout() },
  ];

  const titleMap: Record<string, { title: string; desc: string }> = {
    home: { title: 'Trang chủ', desc: 'Tổng quan và truy cập nhanh các dịch vụ' },
    'book-appointment': { title: 'Đặt lịch khám', desc: 'Chọn chuyên khoa và đặt lịch với bác sĩ' },
    'my-appointments': { title: 'Lịch hẹn của tôi', desc: 'Xem và quản lý lịch hẹn khám' },
    'symptom-consultation': { title: 'Tư vấn triệu chứng', desc: 'Chat với chatbot AI y tế' },
    'consultation-history': { title: 'Lịch sử tư vấn', desc: 'Xem lại các cuộc tư vấn đã thực hiện' },
    notifications: { title: 'Thông báo', desc: 'Nhắc lịch và cập nhật từ phòng khám' },
    profile: { title: 'Hồ sơ cá nhân', desc: 'Thông tin và sức khỏe của bạn' },
  };

  const page = titleMap[currentPage] || titleMap.home;

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
    >
      {children}
    </SharedLayout>
  );
}

import { ReactNode } from 'react';
import {
  CalendarDays,
  ClipboardList,
  History,
  Bell,
  UserCircle,
  LogOut,
  MessageCircle,
  Stethoscope,
} from 'lucide-react';
import { SharedLayout } from './SharedLayout';
import { usePatient } from '../contexts/patient-context';
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
  const { profile, notifications, doctorConsultations } = usePatient();

  const unread = notifications.filter((n) => !n.read).length;
  const pendingDoctorConsultations = doctorConsultations.filter(
    (consultation) => consultation.status === 'pending',
  ).length;

  const resetConsultation = () => {
    // Dispatch event instead of navigating to avoid page flash
    window.dispatchEvent(new CustomEvent('reset-consultation'));
  };

  const sidebarItems = [
    {
      id: 'symptom-consultation',
      label: 'Chat tư vấn',
      icon: <MessageCircle size={20} />,
      onClick: () => onNavigate('symptom-consultation'),
      onAction:
        currentPage === 'symptom-consultation'
          ? resetConsultation
          : undefined,
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
      id: 'doctor-consultations',
      label: 'Tư vấn bác sĩ',
      icon: <Stethoscope size={20} />,
      badge: pendingDoctorConsultations,
      onClick: () => onNavigate('doctor-consultations'),
    },
    {
      id: 'medical-records',
      label: 'Hồ sơ khám bệnh',
      icon: <ClipboardList size={20} />,
      onClick: () => onNavigate('medical-records'),
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
    'doctor-consultations': {
      title: 'Tư vấn bác sĩ',
      desc: 'Theo dõi các cuộc tư vấn đã gửi cho bác sĩ',
    },
    'medical-records': {
      title: 'Hồ sơ khám bệnh',
      desc: 'Xem lại kết quả và đơn thuốc từ các lần khám',
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
      showTopbar
      showFooter
      mainClassName="p-4"
      contentClassName="flex-1 min-w-0 rounded-3xl p-3 flex flex-col min-h-0 h-full"
      contentStyle={{ backgroundColor: COLORS.GRAY }}
    >
      {children}
    </SharedLayout>
  );
}
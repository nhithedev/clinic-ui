import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Database,
  User,
  LogOut,
  Brain,
} from 'lucide-react';
import { SharedLayout } from "./SharedLayout";

interface AITrainerLayoutWrapperProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AITrainerLayoutWrapper({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: AITrainerLayoutWrapperProps) {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, onClick: () => onNavigate('dashboard') },
    { id: 'training', label: 'Dữ liệu - Huấn luyện', icon: <Database size={20} />, onClick: () => onNavigate('training') },
    { id: 'prompt-config', label: 'Cấu hình Prompt', icon: <Brain size={20} />, onClick: () => onNavigate('prompt-config') },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <User size={20} />, onClick: () => onNavigate('profile') },
    { id: 'logout', label: 'Đăng xuất', icon: <LogOut size={20} />, onClick: () => onLogout() },
  ];

  const getPageTitle = (page: string) => {
    const titleMap: { [key: string]: { title: string; desc: string } } = {
      dashboard: { title: 'Dashboard AI Training', desc: 'Tổng quan về trạng thái huấn luyện và vận hành hệ thống AI' },
      training: { title: 'Quản lý dữ liệu & Huấn luyện', desc: 'Quản lý dữ liệu huấn luyện và mô hình AI' },
      'prompt-config': { title: 'Cấu hình Prompt', desc: 'Cấu hình các prompt cho hệ thống AI' },
      profile: { title: 'Hồ sơ cá nhân', desc: 'Quản lý thông tin cá nhân của bạn' },
    };
    return titleMap[page] || { title: 'Dashboard', desc: 'Trang chủ' };
  };

  const page = getPageTitle(currentPage);

  return (
    <SharedLayout
      title={page.title}
      description={page.desc}
      sidebarItems={sidebarItems}
      activeItem={currentPage}
      userInfo={{
        name: 'Nguyễn Văn Expert',
        role: 'AI Trainer',
      }}
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

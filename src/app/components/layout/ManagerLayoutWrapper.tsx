import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  LogOut,
  UserX,
} from 'lucide-react';
import { SharedLayout } from "./SharedLayout";
import { RightSidebarCalendar } from "./RightSidebarCalendar";
import { useManager } from "../manager-context";
import { COLORS } from '@/styles/colors';

interface ManagerLayoutWrapperProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ManagerLayoutWrapper({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: ManagerLayoutWrapperProps) {
  const { activities, getIncompleteProfiles, setPendingEditAccountId } = useManager();
  const incompleteProfiles = getIncompleteProfiles();

  const handleProfileClick = (profileId: number) => {
    setPendingEditAccountId(profileId);
    onNavigate('accounts');
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, onClick: () => onNavigate('dashboard') },
    { id: 'accounts', label: 'Quản lý tài khoản', icon: <Users size={20} />, onClick: () => onNavigate('accounts') },
    { id: 'schedules', label: 'Quản lý lịch làm việc', icon: <CalendarDays size={20} />, onClick: () => onNavigate('schedules') },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <UserCircle size={20} />, onClick: () => onNavigate('profile') },
    { id: 'logout', label: 'Đăng xuất', icon: <LogOut size={20} />, onClick: () => onLogout() },
  ];

  const getPageTitle = (page: string) => {
    const titleMap: { [key: string]: { title: string; desc: string } } = {
      dashboard: { title: 'Dashboard', desc: 'Tổng quan về hoạt động của phòng khám' },
      accounts: { title: 'Quản lý tài khoản', desc: 'Quản lý tài khoản nhân viên' },
      schedules: { title: 'Quản lý lịch làm việc', desc: 'Lên kế hoạch ca làm việc' },
      profile: { title: 'Hồ sơ cá nhân', desc: 'Quản lý thông tin cá nhân của bạn' },
    };
    return titleMap[page] || { title: 'Dashboard', desc: 'Trang chủ' };
  };

  const page = getPageTitle(currentPage);

  const rightSidebar = currentPage === 'dashboard' ? (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Calendar */}
      <div className="flex-shrink-0 bg-white rounded-3xl px-4">
        <RightSidebarCalendar
          activities={activities.map(a => ({ ...a, id: Number(a.id) }))}
        />
      </div>

      {/* Tài khoản cần cập nhật */}
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-3xl p-4">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <UserX size={16} style={{ color: COLORS.BUTTON_CHOSEN }} />
          <h3 className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Tài khoản cần cập nhật
          </h3>
          {incompleteProfiles.length > 0 && (
            <span
              className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
            >
              {incompleteProfiles.length}
            </span>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          {incompleteProfiles.length > 0 ? (
            incompleteProfiles.map(profile => (
              <div key={profile.id} className="p-3 rounded-2xl cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: COLORS.GRAY }} onClick={() => handleProfileClick(profile.id)}>
                <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                  {profile.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.TEXT_SECONDARY }}>
                  {profile.email}
                </p>
                <p className="text-xs mt-1 capitalize" style={{ color: COLORS.TEXT_SECONDARY }}>
                  {profile.role}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-6 gap-2">
              <UserX size={28} style={{ color: COLORS.TEXT_LIGHT }} />
              <p className="text-xs text-center" style={{ color: COLORS.TEXT_SECONDARY }}>
                Không có tài khoản nào cần cập nhật
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : undefined;

  return (
    <SharedLayout
      title={page.title}
      description={page.desc}
      sidebarItems={sidebarItems}
      activeItem={currentPage}
      rightSidebar={rightSidebar}
      userInfo={{
        name: 'Lê Thị Manager',
        role: 'Quản lý',
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

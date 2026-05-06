import { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  LogOut,
  Building2,
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
  const { activities } = useManager();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  // Right sidebar for dashboard with calendar
  const rightSidebar = currentPage === 'dashboard' ? (
    <div className="space-y-6">
      <RightSidebarCalendar
  activities={activities.map(a => ({ ...a, id: Number(a.id) }))}
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
/>
      
      {selectedDate && (
        <div>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
            Hoạt động ngày {selectedDate.toLocaleDateString('vi-VN')}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities
              .filter(a => new Date(a.time).toDateString() === selectedDate.toDateString())
              .length > 0 ? (
              activities
                .filter(a => new Date(a.time).toDateString() === selectedDate.toDateString())
                .map((activity) => (
                  <div key={activity.id} className="p-3 rounded-lg" style={{ backgroundColor: COLORS.GRAY }}>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full mt-2 bg-[#479AA8] flex-shrink-0"></div>
                      <div>
                        <p style={{ color: COLORS.TEXT_PRIMARY }} className="text-sm font-medium">
                          {activity.action}
                        </p>
                        <p style={{ color: COLORS.TEXT_SECONDARY }} className="text-xs">
                          {new Date(activity.time).toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p style={{ color: COLORS.TEXT_SECONDARY }} className="text-sm text-center py-4">
                Không có hoạt động
              </p>
            )}
          </div>
        </div>
      )}
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

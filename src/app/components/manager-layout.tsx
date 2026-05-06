import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCircle,
  LogOut,
  Building2
} from 'lucide-react';

interface ManagerLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ManagerLayout({ children, currentPage, onNavigate, onLogout }: ManagerLayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Quản lý tài khoản', icon: Users },
    { id: 'schedules', label: 'Quản lý lịch làm việc', icon: CalendarDays },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserCircle }
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F5F5F7' }}>
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col" style={{ borderColor: '#E5E7EB' }}>
        <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-3xl" style={{ backgroundColor: '#479AA8' }}>
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 style={{ color: '#1F4A51' }}>Quản lý</h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>Lê Thị Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-3xl transition-all`}
                  style={{
                    backgroundColor: isActive ? '#479AA8' : 'transparent',
                    color: isActive ? 'white' : '#1F4A51',
                  }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#F4FDFC')}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
            style={{ color: '#EF4444' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

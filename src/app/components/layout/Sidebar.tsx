import { ReactNode } from 'react';
import { COLORS } from '@/styles/colors';

interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (id: string) => void;
}

interface SidebarProps {
  logo?: ReactNode;
  items: SidebarItem[];
  activeItem?: string;
}

export const Sidebar = ({ logo, items, activeItem }: SidebarProps) => {
  const logoutItem = items.find((i) => i.id === 'logout');
  const navItems = items.filter((i) => i.id !== 'logout');

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col"
      style={{ backgroundColor: COLORS.WHITE }}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          {logo || 'C'}
        </div>
        <span className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Clinic
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto text-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.onClick(item.id)}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-3xl transition-colors duration-200 ${
              activeItem === item.id ? 'font-base' : ''
            }`}
            style={{
              backgroundColor: activeItem === item.id ? COLORS.BUTTON_CHOSEN : 'transparent',
              color: activeItem === item.id ? COLORS.WHITE : COLORS.TEXT_SECONDARY,
            }}
            onMouseEnter={(e) => {
              if (activeItem !== item.id) e.currentTarget.style.backgroundColor = COLORS.HOVER;
            }}
            onMouseLeave={(e) => {
              if (activeItem !== item.id) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4">
        {logoutItem ? (
          <button
            onClick={() => logoutItem.onClick(logoutItem.id)}
            className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-3xl text-sm"
            style={{ color: COLORS.TEXT_SECONDARY }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span className="text-lg">{logoutItem.icon}</span>
            <span>Đăng xuất</span>
          </button>
        ) : (
          <p className="text-xs text-center" style={{ color: COLORS.TEXT_LIGHT }}>
            © 2024 Clinic Management
          </p>
        )}
      </div>
    </aside>
  );
};

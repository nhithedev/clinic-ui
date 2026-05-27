import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { COLORS } from '@/styles/colors';

type SidebarItem = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (id: string) => void;
};

type SharedLayoutProps = {
  children: ReactNode;
  rightSidebar?: ReactNode;
  rightSidebarWidth?: string;
  title: string;
  description?: string;
  sidebarItems: SidebarItem[];
  activeItem?: string;
  userInfo: { name: string; role: string; avatar?: string };
  onSidebarItemClick?: (id: string) => void;
  onSearchChange?: (query: string) => void;
  onSettingsClick?: () => void;
  showSearch?: boolean;
  showSettings?: boolean;
};

export const SharedLayout = ({
  children,
  rightSidebar,
  rightSidebarWidth = 'w-72',
  title,
  description,
  sidebarItems,
  activeItem,
  userInfo,
  onSearchChange,
  onSettingsClick,
  showSearch = true,
  showSettings = true,
}: SharedLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.WHITE}}>
      <Sidebar items={sidebarItems} activeItem={activeItem} />

      <div className="flex-1 flex flex-col overflow-hidden ml-56">
        <Topbar
          title={title}
          description={description}
          userName={userInfo.name}
          userRole={userInfo.role}
          userAvatar={userInfo.avatar}
          onSearch={onSearchChange}
          onSettingsClick={onSettingsClick}
          showSearch={showSearch}
          showSettings={showSettings}
        />

        <div className="flex-1 flex flex-col overflow-hidden mt-16"> {/* mt-16 thay vì mt-20, chỉnh độ cao của topbar */}
          <main className="flex-1 overflow-y-auto p-4 min-h-0">
  <div className="flex gap-4">
    <section
      className="flex-1 min-w-0 rounded-3xl p-3 flex flex-col min-h-fit"
      style={{ backgroundColor: COLORS.GRAY }}
    >
      <div className="flex-1">
        {children}
      </div>
    </section>

    {rightSidebar ? (
      <aside className={`${rightSidebarWidth} flex-shrink-0 overflow-y-auto`}>
        {rightSidebar}
      </aside>
    ) : null}
  </div>

  {/* Footer nằm trong vùng scroll, ngoài vùng xám */}
  <footer className="mt-4 py-3 text-center text-xs" style={{ color: '#9CA3AF' }}>
    <p>© 2024 Clinic Management System. All rights reserved.</p>
  </footer>
</main>
        </div>
      </div>
    </div>
  );
};
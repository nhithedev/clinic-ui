import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { COLORS } from '@/styles/colors';

type SidebarItem = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (id: string) => void;
  badge?: number;
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
  showTopbar?: boolean;
  showFooter?: boolean;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  mainClassName?: string;
  mainStyle?: React.CSSProperties;
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
  showTopbar = true,
  showFooter = true,
  contentClassName,
  contentStyle,
  mainClassName,
  mainStyle,
}: SharedLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.WHITE }}>
      <Sidebar items={sidebarItems} activeItem={activeItem} />

      <div className="flex-1 flex flex-col overflow-hidden ml-56">
        {showTopbar && (
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
        )}

        <div
          className={`flex-1 flex flex-col overflow-hidden ${showTopbar ? 'mt-16' : ''}`}
        >
          <main
            className={`flex-1 overflow-y-auto min-h-0 ${mainClassName ?? 'p-4'}`}
            style={mainStyle}
          >
            <div className="flex gap-4 h-full min-h-0">
              <section
                className={
                  contentClassName ??
                  'flex-1 min-w-0 rounded-3xl p-3 flex flex-col min-h-fit'
                }
                style={contentStyle ?? { backgroundColor: COLORS.GRAY }}
              >
                <div className="flex-1 min-h-0">{children}</div>
              </section>

              {rightSidebar ? (
                <aside className={`${rightSidebarWidth} flex-shrink-0 overflow-y-auto`}>
                  {rightSidebar}
                </aside>
              ) : null}
            </div>

            {showFooter && (
              <footer
                className="mt-4 py-3 text-center text-xs"
                style={{ color: COLORS.TEXT_LIGHT }}
              >
                <p>© 2024 Clinic Management System. All rights reserved.</p>
              </footer>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
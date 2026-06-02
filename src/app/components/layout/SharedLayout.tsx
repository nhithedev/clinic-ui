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
  showSearch = false,
  showSettings = false,
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

      <div className="flex-1 flex flex-col overflow-hidden ml-56 pt-20">
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

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <main
            // Thay đổi: Biến main thành một flex container theo chiều dọc, không cho cuộn ở đây nữa
            className={`flex-1 flex flex-col overflow-hidden min-h-0 ${mainClassName ?? 'p-4'}`}
            style={mainStyle}
          >
            {/* VÙNG CHỨA CONTENT: Nằm gọn giữa Topbar và Footer, không thể tràn qua khung này */}
            <div className="flex-1 flex items-stretch gap-4 min-h-0 min-w-0">
              
              {/* Thẻ section bao bọc nội dung children, cho phép cuộn nội dung độc lập tại đây */}
              <section
                className={
                  contentClassName ??
                  'flex-1 min-w-0 rounded-3xl p-4 flex flex-col overflow-y-auto h-full'
                }
                style={contentStyle ?? { backgroundColor: COLORS.GRAY }}
              >
                <div className="w-full">{children}</div>
              </section>

              {/* Right Sidebar nếu có, cuộn độc lập không ảnh hưởng đến phần còn lại */}
              {rightSidebar ? (
                <aside className={`${rightSidebarWidth} flex-shrink-0 overflow-y-auto h-full`}>
                  {rightSidebar}
                </aside>
              ) : null}
            </div>

            {/* FOOTER: Luôn luôn cố định ở đáy màn hình */}
            {showFooter && (
              <footer
                className="mt-3 pt-2 text-center text-xs flex-shrink-0"
                style={{ color: COLORS.TEXT_LIGHT }}
              >
                <p>© 2026 Clinic Management System. All rights reserved.</p>
              </footer>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
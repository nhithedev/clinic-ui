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
            className={`flex-1 flex flex-col overflow-hidden min-h-0 ${mainClassName ?? 'p-4'}`}
            style={mainStyle}
          >
            {/* VÙNG CHỨA CHUNG: Đưa nền xám, rounded-3xl và padding vào đây để bọc cả Section & Right Sidebar */}
            <div 
              className="flex-1 flex items-stretch gap-4 min-h-0 min-w-0 rounded-3xl p-4"
              style={contentStyle ?? { backgroundColor: COLORS.GRAY }}
            >
              
              {/* Thẻ section chỉ làm nhiệm vụ cuộn nội dung, bỏ background và rounded gốc */}
              <section
                className={
                  contentClassName ??
                  'flex-1 min-w-0 flex flex-col overflow-y-auto h-full'
                }
              >
                {children}
              </section>

              {/* Right Sidebar nằm chung khối nền, phân tách bằng thanh border mỏng (tùy chọn) hoặc khoảng gap */}
              {rightSidebar ? (
                <aside
                  className={`${rightSidebarWidth} flex-shrink-0 overflow-y-auto h-full border-l border-gray-200/50 rounded-3xl`}
                  style={contentStyle ?? { backgroundColor: COLORS.WHITE }}
                >
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
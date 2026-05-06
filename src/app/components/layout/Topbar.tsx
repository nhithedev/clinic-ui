import { Search, Settings } from 'lucide-react';
import { COLORS } from '@/styles/colors';

interface TopbarProps {
  title: string;
  description?: string;
  userAvatar?: string;
  userName: string;
  userRole: string;
  onSearch?: (query: string) => void;
  onSettingsClick?: () => void;
}

export const Topbar = ({
  title,
  description,
  userAvatar,
  userName,
  userRole,
  onSearch,
  onSettingsClick,
}: TopbarProps) => {
  return (
    <div 
      className="fixed top-0 left-56 right-0 h-20 flex items-center justify-between px-8"
      style={{ 
        backgroundColor: COLORS.WHITE, zIndex: 50
      }}
    >
      {/* Left: Title and Description */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            {description}
          </p>
        )}
      </div>

      {/* Right: Search, Avatar, Settings */}
<div className="flex items-center gap-6">

  {/* Search Bar */}
  <div
    className="flex items-center gap-2 px-4 py-2 rounded-3xl"
    style={{ backgroundColor: COLORS.GRAY }}
  >
    <input
      type="text"
      placeholder="Search anything..."
      className="bg-transparent outline-none text-sm w-56"
      style={{ color: COLORS.TEXT_PRIMARY }}
      onChange={(e) => onSearch?.(e.target.value)}
    />
    <Search size={18} style={{ color: COLORS.TEXT_SECONDARY }} />
  </div>

  {/* Avatar + Name — với mr để đẩy settings ra ngoài cùng */}
  <div className="flex items-center gap-3" style={{ marginRight: '4rem' }}>
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
      style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
    >
      {userAvatar || userName.charAt(0).toUpperCase()}
    </div>
    <div className="text-sm">
      <p className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
        {userName}
      </p>
      <p style={{ color: COLORS.TEXT_SECONDARY }}>
        {userRole}
      </p>
    </div>
  </div>

  {/* Settings — ngoài cùng bên phải */}
  <button
    onClick={onSettingsClick}
    className="p-2 rounded-full transition-colors"
    style={{ backgroundColor: COLORS.LIGHTER }}
    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.HOVER; }}
    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.LIGHTER; }}
  >
    <Settings size={20} style={{ color: COLORS.TEXT_SECONDARY }} />
  </button>

</div>
      </div>
    
  );
};

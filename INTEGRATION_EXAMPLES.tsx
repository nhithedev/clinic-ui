/**
 * INTEGRATION EXAMPLE
 * 
 * This file shows how to integrate the new layout system into existing components.
 * Each role (Doctor, Manager, AI Trainer) should follow this pattern.
 */

import { useState, ReactNode } from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Home,
  FileText,
  MessageSquare, 
  CalendarDays,
  LayoutDashboard,
  UserCircle,
  Settings,
} from 'lucide-react';
import { SharedLayout } from '@/app/components/layout/SharedLayout';
import { COLORS } from '@/styles/colors';

/**
 * EXAMPLE 1: Doctor Dashboard Integration
 */
export const DoctorDashboardExample = () => {
  const [activePage, setActivePage] = useState('dashboard');

  // Define sidebar items for doctor role
  const doctorSidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      onClick: (id: string) => setActivePage(id),
    },
    {
      id: 'appointments',
      label: 'Quản lý lịch hẹn',
      icon: <CalendarDays size={20} />,
      onClick: (id: string) => setActivePage(id),
    },
    {
      id: 'records',
      label: 'Hồ sơ khám',
      icon: <BookOpen size={20} />,
      onClick: (id: string) => setActivePage(id),
    },
    {
      id: 'consultations',
      label: 'Giải đáp thắc mắc',
      icon: <MessageSquare size={20} />,
      onClick: (id: string) => setActivePage(id),
    },
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: <UserCircle size={20} />,
      onClick: (id: string) => setActivePage(id),
    },
    {
      id: 'logout',
      label: 'Đăng xuất',
      icon: <UserCircle size={20} />,
      onClick: () => {},
    },
  ];

  // Content renderer based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'appointments':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
              Appointments
            </h2>
            <p style={{ color: COLORS.TEXT_SECONDARY }}>Appointments content here</p>
          </div>
        );
      case 'medical-records':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
              Medical Records
            </h2>
            <p style={{ color: COLORS.TEXT_SECONDARY }}>Medical records content here</p>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
              Welcome to Dashboard
            </h2>
            <p style={{ color: COLORS.TEXT_SECONDARY }}>Dashboard content here</p>
          </div>
        );
    }
  };

  return (
    <SharedLayout
      title={activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ')}
      description="Manage your clinic operations"
      sidebarItems={doctorSidebarItems}
      activeItem={activePage}
      userInfo={{
        name: 'Dr. John Smith',
        role: 'Doctor',
        avatar: 'JS',
      }}
      onSidebarItemClick={(id: string) => setActivePage(id)}
      onSearchChange={(query: string) => console.log('Search:', query)}
      onSettingsClick={() => console.log('Settings clicked')}
    >
      {renderContent()}
    </SharedLayout>
  );
};

/**
 * EXAMPLE 2: Using Colors in Custom Components
 */
export const CustomCardExample = () => {
  return (
    <div 
      className="p-6 rounded-lg"
      style={{
        backgroundColor: COLORS.WHITE,
        border: `1px solid #E5E7EB`,
      }}
    >
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: COLORS.TEXT_PRIMARY }}
      >
        Sample Card
      </h3>
      <p 
        className="text-sm mb-4"
        style={{ color: COLORS.TEXT_SECONDARY }}
      >
        This is a card using the unified color system
      </p>
      <button
        className="px-4 py-2 rounded-lg text-white font-semibold transition-colors"
        style={{ 
          backgroundColor: COLORS.BUTTON_CHOSEN,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.DARK;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.BUTTON_CHOSEN;
        }}
      >
        Action Button
      </button>
    </div>
  );
};

/**
 * EXAMPLE 3: Manager Sidebar Configuration
 */
export const getManagerSidebarItems = (onNavigate: (page: string) => void, onLogout: () => void) => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    onClick: () => onNavigate('dashboard'),
  },
  {
    id: 'accounts',
    label: 'Quản lý tài khoản',
    icon: <Users size={20} />,
    onClick: () => onNavigate('accounts'),
  },
  {
    id: 'schedules',
    label: 'Quản lý lịch làm việc',
    icon: <CalendarDays size={20} />,
    onClick: () => onNavigate('schedules'),
  },
  {
    id: 'profile',
    label: 'Hồ sơ cá nhân',
    icon: <UserCircle size={20} />,
    onClick: () => onNavigate('profile'),
  },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: <Settings size={20} />,
    onClick: () => onLogout(),
  },
];

/**
 * EXAMPLE 4: Right Sidebar with Custom Content
 */
export const CustomRightSidebarExample = () => {
  return (
    <div className="space-y-4">
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: COLORS.LIGHTER }}
      >
        <h4 className="font-semibold mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
          Quick Stats
        </h4>
        <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
          Some quick statistics or information
        </p>
      </div>

      <div 
        className="p-4 rounded-lg border"
        style={{ 
          backgroundColor: COLORS.WHITE,
          borderColor: '#E5E7EB'
        }}
      >
        <h4 className="font-semibold mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
          Recent Activity
        </h4>
        <ul className="text-sm space-y-1" style={{ color: COLORS.TEXT_SECONDARY }}>
          <li>• Activity 1</li>
          <li>• Activity 2</li>
          <li>• Activity 3</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * EXAMPLE 5: Responsive Alert/Notification
 */
export const ResponsiveAlertExample = () => {
  return (
    <div 
      className="p-4 rounded-lg border-l-4 flex items-start gap-3"
      style={{
        backgroundColor: '#F0F9FF',
        borderColor: COLORS.BUTTON_CHOSEN,
      }}
    >
      <div 
        className="w-2 h-2 mt-1.5 rounded-full"
        style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
      />
      <div>
        <p className="font-semibold text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
          Important Notice
        </p>
        <p className="text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
          This is an informational message using the unified color system
        </p>
      </div>
    </div>
  );
};

/**
 * MIGRATION STEPS FOR EXISTING COMPONENTS:
 * 
 * 1. Import SharedLayout and COLORS:
 *    import { SharedLayout } from './layout/SharedLayout';
 *    import { COLORS } from '../styles/colors';
 * 
 * 2. Replace old layout wrapper with SharedLayout
 * 
 * 3. Define sidebar items array
 * 
 * 4. Replace inline color values with COLORS constants:
 *    OLD: backgroundColor: '#1F4A51'
 *    NEW: backgroundColor: COLORS.DARK
 * 
 * 5. Use consistent text colors:
 *    Primary: COLORS.TEXT_PRIMARY
 *    Secondary: COLORS.TEXT_SECONDARY
 * 
 * 6. Update borders to use #E5E7EB
 * 
 * 7. Test on all screen sizes
 * 
 * 8. Verify scrollbar appears correctly
 */

import { useState } from 'react';
import { useManager } from './manager-context';
import { KPICard } from './layout/KPICard';
import { NotificationBadge } from './layout/NotificationBadge';
import { COLORS } from '@/styles/colors';
import { Users, Stethoscope, Activity, X } from 'lucide-react';

export function ManagerDashboard() {
  const { accounts, activities, getIncompleteProfiles } = useManager();

  const incompleteProfiles = getIncompleteProfiles();
  const activeAccounts = accounts.filter(a => a.status === 'active');
  
  // Calculate KPI stats
  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.time).toDateString();
    const today = new Date().toDateString();
    return activityDate === today;
  });
  
  const yesterdayActivities = activities.filter(a => {
    const activityDate = new Date(a.time);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return activityDate.toDateString() === yesterday.toDateString();
  });
  
  const visitChangePercent = yesterdayActivities.length > 0 
    ? Math.round(((todayActivities.length - yesterdayActivities.length) / yesterdayActivities.length) * 100)
    : 0;

  const kpiStats = [
    {
      label: 'Lượt truy cập hôm nay',
      value: todayActivities.length,
      change: visitChangePercent,
      timeframe: 'vs hôm qua',
      icon: <Activity size={24} style={{ color: COLORS.WHITE }} />,
    },
    {
      label: 'Tổng số bệnh nhân',
      value: activeAccounts.filter(a => a.role === 'patient').length,
      change: 12,
      timeframe: 'vs tuần trước',
      icon: <Users size={24} style={{ color: COLORS.WHITE }} />,
    },
    {
      label: 'Ca khám',
      value: '42',
      change: 8,
      timeframe: 'vs hôm nay',
      icon: <Stethoscope size={24} style={{ color: COLORS.WHITE }} />,
    },
  ];

  const getActivityColor = (action: string) => {
    if (action.includes('Xóa')) return 'bg-[#d4183d]';
    if (action.includes('Cập nhật')) return 'bg-[#52b788]';
    if (action.includes('Tạo')) return 'bg-[#479AA8]';
    return 'bg-[#f4a261]';
  };

  const getTimeAgo = (isoTime: string) => {
    const now = new Date();
    const time = new Date(isoTime);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };

  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiStats.map((stat) => (
          <KPICard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            timeframe={stat.timeframe}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Incomplete Profiles Modal */}
      {showIncompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
              <h3 className="text-lg font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                Tài khoản cần cập nhật
              </h3>
              <button
                onClick={() => setShowIncompleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={20} style={{ color: COLORS.TEXT_SECONDARY }} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {incompleteProfiles.length > 0 ? (
                incompleteProfiles.map((profile) => (
                  <div key={profile.id} className="p-4 rounded-3xl" style={{ backgroundColor: COLORS.GRAY }}>
                    <p className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                      {profile.name}
                    </p>
                    <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                      {profile.email}
                    </p>
                    <p className="text-xs mt-2" style={{ color: COLORS.TEXT_SECONDARY }}>
                      Role: {profile.role}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: COLORS.TEXT_SECONDARY }}>Không có tài khoản nào cần cập nhật</p>
              )}
            </div>
            <div className="p-4 border-t text-right" style={{ borderColor: '#E5E7EB' }}>
              <button
                onClick={() => setShowIncompleteModal(false)}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Profiles Badge */}
      {incompleteProfiles.length > 0 && (
        <NotificationBadge
          count={incompleteProfiles.length}
          onViewDetails={() => setShowIncompleteModal(true)}
        />
      )}

      {/* Recent Activities */}
      <div className="rounded-3xl p-6" style={{ backgroundColor: COLORS.WHITE }}>
        <h3 className="text-lg font-semibold mb-6" style={{ color: COLORS.TEXT_PRIMARY }}>
          Hoạt động gần đây
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.slice(0, 10).map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-3xl" style={{ backgroundColor: COLORS.GRAY }}>
              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getActivityColor(activity.action)}`}></div>
              <div className="flex-1">
                <p style={{ color: COLORS.TEXT_PRIMARY }} className="text-sm font-medium">
                  {activity.action}
                </p>
                <p style={{ color: COLORS.TEXT_SECONDARY }} className="text-xs">
                  {getTimeAgo(activity.time)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

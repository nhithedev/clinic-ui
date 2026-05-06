import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { COLORS } from '@/styles/colors';

interface NotificationBadgeProps {
  count: number;
  onDismiss?: () => void;
  onViewDetails?: () => void;
}

export const NotificationBadge = ({ 
  count, 
  onDismiss,
  onViewDetails 
}: NotificationBadgeProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div 
      className="p-4 rounded-3xl flex items-start gap-4"
      style={{
        backgroundColor: COLORS.LIGHTER,
      }}
    >
      <AlertCircle size={20} style={{ color: COLORS.BUTTON_CHOSEN, flexShrink: 0, marginTop: '2px' }} />
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
          {count} tài khoản cần cập nhật
        </p>
        <p className="text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
          Một số nhân viên chưa cập nhật thông tin gần đây
        </p>
        <button
          onClick={onViewDetails}
          className="text-xs font-semibold mt-2 hover:opacity-80 transition"
          style={{ color: COLORS.BUTTON_CHOSEN }}
        >
          Xem chi tiết →
        </button>
      </div>
      <button
        onClick={() => {
          setIsDismissed(true);
          onDismiss?.();
        }}
        className="p-1 hover:opacity-60 transition"
        style={{ color: COLORS.TEXT_SECONDARY }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

import { useState } from 'react';
import { COLORS } from '@/styles/colors';
import { usePatient } from '../patient-context';

export function PatientNotifications() {
  const { notifications, markNotificationRead } = usePatient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = notifications.find((n) => n.id === selectedId);
  const hasUnread = notifications.some((n) => !n.read);

  if (selected) {
    return (
      <div className="w-full px-2 md:px-6">
        <div className="rounded-3xl p-6 w-full space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-sm"
            style={{ color: COLORS.BUTTON_CHOSEN }}
          >
            ← Danh sách
          </button>
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            {selected.title}
          </h3>
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            {new Date(selected.time).toLocaleString('vi-VN')}
          </p>
          <p className="leading-7" style={{ color: COLORS.TEXT_PRIMARY }}>
            {selected.body}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-6 space-y-2">
      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={() => notifications.filter((n) => !n.read).forEach((n) => markNotificationRead(n.id))}
          disabled={!hasUnread}
          className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
          style={{
            backgroundColor: hasUnread ? COLORS.BUTTON_CHOSEN : COLORS.GRAY,
            color: hasUnread ? COLORS.WHITE : COLORS.TEXT_SECONDARY,
          }}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {notifications.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => {
            markNotificationRead(n.id);
            setSelectedId(n.id);
          }}
          className="w-full text-left rounded-3xl p-4"
          style={{
            backgroundColor: n.read ? COLORS.WHITE : COLORS.LIGHTER,
            border: `1px solid ${COLORS.BORDER}`,
          }}
        >
          <p className="font-medium text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
            {n.title}
            {!n.read && (
              <span className="ml-2 w-2 h-2 inline-block rounded-full" style={{ backgroundColor: COLORS.BUTTON_CHOSEN }} />
            )}
          </p>
          <p className="text-xs mt-1 line-clamp-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            {n.body}
          </p>
        </button>
      ))}

      {notifications.length === 0 && (
        <p className="p-6 text-center text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
          Chưa có thông báo
        </p>
      )}
    </div>
  );
}
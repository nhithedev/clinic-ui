import { useState } from 'react';
import { COLORS } from '@/styles/colors';
import { usePatient } from '../patient-context';

export function PatientNotifications() {
  const { notifications, markNotificationRead } = usePatient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = notifications.find((n) => n.id === selectedId);

  if (selected) {
    return (
      <div className="rounded-3xl p-6 max-w-lg space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
        <button type="button" onClick={() => setSelectedId(null)} className="text-sm" style={{ color: COLORS.BUTTON_CHOSEN }}>
          ← Danh sách
        </button>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          {selected.title}
        </h3>
        <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
          {new Date(selected.time).toLocaleString('vi-VN')}
        </p>
        <p style={{ color: COLORS.TEXT_PRIMARY }}>{selected.body}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
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
    </div>
  );
}

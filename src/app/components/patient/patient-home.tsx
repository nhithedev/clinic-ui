import { CalendarPlus, MessageCircle, CalendarDays } from 'lucide-react';
import { COLORS } from '@/styles/colors';
import { usePatient } from '../patient-context';

interface PatientHomeProps {
  onNavigate: (page: string) => void;
}

export function PatientHome({ onNavigate }: PatientHomeProps) {
  const { appointments, notifications } = usePatient();
  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('book-appointment')}
          className="rounded-3xl p-6 text-left transition-colors hover:opacity-95"
          style={{ backgroundColor: COLORS.WHITE }}
        >
          <CalendarPlus size={32} style={{ color: COLORS.BUTTON_CHOSEN }} />
          <h3 className="text-lg font-semibold mt-3" style={{ color: COLORS.TEXT_PRIMARY }}>
            Đặt lịch khám
          </h3>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            Chọn chuyên khoa, bác sĩ và khung giờ phù hợp
          </p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('symptom-consultation')}
          className="rounded-3xl p-6 text-left transition-colors hover:opacity-95"
          style={{ backgroundColor: COLORS.WHITE }}
        >
          <MessageCircle size={32} style={{ color: COLORS.BUTTON_CHOSEN }} />
          <h3 className="text-lg font-semibold mt-3" style={{ color: COLORS.TEXT_PRIMARY }}>
            Tư vấn triệu chứng
          </h3>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            Mô tả triệu chứng và nhận gợi ý từ AI
          </p>
        </button>
      </div>

      <div className="rounded-3xl p-6" style={{ backgroundColor: COLORS.WHITE }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Lịch hẹn sắp tới
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('my-appointments')}
            className="text-sm font-medium"
            style={{ color: COLORS.BUTTON_CHOSEN }}
          >
            Xem tất cả
          </button>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Chưa có lịch hẹn. Đặt lịch khám ngay.
          </p>
        ) : (
          upcoming.slice(0, 2).map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-3 p-4 rounded-3xl mb-2"
              style={{ backgroundColor: COLORS.GRAY }}
            >
              <CalendarDays size={20} style={{ color: COLORS.BUTTON_CHOSEN }} />
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
                  {apt.specialty} — {apt.doctorName}
                </p>
                <p className="text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
                  {new Date(apt.date).toLocaleDateString('vi-VN')} · {apt.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {unread > 0 && (
        <button
          type="button"
          onClick={() => onNavigate('notifications')}
          className="w-full rounded-3xl p-4 text-left"
          style={{ backgroundColor: COLORS.LIGHTER }}
        >
          <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            {unread} thông báo chưa đọc
          </p>
        </button>
      )}
    </div>
  );
}

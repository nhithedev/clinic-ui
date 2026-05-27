import { useState } from 'react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { usePatient, PatientAppointment, TIME_SLOTS } from '../patient-context';

type View = 'list' | 'detail' | 'reschedule' | 'history';

export function MyAppointments() {
  const { appointments, cancelAppointment, rescheduleAppointment } = usePatient();
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<PatientAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  const openDetail = (apt: PatientAppointment) => {
    setSelected(apt);
    setView('detail');
  };

  const handleCancelConfirm = () => {
    if (!selected) return;
    cancelAppointment(selected.id, cancelReason.trim() || undefined);
    toast.success('Đã hủy lịch hẹn');
    setShowCancelModal(false);
    setCancelReason('');
    setView('list');
    setSelected(null);
  };

  const openReschedule = (apt: PatientAppointment) => {
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.time);
    setView('reschedule');
  };

  if (view === 'history') {
    return (
      <div className="space-y-4 p-2">
        <button type="button" onClick={() => setView('list')} className="text-sm" style={{ color: COLORS.BUTTON_CHOSEN }}>
          ← Danh sách lịch hẹn
        </button>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Lịch sử khám
        </h3>
        {completed.length === 0 ? (
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Chưa có lần khám đã hoàn thành
          </p>
        ) : (
          completed.map((a) => (
            <div key={a.id} className="rounded-3xl p-4" style={{ backgroundColor: COLORS.WHITE }}>
              <p className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                {a.specialty} — {a.doctorName}
              </p>
              <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                {new Date(a.date).toLocaleDateString('vi-VN')}
              </p>
            </div>
          ))
        )}
      </div>
    );
  }

  if (view === 'reschedule' && selected) {
    return (
      <div className="rounded-3xl p-6 space-y-4 max-w-lg" style={{ backgroundColor: COLORS.WHITE }}>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Đổi lịch hẹn
        </h3>
        <input
          type="date"
          value={rescheduleDate}
          onChange={(e) => setRescheduleDate(e.target.value)}
          className="w-full px-4 py-3 rounded-3xl border"
        />
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setRescheduleTime(t)}
              className="px-3 py-2 rounded-3xl border text-sm"
              style={{
                borderColor: rescheduleTime === t ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                backgroundColor: rescheduleTime === t ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
                color: rescheduleTime === t ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setView('detail')} className="px-4 py-2 rounded-3xl border">
            Huỷ
          </button>
          <button
            type="button"
            disabled={!rescheduleDate || !rescheduleTime}
            onClick={() => {
              if (!selected) return;
              rescheduleAppointment(selected.id, rescheduleDate, rescheduleTime);
              toast.success('Đã đổi lịch hẹn');
              setView('list');
              setSelected(null);
            }}
            className="px-6 py-2 rounded-3xl text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selected) {
    return (
      <div className="rounded-3xl p-6 space-y-4 max-w-lg" style={{ backgroundColor: COLORS.WHITE }}>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Chi tiết lịch hẹn
        </h3>
        <p className="text-sm">
          <span style={{ color: COLORS.TEXT_SECONDARY }}>Mã: </span>
          {selected.code}
        </p>
        <p className="text-sm">{selected.doctorName}</p>
        <p className="text-sm">{selected.clinicName}</p>
        <p className="text-sm">
          {new Date(selected.date).toLocaleDateString('vi-VN')} — {selected.time}
        </p>
        {selected.status === 'upcoming' && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selected && openReschedule(selected)}
              className="px-4 py-2 rounded-3xl text-white text-sm"
              style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
            >
              Đổi lịch
            </button>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 rounded-3xl text-sm text-white"
              style={{ backgroundColor: COLORS.DESTRUCTIVE }}
            >
              Huỷ lịch
            </button>
          </div>
        )}
        <button type="button" onClick={() => setView('list')} className="text-sm" style={{ color: COLORS.BUTTON_CHOSEN }}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {showCancelModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
              Xác nhận huỷ lịch hẹn
            </h3>
            <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
              Mã {selected.code} — {selected.doctorName}
            </p>
            <label className="block text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
              Lý do huỷ (tùy chọn)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-3 rounded-3xl border min-h-[80px] text-sm"
              style={{ borderColor: COLORS.BORDER }}
              placeholder="Nhập lý do..."
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="px-4 py-2 rounded-3xl border text-sm"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="px-4 py-2 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLORS.DESTRUCTIVE }}
              >
                Xác nhận huỷ
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setView('history')}
          className="text-sm font-medium"
          style={{ color: COLORS.BUTTON_CHOSEN }}
        >
          Lịch sử khám
        </button>
      </div>
      <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: COLORS.WHITE }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: COLORS.GRAY }}>
              <th className="text-left p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                Chuyên khoa
              </th>
              <th className="text-left p-3">Ngày</th>
              <th className="text-left p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {[...upcoming, ...cancelled].map((a) => (
              <tr
                key={a.id}
                className="border-t cursor-pointer hover:opacity-90"
                style={{ borderColor: COLORS.BORDER }}
                onClick={() => openDetail(a)}
              >
                <td className="p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  {a.specialty}
                </td>
                <td className="p-3" style={{ color: COLORS.TEXT_SECONDARY }}>
                  {new Date(a.date).toLocaleDateString('vi-VN')} {a.time}
                </td>
                <td className="p-3">
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor:
                        a.status === 'upcoming' ? COLORS.LIGHTER : COLORS.GRAY,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {a.status === 'upcoming' ? 'Sắp tới' : 'Đã hủy'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {upcoming.length === 0 && cancelled.length === 0 && (
          <p className="p-6 text-center text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Chưa có lịch hẹn
          </p>
        )}
      </div>
    </div>
  );
}

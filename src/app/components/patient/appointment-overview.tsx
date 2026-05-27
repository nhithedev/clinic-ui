import { useState } from 'react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { AppointmentBookingWizard } from './appointment-booking-wizard';
import { PatientAppointment, TIME_SLOTS, usePatient } from '../patient-context';

const inputClassName =
  'w-full px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]';

export function AppointmentOverview() {
  const { appointments, cancelAppointment, rescheduleAppointment } = usePatient();
  const [wizardKey, setWizardKey] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const visibleAppointments = appointments.filter(
    (appointment) => appointment.status === 'upcoming' || appointment.status === 'cancelled',
  );
  const selectedAppointment = appointments.find((appointment) => appointment.id === expandedId);

  const toggleAppointment = (appointment: PatientAppointment) => {
    setExpandedId((prev) => (prev === appointment.id ? null : appointment.id));
    setReschedulingId(null);
    setCancelReason('');
  };

  const openReschedule = (appointment: PatientAppointment) => {
    setReschedulingId(appointment.id);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time);
  };

  const submitReschedule = () => {
    if (!reschedulingId || !rescheduleDate || !rescheduleTime) return;
    rescheduleAppointment(reschedulingId, rescheduleDate, rescheduleTime);
    toast.success('Đã đổi lịch hẹn');
    setReschedulingId(null);
  };

  const submitCancel = () => {
    if (!selectedAppointment) return;
    cancelAppointment(selectedAppointment.id, cancelReason.trim() || undefined);
    toast.success('Đã hủy lịch hẹn');
    setCancelReason('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 p-2">
      <div className="min-w-0">
        <AppointmentBookingWizard
  key={wizardKey}
  onDone={() => setWizardKey((prev) => prev + 1)}
  compact
/>
      </div>

      <aside className="rounded-3xl p-4 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
        <div>
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Lịch hẹn của tôi
          </h3>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            Bấm lại vào lịch hẹn đang mở để thu gọn.
          </p>
        </div>

        <div className="space-y-3">
          {visibleAppointments.map((appointment) => (
            <button
              key={appointment.id}
              type="button"
              onClick={() => toggleAppointment(appointment)}
              className="w-full text-left rounded-3xl p-4 border transition-colors"
              style={{
                borderColor:
                  expandedId === appointment.id ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                backgroundColor:
                  expandedId === appointment.id ? COLORS.HOVER : COLORS.WHITE,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
                    {appointment.specialty}
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                    {new Date(appointment.date).toLocaleDateString('vi-VN')} — {appointment.time}
                  </p>
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor:
                      appointment.status === 'upcoming' ? COLORS.LIGHTER : COLORS.GRAY,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                >
                  {appointment.status === 'upcoming' ? 'Sắp tới' : 'Đã hủy'}
                </span>
              </div>
            </button>
          ))}

          {visibleAppointments.length === 0 && (
            <p className="text-sm text-center py-6" style={{ color: COLORS.TEXT_SECONDARY }}>
              Chưa có lịch hẹn
            </p>
          )}
        </div>

        {selectedAppointment && (
          <div className="rounded-3xl p-4 space-y-3 border" style={{ borderColor: COLORS.BORDER }}>
            <h4 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
              Chi tiết lịch hẹn
            </h4>
            <p className="text-sm">
              <span style={{ color: COLORS.TEXT_SECONDARY }}>Mã: </span>
              <span style={{ color: COLORS.TEXT_PRIMARY }}>{selectedAppointment.code}</span>
            </p>
            <p className="text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
              {selectedAppointment.doctorName}
            </p>
            <p className="text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
              {selectedAppointment.clinicName}
            </p>
            <p className="text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
              {new Date(selectedAppointment.date).toLocaleDateString('vi-VN')} —{' '}
              {selectedAppointment.time}
            </p>

            {selectedAppointment.status === 'upcoming' && (
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openReschedule(selectedAppointment)}
                    className="px-4 py-2 rounded-3xl text-white text-sm"
                    style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                  >
                    Đổi lịch
                  </button>
                  <button
                    type="button"
                    onClick={submitCancel}
                    className="px-4 py-2 rounded-3xl text-white text-sm"
                    style={{ backgroundColor: COLORS.DESTRUCTIVE }}
                  >
                    Huỷ lịch
                  </button>
                </div>

                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className={inputClassName}
                  style={{
                    borderColor: COLORS.BORDER,
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.WHITE,
                  }}
                  placeholder="Lý do hủy (tùy chọn)"
                  rows={2}
                />
              </div>
            )}

            {reschedulingId === selectedAppointment.id && (
              <div className="space-y-3 pt-2">
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className={inputClassName}
                  style={{
                    borderColor: COLORS.BORDER,
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.WHITE,
                  }}
                />
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className={inputClassName}
                  style={{
                    borderColor: COLORS.BORDER,
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.WHITE,
                  }}
                >
                  <option value="">Chọn giờ</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={submitReschedule}
                  className="px-4 py-2 rounded-3xl text-white text-sm"
                  style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                >
                  Xác nhận đổi lịch
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
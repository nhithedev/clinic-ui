import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { AppointmentBookingWizard } from './appointment-booking-wizard';
import {
  MOCK_DOCTORS,
  PatientAppointment,
  TIME_SLOTS,
  usePatient,
} from '../patient-context';

const inputClassName =
  'w-full px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)] transition-all duration-200 hover:border-[var(--color-button-chosen)]';

const primaryButtonClassName =
  'px-4 py-2 rounded-3xl text-white text-sm transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

const ghostButtonClassName =
  'px-4 py-2 rounded-3xl text-sm border transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)] active:scale-[0.98]';

export function AppointmentOverview() {
  const { appointments, cancelAppointment, rescheduleAppointment } = usePatient();
  const [wizardKey, setWizardKey] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const visibleAppointments = appointments.filter(
    (appointment) => appointment.status === 'upcoming' || appointment.status === 'cancelled',
  );

  const selectedAppointment = appointments.find((appointment) => appointment.id === expandedId);

  const availableRescheduleDoctors = useMemo(() => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return [];

    // Demo rule giống luồng chat cũ: khung 16:00 giả lập là chưa có bác sĩ.
    if (rescheduleTime === '16:00') return [];

    const bySpecialty = MOCK_DOCTORS.filter(
      (doctor) => doctor.specialty === selectedAppointment.specialty,
    );

    return bySpecialty.length > 0 ? bySpecialty : MOCK_DOCTORS;
  }, [selectedAppointment, rescheduleDate, rescheduleTime]);

  const toggleAppointment = (appointment: PatientAppointment) => {
    setExpandedId((prev) => (prev === appointment.id ? null : appointment.id));
    setReschedulingId(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleDoctorId(null);
    setCancelReason('');
  };

  const openReschedule = (appointment: PatientAppointment) => {
    const currentDoctor = MOCK_DOCTORS.find((doctor) => doctor.name === appointment.doctorName);

    setReschedulingId(appointment.id);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time);
    setRescheduleDoctorId(currentDoctor?.id || null);
  };

  const submitReschedule = () => {
    if (!reschedulingId || !rescheduleDate || !rescheduleTime) {
      toast.error('Vui lòng chọn ngày và giờ mới');
      return;
    }

    if (availableRescheduleDoctors.length === 0) {
      toast.error('Ca mới hiện chưa có bác sĩ phù hợp');
      return;
    }

    if (!rescheduleDoctorId) {
      toast.error('Vui lòng chọn bác sĩ trong ca mới');
      return;
    }

    const selectedDoctor = MOCK_DOCTORS.find((doctor) => doctor.id === rescheduleDoctorId);

    rescheduleAppointment(reschedulingId, rescheduleDate, rescheduleTime);

    toast.success(
      selectedDoctor
        ? `Đã đổi lịch hẹn. Bác sĩ phù hợp trong ca mới: ${selectedDoctor.name}`
        : 'Đã đổi lịch hẹn',
    );

    setReschedulingId(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleDoctorId(null);
  };

  const submitCancel = () => {
    if (!selectedAppointment) return;

    cancelAppointment(selectedAppointment.id, cancelReason.trim() || undefined);
    toast.success('Đã hủy lịch hẹn');
    setCancelReason('');
  };

  return (
    <div className="h-full min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 p-2">
      <div className="min-w-0 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-auto">
          <AppointmentBookingWizard
            key={wizardKey}
            onDone={() => setWizardKey((prev) => prev + 1)}
            compact
          />
        </div>
      </div>

      <aside
        className="rounded-3xl p-4 space-y-4 xl:mb-10 h-full min-h-0 overflow-auto"
        style={{ backgroundColor: COLORS.WHITE }}
      >
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
              className="w-full text-left rounded-3xl p-4 border transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.99]"
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
                    className={primaryButtonClassName}
                    style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                  >
                    Đổi lịch
                  </button>

                  <button
                    type="button"
                    onClick={submitCancel}
                    className={primaryButtonClassName}
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
              <div className="space-y-3 pt-2 border-t" style={{ borderColor: COLORS.BORDER }}>
                <p className="text-sm font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Chọn ca mới
                </p>

                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleDoctorId(null);
                  }}
                  className={inputClassName}
                  style={{
                    borderColor: COLORS.BORDER,
                    color: COLORS.TEXT_PRIMARY,
                    backgroundColor: COLORS.WHITE,
                  }}
                />

                <select
                  value={rescheduleTime}
                  onChange={(e) => {
                    setRescheduleTime(e.target.value);
                    setRescheduleDoctorId(null);
                  }}
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

                {rescheduleDate && rescheduleTime && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                      Bác sĩ có trong ca mới
                    </p>

                    {availableRescheduleDoctors.length > 0 ? (
                      <div className="space-y-2">
                        {availableRescheduleDoctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            type="button"
                            onClick={() => setRescheduleDoctorId(doctor.id)}
                            className="w-full rounded-3xl border p-3 text-left transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.99]"
                            style={{
                              borderColor:
                                rescheduleDoctorId === doctor.id
                                  ? COLORS.BUTTON_CHOSEN
                                  : COLORS.BORDER,
                              backgroundColor:
                                rescheduleDoctorId === doctor.id ? COLORS.HOVER : COLORS.WHITE,
                            }}
                          >
                            <p className="text-sm font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                              {doctor.name}
                            </p>
                            <p className="text-xs mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                              {doctor.specialty} · {doctor.exp} · ★ {doctor.rating}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p
                        className="rounded-3xl px-4 py-3 text-sm"
                        style={{ color: COLORS.TEXT_SECONDARY, backgroundColor: COLORS.GRAY }}
                      >
                        Ca này hiện chưa có bác sĩ phù hợp. Vui lòng chọn giờ khác.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={submitReschedule}
                    disabled={!rescheduleDate || !rescheduleTime || !rescheduleDoctorId}
                    className={primaryButtonClassName}
                    style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                  >
                    Xác nhận đổi lịch
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReschedulingId(null);
                      setRescheduleDate('');
                      setRescheduleTime('');
                      setRescheduleDoctorId(null);
                    }}
                    className={ghostButtonClassName}
                    style={{
                      borderColor: COLORS.BORDER,
                      color: COLORS.TEXT_PRIMARY,
                      backgroundColor: COLORS.WHITE,
                    }}
                  >
                    Hủy đổi lịch
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
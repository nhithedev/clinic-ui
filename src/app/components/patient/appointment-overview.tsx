import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Search, Plus, CalendarIcon, Clock3, X } from 'lucide-react';
import { COLORS } from '@/styles/colors';
import { AppointmentBookingWizard } from './appointment-booking-wizard';
import {
  MOCK_DOCTORS,
  PatientAppointment,
  TIME_SLOTS,
  usePatient,
} from '../contexts/patient-context';

type TabType = 'pending' | 'confirmed';

const inputClassName =
  'w-full px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)] transition-all duration-200 hover:border-[var(--color-button-chosen)]';

const primaryButtonClassName =
  'px-4 py-2 rounded-3xl text-white text-sm transition-all duration-200 hover:opacity-90 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

const ghostButtonClassName =
  'px-4 py-2 rounded-3xl text-sm border transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)] active:scale-[0.98]';

export function AppointmentOverview() {
  const { appointments, cancelAppointment, rescheduleAppointment } = usePatient();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardKey, setWizardKey] = useState(0);

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const rescheduleFormRef = useRef<HTMLDivElement>(null);

  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const pendingAppointments = appointments.filter((a) => a.status === 'upcoming');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');

  const filterAppointments = (apts: PatientAppointment[]) => {
    if (!searchQuery) return apts;
    const q = searchQuery.toLowerCase();
    return apts.filter(
      (a) =>
        a.specialty.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.clinicName.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q),
    );
  };

  const selectedAppointment = appointments.find((a) => a.id === selectedId) ?? null;

  const availableRescheduleDoctors = useMemo(() => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return [];
    if (rescheduleTime === '16:00') return [];
    const bySpecialty = MOCK_DOCTORS.filter((d) => d.specialty === selectedAppointment.specialty);
    return bySpecialty.length > 0 ? bySpecialty : MOCK_DOCTORS;
  }, [selectedAppointment, rescheduleDate, rescheduleTime]);

  const handleSelectAppointment = (apt: PatientAppointment) => {
    setSelectedId((prev) => (prev === apt.id ? null : apt.id));
    setReschedulingId(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleDoctorId(null);
    setCancelReason('');
  };

  const openReschedule = (apt: PatientAppointment) => {
    const doctor = MOCK_DOCTORS.find((d) => d.name === apt.doctorName);
    setReschedulingId(apt.id);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.time);
    setRescheduleDoctorId(doctor?.id ?? null);
    setTimeout(() => {
      rescheduleFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
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
    const doctor = MOCK_DOCTORS.find((d) => d.id === rescheduleDoctorId);
    rescheduleAppointment(reschedulingId, rescheduleDate, rescheduleTime);
    toast.success(doctor ? `Đã đổi lịch hẹn. Bác sĩ: ${doctor.name}` : 'Đã đổi lịch hẹn');
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
    setSelectedId(null);
  };

  const tabs = [
    { id: 'pending' as TabType, label: 'Chờ duyệt', count: pendingAppointments.length },
    { id: 'confirmed' as TabType, label: 'Đã được duyệt', count: confirmedAppointments.length },
  ];

  const currentList = filterAppointments(
    activeTab === 'pending' ? pendingAppointments : confirmedAppointments,
  );

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chuyên khoa, bác sĩ, phòng khám..."
            className="pl-10 pr-4 py-2 bg-white rounded-3xl outline-none border-2 border-transparent focus:border-[#E2E2E2] w-80 text-sm text-[#1F4A51] transition-all"
          />
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-3xl text-white text-sm"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          <Plus className="w-4 h-4" />
          Tạo lịch hẹn mới
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: white card with tabs + scrollable list */}
        <div
          className="flex flex-col min-h-0 bg-white rounded-3xl p-6 transition-all duration-300 ease-in-out"
          style={{ flex: selectedId ? '0 0 55%' : '1 1 100%' }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[#E5E7EB] flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedId(null);
                  setReschedulingId(null);
                }}
                className={`px-6 py-3 transition-colors relative text-sm ${
                  activeTab === tab.id
                    ? 'text-[#479AA8]'
                    : 'text-[#6B7280] hover:text-[#1F4A51]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-[#479AA8] text-white'
                        : 'bg-[#F4FDFC] text-[#6B7280]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#479AA8]" />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-4">
              {currentList.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => handleSelectAppointment(apt)}
                  className={`rounded-3xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                    selectedId === apt.id
                      ? 'border-[#479AA8] bg-[#F4FDFC]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#479AA8]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[#1F4A51] font-medium">{apt.specialty}</h3>
                        {activeTab === 'pending' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                            Chờ xác nhận
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#DEF1EF] text-[#479AA8]">
                            Đã xác nhận
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7280] mb-3">
                        {apt.doctorName} — {apt.clinicName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(apt.date).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock3 className="w-4 h-4" />
                          {apt.time}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#6B7280] mt-1">{apt.code}</span>
                  </div>
                </div>
              ))}
              {currentList.length === 0 && (
                <p className="text-center py-12 text-sm text-[#6B7280]">
                  {searchQuery ? 'Không tìm thấy lịch hẹn phù hợp' : 'Chưa có lịch hẹn'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: appointment detail sidebar */}
        <div
          className="flex flex-col min-h-0 overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            flex: selectedId ? '0 0 45%' : '0 0 0%',
            opacity: selectedId ? 1 : 0,
          }}
        >
          {selectedAppointment && (
            <div className="h-full flex flex-col bg-white rounded-3xl border border-[#E5E7EB] ml-4">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
                <h3 className="font-semibold text-[#1F4A51]">Chi tiết lịch hẹn</h3>
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setReschedulingId(null);
                  }}
                  className="p-1 rounded-full hover:bg-[#F5F5F7] transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              {/* Content */}
              <div ref={contentScrollRef} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Mã lịch hẹn</p>
                    <p className="font-medium text-[#1F4A51] text-sm">{selectedAppointment.code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Trạng thái</p>
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs ${
                        selectedAppointment.status === 'confirmed'
                          ? 'bg-[#DEF1EF] text-[#479AA8]'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {selectedAppointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                    </span>
                  </div>
                </div>                

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Ngày hẹn</p>
                    <p className="font-medium text-[#1F4A51] text-sm">
                      {new Date(selectedAppointment.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Giờ hẹn</p>
                    <p className="font-medium text-[#1F4A51] text-sm">{selectedAppointment.time}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Bác sĩ</p>
                    <p className="font-medium text-[#1F4A51] text-sm">{selectedAppointment.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Chuyên khoa</p>
                    <p className="font-medium text-[#1F4A51] text-sm">{selectedAppointment.specialty}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Phòng khám</p>
                  <p className="font-medium text-[#1F4A51] text-sm">{selectedAppointment.clinicName}</p>
                </div>

                {/* Reschedule form — only for pending */}
                {selectedAppointment.status === 'upcoming' &&
                  reschedulingId === selectedAppointment.id && (
                    <div ref={rescheduleFormRef} className="space-y-3 pt-4 border-t border-[#E5E7EB]">
                      <p className="text-sm font-medium text-[#1F4A51]">Chọn ca mới</p>
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
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

                      {rescheduleDate && rescheduleTime && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-[#1F4A51]">Bác sĩ có trong ca mới</p>
                          {availableRescheduleDoctors.length > 0 ? (
                            availableRescheduleDoctors.map((doc) => (
                              <button
                                key={doc.id}
                                type="button"
                                onClick={() => setRescheduleDoctorId(doc.id)}
                                className="w-full rounded-3xl border px-4 py-2 text-left transition-all hover:border-[#479AA8]"
                                style={{
                                  borderColor:
                                    rescheduleDoctorId === doc.id
                                      ? COLORS.BUTTON_CHOSEN
                                      : COLORS.BORDER,
                                  backgroundColor:
                                    rescheduleDoctorId === doc.id ? COLORS.HOVER : COLORS.WHITE,
                                }}
                              >
                                <p className="text-sm font-medium text-[#1F4A51]">{doc.name}</p>
                                <p className="text-xs mt-1 text-[#6B7280]">
                                  {doc.specialty} · {doc.exp} · ★ {doc.rating}
                                </p>
                              </button>
                            ))
                          ) : (
                            <p className="rounded-3xl px-4 py-3 text-sm text-[#6B7280] bg-[#F5F5F7]">
                              Ca này chưa có bác sĩ phù hợp. Vui lòng chọn giờ khác.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* Cancel reason — only for pending, not rescheduling */}
                {selectedAppointment.status === 'upcoming' &&
                  reschedulingId !== selectedAppointment.id && (
                    <div className="pt-4 border-t border-[#E5E7EB]">
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Lý do hủy (tùy chọn)"
                        rows={2}
                        className={inputClassName}
                        style={{
                          borderColor: COLORS.BORDER,
                          color: COLORS.TEXT_PRIMARY,
                          backgroundColor: COLORS.WHITE,
                        }}
                      />
                    </div>
                  )}
              </div>

              {/* Actions — pinned at bottom*/}
              {selectedAppointment.status === 'upcoming' && (
                <div className="flex-shrink-0 border-t border-[#E5E7EB] p-6">
                  {reschedulingId === selectedAppointment.id ? (
                    <div className="flex gap-3">
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
                  ) : (
                    <div className="flex gap-3">
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
                        Hủy lịch
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedAppointment.status === 'confirmed' && (
                <div className="flex-shrink-0 border-t border-[#E5E7EB] p-6">
                  {reschedulingId === selectedAppointment.id ? (
                    <div className="flex gap-3">
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
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={submitCancel}
                        className={primaryButtonClassName}
                        style={{ backgroundColor: COLORS.DESTRUCTIVE }}
                      >
                        Hủy lịch
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Wizard Modal */}
      {showWizard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowWizard(false);
          }}
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <h2 className="font-semibold text-[#1F4A51]">Tạo lịch hẹn mới</h2>
              <button
                onClick={() => setShowWizard(false)}
                className="p-1 rounded-full hover:bg-[#F5F5F7] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <AppointmentBookingWizard
                key={wizardKey}
                onDone={() => {
                  setShowWizard(false);
                  setWizardKey((prev) => prev + 1);
                }}
                compact
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

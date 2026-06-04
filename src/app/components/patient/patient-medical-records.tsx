import { useState } from 'react';
import { Search, X, CalendarIcon, Clock3, Pill, FileText, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS, COLOR_HEX } from '@/styles/colors';
import { PatientMedicalRecord, usePatient, TIME_SLOTS } from '../patient-context';

const inputClassName =
  'w-full px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)] transition-all duration-200 hover:border-[var(--color-button-chosen)]';

const selectClassName =
  'px-3 py-2.5 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)] transition-all duration-200 hover:border-[var(--color-button-chosen)] cursor-pointer';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface BookedInfo {
  date: string;
  time: string;
}

function LabeledBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
        {label}
      </p>
      <div
        className="rounded-2xl p-4 text-sm leading-relaxed"
        style={{ backgroundColor: COLOR_HEX.GRAY, color: COLORS.TEXT_PRIMARY }}
      >
        {children}
      </div>
    </div>
  );
}

function RecordCard({
  record,
  selected,
  booked,
  onClick,
  onBookFollowUp,
}: {
  record: PatientMedicalRecord;
  selected: boolean;
  booked: BookedInfo | null;
  onClick: () => void;
  onBookFollowUp: (record: PatientMedicalRecord) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-3xl border p-5 transition-all duration-200 hover:border-[#479AA8] hover:bg-[#F4FDFC]"
      style={{
        borderColor: selected ? COLOR_HEX.BUTTON_CHOSEN : COLOR_HEX.BORDER,
        backgroundColor: selected ? COLOR_HEX.HOVER : COLOR_HEX.WHITE,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          {record.diagnosis}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          {record.followUpDate && (
            booked ? (
              <span
                className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
                style={{ backgroundColor: '#E6F4F1', color: COLOR_HEX.BUTTON_CHOSEN }}
              >
                <CheckCircle size={10} />
                Đã hẹn tái khám: {formatDate(booked.date)}
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookFollowUp(record);
                }}
                className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 transition-opacity hover:opacity-75"
                style={{ backgroundColor: COLOR_HEX.WARNING_BG, color: COLOR_HEX.WARNING_TEXT }}
              >
                <RefreshCw size={10} />
                Tái khám: {formatDate(record.followUpDate)}
              </button>
            )
          )}
          <span className="text-xs flex items-center gap-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            <CalendarIcon size={12} />
            {formatDate(record.date)}
          </span>
        </div>
      </div>
      <p className="text-sm mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
        Chuyên khoa: {record.specialty}
      </p>
      <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
        {record.doctorName} — {record.clinicName}
      </p>
    </button>
  );
}

function DetailPanel({
  record,
  booked,
  onClose,
  onBookFollowUp,
}: {
  record: PatientMedicalRecord;
  booked: BookedInfo | null;
  onClose: () => void;
  onBookFollowUp: (record: PatientMedicalRecord) => void;
}) {
  return (
    <div
      className="h-full flex flex-col rounded-3xl border"
      style={{ backgroundColor: COLOR_HEX.WHITE, borderColor: COLOR_HEX.BORDER }}
    >
      <div
        className="flex items-center justify-between p-5 flex-shrink-0 border-b"
        style={{ borderColor: COLOR_HEX.BORDER }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chi tiết hồ sơ khám
          </p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.TEXT_SECONDARY }}>
            {record.specialty} — {formatDate(record.date)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#F5F5F7] transition-colors"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3" style={{ backgroundColor: COLOR_HEX.GRAY }}>
            <p className="text-xs font-medium mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
              Ngày khám
            </p>
            <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: COLORS.TEXT_PRIMARY }}>
              <CalendarIcon size={13} />
              {formatDate(record.date)}
            </p>
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: COLORS.TEXT_SECONDARY }}>
              <Clock3 size={11} />
              {record.time}
            </p>
          </div>
          <div className="rounded-2xl p-3" style={{ backgroundColor: COLOR_HEX.GRAY }}>
            <p className="text-xs font-medium mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
              Bác sĩ điều trị
            </p>
            <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
              {record.doctorName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.TEXT_SECONDARY }}>
              {record.clinicName}
            </p>
          </div>
        </div>

        <LabeledBox label="Triệu chứng">{record.symptoms}</LabeledBox>
        <LabeledBox label="Chẩn đoán">{record.diagnosis}</LabeledBox>
        <LabeledBox label="Hướng xử trí">{record.treatment}</LabeledBox>

        {record.medications.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: COLORS.TEXT_SECONDARY }}>
              <Pill size={12} />
              Đơn thuốc ({record.medications.length} loại)
            </p>
            <div className="space-y-2">
              {record.medications.map((med, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border"
                  style={{ backgroundColor: COLOR_HEX.GRAY, borderColor: COLOR_HEX.BORDER }}
                >
                  <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                    {med.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                    Liều dùng: {med.dosage}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
                    Hướng dẫn: {med.instructions}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {record.notes && (
          <div>
            <p className="text-xs font-semibold mb-1 flex items-center gap-1.5" style={{ color: COLORS.TEXT_SECONDARY }}>
              <FileText size={12} />
              Ghi chú & Dặn dò
            </p>
            <div
              className="rounded-2xl p-4 text-sm leading-relaxed"
              style={{ backgroundColor: COLOR_HEX.GRAY, color: COLORS.TEXT_PRIMARY }}
            >
              {record.notes}
            </div>
          </div>
        )}

        {record.followUpDate && (
          booked ? (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ backgroundColor: '#E6F4F1' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
              >
                <CheckCircle size={16} color={COLOR_HEX.WHITE} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: COLOR_HEX.BUTTON_CHOSEN }}>
                  Đã đặt lịch tái khám
                </p>
                <p className="text-sm font-bold" style={{ color: COLOR_HEX.BUTTON_CHOSEN }}>
                  {formatDate(booked.date)} lúc {booked.time}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ backgroundColor: COLOR_HEX.WARNING_BG }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: COLOR_HEX.WARNING_TEXT }}
                >
                  <RefreshCw size={16} color={COLOR_HEX.WHITE} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: COLOR_HEX.WARNING_TEXT }}>
                    Lịch tái khám
                  </p>
                  <p className="text-sm font-bold" style={{ color: COLOR_HEX.WARNING_TEXT }}>
                    {formatDate(record.followUpDate)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onBookFollowUp(record)}
                className="w-full py-3 rounded-3xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
              >
                Đặt giờ tái khám
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function FollowUpBookingPanel({
  record,
  bookingDate,
  isPastDate,
  onClose,
  onBooked,
}: {
  record: PatientMedicalRecord;
  bookingDate: string;
  isPastDate: boolean;
  onClose: () => void;
  onBooked: (time: string) => void;
}) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div
      className="h-full flex flex-col rounded-3xl border"
      style={{ backgroundColor: COLOR_HEX.WHITE, borderColor: COLOR_HEX.BORDER }}
    >
      <div
        className="flex items-center justify-between p-5 flex-shrink-0 border-b"
        style={{ borderColor: COLOR_HEX.BORDER }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Đặt giờ tái khám
          </p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.TEXT_SECONDARY }}>
            Ngày đặt: {formatDate(bookingDate)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#F5F5F7] transition-colors"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        {isPastDate && (
          <div
            className="rounded-2xl px-4 py-3 text-xs leading-relaxed"
            style={{ backgroundColor: COLOR_HEX.WARNING_BG, color: COLOR_HEX.WARNING_TEXT }}
          >
            Ngày tái khám gốc ({formatDate(record.followUpDate)}) đã qua — lịch sẽ được đặt cho hôm nay.
          </div>
        )}

        <div className="rounded-2xl p-4" style={{ backgroundColor: COLOR_HEX.GRAY }}>
          <p className="text-xs font-medium mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            Bác sĩ
          </p>
          <p className="text-sm font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            {record.doctorName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.TEXT_SECONDARY }}>
            {record.specialty} — {record.clinicName}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: COLORS.TEXT_SECONDARY }}>
            Chọn giờ khám
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className="py-3 rounded-2xl text-sm font-medium border transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                style={
                  selectedTime === slot
                    ? {
                        backgroundColor: COLOR_HEX.BUTTON_CHOSEN,
                        color: COLOR_HEX.WHITE,
                        borderColor: COLOR_HEX.BUTTON_CHOSEN,
                      }
                    : {
                        backgroundColor: COLOR_HEX.GRAY,
                        color: COLORS.TEXT_PRIMARY,
                        borderColor: COLOR_HEX.BORDER,
                      }
                }
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-5 border-t" style={{ borderColor: COLOR_HEX.BORDER }}>
        <button
          type="button"
          disabled={!selectedTime}
          onClick={() => selectedTime && onBooked(selectedTime)}
          className="w-full py-3 rounded-3xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
        >
          <CheckCircle size={16} />
          Xác nhận đặt lịch
        </button>
      </div>
    </div>
  );
}

export function PatientMedicalRecords() {
  const { medicalRecords, addAppointment } = usePatient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [followUpRecord, setFollowUpRecord] = useState<PatientMedicalRecord | null>(null);
  const [followUpBookingDate, setFollowUpBookingDate] = useState<string>('');
  const [bookedFollowUps, setBookedFollowUps] = useState<Map<number, BookedInfo>>(new Map());

  const today = todayIso();

  const availableYears = Array.from(
    new Set(medicalRecords.map((r) => new Date(r.date).getFullYear())),
  ).sort((a, b) => b - a);

  const filtered = medicalRecords
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.diagnosis.toLowerCase().includes(q) ||
        r.doctorName.toLowerCase().includes(q) ||
        r.clinicName.toLowerCase().includes(q) ||
        r.specialty.toLowerCase().includes(q)
      );
    })
    .filter((r) => filterMonth == null || new Date(r.date).getMonth() + 1 === filterMonth)
    .filter((r) => filterYear == null || new Date(r.date).getFullYear() === filterYear);

  const selectedRecord = medicalRecords.find((r) => r.id === selectedId) ?? null;

  const handleSelect = (record: PatientMedicalRecord) => {
    setSelectedId((prev) => (prev === record.id ? null : record.id));
    setFollowUpRecord(null);
  };

  const handleBookFollowUp = (record: PatientMedicalRecord) => {
    const effectiveDate = record.followUpDate < today ? today : record.followUpDate;
    setFollowUpRecord(record);
    setFollowUpBookingDate(effectiveDate);
    setSelectedId(null);
  };

  const handleConfirmFollowUp = (time: string) => {
    if (!followUpRecord) return;
    const { code } = addAppointment({
      specialty: followUpRecord.specialty,
      doctorName: followUpRecord.doctorName,
      clinicName: followUpRecord.clinicName,
      date: followUpBookingDate,
      time,
      notes: `Tái khám từ hồ sơ ngày ${formatDate(followUpRecord.date)}`,
    });
    setBookedFollowUps((prev) => new Map(prev).set(followUpRecord.id, { date: followUpBookingDate, time }));
    toast.success(`Đặt lịch tái khám thành công — Mã hẹn ${code}`);
    setFollowUpRecord(null);
  };

  const isPastDate = followUpRecord ? followUpRecord.followUpDate < today : false;

  const rightPanel = followUpRecord ? (
    <FollowUpBookingPanel
      record={followUpRecord}
      bookingDate={followUpBookingDate}
      isPastDate={isPastDate}
      onClose={() => setFollowUpRecord(null)}
      onBooked={handleConfirmFollowUp}
    />
  ) : selectedRecord ? (
    <DetailPanel
      record={selectedRecord}
      booked={bookedFollowUps.get(selectedRecord.id) ?? null}
      onClose={() => setSelectedId(null)}
      onBookFollowUp={handleBookFollowUp}
    />
  ) : null;

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      <div className="flex-shrink-0 mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: COLORS.TEXT_SECONDARY }}
          />
          <input
            type="text"
            placeholder="Tìm theo chẩn đoán, bác sĩ, chuyên khoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={inputClassName + ' pl-10'}
          />
        </div>

        <select
          value={filterMonth ?? ''}
          onChange={(e) => setFilterMonth(e.target.value ? Number(e.target.value) : null)}
          className={selectClassName}
          style={{
            borderColor: filterMonth ? COLOR_HEX.BUTTON_CHOSEN : COLOR_HEX.BORDER,
            color: filterMonth ? COLOR_HEX.BUTTON_CHOSEN : COLORS.TEXT_SECONDARY,
            backgroundColor: COLOR_HEX.WHITE,
          }}
        >
          <option value="">Tất cả tháng</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              Tháng {m}
            </option>
          ))}
        </select>

        <select
          value={filterYear ?? ''}
          onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
          className={selectClassName}
          style={{
            borderColor: filterYear ? COLOR_HEX.BUTTON_CHOSEN : COLOR_HEX.BORDER,
            color: filterYear ? COLOR_HEX.BUTTON_CHOSEN : COLORS.TEXT_SECONDARY,
            backgroundColor: COLOR_HEX.WHITE,
          }}
        >
          <option value="">Tất cả năm</option>
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-h-0 flex gap-4 overflow-hidden">
        <div
          className="flex flex-col min-h-0 bg-white rounded-3xl p-5 transition-all duration-300 overflow-hidden"
          style={{ flex: rightPanel ? '0 0 55%' : '1 1 100%' }}
        >
          <p className="text-xl font-semibold mb-4 flex-shrink-0" style={{ color: COLORS.TEXT_PRIMARY }}>
            Lịch sử khám ({filtered.length} bản ghi)
          </p>

          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                Chưa có hồ sơ khám bệnh
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
              {filtered.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  selected={selectedId === record.id}
                  booked={bookedFollowUps.get(record.id) ?? null}
                  onClick={() => handleSelect(record)}
                  onBookFollowUp={handleBookFollowUp}
                />
              ))}
            </div>
          )}
        </div>

        {rightPanel && (
          <div className="flex-1 min-h-0 overflow-hidden">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
}

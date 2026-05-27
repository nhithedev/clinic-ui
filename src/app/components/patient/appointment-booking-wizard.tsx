import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import {
  usePatient,
  SPECIALTIES,
  MOCK_DOCTORS,
  TIME_SLOTS,
} from '../patient-context';

const STEPS = ['specialty', 'doctor', 'datetime', 'previsit', 'confirm', 'success'] as const;
type Step = (typeof STEPS)[number];

interface AppointmentBookingWizardProps {
  onDone: () => void;
  compact?: boolean;
}

const inputClassName =
  'w-full px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]';

export function AppointmentBookingWizard({ onDone, compact = false }: AppointmentBookingWizardProps) {
  const { addAppointment, bookingPrefill, setBookingPrefill } = usePatient();
  const [step, setStep] = useState<Step>('specialty');
  const [symptomInput, setSymptomInput] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preVisitNotes, setPreVisitNotes] = useState('');
  const [skipPreVisit, setSkipPreVisit] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState('');

  useEffect(() => {
    if (bookingPrefill?.specialty) {
      setSpecialty(bookingPrefill.specialty);
      setStep('doctor');
      setBookingPrefill(null);
    }
  }, [bookingPrefill, setBookingPrefill]);

  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
  const filteredDoctors = MOCK_DOCTORS.filter((d) => !specialty || d.specialty === specialty);

  const suggestSpecialty = () => {
    if (!symptomInput.trim()) {
      toast.error('Vui lòng nhập triệu chứng');
      return;
    }
    setSpecialty('Tim mạch');
    toast.success('AI gợi ý: Tim mạch');
  };

  const confirmBooking = () => {
    if (!doctor || !date || !time) return;
    const { code } = addAppointment({
      specialty,
      doctorName: doctor.name,
      clinicName: 'Phòng khám trung tâm',
      date,
      time,
      notes: preVisitNotes,
      pendingDoctorReply: true,
    });
    setAppointmentCode(code);
    setStep('success');
    toast.success('Đặt lịch thành công');
  };

  const todayIso = new Date().toISOString().split('T')[0];
  const stepIndex = STEPS.indexOf(step);

  const BackButton = ({ target }: { target: Step }) => (
    <button
      type="button"
      onClick={() => setStep(target)}
      className="absolute left-5 top-5 w-10 h-10 rounded-3xl border flex items-center justify-center"
      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
      aria-label="Quay lại"
    >
      <ArrowLeft size={18} />
    </button>
  );

  return (
    <div className={`space-y-4 ${compact ? '' : 'p-2 max-w-3xl'}`}>
      {step !== 'success' && (
        <div className="flex gap-2 text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
          Bước {stepIndex + 1} / {STEPS.length - 1}
        </div>
      )}

      {step === 'specialty' && (
        <div className="relative rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chọn chuyên khoa
          </h3>
          <div className="rounded-3xl p-4" style={{ backgroundColor: COLORS.GRAY }}>
            <p className="text-sm mb-2" style={{ color: COLORS.TEXT_SECONDARY }}>
              Không chắc chuyên khoa? Nhập triệu chứng để AI gợi ý
            </p>
            <textarea
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              className={inputClassName}
              style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              placeholder="Mô tả triệu chứng..."
              rows={3}
            />
            <button
              type="button"
              onClick={suggestSpecialty}
              className="mt-2 px-4 py-2 rounded-3xl text-white text-sm"
              style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
            >
              Gợi ý chuyên khoa
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(s)}
                className="px-4 py-3 rounded-3xl border-2 text-left text-sm"
                style={{
                  borderColor: specialty === s ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                  backgroundColor: specialty === s ? COLORS.HOVER : COLORS.WHITE,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!specialty}
            onClick={() => setStep('doctor')}
            className="flex items-center gap-2 px-6 py-3 rounded-3xl text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Tiếp tục <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 'doctor' && (
        <div className="relative rounded-3xl p-6 pt-16 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <BackButton target="specialty" />
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chọn bác sĩ — {specialty}
          </h3>
          {filteredDoctors.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDoctorId(d.id)}
              className="w-full p-4 rounded-3xl border-2 text-left"
              style={{
                borderColor: doctorId === d.id ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                backgroundColor: doctorId === d.id ? COLORS.HOVER : COLORS.GRAY,
              }}
            >
              <p className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                {d.name}
              </p>
              <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                {d.exp} · ★ {d.rating}
              </p>
            </button>
          ))}
          <button
            type="button"
            disabled={!doctorId}
            onClick={() => setStep('datetime')}
            className="px-6 py-3 rounded-3xl text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Tiếp tục
          </button>
        </div>
      )}

      {step === 'datetime' && (
        <div className="relative rounded-3xl p-6 pt-16 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <BackButton target="doctor" />
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chọn ngày giờ
          </h3>
          <input
            type="date"
            value={date}
            min={todayIso}
            onChange={(e) => setDate(e.target.value)}
            className={inputClassName}
            style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
          />
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className="px-4 py-2 rounded-3xl border-2 text-sm"
                style={{
                  borderColor: time === t ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                  backgroundColor: time === t ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
                  color: time === t ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!date || !time}
            onClick={() => setStep('previsit')}
            className="px-6 py-3 rounded-3xl text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Tiếp tục
          </button>
        </div>
      )}

      {step === 'previsit' && (
        <div className="relative rounded-3xl p-6 pt-16 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <BackButton target="datetime" />
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Phiếu khám trước (tùy chọn)
          </h3>
          {!skipPreVisit && (
            <>
              <textarea
                value={preVisitNotes}
                onChange={(e) => setPreVisitNotes(e.target.value)}
                className={`${inputClassName} min-h-[100px]`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                placeholder="Tiền sử, thuốc đang dùng..."
              />
              <label
                className="flex items-center justify-center rounded-3xl border border-dashed px-4 py-4 text-sm cursor-pointer"
                style={{ borderColor: COLORS.BUTTON_CHOSEN, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.HOVER }}
              >
                <input type="file" className="sr-only" />
                Upload kết quả xét nghiệm (mock)
              </label>
            </>
          )}
          <button
            type="button"
            onClick={() => setSkipPreVisit(!skipPreVisit)}
            className="text-sm underline"
            style={{ color: COLORS.BUTTON_CHOSEN }}
          >
            {skipPreVisit ? 'Điền phiếu khám' : 'Bỏ qua bước này'}
          </button>
          <button
            type="button"
            onClick={() => setStep('confirm')}
            className="px-6 py-3 rounded-3xl text-white"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Xem tóm tắt
          </button>
        </div>
      )}

      {step === 'confirm' && doctor && (
        <div className="relative rounded-3xl p-6 pt-16 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <BackButton target="previsit" />
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Xác nhận đặt lịch
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt style={{ color: COLORS.TEXT_SECONDARY }}>Chuyên khoa</dt>
              <dd style={{ color: COLORS.TEXT_PRIMARY }}>{specialty}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt style={{ color: COLORS.TEXT_SECONDARY }}>Bác sĩ</dt>
              <dd style={{ color: COLORS.TEXT_PRIMARY }}>{doctor.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt style={{ color: COLORS.TEXT_SECONDARY }}>Thời gian</dt>
              <dd style={{ color: COLORS.TEXT_PRIMARY }}>
                {date} {time}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={confirmBooking}
            className="flex items-center gap-2 px-6 py-3 rounded-3xl text-white"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            <Check size={18} /> Xác nhận
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="rounded-3xl p-8 text-center space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <QrCode size={64} className="mx-auto" style={{ color: COLORS.BUTTON_CHOSEN }} />
          <h3 className="text-xl font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Đặt lịch thành công
          </h3>
          <p style={{ color: COLORS.TEXT_SECONDARY }}>Mã hẹn: {appointmentCode}</p>
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Vui lòng có mặt trước 15 phút. Mang theo CMND và kết quả XN nếu có.
          </p>
          <button
            type="button"
            onClick={onDone}
            className="px-6 py-3 rounded-3xl text-white"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Hoàn tất
          </button>
        </div>
      )}
    </div>
  );
}
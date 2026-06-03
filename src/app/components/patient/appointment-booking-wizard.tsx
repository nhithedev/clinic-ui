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
  const [consultForm, setConsultForm] = useState({
    symptoms: '',
    medicalHistory: '',
    extraInfo: '',
  });
  const [specialty, setSpecialty] = useState('');
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preVisitNotes, setPreVisitNotes] = useState('');
  const [skipPreVisit, setSkipPreVisit] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState('');
  const [suggestedFields, setSuggestedFields] = useState<Record<string, boolean>>({
    symptoms: false,
    medicalHistory: false,
    extraInfo: false,
  });

  useEffect(() => {
    if (bookingPrefill?.specialty) {
      setSpecialty(bookingPrefill.specialty);
      setStep('doctor');
      setBookingPrefill(null);
    }
  }, [bookingPrefill, setBookingPrefill]);

  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
  const filteredDoctors = MOCK_DOCTORS.filter((d) => !specialty || d.specialty === specialty);

  const submitConsultForm = () => {
    if (!consultForm.symptoms.trim()) {
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
  const progressSteps = STEPS.length - 1;
  const progressValue = step === 'success' ? progressSteps : Math.min(stepIndex + 1, progressSteps);

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
        <div className="space-y-2">
          <div className="flex gap-2 text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
            Bước {stepIndex + 1} / {progressSteps}
          </div>
          <div
            className="h-2 rounded-full border overflow-hidden"
            style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(progressValue / progressSteps) * 100}%`,
                backgroundColor: COLORS.BUTTON_CHOSEN,
              }}
            />
          </div>
        </div>
      )}

      {step === 'specialty' && (
        <div className="relative rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chọn chuyên khoa (nếu không rõ, điền triệu chứng để được AI gợi ý)
          </h3>
          <div
            className="rounded-3xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ backgroundColor: COLORS.GRAY }}
          >
            <div>
              <textarea
                value={consultForm.symptoms}
                onChange={(e) => {
                  setSuggestedFields((prev) => ({ ...prev, symptoms: false }));
                  setConsultForm((prev) => ({ ...prev, symptoms: e.target.value }));
                }}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: suggestedFields.symptoms ? COLORS.HOVER : COLORS.WHITE }}
                placeholder="Mô tả triệu chứng chính, thời điểm bắt đầu và mức độ khó chịu"
                rows={3}
              />
              <div className="mt-2 overflow-x-auto">
                <div className="flex gap-2 whitespace-nowrap pb-1">
                  {[
                    'Đau đầu âm ỉ từ sáng nay',
                    'Ho và đau họng khoảng 2 ngày',
                    'Đau bụng từng cơn sau khi ăn',
                    'Tức ngực nhẹ khi vận động',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setConsultForm((prev) => ({ ...prev, symptoms: prev.symptoms ? `${prev.symptoms}\n${s}` : s }));
                        setSuggestedFields((prev) => ({ ...prev, symptoms: true }));
                      }}
                      className="shrink-0 px-3 py-1.5 rounded-3xl border text-xs whitespace-nowrap transition-colors hover:bg-[var(--color-hover)]"
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, backgroundColor: COLORS.WHITE }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <input
                value={consultForm.medicalHistory}
                onChange={(e) => {
                  setSuggestedFields((prev) => ({ ...prev, medicalHistory: false }));
                  setConsultForm((prev) => ({ ...prev, medicalHistory: e.target.value }));
                }}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: suggestedFields.medicalHistory ? COLORS.HOVER : COLORS.WHITE }}
                placeholder="Tiền sử bệnh, dị ứng thuốc hoặc bệnh đang điều trị"
              />
              <div className="mt-2 overflow-x-auto">
                <div className="flex gap-2 whitespace-nowrap pb-1">
                  {[
                    'Không có tiền sử bệnh đáng chú ý',
                    'Có tiền sử dị ứng thuốc',
                    'Đang điều trị huyết áp',
                    'Có bệnh nền cần lưu ý',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setConsultForm((prev) => ({ ...prev, medicalHistory: s }));
                        setSuggestedFields((prev) => ({ ...prev, medicalHistory: true }));
                      }}
                      className="shrink-0 px-3 py-1.5 rounded-3xl border text-xs whitespace-nowrap transition-colors hover:bg-[var(--color-hover)]"
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, backgroundColor: COLORS.WHITE }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <textarea
                value={consultForm.extraInfo}
                onChange={(e) => {
                  setSuggestedFields((prev) => ({ ...prev, extraInfo: false }));
                  setConsultForm((prev) => ({ ...prev, extraInfo: e.target.value }));
                }}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: suggestedFields.extraInfo ? COLORS.HOVER : COLORS.WHITE }}
                placeholder="Thông tin bổ sung như thuốc đã dùng, nhiệt độ, kết quả đo gần đây"
                rows={3}
              />
              <div className="mt-2 overflow-x-auto">
                <div className="flex gap-2 whitespace-nowrap pb-1">
                  {[
                    'Tôi chưa dùng thuốc gì',
                    'Tôi đã uống thuốc hạ sốt',
                    'Triệu chứng nặng hơn vào buổi tối',
                    'Tôi muốn được bác sĩ kiểm tra kỹ',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setConsultForm((prev) => ({ ...prev, extraInfo: prev.extraInfo ? `${prev.extraInfo}\n${s}` : s }));
                        setSuggestedFields((prev) => ({ ...prev, extraInfo: true }));
                      }}
                      className="shrink-0 px-3 py-1.5 rounded-3xl border text-xs whitespace-nowrap transition-colors hover:bg-[var(--color-hover)]"
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, backgroundColor: COLORS.WHITE }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="button" onClick={submitConsultForm} className="px-6 py-3 rounded-3xl text-white transition-colors hover:opacity-90 hover:shadow-sm" style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}>
              Gửi
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(s)}
                className="px-4 py-3 rounded-3xl border-2 text-left text-sm transition-colors hover:bg-[var(--color-hover)]"
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
            className="flex items-center gap-2 px-6 py-3 rounded-3xl text-white disabled:opacity-50 transition-colors hover:opacity-90 hover:shadow-sm"
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
              className="w-full p-4 rounded-3xl border-2 text-left transition-colors hover:bg-[var(--color-hover)]"
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
            className="px-6 py-3 rounded-3xl text-white disabled:opacity-50 transition-colors hover:opacity-90 hover:shadow-sm"
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
                className="px-4 py-2 rounded-3xl border-2 text-sm transition-colors hover:bg-[var(--color-hover)]"
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
            className="px-6 py-3 rounded-3xl text-white disabled:opacity-50 transition-colors hover:opacity-90 hover:shadow-sm"
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
                className="flex items-center justify-center rounded-3xl border border-dashed px-4 py-4 text-sm cursor-pointer transition-colors hover:bg-[var(--color-hover)]"
                style={{ borderColor: COLORS.BUTTON_CHOSEN, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.HOVER }}
              >
                <input type="file" className="sr-only" />
                Upload kết quả xét nghiệm
              </label>
            </>
          )}
          <button
            type="button"
            onClick={() => setSkipPreVisit(!skipPreVisit)}
            className="text-sm underline transition-colors hover:text-[var(--color-button-chosen)]"
            style={{ color: COLORS.BUTTON_CHOSEN }}
          >
            {skipPreVisit ? 'Điền phiếu khám' : 'Bỏ qua bước này'}
          </button>
          <button
            type="button"
            onClick={() => setStep('confirm')}
            className="px-6 py-3 rounded-3xl text-white transition-colors hover:opacity-90 hover:shadow-sm"
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
            className="flex items-center gap-2 px-6 py-3 rounded-3xl text-white transition-colors hover:opacity-90 hover:shadow-sm"
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
            className="px-6 py-3 rounded-3xl text-white transition-colors hover:opacity-90 hover:shadow-sm"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Hoàn tất
          </button>
        </div>
      )}
    </div>
  );
}
import { useMemo, useState } from 'react';
import { Plus, Save, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import {
  MOCK_DOCTORS,
  PatientChatMessage,
  SPECIALTIES,
  TIME_SLOTS,
  ConsultationLevel,
  usePatient,
} from '../patient-context';

type ChatMode =
  | 'pre-chat'
  | 'consult-form'
  | 'post-advice'
  | 'free-chat'
  | 'booking-form'
  | 'booking-confirm'
  | 'booking-no-doctor';

interface ConsultationForm {
  symptoms: string;
  medicalHistory: string;
  extraInfo: string;
}

interface BookingSlot {
  date: string;
  time: string;
}

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  specialty: string;
  slots: BookingSlot[];
  notes: string;
}

const initialBotMessage: PatientChatMessage = {
  role: 'bot',
  content:
    'Xin chào, tôi là trợ lý tư vấn sức khỏe của phòng khám. Bạn có thể mô tả triệu chứng như đang chat với bác sĩ, hoặc chọn nhanh nhu cầu bên dưới.',
};


const inputClassName =
  'w-full px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]';

function suggestSpecialty(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('ngực') || lower.includes('tim') || lower.includes('khó thở')) return 'Tim mạch';
  if (lower.includes('da') || lower.includes('ngứa') || lower.includes('mẩn')) return 'Da liễu';
  if (lower.includes('tai') || lower.includes('mũi') || lower.includes('họng')) return 'Tai Mũi Họng';
  if (lower.includes('trẻ') || lower.includes('bé') || lower.includes('con tôi')) return 'Nhi khoa';
  return 'Nội khoa';
}

function assessLevel(text: string): ConsultationLevel {
  const lower = text.toLowerCase();
  if (
    lower.includes('đau ngực') ||
    lower.includes('khó thở') ||
    lower.includes('ngất') ||
    lower.includes('co giật') ||
    lower.includes('liệt') ||
    lower.includes('nôn ra máu')
  ) {
    return 'urgent';
  }
  if (
    lower.includes('nhẹ') ||
    lower.includes('mệt') ||
    lower.includes('đau đầu') ||
    lower.includes('sổ mũi')
  ) {
    return 'mild';
  }
  return 'moderate';
}

function buildAdvice(level: ConsultationLevel, symptoms: string, specialty: string) {
  if (level === 'urgent') {
    return `Tình trạng này rất nguy hiểm, bạn nên đi khám ngay. Với mô tả "${symptoms}", hệ thống ưu tiên gợi ý chuyên khoa ${specialty}. Nếu có đau ngực dữ dội, khó thở, ngất, yếu liệt hoặc triệu chứng tăng nhanh, bạn nên đến cơ sở y tế gần nhất thay vì chờ theo dõi tại nhà.`;
  }

  return `Tôi hiểu rồi. Triệu chứng "${symptoms}" có thể xuất phát từ nhiều nguyên nhân như thay đổi sinh hoạt, căng thẳng, nhiễm siêu vi, phản ứng viêm hoặc một vấn đề cần được bác sĩ kiểm tra kỹ hơn. Để giảm bớt tình trạng này, bạn có thể nghỉ ngơi, uống đủ nước, theo dõi nhiệt độ cơ thể, tránh tự ý dùng thuốc khi chưa rõ nguyên nhân và ghi lại thời điểm triệu chứng xuất hiện. Ngoài ra, đây có thể là dấu hiệu liên quan đến nhóm bệnh thuộc chuyên khoa ${specialty}. Bạn có thể đặt lịch khám tại phòng khám để được kiểm tra rõ hơn.`;
}

function formatConsultationForm(form: ConsultationForm) {
  return [
    `Triệu chứng: ${form.symptoms}`,
    form.medicalHistory ? `Tiền sử bệnh: ${form.medicalHistory}` : '',
    form.extraInfo ? `Thông tin bổ sung: ${form.extraInfo}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function formatBookingForm(form: BookingForm) {
  return [
    'Thông tin đặt lịch:',
    `Họ tên: ${form.name}`,
    `SĐT: ${form.phone}`,
    `Email: ${form.email}`,
    `Chuyên khoa: ${form.specialty}`,
    `Lịch mong muốn: ${form.slots
      .filter((slot) => slot.date || slot.time)
      .map((slot) => `${slot.date || 'Chưa chọn ngày'} ${slot.time || 'Chưa chọn giờ'}`)
      .join(', ')}`,
    form.notes ? `Thông tin bổ sung: ${form.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function SymptomConsultation() {
  const { profile, addAppointment, addConsultation } = usePatient();
  const [messages, setMessages] = useState<PatientChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('pre-chat');
  const [lastLevel, setLastLevel] = useState<ConsultationLevel>('moderate');
  const [suggestedSpecialty, setSuggestedSpecialty] = useState('Nội khoa');
  const [noMoreBookingPrompt, setNoMoreBookingPrompt] = useState(false);
  const [consultForm, setConsultForm] = useState<ConsultationForm>({
    symptoms: '',
    medicalHistory: '',
    extraInfo: '',
  });
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    specialty: 'Nội khoa',
    slots: [{ date: '', time: '' }],
    notes: '',
  });

  const selectedDoctor = useMemo(() => {
    const doctors = MOCK_DOCTORS.filter((doctor) => doctor.specialty === bookingForm.specialty);
    return doctors[0] || MOCK_DOCTORS[0];
  }, [bookingForm.specialty]);

  const appendMessages = (...nextMessages: PatientChatMessage[]) => {
    setMessages((prev) => [...prev, ...nextMessages]);
  };

  const startConsultation = (seed?: string) => {
    const nextSymptoms = seed?.trim() || '';
    const nextMessages: PatientChatMessage[] = [
      { role: 'user', content: nextSymptoms || 'Tôi cần tư vấn' },
      {
        role: 'bot',
        content:
          'Tôi đã hiểu, bạn có thể chia sẻ thêm về triệu chứng chính, tiền sử bệnh và thông tin bổ sung để tôi nắm rõ hơn được không?',
      },
    ];
    setConsultForm((prev) => ({ ...prev, symptoms: nextSymptoms }));
    appendMessages(...nextMessages);
    setInput('');
    setMode('consult-form');
  };

  const startBooking = (specialty = suggestedSpecialty, userBubble = 'Tôi cần đặt lịch khám bệnh') => {
    setSuggestedSpecialty(specialty);
    setBookingForm((prev) => ({
      ...prev,
      specialty,
      slots: prev.slots.length > 0 ? prev.slots : [{ date: '', time: '' }],
    }));
    appendMessages(
      { role: 'user', content: userBubble },
      {
        role: 'bot',
        content: `Tôi đã hiểu. Với tình trạng của bạn, tôi thấy nên đến gặp bác sĩ về ${specialty}. Bạn có thể cung cấp thêm thông tin vào form dưới đây để được hỗ trợ đặt lịch.`,
      },
    );
    setMode('booking-form');
  };

  const handleSendFreeText = () => {
    if (!input.trim()) return;
    const text = input.trim();

    if (mode === 'pre-chat') {
      startConsultation(text);
      return;
    }

    const level = assessLevel(text);
    const specialty = suggestSpecialty(text);
    const botMessage =
      level === 'urgent'
        ? buildAdvice(level, text, specialty)
        : noMoreBookingPrompt
          ? `Tôi hiểu rồi. Với mô tả "${text}", bạn nên theo dõi thêm các dấu hiệu đi kèm, nghỉ ngơi, uống đủ nước và đi khám nếu triệu chứng kéo dài hoặc nặng hơn.`
          : buildAdvice(level, text, specialty);

    setInput('');
    setLastLevel(level);
    setSuggestedSpecialty(specialty);
    appendMessages(
      { role: 'user', content: text },
      { role: 'bot', content: botMessage },
    );

    if (level === 'urgent' || !noMoreBookingPrompt) {
      setMode('post-advice');
    } else {
      setMode('free-chat');
    }
  };

  const submitConsultForm = () => {
    if (!consultForm.symptoms.trim()) {
      toast.error('Vui lòng nhập triệu chứng');
      return;
    }

    const combined = [
      consultForm.symptoms,
      consultForm.medicalHistory,
      consultForm.extraInfo,
    ].join(' ');
    const level = assessLevel(combined);
    const specialty = suggestSpecialty(combined);
    const advice = buildAdvice(level, consultForm.symptoms, specialty);

    const nextMessages: PatientChatMessage[] = [
      { role: 'user', content: formatConsultationForm(consultForm) },
      { role: 'bot', content: advice },
    ];

    const savedMessages = [...messages, ...nextMessages];
    addConsultation({
      date: new Date().toISOString(),
      summary: consultForm.symptoms.slice(0, 120),
      level,
      messages: savedMessages,
    });

    setMessages(savedMessages);
    setLastLevel(level);
    setSuggestedSpecialty(specialty);
    setBookingForm((prev) => ({ ...prev, specialty }));
    setConsultForm({ symptoms: '', medicalHistory: '', extraInfo: '' });
    setMode('post-advice');
  };

  const addBookingSlot = () => {
    setBookingForm((prev) => ({
      ...prev,
      slots: [...prev.slots, { date: '', time: '' }],
    }));
  };

  const updateBookingSlot = (index: number, partial: Partial<BookingSlot>) => {
    setBookingForm((prev) => ({
      ...prev,
      slots: prev.slots.map((slot, i) => (i === index ? { ...slot, ...partial } : slot)),
    }));
  };

  const removeBookingSlot = (index: number) => {
    setBookingForm((prev) => ({
      ...prev,
      slots: prev.slots.length === 1 ? prev.slots : prev.slots.filter((_, i) => i !== index),
    }));
  };

  const submitBookingForm = () => {
    const validSlot = bookingForm.slots.find((slot) => slot.date && slot.time);
    if (!bookingForm.name.trim() || !bookingForm.phone.trim() || !bookingForm.email.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin cá nhân/liên hệ');
      return;
    }
    if (!validSlot) {
      toast.error('Vui lòng chọn ít nhất một ngày và giờ khám');
      return;
    }

    const hasDoctor = bookingForm.slots.some((slot) => slot.time !== '16:00');
    const userMessage: PatientChatMessage = {
      role: 'user',
      content: formatBookingForm(bookingForm),
    };

    if (!hasDoctor) {
      appendMessages(userMessage, {
        role: 'bot',
        content:
          'Với lịch trình của bạn, hệ thống chưa sắp xếp được bác sĩ. Bạn có muốn đổi ca không?',
      });
      setMode('booking-no-doctor');
      return;
    }

    appendMessages(userMessage, {
      role: 'bot',
      content: `Với lịch trình của bạn, hệ thống đã sắp xếp được bác sĩ ${selectedDoctor.name}. Bạn có muốn đặt lịch khám không?`,
    });
    setMode('booking-confirm');
  };

  const confirmBooking = () => {
    const validSlot = bookingForm.slots.find((slot) => slot.date && slot.time);
    if (!validSlot) return;

    const { code } = addAppointment({
      specialty: bookingForm.specialty,
      doctorName: selectedDoctor.name,
      clinicName: 'Phòng khám trung tâm',
      date: validSlot.date,
      time: validSlot.time,
      contactName: bookingForm.name,
      contactPhone: bookingForm.phone,
      contactEmail: bookingForm.email,
      notes: bookingForm.notes,
      pendingDoctorReply: true,
    });

    appendMessages(
      { role: 'user', content: 'Có, tôi xác nhận đặt lịch khám' },
      {
        role: 'bot',
        content: `Hệ thống đã đặt lịch khám cho bạn. Mã hẹn ${code}. Vui lòng có mặt trước 15 phút, mang theo giấy tờ tùy thân và kết quả xét nghiệm nếu có. Lịch khám đã gửi đến bác sĩ, khi có phản hồi hệ thống sẽ gửi mail cho bạn. Bạn cần tư vấn thêm gì không?`,
      },
    );
    setBookingForm({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      specialty: suggestedSpecialty,
      slots: [{ date: '', time: '' }],
      notes: '',
    });
    setNoMoreBookingPrompt(false);
    setMode('free-chat');
  };

  const cancelBookingForm = () => {
    appendMessages(
      { role: 'user', content: 'Hủy form đặt lịch' },
      {
        role: 'bot',
        content: 'Tôi đã hủy form đặt lịch. Bạn có thể tiếp tục nhập nội dung cần tư vấn bất cứ lúc nào.',
      },
    );
    setMode('free-chat');
  };

  const handleChoice = (choice: 'book' | 'more' | 'no') => {
    if (choice === 'book') {
      startBooking(suggestedSpecialty, 'Có, đặt lịch khám');
      return;
    }

    if (choice === 'more') {
      if (lastLevel === 'urgent') {
        appendMessages(
          { role: 'user', content: 'Muốn tư vấn thêm' },
          {
            role: 'bot',
            content:
              'Tôi vẫn cần nhấn mạnh rằng dấu hiệu này có thể nguy cấp, bạn nên đi khám ngay. Nếu bạn muốn mô tả thêm, hãy nhập triệu chứng hoặc thông tin mới bên dưới.',
          },
        );
        setNoMoreBookingPrompt(false);
      } else {
        appendMessages(
          { role: 'user', content: 'Muốn tư vấn thêm' },
          {
            role: 'bot',
            content: 'Bạn có thể mô tả thêm triệu chứng, thời gian xuất hiện, mức độ đau hoặc thuốc đã dùng.',
          },
        );
      }
      setMode('free-chat');
      return;
    }

    appendMessages(
      { role: 'user', content: 'Không, cảm ơn' },
      {
        role: 'bot',
        content: 'Không sao. Nếu bạn cần hỏi thêm, hãy nhập nội dung mới bên dưới.',
      },
    );
    setNoMoreBookingPrompt(true);
    setMode('free-chat');
  };
const saveCurrentConversation = () => {
  const userMessages = messages.filter((message) => message.role === 'user');

  if (userMessages.length === 0) {
    toast.error('Chưa có nội dung trò chuyện để lưu');
    return;
  }

  const combinedText = messages.map((message) => message.content).join(' ');
  const level = assessLevel(combinedText);
  const summary =
    userMessages[userMessages.length - 1]?.content.slice(0, 120) ||
    'Cuộc trò chuyện tư vấn sức khỏe';

  addConsultation({
    date: new Date().toISOString(),
    summary,
    level,
    messages,
  });

  toast.success('Đã lưu lịch sử trò chuyện');
};

  return (
    <div className="h-full min-h-0 flex flex-col" style={{ backgroundColor: COLORS.GRAY }}>
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[78%] px-5 py-4 rounded-3xl text-sm leading-6 whitespace-pre-line"
                style={{
                  backgroundColor: msg.role === 'user' ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
                  color: msg.role === 'user' ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {mode === 'pre-chat' && (
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => startBooking('Nội khoa')}
                className="px-5 py-3 rounded-3xl text-sm text-white"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              >
                Tôi cần đặt lịch khám bệnh
              </button>
              <button
                type="button"
                onClick={() => startConsultation()}
                className="px-5 py-3 rounded-3xl border text-sm"
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Tôi cần tư vấn
              </button>
            </div>
          )}

          {mode === 'consult-form' && (
            <div className="rounded-3xl p-5 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
              <textarea
                value={consultForm.symptoms}
                onChange={(e) => setConsultForm((prev) => ({ ...prev, symptoms: e.target.value }))}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                placeholder="Triệu chứng (bắt buộc)"
                rows={3}
              />
              <input
                value={consultForm.medicalHistory}
                onChange={(e) =>
                  setConsultForm((prev) => ({ ...prev, medicalHistory: e.target.value }))
                }
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                placeholder="Tiền sử bệnh"
              />
              <textarea
                value={consultForm.extraInfo}
                onChange={(e) => setConsultForm((prev) => ({ ...prev, extraInfo: e.target.value }))}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                placeholder="Thông tin bổ sung"
                rows={3}
              />
              <button
                type="button"
                onClick={submitConsultForm}
                className="px-6 py-3 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              >
                Gửi
              </button>
            </div>
          )}

          {mode === 'post-advice' && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleChoice('book')}
                className="px-5 py-3 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              >
                Có, đặt lịch khám
              </button>
              <button
                type="button"
                onClick={() => handleChoice('more')}
                className="px-5 py-3 rounded-3xl border text-sm"
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Muốn tư vấn thêm
              </button>
              <button
                type="button"
                onClick={() => handleChoice('no')}
                className="px-5 py-3 rounded-3xl border text-sm"
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Không, cảm ơn
              </button>
            </div>
          )}

          {mode === 'booking-form' && (
            <div className="rounded-3xl p-5 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={inputClassName}
                  style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                  placeholder="Họ tên"
                />
                <input
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className={inputClassName}
                  style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                  placeholder="Số điện thoại"
                />
                <input
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputClassName}
                  style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                  placeholder="Email"
                />
              </div>
              <select
                value={bookingForm.specialty}
                onChange={(e) => setBookingForm((prev) => ({ ...prev, specialty: e.target.value }))}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                {SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                    Chọn lịch khám
                  </p>
                  <button
                    type="button"
                    onClick={addBookingSlot}
                    className="w-9 h-9 rounded-3xl flex items-center justify-center text-white"
                    style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {bookingForm.slots.map((slot, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <input
                      type="date"
                      value={slot.date}
                      onChange={(e) => updateBookingSlot(index, { date: e.target.value })}
                      className={inputClassName}
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                    />
                    <select
                      value={slot.time}
                      onChange={(e) => updateBookingSlot(index, { time: e.target.value })}
                      className={inputClassName}
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                    >
                      <option value="">Giờ khám</option>
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeBookingSlot(index)}
                      className="w-11 h-11 rounded-3xl border flex items-center justify-center"
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <textarea
                value={bookingForm.notes}
                onChange={(e) => setBookingForm((prev) => ({ ...prev, notes: e.target.value }))}
                className={inputClassName}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
                placeholder="Thông tin bổ sung"
                rows={3}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitBookingForm}
                  className="px-6 py-3 rounded-3xl text-white text-sm"
                  style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                >
                  Nộp
                </button>
                <button
                  type="button"
                  onClick={cancelBookingForm}
                  className="px-6 py-3 rounded-3xl border text-sm"
                  style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {mode === 'booking-confirm' && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={confirmBooking}
                className="px-5 py-3 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              >
                Có
              </button>
              <button
                type="button"
                onClick={() => {
                  appendMessages(
                    { role: 'user', content: 'Không đặt lịch nữa' },
                    {
                      role: 'bot',
                      content: 'Không sao. Bạn có thể tiếp tục nhập nội dung cần tư vấn bên dưới.',
                    },
                  );
                  setMode('free-chat');
                }}
                className="px-5 py-3 rounded-3xl border text-sm"
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Không
              </button>
            </div>
          )}

          {mode === 'booking-no-doctor' && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  appendMessages({ role: 'user', content: 'Có, tôi muốn đổi ca' });
                  setMode('booking-form');
                }}
                className="px-5 py-3 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              >
                Có
              </button>
              <button
                type="button"
                onClick={() => {
                  appendMessages(
                    { role: 'user', content: 'Không đổi ca' },
                    {
                      role: 'bot',
                      content: 'Không sao. Bạn có thể tiếp tục nhập nội dung cần tư vấn bên dưới.',
                    },
                  );
                  setMode('free-chat');
                }}
                className="px-5 py-3 rounded-3xl border text-sm"
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Không
              </button>
            </div>
          )}
        </div>
      </div>

      {mode !== 'consult-form' && mode !== 'booking-form' && (
  <div className="px-6 pb-6">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-end gap-2">
        <div
          className="flex-1 flex gap-2 rounded-3xl p-2 border"
          style={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.WHITE }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendFreeText()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-3 rounded-3xl border-0 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]"
            style={{ color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
          />
          <button
            type="button"
            onClick={handleSendFreeText}
            aria-label="Gửi tin nhắn"
            className="w-12 h-12 rounded-3xl flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            <Send size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={saveCurrentConversation}
          aria-label="Lưu lịch sử trò chuyện"
          title="Lưu lịch sử trò chuyện"
          className="w-12 h-12 rounded-3xl flex items-center justify-center text-white flex-shrink-0 -translate-y-2"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          <Save size={20} />
        </button>
      </div>

      <p className="mt-2 px-2 text-xs leading-5" style={{ color: COLORS.TEXT_SECONDARY }}>
        Lưu ý: Ngoài trường hợp Tư vấn - Khai triệu chứng, trò chuyện không tự lưu.
        Nếu muốn giữ lại nội dung trò chuyện cũ, bạn cần bấm nút lưu lịch sử trò chuyện.
      </p>
    </div>
  </div>
)}
    </div>
  );
}
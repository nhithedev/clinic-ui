import { useMemo, useState, useEffect } from 'react';
import {
  Bot,
  Mic,
  Plus,
  Save,
  Send,
  Sparkles,
  Stethoscope,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
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
  | 'quick-actions'
  | 'consult-form'
  | 'post-advice'
  | 'free-chat'
  | 'booking-form'
  | 'doctor-selection'
  | 'booking-confirm'
  | 'booking-no-doctor';

type ConsultationIntent = 'general' | 'booking';

interface SymptomConsultationProps {
  onNavigate?: (page: string) => void;
}

interface ConsultationForm {
  name: string;
  phone: string;
  email: string;
  gender: string;
  address: string;
  birthDate: string;
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
    'Xin chào, tôi là trợ lý tư vấn sức khỏe của phòng khám. Bạn có thể chọn nhanh nhu cầu bên dưới để bắt đầu.',
};

const inputClassName =
  'w-full px-4 py-2.5 rounded-3xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)] hover:border-[var(--color-button-chosen)]';

const primaryButtonClassName =
  'rounded-3xl bg-[var(--color-button-chosen)] text-white text-sm transition-all duration-200 hover:bg-[var(--color-text-primary)] hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

const ghostButtonClassName =
  'rounded-3xl border text-sm transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)] hover:-translate-y-0 hover:shadow-sm active:translate-y-0 active:scale-[0.98]';

const suggestionButtonClassName =
  'shrink-0 px-3 py-1.5 rounded-3xl border text-xs whitespace-nowrap transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)] active:translate-y-0 active:scale-[0.98]';

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
    return [
      'Tình trạng này rất nguy hiểm, bạn nên đi khám ngay.',
      '',
      `Với mô tả "${symptoms}", hệ thống ưu tiên gợi ý chuyên khoa ${specialty}.`,
      '',
      'Nếu có đau ngực dữ dội, khó thở, ngất, yếu liệt hoặc triệu chứng tăng nhanh, bạn nên đến cơ sở y tế gần nhất thay vì chờ theo dõi tại nhà.',
    ].join('\n');
  }

  return [
    `Tôi hiểu rồi. Triệu chứng "${symptoms}" có thể xuất phát từ nhiều nguyên nhân như thay đổi sinh hoạt, căng thẳng, nhiễm siêu vi, phản ứng viêm hoặc một vấn đề cần được bác sĩ kiểm tra kỹ hơn.`,
    '',
    'Để giảm bớt tình trạng này, bạn có thể nghỉ ngơi, uống đủ nước, theo dõi nhiệt độ cơ thể, tránh tự ý dùng thuốc khi chưa rõ nguyên nhân và ghi lại thời điểm triệu chứng xuất hiện.',
    '',
    `Ngoài ra, đây có thể là dấu hiệu liên quan đến nhóm bệnh thuộc chuyên khoa ${specialty}. Bạn có thể đặt lịch khám tại phòng khám để được kiểm tra rõ hơn.`,
  ].join('\n');
}

function formatConsultationForm(form: ConsultationForm) {
  return [
    'Thông tin bệnh nhân:',
    `Họ tên: ${form.name}`,
    `SĐT: ${form.phone}`,
    `Email: ${form.email}`,
    form.gender ? `Giới tính: ${form.gender}` : '',
    form.birthDate ? `Ngày sinh: ${form.birthDate}` : '',
    form.address ? `Địa chỉ: ${form.address}` : '',
    '',
    `Triệu chứng: ${form.symptoms}`,
    form.medicalHistory ? `Tiền sử bệnh: ${form.medicalHistory}` : '',
    form.extraInfo ? `Thông tin bổ sung: ${form.extraInfo}` : '',
  ]
    .filter((line) => line !== '')
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

function getDoctorExperience(index: number) {
  return [12, 9, 15, 8, 18, 7][index % 6];
}

function getDoctorTitle(index: number) {
  return ['Thạc sĩ, Bác sĩ chuyên khoa I', 'Bác sĩ chuyên khoa II', 'Tiến sĩ, Bác sĩ trưởng khoa'][
    index % 3
  ];
}

function getDoctorRating(index: number) {
  return ['4.9/5', '4.8/5', '4.7/5'][index % 3];
}

export function SymptomConsultation({}: SymptomConsultationProps) {
  const { profile, addAppointment, addConsultation, addDoctorConsultationRequest } = usePatient();

  const patientProfile = profile as typeof profile & {
    gender?: string;
    address?: string;
    birthDate?: string;
    dob?: string;
    dateOfBirth?: string;
  };

  const [messages, setMessages] = useState<PatientChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('pre-chat');
  const [consultIntent, setConsultIntent] = useState<ConsultationIntent>('general');
  const [suggestedSpecialty, setSuggestedSpecialty] = useState('Nội khoa');
  const [noMoreBookingPrompt, setNoMoreBookingPrompt] = useState(false);
  const [showDoctorConfirm, setShowDoctorConfirm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [inputWasSuggested, setInputWasSuggested] = useState(false);
  const [suggestedFields, setSuggestedFields] = useState<Record<string, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);

  const [consultForm, setConsultForm] = useState<ConsultationForm>({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    gender: patientProfile.gender || '',
    address: patientProfile.address || '',
    birthDate: patientProfile.birthDate || patientProfile.dob || patientProfile.dateOfBirth || '',
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

  const availableDoctors = useMemo(() => {
    const matched = MOCK_DOCTORS.filter((doctor) => doctor.specialty === bookingForm.specialty);
    return matched.length > 0 ? matched : MOCK_DOCTORS;
  }, [bookingForm.specialty]);

  const selectedDoctor = useMemo(() => {
    if (selectedDoctorId === null) return null;
    return MOCK_DOCTORS.find((doctor) => doctor.id === selectedDoctorId) || null;
  }, [selectedDoctorId]);

  useEffect(() => {
    const handleReset = () => {
      setMessages([initialBotMessage]);
      setInput('');
      setMode('pre-chat');
      setConsultIntent('general');
      setSuggestedSpecialty('Nội khoa');
      setNoMoreBookingPrompt(false);
      setShowDoctorConfirm(false);
      setIsTyping(false);
      setSelectedDoctorId(null);
      setInputWasSuggested(false);
      setSuggestedFields({});
      setIsRecording(false);
      setSpeakingMessageIndex(null);
      setConsultForm({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        gender: patientProfile.gender || '',
        address: patientProfile.address || '',
        birthDate: patientProfile.birthDate || patientProfile.dob || patientProfile.dateOfBirth || '',
        symptoms: '',
        medicalHistory: '',
        extraInfo: '',
      });
      setBookingForm({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        specialty: 'Nội khoa',
        slots: [{ date: '', time: '' }],
        notes: '',
      });
    };

    window.addEventListener('reset-consultation', handleReset);
    return () => window.removeEventListener('reset-consultation', handleReset);
  }, [
    profile.name,
    profile.phone,
    profile.email,
    patientProfile.gender,
    patientProfile.address,
    patientProfile.birthDate,
    patientProfile.dob,
    patientProfile.dateOfBirth,
  ]);

  const appendMessages = (...nextMessages: PatientChatMessage[]) => {
    setMessages((prev) => [...prev, ...nextMessages]);
  };

  const appendBotWithTyping = (botMessage: PatientChatMessage, afterReply?: () => void) => {
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      afterReply?.();
    }, 650);
  };

  const appendUserThenBot = (
    userMessage: PatientChatMessage,
    botMessage: PatientChatMessage,
    afterReply?: () => void,
  ) => {
    setMessages((prev) => [...prev, userMessage]);
    appendBotWithTyping(botMessage, afterReply);
  };

  const markFieldSuggested = (field: string) => {
    setSuggestedFields((prev) => ({ ...prev, [field]: true }));
  };

  const clearFieldSuggested = (field: string) => {
    setSuggestedFields((prev) => ({ ...prev, [field]: false }));
  };

  const fieldStyle = (field: string) => ({
    borderColor: suggestedFields[field] ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: suggestedFields[field] ? COLORS.HOVER : COLORS.WHITE,
  });

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);

    if (!isRecording) {
      toast.info('Đang ghi âm');
    } else {
      toast.success('Đã dừng ghi âm');
    }
  };

  const playBotMessage = (index: number) => {
    setSpeakingMessageIndex(index);
    toast.info('Đang phát nội dung tư vấn');

    window.setTimeout(() => {
      setSpeakingMessageIndex(null);
    }, 1300);
  };

  const startConsultation = (
    userBubble = 'Tôi cần tư vấn',
    seedSymptoms = '',
    intent: ConsultationIntent = 'general',
  ) => {
    const nextSymptoms = seedSymptoms.trim();

    setConsultForm((prev) => ({ ...prev, symptoms: nextSymptoms }));
    setConsultIntent(intent);
    setInput('');
    setInputWasSuggested(false);
    setNoMoreBookingPrompt(false);
    setMode('consult-form');

    appendUserThenBot(
      { role: 'user', content: userBubble },
      {
        role: 'bot',
        content:
          'Tôi đã hiểu, bạn có thể chia sẻ thêm về triệu chứng chính, tiền sử bệnh và thông tin bổ sung để tôi nắm rõ hơn được không?',
      },
    );
  };

  const startBooking = (specialty = suggestedSpecialty, userBubble = 'Tôi cần đặt lịch khám bệnh') => {
    setSuggestedSpecialty(specialty);
    setSelectedDoctorId(null);
    setBookingForm((prev) => ({
      ...prev,
      specialty,
      slots: prev.slots.length > 0 ? prev.slots : [{ date: '', time: '' }],
    }));

    appendUserThenBot(
      { role: 'user', content: userBubble },
      {
        role: 'bot',
        content: `Tôi đã hiểu. Với tình trạng của bạn, tôi thấy nên đến gặp bác sĩ về ${specialty}. Bạn có thể cung cấp thêm thông tin vào form dưới đây để được hỗ trợ đặt lịch.`,
      },
      () => setMode('booking-form'),
    );
  };

  const handleSendFreeText = () => {
    if (!input.trim() || isTyping) return;

    const text = input.trim();

    const level = assessLevel(text);
    const specialty = suggestSpecialty(text);
    const botMessage =
      level === 'urgent'
        ? buildAdvice(level, text, specialty)
        : noMoreBookingPrompt
          ? [
              `Tôi hiểu rồi. Với mô tả "${text}", bạn nên theo dõi thêm các dấu hiệu đi kèm.`,
              '',
              'Bạn nên nghỉ ngơi, uống đủ nước và đi khám nếu triệu chứng kéo dài hoặc nặng hơn.',
            ].join('\n')
          : buildAdvice(level, text, specialty);

    setInput('');
    setInputWasSuggested(false);
    setSuggestedSpecialty(specialty);
    setBookingForm((prev) => ({ ...prev, specialty }));

    appendUserThenBot(
      { role: 'user', content: text },
      { role: 'bot', content: botMessage },
      () => {
        if (level === 'urgent' || !noMoreBookingPrompt) {
          setMode('post-advice');
        } else {
          setMode('free-chat');
        }
      },
    );
  };

  const autoSaveConversation = (
    savedMessages: PatientChatMessage[],
    summary: string,
    level: ConsultationLevel,
  ) => {
    addConsultation({
      date: new Date().toISOString(),
      summary: summary.slice(0, 120) || 'Cuộc trò chuyện tư vấn sức khỏe',
      level,
      messages: savedMessages,
    });

    toast.success('Đã lưu vào lịch sử trò chuyện');
  };

  const submitConsultForm = () => {
    if (!consultForm.symptoms.trim()) {
      toast.error('Vui lòng nhập triệu chứng');
      return;
    }

    const combined = [consultForm.symptoms, consultForm.medicalHistory, consultForm.extraInfo].join(' ');
    const level = assessLevel(combined);
    const specialty = suggestSpecialty(combined);
    const advice = buildAdvice(level, consultForm.symptoms, specialty);

    const nextMessages: PatientChatMessage[] = [
      { role: 'user', content: formatConsultationForm(consultForm) },
      { role: 'bot', content: advice },
    ];

    if (consultIntent === 'booking') {
      nextMessages.push({
        role: 'bot',
        content:
          'Cảm ơn bạn đã cung cấp thông tin. Tôi đã chuẩn bị form đặt lịch ngay bên dưới để bạn hoàn tất đăng ký khám.',
      });
    }

    const savedMessages = [...messages, ...nextMessages];

    autoSaveConversation(savedMessages, consultForm.symptoms, level);

    setMessages(savedMessages);
    setSuggestedSpecialty(specialty);
    setBookingForm((prev) => ({ ...prev, specialty }));
    setConsultForm({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      gender: patientProfile.gender || '',
      address: patientProfile.address || '',
      birthDate: patientProfile.birthDate || patientProfile.dob || patientProfile.dateOfBirth || '',
      symptoms: '',
      medicalHistory: '',
      extraInfo: '',
    });
    setSuggestedFields({});
    setConsultIntent('general');
    setMode(consultIntent === 'booking' ? 'booking-form' : 'post-advice');
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
      appendUserThenBot(
        userMessage,
        {
          role: 'bot',
          content:
            'Với lịch trình của bạn, hệ thống chưa tìm được bác sĩ phù hợp trong khung giờ này. Bạn có muốn đổi ca không?',
        },
        () => setMode('booking-no-doctor'),
      );
      return;
    }

    const doctorNames = availableDoctors.map((doctor) => doctor.name).join(', ');

    appendUserThenBot(
      userMessage,
      {
        role: 'bot',
        content: [
          `Dựa vào triệu chứng của bạn, tôi kết luận sơ bộ khoa phù hợp là ${bookingForm.specialty}.`,
          '',
          `Hiện có những bác sĩ sau phù hợp: ${doctorNames}.`,
          '',
          'Bạn hãy chọn bác sĩ muốn đặt lịch bên dưới.',
        ].join('\n'),
      },
      () => setMode('doctor-selection'),
    );
  };

  const selectDoctorForBooking = (doctorId: number) => {
    const doctor = MOCK_DOCTORS.find((item) => item.id === doctorId);
    if (!doctor) return;

    setSelectedDoctorId(doctorId);

    appendMessages(
      {
        role: 'user',
        content: `Tôi chọn ${doctor.name}`,
      },
      {
        role: 'bot',
        content: `Bạn đã chọn ${doctor.name}.\n\nBạn có muốn xác nhận đặt lịch khám với bác sĩ này không?`,
      },
    );

    setMode('booking-confirm');
  };

  const confirmBooking = () => {
    const validSlot = bookingForm.slots.find((slot) => slot.date && slot.time);

    if (!validSlot) return;

    if (!selectedDoctor) {
      toast.error('Vui lòng chọn bác sĩ trước khi xác nhận đặt lịch');
      setMode('doctor-selection');
      return;
    }

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

    const bookingSuccessMessages: PatientChatMessage[] = [
      { role: 'user', content: 'Có, tôi xác nhận đặt lịch khám' },
      {
        role: 'bot',
        content: [
          `Hệ thống đã đặt lịch khám cho bạn. Mã hẹn ${code}.`,
          '',
          'Vui lòng có mặt trước 15 phút, mang theo giấy tờ tùy thân và kết quả xét nghiệm nếu có.',
          '',
          'Lịch khám đã gửi đến bác sĩ, khi có phản hồi hệ thống sẽ gửi mail cho bạn. Bạn cần tư vấn thêm gì không?',
        ].join('\n'),
      },
    ];

    const savedMessages = [...messages, ...bookingSuccessMessages];

    setMessages(savedMessages);

    autoSaveConversation(
      savedMessages,
      `Đặt lịch khám thành công: ${bookingForm.specialty} với ${selectedDoctor.name}`,
      assessLevel(savedMessages.map((message) => message.content).join(' ')),
    );

    setBookingForm({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      specialty: suggestedSpecialty,
      slots: [{ date: '', time: '' }],
      notes: '',
    });

    setSelectedDoctorId(null);
    setSuggestedFields({});
    setNoMoreBookingPrompt(false);
    setMode('free-chat');
  };

  const cancelBookingForm = () => {
    appendMessages(
      { role: 'user', content: 'Hủy form đặt lịch' },
      {
        role: 'bot',
        content: 'Tôi đã hủy form đặt lịch.\n\nBạn có thể tiếp tục nhập nội dung cần tư vấn bất cứ lúc nào.',
      },
    );

    setSelectedDoctorId(null);
    setMode('free-chat');
  };

  const handleChoice = (choice: 'book' | 'more' | 'doctor' | 'no') => {
    if (choice === 'book') {
      startBooking(suggestedSpecialty, 'Có, đặt lịch khám');
      return;
    }

    if (choice === 'more') {
      startConsultation('Muốn tư vấn thêm', '', 'general');
      return;
    }

    if (choice === 'doctor') {
      openDoctorConfirm();
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
    setMode('quick-actions');
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

  const openDoctorConfirm = () => {
    const userMessages = messages.filter((message) => message.role === 'user');

    if (userMessages.length === 0) {
      toast.error('Chưa có nội dung trò chuyện để gửi cho bác sĩ');
      return;
    }

    setShowDoctorConfirm(true);
  };

  const confirmSendToDoctor = () => {
    const combinedText = messages.map((message) => message.content).join(' ');
    const level = assessLevel(combinedText);
    const userMessages = messages.filter((message) => message.role === 'user');
    const botMessages = messages.filter((message) => message.role === 'bot');
    const lastUserMessage = userMessages[userMessages.length - 1];
    const lastBotMessage = botMessages[botMessages.length - 1];

    addDoctorConsultationRequest({
      messages,
      summary: lastUserMessage?.content.slice(0, 140) || 'Cuộc trò chuyện cần bác sĩ tư vấn',
      aiSummary:
        lastBotMessage?.content ||
        'Bệnh nhân đã gửi cuộc trò chuyện cho bác sĩ để được xử lý riêng.',
      level,
    });

    const doctorSentMessages: PatientChatMessage[] = [
      {
        role: 'bot',
        content:
          'Tôi đã gửi cuộc trò chuyện này cho bác sĩ.\n\nBác sĩ sẽ xem xét và phản hồi trong mục Tư vấn bác sĩ sớm nhất.',
      },
    ];

    const savedMessages = [...messages, ...doctorSentMessages];

    setMessages(savedMessages);

    autoSaveConversation(
      savedMessages,
      lastUserMessage?.content || 'Cuộc trò chuyện đã gửi bác sĩ tư vấn',
      level,
    );

    setShowDoctorConfirm(false);
    toast.success('Đã gửi cho bác sĩ tư vấn và sẽ được xử lý sớm nhất');
  };

  const applyChatSuggestion = (value: string) => {
    if (value === 'Đặt lịch khám') {
      handleChoice('book');
      return;
    }

    if (value === 'Tư vấn thêm') {
      handleChoice('more');
      return;
    }

    if (value === 'Gửi bác sĩ') {
      openDoctorConfirm();
      return;
    }

    if (value === 'Đổi giờ khám') {
      setMode('booking-form');
      return;
    }

    if (value === 'Đổi bác sĩ') {
      setMode('doctor-selection');
      return;
    }

    setInput(value);
    setInputWasSuggested(true);
  };

  const renderSuggestionPills = () => {
    const suggestionsByMode: Partial<Record<ChatMode, string[]>> = {
      'post-advice': ['Đặt lịch khám', 'Tư vấn thêm', 'Gửi bác sĩ'],
    };

    const suggestions = suggestionsByMode[mode];

    if (!suggestions?.length) return null;

    return (
      <div className="mb-2 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap pb-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => applyChatSuggestion(suggestion)}
              className={suggestionButtonClassName}
              style={{
                borderColor: COLORS.BORDER,
                color: COLORS.TEXT_PRIMARY,
                backgroundColor: COLORS.WHITE,
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFieldSuggestions = (suggestions: string[], onPick: (value: string) => void) => (
    <div className="mt-2 overflow-x-auto">
      <div className="flex gap-2 whitespace-nowrap pb-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className={suggestionButtonClassName}
            style={{
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_SECONDARY,
              backgroundColor: COLORS.WHITE,
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );

  const renderQuickActionButtons = () => (
    <div className="flex flex-wrap justify-center gap-3 pt-2">
      <button
        type="button"
        onClick={() => startConsultation('Tôi cần đặt lịch khám bệnh', '', 'booking')}
        className={`px-5 py-3 ${primaryButtonClassName}`}
      >
        Tôi cần đặt lịch khám bệnh
      </button>
      <button
        type="button"
        onClick={() => startConsultation('Tôi cần tư vấn', '', 'general')}
        className={`px-5 py-3 ${ghostButtonClassName}`}
        style={{
          borderColor: COLORS.BORDER,
          color: COLORS.TEXT_PRIMARY,
          backgroundColor: COLORS.WHITE,
        }}
      >
        Tôi cần tư vấn
      </button>
    </div>
  );

  const renderChatBubble = (msg: PatientChatMessage, index: number) => {
    const isUser = msg.role === 'user';

    return (
      <div
        key={index}
        className={`flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}
      >
        {!isUser && (
          <div
            className="w-9 h-9 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN, color: COLORS.WHITE }}
          >
            <Bot size={18} />
          </div>
        )}

        <div className="flex items-end gap-2 max-w-[78%] min-w-0">
          <div
            className="px-5 py-4 rounded-3xl text-sm leading-6 whitespace-pre-line break-words shadow-sm transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: isUser ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
              color: isUser ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
            }}
          >
            {msg.content}
          </div>

          {!isUser && (
            <button
              type="button"
              onClick={() => playBotMessage(index)}
              className={`w-8 h-8 rounded-3xl flex items-center justify-center shrink-0 border transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)]
                 active:scale-[0.96] ${
                speakingMessageIndex === index ? 'animate-pulse' : ''
              }`}
              style={{
                borderColor: COLORS.BORDER,
                color: speakingMessageIndex === index ? COLORS.BUTTON_CHOSEN : COLORS.TEXT_SECONDARY,
                backgroundColor: speakingMessageIndex === index ? COLORS.HOVER : COLORS.WHITE,
              }}
              title="Nghe nội dung"
              aria-label="Nghe nội dung"
            >
              <Volume2 size={15} />
            </button>
          )}
        </div>

        {isUser && (
          <div
            className="w-9 h-9 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: COLORS.WHITE, color: COLORS.BUTTON_CHOSEN }}
          >
            <UserRound size={18} />
          </div>
        )}
      </div>
    );
  };

  const renderTypingBubble = () => {
    if (!isTyping) return null;

    return (
      <div className="flex items-end gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div
          className="w-9 h-9 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN, color: COLORS.WHITE }}
        >
          <Bot size={18} />
        </div>

        <div
          className="px-5 py-4 rounded-3xl shadow-sm flex items-center gap-1"
          style={{ backgroundColor: COLORS.WHITE }}
        >
          <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: COLORS.BUTTON_CHOSEN }} />
          <span
            className="w-2 h-2 rounded-full animate-bounce [animation-delay:120ms]"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce [animation-delay:240ms]"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          />
        </div>
      </div>
    );
  };

  const renderDoctorSelection = () => (
    <div
      className="rounded-3xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{ backgroundColor: COLORS.WHITE }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: COLORS.GRAY, color: COLORS.BUTTON_CHOSEN }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chọn bác sĩ phù hợp
          </h3>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            Di chuột vào từng bác sĩ để xem thêm thông tin trước khi chọn.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {availableDoctors.map((doctor, index) => (
          <div key={doctor.id} className="relative group">
            <button
              type="button"
              onClick={() => selectDoctorForBooking(doctor.id)}
              className="px-5 py-3 rounded-3xl border text-sm transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)] hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              style={{
                borderColor: selectedDoctorId === doctor.id ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                color: COLORS.TEXT_PRIMARY,
                backgroundColor: selectedDoctorId === doctor.id ? COLORS.HOVER : COLORS.WHITE,
              }}
            >
              {doctor.name}
            </button>

            <div
              className="pointer-events-none absolute left-0 bottom-full mb-3 w-72 rounded-3xl p-4 shadow-xl opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-20"
              style={{ backgroundColor: COLORS.WHITE, border: `1px solid ${COLORS.BORDER}` }}
            >
              <p className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                {doctor.name}
              </p>
              <p className="text-sm mt-1" style={{ color: COLORS.BUTTON_CHOSEN }}>
                {doctor.specialty}
              </p>
              <div className="mt-3 space-y-2 text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                <p>{getDoctorTitle(index)}</p>
                <p>{getDoctorExperience(index)} năm kinh nghiệm</p>
                <p>Đánh giá bệnh nhân: {getDoctorRating(index)}</p>
                <p>Phù hợp với lịch khám và chuyên khoa hệ thống gợi ý.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={() => setMode('booking-form')}
          className={`px-5 py-2.5 ${ghostButtonClassName}`}
          style={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            backgroundColor: COLORS.WHITE,
          }}
        >
          Sửa thông tin đặt lịch
        </button>
        <button
          type="button"
          onClick={openDoctorConfirm}
          className={`px-5 py-2.5 ${ghostButtonClassName}`}
          style={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            backgroundColor: COLORS.WHITE,
          }}
        >
          Gửi bác sĩ tư vấn trước
        </button>
      </div>
    </div>
  );

  const renderChatInput = () => (
    <div className="px-6 pb-3">
      <div className="max-w-4xl mx-auto">
        {renderSuggestionPills()}

        <div className="flex items-end gap-2">
          <div
            className="flex-1 flex gap-2 rounded-3xl p-1.5 border shadow-sm transition-all duration-200 focus-within:shadow-md"
            style={{
              borderColor: inputWasSuggested ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
              backgroundColor: COLORS.WHITE,
            }}
          >
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setInputWasSuggested(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendFreeText()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2.5 min-h-10 rounded-3xl border-0 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]"
              style={{
                color: COLORS.TEXT_PRIMARY,
                backgroundColor: inputWasSuggested ? COLORS.HOVER : COLORS.WHITE,
              }}
            />

            <button
              type="button"
              onClick={toggleRecording}
              aria-label="Ghi âm"
              title="Ghi âm"
              className={`w-10 h-10 rounded-3xl border flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-[var(--color-hover)] hover:border-[var(--color-button-chosen)] hover:text-[var(--color-button-chosen)] active:scale-[0.96] ${
                isRecording ? 'animate-pulse' : ''
              }`}
              style={{
                borderColor: isRecording ? COLORS.BUTTON_CHOSEN : COLORS.BORDER,
                color: isRecording ? COLORS.BUTTON_CHOSEN : COLORS.TEXT_SECONDARY,
                backgroundColor: isRecording ? COLORS.HOVER : COLORS.WHITE,
              }}
            >
              <Mic size={18} />
            </button>

            <button
              type="button"
              onClick={handleSendFreeText}
              disabled={isTyping || !input.trim()}
              aria-label="Gửi tin nhắn"
              className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${primaryButtonClassName}`}
            >
              <Send size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={saveCurrentConversation}
            aria-label="Lưu lịch sử trò chuyện"
            title="Lưu lịch sử trò chuyện"
            className={`w-10 h-10 flex items-center justify-center flex-shrink-0 -translate-y-1 ${primaryButtonClassName}`}
          >
            <Save size={18} />
          </button>
        </div>

        {isRecording && (
          <div className="mt-2 flex items-center gap-2 px-2 text-xs animate-in fade-in slide-in-from-bottom-1 duration-200">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
              />
            </span>
            <span style={{ color: COLORS.TEXT_SECONDARY }}>Đang ghi âm...</span>
          </div>
        )}

        <p className="mt-1.5 px-2 text-xs leading-5" style={{ color: COLORS.TEXT_SECONDARY }}>
          Trò chuyện sẽ tự lưu khi AI chẩn đoán, đặt lịch thành công và gửi tư vấn cho bác sĩ.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative h-full min-h-0 flex flex-col" style={{ backgroundColor: COLORS.GRAY }}>
      {mode !== 'pre-chat' && (
        <div className="absolute right-5 top-5 z-20">
          <button
            type="button"
            onClick={openDoctorConfirm}
            className="h-10 px-4 rounded-3xl bg-[var(--color-button-chosen)] text-white text-sm flex items-center gap-2 shadow-sm transition-all duration-200 hover:bg-[var(--color-text-primary)]hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            title="Gửi bác sĩ tư vấn"
          >
            <Stethoscope size={17} />
            Gửi bác sĩ tư vấn
          </button>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto px-6 py-8 ${mode === 'pre-chat' ? 'pb-10' : 'pb-32'}`}>
        <div className="max-w-4xl mx-auto space-y-5">
          {messages.map(renderChatBubble)}
          {renderTypingBubble()}

          {mode === 'pre-chat' && renderQuickActionButtons()}

          {mode === 'quick-actions' && renderQuickActionButtons()}

          {mode === 'consult-form' && (
            <div
              className="rounded-3xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ backgroundColor: COLORS.WHITE }}
            >
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Thông tin cá nhân
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={consultForm.name}
                    onChange={(e) => setConsultForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={inputClassName}
                    style={fieldStyle('consultName')}
                    placeholder="Họ tên"
                  />

                  <input
                    value={consultForm.phone}
                    onChange={(e) => setConsultForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className={inputClassName}
                    style={fieldStyle('consultPhone')}
                    placeholder="Số điện thoại"
                  />

                  <input
                    value={consultForm.email}
                    onChange={(e) => setConsultForm((prev) => ({ ...prev, email: e.target.value }))}
                    className={inputClassName}
                    style={fieldStyle('consultEmail')}
                    placeholder="Email"
                  />

                  <input
                    value={consultForm.gender}
                    onChange={(e) => setConsultForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className={inputClassName}
                    style={fieldStyle('consultGender')}
                    placeholder="Giới tính"
                  />

                  <input
                    type="date"
                    value={consultForm.birthDate}
                    onChange={(e) => setConsultForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                    className={inputClassName}
                    style={fieldStyle('consultBirthDate')}
                    placeholder="Ngày sinh"
                  />

                  <input
                    value={consultForm.address}
                    onChange={(e) => setConsultForm((prev) => ({ ...prev, address: e.target.value }))}
                    className={inputClassName}
                    style={fieldStyle('consultAddress')}
                    placeholder="Địa chỉ"
                  />
                </div>
              </div>

              <div>
                <textarea
                  value={consultForm.symptoms}
                  onChange={(e) => {
                    clearFieldSuggested('symptoms');
                    setConsultForm((prev) => ({ ...prev, symptoms: e.target.value }));
                  }}
                  className={inputClassName}
                  style={fieldStyle('symptoms')}
                  placeholder="Mô tả triệu chứng chính, thời điểm bắt đầu và mức độ khó chịu"
                  rows={3}
                />
                {renderFieldSuggestions(
                  [
                    'Đau đầu âm ỉ từ sáng nay',
                    'Ho và đau họng khoảng 2 ngày',
                    'Đau bụng từng cơn sau khi ăn',
                    'Tức ngực nhẹ khi vận động',
                  ],
                  (value) => {
                    markFieldSuggested('symptoms');
                    setConsultForm((prev) => ({
                      ...prev,
                      symptoms: prev.symptoms ? `${prev.symptoms}\n${value}` : value,
                    }));
                  },
                )}
              </div>

              <div>
                <input
                  value={consultForm.medicalHistory}
                  onChange={(e) => {
                    clearFieldSuggested('medicalHistory');
                    setConsultForm((prev) => ({ ...prev, medicalHistory: e.target.value }));
                  }}
                  className={inputClassName}
                  style={fieldStyle('medicalHistory')}
                  placeholder="Tiền sử bệnh, dị ứng thuốc hoặc bệnh đang điều trị"
                />
                {renderFieldSuggestions(
                  [
                    'Không có tiền sử bệnh đáng chú ý',
                    'Có tiền sử dị ứng thuốc',
                    'Đang điều trị huyết áp',
                    'Có bệnh nền cần lưu ý',
                  ],
                  (value) => {
                    markFieldSuggested('medicalHistory');
                    setConsultForm((prev) => ({ ...prev, medicalHistory: value }));
                  },
                )}
              </div>

              <div>
                <textarea
                  value={consultForm.extraInfo}
                  onChange={(e) => {
                    clearFieldSuggested('extraInfo');
                    setConsultForm((prev) => ({ ...prev, extraInfo: e.target.value }));
                  }}
                  className={inputClassName}
                  style={fieldStyle('extraInfo')}
                  placeholder="Thông tin bổ sung như thuốc đã dùng, nhiệt độ, kết quả đo gần đây"
                  rows={3}
                />
                {renderFieldSuggestions(
                  [
                    'Tôi chưa dùng thuốc gì',
                    'Tôi đã uống thuốc hạ sốt',
                    'Triệu chứng nặng hơn vào buổi tối',
                    'Tôi muốn được bác sĩ kiểm tra kỹ',
                  ],
                  (value) => {
                    markFieldSuggested('extraInfo');
                    setConsultForm((prev) => ({
                      ...prev,
                      extraInfo: prev.extraInfo ? `${prev.extraInfo}\n${value}` : value,
                    }));
                  },
                )}
              </div>

              <button type="button" onClick={submitConsultForm} className={`px-6 py-3 ${primaryButtonClassName}`}>
                Gửi
              </button>
            </div>
          )}

          {mode === 'post-advice' && (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => handleChoice('book')} className={`px-5 py-3 ${primaryButtonClassName}`}>
                Có, đặt lịch khám
              </button>
              <button
                type="button"
                onClick={() => handleChoice('more')}
                className={`px-5 py-3 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Muốn tư vấn thêm
              </button>
              <button
                type="button"
                onClick={() => handleChoice('doctor')}
                className={`px-5 py-3 flex items-center gap-2 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                <Stethoscope size={16} />
                Gửi bác sĩ tư vấn
              </button>
              <button
                type="button"
                onClick={() => handleChoice('no')}
                className={`px-5 py-3 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Không, cảm ơn
              </button>
            </div>
          )}

          {mode === 'booking-form' && (
            <div
              className="rounded-3xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ backgroundColor: COLORS.WHITE }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    value={bookingForm.name}
                    onChange={(e) => {
                      clearFieldSuggested('bookingName');
                      setBookingForm((prev) => ({ ...prev, name: e.target.value }));
                    }}
                    className={inputClassName}
                    style={fieldStyle('bookingName')}
                    placeholder="Họ tên người đi khám"
                  />
                  {renderFieldSuggestions([profile.name], (value) => {
                    markFieldSuggested('bookingName');
                    setBookingForm((prev) => ({ ...prev, name: value }));
                  })}
                </div>

                <div>
                  <input
                    value={bookingForm.phone}
                    onChange={(e) => {
                      clearFieldSuggested('bookingPhone');
                      setBookingForm((prev) => ({ ...prev, phone: e.target.value }));
                    }}
                    className={inputClassName}
                    style={fieldStyle('bookingPhone')}
                    placeholder="Số điện thoại liên hệ"
                  />
                  {renderFieldSuggestions([profile.phone], (value) => {
                    markFieldSuggested('bookingPhone');
                    setBookingForm((prev) => ({ ...prev, phone: value }));
                  })}
                </div>

                <div>
                  <input
                    value={bookingForm.email}
                    onChange={(e) => {
                      clearFieldSuggested('bookingEmail');
                      setBookingForm((prev) => ({ ...prev, email: e.target.value }));
                    }}
                    className={inputClassName}
                    style={fieldStyle('bookingEmail')}
                    placeholder="Email nhận thông báo lịch khám"
                  />
                  {renderFieldSuggestions([profile.email], (value) => {
                    markFieldSuggested('bookingEmail');
                    setBookingForm((prev) => ({ ...prev, email: value }));
                  })}
                </div>
              </div>

              <select
                value={bookingForm.specialty}
                onChange={(e) => {
                  setSelectedDoctorId(null);
                  setBookingForm((prev) => ({ ...prev, specialty: e.target.value }));
                }}
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
                  <button type="button" onClick={addBookingSlot} className={`w-9 h-9 flex items-center justify-center ${primaryButtonClassName}`}>
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
                      className={`w-11 h-11 flex items-center justify-center ${ghostButtonClassName}`}
                      style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => {
                    clearFieldSuggested('bookingNotes');
                    setBookingForm((prev) => ({ ...prev, notes: e.target.value }));
                  }}
                  className={inputClassName}
                  style={fieldStyle('bookingNotes')}
                  placeholder="Ghi chú thêm cho phòng khám hoặc bác sĩ"
                  rows={3}
                />
                {renderFieldSuggestions(
                  [
                    'Tôi muốn được gọi xác nhận trước khi khám',
                    'Tôi ưu tiên bác sĩ có lịch sớm nhất',
                    'Tôi cần tư vấn kỹ trước khi khám',
                    'Tôi có mang theo kết quả xét nghiệm cũ',
                  ],
                  (value) => {
                    markFieldSuggested('bookingNotes');
                    setBookingForm((prev) => ({
                      ...prev,
                      notes: prev.notes ? `${prev.notes}\n${value}` : value,
                    }));
                  },
                )}
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={submitBookingForm} className={`px-6 py-3 ${primaryButtonClassName}`}>
                  Nộp
                </button>
                <button
                  type="button"
                  onClick={cancelBookingForm}
                  className={`px-6 py-3 ${ghostButtonClassName}`}
                  style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {mode === 'doctor-selection' && renderDoctorSelection()}

          {mode === 'booking-confirm' && (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={confirmBooking} className={`px-5 py-3 ${primaryButtonClassName}`}>
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
                  setSelectedDoctorId(null);
                  setMode('free-chat');
                }}
                className={`px-5 py-3 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Không
              </button>
              <button
                type="button"
                onClick={() => setMode('doctor-selection')}
                className={`px-5 py-3 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Đổi bác sĩ
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
                className={`px-5 py-3 ${primaryButtonClassName}`}
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
                className={`px-5 py-3 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY, backgroundColor: COLORS.WHITE }}
              >
                Không
              </button>
            </div>
          )}
        </div>
      </div>

      {mode !== 'pre-chat' &&
        mode !== 'consult-form' &&
        mode !== 'booking-form' &&
        mode !== 'doctor-selection' &&
        mode !== 'booking-confirm' &&
        mode !== 'booking-no-doctor' &&
        renderChatInput()}

      {showDoctorConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="relative w-full max-w-md rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: COLORS.WHITE }}
          >
            <button
              type="button"
              onClick={() => setShowDoctorConfirm(false)}
              className="absolute right-4 top-4 w-9 h-9 rounded-3xl flex items-center justify-center transition-all duration-200 hover:bg-[var(--color-hover)] active:translate-y-0 active:scale-[0.98]"
              style={{ backgroundColor: COLORS.GRAY, color: COLORS.TEXT_SECONDARY }}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div className="pr-10">
              <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                Gửi cuộc trò chuyện cho bác sĩ?
              </h3>
              <p className="text-sm mt-2 leading-6" style={{ color: COLORS.TEXT_SECONDARY }}>
                Cuộc trò chuyện hiện tại sẽ được gửi sang mục Tư vấn bác sĩ để bác sĩ xử lý riêng.
                Sau khi gửi, bạn có thể theo dõi phản hồi trong sidebar.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDoctorConfirm(false)}
                className={`px-5 py-2.5 ${ghostButtonClassName}`}
                style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
              >
                Không
              </button>
              <button type="button" onClick={confirmSendToDoctor} className={`px-5 py-2.5 ${primaryButtonClassName}`}>
                Xác nhận gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
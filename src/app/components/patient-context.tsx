import { createContext, useContext, useState, ReactNode } from 'react';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export type ConsultationLevel = 'mild' | 'moderate' | 'urgent';

export interface PatientAppointment {
  id: number;
  code: string;
  specialty: string;
  doctorName: string;
  clinicName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  pendingDoctorReply?: boolean;
}

export interface PatientChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface PatientConsultation {
  id: number;
  date: string;
  summary: string;
  level: ConsultationLevel;
  rating?: number;
  messages: PatientChatMessage[];
}

export interface PatientNotification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export type DoctorConsultationStatus = 'pending' | 'resolved';

export interface PatientDoctorConsultationMessage {
  id: number;
  sender: 'patient' | 'doctor' | 'ai';
  content: string;
  timestamp: string;
}

export interface PatientDoctorConsultation {
  id: number;
  status: DoctorConsultationStatus;
  createdAt: string;
  updatedAt: string;
  summary: string;
  aiSummary: string;
  level: ConsultationLevel;
  doctor: {
    name: string;
    specialty: string;
    clinicName: string;
    email: string;
    phone: string;
  };
  messages: PatientDoctorConsultationMessage[];
}

interface PatientProfile {
  name: string;
  phone: string;
  email: string;
  allergies: string[];
  medicalHistory: string[];
}

interface AppointmentPayload extends Omit<PatientAppointment, 'id' | 'code' | 'status'> {
  code?: string;
}

interface PatientContextValue {
  profile: PatientProfile;
  appointments: PatientAppointment[];
  consultations: PatientConsultation[];
  notifications: PatientNotification[];
  doctorConsultations: PatientDoctorConsultation[];
  addAppointment: (apt: AppointmentPayload) => { id: number; code: string };
  rescheduleAppointment: (id: number, date: string, time: string) => void;
  cancelAppointment: (id: number, reason?: string) => void;
  addConsultation: (c: Omit<PatientConsultation, 'id'>) => number;
  rateConsultation: (id: number, rating: number) => void;
  markNotificationRead: (id: number) => void;
  updateProfile: (partial: Partial<PatientProfile>) => void;
  addDoctorConsultationRequest: (payload: {
    messages: PatientChatMessage[];
    summary: string;
    aiSummary: string;
    level: ConsultationLevel;
  }) => number;
  addDoctorConsultationMessage: (id: number, content: string) => void;
  bookingPrefill: { specialty?: string } | null;
  setBookingPrefill: (v: { specialty?: string } | null) => void;
}

const PatientContext = createContext<PatientContextValue | null>(null);

const initialAppointments: PatientAppointment[] = [
  {
    id: 1,
    code: 'APT-2024-001',
    specialty: 'Tim mạch',
    doctorName: 'BS. Nguyễn Văn A',
    clinicName: 'Phòng khám Tim TP.HCM',
    date: '2026-07-01',
    time: '09:00',
    status: 'upcoming',
    pendingDoctorReply: true,
  },
  {
    id: 2,
    code: 'APT-2023-042',
    specialty: 'Nội khoa',
    doctorName: 'BS. Lê Văn C',
    clinicName: 'PK Quận 1',
    date: '2026-01-10',
    time: '14:00',
    status: 'completed',
  },
];

const initialConsultations: PatientConsultation[] = [
  {
    id: 1,
    date: '2026-06-20T10:00:00',
    summary: 'Đau đầu nhẹ, nghỉ ngơi và uống đủ nước',
    level: 'mild',
    rating: 5,
    messages: [
      { role: 'bot', content: 'Xin chào, bạn đang gặp triệu chứng gì?' },
      { role: 'user', content: 'Tôi bị đau đầu 2 ngày nay' },
      {
        role: 'bot',
        content:
          'Tôi hiểu rồi. Đau đầu nhẹ có thể liên quan đến căng thẳng, thiếu ngủ hoặc mất nước. Bạn nên nghỉ ngơi, uống đủ nước và theo dõi thêm.',
      },
    ],
  },
];

const initialDoctorConsultations: PatientDoctorConsultation[] = [
  {
    id: 1,
    status: 'pending',
    createdAt: '2026-06-27T09:00:00',
    updatedAt: '2026-06-27T09:12:00',
    summary: 'Đau ngực nhẹ và khó thở khi vận động',
    aiSummary:
      'Bệnh nhân mô tả đau ngực nhẹ kèm khó thở khi vận động. AI đã khuyến nghị nên gặp bác sĩ Tim mạch để được kiểm tra rõ hơn.',
    level: 'urgent',
    doctor: {
      name: 'BS. Nguyễn Văn A',
      specialty: 'Tim mạch',
      clinicName: 'Phòng khám trung tâm',
      email: 'doctor@example.com',
      phone: '0909000001',
    },
    messages: [
      {
        id: 1,
        sender: 'patient',
        content: 'Tôi bị đau ngực nhẹ và hơi khó thở khi đi bộ nhanh.',
        timestamp: '2026-06-27T09:00:00',
      },
      {
        id: 2,
        sender: 'ai',
        content:
          'Tình trạng này có thể nguy hiểm. Bạn nên đi khám sớm với bác sĩ Tim mạch.',
        timestamp: '2026-06-27T09:01:00',
      },
      {
        id: 3,
        sender: 'doctor',
        content:
          'Tôi đã nhận được thông tin. Bạn nên hạn chế vận động mạnh và đặt lịch khám trong thời gian gần nhất.',
        timestamp: '2026-06-27T09:12:00',
      },
    ],
  },
];

export function PatientProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PatientProfile>({
    name: 'Trần Thị Bệnh Nhân',
    phone: '0901234567',
    email: 'patient@example.com',
    allergies: ['Penicillin'],
    medicalHistory: ['Tăng huyết áp'],
  });

  const [appointments, setAppointments] = useState(initialAppointments);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [doctorConsultations, setDoctorConsultations] = useState(initialDoctorConsultations);
  const [notifications, setNotifications] = useState<PatientNotification[]>([
    {
      id: 1,
      title: 'Nhắc lịch khám',
      body: 'Bạn có lịch khám ngày 01/06/2026 lúc 09:00',
      time: '2026-06-26T08:00:00',
      read: false,
    },
  ]);
  const [bookingPrefill, setBookingPrefill] = useState<{ specialty?: string } | null>(null);

  const addAppointment = (apt: AppointmentPayload) => {
    const id = Date.now();
    const code = apt.code || `APT-${id}`;

    setAppointments((prev) => [
      ...prev,
      {
        ...apt,
        id,
        code,
        status: 'upcoming',
      },
    ]);

    setNotifications((prev) => [
      {
        id: Date.now() + 1,
        title: 'Đặt lịch thành công',
        body: `Mã hẹn ${code} — ${apt.date} ${apt.time}. Lịch khám đã gửi đến bác sĩ, khi có phản hồi hệ thống sẽ gửi mail cho bạn.`,
        time: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);

    return { id, code };
  };

  const rescheduleAppointment = (id: number, date: string, time: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date, time, pendingDoctorReply: true } : a)),
    );

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Đổi lịch thành công',
        body: `Lịch hẹn ${id} đã đổi sang ${date} ${time}`,
        time: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const cancelAppointment = (id: number, _reason?: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)),
    );

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Đã hủy lịch hẹn',
        body: `Lịch hẹn ${id} đã được hủy`,
        time: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const addConsultation = (c: Omit<PatientConsultation, 'id'>) => {
    const id = Date.now();
    setConsultations((prev) => [{ ...c, id }, ...prev]);
    return id;
  };

  const rateConsultation = (id: number, rating: number) => {
    setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, rating } : c)));
  };

  const markNotificationRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const updateProfile = (partial: Partial<PatientProfile>) => {
    setProfile((p) => ({ ...p, ...partial }));
  };

  const addDoctorConsultationRequest = (payload: {
    messages: PatientChatMessage[];
    summary: string;
    aiSummary: string;
    level: ConsultationLevel;
  }) => {
    const now = new Date().toISOString();
    const id = Date.now();

    const mappedMessages: PatientDoctorConsultationMessage[] = payload.messages.map(
      (message, index) => ({
        id: id + index,
        sender: message.role === 'user' ? 'patient' : 'ai',
        content: message.content,
        timestamp: now,
      }),
    );

    setDoctorConsultations((prev) => [
      {
        id,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        summary: payload.summary,
        aiSummary: payload.aiSummary,
        level: payload.level,
        doctor: {
          name: 'BS. Nguyễn Văn A',
          specialty: payload.level === 'urgent' ? 'Tim mạch' : 'Nội khoa',
          clinicName: 'Phòng khám trung tâm',
          email: 'doctor@example.com',
          phone: '0909000001',
        },
        messages: mappedMessages,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: Date.now() + 1,
        title: 'Đã gửi tư vấn cho bác sĩ',
        body: 'Cuộc trò chuyện đã được gửi cho bác sĩ và sẽ được xử lý sớm nhất.',
        time: now,
        read: false,
      },
      ...prev,
    ]);

    return id;
  };

  const addDoctorConsultationMessage = (id: number, content: string) => {
    const now = new Date().toISOString();

    setDoctorConsultations((prev) =>
      prev.map((consultation) =>
        consultation.id === id
          ? {
              ...consultation,
              status: 'pending',
              updatedAt: now,
              messages: [
                ...consultation.messages,
                {
                  id: Date.now(),
                  sender: 'patient',
                  content,
                  timestamp: now,
                },
              ],
            }
          : consultation,
      ),
    );
  };

  return (
    <PatientContext.Provider
      value={{
        profile,
        appointments,
        consultations,
        notifications,
        doctorConsultations,
        addAppointment,
        rescheduleAppointment,
        cancelAppointment,
        addConsultation,
        rateConsultation,
        markNotificationRead,
        updateProfile,
        addDoctorConsultationRequest,
        addDoctorConsultationMessage,
        bookingPrefill,
        setBookingPrefill,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatient must be used within PatientProvider');
  return ctx;
}

export const SPECIALTIES = [
  'Tim mạch',
  'Nội khoa',
  'Da liễu',
  'Nhi khoa',
  'Tai Mũi Họng',
];

export const MOCK_DOCTORS = [
  { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Tim mạch', exp: '15 năm', rating: 4.8 },
  { id: 2, name: 'BS. Trần Thị B', specialty: 'Tim mạch', exp: '10 năm', rating: 4.6 },
  { id: 3, name: 'BS. Lê Văn C', specialty: 'Nội khoa', exp: '12 năm', rating: 4.7 },
  { id: 4, name: 'BS. Phạm Hoàng D', specialty: 'Da liễu', exp: '9 năm', rating: 4.6 },
  { id: 5, name: 'BS. Võ Minh E', specialty: 'Tai Mũi Họng', exp: '11 năm', rating: 4.7 },
];

export const MOCK_CLINICS = ['Phòng khám Tim TP.HCM', 'Bệnh viện Đa khoa ABC', 'PK Quận 1'];

export const TIME_SLOTS = ['08:00', '09:00', '10:30', '14:00', '15:30', '16:00'];
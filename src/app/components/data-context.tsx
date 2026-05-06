import { createContext, useContext, useState, ReactNode } from 'react';

export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  gender: string;
  email: string;
  address: string;
}

export interface Appointment {
  id: number;
  patient: Patient;
  requestedDate?: string;
  requestedTime?: string;
  date?: string;
  time?: string;
  reason: string;
  priority?: 'high' | 'medium' | 'low';
  source?: string;
  aiSummary?: string;
  status: 'pending' | 'confirmed' | 'completed';
  diagnosis?: string;
}

interface MedicalRecord {
  id: number;
  patientId: number;
  date: string;
  time: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: Array<{ name: string; dosage: string; instructions: string }>;
  notes: string;
  followUpDate: string;
  doctorName: string;
}

export interface ChatMessage {
  id: number;
  sender: 'patient' | 'doctor' | 'ai';
  content: string;
  timestamp: string;
}

export interface Consultation {
  id: number;
  patient: Patient;
  summary: string;
  priority: 'high' | 'medium' | 'low';
  lastMessageTime: string;
  status: 'pending' | 'in-progress' | 'resolved';
  messages: ChatMessage[];
  aiSummary: string;
}

interface DataContextType {
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  consultations: Consultation[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: number, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: number) => void;
  addMedicalRecord: (record: MedicalRecord) => void;
  getPatientRecords: (patientId: number) => MedicalRecord[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getAllPatients: () => Patient[];
  updateConsultation: (id: number, updates: Partial<Consultation>) => void;
  addConsultationMessage: (consultationId: number, message: Omit<ChatMessage, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialPatients: Patient[] = [
  { id: 1, name: 'Nguyễn Thị B', age: 35, phone: '0912345678', gender: 'Nữ', email: 'nguyenthib@email.com', address: '123 Đường ABC, Q1' },
  { id: 2, name: 'Trần Văn C', age: 42, phone: '0923456789', gender: 'Nam', email: 'tranvanc@email.com', address: '456 Đường DEF, Q2' },
  { id: 3, name: 'Lê Thị D', age: 28, phone: '0934567890', gender: 'Nữ', email: 'lethid@email.com', address: '789 Đường GHI, Q3' },
  { id: 4, name: 'Phạm Văn E', age: 55, phone: '0945678901', gender: 'Nam', email: 'phamvane@email.com', address: '321 Đường JKL, Q4' },
  { id: 5, name: 'Hoàng Thị F', age: 31, phone: '0956789012', gender: 'Nữ', email: 'hoangthif@email.com', address: '654 Đường MNO, Q5' },
  { id: 6, name: 'Võ Văn G', age: 48, phone: '0967890123', gender: 'Nam', email: 'vovang@email.com', address: '987 Đường PQR, Q6' }
];

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patient: initialPatients[0],
    requestedDate: '2026-05-02',
    requestedTime: '09:00',
    reason: 'Đau đầu kéo dài 3 ngày, chóng mặt',
    priority: 'high',
    source: 'Website',
    aiSummary: 'Triệu chứng đau đầu dai dẳng, cần khám sớm để loại trừ các bệnh lý nghiêm trọng',
    status: 'pending'
  },
  {
    id: 2,
    patient: initialPatients[1],
    requestedDate: '2026-05-03',
    requestedTime: '10:30',
    reason: 'Tái khám sau điều trị viêm dạ dày',
    priority: 'medium',
    source: 'Chatbot',
    aiSummary: 'Bệnh nhân tái khám định kỳ, tình trạng ổn định',
    status: 'pending'
  },
  {
    id: 3,
    patient: initialPatients[2],
    requestedDate: '2026-05-02',
    requestedTime: '14:00',
    reason: 'Ho, sốt nhẹ',
    priority: 'medium',
    source: 'Điện thoại',
    aiSummary: 'Triệu chứng cảm cúm thông thường',
    status: 'pending'
  },
  {
    id: 4,
    patient: initialPatients[3],
    date: '2026-05-01',
    time: '09:30',
    reason: 'Khám sức khỏe định kỳ',
    status: 'confirmed'
  },
  {
    id: 5,
    patient: initialPatients[4],
    date: '2026-05-01',
    time: '11:00',
    reason: 'Kiểm tra huyết áp',
    status: 'confirmed'
  },
  {
    id: 6,
    patient: initialPatients[5],
    date: '2026-04-30',
    time: '09:00',
    reason: 'Đau lưng',
    diagnosis: 'Thoát vị đĩa đệm nhẹ',
    status: 'completed'
  },
  {
    id: 7,
    patient: initialPatients[0],
    date: '2026-05-05',
    time: '10:00',
    reason: 'Khám tim mạch',
    status: 'confirmed'
  },
  {
    id: 8,
    patient: initialPatients[1],
    date: '2026-05-05',
    time: '14:00',
    reason: 'Tái khám dạ dày',
    status: 'confirmed'
  },
  {
    id: 9,
    patient: initialPatients[2],
    date: '2026-05-08',
    time: '09:00',
    reason: 'Khám tổng quát',
    status: 'confirmed'
  }
];

const initialConsultations: Consultation[] = [
  {
    id: 1,
    patient: initialPatients[0],
    summary: 'Hỏi về tác dụng phụ của thuốc kháng sinh đang dùng',
    priority: 'high',
    lastMessageTime: '2026-05-05T14:30:00',
    status: 'pending',
    aiSummary: 'Bệnh nhân đang dùng Amoxicillin và xuất hiện triệu chứng buồn nôn, chóng mặt nhẹ. AI đã tư vấn sơ bộ về tác dụng phụ thường gặp nhưng bệnh nhân muốn được bác sĩ xác nhận và tư vấn thêm.',
    messages: [
      {
        id: 1,
        sender: 'patient',
        content: 'Chào bác sĩ, em đang uống thuốc Amoxicillin mà thấy hơi buồn nôn và chóng mặt. Có sao không ạ?',
        timestamp: '2026-05-05T14:25:00'
      },
      {
        id: 2,
        sender: 'ai',
        content: 'Xin chào! Buồn nôn và chóng mặt nhẹ là tác dụng phụ thường gặp của Amoxicillin. Tuy nhiên, tôi khuyên bạn nên liên hệ với bác sĩ để được tư vấn cụ thể hơn về tình trạng của bạn.',
        timestamp: '2026-05-05T14:26:00'
      },
      {
        id: 3,
        sender: 'patient',
        content: 'Em có cần ngừng uống thuốc không ạ? Em lo quá.',
        timestamp: '2026-05-05T14:30:00'
      }
    ]
  },
  {
    id: 2,
    patient: initialPatients[1],
    summary: 'Tư vấn chế độ ăn sau điều trị viêm dạ dày',
    priority: 'medium',
    lastMessageTime: '2026-05-05T10:15:00',
    status: 'pending',
    aiSummary: 'Bệnh nhân đã hoàn thành đợt điều trị viêm dạ dày và hỏi về chế độ dinh dưỡng phù hợp. AI đã cung cấp thông tin cơ bản nhưng bệnh nhân cần tư vấn chi tiết hơn từ bác sĩ.',
    messages: [
      {
        id: 1,
        sender: 'patient',
        content: 'Bác sĩ ơi, em vừa uống thuốc điều trị viêm dạ dày xong. Bây giờ em nên ăn gì để tránh tái phát ạ?',
        timestamp: '2026-05-05T10:10:00'
      },
      {
        id: 2,
        sender: 'ai',
        content: 'Sau điều trị viêm dạ dày, bạn nên ăn nhẹ, tránh đồ cay nóng, cà phê và rượu bia. Ăn nhiều bữa nhỏ trong ngày thay vì ít bữa lớn.',
        timestamp: '2026-05-05T10:11:00'
      },
      {
        id: 3,
        sender: 'patient',
        content: 'Em có thể ăn trái cây chua như cam, chanh không ạ?',
        timestamp: '2026-05-05T10:15:00'
      }
    ]
  },
  {
    id: 3,
    patient: initialPatients[2],
    summary: 'Hỏi về kết quả xét nghiệm máu',
    priority: 'low',
    lastMessageTime: '2026-05-04T16:45:00',
    status: 'resolved',
    aiSummary: 'Bệnh nhân nhận được kết quả xét nghiệm máu và có một số chỉ số hơi cao. Bác sĩ đã giải thích chi tiết và tư vấn.',
    messages: [
      {
        id: 1,
        sender: 'patient',
        content: 'Bác sĩ cho em hỏi về kết quả xét nghiệm máu của em ạ. Em thấy có mấy chỉ số đỏ.',
        timestamp: '2026-05-04T16:30:00'
      },
      {
        id: 2,
        sender: 'ai',
        content: 'Tôi đã xem kết quả của bạn. Có một số chỉ số cao hơn bình thường một chút, nhưng để được tư vấn chính xác, bạn nên đợi bác sĩ giải thích chi tiết.',
        timestamp: '2026-05-04T16:31:00'
      },
      {
        id: 3,
        sender: 'patient',
        content: 'Em lo lắm bác sĩ ơi.',
        timestamp: '2026-05-04T16:35:00'
      },
      {
        id: 4,
        sender: 'doctor',
        content: 'Chào em, mình đã xem kết quả rồi. Chỉ số cholesterol của em cao hơn một chút so với mức bình thường, nhưng chưa đến mức nguy hiểm. Em chỉ cần điều chỉnh chế độ ăn, tập thể dục đều đặn là được.',
        timestamp: '2026-05-04T16:40:00'
      },
      {
        id: 5,
        sender: 'patient',
        content: 'Dạ em cảm ơn bác sĩ ạ. Em sẽ chú ý hơn.',
        timestamp: '2026-05-04T16:45:00'
      }
    ]
  }
];

const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patientId: 6,
    date: '2026-04-30',
    time: '09:00',
    symptoms: 'Đau lưng, khó di chuyển',
    diagnosis: 'Thoát vị đĩa đệm nhẹ',
    treatment: 'Nghỉ ngơi, vật lý trị liệu',
    medications: [
      { name: 'Ibuprofen 400mg', dosage: '3 lần/ngày', instructions: 'Sau ăn' }
    ],
    notes: 'Tránh vận động mạnh, nằm nghỉ nhiều',
    followUpDate: '2026-05-15',
    doctorName: 'Dr. Nguyễn Văn A'
  },
  {
    id: 2,
    patientId: 1,
    date: '2026-03-15',
    time: '10:30',
    symptoms: 'Viêm họng, ho',
    diagnosis: 'Viêm họng cấp',
    treatment: 'Uống thuốc kháng sinh',
    medications: [
      { name: 'Amoxicillin 500mg', dosage: '3 lần/ngày', instructions: 'Sau ăn' },
      { name: 'Paracetamol 500mg', dosage: 'Khi sốt', instructions: 'Sau ăn' }
    ],
    notes: 'Uống đủ nước, nghỉ ngơi',
    followUpDate: '2026-03-22',
    doctorName: 'Dr. Nguyễn Văn A'
  },
  {
    id: 3,
    patientId: 1,
    date: '2026-02-10',
    time: '09:00',
    symptoms: 'Khám sức khỏe định kỳ',
    diagnosis: 'Sức khỏe tốt',
    treatment: 'Duy trì lối sống lành mạnh',
    medications: [],
    notes: 'Không có vấn đề gì bất thường',
    followUpDate: '2026-08-10',
    doctorName: 'Dr. Nguyễn Văn A'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: number, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  };

  const deleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const addMedicalRecord = (record: MedicalRecord) => {
    setMedicalRecords(prev => [...prev, record]);

    // Update appointment status to completed
    const appointment = appointments.find(apt =>
      apt.patient.id === record.patientId &&
      apt.date === record.date &&
      apt.status === 'confirmed'
    );
    if (appointment) {
      updateAppointment(appointment.id, { status: 'completed', diagnosis: record.diagnosis });
    }
  };

  const getPatientRecords = (patientId: number) => {
    return medicalRecords
      .filter(record => record.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  const getAllPatients = () => {
    return initialPatients;
  };

  const updateConsultation = (id: number, updates: Partial<Consultation>) => {
    setConsultations(prev =>
      prev.map(cons => (cons.id === id ? { ...cons, ...updates } : cons))
    );
  };

  const addConsultationMessage = (consultationId: number, message: Omit<ChatMessage, 'id'>) => {
    setConsultations(prev =>
      prev.map(cons => {
        if (cons.id === consultationId) {
          const newMessage = {
            ...message,
            id: Date.now()
          };
          return {
            ...cons,
            messages: [...cons.messages, newMessage],
            lastMessageTime: message.timestamp,
            status: message.sender === 'doctor' ? 'in-progress' as const : cons.status
          };
        }
        return cons;
      })
    );
  };

  return (
    <DataContext.Provider
      value={{
        appointments,
        medicalRecords,
        consultations,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addMedicalRecord,
        getPatientRecords,
        getAppointmentsByDate,
        getAllPatients,
        updateConsultation,
        addConsultationMessage
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

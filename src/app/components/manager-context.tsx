import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface Account {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  username?: string;
  isProfileComplete?: boolean;
  specialty?: string | string[];
  licenseNumber?: string;
  dateOfBirth?: string;
  address?: string;
  experience?: string;
  education?: string[];
  certifications?: string[];
  availability?: string;
  schedule?: string;
  gender?: string;
  medicalHistory?: string;
}

interface Activity {
  id: string;
  type: string;
  action: string;
  detail: string;
  time: string;
}

interface ManagerContextType {
  accounts: Account[];
  activities: Activity[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'status'>) => void;
  updateAccount: (id: number, updates: Partial<Account>) => void;
  deleteAccount: (id: number) => void;
  addActivity: (activity: Omit<Activity, 'time' | 'id'>) => void;
  getIncompleteProfiles: () => Account[];
  pendingEditAccountId: number | null;
  setPendingEditAccountId: (id: number | null) => void;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

const initialAccounts: Account[] = [
  {
    id: 1,
    name: 'Nguyễn Thị B',
    email: 'nguyenthib@email.com',
    phone: '0912345678',
    role: 'patient',
    status: 'active',
    createdAt: '2026-01-15',
    username: 'patient1',
    gender: 'Nữ',
    dateOfBirth: '1989-04-20',
    address: '123 Đường ABC, Q1, TP.HCM'
  },
  {
    id: 2,
    name: 'Trần Văn C',
    email: 'tranvanc@email.com',
    phone: '0923456789',
    role: 'patient',
    status: 'active',
    createdAt: '2026-02-20',
    username: 'patient2',
    gender: 'Nam',
    dateOfBirth: '1975-08-15',
    address: '456 Đường DEF, Q2, TP.HCM'
  },
  {
    id: 3,
    name: 'BS. Nguyễn Văn A',
    email: 'nguyenvana@phongkham.vn',
    phone: '0987654321',
    role: 'doctor',
    status: 'active',
    createdAt: '2025-06-10',
    username: 'doctor1',
    isProfileComplete: true,
    specialty: 'Bác sĩ Nội khoa',
    licenseNumber: 'BS-123456',
    dateOfBirth: '1985-05-15',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    experience: '12 năm',
    education: ['Bác sĩ Y khoa - Đại học Y Hà Nội (2003-2009)', 'Thạc sĩ Nội khoa - Đại học Y Hà Nội (2010-2012)'],
    certifications: ['Chứng chí hành nghề số BS-123456', 'Chứng nhận điều trị nội khoa']
  },
  {
    id: 4,
    name: 'Lê Thị Manager',
    email: 'manager@phongkham.vn',
    phone: '0976543210',
    role: 'manager',
    status: 'active',
    createdAt: '2025-05-01',
    username: 'manager1',
    isProfileComplete: true
  },
  {
    id: 5,
    name: 'Nguyễn Văn Expert',
    email: 'aitrainer@phongkham.vn',
    phone: '0965432109',
    role: 'ai-trainer',
    status: 'active',
    createdAt: '2025-07-15',
    username: 'aitrainer1',
    isProfileComplete: true,
    specialty: ['NLP', 'Computer Vision', 'Healthcare AI'],
    certifications: [
      'TensorFlow Developer Certificate',
      'AWS Machine Learning Specialty',
      'Healthcare AI Specialist'
    ],
    availability: 'Sẵn sàng tiếp nhận dự án',
    schedule: 'Thứ 2 - Thứ 6: 9:00 - 18:00'
  },
  {
    id: 6,
    name: 'BS. Trần Thị B',
    email: 'tranthib@phongkham.vn',
    phone: '0954321098',
    role: 'doctor',
    status: 'active',
    createdAt: '2026-04-25',
    username: 'doctor2',
    isProfileComplete: false,
    specialty: '',
    licenseNumber: '',
    dateOfBirth: '',
    address: '',
    experience: '',
    education: [],
    certifications: []
  },
  {
    id: 7,
    name: 'Lê Văn AI Expert',
    email: 'levanai@phongkham.vn',
    phone: '0943210987',
    role: 'ai-trainer',
    status: 'active',
    createdAt: '2026-04-28',
    username: 'aitrainer2',
    isProfileComplete: false,
    specialty: [],
    certifications: [],
    availability: '',
    schedule: ''
  }
];

const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'account',
    action: 'Tạo tài khoản mới',
    detail: 'Tài khoản bác sĩ: BS. Trần Thị B',
    time: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: '2',
    type: 'account',
    action: 'Cập nhật tài khoản',
    detail: 'Cập nhật hồ sơ: BS. Nguyễn Văn A',
    time: new Date(Date.now() - 2 * 3600000 - 15 * 60000).toISOString()
  },
  {
    id: '3',
    type: 'account',
    action: 'Tạo tài khoản mới',
    detail: 'Tài khoản AI Trainer: Lê Văn AI Expert',
    time: new Date(Date.now() - 1 * 86400000 - 3600000).toISOString()
  },
  {
    id: '4',
    type: 'account',
    action: 'Xóa tài khoản',
    detail: 'Xóa tài khoản nhân viên: Nguyễn Văn D',
    time: new Date(Date.now() - 2 * 86400000 - 2 * 3600000).toISOString()
  },
  {
    id: '5',
    type: 'account',
    action: 'Cập nhật tài khoản',
    detail: 'Cập nhật hồ sơ: Trần Thị B',
    time: new Date(Date.now() - 3 * 86400000 - 4 * 3600000).toISOString()
  },
  {
    id: '6',
    type: 'account',
    action: 'Tạo tài khoản mới',
    detail: 'Tài khoản bệnh nhân: Nguyễn Minh E',
    time: new Date(Date.now() - 4 * 86400000 - 8 * 3600000).toISOString()
  },
  {
    id: '7',
    type: 'account',
    action: 'Cập nhật tài khoản',
    detail: 'Cập nhật hồ sơ: Lê Thị Manager',
    time: new Date(Date.now() - 5 * 86400000 - 10 * 3600000).toISOString()
  },
  {
    id: '8',
    type: 'account',
    action: 'Tạo tài khoản mới',
    detail: 'Tài khoản bác sĩ: BS. Phạm Văn F',
    time: new Date(Date.now() - 6 * 86400000 - 14 * 3600000).toISOString()
  }
];

export function ManagerProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [pendingEditAccountId, setPendingEditAccountId] = useState<number | null>(null);

  const addActivity = (activity: Omit<Activity, 'time' | 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      time: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addAccount = (account: Omit<Account, 'id' | 'createdAt' | 'status'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      isProfileComplete: account.role === 'doctor' || account.role === 'ai-trainer' ? false : true
    };

    setAccounts(prev => [...prev, newAccount]);

    addActivity({
      type: 'account',
      action: 'Tạo tài khoản mới',
      detail: `Tài khoản ${account.role === 'doctor' ? 'bác sĩ' : account.role === 'ai-trainer' ? 'AI Trainer' : 'quản lý'}: ${account.name}`
    });

    toast.success('Đã tạo tài khoản thành công!');
  };

  const updateAccount = (id: number, updates: Partial<Account>) => {
    setAccounts(prev =>
      prev.map(acc => (acc.id === id ? { ...acc, ...updates } : acc))
    );

    const account = accounts.find(a => a.id === id);
    if (account) {
      addActivity({
        type: 'account',
        action: 'Cập nhật tài khoản',
        detail: `Cập nhật thông tin: ${account.name}`
      });
    }

    toast.success('Đã cập nhật tài khoản thành công!');
  };

  const deleteAccount = (id: number) => {
    const account = accounts.find(a => a.id === id);
    setAccounts(prev => prev.filter(acc => acc.id !== id));

    if (account) {
      addActivity({
        type: 'account',
        action: 'Xóa tài khoản',
        detail: `Xóa tài khoản: ${account.name}`
      });
    }

    toast.success('Đã xóa tài khoản thành công!');
  };

  const getIncompleteProfiles = () => {
    return accounts.filter(
      acc => (acc.role === 'doctor' || acc.role === 'ai-trainer') && !acc.isProfileComplete
    );
  };

  return (
    <ManagerContext.Provider
      value={{
        accounts,
        activities,
        addAccount,
        updateAccount,
        deleteAccount,
        addActivity,
        getIncompleteProfiles,
        pendingEditAccountId,
        setPendingEditAccountId
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within ManagerProvider');
  }
  return context;
}
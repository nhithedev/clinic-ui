import { useState } from 'react';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
import bg2 from '@/imports/bg2.png';
import { COLOR_HEX } from '@/styles/colors';

type RoleId = 'doctor' | 'manager' | 'ai-trainer' | 'patient';
type PatientAuthMode = 'login' | 'register' | 'otp';

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<RoleId>('doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');

  const [patientMode, setPatientMode] = useState<PatientAuthMode>('login');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [otp, setOtp] = useState('');

  const roles: { id: RoleId; label: string }[] = [
    { id: 'doctor', label: 'Bác sĩ phòng khám' },
    { id: 'manager', label: 'Quản lý phòng khám' },
    { id: 'ai-trainer', label: 'Chuyên gia huấn luyện AI chatbot' },
    { id: 'patient', label: 'Bệnh nhân / Khách hàng' },
  ];

  const mockAccounts: Record<Exclude<RoleId, 'patient'>, { username: string; password: string }> = {
    doctor: { username: 'doctor1', password: 'doctor123' },
    manager: { username: 'manager1', password: 'manager123' },
    'ai-trainer': { username: 'aitrainer1', password: 'trainer123' },
  };

  const patientAccount = { username: 'patient1', password: 'patient123' };
  const MOCK_OTP = '123456';

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (selectedRole === 'patient') return;

    const account = mockAccounts[selectedRole];
    if (username === account.username && password === account.password) {
      onLogin(selectedRole);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const loginId = username.trim();
    if (
      (loginId === patientAccount.username || loginId === 'patient@example.com') &&
      password === patientAccount.password
    ) {
      onLogin('patient');
    } else {
      setError('SĐT/Email hoặc mật khẩu không đúng');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!registerName || !registerPhone || !registerEmail || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setPatientMode('otp');
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp === MOCK_OTP) {
      onLogin('patient');
    } else {
      setError('Mã OTP không đúng (demo: 123456)');
    }
  };

  const isPatient = selectedRole === 'patient';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bg2})` }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-full mb-4" style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}>
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
              Hệ thống quản lý phòng khám
            </h1>
            <p style={{ color: COLOR_HEX.TEXT_SECONDARY }}>Chào mừng đến với hệ thống!</p>
          </div>

          <div className="mb-6">
            <label className="block mb-3" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
              Chọn vai trò của bạn
            </label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.id);
                    setError('');
                    setPatientMode('login');
                  }}
                  className={`px-4 py-3 rounded-3xl border-2 transition-all ${
                    selectedRole === role.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-[#1F4A51] hover:border-[#479AA8]'
                  }`}
                  style={
                    selectedRole === role.id
                      ? { backgroundColor: COLOR_HEX.BUTTON_CHOSEN, borderColor: COLOR_HEX.BUTTON_CHOSEN }
                      : { borderColor: COLOR_HEX.BORDER }
                  }
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {isPatient && (
            <div className="flex gap-2 mb-4">
              {(['login', 'register'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setPatientMode(mode);
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-3xl text-sm font-medium ${
                    patientMode === mode || (mode === 'login' && patientMode === 'otp')
                      ? 'text-white'
                      : ''
                  }`}
                  style={
                    patientMode === mode || (mode === 'login' && patientMode === 'otp')
                      ? { backgroundColor: COLOR_HEX.BUTTON_CHOSEN }
                      : { backgroundColor: COLOR_HEX.GRAY, color: COLOR_HEX.TEXT_PRIMARY }
                  }
                >
                  {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              ))}
            </div>
          )}

          {!isPatient && (
            <form onSubmit={handleStaffLogin} className="space-y-6">
              <Field label="Tên đăng nhập" value={username} onChange={setUsername} />
              <PasswordField value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              {error && <ErrorBox message={error} />}
              <SubmitButton label="Đăng nhập" />
              <ForgotBlock show={showForgotPassword} onToggle={() => setShowForgotPassword(!showForgotPassword)} />
            </form>
          )}

          {isPatient && patientMode === 'login' && (
            <form onSubmit={handlePatientLogin} className="space-y-6">
              <Field label="SĐT hoặc Email" value={username} onChange={setUsername} placeholder="SĐT hoặc email" />
              <PasswordField value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              {error && <ErrorBox message={error} />}
              <SubmitButton label="Đăng nhập" />
            </form>
          )}

          {isPatient && patientMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Họ và tên" value={registerName} onChange={setRegisterName} />
              <Field label="Số điện thoại" value={registerPhone} onChange={setRegisterPhone} />
              <Field label="Email" value={registerEmail} onChange={setRegisterEmail} type="email" />
              <PasswordField value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              {error && <ErrorBox message={error} />}
              <SubmitButton label="Tiếp tục — Xác thực OTP" />
            </form>
          )}

          {isPatient && patientMode === 'otp' && (
            <form onSubmit={handleOtp} className="space-y-4">
              <p className="text-sm" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
                Nhập mã OTP đã gửi tới {registerPhone || 'SĐT của bạn'} (demo: 123456)
              </p>
              <Field label="Mã OTP" value={otp} onChange={setOtp} placeholder="6 chữ số" />
              {error && <ErrorBox message={error} />}
              <SubmitButton label="Xác thực" />
              <button type="button" onClick={() => setPatientMode('register')} className="text-sm w-full" style={{ color: COLOR_HEX.BUTTON_CHOSEN }}>
                Quay lại đăng ký
              </button>
            </form>
          )}

          <DemoAccounts
            onPick={(role, u, p) => {
              setSelectedRole(role);
              setUsername(u);
              setPassword(p);
              setError('');
              setPatientMode('login');
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block mb-2" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-3xl border focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
        style={{ backgroundColor: '#f4f8fa', borderColor: COLOR_HEX.BORDER, color: COLOR_HEX.TEXT_PRIMARY }}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  show,
  onToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="block mb-2" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
        Mật khẩu
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pr-12 rounded-3xl border focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
          style={{ backgroundColor: '#f4f8fa', borderColor: COLOR_HEX.BORDER, color: COLOR_HEX.TEXT_PRIMARY }}
          placeholder="Nhập mật khẩu"
          required
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-3xl">{message}</div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full text-white py-3 rounded-3xl transition-colors hover:opacity-90"
      style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
    >
      {label}
    </button>
  );
}

function ForgotBlock({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <>
      <div className="text-center">
        <button type="button" onClick={onToggle} className="hover:underline" style={{ color: COLOR_HEX.BUTTON_CHOSEN }}>
          Quên mật khẩu?
        </button>
      </div>
      {show && (
        <div className="rounded-3xl p-4 mt-4 border" style={{ backgroundColor: COLOR_HEX.HOVER, borderColor: COLOR_HEX.BUTTON_CHOSEN }}>
          <p className="mb-3" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
            Liên hệ quản lý phòng khám: Hotline 0123-456-789
          </p>
        </div>
      )}
    </>
  );
}

function DemoAccounts({
  onPick,
}: {
  onPick: (role: RoleId, username: string, password: string) => void;
}) {
  const accounts: { role: RoleId; label: string; username: string; password: string }[] = [
    { role: 'doctor', label: 'Bác sĩ', username: 'doctor1', password: 'doctor123' },
    { role: 'manager', label: 'Quản lý', username: 'manager1', password: 'manager123' },
    { role: 'ai-trainer', label: 'AI Trainer', username: 'aitrainer1', password: 'trainer123' },
    { role: 'patient', label: 'Bệnh nhân', username: 'patient1', password: 'patient123' },
  ];

  return (
    <div className="mt-6 p-4 rounded-3xl" style={{ backgroundColor: COLOR_HEX.HOVER }}>
      <p className="text-sm mb-2" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
        Tài khoản demo:
      </p>
      <div className="text-sm space-y-2" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
        {accounts.map((account) => (
          <div key={account.role} className="flex items-center justify-between gap-2">
            <p className="truncate">
              {account.label}: {account.username} / {account.password}
            </p>
            <button
              type="button"
              onClick={() => onPick(account.role, account.username, account.password)}
              className="px-2 py-1 rounded-xl text-xs flex-shrink-0"
              style={{ backgroundColor: '#D1ECF0', color: COLOR_HEX.TEXT_PRIMARY }}
            >
              Dùng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

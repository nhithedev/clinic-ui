import { useState } from 'react';
import { Eye, EyeOff, Stethoscope, X } from 'lucide-react';
import { toast } from 'sonner';
import bg2 from '@/imports/bg2.png';
import { COLOR_HEX } from '@/styles/colors';

type RoleId = 'doctor' | 'manager' | 'ai-trainer' | 'patient';
type PatientAuthMode = 'register' | 'otp';

interface LoginProps {
  onLogin: (role: string) => void;
}

const LOGIN_TOP_PADDING = 56;
const LOGIN_BOTTOM_PADDING = 40;

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<RoleId>('doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [patientMode, setPatientMode] = useState<PatientAuthMode>('register');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [otp, setOtp] = useState('');

  const roles: { id: RoleId; label: string }[] = [
    { id: 'doctor', label: 'Doctor' },
    { id: 'manager', label: 'Manager' },
    { id: 'ai-trainer', label: 'AI Trainer' },
    { id: 'patient', label: 'Patient' },
  ];

  const mockAccounts: Record<Exclude<RoleId, 'patient'>, { username: string; password: string }> = {
    doctor: { username: 'doctor1', password: 'doctor123' },
    manager: { username: 'manager1', password: 'manager123' },
    'ai-trainer': { username: 'aitrainer1', password: 'trainer123' },
  };

  const patientAccount = { username: 'patient1', password: 'patient123' };
  const MOCK_OTP = '123456';
  const isPatient = selectedRole === 'patient';

  const resetRegisterFlow = () => {
    setShowRegisterModal(false);
    setPatientMode('register');
    setRegisterName('');
    setRegisterPhone('');
    setRegisterEmail('');
    setOtp('');
    setError('');
  };

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
      toast.success('Đã đăng ký tài khoản thành công');
      resetRegisterFlow();
    } else {
      setError('Mã OTP không đúng (demo: 123456)');
    }
  };

  return (
    <div className="fixed inset-0 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      <section
        className="hidden h-full lg:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg2})` }}
      />

      <section
        className="h-full flex items-stretch justify-center px-6"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <div
          className="w-full max-w-lg h-full flex flex-col gap-4 overflow-hidden"
          style={{ paddingTop: LOGIN_TOP_PADDING, paddingBottom: LOGIN_BOTTOM_PADDING }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
            >
              <Stethoscope className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
                Hệ thống quản lý phòng khám
              </h1>
              <p className="text-sm mt-1" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
                Chọn vai trò và đăng nhập để tiếp tục
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-10">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRole(role.id);
                  setError('');
                  setShowRegisterModal(false);
                }}
                className="px-3 py-2.5 rounded-3xl border-2 text-xs font-medium transition-all whitespace-nowrap"
                style={
                  selectedRole === role.id
                    ? {
                        backgroundColor: COLOR_HEX.BUTTON_CHOSEN,
                        borderColor: COLOR_HEX.BUTTON_CHOSEN,
                        color: 'var(--color-white)',
                      }
                    : {
                        backgroundColor: 'var(--color-white)',
                        borderColor: COLOR_HEX.BORDER,
                        color: COLOR_HEX.TEXT_PRIMARY,
                      }
                }
              >
                {role.label}
              </button>
            ))}
          </div>

          {!isPatient && (
            <form onSubmit={handleStaffLogin} className="space-y-3 mt-1">
              <Field
                label="Tên đăng nhập"
                value={username}
                onChange={setUsername}
                placeholder="Nhập tên đăng nhập"
              />
              <PasswordField
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => toast.info('Liên hệ quản lý phòng khám: Hotline 0123-456-789')}
                  className="text-sm hover:underline"
                  style={{ color: COLOR_HEX.BUTTON_CHOSEN }}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {error && <ErrorBox message={error} />}
              <SubmitButton label="Đăng nhập" />
            </form>
          )}

          {isPatient && (
            <form onSubmit={handlePatientLogin} className="space-y-3 mt-1">
              <Field
                label="SĐT hoặc Email"
                value={username}
                onChange={setUsername}
                placeholder="SĐT hoặc email"
              />
              <PasswordField
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />

              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => toast.info('Liên hệ quản lý phòng khám: Hotline 0123-456-789')}
                  className="text-sm hover:underline"
                  style={{ color: COLOR_HEX.BUTTON_CHOSEN }}
                >
                  Quên mật khẩu?
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setPatientMode('register');
                    setShowRegisterModal(true);
                  }}
                  className="text-sm hover:underline"
                  style={{ color: COLOR_HEX.BUTTON_CHOSEN }}
                >
                  Đăng ký
                </button>
              </div>

              {error && <ErrorBox message={error} />}
              <SubmitButton label="Đăng nhập" />
            </form>
          )}

          <div className="mt-auto pt-4">
            <DemoAccounts
              onPick={(role, u, p) => {
                setSelectedRole(role);
                setUsername(u);
                setPassword(p);
                setError('');
                setShowRegisterModal(false);
              }}
            />
          </div>

        </div>

        {showRegisterModal && (
          <RegisterModal
            mode={patientMode}
            setMode={setPatientMode}
            registerName={registerName}
            setRegisterName={setRegisterName}
            registerPhone={registerPhone}
            setRegisterPhone={setRegisterPhone}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            otp={otp}
            setOtp={setOtp}
            error={error}
            onRegister={handleRegister}
            onOtp={handleOtp}
            onClose={resetRegisterFlow}
            onBack={() => {
              setError('');
              setPatientMode('register');
            }}
          />
        )}
      </section>
    </div>
  );
}

function RegisterModal({
  mode,
  registerName,
  setRegisterName,
  registerPhone,
  setRegisterPhone,
  registerEmail,
  setRegisterEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  otp,
  setOtp,
  error,
  onRegister,
  onOtp,
  onClose,
  onBack,
}: {
  mode: PatientAuthMode;
  setMode: (mode: PatientAuthMode) => void;
  registerName: string;
  setRegisterName: (value: string) => void;
  registerPhone: string;
  setRegisterPhone: (value: string) => void;
  registerEmail: string;
  setRegisterEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  otp: string;
  setOtp: (value: string) => void;
  error: string;
  onRegister: (e: React.FormEvent) => void;
  onOtp: (e: React.FormEvent) => void;
  onClose: () => void;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="relative w-full max-w-md rounded-3xl p-6 shadow-xl"
        style={{ backgroundColor: 'var(--color-white)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-3xl flex items-center justify-center"
          style={{ color: COLOR_HEX.TEXT_SECONDARY, backgroundColor: COLOR_HEX.GRAY }}
          aria-label="Đóng đăng ký"
        >
          <X size={18} />
        </button>

        <div className="pr-10 mb-5">
          <h2 className="text-lg font-semibold" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
            {mode === 'register' ? 'Đăng ký tài khoản bệnh nhân' : 'Xác thực OTP'}
          </h2>
          <p className="text-sm mt-1" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
            {mode === 'register'
              ? 'Điền thông tin để tạo tài khoản mới'
              : 'Nhập mã OTP để hoàn tất đăng ký'}
          </p>
        </div>

        {mode === 'register' && (
          <form onSubmit={onRegister} className="space-y-3">
            <Field label="Họ và tên" value={registerName} onChange={setRegisterName} />
            <Field label="Số điện thoại" value={registerPhone} onChange={setRegisterPhone} />
            <Field label="Email" value={registerEmail} onChange={setRegisterEmail} type="email" />
            <PasswordField
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {error && <ErrorBox message={error} />}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-3xl border text-sm"
                style={{ borderColor: COLOR_HEX.BORDER, color: COLOR_HEX.TEXT_PRIMARY }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
              >
                Tiếp tục
              </button>
            </div>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={onOtp} className="space-y-4">
            <p className="text-sm" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
              Nhập mã OTP đã gửi tới {registerPhone || 'SĐT của bạn'} (demo: 123456)
            </p>

            <Field label="Mã OTP" value={otp} onChange={setOtp} placeholder="6 chữ số" />

            {error && <ErrorBox message={error} />}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2.5 rounded-3xl border text-sm"
                style={{ borderColor: COLOR_HEX.BORDER, color: COLOR_HEX.TEXT_PRIMARY }}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-3xl text-white text-sm"
                style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
              >
                Xác thực
              </button>
            </div>
          </form>
        )}
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
      <label className="block mb-1.5 text-sm" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]"
        style={{
          backgroundColor: COLOR_HEX.HOVER,
          borderColor: COLOR_HEX.BORDER,
          color: COLOR_HEX.TEXT_PRIMARY,
        }}
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
      <label className="block mb-1.5 text-sm" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
        Mật khẩu
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-12 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]"
          style={{
            backgroundColor: COLOR_HEX.HOVER,
            borderColor: COLOR_HEX.BORDER,
            color: COLOR_HEX.TEXT_PRIMARY,
          }}
          placeholder="Nhập mật khẩu"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: COLOR_HEX.TEXT_SECONDARY }}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-3xl text-sm border"
      style={{
        backgroundColor: 'var(--color-warning-bg)',
        borderColor: 'var(--color-destructive)',
        color: 'var(--color-destructive)',
      }}
    >
      {message}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full text-white py-2.5 rounded-3xl transition-colors hover:opacity-90"
      style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
    >
      {label}
    </button>
  );
}

function DemoAccounts({
  onPick,
}: {
  onPick: (role: RoleId, username: string, password: string) => void;
}) {
  const accounts: { role: RoleId; label: string; username: string; password: string }[] = [
    { role: 'doctor', label: 'Doctor', username: 'doctor1', password: 'doctor123' },
    { role: 'manager', label: 'Manager', username: 'manager1', password: 'manager123' },
    { role: 'ai-trainer', label: 'AI Trainer', username: 'aitrainer1', password: 'trainer123' },
    { role: 'patient', label: 'Patient', username: 'patient1', password: 'patient123' },
  ];

  return (
    <div>
      <p className="text-xs mb-2" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
        Quick use
      </p>

      <div className="grid grid-cols-4 gap-2">
        {accounts.map((account) => (
          <div
            key={account.role}
            className="rounded-3xl p-2 text-center"
            style={{ backgroundColor: COLOR_HEX.HOVER }}
          >
            <p className="text-[11px] mb-1 truncate" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
              {account.label}
            </p>
            <button
              type="button"
              onClick={() => onPick(account.role, account.username, account.password)}
              className="w-full px-2 py-1.5 rounded-3xl text-xs"
              style={{
                backgroundColor: COLOR_HEX.LIGHTER,
                color: COLOR_HEX.TEXT_PRIMARY,
              }}
            >
              Dùng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
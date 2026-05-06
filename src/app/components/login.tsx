import { useState } from 'react';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
import bg2 from '@/imports/bg2.png';

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'manager' | 'ai-trainer'>('doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 'doctor', label: 'Bác sĩ phòng khám' },
    { id: 'manager', label: 'Quản lý phòng khám' },
    { id: 'ai-trainer', label: 'Chuyên gia huấn luyện AI chatbot' }
  ];

  const mockAccounts = {
    doctor: { username: 'doctor1', password: 'doctor123' },
    manager: { username: 'manager1', password: 'manager123' },
    'ai-trainer': { username: 'aitrainer1', password: 'trainer123' }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const account = mockAccounts[selectedRole];
    if (username === account.username && password === account.password) {
      onLogin(selectedRole);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen  from-[#F4FDFC] to-[#DEF1EF] flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
    style={{ backgroundImage: `url(${bg2})` }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#479AA8] p-4 rounded-full mb-4">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-[#1F4A51] text-xl font-bold mb-2">Hệ thống quản lý phòng khám</h1>
            <p className="text-[#6B7280]">Chào mừng đến với hệ thống!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[#1F4A51] mb-3">Chọn vai trò của bạn</label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`px-4 py-3 rounded-3xl border-2 transition-all ${
                      selectedRole === role.id
                        ? 'bg-[#479AA8] border-[#479AA8] text-white'
                        : 'bg-white border-[#E5E7EB] text-[#1F4A51] hover:border-[#479AA8]'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8] text-[#1F4A51]"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8] text-[#1F4A51]"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#479AA8]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-3xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#479AA8] text-white py-3 rounded-3xl hover:bg-[#1F4A51] transition-colors"
            >
              Đăng nhập
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                className="text-[#479AA8] hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            {showForgotPassword && (
              <div className="bg-[#F4FDFC] border border-[#479AA8] rounded-3xl p-4 mt-4">
                <p className="text-[#1F4A51] mb-3">
                  Nếu quên mật khẩu, vui lòng liên hệ quản lý phòng khám để được hỗ trợ:
                </p>
                <div className="space-y-2 text-[#6B7280]">
                  <p>Hotline: 0123-456-789</p>
                  <p>Email: quanly@phongkham.vn</p>
                  <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-[#F4FDFC] rounded-3xl">
  <p className="text-sm text-[#6B7280] mb-2">Tài khoản demo:</p>
  <div className="text-sm space-y-2 text-[#1F4A51]">
    {[
      { role: 'doctor' as const, label: 'Bác sĩ', username: 'doctor1', password: 'doctor123' },
      { role: 'manager' as const, label: 'Quản lý', username: 'manager1', password: 'manager123' },
      { role: 'ai-trainer' as const, label: 'AI Trainer', username: 'aitrainer1', password: 'trainer123' },
    ].map((account) => (
      <div key={account.role} className="flex items-center justify-between">
        <p>{account.label}: {account.username} / {account.password}</p>
        <button
          type="button"
          onClick={() => {
            setSelectedRole(account.role);
            setUsername(account.username);
            setPassword(account.password);
            setError('');
          }}
          className="ml-3 px-2 py-1 rounded-xl text-xs flex-shrink-0 transition-colors"
          style={{
  backgroundColor: '#D1ECF0',
  color: '#1F4A51',
}}
        >
          Dùng
        </button>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
    </div>
  );
}

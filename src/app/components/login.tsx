import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Brain, ClipboardList, Eye, EyeOff, Stethoscope, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import bg2 from "@/imports/bg2.png";
import { COLOR_HEX, COLORS } from "@/styles/colors";

type RoleId = "doctor" | "manager" | "ai-trainer" | "patient";
type AuthView = "patient-login" | "register" | "otp" | "other-roles" | "staff-login";

interface LoginProps {
  onLogin: (role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [view, setView] = useState<AuthView>("patient-login");
const [, setViewHistory] = useState<AuthView[]>([]);

  const [selectedRole, setSelectedRole] = useState<RoleId>("patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [otp, setOtp] = useState("");

  const patientAccount = { username: "patient1@email.com", password: "patient123" };
  const MOCK_OTP = "123456";

  const mockAccounts: Record<
    Exclude<RoleId, "patient">,
    { username: string; password: string; label: string }
  > = {
    doctor: { username: "doctor1", password: "doctor123", label: "Bác sĩ" },
    manager: { username: "manager1", password: "manager123", label: "Quản lý" },
    "ai-trainer": {
      username: "aitrainer1",
      password: "trainer123",
      label: "Chuyên gia AI",
    },
  };

  const staffRoles: {
    id: Exclude<RoleId, "patient">;
    label: string;
    desc: string;
    Icon: LucideIcon;
    iconBg: string;
  }[] = [
    { id: "doctor", label: "Bác sĩ", desc: "Quản lý tư vấn và lịch khám", Icon: Stethoscope, iconBg: COLOR_HEX.BUTTON_CHOSEN },
    { id: "manager", label: "Quản lý", desc: "Quản trị phòng khám", Icon: ClipboardList, iconBg: COLOR_HEX.BUTTON_CHOSEN },
    { id: "ai-trainer", label: "Chuyên gia AI", desc: "Huấn luyện chatbot", Icon: Brain, iconBg: COLOR_HEX.BUTTON_CHOSEN },
  ];

  const viewIndex: Record<AuthView, number> = {
    "patient-login": 0,
    register: 1,
    otp: 2,
    "other-roles": 3,
    "staff-login": 4,
  };

  const goToView = (nextView: AuthView) => {
    if (nextView === view) return;
    setViewHistory((prev) => [...prev, view]);
    setView(nextView);
    setError("");
  };

  const goBack = () => {
    setError("");

    setViewHistory((prev) => {
      if (prev.length === 0) {
        setView("patient-login");
        return [];
      }

      const nextHistory = [...prev];
      const previousView = nextHistory.pop() || "patient-login";
      setView(previousView);
      return nextHistory;
    });
  };

  const resetToLanding = () => {
    setView("patient-login");
    setViewHistory([]);
    setSelectedRole("patient");
    setError("");
  };

  const goRegister = () => {
    setSelectedRole("patient");
    setRegisterName("");
    setRegisterPhone("");
    setRegisterEmail("");
    setOtp("");
    setError("");
    goToView("register");
  };

  const goOtherRoles = () => {
    setError("");
    goToView("other-roles");
  };

  const goStaffLogin = (role: Exclude<RoleId, "patient">) => {
    setSelectedRole(role);
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setError("");
    goToView("staff-login");
  };

  const quickLoginPatient = () => {
    setSelectedRole("patient");
    setUsername(patientAccount.username);
    setPassword(patientAccount.password);
    setError("");
  };

  const quickLoginStaff = (role: Exclude<RoleId, "patient">) => {
    const account = mockAccounts[role];
    setSelectedRole(role);
    setUsername(account.username);
    setPassword(account.password);
    setShowPassword(false);
    setError("");
    goToView("staff-login");
  };

  const handlePatientLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const loginId = username.trim();
    if (
      (loginId === patientAccount.username || loginId === "patient@example.com") &&
      password === patientAccount.password
    ) {
      onLogin("patient");
    } else {
      setError("SĐT/Email hoặc mật khẩu không đúng");
    }
  };

  const handleStaffLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedRole === "patient") return;

    const account = mockAccounts[selectedRole];
    if (username === account.username && password === account.password) {
      onLogin(selectedRole);
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!registerName || !registerPhone || !registerEmail || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    goToView("otp");
  };

  const handleOtp = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp === MOCK_OTP) {
      toast.success("Đã đăng ký tài khoản thành công");
      setRegisterName("");
      setRegisterPhone("");
      setRegisterEmail("");
      setOtp("");
      setPassword("");
      resetToLanding();
    } else {
      setError("Mã OTP không đúng (demo: 123456)");
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg2})` }}
    >
      <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 py-4">
        <div className="flex items-start gap-2">
          {view !== "patient-login" && <BackButton onClick={goBack} />}
          
          <div
            className="relative w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden border backdrop-blur-sm"
            style={{
              backgroundColor: "var(--color-white)",
              borderColor: COLOR_HEX.BORDER,
              maxHeight: "calc(100vh - 32px)",
            }}
          >

          <div
            className="flex w-[500%] transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${viewIndex[view] * 20}%)` }}
          >
            <AuthPanel active={view === "patient-login"}>
              <PanelShell
                title="AI Clinic"
                description="Chatbot tư vấn y tế thông minh dành cho bạn"
                showLogo
              >
                <form onSubmit={handlePatientLogin} className="w-full space-y-3">
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

                  <ErrorBox message={error} />

                  <SubmitButton label="Đăng nhập" />

                  <button
                    type="button"
                    onClick={quickLoginPatient}
                    className="w-full py-2.5 rounded-3xl text-sm font-medium transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: COLOR_HEX.LIGHTER,
                      color: COLOR_HEX.TEXT_PRIMARY,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLOR_HEX.HOVER;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLOR_HEX.LIGHTER;
                    }}
                  >
                    Đăng nhập nhanh
                  </button>

                  <div className="text-center pt-1 space-y-1">
                    <div>
                      <span className="text-sm" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
                        Chưa có tài khoản?{" "}
                      </span>
                      <button
                        type="button"
                        onClick={goRegister}
                        className="text-sm hover:underline font-medium"
                        style={{ color: COLOR_HEX.BUTTON_CHOSEN }}
                      >
                        Đăng ký ngay
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={goOtherRoles}
                      className="text-sm hover:underline font-medium"
                      style={{ color: COLOR_HEX.BUTTON_CHOSEN }}
                    >
                      Đăng nhập với vai trò khác
                    </button>
                  </div>
                </form>
              </PanelShell>
            </AuthPanel>

            <AuthPanel active={view === "register"}>
              <PanelShell
                title="Đăng ký tài khoản"
                description="Tạo tài khoản bệnh nhân để đặt lịch và theo dõi tư vấn"
              >
                <form onSubmit={handleRegister} className="w-full space-y-3">
                  <Field
                    label="Họ và tên"
                    value={registerName}
                    onChange={setRegisterName}
                    placeholder="VD: Nguyễn Văn A"
                    showRequired
                  />

                  <Field
                    label="Số điện thoại"
                    value={registerPhone}
                    onChange={setRegisterPhone}
                    placeholder="VD: 0986..."
                    showRequired
                  />

                  <Field
                    label="Email"
                    value={registerEmail}
                    onChange={setRegisterEmail}
                    type="email"
                    placeholder="VD: abc@email.com"
                    showRequired
                  />

                  <PasswordField
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    showRequired
                  />

                  <ErrorBox message={error} />

                  <SubmitButton label="Tiếp tục" />
                </form>
              </PanelShell>
            </AuthPanel>

            <AuthPanel active={view === "otp"}>
              <PanelShell
                title="Xác thực OTP"
                description={`Nhập mã OTP đã gửi tới ${registerPhone || "SĐT của bạn"} (demo: 123456)`}
              >
                <form onSubmit={handleOtp} className="w-full space-y-4">
                  <Field
                    label="Mã OTP"
                    value={otp}
                    onChange={setOtp}
                    placeholder="6 chữ số"
                  />

                  <ErrorBox message={error} />

                  <SubmitButton label="Xác thực" />
                </form>
              </PanelShell>
            </AuthPanel>

            <AuthPanel active={view === "other-roles"}>
              <PanelShell
                title="Lựa chọn vai trò của bạn"
                description="Các vai trò nội bộ dành cho nhân sự phòng khám"
              >
                <div className="w-full space-y-3">
                  {staffRoles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => goStaffLogin(role.id)}
                      className="w-full rounded-3xl overflow-hidden transition-all hover:shadow-sm border text-left flex items-center gap-4 px-4 py-3.5"
                      style={{
                        backgroundColor: COLOR_HEX.GRAY,
                        borderColor: COLOR_HEX.BORDER,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLOR_HEX.HOVER;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLOR_HEX.GRAY;
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
                        style={{ backgroundColor: role.iconBg }}
                      >
                        <role.Icon className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className="text font-semibold"
                          style={{ color: COLOR_HEX.TEXT_PRIMARY }}
                        >
                          {role.label}
                        </span>
                        <span
                          className="text-sm mt-0.5"
                          style={{ color: COLOR_HEX.TEXT_SECONDARY }}
                        >
                          {role.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </PanelShell>
            </AuthPanel>

            <AuthPanel active={view === "staff-login"}>
              <PanelShell
                title={`Đăng nhập ${selectedRole === "patient" ? "" : mockAccounts[selectedRole]?.label || ""}`}
                description="Nhập tài khoản để tiếp tục"
              >
                <form onSubmit={handleStaffLogin} className="w-full space-y-3">
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

                  <ErrorBox message={error} />

                  <SubmitButton label="Đăng nhập" />

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRole !== "patient") quickLoginStaff(selectedRole);
                    }}
                    className="w-full py-2.5 rounded-3xl text-sm font-medium transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: COLOR_HEX.LIGHTER,
                      color: COLOR_HEX.TEXT_PRIMARY,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLOR_HEX.HOVER;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLOR_HEX.LIGHTER;
                    }}
                  >
                    Đăng nhập nhanh
                  </button>
                </form>
              </PanelShell>
            </AuthPanel>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function AuthPanel({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <section
      className="w-1/5 flex-shrink-0"
      aria-hidden={!active}
      style={{ pointerEvents: active ? undefined : "none" }}
    >
      <div className="h-[min(680px,calc(100vh-32px))] min-h-[560px] overflow-y-auto px-6 sm:px-8 py-7">
        {children}
      </div>
    </section>
  );
}

function PanelShell({
  title,
  description,
  showLogo = false,
  children,
}: {
  title: string;
  description: string;
  showLogo?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 pt-2">
        {showLogo ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
            >
              <Stethoscope className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl font-bold" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
                {title}
              </h1>
              <p className="text-sm mt-1" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
                {description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold" style={{ color: COLOR_HEX.TEXT_PRIMARY }}>
                {title}
              </h1>
              <p className="text-sm mt-1" style={{ color: COLOR_HEX.TEXT_SECONDARY }}>
                {description}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex items-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-3xl flex items-center justify-center transition-all hover:shadow-sm"
      style={{
        backgroundColor: COLOR_HEX.HOVER,
        color: COLOR_HEX.TEXT_PRIMARY,
      }}
      aria-label="Quay lại"
    >
      <ArrowLeft size={18} />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  showRequired = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  showRequired?: boolean;
}) {
  return (
    <div>
      <label
        className="block mb-1.5 text-sm"
        style={{ color: COLOR_HEX.TEXT_PRIMARY }}
      >
        {label}
        {showRequired && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-3xl border text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-button-chosen)] transition-colors"
        style={{
          backgroundColor: "var(--color-white)",
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
  showRequired = false,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  showRequired?: boolean;
}) {
  return (
    <div>
      <label
        className="block mb-1.5 text-sm"
        style={{ color: COLOR_HEX.TEXT_PRIMARY }}
      >
        Mật khẩu
        {showRequired && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-12 rounded-3xl border text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-button-chosen)] transition-colors"
          style={{
            backgroundColor: "var(--color-white)",
            borderColor: COLOR_HEX.BORDER,
            color: COLOR_HEX.TEXT_PRIMARY,
          }}
          placeholder="Nhập mật khẩu"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
          style={{ color: COLOR_HEX.TEXT_SECONDARY }}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  const hasError = Boolean(message);

  return (
    <div
      className="px-4 text-sm text-center font-medium transition-colors duration-200 select-none min-h-5"
      style={{
        color: hasError ? "var(--color-destructive)" : "transparent",
      }}
    >
      {hasError ? message : "-"}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full text-white py-2.5 rounded-3xl transition-all hover:opacity-90 hover:shadow-sm"
      style={{ backgroundColor: COLOR_HEX.BUTTON_CHOSEN }}
    >
      {label}
    </button>
  );
}
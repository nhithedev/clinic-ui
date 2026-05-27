import { useState } from 'react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { usePatient } from '../patient-context';

type Tab = 'info' | 'edit' | 'health';

const inputClassName =
  'w-full px-4 py-3 rounded-3xl border focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]';

export function PatientProfile() {
  const { profile, updateProfile } = usePatient();
  const [tab, setTab] = useState<Tab>('info');
  const [form, setForm] = useState({ ...profile });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const saveProfile = () => {
    updateProfile(form);
    toast.success('Đã cập nhật thông tin');
    setTab('info');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 md:px-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['info', 'edit', 'health'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-3xl text-sm"
            style={{
              backgroundColor: tab === t ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
              color: tab === t ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
            }}
          >
            {t === 'info' && 'Thông tin'}
            {t === 'edit' && 'Chỉnh sửa'}
            {t === 'health' && 'Hồ sơ sức khỏe'}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="rounded-3xl p-6 space-y-3" style={{ backgroundColor: COLORS.WHITE }}>
          <p>
            <span style={{ color: COLORS.TEXT_SECONDARY }}>Họ tên: </span>
            {profile.name}
          </p>
          <p>
            <span style={{ color: COLORS.TEXT_SECONDARY }}>SĐT: </span>
            {profile.phone}
          </p>
          <p>
            <span style={{ color: COLORS.TEXT_SECONDARY }}>Email: </span>
            {profile.email}
          </p>
          <div className="pt-4 border-t" style={{ borderColor: COLORS.BORDER }}>
            <h4 className="font-medium mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
              Đổi mật khẩu
            </h4>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              className={`${inputClassName} mb-2`}
              style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className={`${inputClassName} mb-2`}
              style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              className={`${inputClassName} mb-2`}
              style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
            <button
              type="button"
              onClick={() => toast.success('Đã đổi mật khẩu (mock)')}
              className="px-4 py-2 rounded-3xl text-white text-sm"
              style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
            >
              Lưu mật khẩu
            </button>
          </div>
        </div>
      )}

      {tab === 'edit' && (
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <input
            className={inputClassName}
            style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Họ tên"
          />
          <input
            className={inputClassName}
            style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="SĐT"
          />
          <input
            className={inputClassName}
            style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />
          <button
            type="button"
            onClick={saveProfile}
            className="px-6 py-3 rounded-3xl text-white"
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Lưu
          </button>
        </div>
      )}

      {tab === 'health' && (
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
          <div>
            <h4 className="font-medium mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
              Tiền sử bệnh
            </h4>
            <ul className="list-disc pl-5 text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
              {profile.medicalHistory.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
              Dị ứng thuốc
            </h4>
            <ul className="list-disc pl-5 text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
              {profile.allergies.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { usePatient } from '../patient-context';

type Tab = 'info' | 'edit' | 'medical-history';


const inputClassName =
  'w-full min-w-0 px-4 py-3 rounded-3xl border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]';

const primaryButtonClassName =
  'px-6 py-3 rounded-3xl text-white transition-all duration-200 hover:opacity-85 active:scale-[0.98]';

const secondaryButtonClassName =
  'rounded-3xl transition-all duration-200 hover:opacity-85 active:scale-[0.98]';

export function PatientProfile() {
  const { profile, updateProfile } = usePatient();
  const [tab, setTab] = useState<Tab>('info');
  const [form, setForm] = useState({ ...profile });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [medicalHistory, setMedicalHistory] = useState(profile.medicalHistory);
  const [allergies, setAllergies] = useState(profile.allergies);

  const saveProfile = () => {
    updateProfile({
      ...form,
      medicalHistory: medicalHistory.filter((item) => item.trim()),
      allergies: allergies.filter((item) => item.trim()),
    });

    toast.success('Đã cập nhật thông tin');
    setTab('info');
  };

  const changePassword = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error('Vui lòng nhập đầy đủ thông tin mật khẩu');
      return;
    }

    if (passwords.next !== passwords.confirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    toast.success('Đã đổi mật khẩu (mock)');
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const cancelEdit = () => {
    setTab('info');
    setForm({ ...profile });
    setMedicalHistory(profile.medicalHistory);
    setAllergies(profile.allergies);
  };

  return (
    <div className="h-full min-h-0 w-full px-2 md:px-6 flex flex-col gap-4 overflow-hidden">
      <div className="flex-shrink-0 flex gap-2 flex-wrap">
        {(['info', 'edit'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-3xl text-sm transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
            style={{
              backgroundColor: tab === t ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
              color: tab === t ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
              border: `1px solid ${tab === t ? COLORS.BUTTON_CHOSEN : COLORS.BORDER}`,
            }}
          >
            {t === 'info' && 'Thông tin'}
            {t === 'edit' && 'Chỉnh sửa'}
            
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 pb-2">
        {tab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,.66fr)] gap-4 min-h-0">
            <div className="min-w-0 rounded-3xl p-6 space-y-3" style={{ backgroundColor: COLORS.WHITE }}>
              <h3 className="font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Thông tin
              </h3>

              <p className="break-words">
                <span style={{ color: COLORS.TEXT_SECONDARY }}>Họ tên: </span>
                {profile.name}
              </p>
              <p className="break-words">
                <span style={{ color: COLORS.TEXT_SECONDARY }}>SĐT: </span>
                {profile.phone}
              </p>
              <p className="break-words">
                <span style={{ color: COLORS.TEXT_SECONDARY }}>Email: </span>
                {profile.email}
              </p>

              <div className="pt-4 border-t" style={{ borderColor: COLORS.BORDER }}>
                <h4 className="font-medium mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
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
                  className={`${inputClassName} mb-3`}
                  style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />

                <button
                  type="button"
                  onClick={changePassword}
                  className={primaryButtonClassName}
                  style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                >
                  Lưu mật khẩu
                </button>
              </div>
            </div>

            <div className="min-w-0 rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
              <h3 className="font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Hồ sơ sức khỏe
              </h3>

              <div>
                <h4 className="font-medium mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Tiền sử bệnh
                </h4>

                {profile.medicalHistory.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                    {profile.medicalHistory.map((h) => (
                      <li key={h} className="break-words">
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                    Chưa có thông tin tiền sử bệnh
                  </p>
                )}
              </div>

              <div className="pt-3 border-t" style={{ borderColor: COLORS.BORDER }}>
                <h4 className="font-medium mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Dị ứng thuốc
                </h4>

                {profile.allergies.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                    {profile.allergies.map((a) => (
                      <li key={a} className="break-words">
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                    Chưa có thông tin dị ứng thuốc
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        

        {tab === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,.66fr)] gap-4 min-h-0">
            <div className="min-w-0 rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
              <h3 className="font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Chỉnh sửa thông tin
              </h3>

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
            </div>

            <div className="min-w-0 rounded-3xl p-6 space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
              <h3 className="font-semibold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Hồ sơ sức khỏe
              </h3>

              <div>
                <h4 className="font-medium mb-3 text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Tiền sử bệnh
                </h4>

                <div className="space-y-2">
                  {medicalHistory.map((h, idx) => (
                    <div key={idx} className="flex gap-2 min-w-0">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const updated = [...medicalHistory];
                          updated[idx] = e.target.value;
                          setMedicalHistory(updated);
                        }}
                        className={inputClassName}
                        style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
                        placeholder="Nhập tiền sử bệnh"
                      />

                      <button
                        type="button"
                        onClick={() => setMedicalHistory(medicalHistory.filter((_, i) => i !== idx))}
                        className={`shrink-0 px-3 py-2 ${secondaryButtonClassName}`}
                        style={{
                          backgroundColor: COLORS.LIGHTER,
                          color: COLORS.TEXT_PRIMARY,
                          border: `1px solid ${COLORS.BORDER}`,
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setMedicalHistory([...medicalHistory, ''])}
                    className={`w-full px-4 py-2 text-sm ${secondaryButtonClassName}`}
                    style={{
                      backgroundColor: COLORS.LIGHTER,
                      color: COLORS.TEXT_PRIMARY,
                      border: `1px solid ${COLORS.BORDER}`,
                    }}
                  >
                    + Thêm
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t" style={{ borderColor: COLORS.BORDER }}>
                <h4 className="font-medium mb-3 text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Dị ứng thuốc
                </h4>

                <div className="space-y-2">
                  {allergies.map((a, idx) => (
                    <div key={idx} className="flex gap-2 min-w-0">
                      <input
                        type="text"
                        value={a}
                        onChange={(e) => {
                          const updated = [...allergies];
                          updated[idx] = e.target.value;
                          setAllergies(updated);
                        }}
                        className={inputClassName}
                        style={{ borderColor: COLORS.BORDER, color: COLORS.TEXT_PRIMARY }}
                        placeholder="Nhập dị ứng thuốc"
                      />

                      <button
                        type="button"
                        onClick={() => setAllergies(allergies.filter((_, i) => i !== idx))}
                        className={`shrink-0 px-3 py-2 ${secondaryButtonClassName}`}
                        style={{
                          backgroundColor: COLORS.LIGHTER,
                          color: COLORS.TEXT_PRIMARY,
                          border: `1px solid ${COLORS.BORDER}`,
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setAllergies([...allergies, ''])}
                    className={`w-full px-4 py-2 text-sm ${secondaryButtonClassName}`}
                    style={{
                      backgroundColor: COLORS.LIGHTER,
                      color: COLORS.TEXT_PRIMARY,
                      border: `1px solid ${COLORS.BORDER}`,
                    }}
                  >
                    + Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {tab === 'edit' && (
        <div className="flex-shrink-0 flex gap-3 pb-1">
          <button
            type="button"
            onClick={saveProfile}
            className={primaryButtonClassName}
            style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
          >
            Lưu
          </button>

          <button
            type="button"
            onClick={cancelEdit}
            className={`px-6 py-3 ${secondaryButtonClassName}`}
            style={{
              backgroundColor: COLORS.WHITE,
              color: COLORS.TEXT_PRIMARY,
              border: `1px solid ${COLORS.BORDER}`,
            }}
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { usePatient } from '../patient-context';

type Tab = 'info' | 'edit' | 'medical-history';

interface MedicalVisitMock {
  id: number;
  date: string;
  specialty: string;
  doctorName: string;
  diagnosis: string;
  symptoms: string;
  prescription: string[];
  notes: string;
  status: 'done' | 'follow-up';
}

const mockMedicalVisits: MedicalVisitMock[] = [
  {
    id: 1,
    date: '2026-05-18',
    specialty: 'Tai Mũi Họng',
    doctorName: 'BS. Nguyễn Văn A',
    diagnosis: 'Viêm họng cấp',
    symptoms: 'Ho khan, đau họng, nghẹt mũi nhẹ trong 2 ngày',
    prescription: ['Nước muối sinh lý xịt mũi', 'Thuốc giảm đau hạ sốt khi cần', 'Uống nhiều nước ấm'],
    notes: 'Theo dõi thêm 3 ngày. Tái khám nếu sốt cao hoặc đau họng tăng.',
    status: 'done',
  },
  {
    id: 2,
    date: '2026-04-02',
    specialty: 'Nội khoa',
    doctorName: 'BS. Trần Thị B',
    diagnosis: 'Rối loạn tiêu hóa nhẹ',
    symptoms: 'Đau bụng từng cơn sau ăn, đầy hơi',
    prescription: ['Men vi sinh 5 ngày', 'Ăn mềm, tránh đồ cay nóng', 'Bù nước điện giải nếu tiêu chảy'],
    notes: 'Không ghi nhận dấu hiệu cấp cứu. Hẹn tái khám nếu kéo dài quá 1 tuần.',
    status: 'done',
  },
  {
    id: 3,
    date: '2026-03-10',
    specialty: 'Tim mạch',
    doctorName: 'ThS.BS. Lê Minh C',
    diagnosis: 'Theo dõi hồi hộp, đánh trống ngực',
    symptoms: 'Hồi hộp từng lúc, mệt khi thức khuya',
    prescription: ['Theo dõi huyết áp tại nhà', 'Hạn chế cà phê', 'Ngủ đủ giấc'],
    notes: 'Khuyến nghị đo điện tim nếu triệu chứng xuất hiện lại.',
    status: 'follow-up',
  },
];

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
        {(['info', 'edit', 'medical-history'] as Tab[]).map((t) => (
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
            {t === 'medical-history' && 'Lịch sử khám bệnh'}
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

        {tab === 'medical-history' && (
          <div className="space-y-4">
            <div className="rounded-3xl p-6" style={{ backgroundColor: COLORS.WHITE }}>
              <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                Lịch sử khám bệnh
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                Tổng hợp các lần khám, chẩn đoán và ghi chú điều trị gần đây.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {mockMedicalVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="min-w-0 rounded-3xl p-5 border space-y-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ backgroundColor: COLORS.WHITE, borderColor: COLORS.BORDER }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold break-words" style={{ color: COLORS.TEXT_PRIMARY }}>
                        {visit.diagnosis}
                      </p>
                      <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                        {new Date(visit.date).toLocaleDateString('vi-VN')} · {visit.specialty}
                      </p>
                    </div>

                    <span
                      className="shrink-0 px-3 py-1 rounded-3xl text-xs"
                      style={{
                        backgroundColor: visit.status === 'follow-up' ? COLORS.HOVER : COLORS.LIGHTER,
                        color: COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {visit.status === 'follow-up' ? 'Cần theo dõi' : 'Đã khám'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="break-words">
                      <span style={{ color: COLORS.TEXT_SECONDARY }}>Bác sĩ: </span>
                      <span style={{ color: COLORS.TEXT_PRIMARY }}>{visit.doctorName}</span>
                    </p>

                    <p className="break-words">
                      <span style={{ color: COLORS.TEXT_SECONDARY }}>Triệu chứng: </span>
                      <span style={{ color: COLORS.TEXT_PRIMARY }}>{visit.symptoms}</span>
                    </p>

                    <div>
                      <p className="mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                        Chỉ định / thuốc:
                      </p>
                      <ul className="list-disc pl-5 space-y-1" style={{ color: COLORS.TEXT_PRIMARY }}>
                        {visit.prescription.map((item) => (
                          <li key={item} className="break-words">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="break-words pt-2 border-t" style={{ borderColor: COLORS.BORDER }}>
                      <span style={{ color: COLORS.TEXT_SECONDARY }}>Ghi chú: </span>
                      <span style={{ color: COLORS.TEXT_PRIMARY }}>{visit.notes}</span>
                    </p>
                  </div>
                </div>
              ))}
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
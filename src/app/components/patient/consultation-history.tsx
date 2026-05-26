import { useState } from 'react';
import { COLORS } from '@/styles/colors';
import { usePatient, PatientConsultation } from '../patient-context';

export function ConsultationHistory() {
  const { consultations } = usePatient();
  const [selected, setSelected] = useState<PatientConsultation | null>(null);

  const levelLabel = (l: string) => {
    if (l === 'mild') return 'Nhẹ';
    if (l === 'urgent') return 'Khẩn';
    return 'Trung bình';
  };

  if (selected) {
    return (
      <div className="rounded-3xl p-6 space-y-4 max-w-2xl" style={{ backgroundColor: COLORS.WHITE }}>
        <button type="button" onClick={() => setSelected(null)} className="text-sm" style={{ color: COLORS.BUTTON_CHOSEN }}>
          ← Danh sách
        </button>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Chi tiết cuộc tư vấn
        </h3>
        <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
          {new Date(selected.date).toLocaleString('vi-VN')} · {levelLabel(selected.level)}
        </p>
        <p className="text-sm" style={{ color: COLORS.TEXT_PRIMARY }}>
          {selected.summary}
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {selected.messages.map((m, i) => (
            <div
              key={i}
              className="text-sm p-3 rounded-3xl"
              style={{
                backgroundColor: m.role === 'user' ? COLORS.LIGHTER : COLORS.GRAY,
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              <strong>{m.role === 'user' ? 'Bạn' : 'AI'}:</strong> {m.content}
            </div>
          ))}
        </div>
        {selected.rating && (
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Đánh giá: {selected.rating}/5 sao
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: COLORS.WHITE }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: COLORS.GRAY }}>
            <th className="text-left p-3">Ngày</th>
            <th className="text-left p-3">Mức độ</th>
            <th className="text-left p-3">Tóm tắt</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((c) => (
            <tr
              key={c.id}
              className="border-t cursor-pointer"
              style={{ borderColor: COLORS.BORDER }}
              onClick={() => setSelected(c)}
            >
              <td className="p-3" style={{ color: COLORS.TEXT_SECONDARY }}>
                {new Date(c.date).toLocaleDateString('vi-VN')}
              </td>
              <td className="p-3">{levelLabel(c.level)}</td>
              <td className="p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                {c.summary.slice(0, 50)}…
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {consultations.length === 0 && (
        <p className="p-6 text-center text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
          Chưa có lịch sử tư vấn
        </p>
      )}
    </div>
  );
}

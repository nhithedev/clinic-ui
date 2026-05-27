import { useState } from 'react';
import { COLORS } from '@/styles/colors';
import { usePatient, PatientConsultation } from '../patient-context';

const levelLabel = (level: string) => {
  if (level === 'mild') return 'Nhẹ';
  if (level === 'urgent') return 'Khẩn';
  return 'Trung bình';
};

export function ConsultationHistory() {
  const { consultations } = usePatient();
  const [selected, setSelected] = useState<PatientConsultation | null>(null);

  if (selected) {
  return (
    <div className="h-full min-h-0 w-full min-w-0 px-2 md:px-6 flex flex-col gap-4 overflow-hidden">
      <div
        className="rounded-3xl p-6 space-y-4 flex-shrink-0"
        style={{ backgroundColor: COLORS.WHITE }}
      >
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-sm"
          style={{ color: COLORS.BUTTON_CHOSEN }}
        >
          ← Danh sách
        </button>

        <div>
          <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Chi tiết cuộc tư vấn
          </h3>
          <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
            {new Date(selected.date).toLocaleString('vi-VN')} · {levelLabel(selected.level)}
          </p>
        </div>
      </div>

      <div
        className="rounded-3xl p-5 space-y-4 w-full min-w-0 flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: COLORS.GRAY }}
      >
        {selected.messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full min-w-0 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className="max-w-[78%] min-w-0 px-5 py-4 rounded-3xl text-sm leading-6 whitespace-pre-wrap break-words overflow-hidden"
              style={{
                backgroundColor: message.role === 'user' ? COLORS.BUTTON_CHOSEN : COLORS.WHITE,
                color: message.role === 'user' ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs px-2 flex-shrink-0" style={{ color: COLORS.TEXT_SECONDARY }}>
        Cuộc tư vấn cũ chỉ xem lại, không thể nhắn thêm.
      </p>
    </div>
  );
}

  return (
    <div className="w-full min-w-0 px-2 md:px-6 overflow-hidden">
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
            {consultations.map((consultation) => (
              <tr
                key={consultation.id}
                className="border-t cursor-pointer"
                style={{ borderColor: COLORS.BORDER }}
                onClick={() => setSelected(consultation)}
              >
                <td className="p-3" style={{ color: COLORS.TEXT_SECONDARY }}>
                  {new Date(consultation.date).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-3">{levelLabel(consultation.level)}</td>
                <td className="p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  {consultation.summary.slice(0, 80)}
                  {consultation.summary.length > 80 ? '…' : ''}
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
    </div>
  );
}
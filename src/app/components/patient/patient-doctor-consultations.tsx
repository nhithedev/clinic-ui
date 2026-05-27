import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Clock,
  Send,
  Stethoscope,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import {
  PatientDoctorConsultation,
  PatientDoctorConsultationMessage,
  usePatient,
} from '../patient-context';

const inputClassName =
  'flex-1 px-4 py-3 rounded-3xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-button-chosen)]';

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
}

function statusLabel(status: PatientDoctorConsultation['status']) {
  return status === 'resolved' ? 'Đã giải quyết' : 'Đang xử lý';
}

function senderName(
  message: PatientDoctorConsultationMessage,
  consultation: PatientDoctorConsultation,
) {
  if (message.sender === 'patient') return 'Bạn';
  if (message.sender === 'doctor') return consultation.doctor.name;
  return 'AI Chatbot';
}

function senderIcon(sender: PatientDoctorConsultationMessage['sender']) {
  if (sender === 'patient') return <User size={18} />;
  if (sender === 'doctor') return <Stethoscope size={18} />;
  return <Bot size={18} />;
}

export function PatientDoctorConsultations() {
  const { doctorConsultations, addDoctorConsultationMessage } = usePatient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const sortedConsultations = useMemo(() => {
    return [...doctorConsultations].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [doctorConsultations]);

  const selected = doctorConsultations.find((consultation) => consultation.id === selectedId);

  const handleSendMessage = () => {
    if (!selected || !message.trim()) return;

    addDoctorConsultationMessage(selected.id, message.trim());
    setMessage('');
    toast.success('Đã gửi tin nhắn cho bác sĩ');
  };

  if (selected) {
    return (
      <div className="p-2 h-full min-h-0 flex flex-col">
        <div className="flex-shrink-0 mb-4">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2 text-sm mb-4"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            <ArrowLeft size={18} />
            Quay lại danh sách
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
                Tư vấn với {selected.doctor.name}
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                {selected.summary}
              </p>
            </div>

            <span
              className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0"
              style={{
                backgroundColor:
                  selected.status === 'resolved' ? COLORS.LIGHTER : 'var(--color-warning-bg)',
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              {selected.status === 'resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
              {statusLabel(selected.status)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4">
          <div
            className="rounded-3xl border flex flex-col min-h-0 overflow-hidden"
            style={{ backgroundColor: COLORS.WHITE, borderColor: COLORS.BORDER }}
          >
            <div className="p-4 border-b flex-shrink-0" style={{ borderColor: COLORS.BORDER }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: COLORS.LIGHTER, color: COLORS.BUTTON_CHOSEN }}
                >
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                    {selected.doctor.name}
                  </h4>
                  <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                    {selected.doctor.specialty}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
              {selected.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'patient' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="max-w-[72%] min-w-0 rounded-3xl p-4 break-words"
                    style={{
                      backgroundColor:
                        msg.sender === 'patient'
                          ? COLORS.BUTTON_CHOSEN
                          : msg.sender === 'ai'
                            ? COLORS.HOVER
                            : COLORS.GRAY,
                      color: msg.sender === 'patient' ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
                      border:
                        msg.sender === 'patient'
                          ? 'none'
                          : `1px solid ${msg.sender === 'ai' ? COLORS.BUTTON_CHOSEN : COLORS.BORDER}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        style={{
                          color: msg.sender === 'patient' ? COLORS.WHITE : COLORS.BUTTON_CHOSEN,
                        }}
                      >
                        {senderIcon(msg.sender)}
                      </span>
                      <span
                        className="text-sm"
                        style={{
                          color: msg.sender === 'patient' ? COLORS.WHITE : COLORS.TEXT_SECONDARY,
                        }}
                      >
                        {senderName(msg, selected)}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className="text-xs mt-2"
                      style={{
                        color: msg.sender === 'patient' ? COLORS.WHITE : COLORS.TEXT_SECONDARY,
                      }}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selected.status !== 'resolved' && (
              <div className="p-4 border-t flex-shrink-0" style={{ borderColor: COLORS.BORDER }}>
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Nhập tin nhắn cho bác sĩ..."
                    className={inputClassName}
                    style={{
                      borderColor: COLORS.BORDER,
                      color: COLORS.TEXT_PRIMARY,
                      backgroundColor: COLORS.WHITE,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-5 py-3 rounded-3xl text-white disabled:opacity-50 flex items-center gap-2"
                    style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
                  >
                    <Send size={18} />
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="min-h-0 overflow-y-auto space-y-4">
            <div
              className="rounded-3xl border p-5"
              style={{ backgroundColor: COLORS.WHITE, borderColor: COLORS.BORDER }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="p-2 rounded-3xl"
                  style={{ backgroundColor: COLORS.HOVER, color: COLORS.BUTTON_CHOSEN }}
                >
                  <Bot size={20} />
                </div>
                <h4 className="font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Tóm tắt AI
                </h4>
              </div>

              <div
                className="rounded-3xl p-4 border"
                style={{
                  backgroundColor: COLORS.HOVER,
                  borderColor: COLORS.BUTTON_CHOSEN,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                <p className="text-sm whitespace-pre-wrap">{selected.aiSummary}</p>
              </div>
            </div>

            <div
              className="rounded-3xl border p-5"
              style={{ backgroundColor: COLORS.WHITE, borderColor: COLORS.BORDER }}
            >
              <h4 className="font-medium mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Thông tin bác sĩ
              </h4>

              <div className="space-y-3 text-sm">
                <div>
                  <p style={{ color: COLORS.TEXT_SECONDARY }}>Bác sĩ</p>
                  <p style={{ color: COLORS.TEXT_PRIMARY }}>{selected.doctor.name}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.TEXT_SECONDARY }}>Chuyên khoa</p>
                  <p style={{ color: COLORS.TEXT_PRIMARY }}>{selected.doctor.specialty}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.TEXT_SECONDARY }}>Phòng khám</p>
                  <p style={{ color: COLORS.TEXT_PRIMARY }}>{selected.doctor.clinicName}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.TEXT_SECONDARY }}>Điện thoại</p>
                  <p style={{ color: COLORS.TEXT_PRIMARY }}>{selected.doctor.phone}</p>
                </div>
                <div>
                  <p style={{ color: COLORS.TEXT_SECONDARY }}>Email</p>
                  <p className="break-words" style={{ color: COLORS.TEXT_PRIMARY }}>
                    {selected.doctor.email}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: COLORS.WHITE }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: COLORS.GRAY }}>
              <th className="text-left p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                Nội dung
              </th>
              <th className="text-left p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                Bác sĩ
              </th>
              <th className="text-left p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                Cập nhật
              </th>
              <th className="text-left p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedConsultations.map((consultation) => (
              <tr
                key={consultation.id}
                className="border-t cursor-pointer hover:opacity-90"
                style={{ borderColor: COLORS.BORDER }}
                onClick={() => setSelectedId(consultation.id)}
              >
                <td className="p-3">
                  <p className="font-medium line-clamp-1" style={{ color: COLORS.TEXT_PRIMARY }}>
                    {consultation.summary}
                  </p>
                  <p className="text-xs mt-1" style={{ color: COLORS.TEXT_SECONDARY }}>
                    {consultation.doctor.specialty}
                  </p>
                </td>
                <td className="p-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  {consultation.doctor.name}
                </td>
                <td className="p-3" style={{ color: COLORS.TEXT_SECONDARY }}>
                  {formatTimestamp(consultation.updatedAt)}
                </td>
                <td className="p-3">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs inline-flex items-center gap-1"
                    style={{
                      backgroundColor:
                        consultation.status === 'resolved'
                          ? COLORS.LIGHTER
                          : 'var(--color-warning-bg)',
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {consultation.status === 'resolved' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {statusLabel(consultation.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedConsultations.length === 0 && (
          <p className="p-6 text-center text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Chưa có cuộc tư vấn bác sĩ nào
          </p>
        )}
      </div>
    </div>
  );
}
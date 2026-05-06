import { X, Phone, Mail, MapPin, Calendar, MessageSquare, FileText, AlertCircle, CircleHelp, Bot } from 'lucide-react';

interface PatientQuickViewProps {
  patient: any;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export function PatientQuickView({ patient, onClose, onAccept, onReject }: PatientQuickViewProps) {
  const medicalHistory = [
    { date: '2026-03-15', diagnosis: 'Viêm họng', doctor: 'Dr. Nguyễn Văn A' },
    { date: '2026-02-10', diagnosis: 'Khám sức khỏe định kỳ', doctor: 'Dr. Nguyễn Văn A' }
  ];

  const chatHistory = [
    { date: '2026-04-29 22:30', message: 'Tôi bị đau đầu nhiều, có nên uống thuốc gì không?', response: 'AI đã tư vấn và đề xuất đặt lịch khám' },
    { date: '2026-04-28 20:15', message: 'Hỏi về giờ làm việc', response: 'AI cung cấp thông tin giờ làm việc' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] sticky top-0">
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between rounded-t-3xl">
        <h3 className="text-[#1F4A51] font-semibold">Thông tin bệnh nhân</h3>
        <button onClick={onClose} className="hover:bg-[#F5F5F7] p-1 rounded-3xl transition-colors text-[#6B7280]">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Basic Info */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#F4FDFC] rounded-full flex items-center justify-center">
              <span className="text-2xl text-[#479AA8]">{patient.patient.name.charAt(0)}</span>
            </div>
            <div>
              <h4 className="text-[#1F4A51] mb-1">{patient.patient.name}</h4>
              <p className="text-sm text-[#6B7280]">{patient.patient.age} tuổi • {patient.patient.gender}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <Phone className="w-4 h-4" />
              <span>{patient.patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]">
              <Mail className="w-4 h-4" />
              <span>patient@email.com</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]">
              <MapPin className="w-4 h-4" />
              <span>123 Đường ABC, Quận 1, TP.HCM</span>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-6 bg-[#F4FDFC] rounded-3xl p-4 border border-[#DEF1EF]">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#479AA8] mb-1">Tóm tắt AI / Priority</p>
              <p className="text-sm text-[#1F4A51]">{patient.aiSummary}</p>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#479AA8]" />
            <h4 className="text-[#1F4A51]">Lịch sử khám</h4>
          </div>
          <div className="space-y-3">
            {medicalHistory.map((record, index) => (
              <div key={index} className="bg-[#F5F5F7] rounded-3xl p-3 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{record.date}</span>
                </div>
                <p className="text-sm text-[#1F4A51] mb-1">{record.diagnosis}</p>
                <p className="text-xs text-[#6B7280]">BS: {record.doctor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription History */}
        <div className="mb-6">
          <h4 className="text-[#1F4A51] mb-3">Lịch sử thuốc</h4>
          <div className="bg-[#F5F5F7] rounded-3xl p-3 border border-[#E5E7EB]">
            <p className="text-sm text-[#1F4A51] mb-1">Paracetamol 500mg</p>
            <p className="text-xs text-[#6B7280]">Uống 3 lần/ngày sau ăn • 2026-03-15</p>
          </div>
        </div>

        {/* Chatbot History */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-[#479AA8]" />
            <h4 className="text-[#1F4A51]">Lịch sử chat Chatbot</h4>
          </div>
          <div className="space-y-3">
            {chatHistory.map((chat, index) => (
              <div key={index} className="bg-[#F5F5F7] rounded-3xl p-3 border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280] mb-2">{chat.date}</p>
                <p className="text-sm text-[#1F4A51] mb-1 flex items-start gap-1">
                  <CircleHelp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{chat.message}</span>
                </p>
                <p className="text-sm text-[#6B7280] flex items-start gap-1">
                  <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{chat.response}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Source & Data Status */}
        <div className="mb-6">
          <h4 className="text-[#1F4A51] mb-3">Nguồn yêu cầu & Dữ liệu</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Nguồn:</span>
              <span className="text-[#1F4A51]">{patient.source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Hồ sơ:</span>
              <span className="text-green-600">Đầy đủ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Xác thực:</span>
              <span className="text-green-600">Đã xác thực</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {patient.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={onReject}
              className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-3xl hover:bg-red-100 transition-colors"
            >
              Từ chối
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
            >
              Tiếp nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

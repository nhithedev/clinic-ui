import { useState } from 'react';
import { ArrowLeft, Send, Bot, User, Stethoscope, CheckCircle } from 'lucide-react';
import { useData } from './data-context';
import { toast } from 'sonner';

interface ConsultationChatProps {
  consultationId: number;
  onBack: () => void;
}

export function ConsultationChat({ consultationId, onBack }: ConsultationChatProps) {
  const { consultations, addConsultationMessage, updateConsultation } = useData();
  const consultation = consultations.find(c => c.id === consultationId);
  const [message, setMessage] = useState('');

  if (!consultation) {
    return (
      <div className="p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F4A51] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <p className="text-[#6B7280]">Không tìm thấy cuộc hội thoại</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    addConsultationMessage(consultationId, {
      sender: 'doctor',
      content: message,
      timestamp: new Date().toISOString()
    });

    setMessage('');
    toast.success('Đã gửi tin nhắn đến bệnh nhân');
  };

  const handleMarkResolved = () => {
    updateConsultation(consultationId, { status: 'resolved' });
    toast.success('Đã đánh dấu cuộc hội thoại là đã giải quyết');
    setTimeout(() => onBack(), 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'patient': return <User className="w-5 h-5" />;
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'ai': return <Bot className="w-5 h-5" />;
    }
  };

  const getSenderName = (sender: string) => {
    switch (sender) {
      case 'patient': return consultation.patient.name;
      case 'doctor': return 'BS. Nguyễn Văn A';
      case 'ai': return 'AI Chatbot';
    }
  };

  return (
    <div className="p-8 flex flex-col h-full">
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F4A51]"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách
          </button>
          {/* <div>
            <h1 className="text-[#1F4A51] mb-2">Hội thoại với {consultation.patient.name}</h1>
            <p className="text-[#6B7280]">{consultation.summary}</p>
          </div> */}
          {consultation.status !== 'resolved' && (
            <button
              onClick={handleMarkResolved}
              className="flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Đánh dấu đã giải quyết
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full grid grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="col-span-2 bg-white rounded-3xl border border-[#E5E7EB] flex flex-col min-h-0 h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#E5E7EB] bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#DEF1EF] p-2 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[#1F4A51]">{consultation.patient.name}</h3>
                  <p className="text-sm text-[#6B7280]">{consultation.patient.phone}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {consultation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    msg.sender === 'doctor'
                      ? 'bg-[#479AA8] text-white'
                      : msg.sender === 'ai'
                      ? 'bg-[#F4FDFC] text-[#1F4A51] border border-[#479AA8]'
                      : 'bg-[#F5F5F7] text-[#1F4A51] border border-[#E5E7EB]'
                  } rounded-3xl p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${msg.sender === 'doctor' ? 'text-white' : msg.sender === 'ai' ? 'text-[#479AA8]' : 'text-[#479AA8]'}`}>
                      {getSenderIcon(msg.sender)}
                    </div>
                    <span className={`text-sm ${msg.sender === 'doctor' ? 'text-white/90' : 'text-[#6B7280]'}`}>
                      {getSenderName(msg.sender)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-2 ${msg.sender === 'doctor' ? 'text-white/70' : 'text-[#6B7280]'}`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          {consultation.status !== 'resolved' && (
            <div className="p-4 border-t border-[#E5E7EB] bg-white flex-shrink-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 border border-[#E5E7EB] rounded-3xl bg-white focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-6 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>

          {/* AI Summary Sidebar */}
          <div className="col-span-1 min-h-0 h-full overflow-y-auto">
            <div className="space-y-6 pb-6">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-[#F4FDFC] p-2 rounded-3xl">
                    <Bot className="w-5 h-5 text-[#479AA8]" />
                  </div>
                  <h3 className="text-[#1F4A51]">Tóm tắt AI</h3>
                </div>
                <div className="bg-[#F4FDFC] rounded-3xl p-4 border border-[#479AA8]">
                  <p className="text-sm text-[#1F4A51] whitespace-pre-wrap">{consultation.aiSummary}</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6">
                <h3 className="text-[#1F4A51] mb-4">Thông tin bệnh nhân</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[#6B7280]">Họ tên</p>
                    <p className="text-[#1F4A51]">{consultation.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-[#6B7280]">Tuổi</p>
                    <p className="text-[#1F4A51]">{consultation.patient.age} tuổi</p>
                  </div>
                  <div>
                    <p className="text-[#6B7280]">Giới tính</p>
                    <p className="text-[#1F4A51]">{consultation.patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-[#6B7280]">Điện thoại</p>
                    <p className="text-[#1F4A51]">{consultation.patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-[#6B7280]">Email</p>
                    <p className="text-[#1F4A51] break-words">{consultation.patient.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

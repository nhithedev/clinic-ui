import { useState } from 'react';
import { Send, Star } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '@/styles/colors';
import { usePatient, ConsultationLevel } from '../patient-context';

type Phase = 'chat' | 'result' | 'care' | 'rating';

interface SymptomConsultationProps {
  onBookAppointment: () => void;
}

export function SymptomConsultation({ onBookAppointment }: SymptomConsultationProps) {
  const { addConsultation, rateConsultation, setBookingPrefill } = usePatient();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Xin chào! Bạn đang gặp triệu chứng gì?' },
  ]);
  const [input, setInput] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('chat');
  const [level, setLevel] = useState<ConsultationLevel>('moderate');
  const [rating, setRating] = useState(0);
  const [lastConsultationId, setLastConsultationId] = useState<number | null>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    const next = [...messages, userMsg];
    setInput('');

    if (questionCount < 1) {
      setQuestionCount((q) => q + 1);
      setMessages([
        ...next,
        {
          role: 'bot',
          content:
            'Cảm ơn bạn. Cho tôi biết thêm: triệu chứng xuất hiện bao lâu, mức độ đau (1-10), và bạn có đang dùng thuốc gì không?',
        },
      ]);
      return;
    }

    const lower = input.toLowerCase();
    const assessed: ConsultationLevel = lower.includes('ngực')
      ? 'urgent'
      : lower.includes('đau đầu') || lower.includes('nhẹ') || lower.includes('mệt')
        ? 'mild'
        : 'moderate';
    setLevel(assessed);
    const botSummary =
      assessed === 'urgent'
        ? 'Cảnh báo: Triệu chứng có thể nghiêm trọng. Bạn nên đi khám ngay.'
        : assessed === 'mild'
          ? 'Triệu chứng nhẹ — có thể tự theo dõi tại nhà.'
          : 'Dựa trên mô tả, bạn nên đặt lịch khám trong thời gian sớm.';

    const consultationId = addConsultation({
      date: new Date().toISOString(),
      summary: next.map((m) => m.content).join(' ').slice(0, 120),
      level: assessed,
      messages: [...next, { role: 'bot', content: botSummary }],
    });
    setMessages([...next, { role: 'bot', content: botSummary }]);
    setLastConsultationId(consultationId);
    setPhase('result');
  };

  const startBooking = () => {
    setBookingPrefill({ specialty: level === 'urgent' ? 'Tim mạch' : 'Nội khoa' });
    onBookAppointment();
  };

  if (phase === 'rating') {
    return (
      <div className="rounded-3xl p-6 max-w-lg mx-auto space-y-4" style={{ backgroundColor: COLORS.WHITE }}>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Đánh giá cuộc tư vấn
        </h3>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}>
              <Star
                size={28}
                fill={n <= rating ? COLORS.WARNING : 'none'}
                style={{ color: COLORS.WARNING }}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={rating === 0}
          onClick={() => {
            if (lastConsultationId && rating > 0) {
              rateConsultation(lastConsultationId, rating);
            }
            toast.success('Cảm ơn đánh giá của bạn');
            setPhase('chat');
            setMessages([{ role: 'bot', content: 'Xin chào! Bạn đang gặp triệu chứng gì?' }]);
            setQuestionCount(0);
            setLastConsultationId(null);
            setRating(0);
          }}
          className="w-full py-3 rounded-3xl text-white"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          Hoàn tất
        </button>
      </div>
    );
  }

  if (phase === 'care') {
    return (
      <div className="rounded-3xl p-6 space-y-4 max-w-lg" style={{ backgroundColor: COLORS.WHITE }}>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Hướng dẫn chăm sóc tại nhà
        </h3>
        <ul className="list-disc pl-5 text-sm space-y-2" style={{ color: COLORS.TEXT_SECONDARY }}>
          <li>Nghỉ ngơi, uống đủ nước</li>
          <li>Theo dõi triệu chứng 24–48h</li>
          <li>Tái khám nếu sốt cao hoặc đau tăng</li>
        </ul>
        <button
          type="button"
          onClick={() => setPhase('rating')}
          className="px-6 py-3 rounded-3xl text-white"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          Đánh giá cuộc tư vấn
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="rounded-3xl p-6 space-y-4 max-w-lg" style={{ backgroundColor: COLORS.WHITE }}>
        <h3 className="font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
          Kết quả đánh giá
        </h3>
        <p
          className="p-4 rounded-3xl text-sm"
          style={{
            backgroundColor: level === 'urgent' ? COLORS.WARNING_BG : COLORS.LIGHTER,
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          {level === 'mild' && 'Nhẹ — Tự theo dõi tại nhà'}
          {level === 'moderate' && 'Trung bình — Nên khám trong thời gian sớm'}
          {level === 'urgent' && 'Nặng — Cần đi khám ngay lập tức'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPhase('care')}
            className="px-4 py-2 rounded-3xl border text-sm"
          >
            Xem hướng dẫn chăm sóc
          </button>
          {level === 'mild' && (
            <button
              type="button"
              onClick={() => setPhase('care')}
              className="px-4 py-2 rounded-3xl text-white text-sm"
              style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
            >
              Xem hướng dẫn chăm sóc
            </button>
          )}
          {(level === 'moderate' || level === 'urgent') && (
            <button
              type="button"
              onClick={startBooking}
              className="px-4 py-2 rounded-3xl text-white text-sm"
              style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
            >
              Đặt lịch khám
            </button>
          )}
          <button
            type="button"
            onClick={() => setPhase('rating')}
            className="px-4 py-2 rounded-3xl text-sm"
            style={{ color: COLORS.BUTTON_CHOSEN }}
          >
            Bỏ qua — Đánh giá
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden flex flex-col max-w-2xl mx-auto" style={{ backgroundColor: COLORS.WHITE, minHeight: 480 }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] px-4 py-3 rounded-3xl text-sm"
              style={{
                backgroundColor: msg.role === 'user' ? COLORS.BUTTON_CHOSEN : COLORS.GRAY,
                color: msg.role === 'user' ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2" style={{ borderColor: COLORS.BORDER }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Mô tả triệu chứng..."
          className="flex-1 px-4 py-3 rounded-3xl border"
          style={{ borderColor: COLORS.BORDER }}
        />
        <button
          type="button"
          onClick={sendMessage}
          aria-label="Gửi tin nhắn"
          className="p-3 rounded-3xl text-white"
          style={{ backgroundColor: COLORS.BUTTON_CHOSEN }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

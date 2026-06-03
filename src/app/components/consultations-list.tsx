import { useState } from 'react';
import { MessageSquare, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useData } from './data-context';

interface ConsultationsListProps {
  onViewChat: (consultationId: number) => void;
}

export function ConsultationsList({ onViewChat }: ConsultationsListProps) {
  const { consultations } = useData();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');

  const filteredConsultations = consultations.filter(cons =>
    filterStatus === 'all' ? true : cons.status === filterStatus
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Khẩn cấp';
      case 'medium': return 'Trung bình';
      default: return 'Thấp';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#fff4e6] text-[#f4a261] border-[#f4a261]';
      case 'in-progress': return 'bg-[#F4FDFC] text-[#479AA8] border-[#479AA8]';
      default: return 'bg-green-50 text-green-600 border-green-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'in-progress': return 'Đang xử lý';
      default: return 'Đã giải quyết';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return `Vài giây trước`;
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const pendingCount = consultations.filter(c => c.status === 'pending').length;
  const inProgressCount = consultations.filter(c => c.status === 'in-progress').length;

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6 flex-shrink-0">
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Chờ xử lý</p>
              <p className="text-2xl text-[#f4a261]">{pendingCount}</p>
            </div>
            <div className="bg-[#fff4e6] p-3 rounded-3xl">
              <AlertCircle className="w-6 h-6 text-[#f4a261]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Đang xử lý</p>
              <p className="text-2xl text-[#479AA8]">{inProgressCount}</p>
            </div>
            <div className="bg-[#F4FDFC] p-3 rounded-3xl">
              <Clock className="w-6 h-6 text-[#479AA8]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Tổng số</p>
              <p className="text-2xl text-[#1F4A51]">{consultations.length}</p>
            </div>
            <div className="bg-[#F5F5F7] p-3 rounded-3xl">
              <MessageSquare className="w-6 h-6 text-[#1F4A51]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 mb-6 flex-shrink-0">
        <div className="flex gap-3">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ xử lý' },
            { id: 'in-progress', label: 'Đang xử lý' },
            { id: 'resolved', label: 'Đã giải quyết' }
          ].map(status => (
            <button
              key={status.id}
              onClick={() => setFilterStatus(status.id as any)}
              className={`px-4 py-2 rounded-3xl transition-colors ${
                filterStatus === status.id
                  ? 'bg-[#479AA8] text-white'
                  : 'bg-[#F5F5F7] text-[#6B7280] hover:bg-[#F4FDFC]'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Consultations List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {filteredConsultations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center">
            <MessageSquare className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
            <p className="text-[#6B7280]">Không có thắc mắc nào trong danh sách này</p>
          </div>
        ) : (
          filteredConsultations.map(consultation => (
            <div
              key={consultation.id}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-6 hover:shadow-3xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[#1F4A51]">{consultation.patient.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(consultation.priority)}`}>
                      {getPriorityLabel(consultation.priority)}
                    </span>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(consultation.status)}`}>
                      {getStatusIcon(consultation.status)}
                      {getStatusLabel(consultation.status)}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-1">
                    {consultation.patient.age} tuổi • {consultation.patient.gender} • {consultation.patient.phone}
                  </p>
                </div>
                <button
                  onClick={() => onViewChat(consultation.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </button>
              </div>

              <div className="bg-[#F5F5F7] rounded-3xl p-4 mb-5">
                <p className="text-sm text-[#6B7280] mb-1">Tóm tắt:</p>
                <p className="text-[#1F4A51]">{consultation.summary}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Clock className="w-4 h-4" />
                  <span>Tin nhắn gần nhất: {formatTime(consultation.lastMessageTime)}</span>
                </div>
                <div className="text-[#6B7280]">
                  {consultation.messages.length} tin nhắn
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

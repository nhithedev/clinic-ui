import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useAITrainer } from '../contexts/ai-trainer-context';

interface TrainingResultsProps {
  requestId: number;
  onBack: () => void;
}

export function TrainingResults({ requestId, onBack }: TrainingResultsProps) {
  const { requests, updateResultStatus } = useAITrainer();
  const request = requests.find(r => r.id === requestId);

  if (!request) {
    return (
      <div className="p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F4A51] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <p className="text-[#6B7280]">Không tìm thấy kết quả huấn luyện</p>
      </div>
    );
  }

  const handleAccept = (label: string) => {
    updateResultStatus(requestId, label, 'accepted');
  };

  const handleReject = (label: string) => {
    updateResultStatus(requestId, label, 'rejected');
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F4A51] mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại
      </button>

      <div className="mb-6">
        <h1 className="text-[#1F4A51] mb-2">Kết quả huấn luyện chi tiết</h1>
        <p className="text-[#6B7280]">Xem và đánh giá kết quả huấn luyện cho từng nhãn bệnh</p>
      </div>

      <div className="space-y-6">
        {/* Request Info */}
        <div className="bg-white rounded-3xl p-6">
          <h2 className="text-[#1F4A51] mb-4">Thông tin yêu cầu</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Tên dự án</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">{request.projectName}</p>
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Tập dữ liệu</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">{request.dataset}</p>
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Ngày tạo</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">
                {new Date(request.createdDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Người tạo</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">{request.creator}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-[#6B7280] mb-1">Tóm tắt mục tiêu và yêu cầu</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-3 rounded-3xl whitespace-pre-wrap">
                {request.goalSummary}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-[#6B7280] mb-1">Thông số kỹ thuật</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-3 rounded-3xl whitespace-pre-wrap">
                {request.technicalSpecs || 'Chưa cung cấp'}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-[#6B7280] mb-1">Tình trạng dữ liệu</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">
                {request.dataStatus || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>

        {/* Training Results */}
        <div className="bg-white rounded-3xl p-6">
          <h2 className="text-[#1F4A51] mb-4">Kết quả huấn luyện theo nhãn bệnh</h2>
          <div className="space-y-4">
            {request.results && request.results.length > 0 ? (
              request.results.map((result) => (
                <div
                  key={result.label}
                  className={`rounded-3xl p-6 ${
                    result.status === 'accepted'
                      ? 'bg-[#F4FDFC]'
                      : result.status === 'rejected'
                      ? 'bg-[#F5F5F7]'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-[#1F4A51] mb-1">{result.label}</h3>
                      {result.status === 'accepted' && (
                        <div className="flex items-center gap-2 text-sm text-[#479AA8]">
                          <CheckCircle className="w-4 h-4" />
                          <span>Đã chấp nhận</span>
                        </div>
                      )}
                      {result.status === 'rejected' && (
                        <div className="flex items-center gap-2 text-sm text-[#d4183d]">
                          <XCircle className="w-4 h-4" />
                          <span>Đã từ chối</span>
                        </div>
                      )}
                    </div>
                    {result.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(result.label)}
                            className="px-4 py-2 border border-transparent text-[#d4183d] rounded-3xl hover:bg-[#F4FDFC] hover:border-[#E2E2E2] transition-colors"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleAccept(result.label)}
                            className="px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
                        >
                          Chấp nhận
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[#F5F5F7] rounded-3xl p-4">
                      <p className="text-sm text-[#6B7280] mb-1">Accuracy</p>
                      <p className="text-xl text-[#1F4A51]">{(result.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-[#F5F5F7] rounded-3xl p-4">
                      <p className="text-sm text-[#6B7280] mb-1">Precision</p>
                      <p className="text-xl text-[#1F4A51]">{(result.precision * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-[#F5F5F7] rounded-3xl p-4">
                      <p className="text-sm text-[#6B7280] mb-1">Recall</p>
                      <p className="text-xl text-[#1F4A51]">{(result.recall * 100).toFixed(1)}%</p>
                    </div>
                    <div className="bg-[#F5F5F7] rounded-3xl p-4">
                      <p className="text-sm text-[#6B7280] mb-1">F1 Score</p>
                      <p className="text-xl text-[#1F4A51]">{(result.f1Score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#6B7280]">
                Chưa có kết quả huấn luyện
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

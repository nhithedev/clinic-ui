import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAITrainer, DatasetRow } from '../contexts/ai-trainer-context';

interface RequestDetailProps {
  requestId: number;
  onBack: () => void;
}

export function RequestDetail({ requestId, onBack }: RequestDetailProps) {
  const { requests, acceptRequest, rejectRequest, updateDatasetContent } = useAITrainer();
  const request = requests.find(r => r.id === requestId);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [editableDataset, setEditableDataset] = useState<DatasetRow[]>(
    request?.datasetContent || []
  );

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
        <p className="text-[#6B7280]">Không tìm thấy yêu cầu</p>
      </div>
    );
  }

  const handleAccept = () => {
    updateDatasetContent(requestId, editableDataset);
    acceptRequest(requestId);
    onBack();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectRequest(requestId, rejectReason);
    setShowRejectModal(false);
    onBack();
  };

  const addRow = () => {
    setEditableDataset([
      ...editableDataset,
      { id: Date.now(), symptom: '', diagnosis: '', confidence: 0, notes: '' }
    ]);
  };

  const updateRow = (id: number, field: string, value: any) => {
    setEditableDataset(
      editableDataset.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const deleteRow = (id: number) => {
    setEditableDataset(editableDataset.filter(row => row.id !== id));
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
        <h1 className="text-[#1F4A51] mb-2">Chi tiết yêu cầu huấn luyện</h1>
        <p className="text-[#6B7280]">Xem và chỉnh sửa thông tin yêu cầu</p>
      </div>

      <div className="space-y-6">
        {/* Request Info */}
        <div className="bg-white rounded-3xl p-6">
          <h2 className="text-[#1F4A51] mb-4">Thông tin yêu cầu</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Tên dự án</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">{request.projectName}</p>
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Tập dữ liệu</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">{request.dataset}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Tóm tắt mục tiêu và yêu cầu</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-3 rounded-3xl whitespace-pre-wrap">
                {request.goalSummary}
              </p>
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Thông số kỹ thuật</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-3 rounded-3xl whitespace-pre-wrap">
                {request.technicalSpecs || 'Chưa cung cấp'}
              </p>
            </div>
            <div>
              <label className="block text-sm text-[#6B7280] mb-1">Tình trạng dữ liệu</label>
              <p className="text-[#1F4A51] bg-[#F5F5F7] px-4 py-2 rounded-3xl">
                {request.dataStatus || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Content */}
        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1F4A51]">Nội dung tập dữ liệu</h2>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-3 py-2 bg-[#F4FDFC] text-[#479AA8] rounded-3xl hover:bg-[#DEF1EF] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm dòng
            </button>
          </div>
          <div className="rounded-3xl overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F5F5F7]">
                <tr>
                  <th className="text-left px-4 py-3 text-[#1F4A51] w-[35%]">Triệu chứng</th>
                  <th className="text-left px-4 py-3 text-[#1F4A51] w-[25%]">Chẩn đoán</th>
                  <th className="text-left px-4 py-3 text-[#1F4A51] w-[15%]">Độ tin cậy</th>
                  <th className="text-left px-4 py-3 text-[#1F4A51] w-[20%]">Ghi chú</th>
                  <th className="text-left px-4 py-3 text-[#1F4A51] w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {editableDataset.map((row) => (
                  <tr key={row.id} className="border-t border-[#E5E7EB]">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.symptom}
                        onChange={(e) => updateRow(row.id, 'symptom', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                        placeholder="Nhập triệu chứng"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.diagnosis}
                        onChange={(e) => updateRow(row.id, 'diagnosis', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                        placeholder="Chẩn đoán"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={row.confidence}
                        onChange={(e) => updateRow(row.id, 'confidence', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                        placeholder="0.0-1.0"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.notes}
                        onChange={(e) => updateRow(row.id, 'notes', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                        placeholder="Ghi chú"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="p-2 text-red-600 hover:bg-[#F4FDFC] rounded-3xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {editableDataset.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">
                      Chưa có dữ liệu. Nhấn "Thêm dòng" để bắt đầu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setShowRejectModal(true)}
            className="px-6 py-3 border border-transparent text-[#d4183d] rounded-3xl hover:bg-[#F4FDFC] hover:border-[#E2E2E2] transition-colors"
          >
            Từ chối
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
          >
            Chấp nhận và bắt đầu huấn luyện
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h3 className="text-[#1F4A51] mb-4">Từ chối yêu cầu huấn luyện</h3>
            <p className="text-sm text-[#6B7280] mb-4">Vui lòng nhập lý do từ chối:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 min-h-[120px] transition-colors"
              placeholder="Nhập lý do từ chối..."
            />
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-transparent text-[#1F4A51] rounded-3xl hover:bg-[#F5F5F7] hover:border-[#E2E2E2] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-[#d4183d] text-white rounded-3xl hover:bg-[#b01030] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

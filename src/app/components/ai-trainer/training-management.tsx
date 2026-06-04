import { useState } from 'react';
import { Search, Plus, Clock, CheckCircle2, Loader } from 'lucide-react';
import { useAITrainer } from '../contexts/ai-trainer-context';

interface TrainingManagementProps {
  onViewDetail: (id: number) => void;
  onViewResult: (id: number) => void;
}

export function TrainingManagement({ onViewDetail, onViewResult }: TrainingManagementProps) {
  const { requests, addRequest, getTrainingRequest } = useAITrainer();
  const [activeTab, setActiveTab] = useState<'requests' | 'training' | 'completed'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    dataset: '',
    creator: 'Nguyễn Văn Expert',
    goalSummary: '',
    technicalSpecs: '',
    dataStatus: '',
    datasetContent: [
      { id: 1, symptom: '', diagnosis: '', confidence: 0, notes: '' }
    ]
  });

  const tabs = [
    { id: 'requests' as const, label: 'Danh sách yêu cầu', icon: Clock },
    { id: 'training' as const, label: 'Đang huấn luyện', icon: Loader },
    { id: 'completed' as const, label: 'Đã hoàn thành', icon: CheckCircle2 }
  ];

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const trainingRequest = getTrainingRequest();
  const completedRequests = requests.filter(r => r.status === 'completed');

  const filteredRequests = (activeTab === 'requests' ? pendingRequests : completedRequests).filter(req =>
    req.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.dataset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRequest = () => {
    if (!formData.projectName || !formData.dataset || !formData.goalSummary) {
      return;
    }

    addRequest({
      ...formData,
      datasetContent: formData.datasetContent.filter(row => row.symptom && row.diagnosis)
    });

    setFormData({
      projectName: '',
      dataset: '',
      creator: 'Nguyễn Văn Expert',
      goalSummary: '',
      technicalSpecs: '',
      dataStatus: '',
      datasetContent: [{ id: 1, symptom: '', diagnosis: '', confidence: 0, notes: '' }]
    });
    setShowCreateForm(false);
  };

  const addDatasetRow = () => {
    setFormData({
      ...formData,
      datasetContent: [
        ...formData.datasetContent,
        { id: Date.now(), symptom: '', diagnosis: '', confidence: 0, notes: '' }
      ]
    });
  };

  const updateDatasetRow = (id: number, field: string, value: any) => {
    setFormData({
      ...formData,
      datasetContent: formData.datasetContent.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    });
  };

  const removeDatasetRow = (id: number) => {
    setFormData({
      ...formData,
      datasetContent: formData.datasetContent.filter(row => row.id !== id)
    });
  };

  return (
    <div className="p-8">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex bg-[#F5F5F7] rounded-3xl p-1 overflow-hidden w-fit max-w-full">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-4 rounded-3xl bg-[#F5F5F7] transition-colors ${
                  isActive
                    ? 'text-[#479AA8]'
                    : 'text-[#1F4A51] hover:text-[#1F4A51] hover:bg-[#F5F5F7]]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute left-4 right-4 bottom-1 h-0.5 bg-[#479AA8] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className="p-6">
          {/* Danh sách yêu cầu */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1F4A51]" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên dự án, dataset, người tạo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tạo yêu cầu mới
                </button>
              </div>

              {/* Create Form Modal */}
              {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white p-6">
                      <h2 className="text-[#1F4A51]">Tạo yêu cầu huấn luyện mới</h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Tên dự án *</label>
                        <input
                          type="text"
                          value={formData.projectName}
                          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                          className="w-full px-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                          placeholder="Nhập tên dự án"
                        />
                      </div>
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Tập dữ liệu *</label>
                        <input
                          type="text"
                          value={formData.dataset}
                          onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
                          className="w-full px-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                          placeholder="Tên file dữ liệu (vd: dataset.csv)"
                        />
                      </div>
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Tóm tắt mục tiêu và yêu cầu *</label>
                        <textarea
                          value={formData.goalSummary}
                          onChange={(e) => setFormData({ ...formData, goalSummary: e.target.value })}
                          className="w-full px-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 min-h-[100px] transition-colors"
                          placeholder="Mô tả mục tiêu và yêu cầu của dự án"
                        />
                      </div>
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Thông số kỹ thuật</label>
                        <textarea
                          value={formData.technicalSpecs}
                          onChange={(e) => setFormData({ ...formData, technicalSpecs: e.target.value })}
                          className="w-full px-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 min-h-[80px] transition-colors"
                          placeholder="Mô hình, hyperparameters, batch size, learning rate..."
                        />
                      </div>
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Tình trạng dữ liệu</label>
                        <input
                          type="text"
                          value={formData.dataStatus}
                          onChange={(e) => setFormData({ ...formData, dataStatus: e.target.value })}
                          className="w-full px-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                          placeholder="Đã làm sạch, cần bổ sung, hoàn chỉnh..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-[#1F4A51]">Nội dung tập dữ liệu</label>
                          <button
                            onClick={addDatasetRow}
                            className="text-sm px-3 py-1 bg-[#F4FDFC] text-[#479AA8] rounded-3xl hover:bg-[#DEF1EF]"
                          >
                            + Thêm dòng
                          </button>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {formData.datasetContent.map((row) => (
                            <div key={row.id} className="grid grid-cols-12 gap-2 items-start">
                              <input
                                type="text"
                                value={row.symptom}
                                onChange={(e) => updateDatasetRow(row.id, 'symptom', e.target.value)}
                                className="col-span-4 px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                                placeholder="Triệu chứng"
                              />
                              <input
                                type="text"
                                value={row.diagnosis}
                                onChange={(e) => updateDatasetRow(row.id, 'diagnosis', e.target.value)}
                                className="col-span-3 px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                                placeholder="Chẩn đoán"
                              />
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={row.confidence}
                                onChange={(e) => updateDatasetRow(row.id, 'confidence', parseFloat(e.target.value) || 0)}
                                className="col-span-2 px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                                placeholder="0.0-1.0"
                              />
                              <input
                                type="text"
                                value={row.notes}
                                onChange={(e) => updateDatasetRow(row.id, 'notes', e.target.value)}
                                className="col-span-2 px-3 py-2 text-sm border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                                placeholder="Ghi chú"
                              />
                              <button
                                onClick={() => removeDatasetRow(row.id)}
                                className="col-span-1 px-2 py-2 text-sm text-red-600 hover:bg-[#F4FDFC] rounded-3xl"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="sticky bottom-0 bg-white p-6 border-t border-[#E5E7EB] flex gap-3 justify-end">
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 border border-transparent text-[#1F4A51] rounded-3xl hover:bg-[#F5F5F7] hover:border-[#E2E2E2] transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleCreateRequest}
                        className="px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!formData.projectName || !formData.dataset || !formData.goalSummary}
                      >
                        Tạo yêu cầu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Requests Table */}
              <div className="bg-white rounded-3xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F5F5F7]">
                    <tr>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Tên dự án</th>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Tập dữ liệu</th>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Ngày tạo</th>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Người tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr
                        key={request.id}
                        onClick={() => onViewDetail(request.id)}
                        className="border-t border-[#E2E2E2] hover:bg-[#F4FDFC] cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-[#1F4A51]">{request.projectName}</td>
                        <td className="px-6 py-4 text-[#6B7280]">{request.dataset}</td>
                        <td className="px-6 py-4 text-[#6B7280]">
                          {new Date(request.createdDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280]">{request.creator}</td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-[#6B7280]">
                          {searchTerm ? 'Không tìm thấy yêu cầu nào' : 'Chưa có yêu cầu huấn luyện nào'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Đang huấn luyện */}
          {activeTab === 'training' && (
            <div>
              {trainingRequest ? (
                <div className="space-y-6">
                  <div className="bg-[#F4FDFC] border border-transparent rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Loader className="w-5 h-5 text-[#479AA8] animate-spin" />
                      <h3 className="text-[#1F4A51]">Đang huấn luyện model</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#1F4A51]">Tiến độ</span>
                          <span className="text-[#479AA8]">{Math.round(trainingRequest.trainingProgress || 0)}%</span>
                        </div>
                        <div className="w-full bg-[#F5F5F7] rounded-3xl h-3 overflow-hidden">
                          <div
                            className="bg-[#479AA8] h-full rounded-3xl transition-all duration-500"
                            style={{ width: `${trainingRequest.trainingProgress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tên dự án</label>
                      <p className="text-[#1F4A51]">{trainingRequest.projectName}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tập dữ liệu</label>
                      <p className="text-[#1F4A51]">{trainingRequest.dataset}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tóm tắt mục tiêu</label>
                      <p className="text-[#1F4A51]">{trainingRequest.goalSummary}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Thông số kỹ thuật</label>
                      <p className="text-[#1F4A51]">{trainingRequest.technicalSpecs}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tình trạng dữ liệu</label>
                      <p className="text-[#1F4A51]">{trainingRequest.dataStatus}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Loader className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#6B7280]">Chưa có yêu cầu nào đang được huấn luyện</p>
                </div>
              )}
            </div>
          )}

          {/* Đã hoàn thành */}
          {activeTab === 'completed' && (
            <div>
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F5F5F7]">
                    <tr>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Tên dự án</th>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Tập dữ liệu</th>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Ngày tạo</th>
                      <th className="text-left px-6 py-3 text-[#1F4A51]">Người tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr
                        key={request.id}
                        onClick={() => onViewResult(request.id)}
                        className="border-t border-[#E2E2E2] hover:bg-[#F4FDFC] cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-[#1F4A51]">{request.projectName}</td>
                        <td className="px-6 py-4 text-[#6B7280]">{request.dataset}</td>
                        <td className="px-6 py-4 text-[#6B7280]">
                          {new Date(request.createdDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-[#6B7280]">{request.creator}</td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-[#6B7280]">
                          {searchTerm ? 'Không tìm thấy yêu cầu nào' : 'Chưa có yêu cầu nào hoàn thành'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

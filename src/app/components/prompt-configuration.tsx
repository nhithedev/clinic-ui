import { useState } from 'react';
import { FileText, TestTube, X, Send, ChevronDown } from 'lucide-react';
import { useAITrainer } from './ai-trainer-context';

export function PromptConfiguration() {
  const { promptConfig, updatePromptConfig, getAllDiseaseLabels } = useAITrainer();
  const [activeTab, setActiveTab] = useState<'editor' | 'test'>('editor');
  const [systemRole, setSystemRole] = useState(promptConfig.systemRole);
  const [contextInjection, setContextInjection] = useState(promptConfig.contextInjection);
  const [diseaseLabels, setDiseaseLabels] = useState<string[]>(promptConfig.diseaseLabels);
  const [testDisease, setTestDisease] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = [
    { id: 'editor' as const, label: 'Soạn thảo Prompt', icon: FileText },
    { id: 'test' as const, label: 'Kiểm thử', icon: TestTube }
  ];

  const allDiseases = getAllDiseaseLabels();
  const availableDiseases = allDiseases.filter(d => !diseaseLabels.includes(d));

  const handleAddDisease = (disease: string) => {
    if (disease && !diseaseLabels.includes(disease)) {
      const newLabels = [...diseaseLabels, disease];
      setDiseaseLabels(newLabels);
      setShowDropdown(false);
    }
  };

  const handleRemoveDisease = (disease: string) => {
    setDiseaseLabels(diseaseLabels.filter(d => d !== disease));
  };

  const handleSaveConfig = () => {
    updatePromptConfig({
      diseaseLabels,
      systemRole,
      contextInjection
    });
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...chatMessages,
      { role: 'user' as const, content: userInput }
    ];

    // Mock AI response
    const mockResponse = `Dựa trên triệu chứng bạn mô tả, tôi nhận thấy có khả năng bạn đang gặp phải ${testDisease || 'một vấn đề sức khỏe'}.

Độ tin cậy: 87%
Triệu chứng phù hợp: ${userInput}

Tôi khuyên bạn nên:
1. Nghỉ ngơi đầy đủ
2. Uống nhiều nước
3. Theo dõi triệu chứng trong 24-48 giờ tới
4. Nếu triệu chứng không giảm hoặc nặng hơn, hãy đến gặp bác sĩ

Lưu ý: Đây chỉ là đánh giá sơ bộ, không thay thế cho tư vấn y tế chuyên nghiệp.`;

    newMessages.push({ role: 'assistant' as const, content: mockResponse });
    setChatMessages(newMessages);
    setUserInput('');
  };

  const contextTags = [
    '{tên_bệnh}',
    '{độ_tin_cậy}',
    '{triệu_chứng_người_dùng}',
    '{ngày_tháng}',
    '{lịch_sử_chat}'
  ];

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
                  : 'text-[#1F4A51] hover:text-[#1F4A51] hover:bg-[#F5F5F7]'
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
          {/* Soạn thảo Prompt */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Disease Label Selection */}
              <div>
                <label className="block text-[#1F4A51] font-semibold mb-3">Chọn nhãn bệnh để cấu hình</label>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={availableDiseases.length === 0}
                    className="w-full flex items-center justify-between px-4 py-3 border border-transparent rounded-3xl bg-[#F5F5F7] hover:bg-[#F4FDFC] hover:border-[#E2E2E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-[#1F4A51]">
                      {availableDiseases.length > 0 ? 'Chọn nhãn bệnh...' : 'Tất cả nhãn bệnh đã được cấu hình'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[#1F4A51]" />
                  </button>

                  {showDropdown && availableDiseases.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-3xl shadow-3xl max-h-[200px] overflow-y-auto">
                      {availableDiseases.map((disease) => (
                        <button
                          key={disease}
                          onClick={() => handleAddDisease(disease)}
                          className="w-full text-left px-4 py-3 hover:bg-[#F4FDFC] transition-colors text-[#1F4A51]"
                        >
                          {disease}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Disease Tags */}
                {diseaseLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {diseaseLabels.map((label) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl"
                      >
                        <span>{label}</span>
                        <button
                          onClick={() => handleRemoveDisease(label)}
                          className="hover:bg-[#1F4A51] rounded-3xl p-0.5 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Role */}
              <div>
                <label className="block text-[#1F4A51] font-semibold mb-3">Định nghĩa vai trò hệ thống (System Role)</label>
                <textarea
                  value={systemRole}
                  onChange={(e) => setSystemRole(e.target.value)}
                  className="w-full px-4 py-3 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 min-h-[150px] resize-y transition-colors"
                  placeholder="Ví dụ: Bạn là một chuyên gia tư vấn y tế thấu cảm, sử dụng kết quả chẩn đoán từ hệ thống AI để đưa ra lời khuyên sức khỏe cho bệnh nhân. Bạn luôn tập trung vào sự an toàn, khuyến khích bệnh nhân đến gặp bác sĩ khi cần thiết."
                />
              </div>

              {/* Context Injection */}
              <div>
                <label className="block text-[#1F4A51] font-semibold mb-3">Cấu hình Context Injection</label>
                <div className="bg-[#F5F5F7] rounded-3xl p-4 mb-3">
                  <p className="text-sm text-[#1F4A51] mb-3">Các tag có sẵn:</p>
                  <div className="flex flex-wrap gap-2">
                    {contextTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setContextInjection(contextInjection + ' ' + tag)}
                        className="px-3 py-1.5 bg-white border border-transparent text-[#1F4A51] rounded-3xl hover:bg-[#F4FDFC] hover:border-[#E2E2E2] transition-colors text-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={contextInjection}
                  onChange={(e) => setContextInjection(e.target.value)}
                  className="w-full px-4 py-3 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 min-h-[120px] resize-y transition-colors"
                  placeholder="Ví dụ: Bệnh nhân có triệu chứng: {triệu_chứng_người_dùng}. Hệ thống AI chẩn đoán khả năng cao là {tên_bệnh} với độ tin cậy {độ_tin_cậy}%. Hãy tư vấn cho bệnh nhân một cách thấu cảm và chuyên nghiệp."
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveConfig}
                  className="px-6 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
                >
                  Lưu cấu hình
                </button>
              </div>
            </div>
          )}

          {/* Kiểm thử */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              {/* Disease Selection */}
              <div>
                <label className="block text-[#1F4A51] mb-3">Chọn bệnh để mô phỏng</label>
                <select
                  value={testDisease}
                  onChange={(e) => {
                    setTestDisease(e.target.value);
                    setChatMessages([]);
                  }}
                  className="w-full px-4 py-3 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 transition-colors"
                >
                  <option value="">-- Chọn bệnh --</option>
                  {allDiseases.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chat Window */}
              <div>
                <label className="block text-[#1F4A51] mb-3">Cửa sổ chat mô phỏng</label>
                <div className="rounded-3xl bg-white overflow-hidden">
                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[#1F4A51]">
                        <p>Chọn bệnh và bắt đầu trò chuyện để kiểm thử chatbot</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 rounded-3xl ${
                              msg.role === 'user'
                                ? 'bg-[#479AA8] text-white'
                                : 'bg-[#F5F5F7] text-[#1F4A51]'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-[#E5E7EB] p-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Nhập triệu chứng hoặc câu hỏi..."
                        disabled={!testDisease}
                        className="flex-1 px-4 py-3 border border-transparent rounded-3xl bg-[#F5F5F7] hover:border-[#E2E2E2] focus:outline-none focus:border-[#E2E2E2] focus:ring-0 disabled:opacity-50 transition-colors"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!userInput.trim() || !testDisease}
                        className="px-6 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <label className="block text-[#1F4A51] mb-3">Chỉ số đánh giá nhanh</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#F4FDFC] rounded-3xl p-4">
                    <p className="text-sm text-[#1F4A51] mb-1">Accuracy</p>
                    <p className="text-2xl text-[#479AA8]">
                      {chatMessages.length > 0 ? '92%' : '--%'}
                    </p>
                  </div>
                  <div className="bg-[#DEF1EF] rounded-3xl p-4">
                    <p className="text-sm text-[#1F4A51] mb-1">Empathy</p>
                    <p className="text-2xl text-[#1F4A51]">
                      {chatMessages.length > 0 ? '88%' : '--%'}
                    </p>
                  </div>
                  <div className="bg-[#F5F5F7] rounded-3xl p-4">
                    <p className="text-sm text-[#1F4A51] mb-1">Safety</p>
                    <p className="text-2xl text-[#1F4A51]">
                      {chatMessages.length > 0 ? '95%' : '--%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

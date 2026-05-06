import { useState } from 'react';
import { Search, Save, Printer, Download, Calendar, ChevronRight, Plus, X } from 'lucide-react';
import { useData } from './data-context';
import { toast } from 'sonner';

export function MedicalRecords() {
  const { getAllPatients, getPatientRecords, addMedicalRecord } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: [{ name: '', dosage: '', instructions: '' }],
    notes: '',
    followUpDate: ''
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length > 0) {
      const patients = getAllPatients();
      const results = patients.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.phone.includes(value)
      );
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.name);
    setShowDropdown(false);
    setShowForm(false);
    setSelectedRecord(null);
  };

  const handleCreateNew = () => {
    setShowForm(true);
    setSelectedRecord(null);
    setFormData({
      symptoms: '',
      diagnosis: '',
      treatment: '',
      medications: [{ name: '', dosage: '', instructions: '' }],
      notes: '',
      followUpDate: ''
    });
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setShowForm(false);
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', instructions: '' }]
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const newMedications = [...formData.medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setFormData({ ...formData, medications: newMedications });
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    if (!selectedPatient) return;

    const newRecord = {
      id: Date.now(),
      patientId: selectedPatient.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      medications: formData.medications.filter(m => m.name),
      notes: formData.notes,
      followUpDate: formData.followUpDate,
      doctorName: 'Dr. Nguyễn Văn A'
    };

    addMedicalRecord(newRecord);
    toast.success(`Đã lưu hồ sơ khám cho bệnh nhân ${selectedPatient.name}`);
    setShowForm(false);
    setSelectedPatient(null);
    setSearchQuery('');
  };

  const patientRecords = selectedPatient ? getPatientRecords(selectedPatient.id) : [];

  return (
    <div className="p-8">
      

      {/* Search Section */}
      <div className="bg-white rounded-3xl p-6 mb-6">
        <label className="block text-[#1F4A51] font-semibold mb-3">Tìm kiếm bệnh nhân</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
            placeholder="Nhập tên hoặc số điện thoại bệnh nhân..."
          />

          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-3xl shadow-lg z-20 max-h-64 overflow-y-auto">
              {searchResults.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="w-full px-4 py-3 text-left hover:bg-[#F4FDFC] transition-colors border-b border-[#E5E7EB] last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1F4A51]">{patient.name}</p>
                      <p className="text-sm text-[#6B7280]">{patient.phone} • {patient.age} tuổi</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Records List */}
      {selectedPatient && !showForm && !selectedRecord && (
        <div className="bg-white rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#1F4A51] font-semibold mb-1">Hồ sơ bệnh nhân: {selectedPatient.name}</h2>
              <p className="text-sm text-[#6B7280]">
                {selectedPatient.phone} • {selectedPatient.age} tuổi • {selectedPatient.gender}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tạo hồ sơ khám mới
            </button>
          </div>

          {patientRecords.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-[#1F4A51] font-semibold mb-3">Lịch sử khám ({patientRecords.length})</h3>
              {patientRecords.map(record => (
                <button
                  key={record.id}
                  onClick={() => handleViewRecord(record)}
                  className="w-full bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB] hover:bg-[#F4FDFC] transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[#479AA8]">{record.date}</span>
                        <span className="text-[#6B7280]">{record.time}</span>
                      </div>
                      <p className="text-[#1F4A51] mb-1">{record.diagnosis}</p>
                      <p className="text-sm text-[#6B7280]">{record.doctorName}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#6B7280] mb-4">Chưa có lịch sử khám</p>
            </div>
          )}
        </div>
      )}

      {/* View Record Detail */}
      {selectedRecord && (
        <div className="bg-white rounded-xl border border-[#E5E7EB]">
          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F4FDFC]">
            <div>
              <h2 className="text-[#1F4A51] mb-1">Chi tiết hồ sơ khám</h2>
              <p className="text-sm text-[#6B7280]">
                {selectedRecord.date} • {selectedRecord.time} • {selectedRecord.doctorName}
              </p>
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="p-2 hover:bg-white rounded-3xl transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-[#1F4A51] mb-2">Triệu chứng</label>
              <div className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                <p className="text-[#1F4A51]">{selectedRecord.symptoms}</p>
              </div>
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Chẩn đoán</label>
              <div className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                <p className="text-[#1F4A51]">{selectedRecord.diagnosis}</p>
              </div>
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Hướng xử trí</label>
              <div className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                <p className="text-[#1F4A51]">{selectedRecord.treatment}</p>
              </div>
            </div>

            {selectedRecord.medications.length > 0 && (
              <div>
                <label className="block text-[#1F4A51] mb-2">Đơn thuốc</label>
                <div className="space-y-2">
                  {selectedRecord.medications.map((med: any, index: number) => (
                    <div key={index} className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                      <p className="text-[#1F4A51] mb-1">{med.name}</p>
                      <p className="text-sm text-[#6B7280]">
                        {med.dosage} • {med.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.notes && (
              <div>
                <label className="block text-[#1F4A51] mb-2">Ghi chú & Dặn dò</label>
                <div className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                  <p className="text-[#1F4A51]">{selectedRecord.notes}</p>
                </div>
              </div>
            )}

            {selectedRecord.followUpDate && (
              <div>
                <label className="block text-[#1F4A51] mb-2">Lịch tái khám</label>
                <div className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                  <p className="text-[#1F4A51]">{selectedRecord.followUpDate}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors">
                <Printer className="w-5 h-5" />
                In phiếu khám
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors">
                <Download className="w-5 h-5" />
                Xuất PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Record Form */}
      {showForm && selectedPatient && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB]">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[#1F4A51] font-semibold mb-1">Hồ sơ buổi khám mới</h2>
                <p className="text-sm text-[#6B7280]">
                  Bệnh nhân: {selectedPatient.name} • SĐT: {selectedPatient.phone}
                </p>
              </div>
              <div className="text-sm text-[#6B7280]">
                Ngày khám: {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-[#1F4A51] mb-2">Lý do khám / Triệu chứng</label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                placeholder="Mô tả triệu chứng, lý do khám bệnh..."
              />
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Chẩn đoán / Hướng xử trí</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                placeholder="Chẩn đoán bệnh và hướng điều trị..."
              />
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Hướng xử trí chi tiết</label>
              <textarea
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                placeholder="Phương pháp điều trị, chăm sóc..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[#1F4A51]">Thuốc kê đơn</label>
                <button
                  onClick={addMedication}
                  className="px-4 py-2 bg-[#F4FDFC] text-[#479AA8] rounded-3xl hover:bg-[#DEF1EF] transition-colors"
                >
                  + Thêm thuốc
                </button>
              </div>
              <div className="space-y-4">
                {formData.medications.map((med, index) => (
                  <div key={index} className="bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Tên thuốc</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                          placeholder="VD: Paracetamol 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Liều lượng</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                          placeholder="VD: 3 lần/ngày"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Cách dùng</label>
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                          placeholder="VD: Sau ăn"
                        />
                      </div>
                    </div>
                    {formData.medications.length > 1 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Xóa thuốc này
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Ghi chú & Dặn dò</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                placeholder="Lưu ý, dặn dò cho bệnh nhân..."
              />
            </div>

            <div>
              <label className="block text-[#1F4A51] mb-2">Lịch tái khám (nếu có)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
              >
                <Save className="w-5 h-5" />
                Lưu hoàn tất
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors">
                <Printer className="w-5 h-5" />
                In phiếu khám
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors">
                <Download className="w-5 h-5" />
                Xuất PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

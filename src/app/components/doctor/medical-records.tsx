import { useState } from 'react';
import { Search, Save, Printer, Download, Calendar, ChevronRight, ChevronUp, ChevronDown, Plus, X, CalendarIcon, Clock3 } from 'lucide-react';
import { useData } from '../contexts/data-context';
import { toast } from 'sonner';

export function MedicalRecords() {
  const { getAllPatients, getPatientRecords, addMedicalRecord, medicalRecords } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getLastVisit = (patientId: number): string | null => {
    const records = medicalRecords.filter(r => r.patientId === patientId);
    if (records.length === 0) return null;
    return records.reduce((max, r) => (r.date > max ? r.date : max), records[0].date);
  };

  const sortedPatients = [...getAllPatients()].sort((a, b) => {
    const la = getLastVisit(a.id);
    const lb = getLastVisit(b.id);
    if (!la && !lb) return 0;
    if (!la) return 1;
    if (!lb) return -1;
    return sortOrder === 'desc' ? lb.localeCompare(la) : la.localeCompare(lb);
  });
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: [{ name: '', dosage: '', instructions: '' }],
    notes: '',
    followUpDate: ''
  });

  const [formErrors, setFormErrors] = useState<{ symptoms?: string; diagnosis?: string }>({});

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
    setFormErrors({});
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

    // Validate required fields
    const errors: { symptoms?: string; diagnosis?: string } = {};
    if (!formData.symptoms.trim()) {
      errors.symptoms = 'Triệu chứng là bắt buộc';
    }
    if (!formData.diagnosis.trim()) {
      errors.diagnosis = 'Chẩn đoán là bắt buộc';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    setFormErrors({});

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
      doctorName: 'BS. Nguyễn Văn A'
    };

    addMedicalRecord(newRecord);
    toast.success(`Đã lưu hồ sơ khám cho bệnh nhân ${selectedPatient.name}`);
    setShowForm(false);
    setSelectedPatient(null);
    setSearchQuery('');
  };

  const patientRecords = selectedPatient ? getPatientRecords(selectedPatient.id) : [];

  return (
    <div className="h-full flex flex-col overflow-hidden p-6">

      {/* Search */}
      <div className="flex-shrink-0 bg-white rounded-3xl p-4 mb-4">
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

      {/* ── Patient table (no patient selected) ── */}
      {!selectedPatient && (
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-3xl overflow-hidden">
          <div className="flex-shrink-0 px-6 py-4">
            <h2 className="text-[#1F4A51] font-semibold">Danh sách bệnh nhân</h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 mb-4">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#F5F5F7] z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1F4A51]">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1F4A51]">Tên bệnh nhân</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1F4A51]">Tuổi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1F4A51]">Giới tính</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1F4A51]">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1F4A51]">
                    <button
                      onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
                      className="flex items-center gap-1 hover:text-[#479AA8] transition-colors"
                    >
                      Lần cuối khám
                      {sortOrder === 'desc'
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.map((patient, index) => {
                  const lastVisit = getLastVisit(patient.id);
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className="border-t border-[#E5E7EB] hover:bg-[#F4FDFC] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#1F4A51]">{patient.name}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{patient.age}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{patient.gender}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{patient.phone}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {lastVisit
                          ? new Date(lastVisit).toLocaleDateString('vi-VN')
                          : <span className="text-[#D1D5DB]">Chưa có</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Records list (always visible when patient is selected) ── */}
      {selectedPatient && (
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-3xl overflow-hidden">
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-[#1F4A51] font-semibold">Hồ sơ bệnh nhân: {selectedPatient.name}</h2>
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
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 mb-6">
            {patientRecords.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-[#1F4A51] font-semibold mb-1">Lịch sử khám ({patientRecords.length})</h3>
                {patientRecords.map(record => (
                  <button
                    key={record.id}
                    onClick={() => handleViewRecord(record)}
                    className="w-full bg-[#F5F5F7] rounded-3xl p-4 border border-[#E5E7EB] hover:bg-[#F4FDFC] transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[#1F4A51]">{record.diagnosis}</span>
                        </div>
                        <p className="text-sm text-[#6B7280]">Người khám: {record.doctorName}</p>
                      </div>
                      <div className="flex items-center gap-3">                        
                          <div className="flex items-center gap-1 text-[#479AA8]">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{record.date}</span>        
                          </div>
                          <div className="flex items-center gap-1 text-[#479AA8]">                       
                            <Clock3 className="w-4 h-4" />
                            <span>{record.time}</span>
                          </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#6B7280]">Chưa có lịch sử khám</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal: Record detail ── */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-3xl flex flex-col w-full max-w-2xl max-h-[85vh] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F4FDFC] rounded-t-3xl">
              <div>
                <h2 className="text-[#1F4A51] font-semibold">Chi tiết hồ sơ khám</h2>
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
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
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
                        <p className="text-sm text-[#6B7280]">{med.dosage} • {med.instructions}</p>
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
        </div>
      )}

      {/* ── Modal: New record form ── */}
      {selectedPatient && showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-3xl flex flex-col w-full max-w-2xl max-h-[85vh] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] rounded-t-3xl">
              <div>
                <h2 className="text-[#1F4A51] font-semibold">Hồ sơ buổi khám mới</h2>
                <p className="text-sm text-[#6B7280]">
                  Bệnh nhân: {selectedPatient.name} • SĐT: {selectedPatient.phone}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#6B7280]">Ngày khám: {new Date().toLocaleDateString('vi-VN')}</span>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-[#F5F5F7] rounded-3xl transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-[#1F4A51] mb-2">Lý do khám / Triệu chứng <span className="text-red-600">*</span></label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => {
                    setFormData({ ...formData, symptoms: e.target.value });
                    if (formErrors.symptoms) setFormErrors({ ...formErrors, symptoms: undefined });
                  }}
                  rows={3}
                  className={`w-full px-4 py-3 bg-[#f4f8fa] border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8] ${
                    formErrors.symptoms ? 'border-red-500' : 'border-[#E5E7EB]'
                  }`}
                  placeholder="VD: Sốt cao 39 độ ngày thứ 2, ho khan, đau họng, mệt mỏi nhiều..."
                />
                {formErrors.symptoms && <p className="text-red-600 text-sm mt-1">{formErrors.symptoms}</p>}
              </div>
              <div>
                <label className="block text-[#1F4A51] mb-2">Chẩn đoán <span className="text-red-600">*</span></label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => {
                    setFormData({ ...formData, diagnosis: e.target.value });
                    if (formErrors.diagnosis) setFormErrors({ ...formErrors, diagnosis: undefined });
                  }}
                  rows={3}
                  className={`w-full px-4 py-3 bg-[#f4f8fa] border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8] ${
                    formErrors.diagnosis ? 'border-red-500' : 'border-[#E5E7EB]'
                  }`}
                  placeholder="VD: Viêm phế quản cấp..."
                />
                {formErrors.diagnosis && <p className="text-red-600 text-sm mt-1">{formErrors.diagnosis}</p>}
              </div>
              <div>
                <label className="block text-[#1F4A51] mb-2">Hướng xử lý chi tiết</label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#479AA8]"
                  placeholder="VD: Uống thuốc theo đơn, nghỉ ngơi tại giường, tái khám sau 3 ngày hoặc khi có dấu hiệu sốt cao..."
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
                  placeholder="VD: Ăn đồ mềm dễ tiêu, kiêng rượu bia và đồ chua cay..."
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
        </div>
      )}
    </div>
  );
}

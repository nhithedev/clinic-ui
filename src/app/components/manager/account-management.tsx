import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Check, Eye, ChevronDown } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useManager } from '../contexts/manager-context';
import { toast } from 'sonner';

type Role = 'all' | 'patient' | 'doctor' | 'manager' | 'ai-trainer';

export function AccountManagement() {
  const { accounts, addAccount, updateAccount, deleteAccount, pendingEditAccountId, setPendingEditAccountId } = useManager();
  const [activeTab, setActiveTab] = useState<Role>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingAccount, setViewingAccount] = useState<any>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'doctor',
    username: '',
    password: '',
    resetPassword: false,
    // Doctor fields
    specialty: '',
    licenseNumber: '',
    dateOfBirth: '',
    address: '',
    experience: '',
    education: [''],
    certifications: [''],
    // AI Trainer fields
    specialtyArray: [] as string[],
    availability: '',
    schedule: ''
  });

  const tabs = [
    { id: 'all', label: 'Tất cả', count: accounts.length },
    { id: 'patient', label: 'Bệnh nhân', count: accounts.filter(a => a.role === 'patient').length },
    { id: 'doctor', label: 'Bác sĩ', count: accounts.filter(a => a.role === 'doctor').length },
    { id: 'manager', label: 'Quản lý', count: accounts.filter(a => a.role === 'manager').length },
    { id: 'ai-trainer', label: 'AI Trainer', count: accounts.filter(a => a.role === 'ai-trainer').length }
  ];

  const filteredAccounts = accounts.filter(account => {
    const matchesTab = activeTab === 'all' || account.role === activeTab;
    const matchesSearch = searchQuery === '' ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    const aIncomplete = (a.role === 'doctor' || a.role === 'ai-trainer') && !a.isProfileComplete;
    const bIncomplete = (b.role === 'doctor' || b.role === 'ai-trainer') && !b.isProfileComplete;
    if (aIncomplete === bIncomplete) return 0;
    return aIncomplete ? -1 : 1;
  });

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      patient: 'Bệnh nhân',
      doctor: 'Bác sĩ',
      manager: 'Quản lý',
      'ai-trainer': 'AI Trainer'
    };
    return labels[role] || role;
  };

  const canEdit = (account: any) => {
    return account.role === 'doctor' || account.role === 'ai-trainer';
  };

  const canDelete = (account: any) => {
    return account.role === 'doctor' || account.role === 'ai-trainer';
  };

  const handleCreate = () => {
    setShowCreateForm(true);
    setEditingAccount(null);
    setViewingAccount(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'doctor',
      username: '',
      password: '',
      resetPassword: false,
      specialty: '',
      licenseNumber: '',
      dateOfBirth: '',
      address: '',
      experience: '',
      education: [''],
      certifications: [''],
      specialtyArray: [],
      availability: '',
      schedule: ''
    });
  };

  const handleView = (account: any) => {
    setViewingAccount(account);
    setEditingAccount(null);
    setShowCreateForm(false);
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setViewingAccount(null);
    setShowCreateForm(true);

    const isDoctor = account.role === 'doctor';
    const isTrainer = account.role === 'ai-trainer';

    setFormData({
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      username: account.username || '',
      password: '',
      resetPassword: false,
      // Doctor fields
      specialty: isDoctor && account.specialty ? account.specialty : '',
      licenseNumber: account.licenseNumber || '',
      dateOfBirth: account.dateOfBirth || '',
      address: account.address || '',
      experience: account.experience || '',
      education: account.education && account.education.length > 0 ? account.education : [''],
      certifications: account.certifications && account.certifications.length > 0 ? account.certifications : [''],
      // AI Trainer fields
      specialtyArray: isTrainer && Array.isArray(account.specialty) ? account.specialty : [],
      availability: account.availability || '',
      schedule: account.schedule || ''
    });
  };

  useEffect(() => {
    if (pendingEditAccountId !== null) {
      const account = accounts.find(a => a.id === pendingEditAccountId);
      if (account) handleEdit(account);
      setPendingEditAccountId(null);
    }
  }, [pendingEditAccountId, accounts, setPendingEditAccountId]);

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.username) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    // Validate password for new accounts
    if (!editingAccount && !formData.password) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    // Validate doctor fields if editing a doctor
    if (editingAccount && formData.role === 'doctor') {
      if (!formData.specialty || !formData.licenseNumber || !formData.dateOfBirth || !formData.address || !formData.experience) {
        toast.error('Vui lòng điền đầy đủ thông tin bác sĩ');
        return;
      }
      if (formData.education.filter(e => e.trim()).length === 0) {
        toast.error('Vui lòng nhập ít nhất 1 trình độ học vấn');
        return;
      }
      if (formData.certifications.filter(c => c.trim()).length === 0) {
        toast.error('Vui lòng nhập ít nhất 1 chứng chỉ');
        return;
      }
    }

    // Validate AI trainer fields if editing an AI trainer
    if (editingAccount && formData.role === 'ai-trainer') {
      if (!formData.availability || !formData.schedule) {
        toast.error('Vui lòng điền đầy đủ thông tin chuyên gia AI');
        return;
      }
      if (formData.specialtyArray.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 lĩnh vực chuyên sâu');
        return;
      }
      if (formData.certifications.filter(c => c.trim()).length === 0) {
        toast.error('Vui lòng nhập ít nhất 1 chứng chỉ');
        return;
      }
    }

    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    if (editingAccount) {
      const updates: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        username: formData.username
      };

      if (formData.role === 'doctor') {
        updates.specialty = formData.specialty;
        updates.licenseNumber = formData.licenseNumber;
        updates.dateOfBirth = formData.dateOfBirth;
        updates.address = formData.address;
        updates.experience = formData.experience;
        updates.education = formData.education.filter(e => e.trim());
        updates.certifications = formData.certifications.filter(c => c.trim());

        // Check if doctor profile is complete (allow save even if incomplete)
        const isComplete = updates.specialty && updates.licenseNumber &&
                          updates.dateOfBirth && updates.address &&
                          updates.experience && updates.education.length > 0 &&
                          updates.certifications.length > 0;
        updates.isProfileComplete = isComplete;
      } else if (formData.role === 'ai-trainer') {
        updates.specialty = formData.specialtyArray;
        updates.certifications = formData.certifications.filter(c => c.trim());
        updates.availability = formData.availability;
        updates.schedule = formData.schedule;

        // Check if AI trainer profile is complete (allow save even if incomplete)
        const isComplete = updates.specialty.length > 0 &&
                          updates.certifications.length > 0 &&
                          updates.availability && updates.schedule;
        updates.isProfileComplete = isComplete;
      }

      updateAccount(editingAccount.id, updates);
    } else {
      addAccount({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
    }
    setShowSaveConfirm(false);
    setShowCreateForm(false);
    setEditingAccount(null);
  };

  const handleDelete = (account: any) => {
    setShowDeleteConfirm(account);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteAccount(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
      setViewingAccount(null);
    }
  };

  

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#E2E2E2]"
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          Tạo tài khoản mới
        </button>
      </div>

      {/* Card wrapper — fills remaining height, only table scrolls */}
      <div className="flex-1 min-h-0 bg-white rounded-3xl flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="px-6 pt-6 flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Role)}
                className={`px-6 py-3 transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#479AA8]'
                    : 'text-[#6B7280] hover:text-[#1F4A51]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-[#479AA8] text-white' : 'bg-[#F4FDFC] text-[#6B7280]'
                  }`}>
                    {tab.count}
                  </span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#479AA8]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table — scrollable area */}
        <div className="flex-1 min-h-0 overflow-auto px-6 pb-6">
          <table className="w-full min-w-[800px]">
          <thead className="bg-[#F5F5F7] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-[#6B7280] whitespace-nowrap">Tên</th>
              <th className="px-6 py-4 text-left text-sm text-[#6B7280] whitespace-nowrap max-w-[200px]">Email</th>
              <th className="px-6 py-4 text-left text-sm text-[#6B7280] whitespace-nowrap">Số điện thoại</th>
              <th className="px-6 py-4 text-left text-sm text-[#6B7280] whitespace-nowrap">Vai trò</th>
              <th className="px-6 py-4 text-left text-sm text-[#6B7280] whitespace-nowrap">Trạng thái</th>
              <th className="px-6 py-4 text-left text-sm text-[#6B7280] whitespace-nowrap">Ngày tạo</th>
              <th className="px-6 py-4 text-center text-sm text-[#6B7280] whitespace-nowrap">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id} className="border-b border-[#E5E7EB] hover:bg-[#F5F5F7] transition-colors">
                <td className="px-6 py-4 text-[#1F4A51] whitespace-nowrap">
                  {account.name}
                  {!account.isProfileComplete && (account.role === 'doctor' || account.role === 'ai-trainer') && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                      Chưa đầy đủ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-[#6B7280] whitespace-nowrap max-w-[200px] truncate" title={account.email}>{account.email}</td>
                <td className="px-6 py-4 text-[#6B7280] whitespace-nowrap">{account.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-[#F4FDFC] text-[#479AA8] rounded-full text-sm">
                    {getRoleLabel(account.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    account.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {account.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#6B7280] whitespace-nowrap">{account.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleView(account)}
                      className="p-2 text-[#479AA8] hover:bg-[#F4FDFC] rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {canEdit(account) && (
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 text-[#479AA8] hover:bg-[#F4FDFC] rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8">
            <div className="p-6 bg-[#FFFFFF] text-[#1F4A51] font-semibold flex items-center justify-between rounded-t-3xl">
              <h3>Chi tiết tài khoản</h3>
              <button onClick={() => setViewingAccount(null)} className="hover:bg-white/20 p-1 rounded-3xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">Họ và tên</label>
                    <p className="text-[#1F4A51]">{viewingAccount.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">Vai trò</label>
                    <p className="text-[#1F4A51]">{getRoleLabel(viewingAccount.role)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">Email</label>
                    <p className="text-[#1F4A51] break-words">{viewingAccount.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B7280] mb-1">Số điện thoại</label>
                    <p className="text-[#1F4A51]">{viewingAccount.phone}</p>
                  </div>
                  {viewingAccount.username && (
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tên đăng nhập</label>
                      <p className="text-[#1F4A51]">{viewingAccount.username}</p>
                    </div>
                  )}
                  {viewingAccount.dateOfBirth && viewingAccount.role === 'patient' && (
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Ngày sinh</label>
                      <p className="text-[#1F4A51]">{new Date(viewingAccount.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                </div>

                {viewingAccount.role === 'patient' && (
                  <>
                    <hr className="my-4" />
                    <h4 className="text-[#1F4A51] mb-3">Thông tin bệnh nhân</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Giới tính</label>
                        <p className="text-[#1F4A51]">{viewingAccount.gender || '—'}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Địa chỉ</label>
                        <p className="text-[#1F4A51]">{viewingAccount.address || '—'}</p>
                      </div>
                    </div>
                  </>
                )}

                {viewingAccount.role === 'doctor' && (
                  <>
                    <hr className="my-4" />
                    <h4 className="text-[#1F4A51] mb-3">Thông tin bác sĩ</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Chuyên khoa</label>
                        <p className="text-[#1F4A51]">{viewingAccount.specialty || '—'}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Số chứng chỉ hành nghề</label>
                        <p className="text-[#1F4A51]">{viewingAccount.licenseNumber || '—'}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Ngày sinh</label>
                        <p className="text-[#1F4A51]">
                          {viewingAccount.dateOfBirth ? new Date(viewingAccount.dateOfBirth).toLocaleDateString('vi-VN') : '—'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Kinh nghiệm</label>
                        <p className="text-[#1F4A51]">{viewingAccount.experience || '—'}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm text-[#6B7280] mb-1">Địa chỉ</label>
                      <p className="text-[#1F4A51]">{viewingAccount.address || '—'}</p>
                    </div>
                    {viewingAccount.education && viewingAccount.education.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm text-[#6B7280] mb-2">Học vấn</label>
                        <ul className="list-disc list-inside space-y-1">
                          {viewingAccount.education.map((edu: string, i: number) => (
                            <li key={i} className="text-[#1F4A51]">{edu}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {viewingAccount.certifications && viewingAccount.certifications.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm text-[#6B7280] mb-2">Chứng chỉ</label>
                        <ul className="list-disc list-inside space-y-1">
                          {viewingAccount.certifications.map((cert: string, i: number) => (
                            <li key={i} className="text-[#1F4A51]">{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {viewingAccount.role === 'ai-trainer' && (
                  <>
                    <hr className="my-4" />
                    <h4 className="text-[#1F4A51] mb-3">Thông tin chuyên gia AI</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Trạng thái</label>
                        <p className="text-[#1F4A51]">{viewingAccount.availability || '—'}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-[#6B7280] mb-1">Lịch trực</label>
                        <p className="text-[#1F4A51]">{viewingAccount.schedule || '—'}</p>
                      </div>
                    </div>
                    {viewingAccount.specialty && Array.isArray(viewingAccount.specialty) && viewingAccount.specialty.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm text-[#6B7280] mb-2">Lĩnh vực chuyên sâu</label>
                        <div className="flex flex-wrap gap-2">
                          {viewingAccount.specialty.map((spec: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-[#f3f0ff] text-[#8b5cf6] rounded-3xl border border-[#8b5cf6] text-sm">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {viewingAccount.certifications && viewingAccount.certifications.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm text-[#6B7280] mb-2">Chứng chỉ chuyên môn</label>
                        <ul className="list-disc list-inside space-y-1">
                          {viewingAccount.certifications.map((cert: string, i: number) => (
                            <li key={i} className="text-[#1F4A51]">{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-6 flex gap-3 rounded-b-3xl">
              {canDelete(viewingAccount) && (
                <button
                  onClick={() => handleDelete(viewingAccount)}
                  className="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Xóa tài khoản
                </button>
              )}
              {canEdit(viewingAccount) && (
                <button
                  onClick={() => handleEdit(viewingAccount)}
                  className="flex-1 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
              <button
                onClick={() => setViewingAccount(null)}
                className={`${canEdit(viewingAccount) ? '' : 'flex-1'} px-4 py-2 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8">
            <div className="p-6 bg-[#FFFFFF] text-[#1F4A51] font-semibold rounded-t-3xl">
              <h3>{editingAccount ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}</h3>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1F4A51] mb-2">Họ và tên <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                      placeholder="VD: Nguyễn Văn A..."
                    />
                  </div>

                  <div>
                    <label className="block text-[#1F4A51] mb-2">Vai trò <span className="text-red-600">*</span></label>
                    <Menu as="div" className="relative">
                      <Menu.Button
                        disabled={!!editingAccount}
                        className={`w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#E2E2E2] ${
                          editingAccount ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="text-[#1F4A51] text-sm">{getRoleLabel(formData.role)}</span>
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      </Menu.Button>

                      <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-3xl overflow-hidden bg-white shadow-lg ring-1 ring-[#E5E7EB] focus:outline-none">
                        <div className="py-1">
                          {[
                            { value: 'doctor', label: 'Bác sĩ' },
                            { value: 'manager', label: 'Quản lý' },
                            { value: 'ai-trainer', label: 'AI Trainer' },
                          ].map((roleOption) => (
                            <Menu.Item key={roleOption.value}>
                              {({ focus }) => (
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, role: roleOption.value as Role })}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    focus ? 'bg-[#F5F5F7] text-[#1F4A51]' : 'text-[#6B7280]'
                                  } ${formData.role === roleOption.value ? 'font-semibold text-[#1F4A51]' : ''}`}
                                >
                                  {roleOption.label}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Menu>
                  </div>

                  <div>
                    <label className="block text-[#1F4A51] mb-2">Email <span className="text-red-600">*</span></label>
                      <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                        className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                      placeholder="VD: abc@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1F4A51] mb-2">Số điện thoại <span className="text-red-600">*</span></label>
                      <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                        className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                      placeholder="VD: 0987..."
                    />
                  </div>
                </div>

                <hr className="my-4" />
                <h4 className="text-[#1F4A51] mb-4">Thông tin đăng nhập</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1F4A51] mb-2">Tên đăng nhập <span className="text-red-600">*</span></label>
                      <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>

                  {editingAccount ? (
                    <div>
                      <label className="block text-[#1F4A51] mb-2">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                        placeholder="Để trống nếu không đổi"
                      />
                      <p className="text-xs text-[#6B7280] mt-1">Để trống nếu không muốn thay đổi mật khẩu</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[#1F4A51] mb-2">Mật khẩu <span className="text-red-600">*</span></label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                  )}
                </div>

                {formData.role === 'doctor' && editingAccount && (
                  <>
                    <hr className="my-6" />
                    <h4 className="text-[#1F4A51] mb-4">Thông tin bác sĩ</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Chuyên khoa <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                          placeholder="VD: Bác sĩ Nội khoa"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1F4A51] mb-2">Số chứng chỉ hành nghề <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                          placeholder="VD: BS-123456"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1F4A51] mb-2">Ngày sinh <span className="text-red-600">*</span></label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1F4A51] mb-2">Kinh nghiệm <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                          placeholder="VD: 12 năm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#1F4A51] mb-2">Địa chỉ <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                        placeholder="VD: 123 Đường ABC, Quận XYZ, TP.HCM"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1F4A51] mb-2">Học vấn * (ít nhất 1)</label>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={edu}
                            onChange={(e) => {
                              const newEdu = [...formData.education];
                              newEdu[index] = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="flex-1 px-4 py-3 bg-[#f4f8fa] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                            placeholder="VD: Bác sĩ Y khoa - Đại học Y Hà Nội (2003-2009)"
                          />
                          {formData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newEdu = formData.education.filter((_, i) => i !== index);
                                setFormData({ ...formData, education: newEdu });
                              }}
                              className="px-3 text-red-600 hover:bg-red-50 rounded-3xl"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, education: [...formData.education, ''] })}
                        className="text-sm text-[#479AA8] hover:underline"
                      >
                        + Thêm học vấn
                      </button>
                    </div>

                    <div>
                      <label className="block text-[#1F4A51] mb-2">Chứng chỉ * (ít nhất 1)</label>
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={cert}
                            onChange={(e) => {
                              const newCert = [...formData.certifications];
                              newCert[index] = e.target.value;
                              setFormData({ ...formData, certifications: newCert });
                            }}
                            className="flex-1 px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#E2E2E2]"
                            placeholder="VD: Chứng chỉ hành nghề số BS-123456"
                          />
                          {formData.certifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newCert = formData.certifications.filter((_, i) => i !== index);
                                setFormData({ ...formData, certifications: newCert });
                              }}
                              className="px-3 text-red-600 hover:bg-red-50 rounded-3xl"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, ''] })}
                        className="text-sm text-[#479AA8] hover:underline"
                      >
                        + Thêm chứng chỉ
                      </button>
                    </div>
                  </>
                )}

                {formData.role === 'ai-trainer' && editingAccount && (
                  <>
                    <hr className="my-6" />
                    <h4 className="text-[#1F4A51] mb-4">Thông tin chuyên gia AI</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#1F4A51] mb-2">Trạng thái <span className="text-red-600">*</span></label>
                        <select
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                        >
                          <option value="">Chọn trạng thái</option>
                          <option value="Sẵn sàng tiếp nhận dự án">Sẵn sàng tiếp nhận dự án</option>
                          <option value="Đang bận">Đang bận</option>
                          <option value="Tạm nghỉ">Tạm nghỉ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#1F4A51] mb-2">Lịch trực <span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={formData.schedule}
                          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                          placeholder="VD: Thứ 2 - Thứ 6: 9:00 - 18:00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#1F4A51] mb-2">Lĩnh vực chuyên sâu (ít nhất 1) <span className="text-red-600">*</span></label>
                      <div className="space-y-2 mb-3">
                        {['NLP', 'Computer Vision', 'Healthcare AI', 'Recommendation Systems', 'Time Series Analysis'].map(spec => (
                          <label key={spec} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.specialtyArray.includes(spec)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, specialtyArray: [...formData.specialtyArray, spec] });
                                } else {
                                  setFormData({ ...formData, specialtyArray: formData.specialtyArray.filter(s => s !== spec) });
                                }
                              }}
                              className="w-4 h-4 text-[#8b5cf6] rounded focus:ring-2 focus:ring-[#8b5cf6]"
                            />
                            <span className="text-[#1F4A51]">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#1F4A51] mb-2">Chứng chỉ chuyên môn (ít nhất 1) <span className="text-red-600">*</span></label>
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={cert}
                            onChange={(e) => {
                              const newCert = [...formData.certifications];
                              newCert[index] = e.target.value;
                              setFormData({ ...formData, certifications: newCert });
                            }}
                              className="flex-1 px-4 py-3 bg-[#f4f8fa] border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                            placeholder="VD: TensorFlow Developer Certificate"
                          />
                          {formData.certifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newCert = formData.certifications.filter((_, i) => i !== index);
                                setFormData({ ...formData, certifications: newCert });
                              }}
                                className="px-3 text-red-600 hover:bg-red-50 rounded-3xl"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, certifications: [...formData.certifications, ''] })}
                        className="text-sm text-[#479AA8] hover:underline"
                      >
                        + Thêm chứng chỉ
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 flex gap-3 rounded-b-3xl">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingAccount(null);
                }}
                className="flex-1 px-4 py-3 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
              >
                {editingAccount ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h3 className="text-[#1F4A51] mb-4">Xác nhận lưu</h3>
            <p className="text-[#6B7280] mb-6">
              Bạn có chắc muốn {editingAccount ? 'cập nhật' : 'tạo'} tài khoản này không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 px-4 py-2 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                No
              </button>
              <button
                onClick={confirmSave}
                className="flex-1 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h3 className="text-[#1F4A51] mb-4">Xác nhận xóa</h3>
            <p className="text-[#6B7280] mb-2">
              Bạn có chắc muốn xóa tài khoản này không?
            </p>
            <p className="text-[#1F4A51] mb-6">
              <strong>{showDeleteConfirm.name}</strong> ({showDeleteConfirm.email})
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                No
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-colors"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

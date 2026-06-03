import { useState } from 'react';
import { Calendar as CalendarIcon, List, X, Check, Eye, Search, ChevronDown, Clock3,Bot, Paperclip } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PatientQuickView } from './patient-quick-view';
import { CalendarView } from './calendar-view';
import { useData } from './data-context';
import { toast } from 'sonner';

type TabType = 'requests' | 'confirmed' | 'completed';

export function AppointmentsManagement() {
  const { appointments, updateAppointment, deleteAppointment } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTime, setFilterTime] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingAppointment, setRejectingAppointment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const appointmentRequests = appointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  const filterAppointments = (apts: any[]) => {
    return apts.filter(apt => {
      const matchesSearch = searchQuery === '' ||
        apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patient.phone.includes(searchQuery) ||
        apt.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTime = filterTime === 'all' || (() => {
        const time = apt.requestedTime || apt.time;
        if (!time) return true;
        const hour = parseInt(time.split(':')[0]);
        if (filterTime === 'morning') return hour < 12;
        if (filterTime === 'afternoon') return hour >= 12 && hour < 17;
        if (filterTime === 'evening') return hour >= 17;
        return true;
      })();

      const matchesPriority = filterPriority === 'all' || apt.priority === filterPriority;
      return matchesSearch && matchesTime && matchesPriority;
    });
  };

  const handleAccept = (apt: any) => {
    updateAppointment(apt.id, { status: 'confirmed', date: apt.requestedDate, time: apt.requestedTime });
    setSelectedPatient(null);
    toast.success(`Đã tiếp nhận lịch hẹn của bệnh nhân ${apt.patient.name}`);
  };

  const handleReject = (apt: any) => {
    setRejectingAppointment(apt);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) { toast.error('Vui lòng nhập lý do từ chối'); return; }
    deleteAppointment(rejectingAppointment.id);
    setShowRejectModal(false);
    setRejectingAppointment(null);
    setRejectReason('');
    setSelectedPatient(null);
    toast.success(`Đã từ chối và gửi email thông báo đến ${rejectingAppointment.patient.name}`);
  };

  const tabs = [
    { id: 'requests', label: 'Yêu cầu đặt lịch', count: appointmentRequests.length },
    { id: 'confirmed', label: 'Đã xác nhận', count: confirmedAppointments.length },
    { id: 'completed', label: 'Đã khám', count: completedAppointments.length }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Ưu tiên cao';
      case 'medium': return 'Ưu tiên trung bình';
      default: return 'Ưu tiên thấp';
    }
  };

  const timeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'morning', label: 'Buổi sáng (6h-12h)' },
    { value: 'afternoon', label: 'Buổi chiều (12h-17h)' },
    { value: 'evening', label: 'Buổi tối (17h-21h)' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'Tất cả mức độ' },
    { value: 'high', label: 'Ưu tiên cao' },
    { value: 'medium', label: 'Ưu tiên trung bình' },
    { value: 'low', label: 'Ưu tiên thấp' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden p-4">

      {/* Top bar: Search left, Filters right */}
      <div className="flex items-start justify-between gap-6 mb-5 flex-shrink-0">

        {/* Left: Search + View Toggle */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, SĐT, lý do khám..."
              className="pl-10 pr-4 py-2 bg-white rounded-3xl outline-none border-2 border-transparent focus:border-[#E2E2E2] w-80 text-sm text-[#1F4A51] transition-all"
              style={{ boxShadow: '0 0 0 0px #E5E7EB' }}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-3xl text-sm transition-colors ${
                viewMode === 'list' ? 'bg-[#479AA8] text-white' : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#479AA8]'
              }`}
            >
              <List className="w-4 h-4" />
              Danh sách
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-3xl text-sm transition-colors ${
                viewMode === 'calendar' ? 'bg-[#479AA8] text-white' : 'bg-white text-[#6B7280] hover:border-[#479AA8]'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Lịch
            </button>
          </div>
        </div>

        {/* Right: Dropdown Filters */}
        <div className="flex gap-3 mt-1">
          {/* Time Filter */}
          <Menu as="div" className="relative">
            <MenuButton className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-white text-sm text-[#1F4A51] hover:border-[#479AA8] transition-colors">
              {timeOptions.find(o => o.value === filterTime)?.label}
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-3xl bg-white shadow-lg outline outline-1 outline-black/5 overflow-hidden transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
              <div className="py-1">
                {timeOptions.map(option => (
                  <MenuItem key={option.value}>
                    <button
                      onClick={() => setFilterTime(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors data-focus:bg-[#F4FDFC] data-focus:text-[#1F4A51] ${
                        filterTime === option.value ? 'text-[#479AA8] font-medium' : 'text-[#6B7280]'
                      }`}
                    >
                      {option.label}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>

          {/* Priority Filter */}
          <Menu as="div" className="relative">
            <MenuButton className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-white text-sm text-[#1F4A51] hover:border-[#479AA8] transition-colors">
              {priorityOptions.find(o => o.value === filterPriority)?.label}
              <ChevronDown className="w-4 h-4 text-[#6B7280]" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-3xl bg-white shadow-lg outline outline-1 outline-black/5 overflow-hidden transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
              <div className="py-1">
                {priorityOptions.map(option => (
                  <MenuItem key={option.value}>
                    <button
                      onClick={() => setFilterPriority(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors data-focus:bg-[#F4FDFC] data-focus:text-[#1F4A51] ${
                        filterPriority === option.value ? 'text-[#479AA8] font-medium' : 'text-[#6B7280]'
                      }`}
                    >
                      {option.label}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <CalendarView
            appointments={appointments}
            searchQuery={searchQuery}
            filterTime={filterTime}
            filterPriority={filterPriority}
          />
        </div>
      ) : (
        /* List mode: two independent columns */
        <div className="flex-1 min-h-0 flex overflow-hidden">

          {/* Left: white card with tabs + scrollable list */}
          <div
            className="flex flex-col min-h-0 bg-white rounded-3xl p-6 transition-all duration-300 ease-in-out"
            style={{ flex: selectedPatient ? '0 0 63%' : '1 1 100%' }}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-[#E5E7EB] flex-shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-6 py-3 transition-colors relative text-sm ${
                    activeTab === tab.id ? 'text-[#479AA8]' : 'text-[#6B7280] hover:text-[#1F4A51]'
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

            {/* Scrollable list */}
            <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-4">
                {activeTab === 'requests' && filterAppointments(appointmentRequests).map((apt) => (
                  <div key={apt.id} className="bg-white rounded-3xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-[#1F4A51] font-medium">{apt.patient.name}</h3>
                          <span className={`px-3 py-1 rounded-3xl text-xs ${getPriorityColor(apt.priority)}`}>
                            {getPriorityLabel(apt.priority)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-sm text-[#1F4A51]">
                          <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {apt.requestedDate}</span>
                          <span className="flex items-center gap-1"><Clock3 className="w-4 h-4" /> {apt.requestedTime}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">                        
                        <button
                          onClick={() => setSelectedPatient(apt)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-3xl text-sm transition-colors bg-[#479AA8] text-white`}
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleAccept(apt)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Tiếp nhận
                        </button>
                        
                        <button
                          onClick={() => handleReject(apt)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-3xl hover:bg-red-100 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Từ chối
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#F4FDFC] rounded-3xl p-4 mb-4">
                      <p className="text-sm text-[#479AA8] mb-1 flex items-center gap-1">
                        <Paperclip className="w-4 h-4" />
                        Lý do khám:</p>
                      <p className="text-[#1F4A51] text-sm">{apt.reason}</p>
                    </div>

                    <div className="bg-[#F4FDFC] rounded-3xl p-4 mb-4">
                      <p className="text-sm text-[#479AA8] mb-1 flex items-center gap-1">
                        <Bot className="w-4 h-4" />
                        Tóm tắt AI:
                      </p>
                      <p className="text-sm text-[#1F4A51]">{apt.aiSummary}</p>
                    </div>
                  </div>
                ))}

                {activeTab === 'confirmed' && filterAppointments(confirmedAppointments).map((apt) => (
                  <div key={apt.id} className="bg-white rounded-3xl border border-[#E5E7EB] p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-[#1F4A51] font-medium mb-2">{apt.patient.name}</h3>
                        <p className="text-sm text-[#6B7280] mb-3">{apt.reason}</p>
                        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                          <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {apt.date}</span>
                          <span className="flex items-center gap-1"><Clock3 className="w-4 h-4" /> {apt.time}</span>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-[#DEF1EF] text-[#479AA8] rounded-3xl text-sm">
                        Đã xác nhận
                      </span>
                    </div>
                  </div>
                ))}

                {activeTab === 'completed' && filterAppointments(completedAppointments).map((apt) => (
                  <div key={apt.id} className="bg-white rounded-3xl border border-[#E5E7EB] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-[#1F4A51] font-medium mb-2">{apt.patient.name}</h3>
                        <p className="text-sm text-[#6B7280] mb-1">Lý do: {apt.reason}</p>
                        <p className="text-sm text-[#1F4A51]">Chẩn đoán: {apt.diagnosis}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#6B7280] mb-1">{apt.date}</div>
                        <span className="px-4 py-2 bg-green-50 text-green-600 rounded-3xl text-sm">
                          Hoàn thành
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: PatientQuickView — independent scroll */}
          <div
            className="flex flex-col min-h-0 overflow-y-auto transition-all duration-300 ease-in-out"
            style={{ flex: selectedPatient ? '0 0 37%' : '0 0 0%', opacity: selectedPatient ? 1 : 0 }}
          >
            {selectedPatient && (
              <PatientQuickView
                patient={selectedPatient}
                onClose={() => setSelectedPatient(null)}
                onAccept={() => handleAccept(selectedPatient)}
                onReject={() => handleReject(selectedPatient)}
              />
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && rejectingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <h3 className="text-[#1F4A51] font-semibold mb-4">Từ chối lịch hẹn</h3>
            <div className="bg-[#fff4e6] rounded-3xl p-4 mb-4">
              <p className="text-sm text-[#1F4A51]">
                Bệnh nhân: <strong>{rejectingAppointment.patient.name}</strong>
              </p>
              <p className="text-sm text-[#1F4A51] mt-1">
                Email: {rejectingAppointment.patient.email}
              </p>
            </div>
            <p className="text-sm text-[#6B7280] mb-3">
              Vui lòng nhập lý do từ chối. Lời nhắn của bạn cùng với thông báo từ chối sẽ được gửi qua email cho bệnh nhân.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-3xl bg-[#f4f8fa] focus:outline-none focus:ring-2 focus:ring-[#E2E2E2] min-h-[120px] text-sm"
              placeholder="Ví dụ: Hiện tại phòng khám đã hết lịch trống trong ngày bạn yêu cầu..."
            />
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => { setShowRejectModal(false); setRejectingAppointment(null); setRejectReason(''); }}
                className="px-4 py-2 border border-[#E5E7EB] text-[#1F4A51] rounded-3xl hover:bg-[#F5F5F7] text-sm transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-[#d4183d] text-white rounded-3xl hover:bg-[#b01030] text-sm transition-colors"
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
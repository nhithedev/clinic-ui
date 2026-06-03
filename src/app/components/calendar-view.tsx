import { useMemo, useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, X } from 'lucide-react';

interface Appointment {
  id: number;
  patient: any;
  date?: string;
  time?: string;
  requestedDate?: string;
  requestedTime?: string;
  reason: string;
  status: string;
  diagnosis?: string;
  priority?: string;
  source?: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
  searchQuery?: string;
  filterTime?: string;
  filterPriority?: string;
}

export function CalendarView({ appointments, searchQuery = '', filterTime = 'all', filterPriority = 'all' }: CalendarViewProps) {
  const [showGuide, setShowGuide] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showGuide) return;
    const handler = (e: MouseEvent) => {
      if (guideRef.current && !guideRef.current.contains(e.target as Node)) {
        setShowGuide(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showGuide]);

  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const filterAppointments = (apts: Appointment[]) => {
    return apts.filter(apt => {
      const matchesSearch = searchQuery === '' ||
        apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patient.phone?.includes(searchQuery) ||
        apt.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTime = filterTime === 'all' || (() => {
        const time = apt.time || apt.requestedTime;
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

  const sortByTime = (left: Appointment, right: Appointment) => {
    const leftTime = left.time || left.requestedTime || '23:59';
    const rightTime = right.time || right.requestedTime || '23:59';
    return leftTime.localeCompare(rightTime);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  while (days.length < 42) days.push(null);

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
  };

  const selectedDateAppointments = useMemo(() => {
    const appointmentsForSelectedDate = appointments.filter(apt => {
      const isConfirmed = apt.status === 'confirmed';
      return apt.date === selectedDate && isConfirmed;
    });

    return filterAppointments(appointmentsForSelectedDate).sort(sortByTime);
  }, [appointments, filterTime, filterPriority, searchQuery, selectedDate]);

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      <div className="w-full xl:w-[300px] shrink-0 bg-white rounded-3xl p-5 relative">
        <div className="flex items-center justify-between mb-1">
          <button onClick={prevMonth} className="p-2 hover:bg-[#F4FDFC] rounded-3xl transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1F4A51]" />
          </button>
          <h3 className="text-[#1F4A51] capitalize font-medium">{monthYear}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowGuide(v => !v)}
              className="p-2 hover:bg-[#F4FDFC] rounded-3xl transition-colors"
              title="Hướng dẫn"
            >
              <Info className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-[#F4FDFC] rounded-3xl transition-colors">
              <ChevronRight className="w-5 h-5 text-[#1F4A51]" />
            </button>
          </div>
        </div>

        {showGuide && (
          <div
            ref={guideRef}
            className="absolute top-14 right-2 z-20 w-64 bg-white rounded-2xl shadow-lg p-4 border border-[#E5E7EB]"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#1F4A51]">Hướng dẫn</p>
              <button onClick={() => setShowGuide(false)} className="p-1 hover:bg-[#F5F5F7] rounded-full transition-colors">
                <X className="w-3 h-3 text-[#6B7280]" />
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">Bấm vào một ngày để lọc bảng bệnh nhân cần khám ở bên phải.</p>
            <p className="text-xs text-[#6B7280]">Danh sách sẽ tự sắp xếp theo giờ khám của ngày đã chọn.</p>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
            <div key={day} className="text-center text-sm text-[#6B7280] py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
            const totalCount = appointments.filter(apt => apt.date === dateStr).length;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isActive = selectedDate === dateStr;

            return (
              <div key={day} className="relative">
                <button
                  onClick={() => handleDateClick(day)}
                  title={totalCount > 0 ? `${totalCount} bệnh nhân` : ''}
                  className={`aspect-square w-full flex flex-col items-center justify-center rounded-3xl border-2 transition-all ${
                    isToday ? 'bg-[#479AA8] text-white border-[#479AA8]' : 'border-transparent hover:border-[#E5E7EB]'
                  } ${isActive ? 'ring-2 ring-[#479AA8]' : ''} cursor-pointer hover:scale-105 relative`}
                >
                  <div className="text-sm">{day}</div>
                  {totalCount > 0 && (
                    <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isToday ? 'bg-white' : 'bg-[#479AA8]'}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      <div className="flex-1 min-w-0 bg-white rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-[#1F4A51] font-semibold">Danh sách bệnh nhân cần khám</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              {selectedDateLabel ? `Ngày đã chọn: ${selectedDateLabel}` : 'Chọn một ngày trên lịch để xem danh sách.'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Tổng số bệnh nhân</p>
            <p className="text-3xl font-bold text-[#479AA8]">{selectedDateAppointments.length}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl">
          <table className="w-full">
            <thead className="bg-[#F5F5F7]">
              <tr>
                <th className="text-left px-5 py-3 text-[#1F4A51] font-medium">Giờ</th>
                <th className="text-left px-5 py-3 text-[#1F4A51] font-medium">Bệnh nhân</th>
                <th className="text-left px-5 py-3 text-[#1F4A51] font-medium">Lý do khám</th>
                <th className="text-left px-5 py-3 text-[#1F4A51] font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map(apt => (
                  <tr key={apt.id} className="border-t border-[#E5E7EB]">
                    <td className="px-5 py-4 text-[#479AA8] font-medium">{apt.time || apt.requestedTime || '--:--'}</td>
                    <td className="px-5 py-4 text-[#1F4A51]">{apt.patient.name}</td>
                    <td className="px-5 py-4 text-[#6B7280]">{apt.reason}</td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-3xl text-sm bg-[#F4FDFC] text-[#479AA8]">Chờ khám</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-[#6B7280]">
                    Chưa có bệnh nhân cần khám trong ngày này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

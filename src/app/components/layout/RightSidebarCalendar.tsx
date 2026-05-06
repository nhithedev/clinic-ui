import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '@/styles/colors';

interface ActivityItem {
  id: number;
  time: string; // ISO
  action: string;
}

interface Props {
  activities: ActivityItem[];
  selectedDate: Date | null;
  onDateSelect: (d: Date | null) => void;
}

export function RightSidebarCalendar({ activities, selectedDate, onDateSelect }: Props) {
  const [current, setCurrent] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    return { daysInMonth: last.getDate(), startingDay: first.getDay() };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(current);

  const prev = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const next = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  const formatISO = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const hasActivity = (year: number, month: number, day: number) => {
    const iso = formatISO(year, month, day);
    return activities.some(a => a.time.startsWith(iso));
  };

  const year = current.getFullYear();
  const month = current.getMonth();

  const days: Array<number | null> = [];
  for (let i = 0; i < startingDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-[#F4FDFC]">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>{current.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</div>
        <button onClick={next} className="p-2 rounded-lg hover:bg-[#F4FDFC]">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-[#6B7280]">
        {['CN','T2','T3','T4','T5','T6','T7'].map(d => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, idx) => {
          if (!d) return <div key={`empty-${idx}`} className="aspect-square" />;
          const active = hasActivity(year, month, d);
          const isSelected = selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === d;

          return (
            <button
              key={d}
              onClick={() => onDateSelect(isSelected ? null : new Date(year, month, d))}
              className={`aspect-square w-full flex items-center justify-center rounded-full text-sm transition font-medium`}
              style={{
                backgroundColor: isSelected ? COLORS.BUTTON_CHOSEN : 'transparent',
                border: active ? `2px solid ${COLORS.BUTTON_CHOSEN}` : 'none',
                color: isSelected ? COLORS.WHITE : COLORS.TEXT_PRIMARY,
              }}
              onMouseEnter={(e) => {
                if (active && !isSelected) {
                  e.currentTarget.style.backgroundColor = COLORS.LIGHTER;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div>{d}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-[#6B7280]">
        <button onClick={() => onDateSelect(new Date())} className="text-sm text-[#479AA8]">Back to Today</button>
      </div>
    </div>
  );
}

export default RightSidebarCalendar;

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '@/styles/colors';

interface ActivityItem {
  id: number;
  time: string; // ISO
  action: string;
}

interface Props {
  activities: ActivityItem[];
}

export function RightSidebarCalendar({ activities }: Props) {
  const [current, setCurrent] = useState(new Date());
  const [tooltipDay, setTooltipDay] = useState<{ day: number; row: number } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const formatISO = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const year = current.getFullYear();
  const month = current.getMonth();

  const days: Array<number | null> = [];
  for (let i = 0; i < startingDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getActivitiesForDay = (day: number) => {
    const iso = formatISO(year, month, day);
    return activities.filter(a => a.time.startsWith(iso));
  };

  const hasActivity = (day: number) => getActivitiesForDay(day).length > 0;

  const tooltipActivities = tooltipDay ? getActivitiesForDay(tooltipDay.day) : [];
  // Show tooltip above if in last 2 rows, below otherwise
  const tooltipAbove = tooltipDay && tooltipDay.row >= 4;

  const handleDayMouseEnter = (day: number, idx: number) => {
    if (!hasActivity(day)) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setTooltipDay({ day, row: Math.floor(idx / 7) });
  };

  const handleDayMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => setTooltipDay(null), 120);
  };

  const handleTooltipMouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleTooltipMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => setTooltipDay(null), 120);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-[#F4FDFC]">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-medium" style={{ color: COLORS.TEXT_PRIMARY }}>
          {current.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={next} className="p-2 rounded-lg hover:bg-[#F4FDFC]">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-[#6B7280]">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="relative">
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, idx) => {
            if (!d) return <div key={`empty-${idx}`} className="aspect-square" />;
            const active = hasActivity(d);
            const isTooltipOpen = tooltipDay?.day === d;

            return (
              <button
                key={d}
                onMouseEnter={() => handleDayMouseEnter(d, idx)}
                onMouseLeave={handleDayMouseLeave}
                className="aspect-square w-full flex items-center justify-center rounded-full text-sm transition font-medium"
                style={{
                  backgroundColor: isTooltipOpen ? COLORS.LIGHTER : 'transparent',
                  border: active ? `2px solid ${COLORS.BUTTON_CHOSEN}` : 'none',
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                {d}
              </button>
            );
          })}
        </div>

        {tooltipDay && tooltipActivities.length > 0 && (
          <div
            className="absolute left-0 right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-3"
            style={{
              ...(tooltipAbove
                ? { bottom: 'calc(100% - ' + (tooltipDay.row * 32) + 'px)' }
                : { top: ((tooltipDay.row + 1) * 32) + 'px' }),
              borderColor: '#E5E7EB',
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
              {new Date(year, month, tooltipDay.day).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tooltipActivities.map(a => (
                <div key={a.id} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: COLORS.BUTTON_CHOSEN }} />
                  <div>
                    <p className="text-xs" style={{ color: COLORS.TEXT_PRIMARY }}>{a.action}</p>
                    <p className="text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
                      {new Date(a.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RightSidebarCalendar;

import { useMemo, useState } from 'react';
import { COLORS } from '@/styles/colors';

interface DemographicsData {
  day: string;
  children: number;
  adults: number;
  elderly: number;
}

interface DemographicsChartProps {
  data: DemographicsData[];
  totalPatients: number;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export const DemographicsChart = ({
  data = [],
  totalPatients = 0,
  period = 'This Week',
  onPeriodChange,
}: DemographicsChartProps) => {
  const [hoveredBar, setHoveredBar] = useState<{ day: string; type: string } | null>(null);

  const maxValue = useMemo(() => {
    const values = (data || []).flatMap((d) => [d.children, d.adults, d.elderly]);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [data]);

  const chartHeight = 300;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: COLORS.TEXT_PRIMARY }}>
            Daily Patient Demographics
          </h3>
          <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
            Total: <span style={{ color: COLORS.BUTTON_CHOSEN, fontWeight: 'bold' }}>{totalPatients}</span> patients
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: COLORS.GRAY,
            borderColor: '#E5E7EB',
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${chartHeight + 60}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 w-12 h-full flex flex-col justify-between text-xs" style={{ color: COLORS.TEXT_SECONDARY }}>
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart container */}
        <div className="ml-12 flex items-end justify-around gap-4" style={{ height: chartHeight }}>
          {data.map((dayData) => (
            <div key={dayData.day} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar group */}
              <div className="flex items-end justify-center gap-1 w-full" style={{ height: chartHeight }}>
                {/* Children bar */}
                <div
                  className="rounded-t transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: COLORS.CHILDREN,
                    width: '20%',
                    height: `${getBarHeight(dayData.children)}px`,
                    opacity: hoveredBar?.day === dayData.day ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredBar({ day: dayData.day, type: 'children' })}
                  onMouseLeave={() => setHoveredBar(null)}
                  title={`Children: ${dayData.children}`}
                />
                {/* Adults bar */}
                <div
                  className="rounded-t transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: COLORS.ADULTS,
                    width: '20%',
                    height: `${getBarHeight(dayData.adults)}px`,
                    opacity: hoveredBar?.day === dayData.day ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredBar({ day: dayData.day, type: 'adults' })}
                  onMouseLeave={() => setHoveredBar(null)}
                  title={`Adults: ${dayData.adults}`}
                />
                {/* Elderly bar */}
                <div
                  className="rounded-t transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: COLORS.ELDERLY,
                    width: '20%',
                    height: `${getBarHeight(dayData.elderly)}px`,
                    opacity: hoveredBar?.day === dayData.day ? 1 : 0.8,
                  }}
                  onMouseEnter={() => setHoveredBar({ day: dayData.day, type: 'elderly' })}
                  onMouseLeave={() => setHoveredBar(null)}
                  title={`Elderly: ${dayData.elderly}`}
                />
              </div>

              {/* Day label */}
              <span className="text-xs font-medium mt-4" style={{ color: COLORS.TEXT_SECONDARY }}>
                {dayData.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-8 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.CHILDREN }}
          />
          <span style={{ color: COLORS.TEXT_SECONDARY }}>Children (0-12)</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.ADULTS }}
          />
          <span style={{ color: COLORS.TEXT_SECONDARY }}>Adults (13-59)</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.ELDERLY }}
          />
          <span style={{ color: COLORS.TEXT_SECONDARY }}>Elderly (60+)</span>
        </div>
      </div>
    </div>
  );
};

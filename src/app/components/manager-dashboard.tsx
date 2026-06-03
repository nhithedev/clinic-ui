import ReactApexChart from 'react-apexcharts';
import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts';
import { useManager } from './manager-context';
import { KPICard } from './layout/KPICard';
import { COLORS } from '@/styles/colors';
import { Users, Stethoscope, Activity } from 'lucide-react';

export function ManagerDashboard() {
  const {  activities } = useManager();

  const appointmentChartSeries: ApexAxisChartSeries = [
    { name: 'Trẻ em', data: [44, 55, 57, 56, 61, 58, 63] },
    { name: 'Người trưởng thành', data: [76, 85, 101, 98, 87, 105, 91] },
    { name: 'Người già', data: [35, 41, 36, 26, 45, 48, 52] },
  ];

  const appointmentChartOptions: ApexOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', borderRadius: 5, borderRadiusApplication: 'end' },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'] },
    yaxis: { title: { text: undefined }, tickAmount: 5, forceNiceScale: true },
    fill: { opacity: 1 },
    colors: ['#E2E2E4', '#479AA8', '#1F4A51'],
    tooltip: { y: { formatter: (val: number) => `${val} bệnh nhân` } },
    legend: { show: false },
    grid: { borderColor: '#E5E7EB' },
  };

 // const activeAccounts = accounts.filter(a => a.status === 'active');

  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.time).toDateString();
    const today = new Date().toDateString();
    return activityDate === today;
  });

  const yesterdayActivities = activities.filter(a => {
    const activityDate = new Date(a.time);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return activityDate.toDateString() === yesterday.toDateString();
  });

  const visitChangePercent = yesterdayActivities.length > 0
    ? Math.round(((todayActivities.length - yesterdayActivities.length) / yesterdayActivities.length) * 100)
    : 0;

  const kpiStats = [
    {
      label: 'Lượt truy cập hôm nay',
      value: todayActivities.length,
      change: visitChangePercent,
      timeframe: 'so với hôm qua',
      icon: <Activity size={24} style={{ color: COLORS.WHITE }} />,
    },
    {
      label: 'Ca khám hôm nay',
      value: '42',
      change: 8,
      timeframe: 'so với hôm qua',
      icon: <Stethoscope size={24} style={{ color: COLORS.WHITE }} />,
    },
    {
      label: 'Bệnh nhân mới trong tuần',
      value: '10',
      change: 20,
      timeframe: 'so với tuần trước',
      icon: <Users size={24} style={{ color: COLORS.WHITE }} />,
    },
  ];

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
        {kpiStats.map((stat) => (
          <KPICard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            timeframe={stat.timeframe}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Age Statistics Chart */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="rounded-3xl flex flex-col flex-1 min-h-0 overflow-hidden" style={{ backgroundColor: COLORS.WHITE }}>
          <div className="px-6 pt-6 flex-shrink-0">
            <h2 className="font-semibold" style={{ color: '#1F4A51' }}>Thống kê theo độ tuổi</h2>
          </div>
          <div className="px-6 pb-6 flex-1 flex flex-col min-h-0 gap-4">
            <div className="flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-sm" style={{ color: '#6B7280' }}>Tổng số bệnh nhân</p>
                <p className="text-4xl font-bold" style={{ color: '#479AA8' }}>387</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E2E2E4' }}></div>
                  <span className="text-sm" style={{ color: '#1F4A51' }}>Trẻ em</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#479AA8' }}></div>
                  <span className="text-sm" style={{ color: '#1F4A51' }}>Người trưởng thành</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1F4A51' }}></div>
                  <span className="text-sm" style={{ color: '#1F4A51' }}>Người già</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 w-full">
              <ReactApexChart
                options={{ ...appointmentChartOptions, chart: { ...appointmentChartOptions?.chart, redrawOnParentResize: true } }}
                series={appointmentChartSeries}
                type="bar"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import ReactApexChart from 'react-apexcharts';
import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts';
import { Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { useData } from './data-context';

interface DoctorDashboardProps {
  onNavigate?: (page: string) => void;
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const { appointments, consultations } = useData();

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  const completedToday = appointments.filter(apt =>
    apt.date === new Date().toISOString().split('T')[0] && apt.status === 'completed'
  ).length;
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;

  const stats = [
    { label: 'Yêu cầu đặt lịch', value: pendingAppointments.toString(), icon: Clock, color: 'bg-[#479AA8]' },
    { label: 'Đã khám hôm nay', value: completedToday.toString(), icon: CheckCircle, color: 'bg-[#479AA8]' },
    { label: 'Thắc mắc chờ xử lý', value: pendingConsultations.toString(), icon: MessageSquare, color: 'bg-[#479AA8]', onClick: () => onNavigate?.('consultations') }
  ];

  const appointmentChartSeries: ApexAxisChartSeries = [
    {
      name: 'Trẻ em',
      data: [44, 55, 57, 56, 61, 58, 63],
    },
    {
      name: 'Người trưởng thành',
      data: [76, 85, 101, 98, 87, 105, 91],
    },
    {
      name: 'Người già',
      data: [35, 41, 36, 26, 45, 48, 52],
    },
  ];

  const appointmentChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    },
    yaxis: {
      title: {
        text: undefined,
      },
      tickAmount: 5,
      forceNiceScale: true,
    },
    fill: {
      opacity: 1,
    },
    colors: ['#E2E2E4', '#479AA8', '#1F4A51'],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} bệnh nhân`,
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: '#E5E7EB',
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={stat.onClick}
              className={`bg-white rounded-3xl p-6 transition-shadow ${
                stat.onClick ? 'cursor-pointer' : ''
              }`}
              
            >
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ color: '#6B7280' }} className="mb-2">{stat.label}</p>
                  <p className="text-3xl" style={{ color: '#1F4A51' }}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-3xl`}>
                  <Icon className={`w-6 h-6 ${stat.label === 'Thắc mắc chờ xử lý' ? 'text-white' : 'text-white'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* Appointment Chart */}
        <div className="bg-white rounded-3xl">
          <div className="p-6">
            <h2 className="font-semibold" style={{ color: '#1F4A51'}}>Thống kê theo độ tuổi</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
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
            <div>
              <ReactApexChart
                options={appointmentChartOptions}
                series={appointmentChartSeries}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white rounded-3xl">
          <div className="p-6">
            <h2 style={{ color: '#1F4A51' }}>Đã khám hôm nay</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {completedToday > 0 ? (
                <div className="rounded-3xl bg-[#F4FDFC] p-4 border border-[#DEF1EF] flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#479AA8]" />
                  <div>
                    <p className="text-[#1F4A51] font-medium">{completedToday} ca đã hoàn thành hôm nay</p>
                    <p className="text-sm text-[#6B7280]">Theo dõi số lượt khám đã xử lý trong ngày</p>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8" style={{ color: '#6B7280' }}>Chưa có ca hoàn thành hôm nay</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

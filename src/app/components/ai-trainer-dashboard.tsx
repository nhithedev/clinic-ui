import { Brain, Database, TrendingUp, AlertTriangle, Activity, Zap } from 'lucide-react';

export function AITrainerDashboard() {
  const stats = [
    { label: 'Mô hình đang huấn luyện', value: '3', icon: Brain, color: 'bg-[#DEF1EF]', trend: '+2' },
    { label: 'Dữ liệu chờ gán nhãn', value: '1,245', icon: Database, color: 'bg-[#DEF1EF]', trend: '-120' },
    { label: 'Accuracy trung bình', value: '94.2%', icon: TrendingUp, color: 'bg-[#DEF1EF]', trend: '+2.1%' },
    { label: 'Cảnh báo hệ thống', value: '7', icon: AlertTriangle, color: 'bg-[#DEF1EF]', trend: '+3' }
  ];

  const trainingModels = [
    {
      name: 'Phân loại triệu chứng v3.2',
      progress: 75,
      status: 'training',
      eta: '2 giờ',
      gpu: 'GPU-1',
      accuracy: '92.5%'
    },
    {
      name: 'Chatbot response v2.8',
      progress: 45,
      status: 'training',
      eta: '4 giờ',
      gpu: 'GPU-2',
      accuracy: '89.3%'
    },
    {
      name: 'Severity classifier v1.5',
      progress: 90,
      status: 'training',
      eta: '30 phút',
      gpu: 'GPU-1',
      accuracy: '95.1%'
    }
  ];

  const urgentActivities = [
    {
      type: 'error',
      title: 'Lỗi hội tụ - Model NLP v2.1',
      detail: 'Loss không giảm sau 50 epochs, cần điều chỉnh learning rate',
      time: '15 phút trước',
      priority: 'high'
    },
    {
      type: 'warning',
      title: 'Thiếu tài nguyên GPU',
      detail: 'Hàng đợi huấn luyện có 2 yêu cầu mới, GPU hiện tại đang full',
      time: '1 giờ trước',
      priority: 'medium'
    },
    {
      type: 'info',
      title: 'Hoàn thành huấn luyện',
      detail: 'Model "Disease prediction v4.0" đã hoàn thành, cần đánh giá',
      time: '2 giờ trước',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-[#E2E2E2] bg-white';
      case 'medium': return 'border-[#E2E2E2] bg-white';
      default: return 'border-[#E2E2E2] bg-white';
    }
  };

  return (
    <div className="p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith('+') && (stat.label.includes('Accuracy') || stat.trend.includes('-'));
          return (
            <div key={stat.label} className="bg-white rounded-3xl p-6 hover:bg-[#F4FDFC] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-3xl`}>
                  <Icon className="w-6 h-6 text-[#479AA8]" />
                </div>
                <span className={`text-sm px-2 py-1 rounded-3xl ${
                  isPositive ? 'bg-[#F4FDFC] text-[#479AA8]' : 'bg-[#F5F5F7] text-[#1F4A51]'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[#1F4A51] text-sm mb-1">{stat.label}</p>
              <p className="text-3xl text-[#1F4A51]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Training Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-5 h-5 text-[#479AA8]" />
            <h2 className="text-[#1F4A51] font-semibold">Đang huấn luyện</h2>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {trainingModels.map((model, index) => (
                  <div key={index} className="border border-[#E2E2E2] rounded-3xl p-4 hover:bg-[#F4FDFC] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-[#1F4A51] mb-1">{model.name}</h4>
                        <p className="text-sm text-[#1F4A51]">{model.gpu} • ETA: {model.eta}</p>
                      </div>
                      <span className="px-3 py-1 bg-[#DEF1EF] text-[#1F4A51] rounded-3xl text-sm">
                        {model.accuracy}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#1F4A51]">Tiến độ</span>
                        <span className="text-sm text-[#1F4A51]">{model.progress}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] rounded-3xl h-2">
                        <div
                          className="bg-[#479AA8] h-2 rounded-3xl transition-all"
                          style={{ width: `${model.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Activities */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Activity className="w-5 h-5 text-[#479AA8]" />
            <h2 className="text-[#1F4A51] font-semibold">Hoạt động cần xử lý gấp</h2>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {urgentActivities.map((activity, index) => (
                  <div key={index} className={`rounded-3xl p-4 border ${getPriorityColor(activity.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-[#1F4A51]">{activity.title}</h4>
                      <span className="text-xs text-[#1F4A51]">{activity.time}</span>
                    </div>
                    <p className="text-sm text-[#1F4A51]">{activity.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="space-y-3">
        <h2 className="text-[#1F4A51] font-semibold">Tài nguyên hệ thống</h2>
        <div className="bg-white rounded-3xl overflow-hidden">
          <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1F4A51]">GPU-1 Utilization</span>
                <span className="text-[#1F4A51]">95%</span>
              </div>
              <div className="w-full bg-[#F5F5F7] rounded-3xl h-2">
                <div className="bg-[#479AA8] h-2 rounded-3xl" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1F4A51]">GPU-2 Utilization</span>
                <span className="text-[#1F4A51]">78%</span>
              </div>
              <div className="w-full bg-[#F5F5F7] rounded-3xl h-2">
                <div className="bg-[#479AA8] h-2 rounded-3xl" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1F4A51]">Memory Usage</span>
                <span className="text-[#1F4A51]">64%</span>
              </div>
              <div className="w-full bg-[#F5F5F7] rounded-3xl h-2">
                <div className="bg-[#479AA8] h-2 rounded-3xl" style={{ width: '64%' }} />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

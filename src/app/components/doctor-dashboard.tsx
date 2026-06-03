import { Clock, CheckCircle, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { useData } from "./data-context";

interface DoctorDashboardProps {
  onNavigate?: (page: string) => void;
}

export function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const { appointments, consultations } = useData();

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'confirmed' && apt.date && apt.time)
    .map((apt) => ({ time: apt.time!, patient: apt.patient.name, reason: apt.reason }));

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending",
  ).length;
  const completedToday = appointments.filter(
    (apt) =>
      apt.date === new Date().toISOString().split("T")[0] &&
      apt.status === "completed",
  ).length;
  const pendingConsultations = consultations.filter(
    (c) => c.status === "pending",
  ).length;

  const stats = [
    {
      label: "Yêu cầu đặt lịch",
      value: pendingAppointments.toString(),
      icon: Clock,
      color: "bg-[#479AA8]",
    },
    {
      label: "Đã khám hôm nay",
      value: completedToday.toString(),
      icon: CheckCircle,
      color: "bg-[#479AA8]",
    },
    {
      label: "Thắc mắc chờ xử lý",
      value: pendingConsultations.toString(),
      icon: MessageSquare,
      color: "bg-[#479AA8]",
      onClick: () => onNavigate?.("consultations"),
    },
  ];


  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={stat.onClick}
              className={`bg-white rounded-3xl p-6 transition-shadow ${
                stat.onClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ color: "#6B7280" }} className="mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl" style={{ color: "#1F4A51" }}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-3xl`}>
                  <Icon
                    className={`w-6 h-6 ${stat.label === "Thắc mắc chờ xử lý" ? "text-white" : "text-white"}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lịch hẹn sắp tới */}
      <div className="bg-white rounded-3xl p-4 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <div className="bg-[#F4FDFC] p-2 rounded-3xl">
            <Calendar className="w-5 h-5 text-[#479AA8]" />
          </div>
          <h3 className="font-semibold" style={{ color: "#1F4A51" }}>Lịch hẹn sắp tới</h3>
        </div>

        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0 overflow-y-auto flex flex-col gap-3 pb-10">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-3xl bg-[#F5F5F7] border border-[#E5E7EB] flex-shrink-0 ">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate" style={{ color: "#1F4A51" }}>{apt.patient}</p>
                    <p className="text-xs line-clamp-1" style={{ color: "#6B7280" }}>{apt.reason}</p>
                  </div>
                  <div className="text-white px-3 py-2 rounded-3xl min-w-[72px] text-center bg-[#479AA8]">
                    <div className="font-medium text-sm">{apt.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-sm" style={{ color: "#6B7280" }}>Chưa có lịch hẹn nào</p>
            )}
          </div>
          {upcomingAppointments.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {upcomingAppointments.length > 0 && (
          <button
            onClick={() => onNavigate?.("appointments")}
            className="text-sm flex items-center gap-1 transition-colors text-[#479AA8] hover:text-[#1F4A51] justify-end mt-3 flex-shrink-0"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

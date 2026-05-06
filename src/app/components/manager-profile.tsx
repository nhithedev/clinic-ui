import { User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

export function ManagerProfile() {
  const managerInfo = {
    name: 'Lê Thị Manager',
    position: 'Quản lý phòng khám',
    email: 'manager@phongkham.vn',
    phone: '0976543210',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    dateOfBirth: '1988-03-20',
    employeeId: 'MNG-001',
    startDate: '2025-05-01'
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-[#479AA8] to-[#61a5c2] rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-[#1F4A51] font-semibold mb-1">{managerInfo.name}</h2>
              <p className="text-[#6B7280] mb-4">{managerInfo.position}</p>
              <div className="w-full bg-[#F5F5F7] rounded-3xl p-3 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Mã nhân viên</p>
                <p className="text-[#479AA8]">{managerInfo.employeeId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#6B7280]">Email</p>
                  <p className="text-[#1F4A51] break-words">{managerInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Điện thoại</p>
                  <p className="text-[#1F4A51]">{managerInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Địa chỉ</p>
                  <p className="text-[#1F4A51]">{managerInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Ngày sinh</p>
                  <p className="text-[#1F4A51]">{new Date(managerInfo.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Ngày vào làm</p>
                  <p className="text-[#1F4A51]">{new Date(managerInfo.startDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Responsibilities */}
          <div className="bg-white rounded-3xl  p-6">
            <h3 className="text-[#1F4A51] font-semibold mb-4">Trách nhiệm công việc</h3>
            <div className="space-y-3">
              <div className="bg-[#FFFFFF] rounded-3xl p-4 border border-2 border-[#E2E2E2]">
                <p className="text-[#1F4A51]">Quản lý tài khoản người dùng</p>
                <p className="text-sm text-[#6B7280] mt-1">Tạo, chỉnh sửa, xóa tài khoản của bệnh nhân, bác sĩ và nhân viên</p>
              </div>
              <div className="bg-[#FFFFFF] rounded-3xl p-4 border border-2 border-[#E2E2E2]">
                <p className="text-[#1F4A51]">Quản lý lịch làm việc</p>
                <p className="text-sm text-[#6B7280] mt-1">Phân chia và cập nhật lịch làm việc cho đội ngũ bác sĩ</p>
              </div>
              <div className="bg-[#FFFFFF] rounded-3xl p-4 border border-2 border-[#E2E2E2]">
                <p className="text-[#1F4A51]">Giám sát hoạt động phòng khám</p>
                <p className="text-sm text-[#6B7280] mt-1">Theo dõi và báo cáo các hoạt động, thống kê của phòng khám</p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-3xl  p-6">
            <h3 className="text-[#1F4A51] font-semibold mb-4">Quyền truy cập</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Quản lý tài khoản',
                'Quản lý lịch làm việc',
                'Xem báo cáo thống kê',
                'Quản lý hệ thống',
                'Cấu hình phòng khám',
                'Xem lịch sử hoạt động'
              ].map((permission, index) => (
                <div key={index} className="bg-[#F4FDFC] rounded-3xl p-4 flex items-start gap-3">
                  <div className="bg-[#479AA8] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </div>
                  <p className="text-[#1F4A51]">{permission}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#FFFFFF]  rounded-3xl p-4">
            <p className="text-sm text-[#1F4A51]">
              Để cập nhật thông tin cá nhân, vui lòng liên hệ quản trị viên hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

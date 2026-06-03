import { User, Mail, Phone, MapPin, Calendar, Award, Briefcase } from 'lucide-react';

export function DoctorProfile() {
  const doctorInfo = {
    name: 'Nguyễn Văn A',
    specialty: 'Bác sĩ Nội khoa',
    email: 'nguyenvana@phongkham.vn',
    phone: '0987654321',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    dateOfBirth: '1985-05-15',
    licenseNumber: 'BS-123456',
    experience: '12 năm',
    education: [
      'Bác sĩ Y khoa - Đại học Y Hà Nội (2003-2009)',
      'Thạc sĩ Nội khoa - Đại học Y Hà Nội (2010-2012)'
    ],
    certifications: [
      'Chứng chí hành nghề số BS-123456',
      'Chứng nhận điều trị nội khoa',
      'Chứng nhận cấp cứu tim mạch'
    ]
  };

  return (
    <div className="p-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-[#479AA8] to-[#61a5c2] rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-[#1F4A51] font-semibold mb-1">{doctorInfo.name}</h2>
              <p className="text-[#6B7280] mb-4">{doctorInfo.specialty}</p>
              <div className="w-full bg-[#F5F5F7] rounded-3xl p-3 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Mã bác sĩ</p>
                <p className="text-[#479AA8]">{doctorInfo.licenseNumber}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#6B7280]">Email</p>
                  <p className="text-[#1F4A51] break-words">{doctorInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Điện thoại</p>
                  <p className="text-[#1F4A51]">{doctorInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Địa chỉ</p>
                  <p className="text-[#1F4A51]">{doctorInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Ngày sinh</p>
                  <p className="text-[#1F4A51]">{new Date(doctorInfo.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">Kinh nghiệm</p>
                  <p className="text-[#1F4A51]">{doctorInfo.experience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          

          {/* Work Schedule */}
          <div className="bg-white rounded-3xl p-6">
            <h3 className="text-[#1F4A51] font-semibold mb-4">Lịch làm việc</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day, index) => (
                <div key={index} className={`p-4 rounded-3xl text-center ${
                  index < 6 ? 'bg-[#DEF1EF] border border-2 border-[#479AA8]' : 'bg-[#F5F5F7] border border-2 border-[#E5E7EB]'
                }`}>
                  <p className="text-sm text-[#1F4A51] mb-1">{day}</p>
                  <p className="text-xs text-[#6B7280]">
                    {index < 6 ? '8:00 - 17:00' : 'Nghỉ'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#F4FDFC] p-3 rounded-3xl">
                <Award className="w-6 h-6 text-[#479AA8]" />
              </div>
              <h3 className="text-[#1F4A51] font-semibold">Học vấn</h3>
            </div>
            <div className="space-y-3">
              {doctorInfo.education.map((edu, index) => (
                <div key={index} className="bg-[#ffffff] rounded-3xl p-4 border border-2 border-[#E2E2E2]">
                  <p className="text-[#1F4A51]">{edu}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#F4FDFC] p-3 rounded-3xl">
                <Award className="w-6 h-6 text-[#479AA8]" />
              </div>
              <h3 className="text-[#1F4A51] font-semibold">Chứng chỉ & Chuyên môn</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctorInfo.certifications.map((cert, index) => (
                <div key={index} className="bg-[#fffffff] rounded-3xl border border-2 border-[#E2E2E2] p-4 flex items-start gap-3">
                  <div className="bg-[#479AA8] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </div>
                  <p className="text-[#1F4A51]">{cert}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#FFFFFF] rounded-3xl p-4">
            <p className="text-sm text-[#1F4A51]">
              Để cập nhật thông tin cá nhân, vui lòng liên hệ quản lý phòng khám.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

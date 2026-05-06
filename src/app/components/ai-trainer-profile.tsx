import { User, Mail, Phone, Award, BookOpen, Calendar, CheckCircle } from 'lucide-react';

export function AITrainerProfile() {
  const expertInfo = {
    name: 'Nguyễn Văn Expert',
    position: 'Chuyên gia AI & Machine Learning',
    email: 'aitrainer@phongkham.vn',
    phone: '0965432109',
    specialty: ['NLP', 'Computer Vision', 'Healthcare AI'],
    certifications: [
      'TensorFlow Developer Certificate',
      'AWS Machine Learning Specialty',
      'Healthcare AI Specialist',
      'Deep Learning Specialization - Coursera'
    ],
    avatar: null,
    availability: 'Sẵn sàng tiếp nhận dự án',
    schedule: 'Thứ 2 - Thứ 6: 9:00 - 18:00',
    joinDate: '2024-01-15',
    projectsCompleted: 12,
    modelsDeployed: 8
  };

  return (
    <div className="p-8">
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-[#DEF1EF] rounded-3xl flex items-center justify-center mb-4 border border-[#E2E2E2]">
                <User className="w-16 h-16 text-[#479AA8]" />
              </div>
              <h2 className="text-[#1F4A51] font-semibold mb-1">{expertInfo.name}</h2>
              <p className="text-[#1F4A51] text-center mb-4">{expertInfo.position}</p>
              <div className="w-full bg-[#FFFFFF] rounded-3xl p-3 text-center mb-4 border border-[#E2E2E2]">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#479AA8]" />
                  <p className="text-sm text-[#1F4A51]">{expertInfo.availability}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1F4A51]">Email</p>
                  <p className="text-[#1F4A51] break-words">{expertInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#1F4A51]">Điện thoại</p>
                  <p className="text-[#1F4A51]">{expertInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#479AA8] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-[#1F4A51]">Lịch trực</p>
                  <p className="text-[#1F4A51]">{expertInfo.schedule}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E2E2E2]">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-[#F5F5F7] rounded-3xl p-3 border border-[#E2E2E2]">
                  <p className="text-2xl text-[#1F4A51] mb-1">{expertInfo.projectsCompleted}</p>
                  <p className="text-xs text-[#1F4A51]">Dự án hoàn thành</p>
                </div>
                <div className="bg-[#F5F5F7] rounded-3xl p-3 border border-[#E2E2E2]">
                  <p className="text-2xl text-[#1F4A51] mb-1">{expertInfo.modelsDeployed}</p>
                  <p className="text-xs text-[#1F4A51]">Model triển khai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Specialty */}
          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#DEF1EF] p-3 rounded-3xl">
                <BookOpen className="w-6 h-6 text-[#479AA8]" />
              </div>
              <h3 className="text-[#1F4A51] font-semibold">Lĩnh vực chuyên sâu</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {expertInfo.specialty.map((spec, index) => (
                <span key={index} className="px-4 py-2 bg-[#DEF1EF] text-[#1F4A51] rounded-3xl">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#DEF1EF] p-3 rounded-3xl">
                <Award className="w-6 h-6 text-[#479AA8]" />
              </div>
              <h3 className="text-[#1F4A51] font-semibold">Chứng chỉ chuyên môn</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expertInfo.certifications.map((cert, index) => (
                <div key={index} className="bg-[#FFFFFF] rounded-3xl p-4 flex items-start gap-3 border border-2 border-[#E2E2E2]">
                  <div className="bg-[#479AA8] text-white rounded-3xl w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </div>
                  <p className="text-[#1F4A51]">{cert}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="bg-white rounded-3xl p-6">
            <h3 className="text-[#1F4A51] font-semibold mb-4">Kinh nghiệm làm việc</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#479AA8] rounded-3xl" />
                  <div className="w-0.5 h-full bg-[#E2E2E2]" />
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-[#1F4A51] mb-1">Chuyên gia AI - Phòng khám gia đình</p>
                  <p className="text-sm text-[#1F4A51] mb-2">2024 - Hiện tại</p>
                  <p className="text-sm text-[#1F4A51]">
                    Phát triển và tối ưu các mô hình AI cho chatbot tư vấn y tế, phân loại bệnh lý
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#DEF1EF] rounded-3xl" />
                  <div className="w-0.5 h-full bg-[#E2E2E2]" />
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-[#1F4A51] mb-1">Machine Learning Engineer</p>
                  <p className="text-sm text-[#1F4A51] mb-2">2022 - 2024</p>
                  <p className="text-sm text-[#1F4A51]">
                    Xây dựng hệ thống recommendation và NLP cho ứng dụng healthcare
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#FFFFFF] rounded-3xl p-4">
            <p className="text-sm text-[#1F4A51]">
              Để cập nhật thông tin cá nhân, vui lòng liên hệ quản trị viên hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import {
  Upload,
  Download,
  List,
  Calendar as CalendarIcon,
  Check,
  X,
  AlertCircle,
  Search,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface DoctorSchedule {
  doctorName: string;
  schedule: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  errors?: { [key: string]: string };
}

export function ScheduleManagement() {
  const [currentSchedules, setCurrentSchedules] = useState<DoctorSchedule[]>(
    [],
  );
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [uploadedData, setUploadedData] = useState<DoctorSchedule[] | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const daysOfWeek = [
    { key: "monday", label: "Thứ 2" },
    { key: "tuesday", label: "Thứ 3" },
    { key: "wednesday", label: "Thứ 4" },
    { key: "thursday", label: "Thứ 5" },
    { key: "friday", label: "Thứ 6" },
    { key: "saturday", label: "Thứ 7" },
    { key: "sunday", label: "CN" },
  ];

  const downloadTemplate = () => {
    const templateData = [
      [
        "Tên bác sĩ",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "CN",
      ],
      [
        "BS. Nguyễn Văn A",
        "8:00–12:00",
        "",
        "8:00–17:00",
        "8:00–12:00",
        "",
        "8:00–12:00",
        "",
      ],
      [
        "BS. Trần Thị B",
        "",
        "13:00–17:00",
        "",
        "13:00–17:00",
        "8:00–17:00",
        "",
        "",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lịch làm việc");
    XLSX.writeFile(wb, "template_lich_lam_viec.xlsx");
  };

  const validateTimeFormat = (timeStr: string): boolean => {
    if (!timeStr || timeStr.trim() === "") return true;

    const patterns = [
      /^\d{1,2}:\d{2}–\d{1,2}:\d{2}$/,
      /^\d{1,2}:\d{2}–\d{1,2}:\d{2},\s*\d{1,2}:\d{2}–\d{1,2}:\d{2}$/,
    ];

    return patterns.some((pattern) => pattern.test(timeStr.trim()));
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        }) as any[][];

        if (jsonData.length < 2) {
          setParseErrors(["File không có dữ liệu hoặc thiếu header"]);
          return;
        }

        const errors: string[] = [];
        const schedules: DoctorSchedule[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const doctorName = row[0]?.toString().trim();
          if (!doctorName) {
            errors.push(`Hàng ${i + 1}: Thiếu tên bác sĩ`);
            continue;
          }

          const schedule: DoctorSchedule = {
            doctorName,
            schedule: {},
            errors: {},
          };

          const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ];
          days.forEach((day, index) => {
            const cellValue = row[index + 1]?.toString().trim() || "";
            if (cellValue) {
              if (!validateTimeFormat(cellValue)) {
                schedule.errors![day] =
                  "Sai định dạng giờ (phải dạng HH:MM–HH:MM)";
                errors.push(
                  `${doctorName} - ${daysOfWeek[index].label}: Sai định dạng "${cellValue}"`,
                );
              }
              schedule.schedule[day as keyof typeof schedule.schedule] =
                cellValue;
            }
          });

          schedules.push(schedule);
        }

        setUploadedData(schedules);
        setParseErrors(errors);
        setShowPreview(true);
      } catch {
        setParseErrors(["Lỗi đọc file: File không đúng định dạng Excel"]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseExcelFile(file);
    }
  };

  const handleConfirmUpload = () => {
    if (uploadedData) {
      const cleanedData = uploadedData.map(({ errors, ...rest }) => rest);
      setCurrentSchedules(cleanedData);
      toast.success(
        `Đã cập nhật lịch làm việc cho ${cleanedData.length} bác sĩ thành công!`,
      );
    }
    setShowPreview(false);
    setUploadedData(null);
    setParseErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelUpload = () => {
    setShowPreview(false);
    setUploadedData(null);
    setParseErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getShiftCount = (schedule: DoctorSchedule["schedule"]) => {
    return Object.values(schedule).filter((v) => v).length;
  };

  const totalShifts = currentSchedules.reduce(
    (sum, doc) => sum + getShiftCount(doc.schedule),
    0,
  );

  const getDoctorsAtTime = (day: string, time: string) => {
    return currentSchedules.filter((doc) => {
      const shift = doc.schedule[day as keyof typeof doc.schedule];
      if (!shift) return false;

      const timeNum = parseInt(time.split(":")[0]);
      const shifts = shift.split(",").map((s) => s.trim());

      return shifts.some((s) => {
        const [start, end] = s.split("–").map((t) => parseInt(t.split(":")[0]));
        return timeNum >= start && timeNum < end;
      });
    });
  };

  const previewData = uploadedData || currentSchedules;
  const hasErrors = parseErrors.length > 0;
  const totalDoctors = previewData.length;
  const totalPreviewShifts = previewData.reduce(
    (sum, doc) => sum + getShiftCount(doc.schedule),
    0,
  );

  const filteredDoctors = currentSchedules.filter(
    (doctor) =>
      searchQuery === "" ||
      doctor.doctorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );


  return (
    <div className="h-full flex flex-col overflow-hidden p-4">
      {/* ── COMPACT TOOLBAR (always visible) ── */}
      <div className="flex items-center gap-2 flex-shrink-0 mb-4 flex-wrap">
        {/* View mode toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-3xl transition-colors ${
              viewMode === "list"
                ? "bg-[#479AA8] text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB]"
            }`}
          >
            <List className="w-4 h-4" />
            Danh sách
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-3xl transition-colors ${
              viewMode === "timeline"
                ? "bg-[#479AA8] text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB]"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Timeline
          </button>
        </div>
        <div className="flex-1" />

        {/* Search (list view, has data) */}
        {viewMode === "list" && currentSchedules.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bác sĩ..."
              className="pl-9 pr-4 py-1.5 bg-white border border-[#E5E7EB] rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#479AA8]"
            />
          </div>
        )}

        {/* Action buttons */}
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#479AA8] border border-[#479AA8] rounded-3xl hover:bg-[#F4FDFC] transition-colors"
        >
          <Download className="w-4 h-4" />
          Tải template
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Excel
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
             {/* KPI mini-badges */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full">
            <span className="text-[#6B7280]">Tổng số bác sĩ:</span>
            <span className="font-semibold text-[#1F4A51]">
              {currentSchedules.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full">
            <span className="text-[#6B7280]">Tổng số ca/tuần:</span>
            <span className="font-semibold text-[#1F4A51]">{totalShifts}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full">
            <span className="text-[#6B7280]">Trung bình ca/bác sĩ:</span>
            <span className="font-semibold text-[#1F4A51]">
              {currentSchedules.length > 0
                ? (totalShifts / currentSchedules.length).toFixed(1)
                : "0"}
            </span>
          </div>
        </div>

      {!showPreview && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Empty State */}
          {currentSchedules.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-[#E5E7EB]">
              <div className="text-center">
                <div className="bg-[#F4FDFC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-[#479AA8]" />
                </div>
                <h3 className="text-[#1F4A51] mb-2">Chưa có lịch làm việc</h3>
                <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
                  Tải xuống file template Excel, điền thông tin lịch làm việc
                  của bác sĩ, sau đó upload lên hệ thống
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#479AA8] border-2 border-[#479AA8] rounded-3xl hover:bg-[#F4FDFC] transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Tải template
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#479AA8] text-white rounded-3xl hover:bg-[#1F4A51] transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Upload file Excel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* List View */}
          {viewMode === "list" && currentSchedules.length > 0 && (
            <div className="space-y-4">
              {currentSchedules
                .filter(
                  (doctor) =>
                    searchQuery === "" ||
                    doctor.doctorName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((doctor, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden"
                  >
                    <div className="p-4 bg-[#F4FDFC] border-b border-[#E5E7EB] flex items-center justify-between">
                      <h3 className="text-[#1F4A51] ">{doctor.doctorName}</h3>
                      <span className="px-3 py-1 bg-[#479AA8] text-white rounded-lg text-sm">
                        {getShiftCount(doctor.schedule)} ca/tuần
                      </span>
                    </div>
                    <div className="px-4 pt-2 pb-4">
                      <div className="mx-4 grid grid-cols-7 gap-10">
                        {daysOfWeek.map((day) => (
                          <div key={day.key} className="text-center">
                            <p className="text-sm text-[#6B7280] mb-2">
                              {day.label}
                            </p>
                            <div
                              className={`p-3 rounded-lg min-h-[20px] flex items-center justify-center ${
                                doctor.schedule[
                                  day.key as keyof typeof doctor.schedule
                                ]
                                  ? "bg-[#DEF1EF] border-2 border-[#479AA8]"
                                  : "bg-[#F5F5F7] border border-[#E5E7EB]"
                              }`}
                            >
                              <p className="text-sm text-[#1F4A51]">
                                {doctor.schedule[
                                  day.key as keyof typeof doctor.schedule
                                ] || "—"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ── TIMELINE VIEW — rows = ngày, cols = giờ, fill container ── */}
          {viewMode === "timeline" && currentSchedules.length > 0 && (
            <div className="flex-1 min-h-0 bg-white rounded-3xl overflow-hidden p-4">
              <table className="w-full h-full table-fixed border-collapse">
                <thead>
                  <tr>
                    {/* Ngày column: fixed narrow width; hour cols split the rest equally */}
                    <th className="w-32 px-2 py-2 text-center text-sm font-semibold text-[#6B7280] bg-[#F5F5F7] border-b border-r border-[#E5E7EB]">
                      Ngày
                    </th>
                    {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                      <th
                        key={hour}
                        className="px-1 py-2 text-center text-sm font-semibold text-[#6B7280] bg-[#F5F5F7] border-b border-[#E5E7EB]"
                      >
                        {hour}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day, dayIdx) => (
                    <tr
                      key={day.key}
                      className={`hover:bg-[#F4FDFC] transition-colors ${dayIdx < daysOfWeek.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
                    >
                      <td className="py-2 text-sm font-semibold text-[#1F4A51] border-r border-[#E5E7EB] text-center">
                        {day.label}
                      </td>
                      {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => {
                        const doctors = getDoctorsAtTime(day.key, `${hour}:00`);
                        return (
                          <td
                            key={hour}
                            className="text-center relative group/cell"
                          >
                            {doctors.length > 0 ? (
                              <>
                                <span className="inline-flex items-center justify-center w-7 h-7 bg-[#479AA8] text-white rounded-lg text-xs font-semibold cursor-default select-none">
                                  {doctors.length}
                                </span>
                                <div className="pointer-events-none absolute hidden group-hover/cell:flex flex-col z-30 left-1/2 -translate-x-1/2 top-full mt-1 bg-white shadow-xl rounded-xl border border-[#E5E7EB] p-2 min-w-[150px]">
                                  {doctors.map((d, i) => (
                                    <span key={i} className="text-sm text-[#1F4A51] py-0.5 whitespace-nowrap">
                                      {d.doctorName}
                                    </span>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <span className="text-[#9CA3AF]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && uploadedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-3xl max-w-7xl w-full my-8">
            <div className="p-6 bg-[#FFFFFF] text-[#1F4A51] font-semibold rounded-t-3xl">
              <h3>Preview dữ liệu lịch làm việc</h3>
            </div>

            <div className="px-6 py-4">
              <div
                className={`mb-6 p-4 rounded-3xl ${
                  hasErrors ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      hasErrors ? "text-red-600" : "text-green-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`mb-2 ${hasErrors ? "text-red-800" : "text-green-800"}`}
                    >
                      Tìm thấy <strong>{totalDoctors} bác sĩ</strong> -{" "}
                      <strong>{totalPreviewShifts} ca làm việc</strong> trong
                      tuần
                      {hasErrors && (
                        <>
                          {" "}
                          -{" "}
                          <strong className="text-red-600">
                            {parseErrors.length} lỗi
                          </strong>{" "}
                          cần kiểm tra
                        </>
                      )}
                    </p>
                    {hasErrors && (
                      <ul className="space-y-1 text-sm text-red-700">
                        {parseErrors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-auto max-h-[50vh] border border-[#E5E7EB] rounded-3xl">
                <table className="w-full">
                  <thead className="bg-[#F5F5F7] border-b border-[#E5E7EB] sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-[#6B7280]">
                        Tên bác sĩ
                      </th>
                      {daysOfWeek.map((day) => (
                        <th
                          key={day.key}
                          className="px-4 py-3 text-center text-sm text-[#6B7280]"
                        >
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((doctor, index) => (
                      <tr key={index} className="border-b border-[#E5E7EB]">
                        <td className="px-4 py-3 text-[#1F4A51]">
                          {doctor.doctorName}
                        </td>
                        {daysOfWeek.map((day) => {
                          const value =
                            doctor.schedule[
                              day.key as keyof typeof doctor.schedule
                            ];
                          const error = doctor.errors?.[day.key];
                          return (
                            <td key={day.key} className="px-4 py-3 text-center">
                              <div
                                className={`p-2 rounded-3xl ${
                                  error
                                    ? "bg-red-100 border-2 border-red-500"
                                    : value
                                      ? "bg-[#DEF1EF]"
                                      : "bg-[#F5F5F7]"
                                }`}
                                title={error}
                              >
                                <p className="text-sm text-[#1F4A51]">
                                  {value || "—"}
                                </p>
                                {error && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {error}
                                  </p>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 flex gap-3 rounded-b-3xl">
              <button
                onClick={handleCancelUpload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#1F4A51] border border-[#E5E7EB] rounded-3xl hover:bg-[#F5F5F7] transition-colors"
              >
                <X className="w-5 h-5" />
                Hủy
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={hasErrors}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-3xl transition-colors ${
                  hasErrors
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#479AA8] text-white hover:bg-[#1F4A51]"
                }`}
              >
                <Check className="w-5 h-5" />
                Xác nhận upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

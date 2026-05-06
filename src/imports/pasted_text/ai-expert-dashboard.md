1. Dashboard và Tổng quan
Chuyên gia AI đăng nhập vào hệ thống và truy cập trực tiếp vào Dashboard điều hành. Dashboard hiển thị các chỉ số vận hành kỹ thuật như: 
Số lượng mô hình đang huấn luyện số yêu cầu cấu hình mới
Số lượng dữ liệu chờ gán nhãn/xác thực
Tỷ lệ chính xác (accuracy) trung bình của các phiên bản hiện tại
Số lượng cảnh báo (anomalies) từ hệ thống AI đang chạy thực tế
Các hoạt động gần đây cần xử lý gấp (như lỗi hội tụ, thiếu tài nguyên GPU) được ưu tiên hiển thị nổi bật.
2. Quản lý Huấn luyện (Training Management)
Từ sidebar, chuyên gia có thể vào màn hình Quản lý Phiên huấn luyện. Màn hình này sử dụng các Container cứng để phân tách nhóm dữ liệu chính:
Yêu cầu huấn luyện mới: Tổng hợp các bài toán/yêu cầu cấu hình AI mới, chuyên gia có thể tạo yêu cầu mới, khi đó sẽ hiện ra 1 Quick-view Panel để điền thông tin của yêu cầu. Ngoài ra, khi bấm vào chi tiết 1 yêu cầu sẽ chuyển qua mục 4 → Đang huấn luyện: Các mô hình đang trong quá trình học, ẩn giao diện của Container cũ và chỉ hiện thanh loading quá trình huấn luyện.
Đã hoàn thành: Các phiên bản mô hình đã sẵn sàng để đánh giá hoặc triển khai. Hiển thị sơ bộ kết quả huấn luyện, khi ấn vào nút chi tiết thì chuyển đến mục 6
Danh sách có thanh tìm kiếm và bộ lọc bổ sung: độ ưu tiên do hệ thống tự đề xuất, thời gian khởi tạo, loại thuật toán, và trạng thái tài nguyên. Có chế độ Calendar View hoặc Timeline View để theo dõi mật độ sử dụng GPU/CPU theo thời gian, giúp chuyên gia điều phối lịch huấn luyện tránh quá tải hệ thống.
3. Hồ sơ Chuyên gia (Expert Profile)
Chuyên gia có trang hồ sơ cá nhân truy cập từ sidebar để cập nhật xem: 
Thông tin cá nhân.
Ảnh đại diện.
Lĩnh vực chuyên sâu (NLP, Computer Vision, Recommendation...).
Các chứng chỉ chuyên môn.
Lịch trình trực tuyến để hỗ trợ kỹ thuật. 
Trạng thái sẵn sàng tiếp nhận dự án mới.
4. Xem nhanh và Chi tiết Yêu cầu
Tại danh sách yêu cầu, chuyên gia có thể bấm vào 1 yêu cầu để mở giao diện chi tiết của yêu cầu. Thông tin hiển thị bao gồm:
Thông tin cơ bản: Tên dự án, tập dữ liệu sử dụng.
Tóm tắt bài toán: Mục tiêu huấn luyện do AI hệ thống tự tổng hợp.
Thông số kỹ thuật: Mức độ ưu tiên, lịch sử các phiên bản (versioning) đã chạy trước đó, nhật ký lỗi (logs), và lịch sử trao đổi với bộ phận thu thập dữ liệu.
Tình trạng dữ liệu: Nguồn dữ liệu (từ user, từ crawling, hay synthetic data) và độ sạch của dữ liệu (đủ nhãn, thiếu nhãn, dữ liệu nhiễu cần lọc).
Bên dưới sẽ hiển thị chi tiết file dữ liệu huấn luyện.
Chuyên gia có thể Tiếp nhận hoặc Từ chối yêu cầu huấn luyện bằng cách bấm nút ngay tại danh sách ở mục 2 hoặc ở dưới cùng của giao diện.
Khi tiếp nhận: Hệ thống tự động cấp phát tài nguyên tính toán, cập nhật trạng thái "In-training" và gửi thông báo xác nhận cho bộ phận liên quan, đồng thời hiển thị toast thông báo thành công cho chuyên gia. Sau đó quay trở lại mục 2 và chuyển sang phần Đang huấn luyện.
Khi từ chối: Chuyên gia phải nhập lý do (thiếu tài nguyên, dữ liệu không đạt chuẩn, sai thuật toán đề xuất...). Hệ thống sẽ lưu vào nhật ký hệ thống.
6. Cập nhật Kết quả và Tối ưu hóa
Chuyên gia có màn hình Đánh giá & Cấu hình kết quả. Tại đây, chuyên gia mở hồ sơ phiên huấn luyện hiện tại để cập nhật:
Thông số đo lường: Precision, Recall, F1-score, Loss curve.
Chẩn đoán mô hình: Nhận định về tình trạng Overfitting/Underfitting.
Hướng xử lý tiếp theo: Tinh chỉnh Hyperparameters, bổ sung dữ liệu, hoặc thay đổi kiến trúc mạng.
Ghi chú kỹ thuật: Các lưu ý về môi trường triển khai (Deployment environment).
Chuyên gia có thể Lưu nháp cấu hình, Lưu hoàn tất để đóng phiên huấn luyện, hoặc Xuất báo cáo (Export) kết quả đánh giá. Hệ thống hỗ trợ tách riêng:
Báo cáo triển khai: Dành cho bộ phận DevOps/Product (chứa các chỉ số hiệu năng).
Ghi chú nội bộ: Dành riêng cho đội ngũ chuyên gia AI để nghiên cứu sâu hơn.
7. Cấu hình Prompt & Kiểm thử Chatbot
Trình soạn thảo Prompt 
System Role: Ô nhập liệu lớn để định nghĩa vai trò (Ví dụ: "Bạn là một chuyên gia tư vấn y tế thấu cảm, sử dụng kết quả chẩn đoán từ hệ thống để đưa ra lời khuyên...").
Context Injection: Cấu hình cách nhúng dữ liệu bệnh lý vào câu trả lời (Ví dụ: {tên_bệnh}, {độ_tin_cậy}, {triệu_chứng_người_dùng}).
Tone & Style: Thanh gạt hoặc dropdown để chọn sắc thái (Thấu cảm, Nghiêm túc, Khẩn cấp).
Nút Lưu phiên bản (Version Control): Lưu lại các bản prompt v1, v2 để đối soát.
Cửa sổ Kiểm thử 
Input Simulator: Cho phép chuyên gia chọn một "Nhãn bệnh lý" giả lập và nhập câu hỏi của người dùng.
Chat Preview: Cửa sổ hội thoại hiển thị câu trả lời thực tế của chatbot dựa trên Prompt vừa soạn thảo.
Chỉ số đánh giá nhanh (Real-time Metrics): Hệ thống tự động chấm điểm câu trả lời dựa trên:
Accuracy: Có khớp với kho tri thức không?
Empathy: Độ thấu cảm có đạt yêu cầu không?
Safety: Có vi phạm rào cản y tế không?
Nút "Run Blind Test": Chạy tự động 50 tình huống giả định và xuất báo cáo tỷ lệ đạt/lỗi.
8. Giám sát Hoạt động
Nhật ký hội thoại cần chú ý (Priority Logs)
Danh sách các cuộc trò chuyện được lọc theo:
Cảnh báo an toàn (Safety Flags): Các ca chatbot nhắc đến tên thuốc cấm hoặc người dùng có biểu hiện tiêu cực.
Độ tự tin thấp (Low Confidence): Những ca mà mô hình phân loại không chắc chắn về bệnh lý.
Phản hồi tiêu cực: Những ca người dùng nhấn "Dislike" hoặc đánh giá 1 sao.
Bảng điều khiển Rào cản (Guardrails Dashboard)
Keyword Blacklist: Danh sách các từ khóa chatbot tuyệt đối không được tự ý tư vấn (Ví dụ: tên các loại thuốc kháng sinh liều cao, phẫu thuật xâm lấn).
Action Thresholds: Cấu hình ngưỡng tự động chuyển hướng (Ví dụ: Nếu xác suất bệnh nguy hiểm > 70% -> Tự động ngắt chatbot và hiện nút "Kết nối bác sĩ cấp cứu").
Hiệu chỉnh (Expert Correction Panel)
Khi bấm vào một cuộc hội thoại lỗi, chuyên gia có thể:
Sửa câu trả lời: Viết lại câu trả lời đúng mẫu cho tình huống đó.
Nút "Feed to Training": Gắn nhãn câu trả lời vừa sửa để đưa vào tập dữ liệu huấn luyện lại chatbot (RLHF).
Ghi chú nội bộ: Để các chuyên gia khác hoặc bác sĩ biết lý do tại sao ca này cần can thiệp.


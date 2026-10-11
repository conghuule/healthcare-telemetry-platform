# I. Business Goals

- Chuyển đổi số giám sát: Tự động hóa tiếp nhận chỉ số sinh tồn (Heart Rate, SpO2, Bước chân) từ thiết bị đeo cá nhân thay cho việc ghi chép thủ công.
- Phản ứng sớm (Early Detection): Giúp nhân viên y tế phát hiện bất thường qua cơ chế cảnh báo tự động trên màn hình portal.

# II. User Personas

- Persona 1 Patient: đeo thiết bị đo
- Persona 2 Clinic: theo dõi bệnh nhân qua portal
- Persona 3 Admin: giám sát thiết bị, bệnh nhân và clinic

# III. User Stories

## Module 1: Ingestion & Device Integration

### Feature 1.1: Tự động tiếp nhận và đồng bộ chỉ số từ thiết bị

- User Story (US-01):
  Là một Thiết bị đeo y tế (hoặc Thiết bị mô phỏng IoT),
  Tôi muốn gửi các gói tin đo nhịp tim và SpO2 định kỳ lên hệ thống qua đường truyền mã hóa,
  Để dữ liệu sức khỏe của bệnh nhân được lưu trữ đầy đủ mà không đòi hỏi bệnh nhân phải bấm gửi thủ công.

- Luồng xử lý (Business Flow):

* Thiết bị gom các chỉ số đo được cùng mốc thời gian đo thực tế (recorded_at).
* Thiết bị gửi gói tin kèm mã giao dịch duy nhất (messageId).
* Hệ thống kiểm tra hợp lệ, ghi nhận thời gian nhận của máy chủ (serverTimestamp) và phản hồi xác nhận cho thiết bị.

## Module 2: Medical Portal Dashboard

### Feature 2.1: Giám sát chỉ số qua thời gian thực

- User Story (US-02):
  Là một Bác sĩ / Điều dưỡng trực ban,
  Tôi muốn xem màn hình hiển thị trực quan chỉ số đo đạc gần nhất của bệnh nhân,
  Để nắm bắt tình trạng sức khỏe hiện tại của bệnh nhân.

- Mô tả giao diện & Luồng tương tác (UI Flow):

* Trang chủ hiển thị bảng danh sách patient/device.
* Mỗi dòng gồm: STT, tên bệnh nhân, mã thiết bị, trạng thái, thời gian cập nhật và nút mở detail.
* Bác sĩ chọn một dòng để mở hồ sơ patient gồm tên, tuổi, quê quán, thiết bị và telemetry.
* Detail page polling dữ liệu mới mỗi 3 giây.

### Feature 2.2: Cảnh báo vượt ngưỡng tự động

- User Story (US-02):
  Là một Bác sĩ trực ban,
  Tôi muốn giao diện phát tín hiệu cảnh báo màu sắc và thông báo nổi bật khi chỉ số của bệnh nhân vượt quá ngưỡng an toàn,
  Để tôi lập tức chú ý và ra chỉ định cấp cứu hoặc can thiệp y tế khẩn cấp.

- Mô tả giao diện & Luồng tương tác (UI Flow):

* Dòng patient/detail chuyển sang trạng thái cảnh báo khi nhịp tim vượt `120 BPM`.
* Điểm vượt ngưỡng trên line chart được đánh dấu màu đỏ.

## Module 3: History & Trend Analysis

### Feature 3.1: Xem biểu đồ diễn biến 24 giờ

- User Story (US-04):
  Là một Bác sĩ điều trị,
  Tôi muốn xem biểu đồ đường (line chart) thể hiện sự biến thiên nhịp tim của bệnh nhân trong 24 giờ qua,
  Để đánh giá phản ứng của bệnh nhân với phác đồ điều trị hoặc phát hiện các cơn loạn nhịp xảy ra lúc nửa đêm.

- Mô tả giao diện & Luồng tương tác (UI Flow):

* Bác sĩ bấm vào xem chi tiết lịch sử bệnh nhân
* Hiện thị biểu đồ đo trong 24h gần nhất theo trục ngang (thời gian) và trục dọc (BPM), các điểm có giá trị vượt ngưỡng được đánh dấu chấm màu đỏ nổi bật.

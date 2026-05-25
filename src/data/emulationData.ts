/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Unit, ReportSubmission, Department } from '../types';

export const UNITS_DATA: Unit[] = [
  { Ma_DV: 'TKPH', Ten_Don_Vi: 'Chi cục Thống kê TP. Hưng Yên', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKNQ', Ten_Don_Vi: 'Chi cục Thống kê huyện Văn Lâm', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKYM', Ten_Don_Vi: 'Chi cục Thống kê huyện Yên Mỹ', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKMH', Ten_Don_Vi: 'Chi cục Thống kê thị xã Mỹ Hào', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKKC', Ten_Don_Vi: 'Chi cục Thống kê huyện Khoái Châu', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKLB', Ten_Don_Vi: 'Chi cục Thống kê huyện Kim Động', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKHHT', Ten_Don_Vi: 'Chi cục Thống kê huyện Phù Cừ', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKQP', Ten_Don_Vi: 'Chi cục Thống kê huyện Quỳnh Phụ', Vung: 'Thái Bình' },
  { Ma_DV: 'TKHH', Ten_Don_Vi: 'Chi cục Thống kê huyện Hưng Hà', Vung: 'Thái Bình' },
  { Ma_DV: 'TKDH', Ten_Don_Vi: 'Chi cục Thống kê huyện Đông Hưng', Vung: 'Thái Bình' },
  { Ma_DV: 'TKTT', Ten_Don_Vi: 'Chi cục Thống kê huyện Thái Thụy', Vung: 'Thái Bình' },
  { Ma_DV: 'TKTH', Ten_Don_Vi: 'Chi cục Thống kê huyện Tiền Hải', Vung: 'Thái Bình' },
  { Ma_DV: 'TKKX', Ten_Don_Vi: 'Chi cục Thống kê huyện Kiến Xương', Vung: 'Thái Bình' },
  { Ma_DV: 'TKVT', Ten_Don_Vi: 'Chi cục Thống kê huyện Vũ Thư', Vung: 'Thái Bình' }
];

export const DEPARTMENTS_DATA: Department[] = [
  { Ma_Phong: 'P_TH', Ten_Phong: 'Phòng Thống kê Tổng hợp' },
  { Ma_Phong: 'P_TC', Ten_Phong: 'Phòng Tài chính - Kế hoạch' },
  { Ma_Phong: 'P_TCHC', Ten_Phong: 'Phòng Tổ chức - Hành chính' },
  { Ma_Phong: 'P_NN', Ten_Phong: 'Phòng Thống kê Nông nghiệp' },
  { Ma_Phong: 'P_CN', Ten_Phong: 'Phòng Thống kê Công nghiệp - Xây dựng' },
  { Ma_Phong: 'P_DV', Ten_Phong: 'Phòng Thống kê Thương mại - Dịch vụ' }
];

export const REPORT_TEMPLATES = [
  { name: "Ước thu ngân sách 6 tháng đầu năm", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-06-15", score: 30 },
  { name: "Báo cáo ước tính thu ngân sách 6 tháng", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-06-15", score: 30 },
  { name: "Niên giám Thống kê cấp xã năm 2025", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-06-15", score: 200 },
  { name: "Báo cáo tổng kết công tác năm", dept: "P_TC", deptName: "Phòng Tài chính - Kế hoạch", type: "Năm", deadline: "2025-11-01", score: 50 },
  { name: "Báo cáo tổng kết công tác thống kê năm 2025", dept: "P_TC", deptName: "Phòng Tài chính - Kế hoạch", type: "Năm", deadline: "2026-11-20", score: 50 },
  { name: "Báo cáo thiên tai tháng 01/2026", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Tháng", deadline: "2026-01-25", score: 30 },
  { name: "Báo cáo thiên tai tháng 02/2026", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Tháng", deadline: "2026-02-25", score: 30 },
  { name: "Báo cáo thiên tai tháng 03/2026", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Tháng", deadline: "2026-03-25", score: 30 },
  { name: "Chỉ số sản xuất công nghiệp (IIP) tháng 03/2026", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Tháng", deadline: "2026-03-18", score: 20 },
  { name: "Báo cáo tình hình sản xuất sản phẩm công nghiệp tháng 01", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Tháng", deadline: "2026-01-15", score: 25 },
  { name: "Kết quả hoạt động bán lẻ hàng hóa tháng 03/2026", dept: "P_DV", deptName: "Phòng Thống kê Thương mại - Dịch vụ", type: "Tháng", deadline: "2026-03-12", score: 20 },
  { name: "Báo cáo Giá tiêu dùng tháng 01 - Kỳ 1", dept: "P_DV", deptName: "Phòng Thống kê Thương mại - Dịch vụ", type: "Kỳ", deadline: "2026-01-02", score: 15 },
  { name: "Báo cáo Giá tiêu dùng tháng 01 - Kỳ 2", dept: "P_DV", deptName: "Phòng Thống kê Thương mại - Dịch vụ", type: "Kỳ", deadline: "2026-01-12", score: 15 },
  { name: "Báo cáo Giá tiêu dùng tháng 01 - Kỳ 3", dept: "P_DV", deptName: "Phòng Thống kê Thương mại - Dịch vụ", type: "Kỳ", deadline: "2026-01-22", score: 15 },
  { name: "Báo cáo tình hình sử dụng biên chế quỹ lương tháng 01", dept: "P_TCHC", deptName: "Phòng Tổ chức - Hành chính", type: "Tháng", deadline: "2026-01-05", score: 15 },
  { name: "Báo cáo kết quả thực hiện Cải cách hành chính Quý I", dept: "P_TCHC", deptName: "Phòng Tổ chức - Hành chính", type: "Quý", deadline: "2026-03-15", score: 40 },
  { name: "Báo cáo công tác cán bộ đào tạo bồi dưỡng năm 2026", dept: "P_TCHC", deptName: "Phòng Tổ chức - Hành chính", type: "Năm", deadline: "2026-12-25", score: 100 }
];

/**
 * Generate beautifully pre-populated submission records that contain a realistic distribution of:
 * - On time submissions (high scores)
 * - Late submissions (some penalty days and deductions)
 * - Non-submitted reports (outstanding ones, current time is mid-2026)
 */
export function generateInitialSubmissions(): ReportSubmission[] {
  const submissions: ReportSubmission[] = [];
  let currentId = 1;

  UNITS_DATA.forEach((unit) => {
    REPORT_TEMPLATES.forEach((template, tIdx) => {
      const deadlineDate = new Date(template.deadline);
      const isPast = deadlineDate < new Date('2026-05-25'); // Current system date is May 25, 2026

      let ngayNop: string | null = null;
      let soNgayTre: number | null = null;
      let diemThoiGian: number | null = null;
      let diemChatLuong: number | null = null;
      let tongDiem: number | null = null;
      let nhanXet = "";

      if (isPast) {
        // 85% chance of being submitted if deadline has passed
        const submitted = Math.random() < 0.88;
        if (submitted) {
          // 80% chance of being on time, 20% chance of late
          const isLate = Math.random() < 0.20;
          if (isLate) {
            // Late submit: between 1 and 8 days late
            const delayDays = Math.floor(Math.random() * 8) + 1;
            const subDate = new Date(deadlineDate);
            subDate.setDate(subDate.getDate() + delayDays);
            
            ngayNop = subDate.toISOString().split('T')[0];
            soNgayTre = delayDays;
            
            // Penalty: -2 index points per day late, minimum score is 0
            diemThoiGian = Math.max(0, template.score - (delayDays * 2));
            // Quality score random between 75% to 100% of standard
            const qualityRatio = 0.7 + (Math.random() * 0.3);
            diemChatLuong = Math.round(template.score * qualityRatio * 10) / 10;
            tongDiem = Math.round((diemThoiGian + diemChatLuong) * 10) / 10;
            nhanXet = `Nộp trễ hạn ${delayDays} ngày. Báo cáo chất lượng đạt, cần rút kinh nghiệm về tiến độ.`;
          } else {
            // On time submit: 1 to 5 days early or exactly on prompt
            const advanceDays = Math.floor(Math.random() * 4);
            const subDate = new Date(deadlineDate);
            subDate.setDate(subDate.getDate() - advanceDays);
            
            ngayNop = subDate.toISOString().split('T')[0];
            soNgayTre = 0;
            diemThoiGian = template.score; // Maximum score for time constraint
            
            // Quality score random high (85% to 100%)
            const qualityRatio = 0.85 + (Math.random() * 0.15);
            diemChatLuong = Math.round(template.score * qualityRatio * 10) / 10;
            tongDiem = Math.round((diemThoiGian + diemChatLuong) * 10) / 10;
            nhanXet = "Nộp đúng hạn đạt kết quả xuất sắc. Nội dung số liệu đối chiếu sạch sẽ.";
          }
        } else {
          // Past deadline and still NOT submitted
          ngayNop = null;
          soNgayTre = null;
          diemThoiGian = 0;
          diemChatLuong = 0;
          tongDiem = 0;
          nhanXet = "⚠️ QUÁ HẠN: Đơn vị chưa nộp tờ trình báo cáo kịp thời.";
        }
      } else {
        // Deadline is in the FUTURE (e.g., June or Dec 2026)
        // 30% chance they submitted early, 70% still pending
        const submittedEarly = Math.random() < 0.3;
        if (submittedEarly) {
          const subDate = new Date(deadlineDate);
          subDate.setDate(subDate.getDate() - Math.floor(Math.random() * 15) - 1);
          
          ngayNop = subDate.toISOString().split('T')[0];
          soNgayTre = 0;
          diemThoiGian = template.score;
          diemChatLuong = Math.round(template.score * 0.95 * 10) / 10;
          tongDiem = Math.round((diemThoiGian + diemChatLuong) * 10) / 10;
          nhanXet = "Nộp báo cáo sớm trước hạn định. Số liệu được thẩm định và phê chuẩn.";
        } else {
          ngayNop = null;
          soNgayTre = null;
          diemThoiGian = null;
          diemChatLuong = null;
          tongDiem = null;
          nhanXet = "Đang chờ thu thập báo cáo (Chưa đến hạn nộp).";
        }
      }

      submissions.push({
        ID: currentId++,
        Ma_DV: unit.Ma_DV,
        Ten_Don_Vi: unit.Ten_Don_Vi,
        Vung: unit.Vung,
        Ma_Phong: template.dept,
        Ten_Phong: template.deptName,
        Ten_Bao_Cao: template.name,
        Loai_BC: template.type,
        Han_Nop: template.deadline,
        Ngay_Nop: ngayNop,
        Diem_Thoi_Gian: diemThoiGian,
        Diem_Chat_Luong: diemChatLuong,
        Tong_Diem: tongDiem,
        Diem_Dinh_Muc: template.score,
        So_Ngay_Tre: soNgayTre,
        Nhan_Xet: nhanXet
      });
    });
  });

  return submissions;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Unit, ReportSubmission, Department } from '../types';

export const UNITS_DATA: Unit[] = [
  { Ma_DV: 'TKPH', Ten_Don_Vi: 'Thống kê Cơ Sở TP. Hưng Yên', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKNQ', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Văn Lâm', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKYM', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Yên Mỹ', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKMH', Ten_Don_Vi: 'Thống kê Cơ Sở thị xã Mỹ Hào', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKKC', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Khoái Châu', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKLB', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Kim Động', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKHHT', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Phù Cừ', Vung: 'Hưng Yên' },
  { Ma_DV: 'TKQP', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Quỳnh Phụ', Vung: 'Thái Bình' },
  { Ma_DV: 'TKHH', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Hưng Hà', Vung: 'Thái Bình' },
  { Ma_DV: 'TKDH', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Đông Hưng', Vung: 'Thái Bình' },
  { Ma_DV: 'TKTT', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Thái Thụy', Vung: 'Thái Bình' },
  { Ma_DV: 'TKTH', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Tiền Hải', Vung: 'Thái Bình' },
  { Ma_DV: 'TKKX', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Kiến Xương', Vung: 'Thái Bình' },
  { Ma_DV: 'TKVT', Ten_Don_Vi: 'Thống kê Cơ Sở huyện Vũ Thư', Vung: 'Thái Bình' }
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
  // Nhóm 120 điểm
  { name: "Biểu 03.H-TKQG (Thống kê nông, lâm nghiệp và thủy sản)", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Năm", deadline: "2026-06-15", score: 30 },
  { name: "Biểu 04.H-TKQG (Thống kê lâm nghiệp)", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Năm", deadline: "2026-06-15", score: 30 },
  { name: "Biểu 03.H-TKQG (Thống kê nông nghiệp vụ đông xuân trước)", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Năm", deadline: "2025-11-15", score: 30 },
  { name: "Biểu 04.H-TKQG (Thống kê lâm nghiệp kì trước)", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Năm", deadline: "2025-11-15", score: 30 },

  // Nhóm theo yêu cầu của TKT (100)
  { name: "Theo yêu cầu của TKT - Triển khai khảo sát kinh tế trọng điểm", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-08-31", score: 100 },

  // Nhóm 300 điểm
  { name: "Theo yêu cầu của TKT - Thu thập dữ liệu đột xuất", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-04-05", score: 100 },
  { name: "Theo yêu cầu của TKT - Biên soạn Niên giám thống kê địa phương", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-06-15", score: 200 },

  // Nhóm 210 điểm
  { name: "Theo yêu cầu của TKT - Tổng hợp thông tin kinh tế xã hội cấp xã", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-09-20", score: 50 },
  { name: "Theo yêu cầu của TKT - Cung cấp báo cáo theo chuyên đề kinh tế", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-09-15", score: 40 },
  { name: "Theo yêu cầu của TKT - Báo cáo tình hình KT-XH 6 tháng đầu năm", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "6 tháng", deadline: "2026-03-20", score: 50 },
  { name: "Theo yêu cầu của TKT - Tổng hợp điều tra mức sống dân cư", dept: "P_TH", deptName: "Phòng Thống kê Tổng hợp", type: "Năm", deadline: "2026-09-20", score: 50 },

  // Báo cáo tháng định kỳ (Sẽ nhân bản 12 lần cho 12 tháng)
  { name: "Báo cáo Tình hình sản xuất Nông lâm nghiệp và Thủy sản", dept: "P_NN", deptName: "Phòng Thống kê Nông nghiệp", type: "Tháng", deadline: "2026-MM-15", score: 30 },
  { name: "Chỉ số sản xuất công nghiệp IIP", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Tháng", deadline: "2026-MM-18", score: 30 },
  { name: "Kết quả kinh doanh bán lẻ hàng hóa và doanh thu dịch vụ", dept: "P_DV", deptName: "Phòng Thống kê Thương mại - Dịch vụ", type: "Tháng", deadline: "2026-MM-12", score: 30 },

  // Báo cáo quý định kỳ (Sẽ nhân bản 4 lần cho 4 quý)
  { name: "Báo cáo công tác Cải cách hành chính", dept: "P_TCHC", deptName: "Phòng Tổ chức - Hành chính", type: "Quý", deadline: "2026-QQ-20", score: 40 },

  // Kê khai tài sản
  { name: "Thông tư 11/2012/TT-BNV; NĐ số 130/2020/NĐ-CP (Kê khai tài sản, thu nhập)", dept: "P_TCHC", deptName: "Phòng Tổ chức - Hành chính", type: "Năm", deadline: "2026-12-15", score: 40 },

  // Điều tra mẫu
  { name: "Theo PA điều tra (Phương án điều tra mẫu Thương mại - Dịch vụ)", dept: "P_DV", deptName: "Phòng Thống kê Thương mại - Dịch vụ", type: "Năm", deadline: "2026-10-15", score: 30 },

  // Nhóm 390 điểm (PA Tổng điều tra)
  { name: "Theo PA Tổng điều tra - Công tác chuẩn bị phương án", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Năm", deadline: "2026-07-15", score: 30 },
  { name: "Theo PA Tổng điều tra - Thu thập thông tin doanh nghiệp cơ sở", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Năm", deadline: "2026-08-15", score: 30 },
  { name: "Theo PA Tổng điều tra - Kiểm soát biên tập làm sạch biểu mẫu", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Năm", deadline: "2026-09-15", score: 30 },
  { name: "Theo PA Tổng điều tra - Nghiệm thu Tổng điều tra giai đoạn 1", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Năm", deadline: "2026-05-31", score: 100 },
  { name: "Theo PA Tổng điều tra - Khảo sát bổ sung sau Tổng điều tra", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Năm", deadline: "2026-08-31", score: 100 },
  { name: "Theo PA Tổng điều tra - Tổng hợp kết quả chính thức", dept: "P_CN", deptName: "Phòng Thống kê Công nghiệp - Xây dựng", type: "Năm", deadline: "2026-08-31", score: 100 }
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
      // We will generate the target occurrences based on template periodicity
      const occurrences: { name: string; deadline: string; typeLabel: string }[] = [];

      if (template.type === "Tháng") {
        // Generate 12 months (from Month 1 to Month 12 of 2026)
        const dayMatch = template.deadline.match(/MM-(\d+)/);
        const dayStr = dayMatch ? dayMatch[1].padStart(2, '0') : "15";
        
        for (let m = 1; m <= 12; m++) {
          const mStr = m.toString().padStart(2, '0');
          occurrences.push({
            name: `${template.name} - Tháng ${m}/2026`,
            deadline: `2026-${mStr}-${dayStr}`,
            typeLabel: `Tháng ${m}`
          });
        }
      } else if (template.type === "Quý") {
        // Generate 4 quarters
        const dayMatch = template.deadline.match(/QQ-(\d+)/);
        const dayStr = dayMatch ? dayMatch[1].padStart(2, '0') : "20";
        const quarters = [
          { roman: "I", month: "03" },
          { roman: "II", month: "06" },
          { roman: "III", month: "09" },
          { roman: "IV", month: "12" }
        ];
        
        quarters.forEach((q) => {
          occurrences.push({
            name: `${template.name} - Quý ${q.roman}/2026`,
            deadline: `2026-${q.month}-${dayStr}`,
            typeLabel: `Quý ${q.roman}`
          });
        });
      } else {
        // Standard Annual / 6 months / Crop season
        occurrences.push({
          name: template.name,
          deadline: template.deadline,
          typeLabel: template.type
        });
      }

      // Process each occurrence for the current unit
      occurrences.forEach((occ) => {
        const deadlineDate = new Date(occ.deadline);
        const isPast = deadlineDate < new Date('2026-05-25'); // Current system date is May 25, 2026

        let ngayNop: string | null = null;
        let soNgayTre: number | null = null;
        let diemThoiGian: number | null = null;
        let diemChatLuong: number | null = null;
        let tongDiem: number | null = null;
        let nhanXet = "";

        if (isPast) {
          // 92% chance of being submitted if deadline has passed
          const submitted = Math.random() < 0.92;
          if (submitted) {
            // 85% chance of being on time, 15% chance of late
            const isLate = Math.random() < 0.15;
            if (isLate) {
              // Late submit: between 1 and 6 days late
              const delayDays = Math.floor(Math.random() * 6) + 1;
              const subDate = new Date(deadlineDate);
              subDate.setDate(subDate.getDate() + delayDays);
              
              ngayNop = subDate.toISOString().split('T')[0];
              soNgayTre = delayDays;
              
              // Penalty: -2 index points per day late, minimum score is 0
              diemThoiGian = Math.max(0, template.score - (delayDays * 2));
              // Quality score random between 80% to 100% of standard
              const qualityRatio = 0.8 + (Math.random() * 0.2);
              diemChatLuong = Math.round(template.score * qualityRatio * 10) / 10;
              tongDiem = Math.round((diemThoiGian + diemChatLuong) * 10) / 10;
              nhanXet = `Nộp trễ hạn ${delayDays} ngày. Báo cáo chất lượng đạt chuẩn, cần chú ý đảm bảo đúng kỳ sau.`;
            } else {
              // On time submit: 1 to 4 days early or exactly on prompt
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
              nhanXet = "Nộp đúng hạn đạt kết quả xuất sắc. Đối chiếu biểu số liệu nghiệp vụ sạch sẽ.";
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
          // 25% chance they submitted early, 75% still pending
          const submittedEarly = Math.random() < 0.25;
          if (submittedEarly) {
            const subDate = new Date(deadlineDate);
            subDate.setDate(subDate.getDate() - Math.floor(Math.random() * 10) - 1);
            
            ngayNop = subDate.toISOString().split('T')[0];
            soNgayTre = 0;
            diemThoiGian = template.score;
            diemChatLuong = Math.round(template.score * 0.95 * 10) / 10;
            tongDiem = Math.round((diemThoiGian + diemChatLuong) * 10) / 10;
            nhanXet = "Nộp báo cáo sớm trước thời hạn định. Số liệu đã được phê chuẩn.";
          } else {
            ngayNop = null;
            soNgayTre = null;
            diemThoiGian = null;
            diemChatLuong = null;
            tongDiem = null;
            nhanXet = "Đang chờ thu nghiệp báo cáo (Chưa đến hạn nộp chuyên môn).";
          }
        }

        submissions.push({
          ID: currentId++,
          Ma_DV: unit.Ma_DV,
          Ten_Don_Vi: unit.Ten_Don_Vi,
          Vung: unit.Vung,
          Ma_Phong: template.dept,
          Ten_Phong: template.deptName,
          Ten_Bao_Cao: occ.name,
          Loai_BC: occ.typeLabel,
          Han_Nop: occ.deadline,
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
  });

  return submissions;
}

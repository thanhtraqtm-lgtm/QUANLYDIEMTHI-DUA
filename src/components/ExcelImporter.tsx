/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ReportSubmission } from '../types';
import { UploadCloud, CheckCircle2, FileSpreadsheet, AlertTriangle, ArrowRight } from 'lucide-react';

interface ExcelImporterProps {
  onImportComplete: (importedData: ReportSubmission[]) => void;
  existingCount: number;
}

export default function ExcelImporter({ onImportComplete, existingCount }: ExcelImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'idle' | 'success' | 'error'; label: string }>({ type: 'idle', label: '' });
  const [logCounts, setLogCounts] = useState<{ total: number; matched: number } | null>(null);

  const handleFileParse = (file: File) => {
    const reader = new FileReader();
    setStatusMsg({ type: 'idle', label: 'Đang tải và xử lý file...' });

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Không thể đọc kết quả tệp dữ liệu.');

        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse raw JSON rows
        const rawRows = XLSX.utils.sheet_to_json<any>(worksheet, { defval: '' });

        if (rawRows.length === 0) {
          throw new Error('Tệp tải lên rỗng hoặc không có dữ liệu dòng.');
        }

        // Validate and convert schema to matching ReportSubmission objects
        const mappedSubmissions: ReportSubmission[] = [];

        rawRows.forEach((row, rIdx) => {
          // Normalised column names to match regardless of casing or Vietnamese signs
          const getVal = (possibleKeys: string[]): any => {
            const rowKeys = Object.keys(row);
            for (const key of possibleKeys) {
              const matchedKey = rowKeys.find(rk => 
                rk.toLowerCase().trim().replace(/_/g, '') === key.toLowerCase().trim().replace(/_/g, '')
              );
              if (matchedKey) return row[matchedKey];
            }
            return '';
          };

          // Columns in User CSV: ID,Ma_DV,Ten_Don_Vi,Ma_Phong,Ten_Phong,Ten_Bao_Cao,Loai_BC,Han_Nop,Ngay_Nop,Diem_Thoi_Gian,Diem_Chat_Luong,Tong_Diem,Diem_Dinh_Muc,So_Ngay_Tre
          const id = parseInt(getVal(['ID', 'Stt', 'MaBC']), 10) || (rIdx + 1);
          const maDv = String(getVal(['Ma_DV', 'MaDV', 'MaDonVi', 'Mã_DV'])).trim();
          const tenDonVi = String(getVal(['Ten_Don_Vi', 'TenDonVi', 'Tên_Đơn_Vị', 'Ten_Don_Vi_Xep_Hang'])).trim();
          const maPhong = String(getVal(['Ma_Phong', 'MaPhong', 'Mã_Phòng'])).trim() || 'P_TH';
          const tenPhong = String(getVal(['Ten_Phong', 'TenPhong', 'Tên_Phòng'])).trim() || 'Phòng Thống kê Tổng hợp';
          const tenBaoCao = String(getVal(['Ten_Bao_Cao', 'TenBaoCao', 'Tên_Báo_Cáo', 'Tên_Bao_Cao_Giao_Diem'])).trim();
          const loaiBc = String(getVal(['Loai_BC', 'LoaiBC', 'Loài_BC', 'Ky_Khai_Bao'])).trim() || 'Tháng';
          
          let hanNopRaw = getVal(['Han_Nop', 'HanNop', 'Hạn_Nộp']);
          let ngayNopRaw = getVal(['Ngay_Nop', 'NgayNop', 'Ngày_Nộp']);

          // Parse and Standardize Date format to YYYY-MM-DD
          const standardizeDateStr = (dateVal: any): string | null => {
            if (!dateVal) return null;
            if (dateVal instanceof Date) {
              return dateVal.toISOString().split('T')[0];
            }
            // If string in DD/MM/YYYY format
            const dateStrStr = String(dateVal).trim();
            if (dateStrStr.includes('/')) {
              const parts = dateStrStr.split('/');
              if (parts.length === 3) {
                const day = parts[0].padStart(2, '0');
                const month = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
              }
            }
            return dateStrStr;
          };

          const hanNop = standardizeDateStr(hanNopRaw) || '2026-06-15';
          const ngayNop = standardizeDateStr(ngayNopRaw);

          const diemDinhMuc = parseFloat(String(getVal(['Diem_Dinh_Muc', 'DiemDinhMuc', 'Điểm_Định_Mức', 'Diem_Chuan'])).replace(',', '.')) || 30.0;
          const diemThoiGian = getVal(['Diem_Thoi_Gian', 'DiemThoiGian']) !== '' 
            ? parseFloat(String(getVal(['Diem_Thoi_Gian', 'DiemThoiGian'])).replace(',', '.')) 
            : null;
          const diemChatLuong = getVal(['Diem_Chat_Luong', 'DiemChatLuong']) !== '' 
            ? parseFloat(String(getVal(['Diem_Chat_Luong', 'DiemChatLuong'])).replace(',', '.')) 
            : null;
          const tongDiem = getVal(['Tong_Diem', 'TongDiem']) !== '' 
            ? parseFloat(String(getVal(['Tong_Diem', 'TongDiem'])).replace(',', '.')) 
            : null;

          const soNgayTre = getVal(['So_Ngay_Tre', 'SoNgayTre']) !== '' 
            ? parseInt(String(getVal(['So_Ngay_Tre', 'SoNgayTre'])), 10) 
            : null;
          
          const nhanXet = String(getVal(['Nhan_Xet', 'NhanXet', 'Ghi_Chu_Kiem_Chuan', 'Nghi_An_Tre', 'Nhận_Xét', 'Audit_Mark_Note'])).trim() || 'Thành công nạp từ bảng Excel bản cứng.';

          // Assign region based on Ma_DV
          let vung = 'Thái Bình'; 
          const hHungYen = ['TKPH', 'TKNQ', 'TKYM', 'TKMH', 'TKKC', 'TKLB', 'TKHHT'];
          if (hHungYen.includes(maDv)) {
            vung = 'Hưng Yên';
          }

          if (maDv && tenBaoCao) {
            mappedSubmissions.push({
              ID: id,
              Ma_DV: maDv,
              Ten_Don_Vi: tenDonVi || `Cơ sở ${maDv}`,
              Vung: vung,
              Ma_Phong: maPhong,
              Ten_Phong: tenPhong,
              Ten_Bao_Cao: tenBaoCao,
              Loai_BC: loaiBc,
              Han_Nop: hanNop,
              Ngay_Nop: ngayNop,
              Diem_Thoi_Gian: diemThoiGian,
              Diem_Chat_Luong: diemChatLuong,
              Tong_Diem: tongDiem !== null ? tongDiem : (diemThoiGian !== null && diemChatLuong !== null ? (diemThoiGian + diemChatLuong) : null),
              Diem_Dinh_Muc: diemDinhMuc,
              So_Ngay_Tre: soNgayTre,
              Nhan_Xet: nhanXet
            });
          }
        });

        if (mappedSubmissions.length === 0) {
          throw new Error('Dữ liệu cột không khớp định dạng template nộp (Thiếu "Mã ĐV" hoặc "Tên báo cáo").');
        }

        onImportComplete(mappedSubmissions);
        setLogCounts({ total: rawRows.length, matched: mappedSubmissions.length });
        setStatusMsg({ type: 'success', label: `Nạp thành công ${mappedSubmissions.length} dòng dữ liệu thi đua thiết bị sạch sẽ!` });
      } catch (err: any) {
        setStatusMsg({ type: 'error', label: err.message || 'Lỗi định dạng tệp Excel/CSV không được hỗ trợ.' });
      }
    };

    reader.onerror = () => {
      setStatusMsg({ type: 'error', label: 'Lỗi tải đọc tệp dữ liệu vật lý.' });
    };

    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileParse(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileParse(file);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6" id="excel-importer-box">
      
      {/* Header and short instructions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 font-sans uppercase tracking-tight">
            📥 Cổng Nạp Dữ Liệu Excel / Giao Chỉ Tiêu Bản Cứng
          </h4>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Nạp trực tiếp bảng chấm điểm hoặc danh sách báo cáo Excel CSV mà người dùng được cấp để cập nhật tệp giao điểm thời hạn.
          </p>
        </div>
        <div className="text-start md:text-right">
          <span className="text-[10px] text-slate-400 font-mono block block uppercase font-medium">Bản ghi hiện hành</span>
          <span className="text-xs font-bold text-slate-700 block mt-0.5">{existingCount} chỉ số giao điểm</span>
        </div>
      </div>

      {/* Main Drag Drop Target Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-sky-500 bg-sky-50/50' 
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/30'
        }`}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />

        <div className="p-4 bg-slate-50 rounded-full text-slate-400 border border-slate-100">
          <UploadCloud className="w-8 h-8 text-sky-500 animate-pulse" />
        </div>

        <h5 className="font-bold text-slate-700 text-xs mt-4 font-sans">
          Click để tải lên tệp hoặc kéo thả file Excel vào đây
        </h5>
        <p className="text-[10px] text-slate-400 mt-1 max-w-md font-sans leading-normal">
          Hỗ trợ tệp định dạng .xlsx, .xls hoặc .csv bảng nộp gốc có tiêu đề chứa: <span className="font-semibold text-slate-600">Ma_DV, Ten_Bao_Cao, Han_Nop, Ngay_Nop, Diem_Dinh_Muc</span>.
        </p>
      </div>

      {/* Status Notifications Panel */}
      {statusMsg.type !== 'idle' && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-sans">
            <p className="font-bold leading-normal">{statusMsg.label}</p>
            {logCounts && statusMsg.type === 'success' && (
              <p className="mt-1 text-slate-500 block">
                Tổng cộng quét <span className="font-bold text-slate-700">{logCounts.total}</span> dòng raw Excel, thiết lập thành công <span className="font-bold text-emerald-600">{logCounts.matched}</span> báo cáo giao điểm chuẩn hóa.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Excel Schema matching checklist block */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
        <span className="text-[9px] text-slate-400 font-mono tracking-wider block uppercase font-extrabold">
          Sơ đồ so khớp trường trường dữ liệu (System Schema guidelines):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
          
          <div className="flex items-start space-x-2">
            <span className="p-1 bg-white border rounded text-[10px] font-bold text-sky-600 font-mono uppercase">Ma_DV</span>
            <div className="pt-0.5">
              <p className="font-semibold text-slate-700 leading-tight">Mã đơn vị</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">TKPH, TKNQ, etc.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <span className="p-1 bg-white border rounded text-[10px] font-bold text-sky-600 font-mono uppercase">Han_Nop</span>
            <div className="pt-0.5">
              <p className="font-semibold text-slate-700 leading-tight">Thời hạn định</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Hạn tuyệt đối nộp</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <span className="p-1 bg-white border rounded text-[10px] font-bold text-sky-600 font-mono uppercase">Ngay_Nop</span>
            <div className="pt-0.5">
              <p className="font-semibold text-slate-700 leading-tight">Ngày nộp thực</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">(Tùy chọn: nạp trước)</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <span className="p-1 bg-white border rounded text-[10px] font-bold text-sky-600 font-mono uppercase">Dinh_Muc</span>
            <div className="pt-0.5">
              <p className="font-semibold text-slate-700 leading-tight">Điểm định mức</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Điểm tối đa của báo cáo</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

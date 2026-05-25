/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  MapPin, 
  ArrowUpDown,
  BookOpen, 
  Sparkles,
  Award,
  ChevronRight,
  Download
} from 'lucide-react';
import { ReportSubmission } from '../types';

interface ReportBrowserProps {
  submissions: ReportSubmission[];
}

export default function ReportBrowser({ submissions }: ReportBrowserProps) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ID' | 'Han_Nop' | 'Tong_Diem' | 'So_Ngay_Tre'>('Han_Nop');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Detailed selected report drawer/modal
  const [inspectedReport, setInspectedReport] = useState<ReportSubmission | null>(null);

  // Dynamic lists of categories
  const departments = Array.from(new Set(submissions.map(s => JSON.stringify({ code: s.Ma_Phong, name: s.Ten_Phong })))).map(s => JSON.parse(s));
  const regions = Array.from(new Set(submissions.map(s => s.Vung)));
  const reportTypes = Array.from(new Set(submissions.map(s => s.Loai_BC)));

  // Filter implementation
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.Ten_Bao_Cao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.Ten_Don_Vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.Ma_DV.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'ALL' || s.Vung === selectedRegion;
    
    const matchesDept = selectedDept === 'ALL' || s.Ma_Phong === selectedDept;

    const matchesType = selectedType === 'ALL' || s.Loai_BC === selectedType;

    let matchesStatus = true;
    if (selectedStatus !== 'ALL') {
      const isSubmitted = s.Ngay_Nop !== null;
      const isLate = isSubmitted && (s.So_Ngay_Tre ?? 0) > 0;
      const isOverdue = !isSubmitted && new Date(s.Han_Nop) < new Date('2026-05-25');
      
      if (selectedStatus === 'SUBMITTED') matchesStatus = isSubmitted;
      else if (selectedStatus === 'ON_TIME') matchesStatus = isSubmitted && !isLate;
      else if (selectedStatus === 'LATE') matchesStatus = isLate;
      else if (selectedStatus === 'OVERDUE') matchesStatus = isOverdue;
      else if (selectedStatus === 'PENDING') matchesStatus = !isSubmitted && !isOverdue;
    }

    return matchesSearch && matchesRegion && matchesDept && matchesType && matchesStatus;
  });

  // Sorting logic
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'ID') {
      comparison = a.ID - b.ID;
    } else if (sortBy === 'Han_Nop') {
      comparison = new Date(a.Han_Nop).getTime() - new Date(b.Han_Nop).getTime();
    } else if (sortBy === 'Tong_Diem') {
      const scoreA = a.Tong_Diem ?? 0;
      const scoreB = b.Tong_Diem ?? 0;
      comparison = scoreA - scoreB;
    } else if (sortBy === 'So_Ngay_Tre') {
      const trA = a.So_Ngay_Tre ?? 0;
      const trB = b.So_Ngay_Tre ?? 0;
      comparison = trA - trB;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate live statistics for the filtered view
  const totalFiltered = filteredSubmissions.length;
  const submittedFiltered = filteredSubmissions.filter(s => s.Ngay_Nop !== null).length;
  const onTimeFiltered = filteredSubmissions.filter(s => s.Ngay_Nop !== null && (s.So_Ngay_Tre ?? 0) <= 0).length;
  const lateFiltered = filteredSubmissions.filter(s => s.Ngay_Nop !== null && (s.So_Ngay_Tre ?? 0) > 0).length;
  const overdueFiltered = filteredSubmissions.filter(s => s.Ngay_Nop === null && new Date(s.Han_Nop) < new Date('2026-05-25')).length;

  const handleExportCSVLocal = () => {
    const csvRows = [
      ['ID', 'Ma_DV', 'Ten_Don_Vi', 'Ten_Phong', 'Ten_Bao_Cao', 'Han_Nop', 'Ngay_Nop', 'Tre_Han_Ngay', 'Tong_Diem', 'Ghi_Chu'],
      ...sortedSubmissions.map(s => [
        s.ID, s.Ma_DV, s.Ten_Don_Vi, s.Ten_Phong, s.Ten_Bao_Cao, s.Han_Nop, s.Ngay_Nop || 'Chưa nộp', s.So_Ngay_Tre || 0, s.Tong_Diem || 0, s.Nhan_Xet
      ])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Trinh_Duyet_Bao_Cao_Loc_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="report-browser-view-root">
      
      {/* Dynamic Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Báo cáo đang xem</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-slate-800">{totalFiltered}</span>
            <span className="text-[10px] text-slate-400 font-medium">/ {submissions.length} tệp</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-400" style={{ width: `${(totalFiltered / submissions.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60 shadow-sm space-y-1">
          <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block font-mono">Đã thu nộp</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-emerald-700">{submittedFiltered}</span>
            <span className="text-[10px] text-emerald-500 font-medium">{totalFiltered > 0 ? `${Math.round((submittedFiltered / totalFiltered) * 100)}%` : '0%'}</span>
          </div>
          <div className="h-1 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${totalFiltered > 0 ? (submittedFiltered / totalFiltered) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-100/60 shadow-sm space-y-1">
          <span className="text-[9px] text-sky-600 font-bold uppercase tracking-wider block font-mono">Đúng hạn chuẩn</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-sky-700">{onTimeFiltered}</span>
            <span className="text-[10px] text-sky-500 font-medium">{submittedFiltered > 0 ? `${Math.round((onTimeFiltered / submittedFiltered) * 100)}% nộp` : '0%'}</span>
          </div>
          <div className="h-1 bg-sky-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${submittedFiltered > 0 ? (onTimeFiltered / submittedFiltered) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100/60 shadow-sm space-y-1">
          <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider block font-mono">Nộp chậm ngày</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-amber-700">{lateFiltered}</span>
            <span className="text-[10px] text-amber-500 font-medium">{submittedFiltered > 0 ? `${Math.round((lateFiltered / submittedFiltered) * 100)}% nộp` : '0%'}</span>
          </div>
          <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${submittedFiltered > 0 ? (lateFiltered / submittedFiltered) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100/60 col-span-2 md:col-span-1 shadow-sm space-y-1">
          <span className="text-[9px] text-rose-600 font-bold uppercase tracking-wider block font-mono">Quá hạn chưa nộp</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-rose-700">{overdueFiltered}</span>
            <span className="text-[10px] text-rose-500 font-medium">chưa báo cáo</span>
          </div>
          <div className="h-1 bg-rose-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: `${totalFiltered > 0 ? (overdueFiltered / totalFiltered) * 100 : 0}%` }} />
          </div>
        </div>

      </div>

      {/* Grid search and control panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        
        {/* Row 1: Keyword search and Export */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative max-w-md w-full">
            <input 
              type="text"
              placeholder="Tìm theo tên báo cáo, tên chi cục, mã đơn vị..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 font-sans"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleExportCSVLocal}
              className="px-3.5 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file CSV lọc</span>
            </button>
          </div>
        </div>

        {/* Row 2: Filter selectors list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs font-sans">
          
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono tracking-wider">Phân khu địa lý / Tỉnh:</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 outline-none text-slate-800 font-sans"
            >
              <option value="ALL">ーー Tất cả tỉnh địa bàn ーー</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono tracking-wider">Trạng thái thu nộp:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 outline-none text-slate-800 font-sans"
            >
              <option value="ALL">ーー Tất cả tình trạng ーー</option>
              <option value="SUBMITTED">Đã nộp (Tất cả)</option>
              <option value="ON_TIME">Đã nộp: Đúng hạn</option>
              <option value="LATE">Đã nộp: Trễ hạn</option>
              <option value="OVERDUE">Chưa nộp: Quá hạn đỏ</option>
              <option value="PENDING">Chưa nộp: Vẫn trong hạn</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono tracking-wider">Phòng ban chuyên môn giao:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 outline-none text-slate-800 font-sans"
            >
              <option value="ALL">ーー Tất cả phòng ban chuyên môn ーー</option>
              {departments.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono tracking-wider">Chu kỳ báo cáo:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 outline-none text-slate-800 font-sans"
            >
              <option value="ALL">ーー Tất cả chu kỳ ーー</option>
              {reportTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Row 3: Sorting configurations */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 gap-2 font-sans">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Sắp xếp theo:</span>
            
            <button 
              type="button" 
              onClick={() => {
                if (sortBy === 'Han_Nop') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('Han_Nop'); setSortOrder('asc'); }
              }}
              className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
                sortBy === 'Han_Nop' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>Thời hạn nộp</span>
              {sortBy === 'Han_Nop' && (
                <span className="text-[9px]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>

            <button 
              type="button" 
              onClick={() => {
                if (sortBy === 'Tong_Diem') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('Tong_Diem'); setSortOrder('desc'); }
              }}
              className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
                sortBy === 'Tong_Diem' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>Tổng điểm tích lũy</span>
              {sortBy === 'Tong_Diem' && (
                <span className="text-[9px]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>

            <button 
              type="button" 
              onClick={() => {
                if (sortBy === 'So_Ngay_Tre') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                else { setSortBy('So_Ngay_Tre'); setSortOrder('desc'); }
              }}
              className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1 cursor-pointer transition-colors ${
                sortBy === 'So_Ngay_Tre' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>Số ngày trễ hạn</span>
              {sortBy === 'So_Ngay_Tre' && (
                <span className="text-[9px]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-mono">
            Kết quả: <span className="font-bold text-slate-700">{sortedSubmissions.length}</span> / {submissions.length} báo cáo
          </p>
        </div>

      </div>

      {/* Main interactive cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {sortedSubmissions.map((sub) => {
          const isSubmitted = sub.Ngay_Nop !== null;
          const isLate = isSubmitted && (sub.So_Ngay_Tre ?? 0) > 0;
          const isOverdue = !isSubmitted && new Date(sub.Han_Nop) < new Date('2026-05-25');

          return (
            <motion.div 
              key={sub.ID}
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => setInspectedReport(sub)}
              className="bg-white rounded-2xl border border-slate-150 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
            >
              
              {/* Header metadata */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {/* Status Indicator */}
                  {isSubmitted ? (
                    isLate ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Trễ {sub.So_Ngay_Tre} ngày</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>Chuẩn đúng hạn</span>
                      </span>
                    )
                  ) : (
                    isOverdue ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Chưa nộp・QUÁ HẠN ĐỎ</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase bg-slate-100 text-slate-600 border border-slate-200 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Chưa nộp・Chờ nộp</span>
                      </span>
                    )
                  )}

                  {/* Room / Dept name */}
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                    {sub.Ma_Phong}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 font-sans tracking-tight line-clamp-2 min-h-[32px] leading-snug">
                    {sub.Ten_Bao_Cao}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-sans font-bold">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[9px]">
                      {sub.Ma_DV}
                    </span>
                    <span className="truncate max-w-[170px]">{sub.Ten_Don_Vi}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 font-medium">{sub.Vung}</span>
                  </div>
                </div>

              </div>

              {/* Deadline & Actual Dates */}
              <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-sans">
                <div>
                  <p className="text-[9px] text-slate-400 block leading-none font-bold font-mono">Hạn nộp</p>
                  <p className="text-slate-700 font-bold mt-1 leading-none">{sub.Han_Nop}</p>
                </div>
                <div className="h-4.5 w-[1px] bg-slate-200" />
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 block leading-none font-bold font-mono">Ngày nộp thực tế</p>
                  <p className={`font-bold mt-1 leading-none ${isSubmitted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {sub.Ngay_Nop || 'Chưa nộp'}
                  </p>
                </div>
              </div>

              {/* Bottom Info: Scores & Reviewer button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-sans">
                
                {/* Score aggregate tag */}
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-extrabold">Điểm đạt về:</p>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-sm font-black text-indigo-600">
                      {sub.Tong_Diem !== null ? sub.Tong_Diem : 'ーー'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      / {sub.Diem_Dinh_Muc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[10px] text-sky-600 hover:text-sky-800 font-bold">
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>

              </div>

            </motion.div>
          );
        })}

        {sortedSubmissions.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h5 className="font-bold font-sans text-xs mt-3 text-slate-600">Không tìm thấy báo cáo thi đua nào</h5>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto mt-1">
              Hãy đặt lại bộ lọc hoặc điều chỉnh từ khóa tìm kiếm để thu về dữ liệu mong muốn.
            </p>
          </div>
        )}

      </div>

      {/* Inspector Details Modal Drawer Dialog */}
      <AnimatePresence>
        {inspectedReport && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200"
            >
              
              {/* Colored header title */}
              <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none select-none">
                  <div className="absolute inset-0 bg-gradient-to-l from-sky-400 to-transparent blur-xl" />
                </div>

                <div className="relative z-10 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-sky-400 font-mono tracking-widest font-extrabold uppercase bg-sky-950 px-2 py-0.5 rounded">
                      Mã chuyên mục: {inspectedReport.Ma_Phong}
                    </span>
                    <button 
                      onClick={() => setInspectedReport(null)}
                      className="text-slate-400 hover:text-white text-xs font-bold font-mono transition-colors p-1"
                    >
                      ĐÓNG ✕
                    </button>
                  </div>
                  <h3 className="text-md font-black tracking-tight font-sans text-white leading-snug">
                    {inspectedReport.Ten_Bao_Cao}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Thuộc phòng: <span className="text-slate-200 font-medium">{inspectedReport.Ten_Phong}</span>
                  </p>
                </div>
              </div>

              {/* Inspected details grid fields */}
              <div className="p-6 space-y-5 font-sans">
                
                {/* Meta list columns */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">Đơn vị thống kê nộp</span>
                    <p className="font-bold text-slate-800 leading-tight">
                      {inspectedReport.Ten_Don_Vi} ({inspectedReport.Ma_DV})
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Đại bàn: {inspectedReport.Vung}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">Chu kỳ thời hạn</span>
                    <p className="font-bold text-slate-800 leading-tight">
                      {inspectedReport.Loai_BC}
                    </p>
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">Hạn nộp: {inspectedReport.Han_Nop}</p>
                  </div>

                </div>

                {/* Score breakdown segment panel */}
                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Phân tích bảng điểm thi đua:</h5>
                  
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    
                    <div className="p-2.5 bg-sky-50/50 rounded-xl border border-sky-100">
                      <span className="text-[9px] text-sky-600 font-bold block uppercase font-mono">Điểm chuẩn (Định mức)</span>
                      <span className="text-lg font-black text-sky-800 block mt-0.5">{inspectedReport.Diem_Dinh_Muc}</span>
                    </div>

                    <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <span className="text-[9px] text-emerald-600 font-bold block uppercase font-mono">Chấm nộp đúng hạn</span>
                      <span className="text-lg font-black text-emerald-800 block mt-0.5">
                        {inspectedReport.Diem_Thoi_Gian !== null ? inspectedReport.Diem_Thoi_Gian : 'ーー'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <span className="text-[9px] text-indigo-600 font-bold block uppercase font-mono">Chất lượng bài tổng</span>
                      <span className="text-lg font-black text-indigo-800 block mt-0.5">
                        {inspectedReport.Diem_Chat_Luong !== null ? inspectedReport.Diem_Chat_Luong : 'ーー'}
                      </span>
                    </div>

                  </div>

                  {/* Combined bar gauge */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Tỷ lệ điểm tích lũy đạt được</span>
                      <span className="text-indigo-600">
                        {inspectedReport.Tong_Diem !== null 
                          ? `${Math.round((inspectedReport.Tong_Diem / inspectedReport.Diem_Dinh_Muc) * 100)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${inspectedReport.Diem_Thoi_Gian ? ((inspectedReport.Diem_Thoi_Gian / inspectedReport.Diem_Dinh_Muc) * 100) : 0}%` }}
                        title="Điểm thời gian"
                      />
                      <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${inspectedReport.Diem_Chat_Luong ? ((inspectedReport.Diem_Chat_Luong / inspectedReport.Diem_Dinh_Muc) * 100) : 0}%` }}
                        title="Điểm chất lượng"
                      />
                    </div>
                    <div className="flex items-center space-x-4 text-[9px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded bg-emerald-500 block" />
                        <span>Xanh: Điểm thời gian ({inspectedReport.Diem_Thoi_Gian || 0}đ)</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded bg-indigo-500 block" />
                        <span>Tím: Điểm chất lượng ({inspectedReport.Diem_Chat_Luong || 0}đ)</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Audit Comments and observations */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">Nhận xét & Kiểm chuẩn chi tiết của Phòng chuyên môn:</span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs text-slate-700 leading-normal italic font-medium">
                    "{inspectedReport.Nhan_Xet || 'Không có nhận xét bổ sung từ giám khảo.'}"
                  </div>
                </div>

                {/* Submission verification footer details */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1 filetext text-xs">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hệ thống chấm tự động - Cục Thống Kê Việt Nam</span>
                  </span>
                  
                  <button 
                    onClick={() => setInspectedReport(null)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Đóng cửa sổ
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

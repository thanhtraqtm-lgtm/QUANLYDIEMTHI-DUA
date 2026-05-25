/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ReportSubmission, Department, Unit, User } from '../types';
import { Edit3, CheckCircle, AlertTriangle, HelpCircle, X, Search, Calendar, ChevronLeft, ChevronRight, FileCheck2, Send, Info } from 'lucide-react';

interface SubmissionManagerProps {
  submissions: ReportSubmission[];
  departments: Department[];
  units: Unit[];
  onUpdateSubmission: (id: number, updatedFields: Partial<ReportSubmission>) => void;
  currentUser: User;
}

export default function SubmissionManager({
  submissions,
  departments,
  units,
  onUpdateSubmission,
  currentUser
}: SubmissionManagerProps) {
  const isTkcs = currentUser?.role === 'tkcs';

  // Master Filter States
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Sync unitFilter for units
  useEffect(() => {
    if (isTkcs && currentUser?.unitCode) {
      setUnitFilter(currentUser.unitCode);
    }
  }, [isTkcs, currentUser]);

  const currentUnitFilter = isTkcs ? (currentUser?.unitCode || 'ALL') : unitFilter;

  // Selected Row for grading
  const [editingSubmission, setEditingSubmission] = useState<ReportSubmission | null>(null);
  const [editNgayNop, setEditNgayNop] = useState('');
  const [editDiemChatLuong, setEditDiemChatLuong] = useState(0);
  const [editNhanXet, setEditNhanXet] = useState('');

  // Filter handlers
  const filteredSubmissions = submissions.filter(sub => {
    const matchUnit = currentUnitFilter === 'ALL' || sub.Ma_DV === currentUnitFilter;
    const matchDept = deptFilter === 'ALL' || sub.Ma_Phong === deptFilter;
    
    // Status Logic
    const isPast = new Date(sub.Han_Nop) < new Date('2026-05-25');
    let matchStatus = true;
    if (statusFilter === 'ON_TIME') {
      matchStatus = sub.Ngay_Nop !== null && (sub.So_Ngay_Tre ?? 0) <= 0;
    } else if (statusFilter === 'LATE') {
      matchStatus = sub.Ngay_Nop !== null && (sub.So_Ngay_Tre ?? 0) > 0;
    } else if (statusFilter === 'OVERDUE') {
      matchStatus = sub.Ngay_Nop === null && isPast;
    } else if (statusFilter === 'PENDING') {
      matchStatus = sub.Ngay_Nop === null && !isPast;
    }

    const matchSearch = sub.Ten_Bao_Cao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.Ten_Don_Vi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchUnit && matchDept && matchStatus && matchSearch;
  });

  // Pagination calculators
  const totalPages = Math.ceil(filteredSubmissions.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSubmissions.slice(indexOfFirstRow, indexOfLastRow);

  const handleEditClick = (sub: ReportSubmission) => {
    setEditingSubmission(sub);
    setEditNgayNop(sub.Ngay_Nop || '');
    setEditDiemChatLuong(sub.Diem_Chat_Luong || 0);
    setEditNhanXet(sub.Nhan_Xet || '');
  };

  const handleApplyPreset = (percent: number, maxScore: number) => {
    const calcScore = Math.round((percent / 100) * maxScore * 10) / 10;
    setEditDiemChatLuong(calcScore);
  };

  const handleSaveEdit = () => {
    if (!editingSubmission) return;

    const updated: Partial<ReportSubmission> = {};
    if (editNgayNop) {
      updated.Ngay_Nop = editNgayNop;
      // Calculate delay days
      const deadline = new Date(editingSubmission.Han_Nop);
      const submissionDate = new Date(editNgayNop);
      
      const timeDiff = submissionDate.getTime() - deadline.getTime();
      const delayDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      updated.So_Ngay_Tre = Math.max(0, delayDays);
      
      // Calculate Diem_Thoi_Gian (-2 pts per day delay, capped min 0)
      if (delayDays > 0) {
        updated.Diem_Thoi_Gian = Math.max(0, editingSubmission.Diem_Dinh_Muc - (delayDays * 2));
      } else {
        updated.Diem_Thoi_Gian = editingSubmission.Diem_Dinh_Muc;
      }
    } else {
      updated.Ngay_Nop = null;
      updated.So_Ngay_Tre = null;
      updated.Diem_Thoi_Gian = 0;
    }

    updated.Diem_Chat_Luong = editDiemChatLuong;
    updated.Tong_Diem = Math.round(((updated.Diem_Thoi_Gian || 0) + editDiemChatLuong) * 10) / 10;
    updated.Nhan_Xet = editNhanXet;

    onUpdateSubmission(editingSubmission.ID, updated);
    setEditingSubmission(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="submissions-manager-frame">
      
      {/* LEFT 3 COLS: Submission Master logs List Table */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Filters control deck summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Filter 1: Unit selection */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold font-sans uppercase">Đơn vị Thống kê</label>
              {isTkcs ? (
                <div className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold font-sans">
                  {currentUser?.displayName}
                </div>
              ) : (
                <select 
                  value={unitFilter}
                  onChange={(e) => { setUnitFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 text-slate-700 outline-none"
                >
                  <option value="ALL">Tất cả đơn vị (14)</option>
                  {units.map(u => <option key={u.Ma_DV} value={u.Ma_DV}>{u.Ten_Don_Vi}</option>)}
                </select>
              )}
            </div>

            {/* Filter 2: Department selection */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold font-sans uppercase">Phòng chuyên môn</label>
              <select 
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 text-slate-700 outline-none"
              >
                <option value="ALL">Tất cả Phòng ban</option>
                {departments.map(d => <option key={d.Ma_Phong} value={d.Ma_Phong}>{d.Ten_Phong}</option>)}
              </select>
            </div>

            {/* Filter 3: Submission Deadline status */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold font-sans uppercase">Trạng thái Giao điểm</label>
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 text-slate-700 outline-none"
              >
                <option value="ALL">Tất cả tiến độ</option>
                <option value="ON_TIME">Nộp đúng / trước hạn</option>
                <option value="LATE">Chậm hạn (Nop trễ)</option>
                <option value="OVERDUE">⚠️ Quá hạn chưa nộp</option>
                <option value="PENDING">Chờ nộp (Chưa đến hạn)</option>
              </select>
            </div>

          </div>

          <div className="relative">
            <input 
              type="text"
              placeholder="Gõ từ khóa tên báo cáo hoặc tên cơ sở để lọc nhanh..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-sans"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

        </div>

        {/* Master Log Table list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Báo cáo chỉ tiêu</th>
                  <th className="py-4 px-4 min-w-[150px]">Đơn vị nộp</th>
                  <th className="py-4 px-3 text-center">Phòng</th>
                  <th className="py-4 px-3 text-center">Hạn Nộp</th>
                  <th className="py-4 px-3 text-center">Ngày thực tế</th>
                  <th className="py-4 px-3 text-center">Định Mức</th>
                  <th className="py-4 px-3 text-center">Tổng Điểm</th>
                  <th className="py-4 px-5 text-center w-20">Lựa chọn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-slate-400 font-sans italic">
                      Không tìm thấy chỉ số kiểm chuẩn giao điểm phù hợp điều kiện lọc.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((row) => {
                    const isOverdue = row.Ngay_Nop === null && new Date(row.Han_Nop) < new Date('2026-05-25');
                    
                    return (
                      <tr key={row.ID} className="hover:bg-slate-50/50 transition-colors duration-100">
                        
                        {/* Report description */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-slate-700 leading-normal">{row.Ten_Bao_Cao}</span>
                            <span className="text-[10px] text-slate-400 font-sans mt-0.5">Loại kỳ hạn: {row.Loai_BC}</span>
                          </div>
                        </td>

                        {/* Unit name */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700 text-xs">{row.Ten_Don_Vi}</span>
                            <span className="text-[10px] text-slate-400 font-sans mt-0.5">{row.Vung} (Mã: {row.Ma_DV})</span>
                          </div>
                        </td>

                        {/* Department code */}
                        <td className="py-4 px-3 text-center text-slate-500 font-medium">
                          {row.Ma_Phong}
                        </td>

                        {/* Deadline Date */}
                        <td className="py-4 px-3 text-center font-mono text-slate-600">
                          {new Date(row.Han_Nop).toLocaleDateString('vi-VN')}
                        </td>

                        {/* Submission status and actual date */}
                        <td className="py-4 px-3 text-center">
                          {row.Ngay_Nop ? (
                            <div className="flex flex-col items-center">
                              <span className="font-mono font-semibold text-slate-800">
                                {new Date(row.Ngay_Nop).toLocaleDateString('vi-VN')}
                              </span>
                              {row.So_Ngay_Tre && row.So_Ngay_Tre > 0 ? (
                                <span className="text-[9px] text-amber-600 font-sans font-semibold bg-amber-50 px-1 py-0.5 rounded mt-0.5">
                                  Trễ {row.So_Ngay_Tre} ngày
                                </span>
                              ) : (
                                <span className="text-[9px] text-emerald-600 font-sans font-semibold bg-emerald-50 px-1 py-0.5 rounded mt-0.5">
                                  Đúng hạn
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className={`px-2 py-1 rounded-[6px] text-[10px] font-sans font-bold flex items-center justify-center space-x-1 mx-auto w-fit ${
                              isOverdue ? 'bg-rose-50 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {isOverdue && <AlertTriangle className="w-3 h-3 mr-0.5" />}
                              <span>{isOverdue ? 'Khẩn: Quá hạn' : 'Chờ nộp'}</span>
                            </span>
                          )}
                        </td>

                        {/* Benchmark Max Points */}
                        <td className="py-4 px-3 text-center font-mono text-slate-500">
                          {row.Diem_Dinh_Muc}
                        </td>

                        {/* Evaluated Total Points */}
                        <td className="py-4 px-3 text-center">
                          {row.Tong_Diem !== null ? (
                            <span className="font-mono font-extrabold text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-xs">
                              {row.Tong_Diem}đ
                            </span>
                          ) : (
                            <span className="text-slate-400 font-sans">-</span>
                          )}
                        </td>

                        {/* Actions score edit button */}
                        <td className="py-4 px-5 text-center font-sans">
                          {isTkcs ? (
                            row.Ngay_Nop ? (
                              <button 
                                onClick={() => handleEditClick(row)}
                                className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                <Info className="w-3.5 h-3.5 text-slate-500" />
                                <span>Chi tiết</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleEditClick(row)}
                                className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs border border-emerald-150"
                              >
                                <Send className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                <span>Nộp ngay</span>
                              </button>
                            )
                          ) : (
                            <button 
                              onClick={() => handleEditClick(row)}
                              className="inline-flex items-center space-x-1 bg-sky-50 text-sky-700 hover:bg-sky-100 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                              <span>Chấm điểm</span>
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination layout */}
          {totalPages > 1 && (
            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-sans">
                Đang xem dòng <span className="font-semibold text-slate-700">{indexOfFirstRow + 1}</span> - <span className="font-semibold text-slate-700">{Math.min(indexOfLastRow, filteredSubmissions.length)}</span> trong tổng {filteredSubmissions.length} dòng
              </span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 select-none hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs font-bold text-slate-600 px-2">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 select-none hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RIGHT 1 COL: Scoring Sidebar Panel */}
      <div className="lg:col-span-1">
        {editingSubmission ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-5 sticky top-6 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-1002">
              <h4 className="text-xs font-extrabold text-slate-900 font-sans uppercase tracking-tight flex items-center gap-1.5">
                {isTkcs 
                  ? (editingSubmission.Ngay_Nop ? '📄 Chi tiết điểm chấm' : '📬 Khai báo nộp báo cáo')
                  : '✏️ Form Chấm Điểm'
                }
              </h4>
              <button 
                onClick={() => setEditingSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target submission description meta */}
            <div className="space-y-2 text-xs font-sans">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Chỉ tiêu / Đơn vị</p>
              <h5 className="font-bold text-slate-800 leading-snug">{editingSubmission.Ten_Bao_Cao}</h5>
              <p className="text-slate-500 font-medium">Bên nộp: <span className="text-indigo-700 font-bold">{editingSubmission.Ten_Don_Vi}</span></p>
              <p className="text-slate-500 font-medium">Hạn Định: <span className="text-rose-600 font-semibold font-mono">{new Date(editingSubmission.Han_Nop).toLocaleDateString('vi-VN')}</span></p>
              <p className="text-slate-500 font-medium">Thang định mức: <span className="font-extrabold text-slate-800 font-mono">{editingSubmission.Diem_Dinh_Muc} điểm</span></p>
            </div>

            <div className="space-y-4 pt-3 border-t border-slate-100">
              
              {/* Field 1: Submitting Date picker */}
              {isTkcs && editingSubmission.Ngay_Nop ? (
                <div className="space-y-1 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold font-sans uppercase block">Ngày nộp thực tế</span>
                  <span className="text-xs font-sans font-extrabold text-slate-800">
                    {new Date(editingSubmission.Ngay_Nop).toLocaleDateString('vi-VN')}
                  </span>
                  {editingSubmission.So_Ngay_Tre && editingSubmission.So_Ngay_Tre > 0 ? (
                    <span className="text-[9px] text-rose-600 font-sans font-bold bg-rose-50 px-1.5 py-0.5 rounded ml-2">
                      Muộn {editingSubmission.So_Ngay_Tre} ngày
                    </span>
                  ) : (
                    <span className="text-[9px] text-emerald-600 font-sans font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-2">
                      Đúng hạn
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold font-sans uppercase block">
                    {isTkcs ? 'Chọn Ngày Nộp Báo Cáo' : 'Khai báo Ngày Nộp Thực Tế'}
                  </label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={editNgayNop || '2026-05-25'} // Default to current emulated system time May 25, 2026
                      onChange={(e) => setEditNgayNop(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:ring-2 focus:ring-sky-500/20 font-mono"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans block leading-normal pt-0.5 italic">
                    {isTkcs 
                      ? '* Vui lòng chọn ngày nộp thực tế để thực hiện quy trình nộp.'
                      : '* Trực tiếp tính ngày nộp muộn để phạt điểm thời hạn nộp tự động.'
                    }
                  </p>
                </div>
              )}

              {/* Field 2 & 3 custom controls according to role */}
              {isTkcs ? (
                // TKCS READ ONLY DISPLAYS
                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold font-sans uppercase block">Điểm Thời Gian Nộp</span>
                    <span className="text-xs font-mono font-extrabold text-slate-800">
                      {editingSubmission.Diem_Thoi_Gian !== null ? `${editingSubmission.Diem_Thoi_Gian}đ` : 'Chưa xếp điểm nộp'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold font-sans uppercase block">Điểm Chất Lượng Thẩm Định</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono font-extrabold ${editingSubmission.Diem_Chat_Luong !== null ? 'text-slate-800' : 'text-slate-400 font-normal italic'}`}>
                        {editingSubmission.Diem_Chat_Luong !== null ? `${editingSubmission.Diem_Chat_Luong}đ` : 'Chờ giám khảo thẩm định...'}
                      </span>
                      {editingSubmission.Diem_Chat_Luong !== null && (
                        <span className="text-[10px] text-slate-400">/ Thang {editingSubmission.Diem_Dinh_Muc}đ</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold font-sans uppercase block">Phản Hồi & Nhận Xét của Admin</span>
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-[11px] leading-relaxed italic">
                      {editingSubmission.Nhan_Xet || 'Chưa có ghi chú kiểm chuẩn từ cán bộ chấm thi đua.'}
                    </div>
                  </div>

                  {/* Safety locking warning */}
                  <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-1.5 text-indigo-700 text-[9px] leading-normal">
                    <Info className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                    <span>
                      Điểm thi đua được khóa bảo mật. Bạn chỉ có quyền khai báo nộp báo cáo chỉ tiêu. Ý kiến chấm điểm và thang đánh giá chất lượng thuộc thẩm quyền của Cục Thống kê.
                    </span>
                  </div>
                </div>
              ) : (
                // ADMIN INTERACTIVE SCORING OPTIONS
                <>
                  {/* Field 2: Custom numerical Quality score grading dials */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold font-sans uppercase block">Điểm khảo sát Chất Lượng</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="number"
                        step="0.1"
                        min="0"
                        max={editingSubmission.Diem_Dinh_Muc}
                        value={editDiemChatLuong}
                        onChange={(e) => setEditDiemChatLuong(Math.min(editingSubmission.Diem_Dinh_Muc, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-20 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 text-center"
                      />
                      <span className="text-[11px] text-slate-400 font-sans">/ Max: <span className="font-bold text-slate-600">{editingSubmission.Diem_Dinh_Muc}</span>đ</span>
                    </div>

                    {/* Direct Dial presets shortcuts helper */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-sans block uppercase font-medium">Bố cục Gợi ý Đánh giá:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button 
                          type="button" 
                          onClick={() => handleApplyPreset(100, editingSubmission.Diem_Dinh_Muc)}
                          className="px-1.5 py-1 text-[9px] font-sans font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded transition-colors text-center cursor-pointer"
                        >
                          Loại A (100%)
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleApplyPreset(85, editingSubmission.Diem_Dinh_Muc)}
                          className="px-1.5 py-1 text-[9px] font-sans font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 rounded transition-colors text-center cursor-pointer"
                        >
                          Loại B (85%)
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleApplyPreset(70, editingSubmission.Diem_Dinh_Muc)}
                          className="px-1.5 py-1 text-[9px] font-sans font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded transition-colors text-center cursor-pointer"
                        >
                          Loại C (70%)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Field 3: Reviewer Comments */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold font-sans uppercase block">Nhận xét, Thẩm định kiểm chuẩn</label>
                    <textarea 
                      rows={3}
                      value={editNhanXet}
                      onChange={(e) => setEditNhanXet(e.target.value)}
                      placeholder="Ghi chú nhận xét lỗi số liệu hoặc biểu dương tiến độ..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:ring-2 focus:ring-sky-500/20 font-sans"
                    />
                  </div>
                </>
              )}

            </div>

            {/* Save Buttons and Reset link */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              {isTkcs ? (
                // Only let them save if the report is not yet submitted
                !editingSubmission.Ngay_Nop && (
                  <button 
                    type="button"
                    onClick={() => {
                      const finalDate = editNgayNop || '2026-05-25';
                      
                      const updated: Partial<ReportSubmission> = {};
                      updated.Ngay_Nop = finalDate;
                      
                      const deadline = new Date(editingSubmission.Han_Nop);
                      const submissionDate = new Date(finalDate);
                      const timeDiff = submissionDate.getTime() - deadline.getTime();
                      const delayDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                      updated.So_Ngay_Tre = Math.max(0, delayDays);

                      if (delayDays > 0) {
                        updated.Diem_Thoi_Gian = Math.max(0, editingSubmission.Diem_Dinh_Muc - (delayDays * 2));
                      } else {
                        updated.Diem_Thoi_Gian = editingSubmission.Diem_Dinh_Muc;
                      }

                      // Unit submission resets/holds quality scoring as unassessed or retains older assessment
                      updated.Diem_Chat_Luong = null; 
                      updated.Tong_Diem = updated.Diem_Thoi_Gian; 
                      updated.Nhan_Xet = "Chi cục đã tự khai nộp báo cáo qua cổng số liệu. Đang chờ Cục Thống kê chấm điểm chất lượng và phê duyệt.";

                      onUpdateSubmission(editingSubmission.ID, updated);
                      setEditingSubmission(null);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Nộp báo cáo ngay</span>
                  </button>
                )
              ) : (
                <button 
                  type="button"
                  onClick={handleSaveEdit}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Ghi nhớ & Tính điểm
                </button>
              )}
              <button 
                type="button"
                onClick={() => setEditingSubmission(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer"
              >
                {isTkcs && editingSubmission.Ngay_Nop ? 'Đóng cửa sổ' : 'Hủy bỏ'}
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center space-y-3 flex flex-col justify-center items-center py-16 sticky top-6">
            <div className="p-3 bg-white rounded-full text-slate-400 border border-slate-100 shadow-xs">
              <Calendar className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-700 font-sans block">
                {isTkcs ? 'Trung tâm nộp tờ trình báo cáo' : 'Bảng điều hướng chấm điểm'}
              </h5>
              <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                {isTkcs 
                  ? 'Chọn bất kì chỉ định nộp báo cáo nào của chi cục để theo dõi hạn nộp, thực hiện đăng ký và theo dõi phiếu phản hồi và điểm chất lượng.'
                  : 'Nhấp nút Chấm điểm bên cạnh bất kì chỉ tiêu báo cáo nào của các đơn vị để cập nhật ngày nộp, thẩm định điểm chất lượng và phê duyệt thi đua.'
                }
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

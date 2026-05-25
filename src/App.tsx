/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import Leaderboard from './components/Leaderboard';
import SubmissionManager from './components/SubmissionManager';
import DepartmentReport from './components/DepartmentReport';
import ExcelImporter from './components/ExcelImporter';
import Login from './components/Login';
import ReportBrowser from './components/ReportBrowser';
import AccountManager from './components/AccountManager';
import { generateInitialSubmissions, UNITS_DATA, DEPARTMENTS_DATA } from './data/emulationData';
import { ReportSubmission, LeaderboardRow, Unit, Department, User } from './types';
import * as XLSX from 'xlsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cachedUser = localStorage.getItem('emulation_user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [submissions, setSubmissions] = useState<ReportSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'browser' | 'leaderboard' | 'manager' | 'departments' | 'importer' | 'accounts'>('dashboard');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  // Accounts state management
  const [accounts, setAccounts] = useState<User[]>(() => {
    const cached = localStorage.getItem('emulation_users');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    const defaultAccs: User[] = [
      {
        username: 'admin',
        role: 'admin',
        displayName: 'Trưởng ban Thi đua (Thống kê tỉnh Hưng Yên)',
        password: '123',
        permissions: ['view_reports', 'grade_reports', 'upload_excel', 'manage_accounts']
      }
    ];
    localStorage.setItem('emulation_users', JSON.stringify(defaultAccs));
    return defaultAccs;
  });

  const handleAddAccount = (newAcc: User) => {
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('emulation_users', JSON.stringify(updated));
  };

  const handleUpdateAccount = (username: string, updatedFields: Partial<User>) => {
    const updated = accounts.map(acc => {
      if (acc.username.toLowerCase() === username.toLowerCase()) {
        return { ...acc, ...updatedFields };
      }
      return acc;
    });
    setAccounts(updated);
    localStorage.setItem('emulation_users', JSON.stringify(updated));

    // Live update active user session if they altered their own profile
    if (currentUser && currentUser.username.toLowerCase() === username.toLowerCase()) {
      const merged = { ...currentUser, ...updatedFields };
      setCurrentUser(merged);
      localStorage.setItem('emulation_user', JSON.stringify(merged));
    }
  };

  const handleDeleteAccount = (username: string) => {
    const updated = accounts.filter(acc => acc.username.toLowerCase() !== username.toLowerCase());
    setAccounts(updated);
    localStorage.setItem('emulation_users', JSON.stringify(updated));
  };

  const handleResetAccounts = () => {
    const defaultAccs: User[] = [
      {
        username: 'admin',
        role: 'admin',
        displayName: 'Trưởng ban Thi đua (Thông kê tỉnh Huwng Yên)',
        password: '123',
        permissions: ['view_reports', 'grade_reports', 'upload_excel', 'manage_accounts']
      }
    ];
    setAccounts(defaultAccs);
    localStorage.setItem('emulation_users', JSON.stringify(defaultAccs));
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('emulation_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('emulation_user');
    setActiveTab('dashboard');
  };

  // 1. Initial State Load logic
  useEffect(() => {
    const cached = localStorage.getItem('emulation_submissions');
    if (cached) {
      try {
        setSubmissions(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached submissions', e);
        const fresh = generateInitialSubmissions();
        setSubmissions(fresh);
        localStorage.setItem('emulation_submissions', JSON.stringify(fresh));
      }
    } else {
      const fresh = generateInitialSubmissions();
      setSubmissions(fresh);
      localStorage.setItem('emulation_submissions', JSON.stringify(fresh));
    }
  }, []);

  // Update State & Cache Helper
  const handleUpdateSubmissionsList = (updatedList: ReportSubmission[]) => {
    setSubmissions(updatedList);
    localStorage.setItem('emulation_submissions', JSON.stringify(updatedList));
  };

  // 2. Row Editor Handler
  const handleUpdateSingleSubmission = (id: number, updatedFields: Partial<ReportSubmission>) => {
    const updated = submissions.map(sub => {
      if (sub.ID === id) {
        return {
          ...sub,
          ...updatedFields
        };
      }
      return sub;
    });
    handleUpdateSubmissionsList(updated);
  };

  // 3. Reset All Data action
  const handleResetToDefault = () => {
    const fresh = generateInitialSubmissions();
    handleUpdateSubmissionsList(fresh);
    alert('Đã khôi phục thành công danh sách điểm thi đua và tiến độ mặc định của 14 đơn vị thống kê cấp huyện!');
  };

  // 4. Excel Importer complete handler
  const handleImportExcelComplete = (imported: ReportSubmission[]) => {
    handleUpdateSubmissionsList(imported);
    setActiveTab('manager'); // Direct user to managers sheet to inspect imported items
  };

  // 5. Dynamic Leaderboard Row calculation (Calculated reactively whenever submissions change)
  const calculateLeaderboard = (): LeaderboardRow[] => {
    const unitsMap: { [maDv: string]: ReportSubmission[] } = {};
    
    // Group submissions by unit Code
    UNITS_DATA.forEach(u => {
      unitsMap[u.Ma_DV] = [];
    });
    submissions.forEach(sub => {
      if (unitsMap[sub.Ma_DV]) {
        unitsMap[sub.Ma_DV].push(sub);
      }
    });

    const rows: LeaderboardRow[] = UNITS_DATA.map(unit => {
      const unitSubs = unitsMap[unit.Ma_DV] || [];
      const totalCount = unitSubs.length;
      
      const submitted = unitSubs.filter(s => s.Ngay_Nop !== null);
      const submittedCount = submitted.length;
      
      const onTimeCount = submitted.filter(s => (s.So_Ngay_Tre ?? 0) <= 0).length;
      const lateCount = submitted.filter(s => (s.So_Ngay_Tre ?? 0) > 0).length;

      // Overdue is where deadline has passed but no submission
      const isPast = (dateStr: string) => new Date(dateStr) < new Date('2026-05-25');
      const overdueCount = unitSubs.filter(s => s.Ngay_Nop === null && isPast(s.Han_Nop)).length;
      const pendingCount = unitSubs.filter(s => s.Ngay_Nop === null && !isPast(s.Han_Nop)).length;

      const totalDelayedDays = submitted.reduce((sum, s) => sum + (s.So_Ngay_Tre ?? 0), 0);

      // Score Aggregates
      const totalDinhMuc = unitSubs.reduce((sum, s) => sum + s.Diem_Dinh_Muc, 0);
      const totalTimeScore = unitSubs.reduce((sum, s) => sum + (s.Diem_Thoi_Gian ?? 0), 0);
      const totalQualityScore = unitSubs.reduce((sum, s) => sum + (s.Diem_Chat_Luong ?? 0), 0);
      
      // Calculate emulation final points
      // Rule: Final Point is calculated out of proportional average scored points
      // Max possible score for a report template is 2 * Diem_Dinh_Muc (Diem_Thoi_Gian + Diem_Chat_Luong)
      // Emulation Score = (Sum(Tong_Diem) / Sum(Diem_Dinh_Muc)) * 100
      let emulationIndex = 0;
      if (totalDinhMuc > 0) {
        const achievedScores = unitSubs.reduce((sum, s) => {
          if (s.Tong_Diem !== null) return sum + s.Tong_Diem;
          // penalty for unsubmitted overdue reports is 0
          return sum;
        }, 0);
        emulationIndex = (achievedScores / totalDinhMuc) * 100;
        // Let's cap index score or scale it naturally
      }

      return {
        Ma_DV: unit.Ma_DV,
        Ten_Don_Vi: unit.Ten_Don_Vi,
        Vung: unit.Vung,
        Tong_Bao_Cao: totalCount,
        Da_Nop: submittedCount,
        Nop_Dung_Han: onTimeCount,
        Nop_Tre_Han: lateCount,
        Chua_Nop: overdueCount,
        Tong_Diem_Dinh_Muc: totalDinhMuc,
        Diem_Thoi_Gian_Tong: totalTimeScore,
        Diem_Chat_Luong_Tong: totalQualityScore,
         // out of max scale, rounded nicely
        Diem_Thi_Dua: Math.round(emulationIndex * 10) / 10,
        So_Ngay_Tre_Tong: totalDelayedDays,
        Rank: 0 // placeholder
      };
    });

    // Sort descending by score, then ascending by total delay days
    const sorted = rows.sort((a, b) => {
      if (b.Diem_Thi_Dua !== a.Diem_Thi_Dua) {
        return b.Diem_Thi_Dua - a.Diem_Thi_Dua;
      }
      return a.So_Ngay_Tre_Tong - b.So_Ngay_Tre_Tong;
    });

    // Assign rank with support for ties
    let currentRank = 1;
    sorted.forEach((row, index) => {
      if (index > 0 && sorted[index - 1].Diem_Thi_Dua !== row.Diem_Thi_Dua) {
        currentRank = index + 1;
      }
      row.Rank = currentRank;
    });

    return sorted;
  };

  const leaderboardData = calculateLeaderboard();

  // 6. Direct Excel Multi-Tab exporter
  const handleExportExcelAll = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Tab 1: General Standings
      const standingsCSV = leaderboardData.map(row => ({
        'Hạng': row.Rank,
        'Mã đơn vị': row.Ma_DV,
        'Tên đơn vị': row.Ten_Don_Vi,
        'Vùng địa bàn': row.Vung,
        'Chỉ tiêu được giao': row.Tong_Bao_Cao,
        'Số báo cáo đã nộp': row.Da_Nop,
        'Nộp đúng hạn': row.Nop_Dung_Han,
        'Nộp trễ hạn': row.Nop_Tre_Han,
        'Quá hạn chưa nộp': row.Chua_Nop,
        'Tổng số ngày nộp trễ': row.So_Ngay_Tre_Tong,
        'Tổng điểm Đạt được': Math.round((row.Diem_Thoi_Gian_Tong + row.Diem_Chat_Luong_Tong) * 10) / 10,
        'Điểm thi đua thi đua trung bình': row.Diem_Thi_Dua
      }));
      const wsStandings = XLSX.utils.json_to_sheet(standingsCSV);
      XLSX.utils.book_append_sheet(wb, wsStandings, 'Xếp Hạng Thi Đua Huyện');

      // Tab 2: Detailed submissions
      const submissionsCSV = submissions.map(sub => ({
        'Mã đơn vị': sub.Ma_DV,
        'Tên đơn vị': sub.Ten_Don_Vi,
        'Mã phòng giao': sub.Ma_Phong,
        'Tên phòng chuyên môn': sub.Ten_Phong,
        'Tên báo cáo kinh tế': sub.Ten_Bao_Cao,
        'Loại báo cáo': sub.Loai_BC,
        'Khóa hạn nộp': sub.Han_Nop,
        'Ngày thực tế nộp': sub.Ngay_Nop || 'Chưa nộp',
        'Tổng ngày trễ': sub.So_Ngay_Tre || 0,
        'Điểm định mức': sub.Diem_Dinh_Muc,
        'Điểm thời gian': sub.Diem_Thoi_Gian || 0,
        'Điểm đánh giá chất lượng': sub.Diem_Chat_Luong || 0,
        'Tổng điểm nhận về': sub.Tong_Diem || 0,
        'Nhận định kiểm chuẩn': sub.Nhan_Xet
      }));
      const wsSubmissions = XLSX.utils.json_to_sheet(submissionsCSV);
      XLSX.utils.book_append_sheet(wb, wsSubmissions, 'Chi Tiết Giao Điểm Báo Cáo');

      // Tab 3: Department Summary
      const deptsMetrics = DEPARTMENTS_DATA.map(d => {
        const dSubs = submissions.filter(s => s.Ma_Phong === d.Ma_Phong);
        const total = dSubs.length;
        const comp = dSubs.filter(s => s.Ngay_Nop !== null).length;
        const onTime = dSubs.filter(s => s.Ngay_Nop !== null && (s.So_Ngay_Tre ?? 0) === 0).length;
        const scoreSum = dSubs.reduce((acc, s) => acc + (s.Tong_Diem ?? 0), 0);
        return {
          'Mã phòng': d.Ma_Phong,
          'Phòng chuyên môn nghiệp vụ': d.Ten_Phong,
          'Tổng chỉ tiêu giao': total,
          'Đã nhận nộp': comp,
          'Nộp chuẩn thời hạn': onTime,
          'Tỷ lệ hoàn thành %': total > 0 ? `${Math.round((comp / total) * 100)}%` : '0%',
          'Tổng điểm thi đua phòng': Math.round(scoreSum * 10) / 10
        };
      });
      const wsDepts = XLSX.utils.json_to_sheet(deptsMetrics);
      XLSX.utils.book_append_sheet(wb, wsDepts, 'Tổng Hợp Phòng Ban');

      XLSX.writeFile(wb, 'Phan_Mem_Giao_Diem_Thi_Dua_Chi_Tiet_2026.xlsx');
      alert('Đã tạo thành công tệp Excel đa trang cực kỳ chi tiết! Tệp chứa biểu đồ số liệu xếp hạng thi đua bám sát thực tế.');
    } catch (err: any) {
      alert(`Đã xảy ra lỗi khi tạo tệp Excel: ${err.message}`);
    }
  };

  // Selected Unit Submissions for modal overview drilldown
  const getSelectedUnitSubmissions = (): ReportSubmission[] | null => {
    if (!selectedUnit) return null;
    return submissions.filter(s => s.Ma_DV === selectedUnit);
  };

  const getSelectedUnitName = (): string | null => {
    if (!selectedUnit) return null;
    const unitObj = UNITS_DATA.find(u => u.Ma_DV === selectedUnit);
    return unitObj ? unitObj.Ten_Don_Vi : selectedUnit;
  };

  if (currentUser === null) {
    return <Login onLoginSuccess={handleLoginSuccess} units={UNITS_DATA} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-sky-500/20">
      
      {/* Visual Navigation Header component */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetToDefault}
        onExportExcel={handleExportExcelAll}
        submissions={submissions}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main active route container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <StatsDashboard 
            submissions={submissions}
            leaderboard={leaderboardData}
            onSelectUnit={(maDv) => {
              setSelectedUnit(maDv);
            }}
          />
        )}

        {activeTab === 'browser' && (
          <ReportBrowser 
            submissions={submissions}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard 
            leaderboard={leaderboardData}
            submissions={submissions}
            onSelectUnit={(maDv) => setSelectedUnit(maDv)}
            selectedUnitSubmissions={getSelectedUnitSubmissions()}
            selectedUnitName={getSelectedUnitName()}
            onCloseDetailModal={() => setSelectedUnit(null)}
          />
        )}

        {activeTab === 'manager' && (
          <SubmissionManager 
            submissions={submissions}
            departments={DEPARTMENTS_DATA}
            units={UNITS_DATA}
            onUpdateSubmission={handleUpdateSingleSubmission}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentReport 
            submissions={submissions}
            departments={DEPARTMENTS_DATA}
          />
        )}

        {activeTab === 'importer' && (
          <ExcelImporter 
            onImportComplete={handleImportExcelComplete}
            existingCount={submissions.length}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountManager 
            accounts={accounts}
            onAddAccount={handleAddAccount}
            onUpdateAccount={handleUpdateAccount}
            onDeleteAccount={handleDeleteAccount}
            onResetAccounts={handleResetAccounts}
            units={UNITS_DATA}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Floating Help Assistant Widget */}
      <div className="fixed bottom-4 right-4 z-30 max-w-sm hidden md:block">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col space-y-1.5 text-white text-[11px] font-sans">
          <span className="text-[10px] text-sky-400 font-mono tracking-wider font-extrabold block">
            🛎️ TRỢ LÝ HƯỚNG DẪN KIỂM CHUẨN
          </span>
          <p className="text-slate-300 leading-normal">
            Hệ thống tự động chấm <span className="font-semibold text-sky-400">Điểm thời gian</span> dựa theo hạn nộp thực tế. Hãy chọn tab <span className="font-semibold text-teal-400">Nộp Báo Cáo</span> để nộp bài chỉ tiêu hoặc xuất Excel báo cáo ngay hôm nay!
          </p>
        </div>
      </div>

    </div>
  );
}

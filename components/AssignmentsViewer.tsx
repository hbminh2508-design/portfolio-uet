"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, CirclePlay, CircleX, ExternalLink, FileText, Sparkles, Info } from "lucide-react";

type Assignment = {
  week_number: number;
  title: string;
  description: string;
  pdf_url: string | null;
};

export default function AssignmentsViewer({ assignments }: { assignments: Assignment[] }) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Khởi tạo trạng thái môi trường Client để kích hoạt Portal an toàn
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedWeek === null) return;
    const stillExists = assignments.some((item) => item.week_number === selectedWeek);
    if (!stillExists) {
      setSelectedWeek(null);
    }
  }, [assignments, selectedWeek]);

  // Kiểm soát và khóa hoàn toàn thanh cuộn tổng của trình duyệt khi mở PDF
  useEffect(() => {
    if (selectedWeek === null || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedWeek(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedWeek]);

  const selectedAssignment = useMemo(
    () => assignments.find((item) => item.week_number === selectedWeek) ?? null,
    [assignments, selectedWeek],
  );

  // Định nghĩa khối giao diện xem tài liệu chuyên sâu độc lập hoàn toàn với lớp cha qua Portal
  const immersiveModal = useMemo(() => {
    if (selectedWeek === null) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col bg-[#f4f6f9]/40 text-slate-900 animate-[routeFadeIn_0.25s_ease-out_forwards]">
        
        {/* Top Bar công cụ tối giản phong cách Light Glass cao cấp */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 z-30 flex-shrink-0 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-xl bg-sky-50 px-2 py-2 text-sky-600 flex-shrink-0 border border-sky-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 leading-none">Immersive Workspace</p>
              <h3 className="mt-1 text-sm font-black tracking-tight truncate max-w-[40vw] sm:max-w-xl text-slate-800">
                {selectedAssignment ? selectedAssignment.title || `Bài tập tuần ${selectedAssignment.week_number}` : "Tài liệu học phần"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút ẩn/hiển thị nhanh bảng thông tin bài tập */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 h-9 text-xs font-bold uppercase tracking-wider border transition-all ${
                isSidebarOpen 
                  ? "bg-sky-50 border-sky-200 text-sky-700 shadow-sm" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title={isSidebarOpen ? "Kích hoạt chế độ Tràn màn hình hoàn toàn" : "Mở bảng chi tiết"}
            >
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">{isSidebarOpen ? "Ẩn thông tin" : "Hiện thông tin"}</span>
            </button>

            {selectedAssignment?.pdf_url && (
              <a
                href={selectedAssignment.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-50 shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mở tab mới</span>
              </a>
            )}
            
            <button
              type="button"
              onClick={() => setSelectedWeek(null)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-950 text-white transition-all hover:bg-rose-600 hover:border-rose-700 shadow-md"
              aria-label="Thoát không gian"
            >
              <CircleX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Khung Workspace chính: Co giãn động 100% diện tích còn lại của màn hình */}
        <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] bg-[#e2e8f0]/60 overflow-hidden relative">
          
          {/* Vùng hiển thị tệp PDF thích ứng thông minh */}
          <div className="flex-1 h-full p-0 sm:p-2 transition-all duration-300 ease-in-out relative z-10">
            {selectedAssignment?.pdf_url ? (
              <iframe
                key={selectedAssignment.pdf_url}
                src={`${selectedAssignment.pdf_url}#view=FitH&toolbar=1`}
                title={selectedAssignment.title || `Bài tập tuần ${selectedAssignment.week_number}`}
                className="w-full h-full border-0 bg-white sm:rounded-2xl shadow-xl border-white/60 transition-all duration-300"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-slate-400">
                <div className="space-y-3">
                  <FileText className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="text-sm font-medium">Tập tin chưa sẵn sàng trên hệ thống đám mây</p>
                </div>
              </div>
            )}
          </div>

          {/* Thanh Panel thông tin trượt mở phong cách Frosted Light Glass */}
          <aside 
            className={`h-full border-l border-slate-200/80 bg-white/70 flex flex-col transition-all duration-300 ease-in-out z-20 overflow-y-auto flex-shrink-0 backdrop-blur-2xl ${
              isSidebarOpen 
                ? "w-full md:w-[360px] opacity-100 p-5 md:p-6" 
                : "w-0 opacity-0 p-0 overflow-hidden border-l-0"
            }`}
          >
            <div className="space-y-5 min-w-[280px]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 border border-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  Thông tin chi tiết
                </span>
                <h4 className="mt-3 text-base font-black text-slate-900 leading-snug">
                  {selectedAssignment?.title || `Bài tập tuần ${selectedAssignment?.week_number}`}
                </h4>
              </div>

              {/* Đã xóa bỏ hoàn toàn ô cấu phần định danh cũ theo yêu cầu */}

              {/* Ô tóm tắt nội dung báo cáo Light Glass bám sát chữ */}
              <div className="rounded-xl border border-slate-200/60 bg-white/50 p-4 space-y-1.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Tóm tắt nội dung báo cáo</p>
                <p className="text-xs leading-6 text-slate-600 font-medium whitespace-pre-line">
                  {selectedAssignment?.description || "Tri thức tuần này chưa được cập nhật thông tin bổ sung."}
                </p>
              </div>

              <div className="pt-1">
                {selectedAssignment?.pdf_url && (
                  <a
                    href={selectedAssignment.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-sky-600 hover:shadow-[0_8px_20px_rgba(14,165,233,0.2)]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Tải xuống tệp báo cáo gốc
                  </a>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>
    );
  }, [selectedWeek, isSidebarOpen, selectedAssignment]);

  return (
    <div className="mt-4 space-y-4">
      {/* LƯỚI THẺ BÀI TẬP BAN ĐẦU */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {assignments.map((item) => {
          const isActive = item.week_number === selectedWeek;
          const isReady = Boolean(item.pdf_url);

          return (
            <button
              key={item.week_number}
              type="button"
              onClick={() => {
                setSelectedWeek(item.week_number);
                setIsSidebarOpen(true);
              }}
              className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                isActive
                  ? "border-sky-300 bg-sky-50/80 shadow-[0_12px_34px_rgba(14,165,233,0.1)] scale-[1.01]"
                  : isReady
                    ? "border-slate-200/80 bg-white/60 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/40 hover:shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
                    : "cursor-default border-dashed border-slate-200 bg-slate-100/50"
              }`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Tuần {item.week_number}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{item.title || `Bài tập tuần ${item.week_number}`}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description || "Chưa có mô tả"}</p>
              </div>

              <div className="ml-3 flex shrink-0 items-center gap-2">
                {isReady ? (
                  <CirclePlay className={`h-5 w-5 ${isActive ? "text-sky-700" : "text-sky-600 group-hover:scale-105 transition-transform"}`} />
                ) : (
                  <FileText className="h-5 w-5 text-slate-300" />
                )}
                <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 ${isActive ? "text-sky-700 rotate-12" : isReady ? "text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "text-slate-300"}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ĐƯA TOÀN BỘ KHỐI WORKSPACE RA KHỎI LỚP CHA QUA PORTAL AN TOÀN */}
      {mounted && immersiveModal ? createPortal(immersiveModal, document.body) : null}
    </div>
  );
}
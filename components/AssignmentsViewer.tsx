"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CirclePlay, CircleX, ExternalLink, FileText, Sparkles } from "lucide-react";

type Assignment = {
  week_number: number;
  title: string;
  description: string;
  pdf_url: string | null;
};

export default function AssignmentsViewer({ assignments }: { assignments: Assignment[] }) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    if (selectedWeek === null) {
      return;
    }

    const stillExists = assignments.some((item) => item.week_number === selectedWeek);
    if (!stillExists) {
      setSelectedWeek(null);
    }
  }, [assignments, selectedWeek]);

  useEffect(() => {
    if (selectedWeek === null || typeof document === "undefined") {
      return;
    }

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

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {assignments.map((item) => {
          const isActive = item.week_number === selectedWeek;
          const isReady = Boolean(item.pdf_url);

          return (
            <button
              key={item.week_number}
              type="button"
              onClick={() => setSelectedWeek((current) => (current === item.week_number ? null : item.week_number))}
              className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                isActive
                  ? "border-sky-300 bg-sky-50 shadow-[0_12px_34px_rgba(14,165,233,0.14)] scale-[1.01]"
                  : isReady
                    ? "border-slate-200 bg-slate-50 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                    : "cursor-default border-dashed border-slate-200 bg-slate-50/70"
              }`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Tuần {item.week_number}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{item.title || `Bài tập tuần ${item.week_number}`}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description || "Chưa có mô tả"}</p>
              </div>

              <div className="ml-3 flex shrink-0 items-center gap-2">
                {isReady ? (
                  <CirclePlay className={`h-5 w-5 ${isActive ? "text-sky-700" : "text-sky-600"}`} />
                ) : (
                  <FileText className="h-5 w-5 text-slate-300" />
                )}
                <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 ${isActive ? "text-sky-700 rotate-12" : isReady ? "text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "text-slate-300"}`} />
              </div>
            </button>
          );
        })}
      </div>

      {selectedWeek !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-1.5 py-1.5 sm:px-2 sm:py-2">
          <button
            type="button"
            aria-label="Đóng preview PDF"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-[fadeInUp_0.2s_ease-out]"
            onClick={() => setSelectedWeek(null)}
          />

          <div className="relative z-10 flex h-[calc(100vh-0.75rem)] w-[min(1360px,100vw-0.75rem)] flex-col overflow-hidden rounded-[1rem] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80 animate-[fadeInUp_0.25s_ease-out] sm:h-[calc(100vh-1rem)] sm:w-[min(1380px,100vw-1rem)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-3.5 py-2.5 sm:px-4 sm:py-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-2 text-sky-600 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Xem trước bài tập</p>
                  <h3 className="mt-1 text-base font-bold text-slate-950 sm:text-lg truncate">
                    {selectedAssignment ? selectedAssignment.title || `Bài tập tuần ${selectedAssignment.week_number}` : "Chưa chọn bài tập"}
                  </h3>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6 line-clamp-2">
                    {selectedAssignment?.description || "Chưa có mô tả cho tuần này."}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {selectedAssignment?.pdf_url ? (
                  <a
                    href={selectedAssignment.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 hover:bg-slate-50 sm:inline-flex sm:text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Mở tab mới
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => setSelectedWeek(null)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-sm"
                >
                  <CircleX className="h-4 w-4" />
                  Đóng
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-0 bg-slate-100 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-h-0 bg-slate-100">
                {selectedAssignment?.pdf_url ? (
                  <iframe
                    key={selectedAssignment.pdf_url}
                    src={`${selectedAssignment.pdf_url}#view=FitH&toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit`}
                    title={selectedAssignment.title || `Bài tập tuần ${selectedAssignment.week_number}`}
                    className="h-full min-h-0 w-full border-0"
                  />
                ) : (
                  <div className="flex h-full min-h-0 items-center justify-center px-6 py-10 text-center text-slate-500">
                    <div>
                      <FileText className="mx-auto h-12 w-12 text-slate-300" />
                      <p className="mt-3 text-sm font-medium">Tuần này chưa có file PDF để xem</p>
                    </div>
                  </div>
                )}
              </div>

              <aside className="border-t border-slate-200 bg-white px-4 py-4 lg:border-l lg:border-t-0 lg:px-5 lg:py-5 overflow-y-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Chi tiết tuần</p>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Trạng thái</p>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{selectedAssignment?.pdf_url ? "Sẵn sàng xem" : "Chưa có file PDF"}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mô tả</p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600 line-clamp-6">{selectedAssignment?.description || "Chưa có mô tả"}</p>
                  </div>

                  {selectedAssignment?.pdf_url ? (
                    <a
                      href={selectedAssignment.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.22)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Xem file PDF
                    </a>
                  ) : null}
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
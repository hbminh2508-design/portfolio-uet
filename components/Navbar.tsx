import Link from "next/link";
import { BookOpenText, Home, LayoutGrid, GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-[min(1120px,calc(100%-1.5rem))] items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-5 py-3.5 shadow-glass backdrop-blur-xl">
      <div className="flex items-center gap-2.5 font-bold text-lg text-slate-900">
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-1.5 text-sky-600">
          <GraduationCap className="w-5 h-5" strokeWidth={2} />
        </div>
        <span className="tracking-[0.24em] uppercase">Portfolio cá nhân</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900">
          <Home className="w-4 h-4 text-slate-500 transition-all hover:text-sky-600" strokeWidth={1.75} />
          <span>Trang chủ</span>
        </Link>

        <Link href="/baituong" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 sm:flex">
          <LayoutGrid className="w-4 h-4 text-slate-500 transition-all hover:text-indigo-600" strokeWidth={1.75} />
          <span>Bài tập</span>
        </Link>

        <Link href="/tongket" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 sm:flex">
          <BookOpenText className="w-4 h-4 text-slate-500 transition-all hover:text-emerald-600" strokeWidth={1.75} />
          <span>Tổng kết</span>
        </Link>
      </div>
    </nav>
  );
}
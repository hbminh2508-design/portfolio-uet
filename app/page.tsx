"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, ImageIcon, Sparkles, Terminal } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Import hình ảnh logo trực tiếp từ thư mục Source (Static Import gốc)
import LogoImage from '@/images/uet-logo.png';

type Profile = {
  id: string;
  full_name: string;
  student_id: string;
  class_name: string;
  course_name: string;
  intro_text: string;
  avatar_url: string | null;
  background_url: string | null;
};

const defaultProfile: Profile = {
  id: "main",
  full_name: "Hoàng Bình Minh",
  student_id: "25024004",
  class_name: "UET.A20",
  course_name: "Nhập môn Công nghệ số và Trí tuệ nhân tạo",
  intro_text:
    "Trang CV học tập cá nhân, nơi giới thiệu thông tin sinh viên, ảnh chân dung, nền trang và 7 bài tập được quản lý trực tiếp qua Supabase.",
  avatar_url: null,
  background_url: null,
};

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [showWelcome, setShowWelcome] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (profileData) {
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name ?? defaultProfile.full_name,
          student_id: profileData.student_id ?? defaultProfile.student_id,
          class_name: profileData.class_name ?? defaultProfile.class_name,
          course_name: profileData.course_name ?? defaultProfile.course_name,
          intro_text: profileData.intro_text ?? defaultProfile.intro_text,
          avatar_url: profileData.avatar_url,
          background_url: profileData.background_url,
        });
      }
    }
    loadData();
  }, []);

  const handleEnterWorkspace = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 600);
  };

  return (
    <>
      {/* 1. MÀN HÌNH CHÀO MỪNG LIGHT MODE - BLUEPRINT GRID & LIQUID GLASS */}
      {showWelcome && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f8fafc] transition-all duration-700 ease-in-out ${
            animateOut ? "opacity-0 scale-102 pointer-events-none" : "opacity-100 scale-100"
          }`}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        >
          <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-200/20 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />

          <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-12 grid gap-12 items-center md:grid-cols-[1.1fr_0.9fr] relative">
            <div className="space-y-6 text-left relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-[10px] font-mono font-bold tracking-[0.25em] text-sky-600 backdrop-blur-md shadow-sm">
                <Terminal className="h-3.5 w-3.5" />
                VNU - UET WORKSPACE · 2026
              </div>

              <div className="space-y-1 select-none">
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 sm:text-6xl lg:text-[4.8rem] uppercase leading-[0.9]">
                  PORTFOLIO
                </h1>
                <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 sm:text-6xl lg:text-[4.8rem] uppercase leading-[0.9]">
                  WORKSPACE
                </h1>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Xin chào, em là-</p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                  {profile.full_name}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white/60 px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider text-slate-600 backdrop-blur-md shadow-sm">
                  MSV · {profile.student_id}
                </div>
                <div className="inline-flex items-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-bold tracking-wide text-sky-700 backdrop-blur-md shadow-sm">
                  CÔNG NGHỆ VẬT LIỆU & VI ĐIỆN TỬ
                </div>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-slate-600 backdrop-blur-md">
                  {profile.class_name}
                </div>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500 font-normal">
                Học phần <strong className="text-slate-800 font-semibold">{profile.course_name}</strong>. Sinh viên ngành Công nghệ Vật liệu Vi điện tử. Em định hướng trở thành kỹ sư kết hợp tư duy kỹ thuật với khả năng tư duy, sáng tạo — tạo ra các giải pháp có tính ứng dụng cao trong thực tế.
              </p>

              <div className="pt-4 flex items-center gap-6">
                <button
                  onClick={handleEnterWorkspace}
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-sky-600/20"
                >
                  Khám phá PORTFOLIO
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="hidden sm:inline text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase select-none animate-pulse">
                  Click to explore
                </span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end items-center relative">
              <div className="relative w-full max-w-[290px] sm:max-w-[350px] aspect-square rounded-[2.5rem] border border-white bg-white/40 p-8 shadow-[0_24px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-[1.02] hover:border-white/80 group">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none" />
                <img
                  src={LogoImage.src}
                  alt="VNU-UET Logo"
                  className="w-3/4 h-3/4 object-contain opacity-90 group-hover:opacity-100 transition-all duration-500 filter drop-shadow-[0_4px_12px_rgba(14,165,233,0.1)]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GIAO DIỆN KHÔNG GIAN LÀM VIỆC CHÍNH (PERFECT GLASS WINDOW) */}
      <Navbar />
      <main
        className="fixed inset-0 h-screen w-screen px-4 pb-4 pt-20 sm:pt-24 bg-[#f4f6f9] overflow-y-auto sm:overflow-hidden flex items-center justify-center z-0"
        style={
          profile.background_url
            ? {
                backgroundImage: `linear-gradient(rgba(244, 246, 249, 0.72), rgba(244, 246, 249, 0.88)), url(${profile.background_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }
            : undefined
        }
      >
        {/* Nền lưới tọa độ đồng bộ mờ mịn dưới lớp kính Workspace */}
        <div 
          className="absolute inset-0 -z-10 pointer-events-none opacity-50" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Khung chứa ép sát vĩ mô max-w-4xl bảo vệ giao diện không sinh thanh cuộn dọc */}
        <div className="w-full max-w-4xl h-auto max-h-[calc(100vh-6.5rem)] px-2 sm:px-4 flex flex-col justify-center animate-[contentLift_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          
          {/* LIQUID GLASS BOARD - Độ phủ mờ sâu, phản quang gương chéo và đổ bóng mịn đa lớp chuẩn Apple */}
          <section className="rounded-[2.25rem] border border-white/90 bg-white/40 p-5 sm:p-6 shadow-[0_30px_60px_rgba(15,23,42,0.04),inset_0_1px_2px_rgba(255,255,255,0.85)] backdrop-blur-3xl overflow-hidden relative">
            
            {/* Lớp phủ vệt sáng bóng bẩy trên bề mặt kính */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.15] pointer-events-none rounded-[2.25rem]" />

            <div className="grid gap-6 lg:grid-cols-[1.22fr_0.78fr] items-center relative z-10">
              
              {/* Cột trái: Nội dung thông tin hệ thống */}
              <div className="space-y-4 min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/60 bg-sky-100/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-700 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
                  Thông tin cá nhân
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2.15rem] leading-none">
                    {profile.full_name}
                  </h1>
                </div>

                {/* Các phiến kính con chứa thông tin bám sát chữ */}
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/80 bg-white/60 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.01)] backdrop-blur-md transition-all hover:bg-white/80">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Mã số sinh viên</p>
                    <p className="mt-0.5 text-base font-bold text-slate-800 tracking-wide">{profile.student_id}</p>
                  </div>
                  <div className="rounded-xl border border-white/80 bg-white/60 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.01)] backdrop-blur-md transition-all hover:bg-white/80">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Lớp</p>
                    <p className="mt-0.5 text-base font-bold text-slate-800 tracking-wide">{profile.class_name}</p>
                  </div>
                  <div className="rounded-xl border border-sky-200/50 bg-sky-50/40 p-3 sm:col-span-2 shadow-[0_2px_8px_rgba(14,165,233,0.01)] backdrop-blur-md">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">Học phần</p>
                    <p className="mt-0.5 text-base font-bold text-sky-800 tracking-wide truncate">{profile.course_name}</p>
                  </div>
                </div>

                {/* Khối thông tin bổ sung - Thiết kế viền mờ bóng bẩy */}
                <div className="rounded-2xl border border-white/50 bg-white/20 p-4 space-y-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Thông tin bổ sung</p>
                  <div className="grid gap-4 text-xs text-slate-600 sm:grid-cols-2">
                    <div className="border-l-2 border-sky-400 pl-3">
                      <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400">Sở thích</p>
                      <p className="mt-0.5 font-bold text-slate-700 text-[11.5px]">Khám phá khoa học bán dẫn.</p>
                    </div>
                    <div className="border-l-2 border-sky-400 pl-3">
                      <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400">Mục tiêu học tập</p>
                      <p className="mt-0.5 font-bold text-slate-700 text-[11.5px]">Nghiên cứu cấu trúc vi điện tử.</p>
                    </div>
                    <div className="sm:col-span-2 border-t border-white/40 pt-2.5">
                      <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400">Định hướng bản thân</p>
                      <p className="mt-0.5 text-slate-600 font-semibold text-[11.5px] line-clamp-1">Trở thành một công dân có ích, cống hiến tri thức cho đất nước.</p>
                    </div>
                    <div className="sm:col-span-2 border-t border-white/40 pt-2.5">
                      <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400">Mục tiêu của Portfolio</p>
                      <p className="mt-0.5 text-slate-600 leading-relaxed font-semibold text-[11.5px] line-clamp-2">{profile.intro_text}</p>
                    </div>
                  </div>
                </div>

                {/* Cụm nút chuyển hướng phong cách thủy tinh lỏng */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/baituong"
                    className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_10px_20px_rgba(14,165,233,0.2)]"
                  >
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    Đi tới 6 bài tập
                  </Link>
                  <Link
                    href="/tongket"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/60 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Xem tổng kết
                  </Link>
                </div>
              </div>

              {/* Cột phải: Khung gương chứa ảnh chân dung */}
              <div className="flex flex-col justify-center items-center lg:items-end w-full h-full">
                <div 
                  className="w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[260px] overflow-hidden rounded-[1.75rem] border-2 border-white/90 bg-white/80 shadow-[0_20px_40px_rgba(15,23,42,0.04)] backdrop-blur-md transform transition-all duration-500 hover:scale-[1.01] hover:border-sky-400/50 relative group" 
                  style={{ aspectRatio: "3 / 4" }}
                >
                  {/* Lớp phủ phản quang bóng mặt kính bề mặt */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-black/[0.02] z-10 pointer-events-none" />
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="h-full w-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400 bg-slate-50">
                      <ImageIcon className="h-9 w-9 text-slate-300" />
                      <p className="text-[11px] font-medium">Ảnh chân dung</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </>
  );
}
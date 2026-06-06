"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ArrowRight, BookOpen, Milestone, Compass, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string;
  course_name: string;
  intro_text: string;
  background_url: string | null;
};

const defaultProfile: Profile = {
  full_name: "Hoàng Bình Minh",
  course_name: "Nhập môn Công nghệ số và Trí tuệ nhân tạo",
  intro_text: "Trang CV học tập cá nhân, nơi giới thiệu thông tin sinh viên, ảnh chân dung, nền trang và 7 bài tập được quản lý trực tiếp qua Supabase.",
  background_url: null,
};

export default function SummaryPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    async function loadData() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, course_name, intro_text, background_url")
        .eq("id", "main")
        .maybeSingle();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name ?? defaultProfile.full_name,
          course_name: profileData.course_name ?? defaultProfile.course_name,
          intro_text: profileData.intro_text ?? defaultProfile.intro_text,
          background_url: profileData.background_url,
        });
      }
    }
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      {/* 1. KHUNG CHỨA CĂN GIỮA TUYỆT ĐỐI TOÀN CỤC - KHÓA CUỘN NGOÀI TRÊN PC */}
      <main className="fixed inset-0 h-screen w-screen px-4 pb-4 bg-[#f4f6f9] overflow-y-auto sm:overflow-hidden flex items-center justify-center z-0">
        
        {/* Lưới tọa độ Blueprint mờ mịn đồng bộ hệ thống */}
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

        {/* Khung giới hạn chiều cao tối đa thích ứng chặt chẽ theo Viewport (Chống tràn dọc) */}
        <div className="w-full max-w-4xl h-auto max-h-[calc(100vh-6.5rem)] px-1 sm:px-4 flex flex-col justify-center animate-[contentLift_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] will-change-[transform,opacity]">
          
          {/* MẶT KÍNH LIQUID GLASS CARD - Thiết kế nguyên khối siêu thực của Apple */}
          <section className="rounded-[2.25rem] border border-white/90 bg-white/45 p-4 sm:p-5 lg:p-6 shadow-[0_30px_60px_rgba(15,23,42,0.04),inset_0_1px_2px_rgba(255,255,255,0.85)] backdrop-blur-2xl overflow-hidden relative flex flex-col">
            
            {/* Lớp phủ vệt sáng chéo phản quang bề mặt thủy tinh */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.12] pointer-events-none rounded-[2.25rem]" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Header phân hệ tinh gọn, hạ khoảng cách đệm xuống mức tối giản */}
              <div className="border-b border-slate-200/60 pb-3 flex flex-wrap items-end justify-between gap-3 flex-shrink-0">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/60 bg-sky-100/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
                    Báo cáo thu hoạch
                  </div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl leading-none">
                    Nhìn Lại Hành Trình & Tri Thức
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tổng kết quá trình kiến tạo hệ thống Portfolio điện tử và chuyển dịch tri thức số học phần.
                  </p>
                </div>
                
                {/* Cụm nút chuyển hướng gọn gàng */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Về trang chủ
                  </Link>
                  <Link
                    href="/baituong"
                    className="group inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    Đi tới 6 bài tập
                  </Link>
                </div>
              </div>

              {/* 2. VÙNG BENTO GRID NỘI KHU - BẮT BUỘC CUỘN ĐỘC LẬP KHI MÀN HÌNH QUÁ NHỎ */}
              <div className="pt-4 overflow-y-auto max-h-[calc(100vh-16.5rem)] pr-1 grid gap-3 sm:grid-cols-3 flex-1 custom-scrollbar">
                
                {/* Ô 1: Nhìn lại hành trình (Chiếm 2 cột) - Giữ trọn vẹn văn phong sâu sắc của anh */}
                <article className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] backdrop-blur-md sm:col-span-2 space-y-2.5 transition-all hover:bg-white/80">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Compass className="h-4 w-4 text-sky-600 animate-spin" style={{ animationDuration: '7s' }} />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Suy ngẫm & Cảm nhận cá nhân</h2>
                  </div>
                  <div className="text-[11px] sm:text-xs leading-6 text-slate-600 font-medium space-y-2 text-justify">
                    <p>
                      Cảm nhận cá nhân: Đây là nơi em nhìn lại và nêu bật những kiến thức, kỹ năng quan trọng nhất đã học được; trong đó điểm em tâm đắc nhất là đã biết cách tự nghiên cứu học thuật và phối hợp với các công cụ AI để tối ưu hóa hiệu suất học tập.
                    </p>
                    <p>
                      Tuy nhiên, khi bắt tay vào xây dựng Portfolio này, em đã gặp phải những thách thức và khó khăn rất lớn, điển hình là việc quản lý tệp tin quá lộn xộn khiến dữ liệu bị thất lạc, cũng như việc lạm dụng AI quá đà dẫn đến nội dung bài viết bị rập khuôn, thiếu đi tư duy phản biện cá nhân.
                    </p>
                    <p>
                      Từ những va vấp đó, em đã tự đánh giá và rút ra bài học kinh nghiệm đắt giá: phải luôn làm chủ công nghệ bằng cách đặt ra nguyên tắc sử dụng AI có trách nhiệm sáng tạo, dùng AI như bạn đồng hành và đồng thời phải sắp xếp thư mục lưu trữ một cách khoa học ngay từ đầu. Những trải nghiệm thực tế này là minh chứng cho sự trưởng thành sâu sắc của bản thân, giúp em biết cách áp dụng các kỹ năng quản lý thông tin và tư duy công nghệ này vào các môn học tiếp theo, hoặc xa hơn là chuẩn bị hành trang để chinh phục các nhà tuyển dụng trong tương lai.
                    </p>
                  </div>
                </article>

                {/* Ô 2: Mục tiêu cốt lõi (Chiếm 1 cột) */}
                <aside className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] backdrop-blur-md space-y-2.5 transition-all hover:bg-white/80 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Milestone className="h-4 w-4 text-indigo-600" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quá trình hoàn thành</h2>
                    </div>
                    <ul className="space-y-2 text-xs leading-5 text-slate-600 list-none pl-0 font-medium">
                      <li className="flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold select-none">—</span>
                        <div>Quá trình hoàn thành học phần là một hành trình chuyển đổi từ bỡ ngỡ ban đầu sang chủ động làm chủ công nghệ. Dù gặp nhiều khó khăn khi làm quen với các khái niệm trừu tượng và công cụ mới, em đã từng bước vượt qua nhờ các buổi thực hành bài bản và bài tập nhóm thực tế. Việc kiên trì thử nghiệm, tự nghiên cứu và liên tục sửa sai khi tương tác với AI không chỉ giúp em đạt kết quả tốt, mà còn hình thành tư duy số nhạy bén để ứng dụng hiệu quả vào học tập.</div>
                      </li>

                    </ul>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-400 border-t border-slate-200/60 pt-2 uppercase select-none">
                    Status: Synced to Cloud
                  </div>
                </aside>

                {/* Ô 3: Tri thức & Kỹ năng tích hợp (Chiếm 2 cột) */}
                <article className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] backdrop-blur-md sm:col-span-2 space-y-2 transition-all hover:bg-white/80">
                  <div className="flex items-center gap-2 text-slate-900">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Kỹ năng tâm đắc đã học được</h2>
                  </div>
                  <ul className="space-y-1.5 text-xs leading-5 text-slate-600 list-none pl-0 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold select-none">—</span>
                      <div><strong>Làm chủ tư duy công nghệ:</strong> Nhận thức rõ AI là trợ lý đắc lực, hiểu cách đặt câu lệnh (prompt) chính xác để điều khiển máy móc thay vì bị lệ thuộc vào công nghệ.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold select-none">—</span>
                      <div><strong>Tối ưu hóa hiệu suất:</strong> Biết cách ứng dụng các công cụ số để tự động hóa tác vụ, phân tích dữ liệu lớn và tăng tốc độ xử lý công việc, học tập.</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold select-none">—</span>
                      <div><strong>Nâng cao đạo đức và an toàn số:</strong> Ý thức sâu sắc về bảo mật dữ liệu cá nhân, tính bản quyền và trách nhiệm kiểm duyệt thông tin khi sử dụng AI.</div>
                    </li>
                  </ul>
                </article>

                {/* Ô 4: Thách thức vượt qua (Chiếm 1 cột) */}
                <article className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] backdrop-blur-md space-y-2 transition-all hover:bg-white/80">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Thách thức gặp phải</h2>
                  </div>
                  <ul className="space-y-2 text-xs leading-4.5 text-slate-600 list-none pl-0 font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold select-none">—</span>
                      <div>Nguy cơ phụ thuộc và lười tư duy</div>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold select-none">—</span>
                      <div>Tốc độ thay đổi và áp lực đào thải.</div>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold select-none">—</span>
                      <div>Độ chính xác và thông tin sai lệch</div>
                    </li>
                  </ul>
                </article>

              </div>
            </div>

          </section>
        </div>
      </main>
    </>
  );
}
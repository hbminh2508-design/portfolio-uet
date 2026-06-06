import Navbar from "@/components/Navbar";
import AssignmentsViewer from "@/components/AssignmentsViewer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

type Assignment = {
  week_number: number;
  title: string;
  description: string;
  pdf_url: string | null;
};

const defaultAssignments = Array.from({ length: 6 }, (_, index) => ({
  week_number: index + 1,
  title: `Bài tập tuần ${index + 1}`,
  description: "Nội dung chi tiết sẽ hiển thị sau khi bạn tải file lên từ trang admin.",
  pdf_url: null,
}));

export const revalidate = 60;

export default async function AssignmentsPage() {
  const { data: assignmentsData } = await supabase
    .from("assignments")
    .select("*")
    .order("week_number", { ascending: true });

  const assignments = assignmentsData?.length 
    ? (assignmentsData as Assignment[]).filter(task => task.week_number <= 6) 
    : defaultAssignments;

  return (
    <>
      <Navbar />
      {/* TỐI ƯU: Thêm flex items-center justify-center và loại bỏ pt-24 để căn giữa tuyệt đối */}
      <main className="fixed inset-0 h-screen w-screen px-4 pb-4 bg-[#f4f6f9] overflow-y-auto sm:overflow-hidden flex items-center justify-center z-0">
        
        {/* Nền lưới tọa độ Blueprint mờ mịn đồng bộ hệ thống */}
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

        {/* Khung điều phối vĩ mô khống chế max-w-4xl và giới hạn max-h thích ứng màn hình */}
        <div className="w-full max-w-4xl h-auto max-h-[calc(100vh-6.5rem)] px-2 sm:px-4 flex flex-col justify-center animate-[contentLift_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] will-change-[transform,opacity]">
          
          {/* SIÊU PHẨM LIQUID GLASS CARD - Đồng bộ cấu trúc tráng gương cao cấp */}
          <section className="rounded-[2.25rem] border border-white/90 bg-white/45 p-5 sm:p-6 lg:p-7 shadow-[0_30px_60px_rgba(15,23,42,0.04),inset_0_1px_2px_rgba(255,255,255,0.85)] backdrop-blur-3xl overflow-hidden relative">
            
            {/* Lớp phủ vệt sáng chéo phản quang bề mặt thủy tinh */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.12] pointer-events-none rounded-[2.25rem]" />

            <div className="relative z-10">
              {/* Header phân hệ tinh gọn bám sát chữ */}
              <div className="border-b border-slate-200/60 pb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/60 bg-sky-100/30 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700 backdrop-blur-md">
                    <Layers className="h-3.5 w-3.5 text-sky-500" />
                    Học phần số hóa
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl leading-none">
                    6 thẻ truy cập nhanh
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Bấm trực tiếp vào từng phân hệ dưới đây để kích hoạt cửa sổ xem trước PDF trực tuyến.
                  </p>
                </div>
                
                {/* Cụm nút hướng tuyến tính */}
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Về trang chủ
                  </Link>
                  <Link
                    href="/tongket"
                    className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    Đến trang tổng kết
                  </Link>
                </div>
              </div>

              {/* Vùng lưới hiển thị 6 bài tập */}
              <div className="pt-4 overflow-y-auto max-h-[calc(100vh-18rem)] pr-1">
                <AssignmentsViewer
                  assignments={assignments.map((task) => ({
                    week_number: task.week_number,
                    title: task.title,
                    description: task.description,
                    pdf_url: task.pdf_url,
                  }))}
                />
              </div>
            </div>

          </section>
        </div>
      </main>
    </>
  );
}
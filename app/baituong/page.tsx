import Navbar from "@/components/Navbar";
import AssignmentsViewer from "@/components/AssignmentsViewer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Assignment = {
  week_number: number;
  title: string;
  description: string;
  pdf_url: string | null;
};

const defaultAssignments = Array.from({ length: 7 }, (_, index) => ({
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

  const assignments = assignmentsData?.length ? (assignmentsData as Assignment[]) : defaultAssignments;

  return (
    <>
      <Navbar />
      {/* Đã tăng pt-2 sm:pt-4 lên pt-24 sm:pt-28 để tránh trùng và lẹm vào Navbar */}
      <main className="min-h-screen px-4 pb-12 pt-24 sm:pt-28 bg-slate-50/50">
        <div className="mx-auto w-full max-w-5xl">
          <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-glass md:max-h-[calc(100vh-12rem)]">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Bài tập</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-[2rem]">7 thẻ truy cập nhanh</h1>
              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
                Bấm vào từng thẻ để mở popup preview PDF.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 hover:border-sky-300 hover:text-slate-950"
                >
                  <ArrowRight className="h-4 w-4" />
                  Về trang chủ
                </Link>
                <Link
                  href="/tongket"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  <ArrowRight className="h-4 w-4" />
                  Đến trang tổng kết
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mb-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                Bài tập từng tuần được chia ra các thẻ.
              </div>

              <AssignmentsViewer
                assignments={assignments.map((task) => ({
                  week_number: task.week_number,
                  title: task.title,
                  description: task.description,
                  pdf_url: task.pdf_url,
                }))}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
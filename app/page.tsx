import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, ImageIcon, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export const revalidate = 60;

export default async function HomePage() {
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", "main").maybeSingle();

  const profile = profileData ?? defaultProfile;

  return (
    <>
      <Navbar />
      {/* 
        - Đã thay đổi pt-2 sm:pt-3 thành pt-24 sm:pt-28 để đẩy hẳn phần hộp nội dung xuống dưới, không bị trùng hay dính sát vào Navbar.
        - Xóa bỏ hoàn toàn md:h-[calc(100vh-7.25rem)] và md:overflow-hidden để tránh làm đứt quãng chữ và lỗi nền.
      */}
      <main
        className="relative isolate min-h-screen px-4 pb-12 pt-24 sm:pt-28 bg-[#f8f5ef]/40"
        style={
          profile.background_url
            ? {
                backgroundImage: `linear-gradient(rgba(248,245,239,0.82), rgba(248,245,239,0.94)), url(${profile.background_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed", // Giữ ảnh nền cố định toàn màn hình khi cuộn trang
              }
            : undefined
        }
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_26%)]" />

        {/* Xóa md:h-full để khung chứa co giãn tự nhiên theo nội dung thực tế */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
          {/* Xóa md:max-h-[calc(100vh-10rem)] để hiển thị đầy đủ "Thông tin bổ sung", "Sở thích", "Mục tiêu" không bị cắt lẹm nữa */}
          <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/85 shadow-glass backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  <Sparkles className="h-4 w-4" />
                  Thông tin cá nhân
                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-[2.15rem] lg:text-4xl">
                  {profile.full_name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Thông tin cá nhân của sinh viên, định hướng học tập và mục tiêu của portfolio này.
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mã số sinh viên</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{profile.student_id}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Lớp</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{profile.class_name}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Học phần</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{profile.course_name}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Thông tin bổ sung</p>
                  <div className="mt-2.5 grid gap-2.5 text-sm leading-5 text-slate-700 sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-slate-900">Sở thích</p>
                      <p className="mt-1 text-[0.92rem]">Khám phá khoa học.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Mục tiêu học tập</p>
                      <p className="mt-1 text-[0.92rem]">Nghiên cứu vật liệu bán dẫn.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Định hướng phát triển bản thân</p>
                      <p className="mt-1 text-[0.92rem]">Trở thành một công dân có ích cho đất nước.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Mục tiêu của Portfolio</p>
                      <p className="mt-1 text-[0.92rem]">Thể hiện được các kỹ năng đã tiếp thu sau khi kết thúc học phần và giữ lại làm nơi để lưu trữ, chia sẻ các kiến thức đã được học.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/baituong"
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Đi tới 7 bài tập
                  </Link>
                  <Link
                    href="/tongket"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 hover:border-sky-300 hover:text-slate-950"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Xem tổng kết
                  </Link>
                </div>
              </div>

              {/* Bổ sung flex-col + justify-center để căn dọc ảnh chân dung nằm cân đối sang bên phải */}
              <div className="border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5 lg:border-l lg:border-t-0 lg:p-6 flex flex-col justify-center">
                <div className="mx-auto w-full max-w-sm flex flex-col justify-center gap-3">
                  <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-glass" style={{ aspectRatio: "340 / 500" }}>
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-100 to-slate-50 text-slate-400">
                        <ImageIcon className="h-12 w-12" />
                        <p className="text-sm font-medium">Ảnh chân dung sẽ hiển thị ở đây</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
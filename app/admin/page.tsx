"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { Save, ImageIcon, FileDown, Sparkles, ArrowUpRight, LockKeyhole, RotateCcw } from "lucide-react";

type ProfileForm = {
  id: string;
  full_name: string;
  student_id: string;
  class_name: string;
  course_name: string;
  intro_text: string;
  avatar_url: string;
  background_url: string;
};

type AssignmentForm = {
  week_number: number;
  title: string;
  description: string;
  pdf_url: string;
};

const emptyProfile: ProfileForm = {
  id: "main",
  full_name: "Hoàng Bình Minh",
  student_id: "25024004",
  class_name: "UET.A20",
  course_name: "Nhập môn Công nghệ số và Trí tuệ nhân tạo",
  intro_text: "",
  avatar_url: "",
  background_url: "",
};

const emptyAssignments = Array.from({ length: 7 }, (_, index) => ({
  week_number: index + 1,
  title: `Bài tập tuần ${index + 1}`,
  description: "",
  pdf_url: "",
}));

const ACCESS_CODE = "@portfolio-uet";

async function uploadAsset(file: File, filePath: string) {
  const { error: uploadError } = await supabase.storage.from("portfolio-assets").upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
  return data.publicUrl;
}

export default function AdminPage() {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [assignments, setAssignments] = useState<AssignmentForm[]>(emptyAssignments);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [assignmentFiles, setAssignmentFiles] = useState<Record<number, File | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Đang tải dữ liệu từ Supabase...");
  const [accessCode, setAccessCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!unlocked) {
      return;
    }

    let isMounted = true;

    async function loadData() {
      const [{ data: profileData, error: profileError }, { data: assignmentData, error: assignmentError }] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", "main").maybeSingle(),
          supabase.from("assignments").select("*").order("week_number", { ascending: true }),
        ]);

      if (!isMounted) {
        return;
      }

      if (profileError) {
        setMessage(`Không tải được hồ sơ: ${profileError.message}`);
      } else if (profileData) {
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name ?? "",
          student_id: profileData.student_id ?? "",
          class_name: profileData.class_name ?? "",
          course_name: profileData.course_name ?? "",
          intro_text: profileData.intro_text ?? "",
          avatar_url: profileData.avatar_url ?? "",
          background_url: profileData.background_url ?? "",
        });
        setMessage("Dữ liệu hồ sơ đã sẵn sàng.");
      }

      if (!assignmentError && assignmentData?.length) {
        setAssignments(
          emptyAssignments.map((fallback) => {
            const current = assignmentData.find((item) => item.week_number === fallback.week_number);
            if (!current) {
              return fallback;
            }

            return {
              week_number: current.week_number,
              title: current.title ?? "",
              description: current.description ?? "",
              pdf_url: current.pdf_url ?? "",
            };
          }),
        );
      }

      if (assignmentError) {
        setMessage(`Không tải được bài tập: ${assignmentError.message}`);
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [unlocked]);

  function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (accessCode.trim() === ACCESS_CODE) {
      setAuthError("");
      setUnlocked(true);
      setMessage("Đang xác thực quyền truy cập...");
      setLoading(true);
      return;
    }

    setAuthError("Mã đăng nhập không đúng.");
  }

  function handleRetry() {
    setAccessCode("");
    setAuthError("");
    setUnlocked(false);
    setLoading(true);
    setMessage("Đang tải dữ liệu từ Supabase...");
  }

  async function handleSaveAll() {
    setSaving(true);
    setMessage("Đang lưu dữ liệu...");

    try {
      let avatarUrl = profile.avatar_url;
      let backgroundUrl = profile.background_url;

      if (avatarFile) {
        avatarUrl = await uploadAsset(avatarFile, `profile/avatar.${avatarFile.name.split(".").pop() || "png"}`);
      }

      if (backgroundFile) {
        backgroundUrl = await uploadAsset(backgroundFile, `backgrounds/background.${backgroundFile.name.split(".").pop() || "png"}`);
      }

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: profile.id,
          full_name: profile.full_name,
          student_id: profile.student_id,
          class_name: profile.class_name,
          course_name: profile.course_name,
          intro_text: profile.intro_text,
          avatar_url: avatarUrl,
          background_url: backgroundUrl,
        },
        { onConflict: "id" },
      );

      if (profileError) {
        throw profileError;
      }

      const preparedAssignments = await Promise.all(
        assignments.map(async (item) => {
          const selectedFile = assignmentFiles[item.week_number];
          let pdfUrl = item.pdf_url;

          if (selectedFile) {
            pdfUrl = await uploadAsset(selectedFile, `assignments/week-${item.week_number}.pdf`);
          }

          return {
            week_number: item.week_number,
            title: item.title,
            description: item.description,
            pdf_url: pdfUrl,
          };
        }),
      );

      const { error: assignmentError } = await supabase.from("assignments").upsert(preparedAssignments, {
        onConflict: "week_number",
      });

      if (assignmentError) {
        throw assignmentError;
      }

      setProfile({ ...profile, avatar_url: avatarUrl, background_url: backgroundUrl });
      setAssignments(preparedAssignments);
      setAvatarFile(null);
      setBackgroundFile(null);
      setAssignmentFiles({});
      setMessage("Đã lưu xong hồ sơ và 7 bài tập.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể lưu dữ liệu";
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />
      {!unlocked ? (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
          <section className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-glass backdrop-blur-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Admin access</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Nhập mã để vào trang admin</h1>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Mỗi lần mở <span className="font-semibold text-slate-900">/admin</span> sẽ cần nhập đúng mã <span className="font-semibold text-slate-900">@portfolio-uet</span> trước khi chỉnh sửa dữ liệu.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleUnlock}>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mã đăng nhập</span>
                <input
                  autoFocus
                  value={accessCode}
                  onChange={(event) => setAccessCode(event.target.value)}
                  type="password"
                  placeholder="Nhập mã @portfolio-uet"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-sky-400"
                />
              </label>

              {authError ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{authError}</p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
                  <LockKeyhole className="h-4 w-4" />
                  Mở khóa
                </button>
                <button type="button" onClick={handleRetry} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                  <RotateCcw className="h-4 w-4" />
                  Nhập lại
                </button>
              </div>
            </form>
          </section>
        </main>
      ) : (
      <main className="min-h-screen px-4 pb-16 pt-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-glass backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Trang quản trị</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Tải ảnh, nền và 7 bài tập lên Supabase</h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                <Sparkles className="h-4 w-4 text-sky-600" />
                {loading ? "Đang đồng bộ" : "Sẵn sàng chỉnh sửa"}
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{message}</p>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-950">
                  <ImageIcon className="h-5 w-5 text-sky-600" />
                  <h2 className="text-lg font-bold">Thông tin hồ sơ</h2>
                </div>

                <div className="mt-4 space-y-4">
                  <Field label="Họ và tên">
                    <input value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400" />
                  </Field>
                  <Field label="Mã số sinh viên">
                    <input value={profile.student_id} onChange={(event) => setProfile({ ...profile, student_id: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400" />
                  </Field>
                  <Field label="Lớp hành chính">
                    <input value={profile.class_name} onChange={(event) => setProfile({ ...profile, class_name: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400" />
                  </Field>
                  <Field label="Học phần">
                    <input value={profile.course_name} onChange={(event) => setProfile({ ...profile, course_name: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400" />
                  </Field>
                  <Field label="Giới thiệu ngắn">
                    <textarea rows={5} value={profile.intro_text} onChange={(event) => setProfile({ ...profile, intro_text: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400" />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ảnh chân dung dọc">
                      <input type="file" accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800" />
                    </Field>
                    <Field label="Ảnh nền tùy chọn">
                      <input type="file" accept="image/*" onChange={(event) => setBackgroundFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800" />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-950">
                  <FileDown className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-bold">7 bài tập</h2>
                </div>

                <div className="mt-4 space-y-4">
                  {assignments.map((item, index) => (
                    <div key={item.week_number} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold text-slate-950">Tuần {item.week_number}</h3>
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">#{item.week_number}</span>
                      </div>
                      <div className="mt-3 space-y-3">
                        <input value={item.title} onChange={(event) => setAssignments((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, title: event.target.value } : row))} placeholder="Tiêu đề bài tập" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400" />
                        <textarea rows={3} value={item.description} onChange={(event) => setAssignments((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, description: event.target.value } : row))} placeholder="Mô tả ngắn" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400" />
                        <input type="file" accept="application/pdf" onChange={(event) => setAssignmentFiles((current) => ({ ...current, [item.week_number]: event.target.files?.[0] ?? null }))} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800" />
                        {assignmentFiles[item.week_number] ? (
                          <p className="text-xs font-medium text-sky-700">
                            File đã chọn: {assignmentFiles[item.week_number]?.name}
                          </p>
                        ) : null}
                        {item.pdf_url ? (
                          <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900">
                            <ArrowUpRight className="h-4 w-4" />
                            Xem PDF đã lưu
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={handleSaveAll} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu hồ sơ và 7 bài tập"}
              </button>
              <p className="flex items-center text-sm text-slate-500">
                Upload sẽ dùng bucket public <span className="mx-1 font-semibold text-slate-700">portfolio-assets</span>.
              </p>
            </div>
          </section>
        </div>
      </main>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}
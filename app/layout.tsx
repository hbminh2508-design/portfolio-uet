import "./globals.css";

export const metadata = {
  title: "Portfolio cá nhân",
  description: "Trang CV cá nhân và 7 bài tập đồng bộ với Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] m-0 p-0 overflow-x-hidden md:overflow-hidden">
        <div className="relative z-10 pt-28 sm:pt-32 md:h-screen md:pt-[7.25rem]">{children}</div>
      </body>
    </html>
  );
}
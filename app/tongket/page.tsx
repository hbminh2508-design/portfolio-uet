import Navbar from "@/components/Navbar";

export const revalidate = 60;

export default function SummaryPage() {
  return (
    <>
      <Navbar />
      {/* Đã tăng pt-2 sm:pt-4 lên pt-24 sm:pt-28 giống trang bài tập để tránh bị vướng vào navbar */}
      <main className="min-h-screen px-4 pb-12 pt-24 sm:pt-28 bg-slate-50/50">
        <div className="mx-auto w-full max-w-5xl">
          {/* Loại bỏ md:max-h để khối nội dung không bị giới hạn chiều cao gây đứt gãy layout */}
          <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-glass">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Trang tổng kết</p>
              <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-[2rem]">Trải Nghiệm & Cảm Nhận Dự Án</h1>
              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
                Đây là nơi lưu lại tổng quan về quá trình thực hiện portfolio, các kỹ năng đã tiếp thu và những điều tâm đắc nhất trong học phần.
              </p>
            </div>

            <div className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-3">
              <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3.5 lg:col-span-2">
                <h2 className="text-base font-bold text-slate-950 sm:text-lg">Kiến thức & Kỹ năng cốt lõi học được</h2>
                {/* Thay đổi hiển thị dấu chấm tròn mặc định thành gạch ngang */}
                <ul className="mt-2.5 space-y-2 text-sm leading-5 text-slate-600 list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">—</span>
                    <div><strong>Quản lý & Tối ưu dữ liệu:</strong> Thành thạo các thao tác tổ chức tệp tin khoa học và khai thác cơ sở dữ liệu động đám mây thông qua Supabase SQL Editor và Storage.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">—</span>
                    <div><strong>Tư duy AI & Làm việc trực tuyến:</strong> Nâng cao kỹ năng viết Prompt tối ưu để phân tích tài liệu và phối hợp làm việc nhóm hiệu quả qua nền tảng đám mây.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">—</span>
                    <div><strong>Kỹ thuật Frontend:</strong> Làm quen với Next.js, TypeScript và Tailwind CSS để hiện thực hóa ngôn ngữ thiết kế.</div>
                  </li>
                </ul>
              </article>

              <aside className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3.5">
                <h2 className="text-base font-bold text-slate-950 sm:text-lg">Mục tiêu của portfolio</h2>
                <p className="mt-2.5 text-sm leading-5 text-slate-600">
                  Thể hiện được các kỹ năng đã tiếp thu sau khi kết thúc học phần và giữ lại làm nơi để lưu trữ, chia sẻ các kiến thức đã được học.
                </p>
              </aside>

              <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3.5 lg:col-span-3">
                <h2 className="text-base font-bold text-slate-950 sm:text-lg">Điểm tâm đắc nhất</h2>
                <div className="mt-2.5 grid gap-2.5 text-sm leading-5 text-slate-600 lg:grid-cols-2">
                  <p>
                    <strong>Tư duy cộng tác với AI:</strong> Thay vì coi AI là một công cụ tra cứu thông thường, tôi tâm đắc nhất là đã học được cách biến AI thành một "cộng sự" đồng hành. Từ việc viết Prompt hệ thống để phân tích tài liệu PDF phức tạp, trích xuất định lý, cho đến việc dùng AI tối ưu hóa mã nguồn giao diện Liquid Glass và gỡ lỗi (debug) hệ thống.
                  </p>
                  <p>
                    <strong>Khai thác máy tính độc đáo hơn:</strong> Dự án này đã thay đổi hoàn toàn cách tôi sử dụng máy tính hàng ngày. Tôi không còn làm việc cục bộ trên máy tính cá nhân theo cách truyền thống, mà đã chuyển dịch toàn bộ quy trình lên đám mây (Cloud): lập trình trên máy ảo GitHub Codespaces, quản lý tệp tin và dữ liệu động qua Supabase, và cấu hình tự động đưa sản phẩm lên internet thông qua Vercel.
                  </p>
                </div>
              </article>

              <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3.5 lg:col-span-3">
                <h2 className="text-base font-bold text-slate-950 sm:text-lg">Thách thức đã vượt qua</h2>
                {/* Thay đổi hiển thị dấu chấm tròn mặc định thành gạch ngang */}
                <ul className="mt-2.5 space-y-2 text-sm leading-5 text-slate-600 list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">—</span>
                    <div><strong>Áp lực công việc & Công cụ mới:</strong> Khối lượng công việc lớn trong thời gian ngắn, cần thích nghi và làm chủ nhiều công cụ, nền tảng mới.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">—</span>
                    <div><strong>Tích hợp hệ thống:</strong> Kết nối GitHub Codespaces, Supabase và Vercel đòi hỏi sự tỉ mỉ để đảm bảo ứng dụng vận hành đồng bộ và an toàn.</div>
                  </li>
                </ul>
              </article>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
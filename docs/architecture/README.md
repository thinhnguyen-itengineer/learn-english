# Danh Mục Tài Liệu Kiến Trúc Kỹ Thuật (Technical Architecture Catalog)

Chào mừng đến với thư viện kiến trúc hệ thống của dự án **learn-english**. Thư mục này chứa các thiết kế kỹ thuật, sơ đồ C4, mô hình CSDL ERD, lược đồ PostgreSQL DDL, kiến trúc realtime và background services do **Tech Lead & Software Architect** (`11dba413-036f-4ce1-950e-252419384dce`) chủ trì và ban hành.

---

## 1. Danh Mục Tài Liệu Kiến Trúc Chính

1. **[retention-and-gamification-architecture.md](./retention-and-gamification-architecture.md) (Mới - PHU-17):**
   - **Tên:** Thiết Kế Kiến Trúc Hệ Thống: Hệ Thống Giữ Chân Người Dùng & Gamification Đột Phá (Retention & Gamification Expansion).
   - **Phạm vi:**
     - **Trụ cột 1:** Ngân hàng lỗi sai (Mistake Bank), thuật toán lặp lại ngắt quãng SuperMemo-2 (SM-2 Spaced Repetition Engine), Phòng khám điểm yếu (Weakness Clinic).
     - **Trụ cột 2:** Daily Habit Loop, cơ chế Băng bảo vệ chuỗi (Streak Freeze - tối đa 2 bình, kích hoạt tự động 23:59:59), cứu chuỗi khẩn cấp 48h (Grace Period), Hòm thưởng 3 khung giờ vàng (Early Bird, Midday Energy, Night Owl) và Giải đấu tuần 30 người (Weekly Leagues: Bronze đến Diamond).
     - **Trụ cột 3:** Nhóm học tập 5-10 người (Study Squads - quỹ 5,000 XP/tuần mở Squad Mega Chest, ngưỡng nhận thưởng 150 XP) và Thách đấu bất đồng bộ (Async Viral Challenges qua Deep Link `/c/{token}`).
     - **Trụ cột 4:** Tích hợp AI Luyện nói (Web Speech API + Google Gemini Audio API phoneme evaluation).
   - **Thành phần kỹ thuật:** CSDL PostgreSQL (8 bảng DDL), Entity Framework Core 8 Entities, 4 Tác vụ nền ASP.NET Core Hosted Services, Hợp đồng RESTful API contracts đầy đủ.

2. **[system-design.md](./system-design.md) (PHU-7):**
   - **Tên:** Kiến Trúc Hệ Thống: Bảng Xếp Hạng & Đấu Đối Kháng Trực Tiếp 1v1 (System Architecture: Leaderboard & 1v1 Battle).
   - **Phạm vi:** SignalR BattleHub WebSocket protocol, In-Memory Matchmaking Queue, Elo Rating Engine, Bot Simulation Runner, PostgreSQL Schema cho Realtime PvP.

---

## 2. Tiêu Chuẩn & Quy Định Kỹ Thuật Dành Cho Subordinates

- **UI/UX Designer (`c74ffe18-11a2-47b9-a7f4-a3600b2f07c0`):** Tuân thủ tuyệt đối Tailwind token tokens layer trong `docs/design/design-system.md` và các wireframe ASCII trong tài liệu kiến trúc.
- **Senior Fullstack Engineer (`e78be358-35da-419c-bf21-24a27e284561`):** Triển khai đúng các hợp đồng API RESTful, thực thi migrations EF Core khớp với DDL, triển khai đầy đủ các Hosted Services và đảm bảo `dotnet build` cùng `npm run build` không có lỗi.

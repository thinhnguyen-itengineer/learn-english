# Nền Tảng Học Tiếng Anh Qua Mini-game (LearnEnglish Go)

Ứng dụng web học tiếng Anh hoàn toàn miễn phí, tăng cường khả năng ghi nhớ và phản xạ từ vựng - ngữ pháp qua 3 mini-game cốt lõi với hệ thống Gamification (XP, Daily Streak, Combo Multiplier, Badges, Weekly Leaderboard).

---

## 1. Công Nghệ Sử Dụng (Tech Stack)

- **Backend:** 
  - .NET 8 Web API (C#)
  - Entity Framework Core 8
  - Npgsql (PostgreSQL 16) & SQLite Auto-Dev Fallback
  - JWT Bearer Authentication (Guest Onboarding & Profile)
  - Swagger / OpenAPI RFC 7807 Problem Details
- **Frontend:**
  - React 19 + TypeScript + Vite
  - Tailwind CSS v4 + Lucide Icons + Canvas Confetti
  - Web Audio API Sound Synthesizer & SpeechSynthesis (TTS phát âm chuẩn)
- **Database:** PostgreSQL 16+ (hỗ trợ Docker Compose)

---

## 2. Cấu Trúc Dự Án (Project Structure)

```text
learn-english/
├── backend/
│   ├── LearnEnglish.slnx                 # .NET Solution file
│   └── src/LearnEnglish.Api/
│       ├── Controllers/                  # Auth, Topics, Games, Leaderboard
│       ├── Data/                         # AppDbContext, DataSeeder, Migrations
│       ├── Domain/                       # Entities (User, Topic, Word, Sentence, GameSession) & Enums
│       ├── DTOs/                         # Request / Response Models
│       ├── Services/                     # GameService, TokenService
│       ├── appsettings.json
│       ├── Dockerfile
│       └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── components/                   # Navbar, Lobby, 3 Games, Modals
│   │   ├── services/                     # API Client (Fetch + JWT Auth)
│   │   ├── types/                        # TypeScript Interfaces
│   │   ├── utils/                        # Web Audio Sound & TTS helpers
│   │   ├── App.tsx
│   │   └── index.css                     # Tailwind CSS v4 & Game Animations
│   ├── Dockerfile
│   └── vite.config.ts
├── docs/spec/                            # Đặc tả BA (Chức năng, Game rules, Reward, Data models, API)
└── docker-compose.yml                    # Khởi chạy toàn bộ hệ thống Postgres + Backend + Frontend
```

---

## 3. Ba Mini-game Trải Nghiệm

1. **Word Match (Ghép Thẻ Từ Vựng & Nghĩa):**
   - Lưới thẻ từ vựng Tiếng Anh và nghĩa Tiếng Việt tương ứng.
   - Thưởng +2s đếm ngược khi ghép đúng, hệ số nhân chuỗi combo lên đến x2.0.
   - Cơ chế khóa 500ms khi lật sai và rung thẻ phản hồi visual.
2. **Speed Falling Word (Từ Rơi Thần Tốc):**
   - Từ vựng rơi từ trên xuống với tốc độ gia tăng theo từng wave.
   - Hệ thống 3 mạng sống (Hearts), chọn nghĩa đúng qua bàn phím (1-4) hoặc chuột/cảm ứng trước khi chạm vạch đáy.
   - Điểm số cộng thêm khi bắt chữ ở độ cao lớn.
3. **Sentence Scramble (Xếp Câu Hoàn Chỉnh):**
   - Đọc câu tiếng Việt và sắp xếp các thẻ từ xáo trộn vào ô dropzone thành câu tiếng Anh đúng ngữ pháp.
   - Hỗ trợ gợi ý thông minh Hint và phát âm tiếng Anh chuẩn bản ngữ qua Text-to-Speech.

---

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Chạy bằng Docker Compose (Khuyến nghị production/test)

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`
- PostgreSQL: `localhost:5432`

---

### Cách 2: Chạy trực tiếp trên máy phát triển (Dev Mode)

Hệ thống được thiết kế thông minh với cơ chế **Auto-Detect Database**:
- Nếu PostgreSQL đang chạy tại port 5432, backend tự động kết nối PostgreSQL.
- Nếu không có PostgreSQL, backend tự động dùng SQLite (`learnenglish.db`) và seed dữ liệu mẫu đầy đủ để chạy ngay lập tức mà không cần cài thêm phần mềm nào khác!

#### 1. Khởi chạy Backend (.NET 8):
```bash
cd backend
dotnet run --project src/LearnEnglish.Api/LearnEnglish.Api.csproj
```
Backend lắng nghe tại: `http://localhost:5000` (Swagger: `http://localhost:5000/swagger`)

#### 2. Khởi chạy Frontend (React + Vite):
```bash
cd frontend
pnpm install
pnpm dev
```
Frontend lắng nghe tại: `http://localhost:3000` (tự động proxy API sang `http://localhost:5000`)

---

## 5. Danh Mục REST API Endpoints Chính

- `POST /api/v1/auth/guest`: Khởi tạo tài khoản khách và cấp JWT Bearer Token.
- `GET /api/v1/users/me/profile`: Lấy thông tin cấp độ (Level), chuỗi Streak, tổng XP và thẻ bảo lưu.
- `GET /api/v1/topics`: Lấy danh sách các chủ đề từ vựng (Daily Routines, Tech & Coding, Travel & Food...).
- `POST /api/v1/games/start`: Bắt đầu ván chơi cho một trong 3 mini-game (`WordMatch`, `SpeedFalling`, `SentenceScramble`).
- `POST /api/v1/games/session/complete`: Nộp kết quả ván chơi, xác thực tính điểm, cập nhật Daily Streak, thăng cấp Level và mở khóa Huy hiệu.
- `GET /api/v1/leaderboard/weekly`: Bảng xếp hạng tuần của người học.

---

## 6. Kiểm Thử & Biên Dịch (Verification)

- Kiểm tra biên dịch Backend:
  ```bash
  dotnet build backend/src/LearnEnglish.Api/LearnEnglish.Api.csproj
  ```
  *(Kết quả: 0 Warning, 0 Error)*

- Kiểm tra biên dịch Frontend:
  ```bash
  cd frontend && pnpm run build
  ```
  *(Kết quả: Vite + TypeScript build thành công 100%)*
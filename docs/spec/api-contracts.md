# Đặc Tả Hợp Đồng REST API (API Contracts & Endpoints)

Tài liệu này định nghĩa chi tiết toàn bộ các RESTful API endpoints, định dạng dữ liệu truyền tải (Request / Response JSON Payload), mã trạng thái HTTP (Status Codes) và cơ chế bảo mật cho hệ thống học tiếng Anh qua mini-game.

---

## 1. Nguyên Tắc Thiết Kế API

- **Base URL:** `/api/v1`
- **Định dạng dữ liệu:** Chuẩn `application/json; charset=utf-8`.
- **Cơ chế xác thực (Authentication):**
  - Sử dụng JWT Bearer Token đặt tại Header: `Authorization: Bearer <access_token>`.
  - Hỗ trợ tài khoản khách (Guest Session) bằng cách cấp token ẩn danh ngay khi mở web mà không cần đăng ký.
- **Chuẩn báo lỗi (Error Handling):** Tuân thủ tiêu chuẩn RFC 7807 (Problem Details for HTTP APIs):
  ```json
  {
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "Bad Request",
    "status": 400,
    "detail": "SessionId không hợp lệ hoặc ván chơi đã kết thúc trước đó.",
    "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00"
  }
  ```

---

## 2. Nhóm API Xác Thực & Tài Khoản (Authentication & User)

### 2.1. Đăng ký phiên Khách (Guest Onboarding)
Khởi tạo ngay lập tức tài khoản khách để người dùng trải nghiệm game không rào cản.
- **Endpoint:** `POST /api/v1/auth/guest`
- **Request Body:** Không có.
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-10-28T21:00:00Z",
    "user": {
      "id": "c1f1a58b-9e23-45c1-872f-5b89c3140a01",
      "username": "guest_892314",
      "displayName": "Người học mới #8923",
      "isGuest": true,
      "totalXp": 0,
      "currentLevel": 1,
      "currentStreak": 0
    }
  }
  ```

### 2.2. Lấy thông tin Hồ sơ & Tiến trình
- **Endpoint:** `GET /api/v1/users/me/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "userId": "c1f1a58b-9e23-45c1-872f-5b89c3140a01",
    "username": "thinhnguyen",
    "displayName": "Thịnh Nguyễn",
    "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=thinh",
    "totalXp": 2450,
    "currentLevel": 8,
    "currentLevelXp": 450,
    "nextLevelXp": 800,
    "currentStreak": 5,
    "highestStreak": 14,
    "streakFreezeCount": 1,
    "dailyXpEarned": 180,
    "dailyXpCap": 1000
  }
  ```

---

## 3. Nhóm API Chủ Đề & Dữ Liệu Học (Topics & Content)

### 3.1. Lấy danh sách Chủ đề có sẵn
- **Endpoint:** `GET /api/v1/topics`
- **Query Parameters:**
  - `difficulty`: `Easy` | `Medium` | `Hard` (tùy chọn)
- **Response (200 OK):**
  ```json
  [
    {
      "id": "e4a2d810-75b2-4d2c-9821-2a62d49c0012",
      "name": "Daily Routines (Thói quen hàng ngày)",
      "slug": "daily-routines",
      "description": "Các từ vựng và câu thường gặp về sinh hoạt thường nhật",
      "iconName": "Sun",
      "difficultyLevel": "Easy",
      "wordCount": 35,
      "sentenceCount": 15
    },
    {
      "id": "f5b3e921-86c3-5e3d-0932-3b73e50d1123",
      "name": "Technology & Coding",
      "slug": "tech-coding",
      "description": "Thuật ngữ tiếng Anh chuyên ngành công nghệ thông tin",
      "iconName": "Cpu",
      "difficultyLevel": "Medium",
      "wordCount": 42,
      "sentenceCount": 20
    }
  ]
  ```

---

## 4. Nhóm API Điều Khiển Ván Chơi (Game Engine APIs)

### 4.1. Khởi tạo ván chơi Mini-game (Start Game Session)
- **Endpoint:** `POST /api/v1/games/start`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "gameType": "WordMatch",
    "topicId": "e4a2d810-75b2-4d2c-9821-2a62d49c0012",
    "difficultyLevel": "Medium"
  }
  ```
- **Response (200 OK) đối với Word Match:**
  ```json
  {
    "sessionId": "a823f091-bb21-4f92-9118-f2b1897c5512",
    "gameType": "WordMatch",
    "timeLimitSeconds": 60,
    "cards": [
      {
        "id": "c1",
        "pairId": "pair_01",
        "type": "EN",
        "content": "Breakfast",
        "subContent": "/ˈbrek.fəst/"
      },
      {
        "id": "c2",
        "pairId": "pair_01",
        "type": "VI",
        "content": "Bữa ăn sáng",
        "subContent": null
      },
      {
        "id": "c3",
        "pairId": "pair_02",
        "type": "EN",
        "content": "Exercise",
        "subContent": "/ˈek.sə.saɪz/"
      },
      {
        "id": "c4",
        "pairId": "pair_02",
        "type": "VI",
        "content": "Tập thể dục",
        "subContent": null
      }
    ]
  }
  ```

- **Response (200 OK) đối với Speed Falling Word:**
  ```json
  {
    "sessionId": "b934012a-cc32-50a3-a229-03c2908d6623",
    "gameType": "SpeedFalling",
    "initialLives": 3,
    "words": [
      {
        "wordId": "w1",
        "term": "Challenge",
        "phonetic": "/ˈtʃæl.ɪndʒ/",
        "correctDefinitionVi": "Thử thách",
        "options": ["Thử thách", "Thành công", "Thất bại", "Cơ hội"],
        "baseFallDurationMs": 5000
      }
    ]
  }
  ```

- **Response (200 OK) đối với Sentence Scramble:**
  ```json
  {
    "sessionId": "ca45123b-dd43-61b4-b330-14d3019e7734",
    "gameType": "SentenceScramble",
    "totalTimeLimitSeconds": 180,
    "sentences": [
      {
        "sentenceId": "s1",
        "vietnameseTranslation": "Cô ấy bắt đầu học tiếng Anh cách đây 2 năm.",
        "shuffledTokens": [
          {"id": "t1", "word": "English"},
          {"id": "t2", "word": "She"},
          {"id": "t3", "word": "two"},
          {"id": "t4", "word": "years"},
          {"id": "t5", "word": "started"},
          {"id": "t6", "word": "learning"},
          {"id": "t7", "word": "ago"}
        ],
        "correctOrderTokens": ["She", "started", "learning", "English", "two", "years", "ago"],
        "hintText": "Bắt đầu bằng đại từ nhân xưng 'She'"
      }
    ]
  }
  ```

### 4.2. Hoàn thành và Gửi kết quả ván chơi (Complete Session)
Backend sẽ kiểm tra tính hợp lệ của thời gian chơi và tỷ lệ điểm để ngăn chặn gian lận, sau đó tính toán XP và cập nhật Streak.
- **Endpoint:** `POST /api/v1/games/session/complete`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "sessionId": "a823f091-bb21-4f92-9118-f2b1897c5512",
    "score": 850,
    "durationSeconds": 48,
    "totalAttempts": 14,
    "correctAnswers": 12,
    "maxCombo": 6,
    "status": "Completed"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "sessionId": "a823f091-bb21-4f92-9118-f2b1897c5512",
    "score": 850,
    "xpEarned": 95,
    "accuracyRate": 85.71,
    "isNewLevel": true,
    "newLevel": 9,
    "totalXp": 2545,
    "currentStreak": 6,
    "streakIncrementedToday": true,
    "unlockedBadges": [
      {
        "badgeCode": "COMBO_MASTER_5",
        "badgeName": "Bậc thầy Combo",
        "description": "Đạt chuỗi combo từ 5 trở lên trong Word Match",
        "iconUrl": "/badges/combo-5.svg"
      }
    ]
  }
  ```

---

## 5. Nhóm API Bảng Xếp Hạng (Leaderboard)

### 5.1. Bảng Xếp Hạng Tuần (Weekly XP)
- **Endpoint:** `GET /api/v1/leaderboard/weekly`
- **Query Parameters:** `limit=50&offset=0`
- **Response (200 OK):**
  ```json
  {
    "totalParticipants": 1420,
    "myRank": {
      "rank": 4,
      "displayName": "Thịnh Nguyễn",
      "weeklyXp": 1250,
      "currentLevel": 9,
      "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=thinh"
    },
    "topRankings": [
      {
        "rank": 1,
        "displayName": "Alex Tran",
        "weeklyXp": 2840,
        "currentLevel": 15,
        "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=alex"
      },
      {
        "rank": 2,
        "displayName": "Minh Vu",
        "weeklyXp": 2100,
        "currentLevel": 12,
        "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=minh"
      },
      {
        "rank": 3,
        "displayName": "Sarah Connor",
        "weeklyXp": 1950,
        "currentLevel": 11,
        "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=sarah"
      }
    ]
  }
  ```

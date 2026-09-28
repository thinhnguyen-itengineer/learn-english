# Đặc Tả Hệ Thống Điểm Thưởng, Cấp Độ & Giữ Chân Người Dùng (Reward & Retention System)

Hệ thống điểm thưởng (Gamification System) đóng vai trò trung tâm trong việc tạo động lực học tập, xây dựng thói quen hàng ngày và tối đa hóa tỷ lệ giữ chân người dùng (Retention Rate) trên nền tảng.

---

## 1. Hệ Thống Điểm Kinh Nghiệm (Experience Points - XP)

### 1.1. Công Thức Quy Đổi XP Từ Phiên Chơi
Mỗi phiên chơi mini-game sau khi kết thúc sẽ tính toán lượng XP thưởng dựa trên Điểm số thực tế (Raw Score), Tỷ lệ chính xác (Accuracy), và Bonus Hoàn thành:

$$\text{EarnedXP} = \left\lfloor \frac{\text{GameScore}}{10} \times \text{AccuracyFactor} \right\rfloor + \text{CompletionBonus}$$

Trong đó:
- $\text{GameScore}$: Điểm số đạt được trong game.
- $\text{AccuracyFactor} = \frac{\text{CorrectAnswers}}{\text{TotalAttempts}}$ (giá trị từ $0.0$ đến $1.0$).
- $\text{CompletionBonus}$:
  - Thắng màn chơi (Victory / Clear all): $+20\text{ XP}$.
  - Thua / Hết mạng (Defeat): $+5\text{ XP}$ (khuyến khích người học nỗ lực, không làm họ nản lòng).
- **Thưởng Chuỗi Combo (Streak Bonus):**
  - Nếu đạt chuỗi combo cao nhất $\ge 5$: $+5\text{ XP}$.
  - Nếu đạt chuỗi combo cao nhất $\ge 10$: $+15\text{ XP}$.
  - Nếu đạt chuỗi combo cao nhất $\ge 20$: $+30\text{ XP}$.

### 1.2. Giới Hạn XP Hàng Ngày (Daily XP Cap)
- Để ngăn chặn việc cày cuốc (bot/spam) quá mức và khuyến khích học đều đặn mỗi ngày, giới hạn tối đa là **$1000\text{ XP}$/ngày**.
- Khi đạt cap, người chơi vẫn có thể chơi game để luyện tập nhưng không nhận thêm XP vào hồ sơ.

---

## 2. Hệ Thống Cấp Độ & Danh Hiệu (Levels & Ranks)

### 2.1. Công Thức Tính Level Theo Tổng XP
Hệ thống sử dụng đường cong tăng trưởng bậc 2 để việc thăng cấp ở các level đầu nhanh chóng (tạo dopamine tích cực ban đầu), và thử thách dần ở các level cao hơn:

$$\text{RequiredXP}(\text{level}) = 100 \times \text{level}^{1.5}$$

Bảng quy đổi cấp bậc:
| Cấp Độ (Level) | XP Yêu Cầu Tích Lũy | Danh Hiệu (Rank Title) | Biểu Tượng / Badge |
| :--- | :--- | :--- | :--- |
| **1 - 5** | 0 - 1,118 XP | **Tân Binh (Novice Scout)** | Đồng (Bronze I - V) |
| **6 - 15** | 1,119 - 5,809 XP | **Người Khám Phá (Explorer)** | Bạc (Silver I - X) |
| **16 - 30** | 5,810 - 16,431 XP | **Học Giả (Scholar)** | Vàng (Gold I - XV) |
| **31 - 50** | 16,432 - 35,355 XP | **Bậc Thầy Từ Vựng (Word Master)** | Bạch Kim (Platinum) |
| **51+** | > 35,355 XP | **Huyền Thoại Ngôn Ngữ (Language Legend)** | Kim Cương (Diamond) |

### 2.2. Phần Thưởng Khi Lên Cấp (Level-Up Rewards)
- Màn hình popup chúc mừng hoành tráng kèm pháo hoa (Confetti Canvas).
- Tặng huy hiệu danh hiệu hiển thị bên cạnh Avatar cá nhân trên Bảng xếp hạng.
- Tặng 1 "Lượt Đóng Băng Streak" (Streak Freeze) miễn phí cho mỗi 5 level thăng hạng.

---

## 3. Cơ Chế Chuỗi Ngày Học (Daily Streak System)

### 3.1. Định Nghĩa & Quy Tắc Tính Streak
- **Điều kiện duy trì Streak:** Người dùng hoàn thành ít nhất $1$ phiên chơi (bất kỳ game nào) trong khung giờ $00:00:00$ đến $23:59:59$ (theo múi giờ địa phương của người dùng).
- Khi hoàn thành bài học đầu tiên trong ngày:
  - Nếu ngày hôm qua có học: `currentStreak = currentStreak + 1`.
  - Nếu ngày hôm qua không học và không có thẻ bảo lưu (Streak Freeze): `currentStreak = 1`.
  - Cập nhật `highestStreak = max(highestStreak, currentStreak)`.
- Hiển thị biểu tượng Ngọn Lửa rực cháy $\🔥$ kèm số ngày streak trên thanh điều hướng chính (Top Navbar).

### 3.2. Cơ Chế Bảo Vệ Chuỗi (Streak Freeze)
- Người dùng có thể sở hữu tối đa $2$ thẻ Streak Freeze dự trữ.
- Khi người dùng bỏ lỡ 1 ngày không đăng nhập:
  - Hệ thống tự động tiêu hao 1 thẻ Streak Freeze.
  - Chuỗi ngày học được giữ nguyên (không bị reset về 0).
  - Gửi thông báo nhắc nhở: *"Thẻ bảo lưu đã bảo vệ chuỗi học của bạn! Hãy học ngay hôm nay nhé."*

---

## 4. Hệ Thống Nhiệm Vụ Hàng Ngày (Daily Quests)

Mỗi ngày vào lúc $00:00$, hệ thống tự động sinh ra 3 nhiệm vụ ngẫu nhiên cho người dùng:

| Mã Nhiệm Vụ | Tên Nhiệm Vụ | Mục Tiêu | Phần Thưởng |
| :--- | :--- | :--- | :--- |
| `QUEST_PLAY_WORD_MATCH` | Nhà sưu tập từ | Chơi 2 ván Word Match | $+30\text{ XP}$ |
| `QUEST_SPEED_RECORD` | Phản xạ thần tốc | Đạt chuỗi 10 từ đúng trong Speed Falling | $+40\text{ XP}$ |
| `QUEST_SENTENCE_MASTER` | Bậc thầy ngữ pháp | Xếp hoàn chỉnh 3 câu không dùng Hint | $+50\text{ XP}$ |
| `QUEST_EARN_SCORE` | Thợ săn điểm số | Đạt tổng 1,500 điểm trong ngày | $+35\text{ XP}$ |
| `QUEST_DAILY_STREAK` | Chăm chỉ mỗi ngày | Hoàn thành bài học duy trì Streak | $+25\text{ XP}$ |

---

## 5. Màn Hình Tổng Kết Sau Màn Chơi (Post-Game Summary Modal)

Màn hình này xuất hiện ngay sau khi ván chơi kết thúc, được thiết kế để kích thích cảm giác thành tựu:

### 5.1. Các Thành Phần Giao Diện (UI Components)
1. **Banner Trạng Thái:**
   - Thắng cuộc: Biểu tượng Cúp vàng $\🏆$ + Tiêu đề *"Tuyệt vời! Hoàn thành xuất sắc!"* (Màu xanh Emerald).
   - Thua cuộc: Biểu tượng Cố gắng $\💪$ + Tiêu đề *"Rất tiếc! Hãy thử lại nào!"* (Màu cam Amber).
2. **Khối Thống Kê Chính (Key Stats Grid):**
   - **Điểm số (Score):** Hiệu ứng số chạy tăng dần từ 0 đến điểm thực tế (Counter animation).
   - **XP Nhận Được:** Khối nổi bật `+XX XP` màu tím/indigo.
   - **Độ chính xác (Accuracy):** Tỷ lệ phần trăm (ví dụ: $92\%$).
   - **Thời gian hoàn thành:** (ví dụ: $01:15$).
   - **Combo cao nhất:** (ví dụ: $x8$).
3. **Thanh Tiến Trình Level (Level Progress Bar):**
   - Hiển thị Cấp hiện tại (ví dụ: Lv. 4) -> Thanh XP chạy đầy và nếu đủ XP sẽ kích hoạt animation Level Up sang Lv. 5.
   - Hiển thị rõ số XP còn thiếu để đạt level kế tiếp (`350 / 500 XP`).
4. **Các Nút Hành Động (Action Buttons):**
   - Nút chính (Primary CTA): **"Chơi Lại" (Play Again)** - Nền xanh lam/indigo, có icon replay.
   - Nút phụ (Secondary): **"Chọn Game Khác" (Game Hub / Lobby)** - Nền xám/outline.
   - Nút chia sẻ: **"Chia sẻ điểm số"** (sao chép link thành tích hoặc khoe lên mạng xã hội).

---

## 6. Bảng Xếp Hạng (Leaderboard)

### 6.1. Phân Loại Bảng Xếp Hạng
1. **Bảng xếp hạng Tuần (Weekly Leaderboard):**
   - Đua top theo tổng số XP tích lũy từ thứ Hai $00:00$ đến Chủ nhật $23:59$ hàng tuần.
   - Reset điểm đua top vào mỗi sáng thứ Hai.
   - Top 1, 2, 3 được gắn khung viền đặc biệt (Gold, Silver, Bronze frame).
2. **Bảng xếp hạng Chuỗi ngày (Streak Leaderboard):**
   - Xếp hạng theo số ngày `currentStreak` cao nhất mọi thời đại.

### 6.2. Cấu Trúc Dữ Liệu Một Dòng Xếp Hạng (Leaderboard Row)
- Hạng (Rank: 1, 2, 3... kèm badge huy chương cho top 3).
- Avatar người dùng & Tên hiển thị (hoặc "Người dùng ẩn danh" nếu là Guest).
- Cấp độ hiện tại (Level & Rank Badge).
- Điểm thi đua (Tuần: Weekly XP, Streak: Số ngày liên tiếp).

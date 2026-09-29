# Hệ Thống Thiết Kế UI/UX: Leaderboard, 1v1 Battle & 3 Mini-Game Mới (Game Expansion Pack)
## Design System & Component Library Specification

**Tài liệu:** Đặc tả quy chuẩn giao diện người dùng, Tokens và Thư viện Component (Design System Specification)  
**Tác giả:** UI/UX Designer & Design Technologist (`c74ffe18-11a2-47b9-a7f4-a3600b2f07c0`)  
**Báo cáo cho:** Tech Lead & Software Architect (`11dba413-036f-4ce1-950e-252419384dce`)  
**Dự án:** learn-english (Paperclip Issues PHU-8 & PHU-11)  
**Phạm vi áp dụng:** Toàn bộ giao diện Gamified PvP 1v1, Bảng Xếp Hạng (Leaderboard), 3 Mini-Game Mở Rộng (Audio Blitz, Cloze Master, Grammar Detective) và Thư viện UI Component (`frontend/src/components/ui/`)  
**Tài liệu tham chiếu:** [`docs/spec/leaderboard-and-battle.md`](../spec/leaderboard-and-battle.md), [`docs/spec/new-minigames-specification.md`](../spec/new-minigames-specification.md) và [`docs/architecture/system-design.md`](../architecture/system-design.md)  

---

## 1. Triết Lý Thiết Kế Gamification (Design Philosophy)

Hệ thống giao diện được định hướng theo triết lý **Gamification Đậm Chất Năng Động (Vibrant, Tactile & Rewarding)**, lấy cảm hứng từ các ứng dụng giáo dục và game hàng đầu thế giới (Duolingo, Brawl Stars, Clash Royale):

1. **Phản Hồi Xúc Giác Đậm Nét (Tactile 3D Depth):**  
   - Các nút bấm (Buttons) và thẻ bài (Cards) đều có cạnh vát đáy 3D nổi (`box-shadow: 0 4px 0`, `0 6px 0`). Khi nhấn chuột/chạm ngón tay, phần tử lún xuống tự nhiên (`translate-y-[3px]` kèm triệt tiêu shadow), tạo cảm giác bấm phím cơ học chân thực.
2. **Kích Thích Dopamine & Tôn Vinh Thành Tích (Reward & Celebration):**  
   - Mọi khoảnh khắc thành công (ghép đúng từ, chuỗi combo $\ge 3$, chiến thắng trận đấu, thăng hạng Tier mới) đều được tôn vinh bằng hiệu ứng hình ảnh bùng nổ: pháo hoa Confetti, số nhảy counter ticker, vệt sáng lấp lánh (shimmer) và sóng năng lượng xung kích (pulse-glow).
3. **Phân Cấp Thị Giác Rõ Ràng Cho Trận Đấu Tốc Độ Cao (Clarity Under Pressure):**  
   - Trong chế độ thi đấu 60 giây nghẹt thở, người chơi không được phép bị phân tâm bởi các chi tiết thừa. Hai luồng thông tin quan trọng nhất là **Thời gian còn lại** và **Tương quan tiến độ giữa Người chơi vs Đối thủ** được đặt ở vị trí trung tâm, trực quan với màu sắc tương phản mạnh mẽ (Xanh ngọc Emerald vs Tím neon Cosmic / Cam rực lửa).
4. **Tối Ưu Mobile-First & Responsive Hoàn Hảo:**  
   - Đảm bảo trải nghiệm chạm mượt mà trên màn hình di động (tối thiểu 48x48px cho vùng chạm ngón tay) và mở rộng linh hoạt trên màn hình Desktop/Tablet mà không vỡ bố cục.

---

## 2. Bảng Màu Thiết Kế & Tokens (Color Tokens & Rank Tiers)

### 2.1. Bảng Màu 6 Bậc Rank (Rank Tier Tokens)

Mỗi bậc xếp hạng sở hữu một nhận diện màu sắc đặc trưng, biểu trưng cho đẳng cấp và sự tôi luyện của chiến binh:

| Bậc Rank | Tên Quốc Tế | Dải Trophy | Mã Màu Chủ Đạo | Background & Border Token | Text Token & Glow Effect |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Đồng** | Bronze | 0 - 999 | Hổ phách cổ điển (`#b45309`) | `bg-amber-950/40 border-amber-600/60` | `text-amber-400 shadow-amber-600/20` |
| **Bạc** | Silver | 1,000 - 1,999 | Ánh bạc kim loại (`#94a3b8`) | `bg-slate-900/60 border-slate-400/60` | `text-slate-200 shadow-slate-400/20` |
| **Vàng** | Gold | 2,000 - 2,999 | Hoàng kim lấp lánh (`#eab308`) | `bg-yellow-950/40 border-yellow-500/80` | `text-yellow-300 shadow-yellow-500/30` |
| **Bạch Kim** | Platinum | 3,000 - 3,999 | Lục lam điện quang (`#06b6d4`) | `bg-cyan-950/40 border-cyan-400/80` | `text-cyan-300 shadow-cyan-400/35` |
| **Kim Cương**| Diamond | 4,000 - 4,999 | Lam ngọc huyền ảo (`#3b82f6`) | `bg-blue-950/50 border-blue-500/90` | `text-blue-300 shadow-blue-500/40` |
| **Cao Thủ** | Master | 5,000+ | Tử sắc vũ trụ (`#a855f7`) | `bg-purple-950/60 border-purple-500` | `text-purple-300 shadow-purple-500/50 animate-pulse` |

### 2.2. Bảng Màu Hành Động & Phản Hồi Trạng Thái (Action & Semantic Tokens)

- **Xanh Ngọc Chiến Thắng (Emerald Success):**  
  - Nền/Nút: `#10b981` (Emerald 500) | Viền 3D: `#047857` (Emerald 700) | Glow: `rgba(16, 185, 129, 0.4)`  
  - Ứng dụng: Ghép đúng cặp từ, nút "Chiến Đấu", thanh tiến trình người chơi, banner Chiến Thắng.
- **Đỏ Thách Thức / Sai Lầm (Rose / Ruby Danger):**  
  - Nền/Nút: `#ef4444` (Red 500) | Viền 3D: `#b91c1c` (Red 700) | Glow: `rgba(239, 68, 68, 0.4)`  
  - Ứng dụng: Báo sai từ vựng, thời gian dưới 10s (Time Critical), nút Hủy tìm trận, banner Thất Bại.
- **Cam Rực Lửa / Chuỗi Thắng (Flame Amber / Streak):**  
  - Nền/Huy hiệu: `#f97316` (Orange 500) | Viền 3D: `#c2410c` (Orange 700)  
  - Ứng dụng: Huy hiệu Chuỗi Thắng (Win Streak 🔥), Combo Multiplier (x2, x3, x4), tiến độ đối thủ.
- **Tím Cosmic Đối Thủ (Cosmic Purple / Ghost):**  
  - Nền/Thanh: `#8b5cf6` (Purple 500) | Viền 3D: `#6d28d9` (Purple 700)  
  - Ứng dụng: Thanh tiến trình đối thủ (Ghost bar), avatar đối phương, hiệu ứng đối đầu 1v1.
- **Xanh Biển Năng Lượng (Energy Azure / Blue):**  
  - Nền/Nút: `#3b82f6` (Blue 500) | Viền 3D: `#1d4ed8` (Blue 700)  
  - Ứng dụng: Nút hành động phụ, thông tin mùa giải, hiệu ứng khiên bảo vệ (Protection Shield).

---

## 3. Hệ Thống Typography & Thang Đo Chữ (Typography Scale)

| Phân Loại | Kích Cỡ / Line Height | Trọng Số (Font Weight) | Ứng Dụng Thực Tế |
| :--- | :--- | :--- | :--- |
| **Display Mega** | `text-4xl md:text-6xl` (40px - 60px) | `font-black` (Weight 900) | Đồng hồ đếm ngược 3.. 2.. 1.., Chữ "VS", Điểm thắng lớn |
| **Display Timer**| `text-3xl md:text-4xl` (30px - 36px) | `font-extrabold font-mono` | Đồng hồ 60s thi đấu, Điểm số trận đấu |
| **Title H1** | `text-2xl md:text-3xl` (24px - 30px) | `font-bold` (Weight 700) | Tiêu đề Bảng Xếp Hạng, Banner Chiến Thắng / Thất Bại |
| **Title H2** | `text-xl md:text-2xl` (20px - 24px) | `font-bold` (Weight 700) | Tên người chơi trong trận, Tên Bậc Rank |
| **Title H3** | `text-lg md:text-xl` (18px - 20px) | `font-semibold` (Weight 600) | Tiêu đề Thẻ, Tên phân hạng Division (Gold I) |
| **Body Base** | `text-sm md:text-base` (14px - 16px) | `font-medium` (Weight 500) | Từ vựng trên thẻ bài, Mô tả quy tắc, Dòng bảng xếp hạng |
| **Caption Small**| `text-xs md:text-sm` (12px - 14px) | `font-semibold` (Weight 600) | Tỷ lệ thắng %, Số trận đã đấu, Tag phân loại chủ đề |
| **Micro Badge** | `text-[10px] md:text-xs` (10px - 12px)| `font-bold uppercase tracking-wider` | Nhãn EN / VI trên thẻ, Khiên bảo vệ, Huy hiệu chuỗi |

---

## 4. Đặc Tả Bố Cục Thẻ & Màn Hình (Layout & Wireframes)

### 4.1. Thanh Tiến Độ Kép Thời Gian Thực (Dual Realtime HUD)
- **Vị trí:** Cố định đỉnh màn hình thi đấu 1v1.
- **Cấu trúc 3 khối:**
  1. **Khối Người Chơi (Bên Trái):**
     - Avatar tròn 48px viền theo màu Rank hiện tại.
     - Tên hiển thị + Huy hiệu Rank (Ví dụ: `Gold II`).
     - Thanh máu/tiến trình màu xanh lá (`emerald-500`), vạch chia 10 nấc rõ ràng kèm số lượng hoàn thành (`6/10`).
     - Điểm số hiện tại số nhảy nổi bật + Huy hiệu Combo lửa `x3`.
  2. **Khối Đồng Hồ Trung Tâm:**
     - Hình lục giác hoặc hộp bo tròn nổi 3D chứa đồng hồ `00:45`.
     - Chữ số Mono không nhảy giật màn hình.
     - Khi thời gian $\le 10$ giây: Nền đổi sang đỏ rực, hiệu ứng đập phồng (`animate-pulse-fast`) kèm chuông cảnh báo.
  3. **Khối Đối Thủ (Bên Phải):**
     - Avatar đối thủ 48px viền theo Rank đối thủ.
     - Tên đối thủ + Thẻ Rank.
     - Thanh ma (Ghost Bar) màu tím neon (`purple-500`) hoặc cam, cập nhật mượt mà khi nhận sự kiện SignalR.
     - Banner cảnh báo mờ khi đối thủ ngắt kết nối: `⚠️ Mất kết nối (12s)`.

### 4.2. Bảng Thẻ Bài Lật Ghép Từ 1v1 ($4 \times 5$ Grid)
- **Bố cục:** Lưới 4 cột $\times$ 5 dòng (Tổng cộng 20 ô thẻ: 10 thẻ Tiếng Anh + 10 thẻ Tiếng Việt đảo ngẫu nhiên).
- **Trạng thái Thẻ:**
  - `Default (Chưa chọn):` Nền xanh đen sâu (`bg-slate-800/90`), viền sáng nhẹ, chữ trắng đậm, bóng vát đáy 4px.
  - `Selected (Đang chọn):` Lún xuống 2px, nền chuyển sang xanh dương sáng (`bg-blue-600`), viền phát quang xanh điện.
  - `Matched (Ghép đúng):` Nền chuyển xanh ngọc sáng (`bg-emerald-500`), viền xanh ngọc, hiệu ứng phóng to nảy (pop scale `1.08`), sau đó mờ dần và khóa tương tác.
  - `Wrong (Ghép sai):` Nền chuyển đỏ (`bg-rose-600`), viền đỏ neon, rung lắc ngang 0.4s (`animate-shake`), sau 0.5s tự động trả về Default.

### 4.3. Bục Vinh Quang Top 3 (Podium Leaderboard Layout)
- **Bục Top 1 (Trung tâm):**
  - Chiều cao lớn nhất (220px), màu vàng Gold hoàng gia ánh kim (`from-yellow-500 to-amber-600`).
  - Vương miện Hoàng Kim nổi bật trên đỉnh Avatar, hào quang vàng rực.
  - Số `1` 3D dập nổi cực đại ở thân bục.
- **Bục Top 2 (Bên trái):**
  - Chiều cao nhì (170px), màu ánh bạc Platinum (`from-slate-300 to-slate-500`).
  - Vương miện Bạc tinh tế, số `2` nổi bật.
- **Bục Top 3 (Bên phải):**
  - Chiều cao thứ ba (140px), màu đồng cổ điển (`from-amber-700 to-amber-900`).
  - Vương miện Đồng, số `3` dập nổi.
- **Danh Sách Top 4 - 100:**
  - Bảng cuộn mượt mà phía dưới bục vinh quang.
  - Mỗi dòng là một tấm thẻ bo tròn tinh tế hiển thị: Thứ hạng, Avatar, Tên, Huy hiệu Rank, Tỷ lệ thắng %, Số cúp Trophy.
- **Thanh "Vị Trí Của Bạn" (Sticky My-Rank Bar):**
  - Luôn ghim cố định ở đáy màn hình với nền đổ bóng nổi bật, giúp người chơi lập tức nhìn thấy vị trí hiện tại của mình mà không cần cuộn tìm kiếm.

### 4.4. Radar Hàng Chờ Tìm Trận (Matchmaking Modal)
- **Trạng thái Đang tìm (Searching):**
  - Vòng tròn radar đồng tâm quét góc $360^\circ$ mượt mà.
  - Sóng xung kích phát quang (`animate-ping`) lan tỏa từ avatar người chơi ở tâm.
  - Bộ đếm thời gian: `00:08`, nhãn trạng thái thích ứng:
    - 0-5s: *"Đang quét đối thủ gần Rank (±50 Trophy)..."*
    - 6-10s: *"Mở rộng phạm vi tìm kiếm (±100 Trophy)..."*
    - 11-15s: *"Mở rộng tối đa (±200 Trophy)..."*
  - Nút "Hủy tìm trận" vát 3D màu đỏ nổi bật.
- **Trạng thái Tìm Thấy (Match Found Transition):**
  - Đèn flash màn hình lóe sáng.
  - 2 Avatar bay vào từ 2 phía va chạm nhau với chữ **VS** rực lửa bốc cháy ở giữa.
  - Đếm ngược số nảy $3 \to 2 \to 1 \to$ **CHIẾN!**

### 4.5. Màn Hình Tổng Kết Trận Đấu (Match Result Modal)
- **Chiến Thắng (Victory):**
  - Biểu tượng Cúp Vàng xoay nhẹ phát sáng, hiệu ứng pháo hoa Confetti phủ kín màn hình.
  - Dòng chữ "CHIẾN THẮNG!" ánh kim rực rỡ.
  - Bộ số nhảy (Ticker Counter) cộng điểm Trophy: từ Trophy cũ chạy vùn vụt lên Trophy mới kèm số phụ `+32 Trophy`.
  - Hiệu ứng Thăng Hạng rực rỡ nếu người chơi vượt qua mốc Rank mới (ví dụ: *"THĂNG HẠNG VÀNG III!"*).
- **Thất Bại (Defeat):**
  - Biểu tượng Khiên nứt nhẹ gam màu xanh chàm điềm tĩnh, không gây cảm giác khó chịu ức chế.
  - Thông báo trừ điểm nhẹ nhàng (ví dụ: `-12 Trophy`).
  - Nếu có Khiên Bảo Vệ Rank (Demotion Shield): Hiển thị huy hiệu `🛡️ KHIÊN BẢO VỆ ĐÃ KÍCH HOẠT! Bạn không bị rớt hạng`.
- **Hành động tiếp nối:**
  - Nút lớn 3D: "Tìm Trận Khác" (Play Again) và Nút phụ: "Về Sảnh" (Lobby).

---

## 5. Danh Mục Hiệu Ứng Chuyển Động Vi Mô (Micro-Animations & Keyframes)

Hệ thống thiết kế định nghĩa các chuyển động độc quyền:

1. **`tactile-press`:** Chuyển dịch xuống 3px và giảm độ sâu bóng khi click nút/thẻ.
2. **`shake`:** Rung lắc trái-phải $\pm 6\text{px}$ trong 0.4s khi người chơi chọn sai.
3. **`pop-scale`:** Phóng to nhẹ lên $110\%$ rồi đàn hồi về $100\%$ khi ghép đúng hoặc nhận điểm.
4. **`radar-sweep`:** Quét nón ánh sáng radar xoay vòng tròn liên tục ($3\text{s}$ một vòng).
5. **`pulse-glow`:** Phát sáng nhịp nhàng hào quang xung quanh viền thẻ Master và nút quan trọng.
6. **`vs-collision`:** Hiệu ứng 2 avatar trượt nhanh vào tâm và nảy ngược ra nhẹ nhàng.
7. **`number-ticker`:** Hiệu ứng số chạy mượt mà từ số cũ sang số mới.
8. **`crown-float`:** Vương miện Top 1 nhấp nhô nhẹ nhàng trên không trung.

---

## 6. Danh Mục Thư Viện UI Component (`frontend/src/components/ui/`)

Tất cả các component dưới đây được triển khai dưới dạng **Pure Presentational Components (UI Không Phụ Thuộc Backend/SignalR Logic)**, sẵn sàng nhận props và callbacks từ Senior Fullstack Engineer (`PHU-9`):

| Tên Component | File Path | Vai Trò Chính |
| :--- | :--- | :--- |
| **`Button`** | `src/components/ui/Button.tsx` | Nút bấm 3D vát đáy Duolingo-style, hỗ trợ đầy đủ variants (`primary`, `secondary`, `danger`, `gold`, `accent`, `ghost`, `outline`, các Rank Tier), kích thước và trạng thái loading. |
| **`Badge` & `RankBadge`** | `src/components/ui/RankBadge.tsx` | Huy hiệu hiển thị 6 bậc Rank, Division (I, II, III), Huy hiệu Win Streak (🔥), Khiên bảo vệ rank (🛡️) và Cúp (🏆). |
| **`FlipCard`** | `src/components/ui/FlipCard.tsx` | Thẻ bài từ vựng hỗ trợ lật 3D, trạng thái chọn, đúng (pop xanh), sai (rung đỏ) và khóa vô hiệu hóa. |
| **`ProgressBar`** | `src/components/ui/ProgressBar.tsx` | Thanh tiến độ mượt mà với dải sọc chuyển động (striped glow), hiển thị tiến độ ván đấu, nấc chia câu. |
| **`DualBattleHUD`** | `src/components/ui/DualBattleHUD.tsx` | Thanh điều khiển đỉnh trận đấu 1v1 so sánh tiến độ thời gian thực giữa Người chơi vs Đối thủ, đồng hồ đếm ngược 60s, Combo counter. |
| **`MatchmakingRadar`** | `src/components/ui/MatchmakingRadar.tsx` | Modal tìm trận với sóng quét radar, bộ đếm giây, thông báo mở rộng vùng ELO và màn đụng độ đối đầu VS đếm ngược 3.. 2.. 1. |
| **`PodiumLeaderboard`** | `src/components/ui/PodiumLeaderboard.tsx` | Màn hình bục vinh quang Top 3, bảng xếp hạng Top 4 - 100 cuộn mượt và thanh ghim vị trí cá nhân cố định ở đáy. |
| **`MatchResultModal`** | `src/components/ui/MatchResultModal.tsx` | Modal tổng kết trận đấu với hiệu ứng Chiến Thắng pháo hoa / Thất Bại, số nhảy Trophy Ticker, thưởng XP và Thăng Hạng. |
| **`FeedbackToast`** | `src/components/ui/FeedbackToast.tsx` | Cửa sổ thông báo nảy nổi: Combo nảy số (x2, x3, x4), Cảnh báo đối thủ mất mạng (15s grace period) và thông báo hệ thống. |
| **`Barrel Index`** | `src/components/ui/index.ts` | Export tập trung toàn bộ components, types và props để dễ dàng import một dòng. |

---

## 7. Tiêu Chuẩn Tích Hợp Kỹ Thuật (Integration Contract Cho PHU-9)

Senior Fullstack Engineer (`PHU-9`) chỉ cần import trực tiếp từ `@/components/ui` mà không cần cấu hình thêm CSS phụ:

```tsx
import { 
  Button, 
  RankBadge, 
  FlipCard, 
  ProgressBar, 
  DualBattleHUD, 
  MatchmakingRadar, 
  PodiumLeaderboard, 
  MatchResultModal 
} from './components/ui';
```

Mọi component đều tuân thủ:
- **TypeScript Strict Mode:** Đầy đủ types, interfaces và JSDoc hướng dẫn props.
- **Accessibility & Keyboard Friendly:** Thẻ và nút bấm hỗ trợ focus ring, `aria-label`, và kích hoạt bằng phím Enter/Space.
- **Zero Runtime Dependencies Ngoại Lai:** Chỉ dùng React 19, Lucide React icons và Tailwind CSS tokens.

---

## 8. Mở Rộng Thiết Kế Cho 3 Mini-Game Mới (Game Expansion Pack - PHU-11)

Theo tài liệu đặc tả nghiệp vụ [`docs/spec/new-minigames-specification.md`](../spec/new-minigames-specification.md), nền tảng mở rộng thêm 3 mini-game:
1. **Audio Blitz** (Listen & Spell - Âm Thanh Đoán Chữ & Luyện Chính Tả)
2. **Cloze Master** (Context Fill-in-the-Blank - Điền Từ Ngữ Cảnh & Collocations)
3. **Grammar Detective** (Error Hunter - Thám Tử Bắt Lỗi Ngữ Pháp)

---

## 9. Triết Lý Thiết Kế & Nhận Diện Cho Từng Trò Chơi Mới

### 9.1. Audio Blitz (Visualizing Sound & Tactile Spelling)
- **Cảm hứng:** Arcade Rhythm Game kết hợp Luyện phát âm & Phonics Duolingo.
- **Điểm nhấn thị giác:**
  - Sóng âm thanh nhảy múa (Animated Soundwave Bars) phát sáng theo tần số audio thực tế.
  - Nút phát âm to tròn 3D Duolingo với hiệu ứng sóng lan tỏa (`ring-4 ring-cyan-300/40`).
  - Ô ký tự mục tiêu (Letter Input Slots) có con trỏ nhấp nháy, nảy ngọc bích khi hoàn thành đúng (`animate-pop-bounce`), rung lắc đỏ khi gõ sai (`animate-shake`).
  - Ngân hàng ô ký tự (Letter Tiles Bank) vát đáy 3D cơ học, bấm lún mượt mà.
  - Phím tắt vật lý: `Spacebar` để nghe lại, gõ trực tiếp `a-z`, `Backspace`, `Enter`.

### 9.2. Cloze Master (Contextual Clarity & Smart Distractor Highlighting)
- **Cảm hứng:** Thử thách tư duy ngữ cảnh và collocations thực tế, loại bỏ cảm giác học vẹt.
- **Điểm nhấn thị giác:**
  - Thẻ câu ngữ cảnh trang trọng, ô trống `[ ________ ]` nổi bật với viền nét đứt neon cyan hoặc hiển thị chữ cái đầu `[ e_______ ]` khi dùng quyền trợ giúp.
  - 4 Thẻ đáp án thông minh (Smart Distractors) phân bổ 2x2, có nhãn A/B/C/D dập nổi, hiển thị song ngữ tinh tế (từ tiếng Anh + sắc thái nghĩa tiếng Việt).
  - Quyền trợ giúp trong game: nút `50:50` làm mờ 2 phương án sai với hiệu ứng gạch ngang; nút `Gợi ý ký tự đầu`.
  - Hộp kiến thức **Mini Grammar Bite**: trượt nảy êm ái ngay sau khi chọn đáp án, phân tích bẫy từ vựng/collocation/giới từ sâu sắc.

### 9.3. Grammar Detective (Noir Mystery Dossier & Interactive Token Sentence)
- **Cảm hứng:** Phòng điều tra thám tử hồ sơ mật (Classified Dossier), tìm kiếm manh mối ngữ pháp.
- **Điểm nhấn thị giác:**
  - Bảng hồ sơ vụ án tông màu da/amber/sepia viền kim loại trầm (`border-amber-600/60 shadow-[0_8px_0_#451a03]`).
  - Mạng sống Kính Lúp (`3/3 🔍`), phát sáng viền hổ phách, nứt vỡ/mờ khi chọn nhầm người vô tội.
  - Câu văn tương tác (Interactive Tokenized Sentence): phân tách thành các chip từ độc lập, hover kính lúp, click đối tượng tình nghi.
  - Bắt đúng thủ phạm: chip từ phát sáng rực lửa hổ phách (`ring-4 ring-amber-400 bg-amber-400 text-yellow-950 font-black`) kèm huy hiệu "Thủ phạm!".
  - Giai đoạn 2 (Sửa chữa lỗi sai): popup sửa án với 3 phương án chuẩn xác và bản tóm tắt quy tắc ngữ pháp phá án.

---

## 10. Bảng Tokens Bổ Sung Cho 3 Mini-Game Mới

### 10.1. Color Tokens Bổ Sung (`frontend/tailwind.config.js`)

| Nhóm Token | Tên Token | Hex Code | Ứng Dụng Thực Tế |
| :--- | :--- | :--- | :--- |
| **`audio`** | `audio.cyan` | `#06b6d4` | Nút phát âm chính, sóng âm thanh, viền ô nhập chữ cái |
| | `audio.wave` | `#6366f1` | Dải sóng âm phụ, chuyển màu gradient |
| | `audio.speed` | `#10b981` | Nút chọn tốc độ chuẩn 1.0x |
| | `audio.slow` | `#f59e0b` | Nút chọn tốc độ chậm 0.75x (Rùa) |
| **`cloze`** | `cloze.teal` | `#0d9488` | Thẻ chủ đề, icon kiến thức |
| | `cloze.tealDark` | `#0f766e` | Viền 3D thẻ chủ đề |
| | `cloze.blank` | `#fde047` | Ô trống cần điền, gợi ý ký tự đầu |
| | `cloze.hint` | `#38bdf8` | Nút trợ giúp 50:50 và Gợi ý ký tự |
| **`detective`** | `detective.noir` | `#1e293b` | Nền thẻ hồ sơ vụ án mật |
| | `detective.amber` | `#f59e0b` | Màu chủ đạo thám tử, kính lúp điều tra |
| | `detective.amberDark` | `#b45309` | Viền 3D hổ phách cổ điển |
| | `detective.culprit` | `#ef4444` | Đánh dấu thủ phạm bị bắt, cảnh báo lỗi sai |
| | `detective.solved` | `#10b981` | Phá án thành công, từ sửa đúng |

### 10.2. 3D Shadow Tokens & Glow Effects

| Tên Shadow | Giá Trị CSS | Ứng Dụng |
| :--- | :--- | :--- |
| `3d-tile` | `0 4px 0 #334155` | Ngân hàng ô chữ cái, token từ tương tác |
| `3d-tile-emerald` | `0 4px 0 #047857` | Ô chữ cái / đáp án đúng |
| `3d-tile-ruby` | `0 4px 0 #b91c1c` | Ô chữ cái / đáp án sai |
| `3d-tile-amber` | `0 4px 0 #b45309` | Nút chức năng Đổi vị trí, Sửa lỗi án |
| `3d-tile-cyan` | `0 4px 0 #0e7490` | Nút Gợi ý ký tự, Trợ giúp |
| `glow-detective` | `0 0 25px rgba(245, 158, 11, 0.5)` | Hào quang kính lúp, bắt đúng thủ phạm |
| `glow-soundwave` | `0 0 25px rgba(6, 182, 212, 0.5)` | Hào quang nút phát âm đang chạy |

### 10.3. Micro-Animations & Keyframes Bổ Sung

1. **`soundwave-pulse`:** Các thanh sóng âm thanh co giãn theo chiều dọc (`scaleY(0.3) -> scaleY(1.0)`).
2. **`tile-slotted`:** Chữ cái bay nảy vào ô trống với gia tốc nảy mượt mà (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
3. **`magnifier-pulse`:** Kính lúp nhịp đập phóng to xoay nhẹ khi quét tìm manh mối.
4. **`clue-glow`:** Vòng sáng sóng xung kích hổ phách tỏa ra từ từ sai khi bị phát hiện.
5. **`streak-flame`:** Ngọn lửa chuỗi đúng lắc lư nhấp nhô sống động.

---

## 11. Bố Cục Chi Tiết 3 Màn Hình Mini-Game (Layout & Wireframes)

### 11.1. Audio Blitz (Listen & Spell)
```
+-----------------------------------------------------------------------+
|  [<- Thoát]    [🎧 Audio Blitz - 3/8]    ❤️ ❤️ ❤️    ⭐ 450    🔥 x1.2 |
+-----------------------------------------------------------------------+
|                                                                       |
|   [⭐ Perfect Ear Bonus: +30 pts]          [ 🐢 0.75x ]  [ ⚡ 1.0x ]  |
|                                                                       |
|                          ( 🔊 PHÁT ÂM )                               |
|                     ||||||||||||||||||||||                            |
|                                                                       |
|                  Phiên âm:  /ˌkɒm.prɪˈhen.ʃən/                        |
|                  Từ loại:  (Noun) - Sự nhận thức, thấu hiểu           |
|                                                                       |
|   Ngữ cảnh: "Reading ________ is an essential skill for students."    |
|                                                                       |
|   Ô nhập kết quả:                                                     |
|   +---+---+---+---+---+---+---+---+---+---+---+---+---+               |
|   | C | O | M | P | R | E | H | E | N | S | I | O | N |               |
|   +---+---+---+---+---+---+---+---+---+---+---+---+---+               |
|                                                                       |
|   Ngân hàng ký tự:                                                    |
|   [ O ]  [ H ]  [ E ]  [ C ]  [ R ]  [ P ]  [ M ]  [ S ]              |
|   [ N ]  [ I ]  [ E ]  [ O ]  [ N ]  [ T ]  [ A ]  [ L ]              |
|                                                                       |
|   [ 🔀 Đổi vị trí ]      [ ⌫ Xóa lùi ]         [ 🗑️ Xóa hết ]        |
+-----------------------------------------------------------------------+
|  ⏱️ 12s [=================================-------------------------] |
+-----------------------------------------------------------------------+
```

### 11.2. Cloze Master (Context Fill-in-the-Blank)
```
+-----------------------------------------------------------------------+
|  [<- Thoát]    [🧩 Cloze Master - 4/10]    ⭐ 680    🔥 Streak: 3      |
+-----------------------------------------------------------------------+
|  [🏷️ Công sở & Kinh doanh]  [MEDIUM]        [💡 50:50]  [✨ Gợi ý ký tự]|
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |  "Despite unexpected logistical delays, the team managed to     |  |
|  |   [ ________ ] their sales target for Q3."                      |  |
|  |                                                                 |  |
|  |   Từ loại: (verb - nguyên mẫu)                                  |  |
|  |   Nghĩa: Dù gặp sự chậm trễ hậu cần, đội ngũ vẫn đạt chỉ tiêu.  |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  +-------------------------------+ +-------------------------------+  |
|  | [A] exceed                    | | [B] expand                    |  |
|  | (vượt quá, vượt mức)          | | (mở rộng kích thước)          |  |
|  +-------------------------------+ +-------------------------------+  |
|  +-------------------------------+ +-------------------------------+  |
|  | [C] extend                    | | [D] excess                    |  |
|  | (kéo dài thời gian)           | | (sự vượt quá mức)             |  |
|  +-------------------------------+ +-------------------------------+  |
|                                                                       |
|  [💡 Mini Grammar Bite Popup trượt vào khi chọn xong phương án...]   |
+-----------------------------------------------------------------------+
```

### 11.3. Grammar Detective (Error Hunter)
```
+-----------------------------------------------------------------------+
|  [<- Thoát]    [🕵️‍♂️ Grammar Detective - 2/5]    🔍 🔍 🔍 (3/3 Kính Lúp)  |
+-----------------------------------------------------------------------+
|  [📁 HỒ SƠ VỤ ÁN #02] - Lỗi thì hoàn thành & Giới từ chỉ thời gian   |
|  🔍 Nhiệm vụ: Chạm vào TỪ hoặc CỤM TỪ bị lỗi ngữ pháp trong câu dưới |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                                                                 |  |
|  |   [ She ]  [ has ]  [ worked ]  [ as ]  [ a ]  [ software ]     |  |
|  |                                                                 |  |
|  |   [ engineer ]  [ in ]  [ this ]  [ company ]  🔴[ since ]      |  |
|  |                                                                 |  |
|  |   [ five ]  [ years ]  [ . ]                                    |  |
|  |                                                                 |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  [Popup Giai đoạn 2: Sửa lỗi án...]                                  |
|  +-----------------------------------------------------------------+  |
|  |  🎯 Bắt đúng thủ phạm: "since" là từ sai!                       |  |
|  |  Chọn phương án thay thế chuẩn xác:                             |  |
|  |  [ (1) for ]         [ (2) during ]         [ (3) from ]        |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 12. Danh Mục Thư Viện UI Component Mới (`frontend/src/components/ui/`)

Tất cả các component dưới đây được triển khai dưới dạng **Pure Presentational Components (Zero Backend/SignalR Dependency)**, sẵn sàng nhận props và callbacks từ Senior Fullstack Engineer (`PHU-12`):

| Tên Component | File Path | Vai Trò & Tính Năng Chính |
| :--- | :--- | :--- |
| **`AudioSoundwavePlayer`** | `src/components/ui/AudioSoundwavePlayer.tsx` | Máy phát âm thanh Audio Blitz với nút Play 3D, sóng âm visualizer, toggle 0.75x/1.0x, phiên âm IPA, từ loại, câu ngữ cảnh và phím tắt Spacebar. |
| **`LetterTileBank`** | `src/components/ui/LetterTileBank.tsx` | Dãy ô chữ cái kết quả (letter slots) kèm con trỏ nhấp nháy, ngân hàng ký tự tiles 3D Duolingo-style, hỗ trợ bàn phím thật (a-z, Backspace, Enter) và các nút tiện ích Shuffle, Backspace, Clear All. |
| **`ClozeQuestionCard`** | `src/components/ui/ClozeQuestionCard.tsx` | Thẻ câu hỏi ngữ cảnh Cloze Master với ô trống `[BLANK]`, thanh trợ giúp 50:50 và Gợi ý ký tự đầu, 4 thẻ đáp án thông minh (A/B/C/D) với phản hồi màu sắc đúng/sai. |
| **`MiniGrammarBiteModal`** | `src/components/ui/MiniGrammarBiteModal.tsx` | Thẻ/Modal giải thích kiến thức tức thì sau khi trả lời, làm rõ bẫy từ vựng/collocations/giới từ và nút tiếp tục. |
| **`DetectiveCaseFile`** | `src/components/ui/DetectiveCaseFile.tsx` | Giao diện hồ sơ vụ án thám tử, chỉ số kính lúp mạng sống, câu văn phân rã thành các chip từ tương tác (interactive tokens), cảnh báo bắt nhầm và hào quang khi tóm đúng thủ phạm. |
| **`DetectiveCorrectionModal`** | `src/components/ui/DetectiveCorrectionModal.tsx` | Popup giai đoạn 2 sửa chữa lỗi sai của vụ án, 3 phương án thay thế 3D, báo cáo phá án thành công và quy tắc ngữ pháp. |
| **`GameHUD`** | `src/components/ui/GameHUD.tsx` | Thanh điều khiển đỉnh ván đấu dùng chung cho các single-player mini-games: Nút thoát, icon game, mạng sống (trái tim/kính lúp), điểm số ticker, chuỗi combo lửa và thanh đếm ngược thời gian. |
| **`StreakMilestoneModal`** | `src/components/ui/StreakMilestoneModal.tsx` | Popup chúc mừng cột mốc chuỗi đúng (Streak 3, 5, 7..) phong cách Duolingo với hiệu ứng lửa bốc cháy, nhân hệ số điểm và pháo hoa Confetti. |

---

## 13. Hướng Dẫn Tích Hợp Kỹ Thuật Cho Senior Fullstack Engineer (`PHU-12`)

Senior Fullstack Engineer (`PHU-12`) có thể import toàn bộ hệ thống component mới trực tiếp từ `@/components/ui`:

```tsx
import {
  // Audio Blitz
  AudioSoundwavePlayer,
  LetterTileBank,
  // Cloze Master
  ClozeQuestionCard,
  MiniGrammarBiteModal,
  // Grammar Detective
  DetectiveCaseFile,
  DetectiveCorrectionModal,
  // Common Game Controls & Celebration
  GameHUD,
  StreakMilestoneModal,
  // Base UI
  Button,
  ProgressBar,
  RankBadge,
  FlipCard
} from '@/components/ui';
```

### 13.1. Hợp Đồng Luồng Sự Kiện Cho Audio Blitz
```tsx
<GameHUD
  title="Audio Blitz"
  icon="🎧"
  lives={lives}
  score={score}
  streak={streak}
  comboMultiplier={comboMultiplier}
  timeLeft={timeLeft}
  totalTime={15}
  progress={{ current: currentWordIndex + 1, total: totalWords }}
  onExit={handleExit}
/>

<AudioSoundwavePlayer
  isPlaying={isPlayingAudio}
  speed={playbackSpeed} // 0.75 | 1.0
  onSpeedChange={(speed) => setPlaybackSpeed(speed)}
  onPlayAudio={playCurrentWordAudio}
  ipa={currentWord.ipa}
  partOfSpeech={currentWord.partOfSpeech}
  meaningVi={currentWord.meaningVi}
  contextSentence={currentWord.contextSentence}
  playCount={audioPlayCount}
  isPerfectEarEligible={audioPlayCount === 1 && playbackSpeed === 1.0}
/>

<LetterTileBank
  wordLength={currentWord.word.length}
  slottedLetters={slottedLetters}
  bankTiles={bankTiles}
  status={validationStatus} // 'idle' | 'correct' | 'wrong'
  revealedWord={revealedWord}
  onSelectTile={handleSlotTile}
  onRemoveSlottedLetter={handleRemoveSlot}
  onShuffle={handleShuffleTiles}
  onBackspace={handleBackspace}
  onClearAll={handleClearAll}
  onSubmit={handleSubmitWord}
/>
```

### 13.2. Hợp Đồng Luồng Sự Kiện Cho Cloze Master
```tsx
<ClozeQuestionCard
  topic={question.topic}
  difficulty={question.difficulty}
  questionProgress={{ current: qIndex + 1, total: totalQuestions }}
  sentenceBefore={question.sentenceBefore}
  sentenceAfter={question.sentenceAfter}
  partOfSpeechHint={question.partOfSpeechHint}
  sentenceMeaningVi={question.sentenceMeaningVi}
  firstLetterHint={revealedFirstLetter}
  options={question.options}
  selectedOptionId={selectedOptionId}
  eliminatedOptionIds={eliminatedOptionIds}
  answerState={answerState} // 'idle' | 'correct' | 'wrong'
  correctOptionId={question.correctOptionId}
  is5050Available={powerups.canUse5050}
  isFirstLetterAvailable={powerups.canUseFirstLetter}
  onSelectOption={handleSelectOption}
  onUse5050={handleUse5050}
  onUseFirstLetterHint={handleUseFirstLetterHint}
/>

{showMiniGrammarBite && (
  <MiniGrammarBiteModal
    isCorrect={answerState === 'correct'}
    correctAnswer={question.correctWord}
    userAnswer={question.options.find(o => o.id === selectedOptionId)?.word}
    explanation={question.grammarBite.explanation}
    category={question.grammarBite.category}
    usageTip={question.grammarBite.usageTip}
    onContinue={handleNextQuestion}
  />
)}
```

### 13.3. Hợp Đồng Luồng Sự Kiện Cho Grammar Detective
```tsx
<GameHUD
  title="Grammar Detective"
  icon="🕵️‍♂️"
  lives={magnifiers}
  maxLives={3}
  lifeType="magnifiers"
  score={score}
  progress={{ current: currentCaseIndex + 1, total: totalCases }}
  onExit={handleExit}
/>

<DetectiveCaseFile
  caseNumber={`HỒ SƠ VỤ ÁN #${currentCaseIndex + 1}`}
  caseTitle={currentCase.title}
  magnifiers={magnifiers}
  tokens={tokenizedSentence}
  caughtCulpritId={caughtCulprit?.id}
  innocentTokenIds={innocentClickedIds}
  onSelectToken={handleTokenClick}
  disabled={isPhase2Active}
/>

{isPhase2Active && (
  <DetectiveCorrectionModal
    culpritWord={caughtCulprit.word}
    sentenceBefore={currentCase.sentenceBefore}
    sentenceAfter={currentCase.sentenceAfter}
    options={currentCase.correctionOptions}
    selectedOptionId={selectedCorrectionId}
    status={correctionStatus} // 'idle' | 'correct' | 'wrong'
    correctOptionId={currentCase.correctCorrectionId}
    ruleExplanation={currentCase.ruleExplanation}
    onSelectOption={handlePickCorrection}
    onCloseCase={handleCaseClosed}
  />
)}
```

---

## 14. Thiết Kế Cổng Học Tập 4 Kỹ Năng (4-Skills Gamified Learning Hub - PHU-13)

Căn cứ tài liệu đặc tả nghiệp vụ [`docs/spec/four-skills-learning-hub.md`](../spec/four-skills-learning-hub.md), ứng dụng thực hiện cuộc tái cấu trúc toàn diện về mặt kiến trúc thông tin (Information Architecture) và trải nghiệm thị giác (Visual UX):

> **Quy Tắc Cốt Lõi (Gateway Rule):**  
> Khi người học truy cập ứng dụng (Home / Landing Dashboard), **tuyệt đối KHÔNG hiển thị danh sách game dàn trải**.  
> Thay vào đó, người học được chào đón bởi **Cổng Trung Tâm 4 Kỹ Năng Chuẩn Quốc Tế**:  
> 1. 🎧 **Nghe (Listening Academy)**  
> 2. 📖 **Đọc (Reading Academy)**  
> 3. ✍️ **Viết (Writing Academy)**  
> 4. 🗣️ **Nói (Speaking Academy)**

---

## 15. Hệ Thống Tokens Màu Sắc & Nhận Diện Cho 4 Trụ Cột Kỹ Năng

Mỗi kỹ năng sở hữu một dải màu gradient, viền 3D và bóng đổ xúc giác (Tactile 3D Shadows) đặc trưng, đảm bảo tính phân cấp thị giác rõ rệt:

| Kỹ Năng (Skill Domain) | Biểu Tượng | Mã Màu Chủ Đạo (Primary Hex) | Gradient Card Background | 3D Shadow Token | Glow Filter Effect |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🎧 Nghe (Listening)** | `Headphones` | `#0ea5e9` (`sky-500`) | `from-sky-950 via-slate-900 to-sky-900/40` | `3d-listening` (`0 4px 0 #0369a1`) | `glow-listening` (`0 0 25px rgba(14,165,233,0.5)`) |
| **📖 Đọc (Reading)** | `BookOpen` | `#10b981` (`emerald-500`)| `from-emerald-950 via-slate-900 to-emerald-900/40` | `3d-reading` (`0 4px 0 #047857`) | `glow-reading` (`0 0 25px rgba(16,185,129,0.5)`) |
| **✍️ Viết (Writing)** | `PenTool` | `#f59e0b` (`amber-500`) | `from-amber-950 via-slate-900 to-amber-900/40` | `3d-writing` (`0 4px 0 #b45309`) | `glow-writing` (`0 0 25px rgba(245,158,11,0.5)`) |
| **🗣️ Nói (Speaking)** | `Mic` | `#f43f5e` (`rose-500`) | `from-rose-950 via-slate-900 to-rose-900/40` | `3d-speaking` (`0 4px 0 #be123c`) | `glow-speaking` (`0 0 25px rgba(244,63,94,0.5)`) |

### 15.1. Bảng Cấp Bậc Huy Hiệu Kỹ Năng (Skill Badges Tier Tokens)
Mỗi kỹ năng có 4 cấp độ huy hiệu với phong cách kim loại 3D:
1. **Huy hiệu Đồng (Bronze Tier - 25% Mastery):** `from-amber-800 to-amber-950`, viền `border-amber-600`, text `text-amber-400`.
2. **Huy hiệu Bạc (Silver Tier - 50% Mastery):** `from-slate-400 to-slate-700`, viền `border-slate-300`, text `text-slate-200`.
3. **Huy hiệu Vàng (Gold Tier - 75% Mastery):** `from-amber-400 to-amber-600`, viền `border-yellow-300`, text `text-yellow-300`.
4. **Huy hiệu Kim Cương (Diamond Tier - 100% Mastery):** `from-cyan-400 to-indigo-600`, viền `border-cyan-300`, text `text-cyan-300` với hiệu ứng `animate-combo-bounce`.

---

## 16. Bố Cục Giao Diện Cổng 4 Kỹ Năng & Wireframes (Layout & Wireframes)

### 16.1. Cổng Trung Tâm (Home Dashboard - 4-Skills Gateway)
```
+---------------------------------------------------------------------------------------------------+
|  [Logo] LEARN ENGLISH       [🔥 Streak: 7 Ngày]   [💰 350 Coins]   [⭐ Cấp 12 - Intermediate]   [User] |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|   👋 Chào Minh! Hôm nay bạn muốn nâng cấp kỹ năng nào?                                            |
|   "Thành công là tổng hòa của những nỗ lực nhỏ được lặp lại mỗi ngày."                             |
|                                                                                                   |
|   +---------------------------------------+   +-----------------------------------------------+   |
|   | 📊 MA TRẬN 4 KỸ NĂNG (RADAR CHART)    |   | 🎯 NHIỆM VỤ CÂN BẰNG HÔM NAY (BALANCED QUEST) |   |
|   |                                       |   |                                               |   |
|   |         🎧 Nghe: 85%                  |   |   [x] 🎧 Nghe: Đã hoàn thành 1 bài (+20 XP)   |   |
|   |              / \                      |   |   [x] 📖 Đọc: Đã hoàn thành 1 bài (+20 XP)    |   |
|   |   🗣️ 45%   /   \   📖 80%             |   |   [ ] ✍️ Viết: Chưa hoàn thành (0/1)           |   |
|   |     [Nói] -+-----+-- [Đọc]            |   |   [ ] 🗣️ Nói: Chưa hoàn thành (0/1)           |   |
|   |             \   /                     |   |                                               |   |
|   |              \ /                      |   |   🎁 Phần thưởng hoàn thành cả 4 kỹ năng:     |   |
|   |         ✍️ Viết: 70%                  |   |   [ +50 Coins  |  +100 XP  |  Chuỗi x1.2 ]    |   |
|   |                                       |   |                                               |   |
|   |   💡 Smart Pick: Kỹ năng [Nói]        |   |   [⚡ LUYỆN TẬP BÙ KỸ NĂNG YẾU (SMART PICK)]  |   |
|   |   đang cần được rèn luyện thêm!       |   |                                               |   |
|   +---------------------------------------+   +-----------------------------------------------+   |
|                                                                                                   |
|   ============================ CHỌN CHỦ ĐỀ KỸ NĂNG ĐỂ BẮT ĐẦU ============================        |
|                                                                                                   |
|   +--------------------------+  +--------------------------+  +-------------------------------+   |
|   | 🎧 KỸ NĂNG NGHE          |  | 📖 KỸ NĂNG ĐỌC           |  | ✍️ KỸ NĂNG VIẾT               |   |
|   | (Listening Academy)      |  | (Reading Academy)        |  | (Writing Academy)             |   |
|   |                          |  |                          |  |                               |   |
|   | • 4 Mini-games           |  | • 4 Mini-games           |  | • 4 Mini-games                |   |
|   | • Tiến độ: 85% Mastery   |  | • Tiến độ: 80% Mastery   |  | • Tiến độ: 70% Mastery        |   |
|   | • Cấp độ: Master Ear     |  | • Cấp độ: Sharp Reader   |  | • Cấp độ: Word Crafter        |   |
|   |                          |  |                          |  |                               |   |
|   | [ 🚀 KHÁM PHÁ HUB NGHE ] |  | [ 🚀 KHÁM PHÁ HUB ĐỌC ]  |  | [ 🚀 KHÁM PHÁ HUB VIẾT ]      |   |
|   +--------------------------+  +--------------------------+  +-------------------------------+   |
|                                                                                                   |
|   +--------------------------+  +-------------------------------------------------------------+   |
|   | 🗣️ KỸ NĂNG NÓI           |  | 🏆 BẢNG XẾP HẠNG TOÀN DIỆN (OVERALL 4-SKILLS LEADERBOARD)    |   |
|   | (Speaking Academy)       |  |                                                             |   |
|   |                          |  |  1. 🥇 Alex Nguyen   - 4,200 XP (Đồng đều 4 kỹ năng 95%+)   |   |
|   | • 4 Mini-games           |  |  2. 🥈 Tran Linh     - 3,850 XP                             |   |
|   | • Tiến độ: 45% Mastery   |  |  3. 🥉 Pham Hoang    - 3,420 XP                             |   |
|   | • Cấp độ: Apprentice     |  |  ...                                                        |   |
|   |                          |  |  42. Bạn (Minh)      - 1,650 XP [Top 15%]                   |   |
|   | [ 🚀 KHÁM PHÁ HUB NÓI ]  |  |                                                             |   |
|   +--------------------------+  +-------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------------------+
```

### 16.2. Trang Chi Tiết Kỹ Năng (Skill Domain Hub View)
- Header rực rỡ mang màu sắc kỹ năng với nút "Quay lại Cổng 4 Kỹ Năng".
- Bộ lọc cấp độ Tabs: `Tất cả` | `Cơ bản (A1 - A2)` | `Trung cấp (B1 - B2)` | `Học thuật (IELTS 6.5+)`.
- Danh sách thẻ game (Game Card Items) với điểm nhấn:
  - 2 Chế độ chơi rõ ràng: **Luyện Tập (Practice)** và **Đua Rank (Ranked - 3 Tim)**.
  - Nhãn phân loại: `TID Inspired 🎓`, `HOT 🔥`, `NEW ✨`.

---

## 17. Danh Mục Thư Viện UI Component Cho Cổng 4 Kỹ Năng (`frontend/src/components/ui/`)

Tất cả các component được thiết kế dưới dạng **Pure Presentational Components**, tương thích 100% với React 19 và Tailwind CSS:

| Tên Component | File Path | Vai Trò & Tính Năng Nổi Bật |
| :--- | :--- | :--- |
| **`SkillDomainCard`** | `src/components/ui/SkillDomainCard.tsx` | Thẻ đại diện cho 1 trong 4 kỹ năng tại Cổng Trang Chủ, hiển thị icon 3D, thanh tiến độ Mastery %, cấp bậc huy hiệu, số lượng games và nút Khám Phá Hub 3D. Hỗ trợ cờ `isSmartPick` phát sáng vàng khi kỹ năng đó cần bù đắp. |
| **`SkillRadarChart`** | `src/components/ui/SkillRadarChart.tsx` | Biểu đồ mạng nhện SVG 4 trục (Nghe - Đọc - Viết - Nói), hiển thị đa giác năng lực bán trong suốt, điểm số trung bình toàn diện, và banner gợi ý thông minh (Smart Pick) tự động chọn kỹ năng yếu nhất. |
| **`DailyBalancedQuestCard`** | `src/components/ui/DailyBalancedQuestCard.tsx` | Thẻ nhiệm vụ cân bằng hàng ngày với 4 ô kiểm tra kỹ năng (🎧📖✍️🗣️), thanh tiến độ $x/4$, phần thưởng $+50\text{ Coins}$, $+100\text{ XP}$ và nút Claim thưởng kích hoạt pháo hoa Confetti. |
| **`SkillDomainHubHeader`** | `src/components/ui/SkillDomainHubHeader.tsx` | Thanh điều hướng đỉnh của từng Hub kỹ năng, nút quay lại 3D, thanh lọc cấp độ (A1-A2, B1-B2, IELTS), và thanh tiến độ Mastery. |
| **`GameCardItem`** | `src/components/ui/GameCardItem.tsx` | Thẻ trò chơi trong catalog kỹ năng, hiển thị số sao độ khó ⭐, trọng tâm sư phạm, nhãn TID Inspired, và 2 nút phân nhánh chế độ chơi (Luyện Tập vs Đua Rank). |
| **`DictationDashCard`** | `src/components/ui/DictationDashCard.tsx` | Mini-game Nghe chép chính tả biểu mẫu (IELTS Listening Section 1): trình phát audio giới hạn số lần nghe, form đăng ký thực tế với các input phản hồi màu sắc đúng/sai, đồng hồ đếm ngược 45s. |
| **`SkimScanCard`** | `src/components/ui/SkimScanCard.tsx` | Mini-game Đọc lướt bắt chi tiết (IELTS Reading): hiển thị Micro-Passage 50-70 từ, nhận định Statement, 3 nút bấm 3D `[TRUE]`, `[FALSE]`, `[NOT GIVEN]`, và ngăn kéo highlight câu bằng chứng trong đoạn văn. |
| **`CollocationSatelliteCard`** | `src/components/ui/CollocationSatelliteCard.tsx` | Mini-game Viết nối cụm từ học thuật C1/C2: thẻ từ trung tâm phát sáng, 4 thẻ vệ tinh bao quanh xoay động, hiệu ứng combo x1.5 x2.0, câu ví dụ thực tế và giải thích nghĩa tiếng Việt. |
| **`MinimalPairsCard`** | `src/components/ui/MinimalPairsCard.tsx` | Mini-game Nói phân biệt cặp âm tương đồng (/iː/ vs /ɪ/): nút loa phát âm thanh bí mật, 2 thẻ đối đầu lựa chọn A vs B cỡ lớn, bộ đếm phản xạ nhanh 8s và chuỗi danh hiệu "Tai Vàng Phản Xạ". |
| **`SkillBadgeModal`** | `src/components/ui/SkillBadgeModal.tsx` | Modal chúc mừng thăng hạng cấp bậc kỹ năng (Đồng, Bạc, Vàng, Kim Cương) với hiệu ứng pháo hoa, huy hiệu kim loại xoay 3D và quà tặng XP/Coins. |

---

## 18. Hướng Dẫn Tích Hợp Kỹ Thuật (Integration Contract)

Senior Fullstack Engineer có thể import đồng thời toàn bộ UI components trực tiếp từ `@/components/ui`:

```tsx
import {
  // 4-Skills Gateway & Management
  SkillDomainCard,
  SkillRadarChart,
  DailyBalancedQuestCard,
  SkillDomainHubHeader,
  GameCardItem,
  SkillBadgeModal,

  // TID-Inspired Categorized Mini-Games
  DictationDashCard,
  SkimScanCard,
  CollocationSatelliteCard,
  MinimalPairsCard,

  // Common UI
  Button,
  RankBadge,
  ProgressBar
} from '@/components/ui';
```

### 18.1. Mẫu Triển Khai Cổng Trang Chủ (4-Skills Gateway Hub)
```tsx
// 1. Ma trận Radar Chart & Daily Balanced Quest
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  <SkillRadarChart
    scores={{
      listening: userProgress.listeningMastery,
      reading: userProgress.readingMastery,
      writing: userProgress.writingMastery,
      speaking: userProgress.speakingMastery,
    }}
    onSelectSkill={(code) => navigateToSkillHub(code)}
    onSmartPickClick={(code) => handleSmartPickPractice(code)}
  />

  <DailyBalancedQuestCard
    completedSkills={dailyStatus.completedSkillCodes}
    rewardClaimed={dailyStatus.isRewardClaimed}
    bonusCoins={50}
    bonusXp={100}
    onClaimBonus={handleClaimDailyReward}
    onSelectSkill={(code) => navigateToSkillHub(code)}
    onSmartPick={handleSmartPickPractice}
  />
</div>

// 2. Lưới 4 Thẻ Học Viện Kỹ Năng
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {skillDomains.map((domain) => (
    <SkillDomainCard
      key={domain.code}
      code={domain.code}
      titleVi={domain.nameVi}
      titleEn={domain.nameEn}
      description={domain.description}
      masteryPercentage={domain.userMastery}
      tierTitle={domain.tierTitle}
      badgeTier={domain.badgeTier}
      gameCount={domain.games.length}
      featuredGames={domain.games.slice(0, 3)}
      isCompletedToday={dailyStatus.completedSkillCodes.includes(domain.code)}
      isSmartPick={domain.code === smartPickSkillCode}
      onExplore={(code) => navigateToSkillHub(code)}
      onQuickPlay={(gameCode) => launchGame(gameCode)}
    />
  ))}
</div>
```

---

## 19. Hệ Thống Giữ Chân Người Dùng & Gamification Nâng Cao (Retention Ecosystem - PHU-18)

Dựa trên đặc tả nghiệp vụ [`docs/spec/retention-and-gamification-expansion.md`](../spec/retention-and-gamification-expansion.md) và thiết kế kiến trúc [`docs/architecture/retention-and-gamification-architecture.md`](../architecture/retention-and-gamification-architecture.md), hệ thống giao diện được mở rộng để xây dựng thói quen học tập bền vững (Habit-Forming Learning Loop), tối ưu hóa tỷ lệ giữ chân D1, D7, D30 và gia tăng tính gắn kết cộng đồng.

### 19.1. Bảng Màu & Tokens Hệ Thống Giữ Chân Mới

| Nhóm Token | Màu Sắc Đại Diện | Hex / CSS Class | Ứng Dụng Giao Diện & Tâm Lý Học Hành Vi |
| :--- | :--- | :--- | :--- |
| **`clinic`** | Xanh Ngọc Y Tế / Mint | `#0d9488` (Teal 600)<br>`#10b981` (Mint 500) | **Phòng Khám Lỗi Sai (Weakness Clinic):** Mang lại cảm giác chữa lành, trị dứt điểm lỗ hổng kiến thức thay vì cảm giác bị phạt khi làm sai. |
| **`clinic.again`** | Đỏ Cam Cảnh Báo | `#ef4444` (Rose 500) | Nút lặp lại SM-2 ($q < 3$): Quên hẳn hoặc sai sót lớn, cần ôn lại sau 24h. |
| **`clinic.good`** | Xanh Biển Trí Tuệ | `#3b82f6` (Blue 500) | Nút nhớ tốt SM-2 ($q = 4$): Nhớ chính xác, tăng khoảng cách ôn tập lên $3 \to 7$ ngày. |
| **`clinic.easy`** | Xanh Ngọc Thuần Thục | `#10b981` (Emerald 500) | Nút dễ như chớp SM-2 ($q = 5$): Phản xạ tức thì, tăng hệ số $EF$. |
| **`freeze.ice`** | Lam Băng Tinh Thể | `#38bdf8` (Sky 400)<br>`#0284c7` (Sky 600) | **Băng Bảo Vệ Chuỗi (Streak Freeze):** Tinh thể băng giá bao phủ ngọn lửa, bảo tồn chuỗi streak qua ngày bận rộn. |
| **`chest.morning`**| Hổ Phách Bình Minh | `#f59e0b` (Amber 500)<br>`#b45309` (Amber 700) | **Hòm Bình Minh (06:00 - 10:00):** Đánh thức ngày mới với +20% XP Booster (30m). |
| **`chest.noon`** | Lam Ngọc Năng Lượng | `#06b6d4` (Cyan 500)<br>`#0891b2` (Cyan 600) | **Hòm Năng Lượng (11:30 - 13:30):** Tận dụng giờ nghỉ trưa so tài nhận Vé đấu 1v1 miễn phí. |
| **`chest.night`**| Tử Sắc Kỳ Bí | `#a855f7` (Purple 500)<br>`#7e22ce` (Purple 700) | **Hòm Báu Ngày (Reset 23:59):** Phần thưởng biến đổi Gacha (Coins, XP, Mảnh Freeze hiếm). |
| **`squad.brand`** | Lam Tím Đồng Đội | `#6366f1` (Indigo 500)<br>`#4338ca` (Indigo 700) | **Study Squads (Nhóm Học Tập 5-10 bạn):** Biểu trưng cho sự đoàn kết, trách nhiệm và tinh thần đồng đội. |
| **`squad.mvp`** | Vàng Hoàng Kim MVP | `#facc15` (Yellow 400) | Vương miện vinh danh thành viên đóng góp nhiều XP nhất cho nhóm trong tuần. |
| **`league.promo`**| Xanh Thăng Hạng | `#10b981` (Emerald 500) | **Top 1 - 7 Vùng Thăng Hạng:** Mũi tên xanh vươn lên, hứa hẹn tiến vào giải đấu cao hơn. |
| **`league.safe`** | Xám Tro Trụ Hạng | `#64748b` (Slate 500) | **Top 8 - 25 Vùng An Toàn:** Vững vàng vị trí hiện tại. |
| **`league.demote`**| Đỏ Cảnh Báo Rớt | `#ef4444` (Rose 500) | **Top 26 - 30 Vùng Rớt Hạng:** Cảnh báo nguy cơ tụt hạng cuối tuần (trừ Bronze). |
| **`phoneme.green`**| Xanh Bản Xứ ($\ge 85\%$) | `#10b981` (Emerald 500) | Âm vị chuẩn xác, tròn vành rõ chữ. |
| **`phoneme.yellow`**| Vàng Cần Lưu Ý ($60-84\%$) | `#f59e0b` (Amber 500) | Phát âm tạm ổn, cần chú ý trọng âm hoặc âm gió. |
| **`phoneme.red`** | Đỏ Sai Lệch ($< 60\%$) | `#ef4444` (Rose 500) | Nuốt âm, lệch âm vị hoặc thiếu âm đuôi (ending sounds). |

---

### 19.2. Hệ Thống 3D Depth Shadows & Micro-Animations

Các tokens 3D depth và keyframe animations được tối ưu hóa cho trải nghiệm bấm phím cơ học:

```css
/* 3D Tactile Buttons & Cards */
boxShadow: {
  '3d-ice': '0 4px 0 #0284c7',
  '3d-frost': '0 4px 0 #0369a1',
  '3d-squad': '0 4px 0 #4338ca',
  '3d-clinic': '0 4px 0 #0f766e',
  '3d-chest-morning': '0 4px 0 #b45309',
  '3d-chest-noon': '0 4px 0 #0891b2',
  '3d-chest-night': '0 4px 0 #7e22ce',
  '3d-promo': '0 4px 0 #047857',
  '3d-demote': '0 4px 0 #b91c1c',
  'glow-ice': '0 0 25px rgba(56, 189, 248, 0.5)',
  'glow-squad': '0 0 25px rgba(99, 102, 241, 0.5)',
  'glow-clinic': '0 0 25px rgba(13, 148, 136, 0.5)',
  'glow-chest': '0 0 30px rgba(245, 158, 11, 0.55)',
}

/* Micro-Animations */
keyframes: {
  'ice-sparkle': { '0%, 100%': { opacity: '0.6', transform: 'scale(0.95)' }, '50%': { opacity: '1', transform: 'scale(1.05)' } },
  'chest-bounce': { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '25%': { transform: 'translateY(-6px) rotate(-2deg)' }, '75%': { transform: 'translateY(-4px) rotate(2deg)' } },
  'pulse-ring': { '0%': { transform: 'scale(0.95)', opacity: '0.8' }, '50%': { transform: 'scale(1.15)', opacity: '0.3' }, '100%': { transform: 'scale(0.95)', opacity: '0.8' } }
}
```

---

### 19.3. Danh Sách Components Mới (`frontend/src/components/ui/`)

| Tên Component | File Path | Mục Đích Sử Dụng & Hành Vi Giao Diện |
| :--- | :--- | :--- |
| **`WeaknessClinicCard`** | `src/components/ui/WeaknessClinicCard.tsx` | Thẻ lật 3D Phòng Khám Lỗi Sai với thuật toán lặp lại ngắt quãng SuperMemo-2. Mặt trước: câu hỏi, từ bị sai gạch đỏ; Mặt sau: đáp án chuẩn, phiên âm IPA, giải thích ngữ pháp và 4 nút đánh giá $q \in \{1, 2, 4, 5\}$. Khi hoàn thành toàn bộ thẻ, hiển thị màn hình chúc mừng danh hiệu "Bác Sĩ Trị Lỗi". |
| **`StreakFreezeCard`** | `src/components/ui/StreakFreezeCard.tsx` | Quản lý chuỗi ngày học phong cách Duolingo, hiển thị ngọn lửa rực cháy, 2 ô hòm đồ Băng Bảo Vệ Chuỗi, tính năng mua vật phẩm 100 Coins (chặn mua quá giới hạn 2/2) và banner cứu chuỗi 24h khẩn cấp (200 Coins). |
| **`DailyTimeChestsCard`** | `src/components/ui/DailyTimeChestsCard.tsx` | 3 Hòm báu khung giờ vàng (Bình Minh 06-10h, Năng Lượng 11:30-13:30h, Đóng Ngày 23:59h). Trạng thái động: Sẵn sàng mở (nhún nhảy phát sáng), Chưa tới giờ (ổ khóa đếm ngược), Đã nhận và Đã qua giờ. |
| **`WeeklyLeagueCard`** | `src/components/ui/WeeklyLeagueCard.tsx` | Bảng xếp hạng tuần phòng đấu 30 người (Rolling 30-Player Cohort) theo 5 cấp bậc (Bronze -> Diamond). Phân chia 3 vùng trực quan: Thăng Hạng (Top 1-7, xanh lá), An Toàn (Top 8-25, xám), Rớt Hạng (Top 26-30, đỏ). Thanh vị trí người dùng ghim cố định đáy màn hình. |
| **`StudySquadCard`** | `src/components/ui/StudySquadCard.tsx` | Nhóm học tập hợp tác 5 - 10 thành viên: hiển thị mã mời nhóm 6 ký tự kèm nút sao chép 1 chạm, thanh tiến trình mở khóa 3 bậc rương tuần (1,000 XP, 2,500 XP, 5,000 XP), kiểm tra điều kiện chống ngồi mát ăn bát vàng ($\ge 100\text{ XP}$) và danh hiệu Squad MVP. |
| **`AsyncChallengeCard`** | `src/components/ui/AsyncChallengeCard.tsx` | Thách đấu bất đồng bộ qua liên kết chia sẻ (Viral Ghost Race): so sánh điểm số song song giữa Người thách đấu vs Đối thủ, hiển thị thời gian giới hạn và phần thưởng Coins (+50 khi phá kỷ lục). |
| **`PhonemeHeatmapCard`** | `src/components/ui/PhonemeHeatmapCard.tsx` | Bản đồ nhiệt âm vị AI Luyện Nói: câu mẫu tách nhỏ theo từng âm vị IPA với 3 sắc thái màu (Xanh $\ge 85\%$, Vàng $60-84\%$, Đỏ $< 60\%$), bấm vào từng âm để nghe phân tích khẩu hình, kèm bảng điểm 4 chỉ số (Tổng điểm, Trôi chảy, Phát âm, Ngữ pháp) và cấp độ CEFR. |

---

### 19.4. Hướng Dẫn Tích Hợp Kỹ Thuật (Developer Integration Snippet)

Senior Fullstack Engineer có thể import và sử dụng toàn bộ thư viện Retention UI trực tiếp từ `@/components/ui`:

```tsx
import {
  WeaknessClinicCard,
  StreakFreezeCard,
  DailyTimeChestsCard,
  WeeklyLeagueCard,
  StudySquadCard,
  AsyncChallengeCard,
  PhonemeHeatmapCard,
} from '@/components/ui';

// 1. Tích hợp Phòng Khám Lỗi Sai (Weakness Clinic)
<WeaknessClinicCard
  mistakes={dueMistakes}
  onRateMistake={(mistakeId, ratingQ) => {
    reviewMistakeApi(mistakeId, ratingQ);
  }}
  onCompleteSession={() => {
    refetchUserStats();
  }}
/>

// 2. Tích hợp Quản Lý Chuỗi & Cửa Hàng Băng Bảo Vệ
<StreakFreezeCard
  currentStreak={userStreak.currentStreak}
  maxStreak={userStreak.maxStreak}
  freezeCount={userStreak.freezeCount}
  userCoins={userProfile.coins}
  isFrozenYesterday={userStreak.isFrozenYesterday}
  canRepairStreak={userStreak.canRepairStreak}
  onBuyFreeze={handleBuyFreeze}
  onRepairStreak={handleRepairStreak}
/>

// 3. Tích hợp Hòm Báu 3 Khung Giờ
<DailyTimeChestsCard
  chests={dailyChests}
  onClaimChest={(chestType) => {
    claimDailyChestApi(chestType);
  }}
/>

// 4. Tích hợp Bảng Xếp Hạng Tuần 30 Người
<WeeklyLeagueCard
  currentTier={userLeague.tier}
  roomNumber={userLeague.roomNumber}
  timeLeftText="2 ngày 14 giờ"
  standings={leagueStandings}
  currentUserId={currentUserId}
/>

// 5. Tích hợp Nhóm Học Tập Hợp Tác
<StudySquadCard
  squadId={mySquad.id}
  squadName={mySquad.name}
  inviteCode={mySquad.inviteCode}
  memberCount={mySquad.members.length}
  currentWeeklyXp={mySquad.currentWeeklyXp}
  chestTierUnlocked={mySquad.chestTierUnlocked}
  userContribution={mySquad.userContribution}
  members={mySquad.members}
  onClaimSquadChest={(tier) => handleClaimSquadChest(tier)}
/>
```




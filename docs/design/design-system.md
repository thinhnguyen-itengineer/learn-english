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





---

## 9. Hệ Thống Modular 2D Avatar, Cửa Hàng Vật Phẩm & Hồ Sơ Cá Nhân (Gamified Avatar & Shop Subsystem)

**Mã phân hệ:** `DESIGN-AVATAR-SHOP-V1`  
**Tác giả:** UI/UX Designer & Design Technologist (`c74ffe18-11a2-47b9-a7f4-a3600b2f07c0`)  
**Bàn giao cho:** Senior Fullstack Engineer (`e78be358-35da-419c-bf21-24a27e284561`), Tech Lead, Product Team  
**Cơ sở đặc tả:** [`docs/spec/avatar-customization-and-gamified-shop.md`](../spec/avatar-customization-and-gamified-shop.md) & [`docs/architecture/avatar-and-shop-architecture.md`](../architecture/avatar-and-shop-architecture.md)  
**Mục tiêu:** Tạo dựng hệ sinh thái hình ảnh đại diện cá nhân hóa, vui tươi, gamified (phong cách Duolingo & modern web), kích thích động lực học tập thông qua cơ chế kiếm Token và mua sắm trang phục.

---

### 9.1. Triết Lý Thiết Kế & Visual Identity

1. **Ấm Áp, Tươi Sáng & Đậm Chất Game (Gamified Joy):**  
   - Nhân vật được xây dựng theo tỷ lệ Chibi bán thân - toàn thân thân thiện (đầu to vừa phải, mắt to tròn biểu cảm sinh động).
   - Gam màu tươi sáng (Pastel Vibrant), tạo cảm giác phấn khởi mỗi khi người học hoàn thành bài tập và ghé thăm diện mạo mới.
2. **Đồ Họa Vector Thuần SVG & Hiệu Năng Vượt Trội (<50ms):**  
   - Sử dụng 100% SVG inline components chia tách theo layer, không phụ thuộc vào tải ảnh raster PNG/WebP nặng nề.
   - Sắc nét tuyệt đối trên mọi độ phân giải (Retina, Mobile, Tablet, 4K Monitor).
3. **Cơ Chế Dynamic Tinting Qua Biến CSS (Zero Re-render Lag):**  
   - Màu da và màu tóc được nội suy trực tiếp qua biến CSS:
     - `--avatar-skin-color`
     - `--avatar-hair-color`
   - Cho phép người dùng trượt chọn bảng màu và xem trước tức thì mà không cần re-render lại toàn bộ cây DOM vector.

---

### 9.2. Ma Trận Xếp Lớp Z-Index 12 Layer (SVG Layer Hierarchy)

Mọi bộ phận của nhân vật được căn chuẩn trên cùng một hệ tọa độ chuẩn **Canvas 500 × 600 px** với thứ tự Z-Index nghiêm ngặt:

| Thứ tự Layer | Mã Layer Z-Index | Thành Phần | Thuộc Tính Tô Màu | Trạng Thái Mặc Định |
| :---: | :--- | :--- | :--- | :--- |
| **0** | `layer-0-aura-pedestal` (Z: 0) | Hào quang & Bục đứng vinh danh | Vector Gradient | Bục gỗ sồi tròn (`pedestal_wood_circle`) |
| **1** | `layer-1-rear-hair` (Z: 1) | Tóc phía sau lưng | `var(--avatar-hair-color)` | Tự động sinh theo kiểu tóc |
| **2** | `layer-2-base-body` (Z: 2) | Khung thân người (Cổ, ngực, tay, chân) | `var(--avatar-skin-color)` | Neutral / Male / Female |
| **3** | `layer-3-face` (Z: 3) | Biểu cảm mắt, mày, mũi, miệng & má hồng | Mắt đen + má hồng + điểm sáng | Friendly Smile (`friendly_smile`) |
| **4** | `layer-4-bottoms` (Z: 4) | Quần dài, quần short, chân váy | Asset Color Palette | Quần Jeans xanh (`starter_jeans_blue`) |
| **5** | `layer-5-footwear` (Z: 5) | Giày thể thao, Boots da, Giày Cyber | Asset Color Palette | Sneaker trắng (`starter_sneakers_white`) |
| **6** | `layer-6-tops` (Z: 6) | Áo thun, Hoodie, Áo vest, Áo khoác | Asset Color Palette | Áo thun trắng (`starter_tee_white`) |
| **7** | `layer-7-neckwear` (Z: 7) | Khăn choàng len, Tai nghe gaming, Cà vạt | Asset Color Palette | Tùy chọn (Mặc định: Trống) |
| **8** | `layer-8-front-hair` (Z: 8) | Tóc mái & tóc trước trán | `var(--avatar-hair-color)` | Short Crop (`hair_front_short_crop`) |
| **9** | `layer-9-headwear` (Z: 9) | Mũ lưỡi trai, Mũ len beanie, Vương miện | Asset Color Palette | Tùy chọn (Mặc định: Trống) |
| **10**| `layer-10-eyewear` (Z: 10) | Kính cận tròn, Kính râm, Visor Cyber | Trong suốt + Gọng | Tùy chọn (Mặc định: Trống) |
| **11**| `layer-11-companion` (Z: 11) | Cú mèo, Mèo may mắn, Từ điển, Đũa phép | Độc lập, kèm animation bay | Tùy chọn (Mặc định: Trống) |

---

### 9.3. Bảng Token Màu Sắc Mới (Design Tokens)

#### 1. Hệ Thống 4 Cấp Độ Hiếm (Rarity Tiers):
- **Common (Phổ thông):**  
  - Border: `border-slate-700/80` | Background: `bg-slate-800/80` | Shadow: `shadow-[0_4px_0_#1e293b]`  
  - Huy hiệu: Viền xám ánh bạc, biểu tượng Ngôi sao (Star).
- **Rare (Hiếm):**  
  - Border: `border-emerald-500/80` | Background: `bg-emerald-950/80` | Shadow: `shadow-[0_4px_0_#047857]`  
  - Huy hiệu: Viền ngọc lục bảo phát sáng nhẹ, biểu tượng Lấp lánh (Sparkles).
- **Epic (Sử thi):**  
  - Border: `border-purple-500/80` | Background: `bg-purple-950/80` | Shadow: `shadow-[0_4px_0_#6d28d9]`  
  - Huy hiệu: Viền tím neon, hiệu ứng nhịp thở pulse glow, biểu tượng Khiên năng lượng (Shield).
- **Legendary (Huyền thoại):**  
  - Border: `border-amber-500` | Background: `bg-gradient-to-r from-amber-950/90 to-orange-950/90` | Shadow: `shadow-[0_4px_0_#c2410c]`  
  - Huy hiệu: Viền vàng lửa rực rỡ, hiệu ứng nhấp nháy chuyển sắc, biểu tượng Ngọn lửa (Flame).

#### 2. Bảng 8 Tông Màu Da Chuẩn (Universal Skin Tones):
- `#FDDFDF` (Porcelain - Rất sáng)
- `#F8D5C2` (Fair - Trắng hồng tự nhiên)
- `#E8B898` (Warm Ivory - Sáng tự nhiên)
- `#D09B74` (Tan - Bánh mật nhẹ)
- `#BA7B54` (Olive - Răm nắng Châu Á)
- `#9B5B32` (Honey Bronze - Nâu đồng)
- `#6C3E1F` (Chestnut - Nâu hạt dẻ)
- `#3D2314` (Espresso - Nâu đậm Châu Phi)

#### 3. Bảng 10 Màu Tóc Tự Nhiên & Fantasy:
- `#1C1917` (Jet Black), `#3B2219` (Espresso), `#5C3317` (Chestnut Brown), `#854D0E` (Caramel Honey), `#CA8A04` (Golden Blonde), `#78350F` (Auburn Copper), `#DC2626` (Crimson Flame), `#64748B` (Platinum Silver), `#06b6d4` (Cyber Neon), `#9333ea` (Cosmic Violet).

#### 4. Token Tiền Tệ Token Economy:
- Biểu tượng đồng xu vàng viền 3D: `text-yellow-400 drop-shadow-[0_1px_4px_rgba(234,179,8,0.8)] animate-coin-shine`.
- Thẻ số dư Token: `bg-gradient-to-b from-amber-500/20 via-yellow-950/40 to-amber-950/80 border-amber-500/80 text-amber-300 shadow-[0_3px_0_#78350f]`.
- Thanh trần mềm ngày (Soft-Cap Meter): `600 Tokens/ngày`, tự động chuyển màu cảnh báo vàng khi chạm trần.

---

### 9.4. Đặc Tả Bố Cục Giao Diện & Màn Hình

#### 1. Phòng Thay Đồ & Studio Tùy Biến (`AvatarCustomizerModal.tsx`):
- **Bố cục Split-View:**
  - **Cột Trái (40%):** 
    - Hiển thị nhân vật toàn thân (`AvatarRenderer` mode `full`).
    - Bộ chuyển đổi 3 Preset Slots (Slot 1, 2, 3) với nhãn khóa/mở và huy hiệu đang kích hoạt.
    - Bộ 3 nút điều khiển nhanh: "Ngẫu nhiên" (Dices), "Mặc định" (RotateCcw), "Mở Cửa Hàng" (ShoppingBag).
  - **Cột Phải (60%):**
    - Thanh Tabs danh mục cuộn ngang: Dáng & Da, Tóc & Màu, Biểu cảm, Áo, Quần & Váy, Giày dép, Mũ nón, Kính mắt, Phụ kiện cổ, Thú cưng, Hào quang & Bục.
    - Lưới chọn vật phẩm trực quan với viền phản hồi `ring-2 ring-emerald-400`.
    - Thanh điều khiển footer: Nút "Hủy bỏ" bên trái và nút 3D "Lưu Vào Slot" bên phải.

#### 2. Cửa Hàng Vật Phẩm Game Hóa (`ShopModal.tsx`):
- **Tính năng Live Fitting Room (Thử Đồ Trực Quan):**
  - Chế độ split-view tích hợp Avatar trực tiếp trong Shop.
  - Mỗi khi bấm nút "Thử" trên thẻ `ShopItemCard`, nhân vật bên trái mặc ngay lập tức để người học chiêm ngưỡng trước khi quyết định mua.
  - Nút "Bỏ thử (N)" cho phép hoàn tác nhanh.
- **Quy trình Mua Sắm An Toàn (Purchase Confirmation Modal):**
  - Hộp thoại tính toán số dư rõ ràng: `Số dư hiện tại - Giá Token = Số dư sau giao dịch`.
  - Nút Mua hiển thị trạng thái `isLoading` chống spam click đúp.
  - Hộp thoại chúc mừng mở khóa thành công kèm hiệu ứng hoạt họa vinh danh.

#### 3. Trang Hồ Sơ Cá Nhân (`UserProfileShowcaseCard.tsx`):
- **Banner Bục Vinh Quang & Avatar Toàn Thân:**
  - Nhân vật đứng trên bục vàng với hiệu ứng nhịp thở (`animate-avatar-breathe`).
- **Radar 4 Kỹ Năng Sư Phạm:**
  - Biểu đồ mạng nhện SVG 4 đỉnh: Nghe (Listening), Nói (Speaking), Đọc (Reading), Viết (Writing) thể hiện % năng lực thực tế.
- **Tủ Trưng Bày Huy Hiệu (Badges Wall):**
  - Ghim tối đa 3 huy hiệu vinh danh lên đầu hồ sơ cá nhân.
  - Lưới toàn bộ 24 huy hiệu thành tích phân hạng Đồng, Bạc, Vàng, Kim Cương.
- **Dòng Nhật Ký Giao Dịch & Hoạt Động (Recent Activity & Token Ledger):**
  - Hiển thị biến động Token theo thời gian thực (ví dụ: `+25 Tokens - Thắng 1v1`, `-850 Tokens - Mua áo hoodie`).

#### 4. Tủ Đồ Cá Nhân (`WardrobeModal.tsx`):
- Xem lại toàn bộ trang phục đã tích lũy.
- Lọc theo danh mục và tìm kiếm nhanh theo tên.
- Trang bị trực tiếp vào nhân vật chỉ với 1 click.

---

### 9.5. Danh Mục Micro-Animations & Hiệu Ứng

| Hiệu Ứng | Tên Animation Tailwind | Thời Lượng | Mục Đích |
| :--- | :--- | :--- | :--- |
| **Nhịp thở nhân vật** | `animate-avatar-breathe` | 3.0s | Tạo cảm giác nhân vật sống động, không bị tĩnh cứng |
| **Xoay hào quang** | `animate-aura-rotate` | 12.0s | Vòng sáng ma trận hoặc ngân hà xoay tròn chậm rãi |
| **Lấp lánh đồng xu** | `animate-coin-shine` | 2.0s | Điểm xuyết phản chiếu ánh kim trên icon Token vàng |
| **Nhịp viền đang thử**| `animate-tryon-pulse` | 1.8s | Báo hiệu người dùng đang trong trạng thái xem trước thử đồ |
| **Thú cưng bay lượn** | `animate-float-orbit` | 3.0s | Cú mèo và thú cưng lơ lửng nhẹ nhàng trên vai người học |

---

### 9.6. Hướng Dẫn Tích Hợp React Cho Kỹ Sư Fullstack

```tsx
import React, { useState } from 'react';
import {
  AvatarRenderer,
  AvatarCustomizerModal,
  ShopModal,
  UserProfileShowcaseCard,
  TokenBalanceBadge,
  RarityBadge,
  AvatarPresetConfig,
} from '@/components/ui';

export const UserHubPage = () => {
  const [tokenBalance, setTokenBalance] = useState(3450);
  const [dailyTokens, setDailyTokens] = useState(420);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const [activePreset, setActivePreset] = useState<AvatarPresetConfig>({
    bodyType: 'neutral',
    skinToneHex: '#F8D5C2',
    hairStyleId: 'hair_front_short_crop',
    hairColorHex: '#3B2219',
    faceExpressionId: 'friendly_smile',
    topsId: 'hoodie_cyber_neon',
    bottomsId: 'starter_jeans_blue',
    footwearId: 'footwear_cyber',
    headwearId: 'head_beanie_cozy',
    companionId: 'pet_owl_scholar',
    auraId: 'pedestal_gold_champion',
  });

  return (
    <div className="p-6 space-y-6">
      {/* 1. Header Mini Avatar & Token Badge */}
      <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl">
        <div className="flex items-center gap-3">
          <AvatarRenderer preset={activePreset} mode="headshot" size={48} />
          <span className="font-black text-white">Trần Văn An</span>
        </div>
        <TokenBalanceBadge
          balance={tokenBalance}
          showSoftCap={true}
          dailyTokensEarned={dailyTokens}
          onClick={() => setIsShopOpen(true)}
        />
      </div>

      {/* 2. User Profile Showcase */}
      <UserProfileShowcaseCard
        displayName="Trần Văn An"
        level={28}
        customTitle="Bậc Thầy Ngữ Pháp"
        tokenBalance={tokenBalance}
        streakDays={45}
        totalXp={18250}
        avatarPreset={activePreset}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />

      {/* 3. Avatar Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialPreset={activePreset}
        onSavePreset={(newConfig, slot) => {
          setActivePreset(newConfig);
          // Gửi API cập nhật PUT /api/v1/avatar/presets/{slot}
        }}
        onOpenShop={() => {
          setIsCustomizerOpen(false);
          setIsShopOpen(true);
        }}
      />

      {/* 4. Gamified Item Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        userTokenBalance={tokenBalance}
        dailyTokensEarned={dailyTokens}
        currentPreset={activePreset}
        onPurchaseItem={async (item) => {
          // Gửi API mua vật phẩm POST /api/v1/shop/buy
          setTokenBalance((prev) => prev - item.tokenPrice);
          return true;
        }}
      />
    </div>
  );
};
```

---

## 10. Hệ Thống Thiết Kế UI/UX: 3D Chibi Live Fitting Room, Camera Orbit Controls HUD & Animation States (Issue PHU-30)

**Tài liệu bổ sung:** Đặc tả thiết kế không gian 3D Studio, Live Fitting Room, HUD điều khiển Orbit 360°, Thẻ vật phẩm 3D 6 slot, Thanh tác vụ mặc thử và 5 Presets trang phục  
**Tác giả:** UI/UX Designer & Design Technologist (`c74ffe18-11a2-47b9-a7f4-a3600b2f07c0`)  
**Báo cáo cho:** Tech Lead & Software Architect (`11dba413-036f-4ce1-950e-252419384dce`)  
**Dự án:** `learn-english` (Paperclip Issue `PHU-30`, tham chiếu kiến trúc `PHU-29` và đặc tả `PHU-28`)  
**Người nhận chuyển giao:** Senior Fullstack Engineer (`e78be358-35da-419c-bf21-24a27e284561`)  

---

### 10.1. Triết Lý Thiết Kế Không Gian 3D Chibi & Trải Nghiệm Mặc Thử (3D Studio Philosophy)

Dựa trên yêu cầu giữ chân học viên và nâng cấp đồ họa game hóa của dự án `learn-english`, không gian 3D Chibi được định hình theo phong cách **Vinyl Figure Toy / Stylized Anime Chibi (Tỷ lệ Super Deformed 1:2.8)** kết hợp sàn diễn thời trang công nghệ cao:
1. **Bố Cục Cân Đối Split-View (45% 3D Viewport / 55% Bảng Điều Khiển):**
   - **Bên Trái (45%):** Khung nhìn 3D Canvas WebGL trực quan, nơi nhân vật Chibi đứng trên bục tròn phát quang (Turntable Pedestal) với ánh sáng 3 điểm Studio mềm mại và bóng đổ tiếp xúc (Contact Shadows).
   - **Bên Phải (55%):** Bảng danh mục tủ đồ module và cửa hàng vật phẩm với 6 tab phân tầng slot rõ ràng, bộ lọc độ hiếm và quản lý 5 Presets trang phục.
   - **Mobile Responsiveness:** Tự động chuyển đổi thành Stack View linh hoạt (3D Viewport 40vh phía trên, Bảng danh mục cuộn mượt phía dưới) đảm bảo diện tích chạm tối thiểu 44x44px cho ngón tay.
2. **Tương Tác Xúc Giác & Đắm Chìm 360° (Tactile 360 Orbit Interaction):**
   - Người dùng có thể chạm kéo chuột xoay 360°, phóng to/thu nhỏ cự ly $1.2\text{m} - 3.0\text{m}$, hoặc kích hoạt chế độ tự động xoay showroom ($0.5\text{ rad/s}$).
   - HUD điều khiển nổi được thiết kế theo phong cách kính vi mạch mờ (Glassmorphism), không che khuất nhân vật.
3. **Phản Hồi Thử Đồ Tức Thời (Zero-Friction Instant Try-On):**
   - Bất kỳ món đồ nào trong cửa hàng khi chạm vào đều lập tức xuất hiện trên nhân vật với nhãn huy hiệu **"Đang thử ✨" (Previewing)**.
   - Thanh tác vụ đáy (`FittingRoomActionDock`) tự động trượt lên, cung cấp nút **Hủy thử (Revert)**, **Mua ngay (Buy Now)**, **Mua toàn bộ giỏ thử đồ (Buy All Outfits)** và **Lưu thành Preset**.

---

### 10.2. Hệ Thống Design Tokens Mới (Tailwind CSS 3D Tokens)

#### 1. Bảng Màu Không Gian 3D Studio & 6 Slot Phân Tầng

| Token Name | Hex Code | Ứng Dụng Trong Giao Diện |
| :--- | :--- | :--- |
| `studio3d.canvas` | `#0b0f19` | Nền Canvas WebGL sâu thẳm, tôn vinh ánh sáng nhân vật |
| `studio3d.stage` | `#1e293b` | Bề mặt sàn showroom sàn diễn thời trang |
| `studio3d.pedestal` | `#334155` | Bục xoay tròn 3D Chibi với viền LED |
| `studio3d.orbitHud` | `rgba(15, 23, 42, 0.85)` | Nền kính mờ cho HUD xoay 360° và góc camera |
| `slot3d.basebody` | `#f43f5e` | Slot `BASE_BODY` (Cơ thể Chibi, màu hồng đào) |
| `slot3d.hair` | `#f59e0b` | Slot `HAIR` (Mái tóc anime, màu vàng hổ phách) |
| `slot3d.top` | `#3b82f6` | Slot `TOP` (Trang phục trên, màu lam điện) |
| `slot3d.bottom` | `#10b981` | Slot `BOTTOM` (Trang phục dưới, màu lục ngọc) |
| `slot3d.shoes` | `#8b5cf6` | Slot `SHOES` (Giày dép sneaker, màu tím oải hương) |
| `slot3d.accessory`| `#ec4899` | Slot `ACCESSORY` (Phụ kiện mũ/kính/cánh, màu hồng neon) |
| `tryon.amber` | `#f59e0b` | Huy hiệu và viền trạng thái "Đang thử đồ" (Previewing) |
| `tryon.glow` | `rgba(245, 158, 11, 0.45)` | Hào quang tỏa sáng của món đồ đang mặc thử |

#### 2. Micro-Animations & Hiệu Ứng 3D

| Animation Class | Thời Lượng / Easing | Hành Vi & Mục Đích |
| :--- | :--- | :--- |
| `animate-orbit-spin-slow` | 20s linear infinite | Bàn xoay 3D tự động xoay chậm nhẹ nhàng khi nhàn rỗi |
| `animate-pedestal-spin` | 15s linear infinite | Hiệu ứng vòng xoay hạt ánh sáng dưới chân bục đứng |
| `animate-sparkle-float` | 2s ease-in-out infinite | Ngôi sao lấp lánh bay lơ lửng khi thử món đồ mới |
| `animate-streak-flame` | 1s ease-in-out infinite | Lửa bùng cháy quanh chân nhân vật ở trạng thái `STREAK` (Combo $\ge 3$) |
| `animate-dizzy-wobble` | 1.2s ease-in-out infinite | Rung lắc bối rối khi trả lời sai hoặc chọn nhầm đáp án |

---

### 10.3. Chi Tiết Các Component UI Mới Trong Thư Viện (`frontend/src/components/ui/`)

#### 1. `OrbitControlsHUD.tsx` (HUD Điều Khiển Camera & Ánh Sáng 360°)
- **Đặc điểm:**
  - Vòng la bàn 360° hiển thị góc Yaw thực tế (ví dụ: `0°`, `90°`, `180°`).
  - Phím xoay nhanh trái/phải từng nấc $45^\circ$ và phím lật nhanh $180^\circ$ (xem trước / xem sau lưng).
  - Phím bật/tắt tự động xoay 360° (`Auto-Rotate`).
  - Thanh trượt và nút phóng to / thu nhỏ Zoom ($1.2\text{m} - 3.0\text{m}$) kèm tỷ lệ %.
  - Nút chuyển nhanh 5 góc nhìn chuẩn: Toàn thân (`full`), Cận cảnh mặt (`face`), Chính diện (`front`), Góc nghiêng (`side`), Sau lưng (`back`).
  - Menu chuyển đổi 4 kịch bản ánh sáng Studio: `Studio 3-Point`, `Nắng Ban Ngày`, `Hoàng Hôn Ấm`, `Cyberpunk Neon`.

#### 2. `Item3DCard.tsx` (Thẻ Vật Phẩm 3D Theo 6 Slot Chuẩn glTF)
- **Đặc điểm:**
  - Định dạng hiển thị chuẩn theo JSON Schema `AvatarItem3D` (`PHU-28`).
  - Phân loại trực quan theo 6 slot (`BASE_BODY`, `HAIR`, `TOP`, `BOTTOM`, `SHOES`, `ACCESSORY`).
  - Rarity Badges chuẩn mực (`Common`, `Rare`, `Epic`, `Legendary`) kèm viền phát quang.
  - Hiển thị thông số kỹ thuật 3D: Số đa giác (`2.8k tris`), Kích thước tệp (`240 KB`).
  - Nhãn cảnh báo xung đột trang phục (`hide_slots_when_equipped`): Cảnh báo rõ ràng nếu mặc áo trùm đầu sẽ ẩn tóc/mũ.
  - Phản hồi trạng thái đa tầng: `Đang mặc`, `Đang thử ✨`, `Đã sở hữu`, `Yêu cầu Level X`, `Mua bằng Token`.

#### 3. `FittingRoomActionDock.tsx` (Thanh Tác Vụ Mặc Thử Nổi)
- **Đặc điểm:**
  - Tự động xuất hiện ở đáy màn hình khi có ít nhất 1 món đồ đang mặc thử.
  - Thanh danh sách các món đang thử (Pills Carousel) với hình thu nhỏ và nút gỡ nhanh `[x]`.
  - Nút "Hủy thử" (`Revert`): Khôi phục nhân vật về outfit đã lưu.
  - Nút "Mua toàn bộ" (`Buy All Outfits`): Tính tổng Token và hỗ trợ thanh toán 1-click.
  - Nút "Lưu thành Preset" (`Save as Preset`): Lưu trực tiếp set đồ vào 1 trong 5 slot preset.

#### 4. `PresetSelector3D.tsx` (Quản Lý 5 Bộ Trang Phục Yêu Thích)
- **Đặc điểm:**
  - Quản lý đúng 5 slot preset tương ứng bảng CSDL `avatar_presets_3d`.
  - Hỗ trợ đổi tên trực tiếp (Inline Rename) cho từng bộ trang phục (ví dụ: *Chiến Đấu 1v1*, *Đồng Phục Đi Học*, *Ninja Siêu Cấp*).
  - 1-click Áp dụng (`Mặc set này`) đổi ngay toàn bộ 6 slot trang phục.
  - Thao tác "Lưu trang phục hiện tại" ghi đè cấu hình vào slot mong muốn.

#### 5. `AnimationStateHUD.tsx` (Máy Trạng Thái Hoạt Họa & Phản Hồi Học Tập)
- **Đặc điểm:**
  - Điều khiển 8 trạng thái hoạt họa Chibi:
    1. `IDLE`: Thở nhịp nhàng, nhún nhảy theo nhịp nhạc 60 BPM.
    2. `THINKING`: Ngón trỏ lên cằm, nghiêng đầu 15°, bong bóng suy nghĩ `...`.
    3. `CORRECT`: Nở nụ cười tươi, giơ hai tay chữ V chiến thắng.
    4. `STREAK`: Lộn nhào 360°, hào quang lửa bốc cháy quanh chân (`Combo x3+`).
    5. `CONFUSED`: Gãi đầu bối rối, giọt mồ hôi rơi `💧`.
    6. `TRYON`: Xoay người một vòng khoe đồ mới, sao lấp lánh (Sparkle VFX).
    7. `VICTORY`: Vũ đạo Chibi sôi động, bắn pháo hoa Confetti rực rỡ.
    8. `DEFEAT`: Ngồi bệt ôm gối, đám mây xám mưa bay.
  - Tự động kích hoạt pháo hoa giấy Confetti khi kích hoạt trạng thái `VICTORY`.

#### 6. `FittingRoom3DModal.tsx` (Giao Diện Phòng Thử Đồ Master Split-View)
- **Đặc điểm:**
  - Bố cục Split-View 45% 3D Viewport (trái) và 55% Tủ đồ & Cửa hàng (phải).
  - Tích hợp liền mạch: Có thể nhận trực tiếp node `<Canvas>` Three.js từ `@react-three/fiber` qua prop `canvas3DNode`, hoặc tự động hiển thị Stage Studio 3D Turntable với hiệu ứng đổ bóng và nhịp thở nhân vật nếu chưa nạp WebGL context.
  - Tích hợp toàn diện `OrbitControlsHUD`, `FittingRoomActionDock`, `PresetSelector3D` và `AnimationStateHUD`.

---

### 10.4. Hướng Dẫn Tích Hợp Cho Kỹ Sư Fullstack (PHU-31)

```tsx
import React, { useState } from 'react';
import {
  FittingRoom3DModal,
  OrbitControlsHUD,
  Item3DCard,
  PresetSelector3D,
  AnimationStateHUD,
  AvatarItem3DData,
} from '@/components/ui';

export const MyGameHub = () => {
  const [isFittingRoomOpen, setIsFittingRoomOpen] = useState(true);
  const [tokens, setTokens] = useState(2500);

  return (
    <FittingRoom3DModal
      isOpen={isFittingRoomOpen}
      onClose={() => setIsFittingRoomOpen(false)}
      userTokenBalance={tokens}
      userLevel={8}
      // Senior Fullstack Engineer có thể truyền Canvas Three.js vào đây:
      // canvas3DNode={<Canvas><ChibiModel /><OrbitControls /></Canvas>}
      onPurchaseItem={async (item: AvatarItem3DData) => {
        // Gọi API backend POST /api/v1/shop/3d-items/{id}/purchase
        setTokens((prev) => prev - item.priceTokens);
        return true;
      }}
      onPurchaseAll={async (items: AvatarItem3DData[]) => {
        const total = items.reduce((s, i) => s + i.priceTokens, 0);
        setTokens((prev) => prev - total);
        return true;
      }}
      onSavePreset={(slot, name) => {
        // Gọi API POST /api/v1/avatar-3d/presets
        console.log(`Lưu preset slot ${slot} với tên ${name}`);
      }}
    />
  );
};
```


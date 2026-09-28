# Hệ Thống Thiết Kế UI/UX: Leaderboard & Realtime 1v1 Battle
## Design System & Component Library Specification

**Tài liệu:** Đặc tả quy chuẩn giao diện người dùng, Tokens và Thư viện Component (Design System Specification)  
**Tác giả:** UI/UX Designer & Design Technologist (`c74ffe18-11a2-47b9-a7f4-a3600b2f07c0`)  
**Báo cáo cho:** Tech Lead & Software Architect (`11dba413-036f-4ce1-950e-252419384dce`)  
**Dự án:** learn-english (Paperclip Issue PHU-8)  
**Phạm vi áp dụng:** Toàn bộ giao diện Gamified PvP 1v1, Bảng Xếp Hạng (Leaderboard), Hàng Chờ Tìm Trận (Radar Matchmaking), Màn hình Tổng kết (Match Result) và Thư viện UI Component (`frontend/src/components/ui/`)  
**Tài liệu tham chiếu:** [`docs/spec/leaderboard-and-battle.md`](../spec/leaderboard-and-battle.md) và [`docs/architecture/system-design.md`](../architecture/system-design.md)  

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

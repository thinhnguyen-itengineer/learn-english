# Đặc Tả Chi Tiết Luật Chơi & Cơ Chế 3 Mini-game (Gameplay Rules)

Tài liệu này cung cấp toàn bộ đặc tả cơ chế logic, trạng thái màn chơi, tương tác người dùng (UI/UX), điều kiện thắng/thua, cách tính điểm và combo cho 3 mini-game: **Word Match**, **Speed Falling Word** và **Sentence Scramble**.

---

## 1. Mini-game 1: Word Match (Ghép Thẻ Từ Vựng)

### 1.1. Mục Tiêu Trò Chơi
Người chơi cần ghép nối các cặp thẻ tương ứng giữa **Từ vựng tiếng Anh** và **Nghĩa tiếng Việt** trong khoảng thời gian quy định.

### 1.2. Bố Cục & Cơ Chế Hiển Thị (Layout & Cards)
- **Lưới hiển thị (Grid):**
  - Mức độ Dễ (Easy): 4 cặp từ = 8 thẻ (Lưới 2x4 hoặc 4x2 trên mobile).
  - Mức độ Trung bình (Medium): 6 cặp từ = 12 thẻ (Lưới 3x4).
  - Mức độ Khó (Hard): 8 cặp từ = 16 thẻ (Lưới 4x4).
- **Phân loại thẻ:**
  - Mỗi cặp gồm 1 thẻ tiếng Anh (EN card - hiển thị từ + phiên âm nhỏ) và 1 thẻ tiếng Việt (VI card - hiển thị nghĩa tiếng Việt).
  - Vị trí các thẻ được xáo trộn ngẫu nhiên hoàn toàn trên bàn cờ.
- **Trạng thái của thẻ (Card States):**
  1. `default`: Thẻ nằm ở trạng thái bình thường (viền xám nhạt, nền trắng/slate-800, cursor pointer).
  2. `selected`: Đang được người chơi chọn (viền xanh dương `border-blue-500`, nền xanh nhạt, hiệu ứng scale nhẹ 1.05).
  3. `matched`: Đã ghép cặp chính xác (thẻ đổi màu xanh lá `bg-emerald-100 border-emerald-500 text-emerald-800`, sau đó mờ dần hoặc ẩn đi `opacity-0 pointer-events-none` sau 400ms).
  4. `mismatched`: Ghép sai (thẻ rung lắc `shake animation`, đổi viền đỏ `border-rose-500 bg-rose-50`, trở về trạng thái `default` sau 600ms).

### 1.3. Vòng Đời Tương Tác & Logic Ghép Thẻ
1. Người chơi click/chạm vào thẻ đầu tiên -> Thẻ chuyển sang trạng thái `selected`.
2. Nếu click lại vào chính thẻ đó -> Bỏ chọn (`selected` -> `default`).
3. Người chơi click/chạm vào thẻ thứ hai:
   - Hệ thống khóa tạm thời tương tác bàn cờ (`boardLocked = true`) trong 500ms để người chơi nhìn rõ kết quả.
   - **Trường hợp ĐÚNG:** (Thẻ 1 và Thẻ 2 cùng thuộc một `PairId`):
     - Kích hoạt âm thanh `match-success.mp3`.
     - Cả 2 thẻ chuyển sang `matched` -> bay hiệu ứng hạt (particles) + biến mất sau 400ms.
     - Tăng combo: `comboCount = comboCount + 1`.
     - Cộng điểm: `Score += BaseScore * ComboMultiplier`.
     - Thưởng thời gian: Cộng thêm +2 giây vào đồng hồ đếm ngược.
     - Số cặp còn lại giảm 1 (`remainingPairs = remainingPairs - 1`).
   - **Trường hợp SAI:** (Thẻ 1 và Thẻ 2 khác `PairId`):
     - Kích hoạt âm thanh `match-fail.mp3`.
     - Cả 2 thẻ rung lắc chuyển đỏ (`mismatched`) trong 600ms rồi quay về `default`.
     - Đặt lại chuỗi combo về 0 (`comboCount = 0`).
     - Trừ điểm phạt: Trừ -10 điểm (điểm không giảm dưới 0).
4. Mở khóa bàn cờ (`boardLocked = false`).

### 1.4. Thời Gian, Thắng & Thua
- **Thời gian đếm ngược (Countdown Timer):**
  - Mặc định: 45 giây cho Easy, 60 giây cho Medium, 75 giây cho Hard.
  - Thanh thời gian (Progress Bar) chuyển màu từ Xanh lá (>50%) -> Vàng (20%-50%) -> Đỏ nhấp nháy (<20%).
- **Điều kiện Thắng (Victory):**
  - Người chơi ghép hết toàn bộ các cặp (`remainingPairs === 0`) trước khi hết giờ.
  - Thưởng điểm thời gian dư: `BonusTimeScore = remainingSeconds * 10`.
- **Điều kiện Thua (Defeat):**
  - Thời gian đếm ngược về 0 mà vẫn còn thẻ chưa ghép.

### 1.5. Công Thức Tính Điểm & Combo
$$\text{ScorePerMatch} = 100 \times \left(1 + \min(\text{comboCount} \times 0.2, 2.0)\right)$$
- Match 1 (Combo 0): 100 điểm.
- Match 2 (Combo 1): 120 điểm.
- Match 3 (Combo 2): 140 điểm.
- Match 4 (Combo 3): 160 điểm.
- Match 5+ (Combo 4+): 180 - 200 điểm tối đa.

---

## 2. Mini-game 2: Speed Falling Word (Từ Rơi Tốc Độ Cao)

### 2.1. Mục Tiêu Trò Chơi
Từ vựng tiếng Anh sẽ rơi từ cạnh trên màn hình xuống đáy. Người chơi phải đọc nhanh và bấm chọn nghĩa tiếng Việt chính xác trong 4 đáp án trước khi từ chạm vạch đáy.

### 2.2. Bố Cục Màn Hình (Game Arena Layout)
- **Vùng rơi (Falling Lane):** Chiếm 70% chiều cao màn hình phía trên.
  - Phía trên là thanh trạng thái: Điểm hiện tại (Score), Mạng sống (3 Trái tim $\heartsuit \heartsuit \heartsuit$), Chuỗi đúng (Streak), Vòng chơi (Wave).
  - Vạch đáy cảnh báo (Danger Line): Nằm cách đáy vùng rơi 10px, có viền nét đứt màu đỏ cảnh báo.
- **Vùng đáp án (Control Pad):** Chiếm 30% màn hình phía dưới.
  - Gồm 4 nút bấm to tương ứng với 4 nghĩa tiếng Việt (1 đáp án đúng, 3 đáp án nhiễu cùng loại từ).
  - Hỗ trợ phím tắt số `1`, `2`, `3`, `4` trên bàn phím máy tính hoặc chạm ngón tay trên điện thoại.

### 2.3. Cơ Chế Chuyển Động & Tốc Độ (Falling Mechanics)
- Từ rơi theo trục dọc $Y$ từ $0\%$ đến $100\%$ chiều cao vùng rơi.
- Tốc độ rơi cơ sở:
  - Wave 1 (Từ 1-5): Thời gian rơi hết màn hình là $6.0$ giây.
  - Wave 2 (Từ 6-12): Thời gian rơi giảm còn $4.5$ giây.
  - Wave 3 (Từ 13-20): Thời gian rơi giảm còn $3.5$ giây.
  - Wave 4 (Từ 21+): Tốc độ tăng dần mỗi từ thêm $2\%$, đạt cực đại ở mức $2.0$ giây.
- Khoảng cách giữa 2 từ: Sau khi từ hiện tại được giải quyết (hoặc chạm đáy), từ tiếp theo sẽ xuất hiện sau độ trễ $800\text{ms}$.

### 2.4. Tương Tác & Xử Lý Va Chạm
1. **Người chơi chọn đúng đáp án:**
   - Từ đang rơi nổ hiệu ứng hạt xanh lá và tan biến.
   - Nút đáp án nháy viền xanh lá đậm.
   - Âm thanh `pop-correct.mp3`.
   - Điểm số được tính:
     $$\text{Points} = \left(50 + \text{RemainingHeightPercentage} \times 50\right) \times \text{StreakMultiplier}$$
     *(Chọn càng nhanh khi từ còn ở trên cao, điểm nhận được càng lớn).*
   - Tăng `currentStreak += 1`.
2. **Người chơi chọn sai đáp án:**
   - Nút đã chọn rung lắc mạnh màu đỏ.
   - Âm thanh `buzz-wrong.mp3`.
   - Bị trừ 1 Mạng sống: `lives = lives - 1`.
   - Đặt lại `currentStreak = 0`.
   - Từ rơi tiếp tục rơi cho đến khi người chơi chọn đúng hoặc chạm đáy.
3. **Từ chạm đáy (Bottom Collision):**
   - Màn hình rung lắc nhẹ (Screen Shake effect).
   - Từ biến thành khói xám kèm âm thanh `drop-impact.mp3`.
   - Trừ 1 Mạng sống: `lives = lives - 1`.
   - Đặt lại `currentStreak = 0`.
   - Chuyển sang từ kế tiếp.

### 2.5. Điều Kiện Thắng / Thua
- **Số mạng:** Người chơi khởi đầu với $3$ Trái tim.
- **Thua cuộc (Game Over):** Khi `lives === 0`.
- **Hoàn thành màn (Victory):** Vượt qua đủ số lượng từ quy định của chủ đề (thông thường 20 từ) mà vẫn còn ít nhất 1 mạng.

---

## 3. Mini-game 3: Sentence Scramble (Sắp Xếp Trật Tự Câu)

### 3.1. Mục Tiêu Trò Chơi
Người chơi nhận được một câu tiếng Anh hoàn chỉnh đã bị phân tách và xáo trộn vị trí các từ/cụm từ. Nhiệm vụ là sắp xếp các từ này theo đúng ngữ pháp và trật tự câu ban đầu dựa trên gợi ý nghĩa tiếng Việt.

### 3.2. Bố Cục Giao Diện (Layout & Interaction Zone)
- **Khu vực hiển thị nghĩa (Sentence Prompt):**
  - Hiển thị bản dịch tiếng Việt của câu cần xếp (ví dụ: *"Tôi thường uống một tách cà phê vào mỗi buổi sáng."*).
  - Có nút nghe phát âm câu mẫu bằng Audio TTS (Text-to-speech) sau khi giải xong.
- **Khu vực lắp ghép câu (Target Dropzone):**
  - Một khung viền nét đứt chứa các ô trống theo thứ tự từ trái sang phải.
  - Các thẻ từ được người chơi chọn sẽ di chuyển và xếp thẳng hàng tại đây.
  - Người chơi có thể click vào bất kỳ từ nào trong khu vực này để trả từ đó về lại kho từ bên dưới.
- **Kho từ xáo trộn (Source Word Bank):**
  - Hiển thị danh sách các mảnh từ (Word Chips) đã bị tráo ngẫu nhiên.
  - Mỗi chip có màu sắc bắt mắt, hiệu ứng hover nhấc nhẹ.
- **Thanh công cụ hỗ trợ (Toolbar):**
  - Nút **Làm lại (Reset)**: Đưa toàn bộ các từ đã chọn về lại kho từ ban đầu.
  - Nút **Gợi ý (Hint)**: Hiển thị từ tiếp theo đúng vị trí (kèm chi phí trừ điểm).
  - Nút **Kiểm tra (Check Answer)**: Nút sáng lên khi toàn bộ từ trong kho đã được đưa lên khung lắp ghép.

### 3.3. Cơ Chế Thao Tác (Interaction Mechanics)
1. **Click / Tap để di chuyển:**
   - Khi click vào 1 từ ở kho từ: Từ đó biến mất ở kho và tự động append vào cuối danh sách các từ trong khung lắp ghép.
   - Khi click vào 1 từ trong khung lắp ghép: Từ đó được gỡ bỏ khỏi khung và quay trở lại kho từ.
2. **Kéo thả tự do (Drag & Drop):**
   - Hỗ trợ kéo thả bằng chuột hoặc cảm ứng (sử dụng HTML5 Drag and Drop API hoặc thư viện `@dnd-kit` / `framer-motion`).
   - Người chơi có thể chèn từ vào giữa 2 từ đã có trong khung lắp ghép để đổi thứ tự mà không cần bấm gỡ ra.
3. **Cơ chế Gợi Ý (Hint System):**
   - Mỗi câu cho phép dùng tối đa $2$ lần gợi ý.
   - Khi bấm "Gợi ý": Hệ thống tự động tìm từ đúng tiếp theo đặt vào vị trí chính xác và khóa từ đó lại (`isLocked = true`, viền vàng).
   - Chi phí: Mỗi lần dùng gợi ý sẽ trừ $25\%$ tổng điểm tối đa của câu đó.

### 3.4. Kiểm Tra Đáp Án & Tính Điểm
- Khi bấm **"Kiểm tra"**:
  - So sánh mảng từ người chơi đã xếp với đáp án chuẩn:
    - **NẾU ĐÚNG:**
      - Khung lắp ghép chuyển sang màu xanh lá cây `border-emerald-500 bg-emerald-50`.
      - Âm thanh vui tươi `success-chime.mp3`.
      - Tự động kích hoạt phát âm câu tiếng Anh chuẩn (Speech Synthesis).
      - Điểm nhận được:
        $$\text{QuestionScore} = \left(\text{BasePoints} - \text{HintsUsed} \times 25\right) + \text{TimeBonus}$$
        *(Cơ sở: 100 điểm. Nếu hoàn thành trong vòng 10 giây đầu được thưởng thêm 20 điểm).*
      - Sau 1.5 giây, tự động chuyển sang câu tiếp theo.
    - **NẾU SAI:**
      - Khung lắp ghép rung lắc màu đỏ `border-rose-500 bg-rose-50`.
      - Âm thanh `error-buzz.mp3`.
      - Các từ đặt sai vị trí sẽ nháy đỏ để người chơi nhận biết và sắp xếp lại.
      - Trừ -15 điểm cho mỗi lần bấm kiểm tra sai.

### 3.5. Cấu Trúc Màn Chơi
- Mỗi phiên chơi gồm $5$ đến $8$ câu hỏi tăng dần từ ngắn (4-6 từ) đến dài/phức tạp (8-14 từ).
- Thời gian tổng cộng: 180 giây cho cả phiên chơi.

---

## 4. Bảng So Sánh Tổng Hợp 3 Mini-game

| Tiêu Chí | Word Match | Speed Falling Word | Sentence Scramble |
| :--- | :--- | :--- | :--- |
| **Kỹ năng rèn luyện** | Trí nhớ từ vựng, phản xạ nhận diện cặp | Phản xạ phản ứng nhanh, tốc độ dịch nghĩa | Ngữ pháp, cấu trúc câu, trật tự từ |
| **Độ dài phiên chơi** | 45 - 75 giây | 1 - 3 phút (tùy vào mạng sống) | 2 - 3 phút (5 - 8 câu) |
| **Cơ chế Game Over** | Hết thời gian đếm ngược | Mất hết 3 Trái tim (3 Lives) | Hết tổng thời gian (180s) |
| **Cơ chế Combo** | Ghép liên tiếp không chọn sai | Trả lời đúng liên tiếp các từ rơi | Giải đúng liên tiếp các câu không sai |
| **Hình thức tương tác** | Click/Tap lật 2 thẻ | 4 Nút bấm (Phím 1,2,3,4 hoặc chạm) | Click/Tap hoặc Kéo thả (Drag & Drop) |
| **Yếu tố cứu nguy** | Thưởng thêm +2s mỗi lần ghép đúng | Cơ hội hồi mạng ở mốc Streak 10 | Gợi ý (Hint) đặt sẵn từ đúng (-25% điểm) |

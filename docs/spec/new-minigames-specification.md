# Đặc Tả Nghiệp Vụ & Thiết Kế Chức Năng: Mở Rộng 3 Mini-Game Mới (Game Expansion Pack)

**Mã tài liệu:** `SPEC-GAME-EXPANSION-V1`  
**Phiên bản:** 1.0  
**Tác giả:** Senior Product Business Analyst (Product BA)  
**Người nhận bàn giao:** Tech Lead / Architect, UI/UX Designer, Senior Fullstack Engineer, QA Team  
**Ngày ban hành:** 29/09/2026  
**Trạng thái:** Đã hoàn thiện - Sẵn sàng chuyển giao thiết kế & lập trình  

---

## 1. Bối Cảnh, Mục Tiêu Sản Phẩm & Chiến Lược Giữ Chân Người Dùng (Retention Strategy)

### 1.1. Bối Cảnh Thực Tế & Thách Thức Hiện Tại
Nền tảng học tiếng Anh hiện tại đã triển khai thành công 3 mini-game cốt lõi:
1. **Word Match** (Ghép thẻ từ vựng - nghĩa): Rèn trí nhớ thị giác và nhận diện từ vựng.
2. **Speed Falling Word** (Từ rơi tốc độ cao): Phản xạ nhanh với nghĩa tiếng Việt dưới áp lực thời gian.
3. **Sentence Scramble** (Sắp xếp trật tự câu): Rèn luyện trật tự từ và cú pháp câu cơ bản.

Mặc dù 3 trò chơi trên đã tạo được trải nghiệm ban đầu tốt, phản hồi từ người học và chỉ số phân tích người dùng cho thấy:
- **Thiếu hụt kỹ năng Nghe & Chính tả (Listening & Phonics Gap):** Người học nhận diện được mặt chữ khi đọc, nhưng khi nghe phát âm bản xứ thì hoàn toàn không nhận ra từ hoặc viết sai chính tả (Spelling).
- **Học từ vựng cô lập (Isolated Vocabulary):** Người học biết nghĩa 1 từ đơn lẻ nhưng không biết cách sử dụng từ trong ngữ cảnh thực tế (Context), không nắm được các cụm từ cố định (Collocations) hay giới từ đi kèm.
- **Thiếu kỹ năng nhận diện lỗi sai ngữ pháp (Grammar Error Spotting):** Người học thường mắc các lỗi kinh điển về thì (Tenses), hòa hợp chủ vị (Subject-Verb Agreement), mạo từ (*a/an/the*) khi viết và nói thực tế mà không tự sửa được.
- **Sự nhàm chán lặp lại (Gameplay Fatigue):** Chỉ có 3 game khiến chu kỳ học hàng ngày bị đơn điệu, làm giảm tỉ lệ quay lại vào Ngày thứ 7 (Day-7 Retention) và Ngày thứ 30 (Day-30 Retention).

### 1.2. Mục Tiêu Sản Phẩm của Đợt Nâng Cấp Này
Mở rộng danh mục trò chơi thêm **3 mini-game mới có tính sư phạm cao, tính giải trí gây nghiện và giữ chân người dùng vượt trội**:
1. 🎧 **Mini-game 4: Audio Blitz (Listen & Spell - Âm Thanh Đoán Chữ & Luyện Chính Tả)**
2. 🧩 **Mini-game 5: Cloze Master (Context Fill-in-the-Blank - Điền Từ Ngữ Cảnh & Collocations)**
3. 🕵️‍♂️ **Mini-game 6: Grammar Detective (Error Hunter - Thám Tử Bắt Lỗi Ngữ Pháp)**

Sau nâng cấp, nền tảng sở hữu một **Hệ Sinh Thái 6 Mini-Game Hoàn Chỉnh**, bao phủ trọn vẹn 4 trụ cột kỹ năng tiếng Anh: **Từ vựng (Vocabulary) - Nghe & Chính tả (Listening & Spelling) - Ngữ cảnh (Context) - Ngữ pháp & Cú pháp (Grammar & Syntax)**.

---

## 2. Ma Trận So Sánh & Định Vị 6 Mini-Game Trong Hệ Thống

| STT | Tên Mini-Game | Kỹ Năng Trọng Tâm | Định Dạng Tương Tác | Thời Lượng Ván | Cơ Chế Giữ Chân (Retention Hook) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Word Match** | Nhận diện từ vựng | Lật thẻ ghép đôi (Card Matching) | 45s - 75s | Cảm giác dọn sạch bàn cờ (Clear board dopamine) |
| 2 | **Speed Falling Word** | Phản xạ nghĩa từ | Arcade nhịp độ nhanh (Falling Words) | 60s - 90s | Áp lực sống còn (3 mạng sống, tốc độ tăng dần) |
| 3 | **Sentence Scramble** | Cấu trúc câu ngữ pháp | Kéo/thả thẻ từ (Token Reordering) | 120s - 180s | Hoàn thành câu chuẩn xác tự nhiên |
| 4 | **Audio Blitz (Mới)** | Nghe âm vị & Chính tả | Nghe audio + Gõ phím / Chạm tile chữ | 15s/từ (8 từ/ván) | Âm thanh native chân thực, bonus "Perfect Ear" |
| 5 | **Cloze Master (Mới)** | Ngữ cảnh & Collocation | Đọc câu ngữ cảnh + Chọn 1/4 đáp án | 20s/câu (10 câu/ván) | Gợi ý 50:50, Mini Grammar Bite giải thích sâu |
| 6 | **Grammar Detective (Mới)** | Soát lỗi ngữ pháp thực tế | Chạm khoanh vùng lỗi + Sửa lỗi | 60s/vụ án (5 câu/ván) | Nhập vai thám tử phá án, phân tích nguyên nhân lỗi |

---

## 3. Đặc Tả Chi Tiết Mini-Game 4: Audio Blitz (Listen & Spell)

```
+-----------------------------------------------------------------------+
|  <- Thoát    [🔊 Audio Blitz]    ❤️ ❤️ ❤️    ⭐ Điểm: 450    🔥 Combo x3 |
+-----------------------------------------------------------------------+
|                                                                       |
|                          [ 🔊 Phát âm (Space) ]                       |
|                   [ 🐢 Nghe chậm 0.75x ]  [ ⚡ Bình thường 1.0x ]      |
|                                                                       |
|                         Phiên âm:  /ˌkɒm.prɪˈhen.ʃən/                 |
|                         Từ loại:  (Noun) - Sự nhận thức, sự thấu hiểu |
|                                                                       |
|   Gợi ý ngữ cảnh:                                                     |
|   "Reading ________ is an essential skill for students."              |
|                                                                       |
|   Ô nhập kết quả:                                                     |
|   +---+---+---+---+---+---+---+---+---+---+---+---+---+               |
|   | C | O | M | P | R | E | H | E | N | S | I | O | N |               |
|   +---+---+---+---+---+---+---+---+---+---+---+---+---+               |
|                                                                       |
|   Ngân hàng ký tự (Letter Tiles):                                     |
|   [ O ]  [ H ]  [ E ]  [ C ]  [ R ]  [ P ]  [ M ]  [ S ]              |
|   [ N ]  [ I ]  [ E ]  [ O ]  [ N ]  [ T*]  [ A*]  [ L*]              |
|                                                                       |
|   [ 🔀 Đổi vị trí ]      [ ⌫ Xóa ký tự ]       [ 🗑️ Xóa hết ]        |
+-----------------------------------------------------------------------+
|  ⏱️ Thời gian còn lại: 11s [====================--------]              |
+-----------------------------------------------------------------------+
```

### 3.1. Mục Tiêu & Cơ Chế Gameplay
- Người chơi lắng nghe phát âm của từ vựng tiếng Anh (giọng chuẩn bản xứ US/UK), kết hợp quan sát phiên âm quốc tế IPA, loại từ và câu ngữ cảnh gợi ý.
- Nhiệm vụ của người chơi: Gõ đúng chính tả (spelling) của từ vào ô nhập liệu bằng bàn phím vật lý hoặc chạm chọn các ô chữ cái gợi ý (Letter Tiles) trước khi thanh thời gian đếm ngược kết thúc.

### 3.2. Bố Cục Giao Diện & Thành Phần Tương Tác
1. **Thanh Trạng Thái Đỉnh (Top HUD):**
   - Nút Thoát/Tạm dừng (Pause).
   - Số mạng sống: 3 trái tim ($\heartsuit \heartsuit \heartsuit$).
   - Điểm số hiện tại (Score) & Hệ số chuỗi combo hiện tại (Combo Multiplier).
2. **Khu Vực Máy Phát Âm Thanh (Soundwave Player Arena):**
   - Nút Phát âm chính to tròn với hiệu ứng sóng âm (Pulsing soundwave animation khi phát audio). Phím tắt: `Spacebar`.
   - Nút chế độ nghe: `1.0x` (Tốc độ chuẩn) và `0.75x 🐢` (Tốc độ chậm rõ từng phụ âm).
   - Phiên âm IPA kích thước lớn, màu sắc trung tính nổi bật (`text-amber-400 font-mono`).
   - Nhãn từ loại (Part of Speech) và nghĩa tiếng Việt thu gọn.
   - Câu ví dụ ngữ cảnh (Context sentence) với vị trí từ mục tiêu được thay bằng đường gạch nối `______`.
3. **Khu Vực Ô Chữ Mục Tiêu (Word Input Slots):**
   - Dãy các ô vuông đại diện cho từng chữ cái của từ (ví dụ: từ có 7 ký tự sẽ có 7 ô vuông).
   - Hiệu ứng con trỏ nhấp nháy tại ô đang chờ nhập.
   - Hỗ trợ nhập liệu 2 chế độ mượt mà song song:
     - **Chế độ Bàn Phím (Desktop):** Nhập trực tiếp các phím từ `a` đến `z`, `Backspace` để xóa ký tự lùi, `Enter` để xác nhận.
     - **Chế độ Chạm Ô Chữ Cái (Mobile / Touch):** Ngân hàng ô ký tự (Letter Tiles Bank) hiển thị phía dưới gồm toàn bộ các chữ cái cấu thành từ đó kèm 2 - 3 chữ cái gây nhiễu (distractor letters). Chạm vào chữ cái nào thì chữ cái đó bay vào ô trống tiếp theo (`letter-slotted animation`). Chạm vào chữ cái đã nằm trong ô nhập thì trả chữ cái đó ngược lại ngân hàng ô ký tự.
4. **Các Phím Tiện Ích Phụ Trợ:**
   - `Shuffle (🔀)`: Đảo lộn thứ tự các ô chữ cái trong ngân hàng ký tự để kích hoạt lại tư duy thị giác.
   - `Backspace (⌫)`: Xóa chữ cái cuối cùng đã điền.
   - `Clear All (🗑️)`: Xóa sạch toàn bộ từ và đưa toàn bộ ký tự về ngân hàng.

### 3.3. Thời Gian, Quy Tắc Thắng/Thua & Mất Mạng
- **Thời lượng:** Mỗi từ có tối đa **15 giây** đếm ngược. Một ván gồm **8 từ**.
- **Quy tắc Kiểm tra Đáp Án:**
  - Ngay khi người chơi điền đủ số ký tự của từ:
    - Nếu **CHÍNH XÁC:**
      - Hiệu ứng âm thanh `audio-spell-correct.mp3` vang lên.
      - Dãy ô chữ cái đổi sang màu xanh ngọc bích `bg-emerald-500 text-white` với hiệu ứng nảy nhẹ (`bounce`).
      - Điểm cộng: Điểm cơ bản + Điểm thưởng tốc độ + Điểm thưởng "Perfect Ear" (nếu không bấm nghe chậm hoặc nghe lại quá 1 lần) $\times$ Combo Multiplier.
      - Sau $700\text{ms}$, tự động chuyển sang từ tiếp theo.
    - Nếu **SAI CHÍNH TẢ:**
      - Dãy ô chữ cái rung lắc dữ dội (`shake animation`), đổi viền đỏ `border-rose-500 bg-rose-50`.
      - Âm thanh `audio-spell-wrong.mp3`.
      - Mất 1 mạng sống (`lives = lives - 1`).
      - Combo bị reset về 0 (`comboCount = 0`).
      - Ô chữ tự động xóa các ký tự sai và cho phép người chơi gõ lại phần còn lại của thời gian.
- **Hết Giờ (Time Out):**
  - Nếu đồng hồ đếm ngược về 0 mà chưa hoàn thành từ:
    - Mất 1 mạng sống.
    - Hệ thống tự động điền đáp án đúng nhấp nháy màu vàng cam trong 1.5 giây để người học ghi nhớ mặt chữ, đồng thời phát lại âm thanh phát âm chuẩn.
    - Chuyển sang từ tiếp theo.
- **Điều Kiện Thua (Game Over):** Hết 3 mạng sống (`lives === 0`).
- **Điều Kiện Hoàn Thành (Victory):** Vượt qua hết 8 từ của ván chơi mà vẫn còn mạng sống.

### 3.4. Công Thức Tính Điểm & Combo
$$\text{WordScore} = \left(\text{BasePoint} + \text{SpeedBonus} + \text{PerfectEarBonus}\right) \times \text{ComboMultiplier}$$
- $\text{BasePoint} = 100$.
- $\text{SpeedBonus}$:
  - Hoàn thành trong $0.0\text{s} - 5.0\text{s}$: $+50$ điểm.
  - Hoàn thành trong $5.1\text{s} - 10.0\text{s}$: $+25$ điểm.
  - Hoàn thành trong $10.1\text{s} - 15.0\text{s}$: $+0$ điểm.
- $\text{PerfectEarBonus}$: $+30$ điểm nếu chỉ nghe đúng 1 lần phát âm chuẩn đầu tiên, không ấn nút nghe chậm $0.75x$ và không bấm phát lại quá 1 lần.
- $\text{ComboMultiplier}$:
  - Combo 1-2 từ liên tiếp: $1.0\times$.
  - Combo 3-4 từ liên tiếp: $1.2\times$.
  - Combo 5-6 từ liên tiếp: $1.5\times$.
  - Combo 7-8 từ liên tiếp (Max): $2.0\times$.

---

## 4. Đặc Tả Chi Tiết Mini-Game 5: Cloze Master (Điền Từ Ngữ Cảnh)

```
+-----------------------------------------------------------------------+
|  <- Thoát    [🧩 Cloze Master]    Câu: 4/10    ⭐ Điểm: 680    🔥 Streak: 3 |
+-----------------------------------------------------------------------+
|                                                                       |
|   Chủ đề: Công Sở & Kinh Doanh (Office & Business) - Level: Medium    |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |  "Despite facing unexpected logistical delays, the team       |   |
|   |   managed to [ ________ ] their sales target for Q3."         |   |
|   |                                                               |   |
|   |  Gợi ý từ loại:  (verb - nguyên mẫu)                          |   |
|   |  Nghĩa câu: Dù gặp sự chậm trễ ngoài dự kiến về hậu cần,      |   |
|   |             đội ngũ vẫn đạt được chỉ tiêu doanh số quý 3.     |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   Trợ giúp:  [ 💡 50:50 (Loại 2 sai) ]    [ 🔤 Gợi ý ký tự đầu ]      |
|                                                                       |
|   +-----------------------------+ +-----------------------------+     |
|   | [A] exceed                  | | [B] expand                  |     |
|   | (vượt quá, vượt mức)        | | (mở rộng kích thước)        |     |
|   +-----------------------------+ +-----------------------------+     |
|   +-----------------------------+ +-----------------------------+     |
|   | [C] extend                  | | [D] excess                  |     |
|   | (kéo dài thời gian)         | | (danh từ: sự quá mức)       |     |
|   +-----------------------------+ +-----------------------------+     |
|                                                                       |
+-----------------------------------------------------------------------+
|  ⏱️ Thời gian: 16s  [==============================--------------]     |
+-----------------------------------------------------------------------+
```

### 4.1. Mục Tiêu & Cơ Chế Gameplay
- Người chơi đọc một đoạn câu hoàn chỉnh có ngữ cảnh học thuật/giao tiếp thực tế. Một từ then chốt bị ẩn đi `[ ________ ]`.
- Người chơi phải phân tích nghĩa tổng thể, cấu trúc ngữ pháp, collocations và từ loại xung quanh để chọn ra **1 đáp án chính xác nhất** trong 4 đáp án thông minh (Smart Distractors).
- Ngay sau khi trả lời, hệ thống mở cửa sổ **"Mini Grammar Bite"** tóm tắt ngữ pháp cực kỳ cô đọng để củng cố kiến thức.

### 4.2. Thiết Kế 4 Đáp Án Thông Minh (Smart Distractors Strategy)
Điểm độc đáo tạo nên tính giữ chân và giá trị học thuật cao của Cloze Master là các phương án nhiễu không sinh ra ngẫu nhiên, mà được phân loại thành 3 dạng bẫy ngôn ngữ thực tế:
1. **Bẫy họ từ vựng (Word Family Confusion):** Cùng gốc từ nhưng khác từ loại (ví dụ: *succeed [v], success [n], successful [adj], successfully [adv]*).
2. **Bẫy từ dễ nhầm lẫn (Easily Confused Words / Collocations):** Những từ mang nghĩa tương đồng trong tiếng Việt nhưng collocation khác nhau trong tiếng Anh (ví dụ: *make a decision* vs *take/do a decision*; *exceed a target* vs *expand/extend a target*).
3. **Bẫy giới từ & ngữ pháp phụ thuộc (Dependent Prepositions):** Đòi hỏi giới từ đi kèm chính xác (ví dụ: *participate in*, *rely on*, *interested in*).

### 4.3. Quyền Trợ Giúp Đặc Biệt (In-game Power-ups)
Mỗi ván chơi (10 câu), người chơi được cung cấp tối đa 2 quyền trợ giúp một lần:
- **50:50 (Loại bỏ 2 đáp án sai):** Hệ thống lập tức làm mờ và vô hiệu hóa 2 thẻ đáp án gây nhiễu, chỉ để lại 1 đáp án đúng và 1 đáp án sai.
- **First Letter Hint (Gợi ý ký tự đầu):** Hiển thị ký tự bắt đầu của từ cần điền ngay trong ô trống (ví dụ: `[ e_______ ]`).

### 4.4. Thẻ Kiến Thức Tức Thì (Instant Mini Grammar Bite)
Khi người chơi chọn xong đáp án:
- Nếu **ĐÚNG:**
  - Thẻ đáp án được chọn chuyển sang màu xanh lá viền phát sáng `bg-emerald-50 border-emerald-500 text-emerald-800`.
  - Hộp thoại giải thích Mini xuất hiện nhẹ nhàng phía dưới:  
    `💡 Chuẩn xác! Cụm từ "exceed one's target" (vượt chỉ tiêu) là Collocation thông dụng. "Excess" là danh từ, "extend" dùng cho thời gian/kỳ hạn, "expand" dùng cho diện tích/quy mô.`
  - Nút "Tiếp tục" hoặc tự động chuyển câu sau 2 giây.
- Nếu **SAI:**
  - Thẻ đã chọn chuyển màu đỏ `bg-rose-50 border-rose-500 text-rose-800` rung nhẹ.
  - Thẻ đáp án đúng tự động sáng xanh để chỉ ra phương án đúng.
  - Hiển thị giải thích vì sao lựa chọn của người chơi chưa chính xác.
  - Người chơi bấm "Đã hiểu" để qua câu tiếp theo (không tự động chuyển để người học kịp đọc lý do sai).

### 4.5. Thời Gian & Tính Điểm
- **Thời lượng:** 20 giây cho mỗi câu. Ván chơi gồm **10 câu**.
- **Điểm số mỗi câu:**
  $$\text{QuestionScore} = \left(100 + \text{RemainingSeconds} \times 5\right) \times \text{StreakMultiplier}$$
- Chuỗi trả lời đúng (Streak):
  - 1-2 câu đúng liên tiếp: $\times 1.0$.
  - 3-4 câu đúng liên tiếp: $\times 1.25$.
  - 5-6 câu đúng liên tiếp: $\times 1.5$.
  - 7+ câu đúng liên tiếp: $\times 2.0$.
- Nếu sử dụng quyền trợ giúp 50:50: Điểm câu đó nhận $70\%$ điểm cơ bản.

---

## 5. Đặc Tả Chi Tiết Mini-Game 6: Grammar Detective (Thám Tử Ngữ Pháp)

```
+-----------------------------------------------------------------------+
|  <- Thoát    [🕵️‍♂️ Grammar Detective]    Vụ án: 2/5    🔍 Kính lúp: 3/3 |
+-----------------------------------------------------------------------+
|                                                                       |
|   Hồ sơ vụ án: Lỗi thì hoàn thành & Giới từ chỉ khoảng thời gian      |
|   Nhiệm vụ: Chạm vào TỪ hoặc CỤM TỪ bị lỗi ngữ pháp trong câu dưới    |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                                                               |   |
|   |   [ She ]  [ has ]  [ worked ]  [ as ]  [ a ]  [ software ]   |   |
|   |                                                               |   |
|   |   [ engineer ]  [ in ]  [ this ]  [ company ]  🔴[ since ]    |   |
|   |                                                               |   |
|   |   [ five ]  [ years ]  [ . ]                                  |   |
|   |                                                               |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   Popup Phá Án (Mở ra khi chạm đúng từ 'since'):                     |
|   +---------------------------------------------------------------+   |
|   |  🎯 Bắt đúng thủ phạm: 'since' là từ sai!                     |   |
|   |  Chọn phương án sửa chữa chính xác để đóng vụ án:             |   |
|   |                                                               |   |
|   |  [ (1) for ]         [ (2) during ]         [ (3) from ]      |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
+-----------------------------------------------------------------------+
|  ⏱️ Thời gian vụ án: 48s  [=====================================-----] |
+-----------------------------------------------------------------------+
```

### 5.1. Mục Tiêu & Cơ Chế Gameplay
- Người chơi nhập vai **Thám Tử Ngữ Pháp (Grammar Detective)**, nhận nhiệm vụ rà soát "Hồ sơ vụ án" gồm một câu tiếng Anh có chứa **đúng 1 lỗi ngữ pháp tinh vi**.
- Lối chơi diễn ra qua **2 giai đoạn (2-Phase Investigation Loop)**:
  - **Giai đoạn 1 - Xác định thủ phạm (Spot the Culprit):** Các từ trong câu được hiển thị thành các mảnh thẻ tương tác (Interactive Token Chips). Người chơi đọc lướt và click/chạm vào từ mà mình xác định là bị sai.
  - **Giai đoạn 2 - Sửa chữa lỗi sai (Fix the Case):** Khi bắt đúng từ sai, một popup phương án sửa mở ra với 3 - 4 gợi ý thay thế. Người chơi chọn phương án chuẩn xác để hoàn tất câu đúng hoàn chỉnh.

### 5.2. Các Dạng Lỗi Ngữ Pháp Trọng Tâm Trong Hồ Sơ Vụ Án
1. **Subject-Verb Agreement (Hòa hợp chủ vị):** Ví dụ: *"The list of items [are] on the table."* $\rightarrow$ Sửa thành *[is]*.
2. **Prepositions of Time & Place (Giới từ thời gian, nơi chốn):** Ví dụ: *"...worked here [since] five years."* $\rightarrow$ Sửa thành *[for]*.
3. **Verb Tenses & Irregular Forms (Thì và động từ bất quy tắc):** Ví dụ: *"Yesterday he [broadcasted] the news."* $\rightarrow$ Sửa thành *[broadcast]*.
4. **Articles & Countable/Uncountable Nouns (Mạo từ a/an/the và danh từ):** Ví dụ: *"She gave me an useful [advice] / [advices]."* $\rightarrow$ Sửa thành *[advice]*.
5. **Comparatives & Superlatives (So sánh hơn/hơn nhất):** Ví dụ: *"This method is [more easier] than that one."* $\rightarrow$ Sửa thành *[easier]*.
6. **Parallel Structure (Cấu trúc song hành):** Ví dụ: *"She likes swimming, dancing, and [to cook]."* $\rightarrow$ Sửa thành *[cooking]*.

### 5.3. Cơ Chế Kính Lúp (Lives / Magnifiers) & Thắng Thua
- Người chơi bắt đầu vụ án với **3 Kính Lúp Điều Tra (3 Magnifiers)** tương đương 3 mạng sống.
- **Xử lý tương tác:**
  - Nếu click vào từ **KHÔNG CÓ LỖI** (Bắt nhầm người vô tội):
    - Mất 1 Kính lúp (`magnifiers = magnifiers - 1`).
    - Token từ rung nhẹ màu xám/đỏ cảnh báo.
    - Âm thanh `detective-buzzer.mp3`.
  - Nếu click vào **TỪ CHỨA LỖI** (Bắt đúng thủ phạm):
    - Token phát sáng vàng hổ phách `ring-4 ring-amber-400 bg-amber-100 text-amber-900`.
    - Âm thanh phá án thành công `clue-found.mp3`.
    - Kích hoạt Giai đoạn 2 ngay trên màn hình.
  - Trong Giai đoạn 2:
    - Chọn đúng phương án sửa: Token đổi sang màu xanh ngọc bích hiển thị từ đã sửa đúng, âm thanh `case-solved.mp3`, cộng trọn điểm vụ án.
    - Chọn sai phương án sửa: Trừ 1 Kính lúp, hiển thị đáp án đúng kèm báo cáo giải thích quy tắc ngữ pháp.
- **Điều kiện kết thúc:**
  - Vượt qua 5 vụ án trong ván chơi $\rightarrow$ Thắng lợi, nhận danh hiệu "Thám Tử Xuất Sắc".
  - Hết 3 kính lúp hoặc hết thời gian 60s/vụ án $\rightarrow$ Thất bại.

### 5.4. Công Thức Tính Điểm
$$\text{CaseScore} = \left(\text{DetectionPoints} + \text{CorrectionPoints} + \text{RemainingTimeBonus}\right) \times \text{MagnifierMultiplier}$$
- $\text{DetectionPoints} = 60$ điểm (nếu tìm ra lỗi ngay lần bấm đầu tiên; nếu mất 1 kính lúp mới tìm ra thì còn 30 điểm).
- $\text{CorrectionPoints} = 60$ điểm (sửa đúng từ thay thế).
- $\text{RemainingTimeBonus} = \text{RemainingSeconds} \times 3$ điểm.
- $\text{MagnifierMultiplier}$:
  - Giữ nguyên vẹn 3 Kính lúp: $\times 1.5$ (Perfect Detective).
  - Còn 2 Kính lúp: $\times 1.2$.
  - Còn 1 Kính lúp: $\times 1.0$.

---

## 6. Tích Hợp Gamification: XP, Tiền Vàng (Coins), Cấp Độ & Nhiệm Vụ Hàng Ngày

### 6.1. Bảng Cân Bằng Điểm Kinh Nghiệm (XP) & Tiền Vàng (Coins) Cho Toàn Bộ 6 Game

| Mini-Game | Thời Gian Ván Trung Bình | XP Cơ Bản | XP Tối Đa (Max Performance) | Coins Nhận Được | Điều Kiện Thưởng Thêm (Bonus) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Word Match** | 60s | 80 XP | 140 XP | 15 Coins | Ghép xong trước 50% thời gian |
| **Speed Falling** | 70s | 90 XP | 160 XP | 20 Coins | Không mất mạng nào (3/3 Lives) |
| **Sentence Scramble**| 120s | 110 XP | 180 XP | 25 Coins | Độ chính xác 100% không đổi vị trí thừa |
| **Audio Blitz (Mới)**| 90s | 100 XP | 170 XP | 25 Coins | Đạt huy hiệu "Tai Vàng" (Không nghe chậm) |
| **Cloze Master (Mới)**| 100s | 110 XP | 185 XP | 25 Coins | Đạt Combo chuỗi 10/10 câu |
| **Grammar Detective**| 110s | 120 XP | 200 XP | 30 Coins | Đạt danh hiệu "Sherlock Holmes" (3/3 Kính lúp) |

### 6.2. Hệ Thống Huy Hiệu Mới (New Badges & Achievements)
Thêm 4 huy hiệu mới vào bảng `achievements` để tạo động lực khám phá trò chơi mới:
1. `GOLDEN_EAR`:
   - **Tên:** Đôi Tai Vàng (Golden Ear)
   - **Mô tả:** Hoàn thành 5 ván Audio Blitz với độ chính xác trên 90% và không dùng nút nghe chậm.
   - **Thưởng:** +150 XP, 50 Coins.
2. **`CONTEXT_PRO`:**
   - **Tên:** Bậc Thầy Ngữ Cảnh (Cloze Master Specialist)
   - **Mô tả:** Trả lời chính xác 50 câu điền từ trong Cloze Master.
   - **Thưởng:** +200 XP, 70 Coins.
3. **`SHERLOCK_GRAMMAR`:**
   - **Tên:** Thám Tử Bắt Lỗi (Grammar Sherlock)
   - **Mô tả:** Phá thành công 20 vụ án trong Grammar Detective mà không để mất quá 1 kính lúp mỗi ván.
   - **Thưởng:** +250 XP, 100 Coins.
4. **`POLYGLOT_CHAMPION`:**
   - **Tên:** Cao Thủ Toàn Năng (Hexa-Game Master)
   - **Mô tả:** Chơi thắng ít nhất 1 ván ở tất cả 6 mini-game trong cùng 1 ngày.
   - **Thưởng:** +300 XP, 120 Coins, 1 Thẻ Đóng Băng Chuỗi (Streak Freeze).

### 6.3. Nhiệm Vụ Hàng Ngày Bổ Sung (Daily Quests Expansion)
Bổ sung các nhiệm vụ mới xoay vòng trong ngày:
- *"Luyện đôi tai thính"*: Hoàn thành 2 ván Audio Blitz (+40 XP, +10 Coins).
- *"Điền từ chuẩn xác"*: Hoàn thành 1 ván Cloze Master với ít nhất 8/10 câu đúng (+50 XP, +15 Coins).
- *"Phá án thành công"*: Bắt đúng 5 lỗi ngữ pháp trong Grammar Detective (+60 XP, +20 Coins).

---

## 7. Thiết Kế Cơ Sở Dữ Liệu & Mô Hình Thực Thể (Database & Entity Models)

### 7.1. Cập Nhật Enum GameType
Enum `GameType` trong hệ thống được mở rộng:
```csharp
namespace LearnEnglish.Api.Domain.Enums;

public enum GameType
{
    WordMatch = 0,
    SpeedFalling = 1,
    SentenceScramble = 2,
    AudioBlitz = 3,       // Mới: Nghe và đánh vần chính tả
    ClozeMaster = 4,      // Mới: Điền từ vào chỗ trống theo ngữ cảnh
    GrammarDetective = 5  // Mới: Phát hiện và sửa lỗi ngữ pháp
}
```

### 7.2. Lược Đồ Bảng CSDL PostgreSQL (DDL)

```sql
-- 1. Bảng Dữ Liệu Câu Hỏi Audio Blitz (Nghe & Điền Chính Tả)
CREATE TABLE audio_blitz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    audio_url VARCHAR(500) NOT NULL,
    slow_audio_url VARCHAR(500) NULL,
    phonetic VARCHAR(100) NOT NULL,
    target_word VARCHAR(100) NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    definition_vi VARCHAR(255) NOT NULL,
    context_sentence TEXT NOT NULL,
    distractor_letters VARCHAR(20) NOT NULL DEFAULT 'ETAOIN',
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Easy' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audio_blitz_topic ON audio_blitz_questions(topic_id, difficulty_level);

-- 2. Bảng Dữ Liệu Câu Hỏi Cloze Master (Điền Từ Ngữ Cảnh)
CREATE TABLE cloze_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    context_sentence TEXT NOT NULL,          -- Ví dụ: "Despite facing delays, the team managed to [BLANK] their target."
    sentence_translation_vi TEXT NOT NULL,  -- Bản dịch nghĩa tiếng Việt
    part_of_speech_hint VARCHAR(50) NOT NULL, -- Gợi ý từ loại: verb, noun, adj, preposition
    correct_word VARCHAR(100) NOT NULL,
    correct_definition_vi VARCHAR(255) NOT NULL,
    distractors JSONB NOT NULL,              -- Mảng JSON chứa 3 lựa chọn nhiễu kèm nghĩa
    explanation_text TEXT NOT NULL,         -- Giải thích ngữ pháp (Mini Grammar Bite)
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Easy' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cloze_questions_topic ON cloze_questions(topic_id, difficulty_level);

-- 3. Bảng Dữ Liệu Vụ Án Grammar Detective (Thám Tử Ngữ Pháp)
CREATE TABLE grammar_detective_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    case_title VARCHAR(200) NOT NULL,        -- Tiêu đề vụ án: "Lỗi thì hoàn thành & Giới từ thời gian"
    raw_sentence TEXT NOT NULL,              -- Toàn văn câu có chứa lỗi
    token_sequence JSONB NOT NULL,           -- Mảng tokens của câu: [{ index: 0, text: "She", isError: false }, ...]
    error_token_index INT NOT NULL,          -- Vị trí index của token bị lỗi
    error_token_text VARCHAR(100) NOT NULL,  -- Từ bị sai: "since"
    correction_options JSONB NOT NULL,       -- Danh sách gợi ý sửa: ["for", "during", "from"]
    correct_replacement VARCHAR(100) NOT NULL, -- Từ sửa đúng: "for"
    grammar_rule_explanation TEXT NOT NULL,  -- Giải thích luật ngữ pháp chi tiết
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_grammar_detective_topic ON grammar_detective_questions(topic_id, difficulty_level);
```

### 7.3. C# Entity Framework Core Entity Classes (.NET 8)

```csharp
namespace LearnEnglish.Api.Domain.Entities;

public class AudioBlitzQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public Guid WordId { get; set; }
    public Word Word { get; set; } = null!;
    public string AudioUrl { get; set; } = string.Empty;
    public string? SlowAudioUrl { get; set; }
    public string Phonetic { get; set; } = string.Empty;
    public string TargetWord { get; set; } = string.Empty;
    public string PartOfSpeech { get; set; } = string.Empty;
    public string DefinitionVi { get; set; } = string.Empty;
    public string ContextSentence { get; set; } = string.Empty;
    public string DistractorLetters { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = "Easy";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ClozeDistractorItem
{
    public string Word { get; set; } = string.Empty;
    public string DefinitionVi { get; set; } = string.Empty;
}

public class ClozeQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public string ContextSentence { get; set; } = string.Empty;
    public string SentenceTranslationVi { get; set; } = string.Empty;
    public string PartOfSpeechHint { get; set; } = string.Empty;
    public string CorrectWord { get; set; } = string.Empty;
    public string CorrectDefinitionVi { get; set; } = string.Empty;
    public List<ClozeDistractorItem> Distractors { get; set; } = new();
    public string ExplanationText { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = "Easy";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class GrammarTokenItem
{
    public int Index { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsError { get; set; }
}

public class GrammarDetectiveQuestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public string CaseTitle { get; set; } = string.Empty;
    public string RawSentence { get; set; } = string.Empty;
    public List<GrammarTokenItem> TokenSequence { get; set; } = new();
    public int ErrorTokenIndex { get; set; }
    public string ErrorTokenText { get; set; } = string.Empty;
    public List<string> CorrectionOptions { get; set; } = new();
    public string CorrectReplacement { get; set; } = string.Empty;
    public string GrammarRuleExplanation { get; set; } = string.Empty;
    public string DifficultyLevel { get; set; } = "Medium";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### 7.4. TypeScript Interfaces (React Frontend)

```typescript
// Định nghĩa kiểu dữ liệu cho 3 mini-game mới trên Frontend

export type GameType = 
  | 'WordMatch' 
  | 'SpeedFalling' 
  | 'SentenceScramble' 
  | 'AudioBlitz' 
  | 'ClozeMaster' 
  | 'GrammarDetective';

// 1. Audio Blitz DTOs
export interface AudioBlitzItemDto {
  questionId: string;
  audioUrl: string;
  slowAudioUrl?: string;
  phonetic: string;
  partOfSpeech: string;
  definitionVi: string;
  contextSentence: string;
  targetWordLength: number;
  letterBank: string[]; // Chữ cái cấu thành + chữ cái gây nhiễu đã được xáo trộn
  timeLimitSeconds: number; // Mặc định 15
}

export interface AudioBlitzInitResponse {
  sessionId: string;
  gameType: 'AudioBlitz';
  initialLives: number; // 3
  items: AudioBlitzItemDto[];
}

// 2. Cloze Master DTOs
export interface ClozeOptionDto {
  id: string; // 'A', 'B', 'C', 'D'
  word: string;
  definitionVi: string;
}

export interface ClozeQuestionDto {
  questionId: string;
  contextSentence: string; // "Despite facing delays, the team managed to [BLANK] their target."
  sentenceTranslationVi: string;
  partOfSpeechHint: string;
  options: ClozeOptionDto[]; // 4 lựa chọn đã được đảo ngẫu nhiên
  explanationText: string;
}

export interface ClozeMasterInitResponse {
  sessionId: string;
  gameType: 'ClozeMaster';
  timePerQuestionSeconds: number; // 20
  totalQuestions: number; // 10
  questions: ClozeQuestionDto[];
}

// 3. Grammar Detective DTOs
export interface GrammarTokenDto {
  index: number;
  text: string;
}

export interface GrammarDetectiveCaseDto {
  caseId: string;
  caseTitle: string;
  tokens: GrammarTokenDto[]; // Từng từ/dấu câu riêng rẽ để click
  errorTokenIndex: number;   // Chỉ gửi về client khi đã trả lời hoặc để client tự validate
  correctionOptions: string[]; // 3 lựa chọn sửa lỗi
  correctReplacement: string;
  grammarRuleExplanation: string;
}

export interface GrammarDetectiveInitResponse {
  sessionId: string;
  gameType: 'GrammarDetective';
  initialMagnifiers: number; // 3
  timePerCaseSeconds: number; // 60
  totalCases: number; // 5
  cases: GrammarDetectiveCaseDto[];
}
```

---

## 8. Hợp Đồng API & Dữ Liệu Mẫu (API Contracts & Mock JSON)

### 8.1. Khởi Tạo Ván Chơi Cho Audio Blitz
- **Endpoint:** `POST /api/v1/games/start`
- **Request Payload:**
  ```json
  {
    "gameType": "AudioBlitz",
    "topicId": "e4a2d810-75b2-4d2c-9821-2a62d49c0012",
    "difficultyLevel": "Medium"
  }
  ```
- **Response Payload (200 OK):**
  ```json
  {
    "sessionId": "b901a182-4f32-47ba-89a1-5231efb70123",
    "gameType": "AudioBlitz",
    "initialLives": 3,
    "items": [
      {
        "questionId": "ab-001",
        "audioUrl": "https://assets.learnenglish.local/audio/comprehension.mp3",
        "slowAudioUrl": "https://assets.learnenglish.local/audio/comprehension_slow.mp3",
        "phonetic": "/ˌkɒm.prɪˈhen.ʃən/",
        "partOfSpeech": "Noun",
        "definitionVi": "Sự thấu hiểu, khả năng nhận thức",
        "contextSentence": "Reading ________ is an essential skill for all students.",
        "targetWordLength": 13,
        "letterBank": ["C", "O", "M", "P", "R", "E", "H", "E", "N", "S", "I", "O", "N", "A", "T", "L"],
        "timeLimitSeconds": 15
      },
      {
        "questionId": "ab-002",
        "audioUrl": "https://assets.learnenglish.local/audio/negotiate.mp3",
        "slowAudioUrl": "https://assets.learnenglish.local/audio/negotiate_slow.mp3",
        "phonetic": "/nəˈɡəʊ.ʃi.eɪt/",
        "partOfSpeech": "Verb",
        "definitionVi": "Đàm phán, thương lượng",
        "contextSentence": "The government refused to ________ with the rebels.",
        "targetWordLength": 9,
        "letterBank": ["N", "E", "G", "O", "T", "I", "A", "T", "E", "R", "S", "D"],
        "timeLimitSeconds": 15
      }
    ]
  }
  ```

### 8.2. Khởi Tạo Ván Chơi Cho Cloze Master
- **Endpoint:** `POST /api/v1/games/start`
- **Request Payload:**
  ```json
  {
    "gameType": "ClozeMaster",
    "topicId": "e4a2d810-75b2-4d2c-9821-2a62d49c0012",
    "difficultyLevel": "Medium"
  }
  ```
- **Response Payload (200 OK):**
  ```json
  {
    "sessionId": "c812b293-5e43-48cb-90b2-6342fac80234",
    "gameType": "ClozeMaster",
    "timePerQuestionSeconds": 20,
    "totalQuestions": 10,
    "questions": [
      {
        "questionId": "cm-001",
        "contextSentence": "Despite facing unexpected logistical delays, the team managed to [BLANK] their sales target for Q3.",
        "sentenceTranslationVi": "Dù gặp sự chậm trễ ngoài dự kiến về hậu cần, đội ngũ vẫn hoàn thành vượt chỉ tiêu doanh số quý 3.",
        "partOfSpeechHint": "verb (động từ nguyên mẫu)",
        "options": [
          { "id": "A", "word": "exceed", "definitionVi": "vượt quá, hoàn thành vượt mức" },
          { "id": "B", "word": "expand", "definitionVi": "mở rộng kích thước, diện tích" },
          { "id": "C", "word": "extend", "definitionVi": "kéo dài thời gian, kỳ hạn" },
          { "id": "D", "word": "excess", "definitionVi": "sự vượt quá (danh từ)" }
        ],
        "explanationText": "Collocation chuẩn xác là 'exceed a target' (vượt chỉ tiêu). 'Excess' là danh từ, 'extend' dùng kéo dài hạn, 'expand' dùng mở rộng quy mô."
      },
      {
        "questionId": "cm-002",
        "contextSentence": "All employees are highly encouraged to participate [BLANK] the upcoming annual workshop.",
        "sentenceTranslationVi": "Tất cả nhân viên được khuyến khích tích cực tham gia vào buổi hội thảo thường niên sắp tới.",
        "partOfSpeechHint": "preposition (giới từ)",
        "options": [
          { "id": "A", "word": "in", "definitionVi": "trong, vào trong (đi với participate)" },
          { "id": "B", "word": "at", "definitionVi": "tại địa điểm" },
          { "id": "C", "word": "on", "definitionVi": "trên bề mặt" },
          { "id": "D", "word": "with", "definitionVi": "cùng với" }
        ],
        "explanationText": "Cụm động từ cố định 'participate in something' có nghĩa là tham gia vào một hoạt động hoặc sự kiện."
      }
    ]
  }
  ```

### 8.3. Khởi Tạo Ván Chơi Cho Grammar Detective
- **Endpoint:** `POST /api/v1/games/start`
- **Request Payload:**
  ```json
  {
    "gameType": "GrammarDetective",
    "topicId": "e4a2d810-75b2-4d2c-9821-2a62d49c0012",
    "difficultyLevel": "Medium"
  }
  ```
- **Response Payload (200 OK):**
  ```json
  {
    "sessionId": "d923c304-6f54-49dc-01c3-7453ebd90345",
    "gameType": "GrammarDetective",
    "initialMagnifiers": 3,
    "timePerCaseSeconds": 60,
    "totalCases": 5,
    "cases": [
      {
        "caseId": "gd-001",
        "caseTitle": "Vụ Án #1: Giới Từ Thời Gian & Thì Hiện Tại Hoàn Thành",
        "tokens": [
          { "index": 0, "text": "She" },
          { "index": 1, "text": "has" },
          { "index": 2, "text": "worked" },
          { "index": 3, "text": "as" },
          { "index": 4, "text": "a" },
          { "index": 5, "text": "software" },
          { "index": 6, "text": "engineer" },
          { "index": 7, "text": "in" },
          { "index": 8, "text": "this" },
          { "index": 9, "text": "company" },
          { "index": 10, "text": "since" },
          { "index": 11, "text": "five" },
          { "index": 12, "text": "years" },
          { "index": 13, "text": "." }
        ],
        "errorTokenIndex": 10,
        "correctionOptions": ["for", "during", "from"],
        "correctReplacement": "for",
        "grammarRuleExplanation": "Với khoảng thời gian kéo dài ('five years'), ta phải dùng giới từ 'for'. Giới từ 'since' chỉ dùng với mốc thời gian xác định (ví dụ: 'since 2019')."
      },
      {
        "caseId": "gd-002",
        "caseTitle": "Vụ Án #2: Sự Hòa Hợp Giữa Chủ Ngữ Và Động Từ (Subject-Verb Agreement)",
        "tokens": [
          { "index": 0, "text": "The" },
          { "index": 1, "text": "cost" },
          { "index": 2, "text": "of" },
          { "index": 3, "text": "all" },
          { "index": 4, "text": "these" },
          { "index": 5, "text": "new" },
          { "index": 6, "text": "equipment" },
          { "index": 7, "text": "are" },
          { "index": 8, "text": "higher" },
          { "index": 9, "text": "than" },
          { "index": 10, "text": "expected" },
          { "index": 11, "text": "." }
        ],
        "errorTokenIndex": 7,
        "correctionOptions": ["is", "were", "being"],
        "correctReplacement": "is",
        "grammarRuleExplanation": "Chủ ngữ chính của câu là danh từ số ít 'The cost' (chứ không phải 'equipment'), do đó động từ to be phải chia số ít là 'is'."
      }
    ]
  }
  ```

---

## 9. Tiêu Chí Nghiệm Thu (Acceptance Criteria - Given-When-Then)

Dành cho **Tech Lead**, **QA Engineer** và **Developer** dùng làm căn cứ kiểm thử tự động (Unit Test / Integration Test / E2E Test) và nghiệm thu chức năng:

### 9.1. Kịch Bản Kiểm Thử Mini-Game 4: Audio Blitz

#### Kịch bản 1.1: Nghe audio và nhập đúng chính tả
- **Given:** Người chơi đang trong ván Audio Blitz tại từ có độ dài 9 ký tự (`NEGOTIATE`).
- **When:** Người chơi nghe audio và nhập tuần tự từng chữ cái `n - e - g - o - t - i - a - t - e`.
- **Then:**
  - Hệ thống ghi nhận trạng thái từ là `Correct`.
  - Hiệu ứng đổi màu xanh ngọc bích `bg-emerald-500` và phát âm thanh `audio-spell-correct.mp3`.
  - Điểm số được cộng: $100$ điểm cơ sở + Speed bonus (nếu hoàn thành nhanh) $\times$ Combo Multiplier.
  - Chuỗi Combo tăng thêm $+1$.
  - Tự động chuyển sang từ tiếp theo sau $700\text{ms}$.

#### Kịch bản 1.2: Sử dụng nút nghe chậm 0.75x
- **Given:** Người chơi chưa nghe rõ từ ở tốc độ bình thường 1.0x.
- **When:** Người chơi click vào nút `🐢 Nghe chậm 0.75x`.
- **Then:**
  - File âm thanh `slowAudioUrl` được phát với tốc độ 0.75x rõ từng phụ âm cuối.
  - Cờ `isPerfectEar` của câu đó bị gán thành `false` (mất điểm thưởng Perfect Ear 30 điểm khi tổng kết câu).

#### Kịch bản 1.3: Nhập sai ký tự và hết 3 mạng sống
- **Given:** Người chơi còn 1 mạng sống (`lives = 1`).
- **When:** Người chơi điền sai từ hoặc để thời gian 15s đếm ngược về 0.
- **Then:**
  - Mạng sống giảm về 0 (`lives = 0`).
  - Ván chơi dừng ngay lập tức, chuyển sang trạng thái `GameOver`.
  - Modal tổng kết (Summary Modal) xuất hiện hiển thị số điểm tích lũy, XP đạt được và cho phép bấm "Chơi lại" (Play Again) hoặc "Về sảnh" (Back to Lobby).

---

### 9.2. Kịch Bản Kiểm Thử Mini-Game 5: Cloze Master

#### Kịch bản 2.1: Chọn đáp án chính xác và xem Mini Grammar Bite
- **Given:** Người chơi đang ở câu hỏi Cloze Master với 4 lựa chọn `[A] exceed`, `[B] expand`, `[C] extend`, `[D] excess`.
- **When:** Người chơi bấm chọn thẻ `[A] exceed`.
- **Then:**
  - Thẻ `[A]` phát sáng viền xanh lá `border-emerald-500 bg-emerald-50`.
  - Hộp giải thích Mini Grammar Bite mở ra giải thích Collocation *"exceed one's target"*.
  - Điểm được cộng theo thời gian còn lại trên đồng hồ.
  - Nút "Câu tiếp theo" được kích hoạt.

#### Kịch bản 2.2: Kích hoạt quyền trợ giúp 50:50
- **Given:** Người chơi đang phân vân giữa 4 đáp án và chưa dùng quyền trợ giúp 50:50.
- **When:** Người chơi click nút `💡 50:50`.
- **Then:**
  - 2 đáp án sai bị làm mờ xám (`opacity-30 pointer-events-none`).
  - Chỉ còn lại 1 đáp án đúng và 1 đáp án gây nhiễu trên giao diện.
  - Nút `50:50` chuyển sang trạng thái đã sử dụng (`disabled`).
  - Điểm tối đa nhận được của câu đó áp dụng hệ số $70\%$.

---

### 9.3. Kịch Bản Kiểm Thử Mini-Game 6: Grammar Detective

#### Kịch bản 3.1: Chạm đúng từ sai và sửa đúng phương án
- **Given:** Người chơi đối mặt câu: *"The cost of all these new equipment [are] higher than expected."*
- **When:**
  1. Người chơi click vào token `[are]`.
  2. Popup sửa lỗi mở ra với 3 lựa chọn `[is]`, `[were]`, `[being]`.
  3. Người chơi chọn `[is]`.
- **Then:**
  - Token `[are]` biến đổi thành `[is]` màu xanh ngọc bích `bg-emerald-500 text-white`.
  - Âm thanh `case-solved.mp3` kích hoạt.
  - Điểm nhận được gồm 60 điểm Spot + 60 điểm Fix + Điểm thưởng thời gian.
  - Vụ án được đánh dấu `Solved`, mở tiếp vụ án tiếp theo.

#### Kịch bản 3.2: Click nhầm vào từ đúng (Bắt nhầm người vô tội)
- **Given:** Câu văn có lỗi ở token index 10 (`since`), người chơi còn 3 Kính lúp.
- **When:** Người chơi click vào token `[engineer]` (từ hoàn toàn đúng).
- **Then:**
  - Token `[engineer]` rung lắc viền đỏ trong $500\text{ms}$.
  - Số Kính lúp giảm từ 3 xuống 2 (`magnifiers = 2`).
  - Âm thanh `detective-buzzer.mp3` vang lên.
  - Vụ án vẫn tiếp tục cho đến khi người chơi tìm đúng từ sai hoặc hết kính lúp.

---

## 10. Kế Hoạch Chuyển Giao & Phân Công Nhiệm Vụ (Task Delegation Breakdown)

Để dự án được triển khai nhanh chóng, chuẩn xác và đúng theo quy trình phân công của công ty, Product BA đề xuất cấu trúc phân công cụ thể như sau:

### Nhiệm Vụ 1: UI/UX Designer (`c74ffe18-11a2-47b9-a7f4-a3600b2f07c0`)
- **Tên Task:** Thiết kế Design System, Tailwind UI Tokens & Layout Components cho 3 Mini-game Mới (Audio Blitz, Cloze Master, Grammar Detective).
- **Phạm vi bàn giao:**
  - Wireframe và UI components cho màn hình nghe gõ chính tả (Letter tiles, Vinyl/Soundwave animation, Slow-motion switch).
  - Giao diện câu hỏi điền từ ngữ cảnh (Cloze context card, 4 smart option cards, Mini Grammar Bite popup).
  - Giao diện thám tử phá án (Case file theme, clickable sentence tokens, Magnifier life icons, Crime fix modal).
  - Cập nhật điều hướng Lobby để lựa chọn 6 mini-game mượt mà.

### Nhiệm Vụ 2: Senior Fullstack Engineer (`e78be358-35da-419c-bf21-24a27e284561`)
- **Tên Task:** Triển khai Backend .NET 8 (Entities, DTOs, GameService, Mock Data Seed) và Frontend React cho 3 Mini-game Mới.
- **Điều kiện phụ thuộc (Blocked by):** Chờ hoàn thành thiết kế từ UI/UX Designer.
- **Phạm vi bàn giao:**
  - Thêm Migration EF Core cho 3 bảng câu hỏi mới (`audio_blitz_questions`, `cloze_questions`, `grammar_detective_questions`).
  - Viết Service sinh dữ liệu câu hỏi theo chủ đề và độ khó, tích hợp tính điểm và hoàn thành session trong `GameService.cs`.
  - Tạo 3 Game Components trong React: `AudioBlitzGame.tsx`, `ClozeMasterGame.tsx`, `GrammarDetectiveGame.tsx`.
  - Tích hợp âm thanh, bàn phím ảo, phím tắt vật lý và kiểm tra build toàn dự án thành công.

### Nhiệm Vụ 3: Giám Sát & Điều Phối Kỹ Thuật: Tech Lead / Architect (`11dba413-036f-4ce1-950e-252419384dce`)
- Thẩm định giải pháp kiến trúc dữ liệu và API endpoints.
- Giám sát code review, chất lượng mã nguồn và đảm bảo tiêu chí nghiệm thu Acceptance Criteria.

---
*Tài liệu được soạn thảo và kiểm duyệt bởi Senior Product Business Analyst. Mọi thắc mắc cần làm rõ xin liên hệ trực tiếp trong luồng thảo luận.*

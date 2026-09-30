import { create } from 'zustand';
import {
  SkyBlasterMode,
  BotDifficulty,
  SkyBlasterStage,
  FallingCrate,
  SkyBlasterRound,
  Player3DState,
  SkyBlasterMatchResult,
  ArenaHazard,
  FallingNuclearBomb,
} from '../types/skyBlaster';
import { skyBlasterAudio } from '../utils/skyBlasterAudio';

/**
 * Master Vocabulary Pool of 25 Rich Distinct Listening Rounds
 * Every match selects 15 distinct unrepeated words in random order!
 */
export const MASTER_ROUNDS_POOL: Omit<SkyBlasterRound, 'roundNumber'>[] = [
  {
    targetWord: 'Trophy',
    ipa: '/ˈtrəʊ.fi/',
    vietnameseMeaning: 'Cúp vô địch / Giải thưởng',
    category: 'Vinh quang & Thể thao',
    hintSentence: 'The champion lifted the golden trophy high in the air.',
    crates: [
      { id: 'c_trophy', word: 'Trophy', vietnamese: 'Cúp vô địch', icon: '🏆', isCorrect: true, colorHex: '#ffd700' },
      { id: 'c_coffee', word: 'Coffee', vietnamese: 'Cà phê', icon: '☕', isCorrect: false, colorHex: '#a0522d' },
      { id: 'c_traffic', word: 'Traffic', vietnamese: 'Giao thông', icon: '🚦', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_toffee', word: 'Toffee', vietnamese: 'Kẹo bơ cứng', icon: '🍬', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_tough', word: 'Tough', vietnamese: 'Bền bỉ / Khó nhằn', icon: '🥊', isCorrect: false, colorHex: '#57606f' },
    ],
  },
  {
    targetWord: 'Thunder',
    ipa: '/ˈθʌn.dər/',
    vietnameseMeaning: 'Tiếng sấm sét rền vang',
    category: 'Thời tiết & Thiên nhiên',
    hintSentence: 'A loud crash of thunder shook the entire room.',
    crates: [
      { id: 'c_thunder', word: 'Thunder', vietnamese: 'Tiếng sấm', icon: '⚡', isCorrect: true, colorHex: '#00f2fe' },
      { id: 'c_under', word: 'Under', vietnamese: 'Ở dưới', icon: '⬇️', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_tender', word: 'Tender', vietnamese: 'Dịu dàng / Mềm', icon: '🥩', isCorrect: false, colorHex: '#ff6b81' },
      { id: 'c_hunter', word: 'Hunter', vietnamese: 'Thợ săn', icon: '🏹', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_blunder', word: 'Blunder', vietnamese: 'Sai lầm ngớ ngẩn', icon: '🤦', isCorrect: false, colorHex: '#a55eea' },
    ],
  },
  {
    targetWord: 'Bicycle',
    ipa: '/ˈbaɪ.sɪ.kəl/',
    vietnameseMeaning: 'Xe đạp 2 bánh',
    category: 'Phương tiện giao thông',
    hintSentence: 'He rides his bicycle to school every sunny morning.',
    crates: [
      { id: 'c_bicycle', word: 'Bicycle', vietnamese: 'Xe đạp', icon: '🚲', isCorrect: true, colorHex: '#2ed573' },
      { id: 'c_motorcycle', word: 'Motorcycle', vietnamese: 'Xe máy', icon: '🏍️', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_circle', word: 'Circle', vietnamese: 'Hình tròn', icon: '⭕', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_recycle', word: 'Recycle', vietnamese: 'Tái chế', icon: '♻️', isCorrect: false, colorHex: '#1e90ff' },
      { id: 'c_vehicle', word: 'Vehicle', vietnamese: 'Phương tiện xe', icon: '🚗', isCorrect: false, colorHex: '#ffa502' },
    ],
  },
  {
    targetWord: 'Microphone',
    ipa: '/ˈmaɪ.krə.fəʊn/',
    vietnameseMeaning: 'Cái micro thu âm',
    category: 'Âm nhạc & Thiết bị',
    hintSentence: 'The singer grabbed the microphone and began to sing.',
    crates: [
      { id: 'c_microphone', word: 'Microphone', vietnamese: 'Micro', icon: '🎤', isCorrect: true, colorHex: '#ffd700' },
      { id: 'c_telephone', word: 'Telephone', vietnamese: 'Điện thoại bàn', icon: '☎️', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_megaphone', word: 'Megaphone', vietnamese: 'Loa phóng thanh', icon: '📢', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_saxophone', word: 'Saxophone', vietnamese: 'Kèn saxo', icon: '🎷', isCorrect: false, colorHex: '#a55eea' },
      { id: 'c_headphone', word: 'Headphone', vietnamese: 'Tai nghe chụp', icon: '🎧', isCorrect: false, colorHex: '#00f2fe' },
    ],
  },
  {
    targetWord: 'Volcano',
    ipa: '/vɒlˈkeɪ.nəʊ/',
    vietnameseMeaning: 'Núi lửa phun trào',
    category: 'Địa lý & Thiên nhiên',
    hintSentence: 'Hot lava erupted violently from the peak of the volcano.',
    crates: [
      { id: 'c_volcano', word: 'Volcano', vietnamese: 'Núi lửa', icon: '🌋', isCorrect: true, colorHex: '#ff4757' },
      { id: 'c_tornado', word: 'Tornado', vietnamese: 'Lốc xoáy', icon: '🌪️', isCorrect: false, colorHex: '#a4b0be' },
      { id: 'c_hurricane', word: 'Hurricane', vietnamese: 'Bão nhiệt đới', icon: '🌀', isCorrect: false, colorHex: '#1e90ff' },
      { id: 'c_tsunami', word: 'Tsunami', vietnamese: 'Sóng thần', icon: '🌊', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_avalanche', word: 'Avalanche', vietnamese: 'Lở tuyết', icon: '🏔️', isCorrect: false, colorHex: '#ffffff' },
    ],
  },
  {
    targetWord: 'Astronaut',
    ipa: '/ˈæs.trə.nɔːt/',
    vietnameseMeaning: 'Phi hành gia vũ trụ',
    category: 'Khoa học vũ trụ',
    hintSentence: 'The astronaut floated weightlessly in outer space.',
    crates: [
      { id: 'c_astronaut', word: 'Astronaut', vietnamese: 'Phi hành gia', icon: '👨‍🚀', isCorrect: true, colorHex: '#00f2fe' },
      { id: 'c_astronomer', word: 'Astronomer', vietnamese: 'Nhà thiên văn', icon: '🔭', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_pilot', word: 'Pilot', vietnamese: 'Phi công', icon: '👨‍✈️', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_astrology', word: 'Astrology', vietnamese: 'Thuật chiêm tinh', icon: '🔮', isCorrect: false, colorHex: '#a55eea' },
      { id: 'c_cosmonaut', word: 'Cosmonaut', vietnamese: 'Nhà du hành Nga', icon: '🚀', isCorrect: false, colorHex: '#ff6b81' },
    ],
  },
  {
    targetWord: 'Butterfly',
    ipa: '/ˈbʌt.ə.flaɪ/',
    vietnameseMeaning: 'Con bướm rực rỡ',
    category: 'Sinh vật học',
    hintSentence: 'A colorful butterfly rested gently on the flower petals.',
    crates: [
      { id: 'c_butterfly', word: 'Butterfly', vietnamese: 'Con bướm', icon: '🦋', isCorrect: true, colorHex: '#ff6b81' },
      { id: 'c_dragonfly', word: 'Dragonfly', vietnamese: 'Chuồn chuồn', icon: '🦗', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_firefly', word: 'Firefly', vietnamese: 'Đom đóm', icon: '✨', isCorrect: false, colorHex: '#ffd700' },
      { id: 'c_butter', word: 'Butter', vietnamese: 'Bơ ăn', icon: '🧈', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_caterpillar', word: 'Caterpillar', vietnamese: 'Sâu bướm', icon: '🐛', isCorrect: false, colorHex: '#7bed9f' },
    ],
  },
  {
    targetWord: 'Submarine',
    ipa: '/ˌsʌb.məˈriːn/',
    vietnameseMeaning: 'Tàu ngầm lặn sâu',
    category: 'Đại dương & Phương tiện',
    hintSentence: 'The yellow submarine dove thousands of meters beneath the waves.',
    crates: [
      { id: 'c_submarine', word: 'Submarine', vietnamese: 'Tàu ngầm', icon: '🚢', isCorrect: true, colorHex: '#1e90ff' },
      { id: 'c_sailboat', word: 'Sailboat', vietnamese: 'Thuyền buồm', icon: '⛵', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_trampoline', word: 'Trampoline', vietnamese: 'Bạt nhún lò xo', icon: '🎪', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_marine', word: 'Marine', vietnamese: 'Thuộc biển', icon: '🐬', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_airplane', word: 'Airplane', vietnamese: 'Máy bay', icon: '✈️', isCorrect: false, colorHex: '#a4b0be' },
    ],
  },
  {
    targetWord: 'Pyramid',
    ipa: '/ˈpɪr.ə.mɪd/',
    vietnameseMeaning: 'Kim tự tháp Ai Cập',
    category: 'Kỳ quan lịch sử',
    hintSentence: 'The Great Pyramid has stood proudly in the desert for thousands of years.',
    crates: [
      { id: 'c_pyramid', word: 'Pyramid', vietnamese: 'Kim tự tháp', icon: '🏜️', isCorrect: true, colorHex: '#ffd700' },
      { id: 'c_prism', word: 'Prism', vietnamese: 'Lăng kính', icon: '💎', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_triangle', word: 'Triangle', vietnamese: 'Hình tam giác', icon: '📐', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_diamond_p', word: 'Diamond', vietnamese: 'Kim cương', icon: '🔷', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_tower', word: 'Tower', vietnamese: 'Ngọn tháp cao', icon: '🗼', isCorrect: false, colorHex: '#ff4757' },
    ],
  },
  {
    targetWord: 'Compass',
    ipa: '/ˈkʌm.pəs/',
    vietnameseMeaning: 'La bàn định hướng',
    category: 'Thám hiểm & Dụng cụ',
    hintSentence: 'Always check your compass when navigating through the deep jungle.',
    crates: [
      { id: 'c_compass', word: 'Compass', vietnamese: 'La bàn', icon: '🧭', isCorrect: true, colorHex: '#ffa502' },
      { id: 'c_compose', word: 'Compose', vietnamese: 'Soạn nhạc', icon: '🎼', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_compact', word: 'Compact', vietnamese: 'Gọn gàng', icon: '📦', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_campus', word: 'Campus', vietnamese: 'Khuôn viên trường', icon: '🏫', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_compare', word: 'Compare', vietnamese: 'So sánh', icon: '⚖️', isCorrect: false, colorHex: '#a4b0be' },
    ],
  },
  {
    targetWord: 'Dinosaur',
    ipa: '/ˈdaɪ.nə.sɔːr/',
    vietnameseMeaning: 'Khủng long thời tiền sử',
    category: 'Động vật cổ đại',
    hintSentence: 'Fossil bones revealed the massive size of the ancient dinosaur.',
    crates: [
      { id: 'c_dinosaur', word: 'Dinosaur', vietnamese: 'Khủng long', icon: '🦖', isCorrect: true, colorHex: '#2ed573' },
      { id: 'c_crocodile', word: 'Crocodile', vietnamese: 'Cá sấu', icon: '🐊', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_rhino', word: 'Rhinoceros', vietnamese: 'Tê giác', icon: '🦏', isCorrect: false, colorHex: '#a4b0be' },
      { id: 'c_dragon_d', word: 'Dragon', vietnamese: 'Con rồng', icon: '🐉', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_lizard_d', word: 'Lizard', vietnamese: 'Thằn lằn', icon: '🦎', isCorrect: false, colorHex: '#00f2fe' },
    ],
  },
  {
    targetWord: 'Telescope',
    ipa: '/ˈtel.ɪ.skəʊp/',
    vietnameseMeaning: 'Kính thiên văn ngắm sao',
    category: 'Vũ trụ học',
    hintSentence: 'Through the telescope, the distant rings of Saturn were visible.',
    crates: [
      { id: 'c_telescope', word: 'Telescope', vietnamese: 'Kính thiên văn', icon: '🔭', isCorrect: true, colorHex: '#70a1ff' },
      { id: 'c_microscope', word: 'Microscope', vietnamese: 'Kính hiển vi', icon: '🔬', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_periscope', word: 'Periscope', vietnamese: 'Kính tiềm vọng', icon: '👀', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_binoculars', word: 'Binoculars', vietnamese: 'Ống nhòm', icon: '👓', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_kaleidoscope', word: 'Kaleidoscope', vietnamese: 'Kính vạn hoa', icon: '🎆', isCorrect: false, colorHex: '#ff6b81' },
    ],
  },
  {
    targetWord: 'Helicopter',
    ipa: '/ˈhel.ɪˌkɒp.tər/',
    vietnameseMeaning: 'Trực thăng cánh quạt',
    category: 'Hàng không',
    hintSentence: 'The rescue helicopter hovered steadily over the choppy sea.',
    crates: [
      { id: 'c_helicopter', word: 'Helicopter', vietnamese: 'Trực thăng', icon: '🚁', isCorrect: true, colorHex: '#ffa502' },
      { id: 'c_propeller', word: 'Propeller', vietnamese: 'Cánh quạt', icon: '🌀', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_hovercraft', word: 'Hovercraft', vietnamese: 'Tàu đệm khí', icon: '🚤', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_parachute', word: 'Parachute', vietnamese: 'Cái dù lượn', icon: '🪂', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_spaceship', word: 'Spaceship', vietnamese: 'Phi thuyền', icon: '🚀', isCorrect: false, colorHex: '#00f2fe' },
    ],
  },
  {
    targetWord: 'Dragon',
    ipa: '/ˈdræɡ.ən/',
    vietnameseMeaning: 'Rồng thần thoại phun lửa',
    category: 'Thần thoại huyền ảo',
    hintSentence: 'The mythical dragon flew high above the mountain breathing fire.',
    crates: [
      { id: 'c_dragon', word: 'Dragon', vietnamese: 'Con rồng', icon: '🐉', isCorrect: true, colorHex: '#ff4757' },
      { id: 'c_wagon', word: 'Wagon', vietnamese: 'Xe ngựa kéo', icon: '🛒', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_lizard', word: 'Lizard', vietnamese: 'Thằn lằn', icon: '🦎', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_dungeon', word: 'Dungeon', vietnamese: 'Hầm ngục tối', icon: '🗝️', isCorrect: false, colorHex: '#57606f' },
      { id: 'c_monster', word: 'Monster', vietnamese: 'Quái vật', icon: '👾', isCorrect: false, colorHex: '#a55eea' },
    ],
  },
  {
    targetWord: 'Galaxy',
    ipa: '/ˈɡæl.ək.si/',
    vietnameseMeaning: 'Thiên hà dải ngân hà',
    category: 'Vũ trụ vô tận',
    hintSentence: 'Billions of glowing stars swirl together inside our spiral galaxy.',
    crates: [
      { id: 'c_galaxy', word: 'Galaxy', vietnamese: 'Dải ngân hà', icon: '🌌', isCorrect: true, colorHex: '#00f2fe' },
      { id: 'c_gravity', word: 'Gravity', vietnamese: 'Trọng lực', icon: '🍎', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_legacy', word: 'Legacy', vietnamese: 'Di sản để lại', icon: '📜', isCorrect: false, colorHex: '#ffd700' },
      { id: 'c_planet', word: 'Planet', vietnamese: 'Hành tinh', icon: '🪐', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_universe', word: 'Universe', vietnamese: 'Vũ trụ bao la', icon: '✨', isCorrect: false, colorHex: '#a55eea' },
    ],
  },
  {
    targetWord: 'Diamond',
    ipa: '/ˈdaɪə.mənd/',
    vietnameseMeaning: 'Viên kim cương quý giá',
    category: 'Đá quý & Khoáng sản',
    hintSentence: 'The brilliant diamond sparkled with dazzling colors under the spotlight.',
    crates: [
      { id: 'c_diamond', word: 'Diamond', vietnamese: 'Kim cương', icon: '💎', isCorrect: true, colorHex: '#00f2fe' },
      { id: 'c_almond', word: 'Almond', vietnamese: 'Hạt hạnh nhân', icon: '🥜', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_dynamic', word: 'Dynamic', vietnamese: 'Năng động', icon: '⚡', isCorrect: false, colorHex: '#ffd700' },
      { id: 'c_demand', word: 'Demand', vietnamese: 'Nhu cầu / Yêu cầu', icon: '📈', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_island', word: 'Island', vietnamese: 'Hòn đảo nhỏ', icon: '🏝️', isCorrect: false, colorHex: '#2ed573' },
    ],
  },
  {
    targetWord: 'Kangaroo',
    ipa: '/ˌkæŋ.ɡərˈuː/',
    vietnameseMeaning: 'Chuột túi nước Úc',
    category: 'Thế giới động vật',
    hintSentence: 'A wild kangaroo jumped gracefully across the wide grasslands.',
    crates: [
      { id: 'c_kangaroo', word: 'Kangaroo', vietnamese: 'Chuột túi', icon: '🦘', isCorrect: true, colorHex: '#ffa502' },
      { id: 'c_bamboo', word: 'Bamboo', vietnamese: 'Cây tre xanh', icon: '🎋', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_shampoo', word: 'Shampoo', vietnamese: 'Dầu gội đầu', icon: '🧴', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_igloo', word: 'Igloo', vietnamese: 'Lều tuyết lặn', icon: '🛖', isCorrect: false, colorHex: '#a4b0be' },
      { id: 'c_cockatoo', word: 'Cockatoo', vietnamese: 'Chim vẹt mào', icon: '🦜', isCorrect: false, colorHex: '#ff6b81' },
    ],
  },
  {
    targetWord: 'Rainbow',
    ipa: '/ˈreɪn.bəʊ/',
    vietnameseMeaning: 'Cầu vồng bảy sắc',
    category: 'Hiện tượng thời tiết',
    hintSentence: 'A colorful rainbow formed across the blue sky right after the rain.',
    crates: [
      { id: 'c_rainbow', word: 'Rainbow', vietnamese: 'Cầu vồng', icon: '🌈', isCorrect: true, colorHex: '#ff6b81' },
      { id: 'c_elbow', word: 'Elbow', vietnamese: 'Khuỷu tay', icon: '💪', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_window', word: 'Window', vietnamese: 'Cửa sổ kính', icon: '🪟', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_shadow', word: 'Shadow', vietnamese: 'Bóng râm', icon: '👤', isCorrect: false, colorHex: '#57606f' },
      { id: 'c_arrow', word: 'Arrow', vietnamese: 'Mũi tên nhọn', icon: '🏹', isCorrect: false, colorHex: '#2ed573' },
    ],
  },
  {
    targetWord: 'Chocolate',
    ipa: '/ˈtʃɒk.lət/',
    vietnameseMeaning: 'Thanh sô-cô-la ngọt ngào',
    category: 'Ẩm thực & Món ăn',
    hintSentence: 'She enjoyed a piece of rich dark chocolate after dinner.',
    crates: [
      { id: 'c_chocolate', word: 'Chocolate', vietnamese: 'Sô-cô-la', icon: '🍫', isCorrect: true, colorHex: '#8b4513' },
      { id: 'c_chalk', word: 'Chalk', vietnamese: 'Phấn viết bảng', icon: '🖍️', isCorrect: false, colorHex: '#ffffff' },
      { id: 'c_pocket', word: 'Pocket', vietnamese: 'Túi áo quần', icon: '👖', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_rocket', word: 'Rocket', vietnamese: 'Tên lửa phóng', icon: '🚀', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_omelet', word: 'Omelet', vietnamese: 'Trứng cuộn chiên', icon: '🍳', isCorrect: false, colorHex: '#ffd700' },
    ],
  },
  {
    targetWord: 'Pineapple',
    ipa: '/ˈpaɪnˌæp.əl/',
    vietnameseMeaning: 'Quả dứa / Quả thơm',
    category: 'Trái cây nhiệt đới',
    hintSentence: 'Sweet pineapple juice is the most refreshing drink in the hot summer.',
    crates: [
      { id: 'c_pineapple', word: 'Pineapple', vietnamese: 'Quả dứa', icon: '🍍', isCorrect: true, colorHex: '#ffd700' },
      { id: 'c_apple', word: 'Apple', vietnamese: 'Quả táo đỏ', icon: '🍎', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_candle', word: 'Candle', vietnamese: 'Cây nến sáp', icon: '🕯️', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_needle', word: 'Needle', vietnamese: 'Cây kim may', icon: '🪡', isCorrect: false, colorHex: '#a4b0be' },
      { id: 'c_pancake', word: 'Pancake', vietnamese: 'Bánh kếp tròn', icon: '🥞', isCorrect: false, colorHex: '#d2b48c' },
    ],
  },
  {
    targetWord: 'Castle',
    ipa: '/ˈkɑː.səl/',
    vietnameseMeaning: 'Lâu đài nguy nga',
    category: 'Kiến trúc cổ điển',
    hintSentence: 'The majestic stone castle stood on top of the rugged hill.',
    crates: [
      { id: 'c_castle', word: 'Castle', vietnamese: 'Lâu đài', icon: '🏰', isCorrect: true, colorHex: '#70a1ff' },
      { id: 'c_cattle', word: 'Cattle', vietnamese: 'Đàn gia súc', icon: '🐄', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_battle', word: 'Battle', vietnamese: 'Trận chiến tranh', icon: '⚔️', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_capsule', word: 'Capsule', vietnamese: 'Viên con nhộng', icon: '💊', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_whistle', word: 'Whistle', vietnamese: 'Cái còi thổi', icon: '🪈', isCorrect: false, colorHex: '#ffa502' },
    ],
  },
  {
    targetWord: 'Guitar',
    ipa: '/ɡɪˈtɑːr/',
    vietnameseMeaning: 'Cây đàn ghi-ta',
    category: 'Nhạc cụ âm thanh',
    hintSentence: 'He played a gentle melody on his acoustic guitar by the campfire.',
    crates: [
      { id: 'c_guitar', word: 'Guitar', vietnamese: 'Đàn ghi-ta', icon: '🎸', isCorrect: true, colorHex: '#ff6b81' },
      { id: 'c_cigar', word: 'Cigar', vietnamese: 'Điếu xì gà', icon: '🚬', isCorrect: false, colorHex: '#a0522d' },
      { id: 'c_radar', word: 'Radar', vietnamese: 'Máy quét ra-đa', icon: '📡', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_cheetah', word: 'Cheetah', vietnamese: 'Báo săn đốm', icon: '🐆', isCorrect: false, colorHex: '#ffa502' },
      { id: 'c_avatar', word: 'Avatar', vietnamese: 'Hình đại diện', icon: '👤', isCorrect: false, colorHex: '#70a1ff' },
    ],
  },
  {
    targetWord: 'Anchor',
    ipa: '/ˈæŋ.kər/',
    vietnameseMeaning: 'Mỏ neo tàu thuyền',
    category: 'Hàng hải biển sâu',
    hintSentence: 'The crew dropped the heavy steel anchor into the calm harbor.',
    crates: [
      { id: 'c_anchor', word: 'Anchor', vietnamese: 'Mỏ neo', icon: '⚓', isCorrect: true, colorHex: '#00f2fe' },
      { id: 'c_anger', word: 'Anger', vietnamese: 'Cơn tức giận', icon: '😡', isCorrect: false, colorHex: '#ff4757' },
      { id: 'c_archer', word: 'Archer', vietnamese: 'Xạ thủ cung tên', icon: '🏹', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_banker', word: 'Banker', vietnamese: 'Chuyên viên ngân hàng', icon: '🏦', isCorrect: false, colorHex: '#ffd700' },
      { id: 'c_tanker', word: 'Tanker', vietnamese: 'Tàu chở dầu', icon: '🚢', isCorrect: false, colorHex: '#57606f' },
    ],
  },
  {
    targetWord: 'Sandwich',
    ipa: '/ˈsæn.wɪdʒ/',
    vietnameseMeaning: 'Bánh mì kẹp thịt',
    category: 'Món ăn nhanh',
    hintSentence: 'He packed a delicious chicken sandwich for his afternoon picnic.',
    crates: [
      { id: 'c_sandwich', word: 'Sandwich', vietnamese: 'Bánh mì kẹp', icon: '🥪', isCorrect: true, colorHex: '#ffa502' },
      { id: 'c_bandage', word: 'Bandage', vietnamese: 'Băng gạc cứu thương', icon: '🩹', isCorrect: false, colorHex: '#ffffff' },
      { id: 'c_spinach', word: 'Spinach', vietnamese: 'Rau chân vịt', icon: '🥬', isCorrect: false, colorHex: '#2ed573' },
      { id: 'c_carriage', word: 'Carriage', vietnamese: 'Cỗ xe ngựa', icon: '🎠', isCorrect: false, colorHex: '#ff6b81' },
      { id: 'c_savage', word: 'Savage', vietnamese: 'Hoang dã mãnh liệt', icon: '🦁', isCorrect: false, colorHex: '#ff4757' },
    ],
  },
  {
    targetWord: 'Treasure',
    ipa: '/ˈtreʒ.ər/',
    vietnameseMeaning: 'Rương kho báu vàng bạc',
    category: 'Phiêu lưu kỳ thú',
    hintSentence: 'Pirates searched for buried treasure on the secret uncharted island.',
    crates: [
      { id: 'c_treasure', word: 'Treasure', vietnamese: 'Kho báu', icon: '🪙', isCorrect: true, colorHex: '#ffd700' },
      { id: 'c_measure', word: 'Measure', vietnamese: 'Thước đo lường', icon: '📏', isCorrect: false, colorHex: '#70a1ff' },
      { id: 'c_pleasure', word: 'Pleasure', vietnamese: 'Niềm vui sướng', icon: '😊', isCorrect: false, colorHex: '#ff6b81' },
      { id: 'c_feather', word: 'Feather', vietnamese: 'Chiếc lông vũ', icon: '🪶', isCorrect: false, colorHex: '#00f2fe' },
      { id: 'c_weather', word: 'Weather', vietnamese: 'Thời tiết khí hậu', icon: '⛅', isCorrect: false, colorHex: '#ffa502' },
    ],
  },
];

/**
 * 5 Standard arena ground landing slots [X, Y, Z] aligned horizontally in a row at the far end
 */
export const CRATE_LANDING_SLOTS: [number, number, number][] = [
  [-4.0, 0.05, -3.8],
  [-2.0, 0.05, -3.8],
  [0.0, 0.05, -3.8],
  [2.0, 0.05, -3.8],
  [4.0, 0.05, -3.8],
];

/**
 * Fair Start & Central Unified Deposit Platform - Both players stand close side-by-side
 */
export const START_GATE_POS: [number, number, number] = [0, 0, 4.2];
export const P1_START_POS: [number, number, number] = [-0.45, 0, 4.2];
export const P2_START_POS: [number, number, number] = [0.45, 0, 4.2];
export const SKY_DROP_HEIGHT = 3.2;

/**
 * Procedural Hazard Generator per Round
 * Ensures safe zones at Starting Gate and Crate landing row at the far end.
 * Places hazards across the midfield so players must choose routes!
 */
export function generateHazardsForRound(roundNumber: number): ArenaHazard[] {
  const hazards: ArenaHazard[] = [];

  let bombCount = 1;
  let puddleCount = 2;

  if (roundNumber >= 10) {
    bombCount = 4;
    puddleCount = 4;
  } else if (roundNumber >= 5) {
    bombCount = 2;
    puddleCount = 3;
  }

  const isSafePos = (x: number, z: number): boolean => {
    // 1. Exclude Starting Gate & Start Line area
    if (z > 2.8) return false;
    // 2. Exclude Crate landing row at far end
    if (z < -2.6) return false;
    // 3. Exclude Crate landing slots (distance > 1.2m)
    for (const slot of CRATE_LANDING_SLOTS) {
      if (Math.hypot(x - slot[0], z - slot[2]) < 1.2) return false;
    }
    // 4. Exclude existing hazards (distance > 1.3m)
    for (const h of hazards) {
      if (Math.hypot(x - h.position[0], z - h.position[2]) < 1.3) return false;
    }
    return true;
  };

  let idCounter = 1;

  // Stun Bombs
  for (let i = 0; i < bombCount; i++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const rx = (Math.random() - 0.5) * 11.0;
      const rz = (Math.random() - 0.5) * 6.5;
      if (isSafePos(rx, rz)) {
        hazards.push({
          id: `bomb_${roundNumber}_${idCounter++}`,
          type: 'STUN_BOMB',
          position: [rx, 0.05, rz],
          radius: 0.55,
          triggered: false,
        });
        break;
      }
    }
  }

  // Slow Puddles
  for (let i = 0; i < puddleCount; i++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const rx = (Math.random() - 0.5) * 11.0;
      const rz = (Math.random() - 0.5) * 6.5;
      if (isSafePos(rx, rz)) {
        hazards.push({
          id: `puddle_${roundNumber}_${idCounter++}`,
          type: 'SLOW_PUDDLE',
          position: [rx, 0.02, rz],
          radius: 0.85,
        });
        break;
      }
    }
  }

  return hazards;
}

/**
 * Procedural Nuclear Airstrike Bombs falling throughout each round (>= 10 bombs)
 * Staggered drop times spanning across the 45-second round so they fall steadily,
 * striking random midfield zones and knocking back players within the blast radius!
 */
export function generateNuclearBombsForRound(roundNumber: number): FallingNuclearBomb[] {
  const bombs: FallingNuclearBomb[] = [];
  const bombCount = 12; // >= 10 bombs per round as requested

  for (let i = 0; i < bombCount; i++) {
    // Scheduled drop times throughout the 45s round: e.g. ~2.5s, 5.8s, 9.1s ... up to ~39s
    const dropTimeSeconds = 2.5 + i * 3.3 + (Math.random() * 0.6 - 0.3);
    const rx = (Math.random() - 0.5) * 11.0; // x in [-5.5, 5.5]
    const rz = (Math.random() - 0.5) * 4.8; // z in [-2.4, 2.4]

    bombs.push({
      id: `nuke_r${roundNumber}_b${i + 1}`,
      targetPos: [rx, 0.05, rz],
      currentPos: [rx, 7.5, rz],
      dropTimeSeconds,
      state: 'PENDING',
      fallProgress: 0,
      explosionProgress: 0,
      blastRadius: 1.85,
    });
  }

  return bombs;
}

/**
 * Shuffles and selects 15 unrepeated rounds for a match
 */
export function create15RoundMatchDeck(): SkyBlasterRound[] {
  const shuffled = [...MASTER_ROUNDS_POOL].sort(() => Math.random() - 0.5);
  const selected15 = shuffled.slice(0, 15);

  return selected15.map((r, index) => ({
    ...r,
    roundNumber: index + 1,
  }));
}

interface SkyBlasterStoreState {
  mode: SkyBlasterMode;
  botDifficulty: BotDifficulty;
  stage: SkyBlasterStage;
  currentRoundIndex: number;
  totalRounds: number;
  countdown: number;
  roundTimeLeft: number;
  matchRounds: SkyBlasterRound[];
  activeRound: SkyBlasterRound;
  activeCrates: FallingCrate[];
  activeHazards: ArenaHazard[];
  activeNuclearBombs: FallingNuclearBomb[];
  gateOpen: boolean;
  player1: Player3DState;
  player2: Player3DState;
  lastRoundWinner: 'P1' | 'P2' | null;
  matchResult: SkyBlasterMatchResult | null;
  announcementText: string;

  // Actions
  setMode: (mode: SkyBlasterMode) => void;
  setBotDifficulty: (diff: BotDifficulty) => void;
  setStage: (stage: SkyBlasterStage) => void;
  setGateOpen: (open: boolean) => void;
  startGame: (p1Name?: string, p2Name?: string) => void;
  startRoundDrop: () => void;
  repeatAudio: () => void;
  updatePlayer1Target: (targetPos: [number, number, number] | null) => void;
  pickupCrate: (playerId: 'P1' | 'P2', crateId: string) => void;
  dropCrate: (playerId: 'P1' | 'P2', dropPos: [number, number, number]) => void;
  deliverCrate: (playerId: 'P1' | 'P2', playerPos: [number, number, number]) => void;
  triggerHazard: (hazardId: string, playerId: 'P1' | 'P2', playerPos: [number, number, number]) => void;
  triggerNuclearBlastHit: (playerId: 'P1' | 'P2', playerPos: [number, number, number]) => void;
  stepSimulation: (deltaSeconds: number) => void;
  resolveRound: (winner: 'P1' | 'P2', correctCrate: FallingCrate) => void;
  resetGame: () => void;
}

export const useSkyBlasterStore = create<SkyBlasterStoreState>((set, get) => {
  const initialDeck = create15RoundMatchDeck();
  const initialRound = initialDeck[0];

  const prepareCratesForRound = (round: SkyBlasterRound): FallingCrate[] => {
    // Shuffle slots for randomness so correct crate landing is completely unpredictable!
    const shuffledSlots = [...CRATE_LANDING_SLOTS].sort(() => Math.random() - 0.5);

    return round.crates.map((c, i) => {
      const targetPos = shuffledSlots[i] || [0, 0.05, -3.8];
      const skyStartPos: [number, number, number] = [targetPos[0], SKY_DROP_HEIGHT, targetPos[2]];
      return {
        ...c,
        initialPos: skyStartPos,
        targetPos: [targetPos[0], 0.05, targetPos[2]],
        currentPos: skyStartPos,
        fallProgress: 0,
        hasLanded: false,
        heldBy: null,
      };
    });
  };

  return {
    mode: 'BOT',
    botDifficulty: 'MEDIUM',
    stage: 'COUNTDOWN',
    currentRoundIndex: 0,
    totalRounds: 15,
    countdown: 3,
    roundTimeLeft: 45,
    matchRounds: initialDeck,
    activeRound: initialRound,
    activeCrates: prepareCratesForRound(initialRound),
    activeHazards: generateHazardsForRound(1),
    activeNuclearBombs: generateNuclearBombsForRound(1),
    gateOpen: false,
    announcementText: 'Chuẩn bị lắng nghe...',
    lastRoundWinner: null,
    matchResult: null,

    player1: {
      id: 'P1',
      name: 'Bạn',
      position: [...P1_START_POS],
      targetPosition: null,
      rotationY: 0, // Face forward (towards negative Z)
      animationState: 'IDLE',
      heldCrate: null,
      basePosition: [...START_GATE_POS],
      score: 0,
      isStunned: false,
      stunEndTime: 0,
      accentColor: '#00f2fe', // Neon Cyan
      skinId: 'body_stickman_black',
    },

    player2: {
      id: 'P2',
      name: 'Bot',
      position: [...P2_START_POS],
      targetPosition: null,
      rotationY: 0, // Face forward
      animationState: 'IDLE',
      heldCrate: null,
      basePosition: [...START_GATE_POS],
      score: 0,
      isStunned: false,
      stunEndTime: 0,
      accentColor: '#ff4757', // Neon Crimson
      skinId: 'body_stickman_white',
    },

    setMode: (mode) =>
      set({
        mode,
        player2: {
          ...get().player2,
          name: mode === 'BOT' ? 'Bot' : 'Người chơi 2',
        },
      }),
    setBotDifficulty: (botDifficulty) => set({ botDifficulty }),
    setStage: (stage) => set({ stage }),
    setGateOpen: (gateOpen) => set({ gateOpen }),

    startGame: (p1Name: string = 'Bạn', p2Name?: string) => {
      const newDeck = create15RoundMatchDeck();
      const firstRound = newDeck[0];
      const newCrates = prepareCratesForRound(firstRound);
      const newHazards = generateHazardsForRound(1);
      const newNuclearBombs = generateNuclearBombsForRound(1);
      const mode = get().mode;
      const opponentName = p2Name || (mode === 'BOT' ? 'Bot' : 'Người chơi 2');

      set({
        stage: 'COUNTDOWN',
        currentRoundIndex: 0,
        countdown: 3,
        roundTimeLeft: 45,
        matchRounds: newDeck,
        activeRound: firstRound,
        activeCrates: newCrates,
        activeHazards: newHazards,
        activeNuclearBombs: newNuclearBombs,
        gateOpen: false,
        lastRoundWinner: null,
        matchResult: null,
        announcementText: 'Trận đấu 15 Round bắt đầu sau...',
        player1: {
          ...get().player1,
          name: p1Name || 'Bạn',
          score: 0,
          position: [...P1_START_POS],
          targetPosition: null,
          heldCrate: null,
          animationState: 'IDLE',
          isStunned: false,
        },
        player2: {
          ...get().player2,
          name: opponentName,
          score: 0,
          position: [...P2_START_POS],
          targetPosition: null,
          heldCrate: null,
          animationState: 'IDLE',
          isStunned: false,
        },
      });

      // Countdown loop
      let count = 3;
      const countTimer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          set({ countdown: count });
        } else {
          clearInterval(countTimer);
          // Start Round 1
          get().startRoundDrop();
        }
      }, 1000);
    },

    startRoundDrop: () => {
      const state = get();
      const round = state.activeRound;

      // Speak word via SpeechSynthesis immediately
      skyBlasterAudio.speakWord(round.targetWord);

      // Start crates falling immediately so player watches items descending while listening!
      set({
        stage: 'CRATES_FALLING',
        gateOpen: false,
        roundTimeLeft: 45,
        announcementText: '🔊 Lắng nghe phát âm và quan sát các vật phẩm rơi xuống!',
      });

      // Play falling parachute whistle sound
      skyBlasterAudio.playFallingWhistle();

      // Repeat word a 2nd time after 1.8s
      setTimeout(() => {
        skyBlasterAudio.speakWord(round.targetWord);
      }, 1800);

      // Open starting gate at 2.8s when crates touch down on the pedestals!
      setTimeout(() => {
        const currentState = get();
        if (currentState.stage === 'CRATES_FALLING') {
          skyBlasterAudio.playGateOpen();
          // Mark all crates landed
          const landedCrates = currentState.activeCrates.map((c) => ({
            ...c,
            hasLanded: true,
            fallProgress: 1.0,
            currentPos: [c.targetPos[0], 0.05, c.targetPos[2]] as [number, number, number],
          }));

          set({
            stage: 'CHASE_AND_COLLECT',
            gateOpen: true,
            activeCrates: landedCrates,
            announcementText: '🌸 Cổng hoa đã mở! Hãy chạy nhanh nhặt đúng vật phẩm mang về bục!',
          });
        }
      }, 2800);
    },

    repeatAudio: () => {
      const state = get();
      const round = state.activeRound;
      if (!round) return;

      // Speak word via SpeechSynthesis without stopping or pausing gameplay!
      skyBlasterAudio.speakWord(round.targetWord);

      // Only update announcement badge softly if in CHASE_AND_COLLECT, without resetting stage/gate/timer
      if (state.stage === 'CHASE_AND_COLLECT') {
        set({
          announcementText: '🔊 Đang phát lại âm thanh từ vựng...',
        });
      }
    },

    updatePlayer1Target: (targetPos) => {
      const p1 = get().player1;
      if (p1.isStunned) return;
      set({
        player1: {
          ...p1,
          targetPosition: targetPos,
        },
      });
    },

    pickupCrate: (playerId, crateId) => {
      const state = get();
      const crate = state.activeCrates.find((c) => c.id === crateId);
      if (!crate || crate.heldBy) return;

      const updatedCrates = state.activeCrates.map((c) =>
        c.id === crateId ? { ...c, heldBy: playerId } : c
      );

      skyBlasterAudio.playPickup();

      if (playerId === 'P1') {
        if (state.player1.heldCrate || state.player1.isStunned) return;
        set({
          activeCrates: updatedCrates,
          player1: {
            ...state.player1,
            heldCrate: { ...crate, heldBy: 'P1' },
            animationState: 'HOLD_ITEM',
          },
          announcementText: `Bạn đã nhặt [${crate.icon}]! Chạy nhanh về Cổng Hoa để nộp!`,
        });
      } else {
        if (state.player2.heldCrate || state.player2.isStunned) return;
        set({
          activeCrates: updatedCrates,
          player2: {
            ...state.player2,
            heldCrate: { ...crate, heldBy: 'P2' },
            animationState: 'HOLD_ITEM',
          },
          announcementText: `Đối thủ đã nhặt vật phẩm [${crate.icon}]!`,
        });
      }
    },

    dropCrate: (playerId, dropPos) => {
      const state = get();
      const player = playerId === 'P1' ? state.player1 : state.player2;
      if (!player.heldCrate) return;

      const heldId = player.heldCrate.id;
      const updatedCrates: FallingCrate[] = state.activeCrates.map((c) =>
        c.id === heldId
          ? {
              ...c,
              heldBy: null,
              currentPos: [dropPos[0], dropPos[1], dropPos[2]] as [number, number, number],
            }
          : c
      );

      if (playerId === 'P1') {
        set({
          activeCrates: updatedCrates,
          player1: {
            ...state.player1,
            heldCrate: null,
            animationState: 'IDLE',
          },
        });
      } else {
        set({
          activeCrates: updatedCrates,
          player2: {
            ...state.player2,
            heldCrate: null,
            animationState: 'IDLE',
          },
        });
      }
    },

    deliverCrate: (playerId, playerPos) => {
      const state = get();
      const player = playerId === 'P1' ? state.player1 : state.player2;
      const held = player.heldCrate;
      if (!held) return;

      if (held.isCorrect) {
        // CORRECT: Celebratory win for this round!
        skyBlasterAudio.playScoreVictory();
        get().resolveRound(playerId, held);
      } else {
        // WRONG: Repulsive shockwave knocks player back, drops crate, stuns 1.5s
        skyBlasterAudio.playRepulseBlast();
        skyBlasterAudio.playStunError();

        const dropPos: [number, number, number] = [
          playerPos[0] + (playerId === 'P1' ? -0.8 : 0.8),
          0.05,
          playerPos[2] - 1.2,
        ];

        const updatedCrates: FallingCrate[] = state.activeCrates.map((c) =>
          c.id === held.id
            ? {
                ...c,
                heldBy: null,
                currentPos: [dropPos[0], dropPos[1], dropPos[2]] as [number, number, number],
              }
            : c
        );

        const now = Date.now();
        if (playerId === 'P1') {
          set({
            activeCrates: updatedCrates,
            player1: {
              ...state.player1,
              heldCrate: null,
              isStunned: true,
              stunEndTime: now + 1500,
              animationState: 'IDLE',
            },
            announcementText: `⚠️ Chưa đúng vật phẩm! Cổng hoa từ chối và đẩy văng bạn lại 1.5s!`,
          });
        } else {
          set({
            activeCrates: updatedCrates,
            player2: {
              ...state.player2,
              heldCrate: null,
              isStunned: true,
              stunEndTime: now + 1500,
              animationState: 'IDLE',
            },
            announcementText: `⚠️ Đối thủ nộp sai vật phẩm và bị cổng hoa đẩy lùi!`,
          });
        }
      }
    },

    triggerHazard: (hazardId, playerId, playerPos) => {
      const state = get();
      const hazard = state.activeHazards.find((h) => h.id === hazardId);
      if (!hazard || hazard.triggered) return;

      if (hazard.type === 'STUN_BOMB') {
        skyBlasterAudio.playMineExplosion();

        // Mark bomb triggered (explodes)
        const updatedHazards = state.activeHazards.map((h) =>
          h.id === hazardId ? { ...h, triggered: true } : h
        );

        const player = playerId === 'P1' ? state.player1 : state.player2;
        const now = Date.now();

        // Drop held crate if carrying one
        let updatedCrates: FallingCrate[] = state.activeCrates;
        if (player.heldCrate) {
          const heldId = player.heldCrate.id;
          const dropPos: [number, number, number] = [playerPos[0] + 0.3, 0.05, playerPos[2]];
          updatedCrates = state.activeCrates.map((c) =>
            c.id === heldId
              ? {
                  ...c,
                  heldBy: null,
                  currentPos: [dropPos[0], dropPos[1], dropPos[2]] as [number, number, number],
                }
              : c
          );
        }

        if (playerId === 'P1') {
          set({
            activeHazards: updatedHazards,
            activeCrates: updatedCrates,
            player1: {
              ...state.player1,
              heldCrate: null,
              isStunned: true,
              stunEndTime: now + 1000, // 1 second stun
              animationState: 'IDLE',
            },
            announcementText: '🍄 Dẫm phải NẤM BÀO TỬ GÂY CHOÁNG! Bị choáng 1s và rơi vật phẩm!',
          });
        } else {
          set({
            activeHazards: updatedHazards,
            activeCrates: updatedCrates,
            player2: {
              ...state.player2,
              heldCrate: null,
              isStunned: true,
              stunEndTime: now + 1000,
              animationState: 'IDLE',
            },
            announcementText: '🍄 Đối thủ vừa dẫm phải NẤM BÀO TỬ GÂY CHOÁNG!',
          });
        }
      } else if (hazard.type === 'SLOW_PUDDLE') {
        // Slow puddle splash audio
        skyBlasterAudio.playPuddleSplash();
      }
    },

    triggerNuclearBlastHit: (playerId, playerPos) => {
      const state = get();
      const player = playerId === 'P1' ? state.player1 : state.player2;
      const now = Date.now();

      // Drop held crate if carrying one
      let updatedCrates: FallingCrate[] = state.activeCrates;
      if (player.heldCrate) {
        const heldId = player.heldCrate.id;
        const dropPos: [number, number, number] = [playerPos[0] + 0.3, 0.05, playerPos[2]];
        updatedCrates = state.activeCrates.map((c) =>
          c.id === heldId
            ? {
                ...c,
                heldBy: null,
                currentPos: [dropPos[0], dropPos[1], dropPos[2]] as [number, number, number],
              }
            : c
        );
      }

      if (playerId === 'P1') {
        set({
          activeCrates: updatedCrates,
          player1: {
            ...state.player1,
            heldCrate: null,
            isStunned: true,
            stunEndTime: now + 3000, // Lie immobile for 3 seconds
            animationState: 'IDLE',
          },
          announcementText: '💥 BỊ BOM NGUYÊN TỬ ĐÁNH TRÚNG! Văng lùi lại và nằm bất động 3s!',
        });
      } else {
        set({
          activeCrates: updatedCrates,
          player2: {
            ...state.player2,
            heldCrate: null,
            isStunned: true,
            stunEndTime: now + 3000, // Lie immobile for 3 seconds
            animationState: 'IDLE',
          },
          announcementText: '💥 Bot vừa bị BOM NGUYÊN TỬ thổi bay văng lùi lại và bất động 3s!',
        });
      }
    },

    stepSimulation: (deltaSeconds) => {
      const state = get();
      if (state.stage === 'COUNTDOWN' || state.stage === 'MATCH_FINISHED') return;

      const now = Date.now();
      let changed = false;
      let p1 = state.player1;
      let p2 = state.player2;

      // Check stun timers
      if (p1.isStunned && now > p1.stunEndTime) {
        p1 = { ...p1, isStunned: false };
        changed = true;
      }
      if (p2.isStunned && now > p2.stunEndTime) {
        p2 = { ...p2, isStunned: false };
        changed = true;
      }

      // Decrement round timer during CHASE_AND_COLLECT
      let newTime = state.roundTimeLeft;
      if (state.stage === 'CHASE_AND_COLLECT') {
        newTime = Math.max(0, state.roundTimeLeft - deltaSeconds);
        // Only trigger state change once per second to prevent re-render lag
        if (Math.floor(newTime) !== Math.floor(state.roundTimeLeft)) {
          changed = true;
        }

        // Time ran out after 45s of chasing -> resolve round
        if (newTime <= 0 && state.roundTimeLeft > 0) {
          const correctCrate = state.activeCrates.find((c) => c.isCorrect) || state.activeCrates[0];
          get().resolveRound('P1', correctCrate);
          return;
        }
      }

      if (changed) {
        set({ player1: p1, player2: p2, roundTimeLeft: newTime });
      }
    },

    resolveRound: (winner: 'P1' | 'P2', correctCrate: FallingCrate) => {
      const state = get();
      const nextRoundIndex = state.currentRoundIndex + 1;
      const p1NewScore = winner === 'P1' ? state.player1.score + 1 : state.player1.score;
      const p2NewScore = winner === 'P2' ? state.player2.score + 1 : state.player2.score;
      const winnerName = winner === 'P1' ? state.player1.name : state.player2.name;

      set({
        stage: 'ROUND_RESOLVED',
        lastRoundWinner: winner,
        gateOpen: false,
        countdown: 3,
        roundTimeLeft: 45,
        announcementText: `🎉 ${winnerName} ĐÃ NỘP ĐÚNG [${correctCrate.icon}] VỀ BỤC! Chuẩn bị Round ${nextRoundIndex + 1}...`,
        player1: {
          ...state.player1,
          score: p1NewScore,
          heldCrate: null,
          targetPosition: null,
          animationState: winner === 'P1' ? 'HOLD_ITEM' : 'IDLE',
        },
        player2: {
          ...state.player2,
          score: p2NewScore,
          heldCrate: null,
          targetPosition: null,
          animationState: winner === 'P2' ? 'HOLD_ITEM' : 'IDLE',
        },
      });

      // Check if match finished after 15 rounds
      if (nextRoundIndex >= state.totalRounds) {
        setTimeout(() => {
          const isWinner = p1NewScore > p2NewScore;
          const result: SkyBlasterMatchResult = {
            playerScore: p1NewScore,
            opponentScore: p2NewScore,
            totalRounds: state.totalRounds,
            isWinner,
            accuracyPercent: Math.round((p1NewScore / state.totalRounds) * 100),
            earnedTokens: p1NewScore * 30 + (isWinner ? 200 : 50),
            earnedXp: p1NewScore * 50 + (isWinner ? 300 : 100),
            streakIncrement: isWinner ? 1 : 0,
          };

          set({
            stage: 'MATCH_FINISHED',
            matchResult: result,
            announcementText: isWinner ? '🏆 CHIẾN THẮNG CHUNG CUỘC!' : '⚔️ KẾT THÚC TRẬN ĐẤU!',
          });
        }, 2500);
      } else {
        // 3-second countdown loop (3... 2... 1...) before next round starts
        let count = 3;
        const countTimer = setInterval(() => {
          count -= 1;
          if (count > 0) {
            set({ countdown: count });
          } else {
            clearInterval(countTimer);
            const nextRound = state.matchRounds[nextRoundIndex] || state.matchRounds[0];
            const newCrates = prepareCratesForRound(nextRound);
            const newHazards = generateHazardsForRound(nextRoundIndex + 1);
            const newNuclearBombs = generateNuclearBombsForRound(nextRoundIndex + 1);

            set({
              currentRoundIndex: nextRoundIndex,
              activeRound: nextRound,
              activeCrates: newCrates,
              activeHazards: newHazards,
              activeNuclearBombs: newNuclearBombs,
              gateOpen: false,
              roundTimeLeft: 45,
              lastRoundWinner: null,
              player1: {
                ...get().player1,
                position: [...P1_START_POS],
                targetPosition: null,
                heldCrate: null,
                animationState: 'IDLE',
                isStunned: false,
              },
              player2: {
                ...get().player2,
                position: [...P2_START_POS],
                targetPosition: null,
                heldCrate: null,
                animationState: 'IDLE',
                isStunned: false,
              },
            });

            get().startRoundDrop();
          }
        }, 1000);
      }
    },

    resetGame: () => {
      const newDeck = create15RoundMatchDeck();
      const initialR = newDeck[0];
      set({
        stage: 'COUNTDOWN',
        currentRoundIndex: 0,
        matchRounds: newDeck,
        activeRound: initialR,
        activeCrates: prepareCratesForRound(initialR),
        activeHazards: generateHazardsForRound(1),
        activeNuclearBombs: generateNuclearBombsForRound(1),
        gateOpen: false,
        lastRoundWinner: null,
        matchResult: null,
      });
    },
  };
});

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  ShoppingBag,
  Coins,
  Shirt,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ShopItem, ShopItemCard } from './ShopItemCard';
import { RarityTier } from './RarityBadge';
import { AvatarRenderer, AvatarPresetConfig } from './AvatarRenderer';
import { TokenBalanceBadge } from './TokenBalanceBadge';
import { Button } from './Button';

export interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTokenBalance: number;
  dailyTokensEarned?: number;
  dailySoftCap?: number;
  currentPreset?: AvatarPresetConfig;
  catalogItems?: ShopItem[];
  ownedItemIds?: string[];
  equippedItemIds?: string[];
  onPurchaseItem?: (item: ShopItem) => Promise<boolean> | boolean | void;
  onEquipItem?: (item: ShopItem) => void;
  className?: string;
}

// Default items if catalog is empty
const DEFAULT_ITEMS: ShopItem[] = [
  {
    id: '1',
    itemCode: 'hoodie_cyber_neon',
    name: 'Áo Hoodie Cyber Neon',
    description: 'Áo nỉ phong cách tương lai phát sáng dạ quang trong bóng tối.',
    category: 'tops',
    rarity: 'epic',
    tokenPrice: 850,
  },
  {
    id: '2',
    itemCode: 'suit_oxford_scholar',
    name: 'Vest Học Giả Oxford',
    description: 'Bộ vest lịch lãm phong cách giảng đường đại học Anh Quốc.',
    category: 'tops',
    rarity: 'rare',
    tokenPrice: 500,
  },
  {
    id: '3',
    itemCode: 'jacket_detective_sherlock',
    name: 'Măng Tô Thám Tử Sherlock',
    description: 'Áo khoác dài cổ điển của bậc thầy phá án ngữ pháp.',
    category: 'tops',
    rarity: 'legendary',
    tokenPrice: 1500,
  },
  {
    id: '4',
    itemCode: 'skirt_pleated_navy',
    name: 'Chân Váy Xếp Ly Navy',
    description: 'Chân váy đồng phục học sinh thanh lịch và năng động.',
    category: 'bottoms',
    rarity: 'rare',
    tokenPrice: 350,
  },
  {
    id: '5',
    itemCode: 'bottoms_cyber_cargo',
    name: 'Quần Túi Hộp Cyber Cargo',
    description: 'Quần chiến thuật đa năng với dải phản quang phát sáng.',
    category: 'bottoms',
    rarity: 'epic',
    tokenPrice: 750,
  },
  {
    id: '6',
    itemCode: 'boots_leather_brown',
    name: 'Giày Boots Da Nâu',
    description: 'Giày da bò bền bỉ, phong trần cho những chuyến du hành từ vựng.',
    category: 'footwear',
    rarity: 'rare',
    tokenPrice: 400,
  },
  {
    id: '7',
    itemCode: 'footwear_cyber',
    name: 'Sneaker Điện Tử Cyberpunk',
    description: 'Giày thể thao đế phát quang tăng tốc độ gõ phím và phản xạ.',
    category: 'footwear',
    rarity: 'epic',
    tokenPrice: 900,
  },
  {
    id: '8',
    itemCode: 'head_crown_champion',
    name: 'Vương Miện Quán Quân',
    description: 'Biểu tượng vinh quang tối thượng dành cho cao thủ tranh biện.',
    category: 'headwear',
    rarity: 'legendary',
    tokenPrice: 2000,
  },
  {
    id: '9',
    itemCode: 'head_beanie_cozy',
    name: 'Mũ Len Beanie Ấm Áp',
    description: 'Mũ len dệt kim giữ ấm cho những đêm dài luyện nghe.',
    category: 'headwear',
    rarity: 'rare',
    tokenPrice: 320,
  },
  {
    id: '10',
    itemCode: 'eyes_glasses_round',
    name: 'Kính Cận Tròn Trí Thức',
    description: 'Gọng kính vàng kim cổ điển tôn lên vẻ thông thái.',
    category: 'eyewear',
    rarity: 'rare',
    tokenPrice: 450,
  },
  {
    id: '11',
    itemCode: 'eyes_cyber_visor',
    name: 'Kính Cyber Visor HUD',
    description: 'Kính thực tế ảo hiển thị phụ đề và phiên âm ngữ âm tức thì.',
    category: 'eyewear',
    rarity: 'legendary',
    tokenPrice: 1600,
  },
  {
    id: '12',
    itemCode: 'neckwear_headphone',
    name: 'Tai Nghe Gaming Cyber',
    description: 'Tai nghe chụp tai chuyên dụng cho bài kiểm tra Audio Blitz.',
    category: 'neckwear',
    rarity: 'epic',
    tokenPrice: 650,
  },
  {
    id: '13',
    itemCode: 'pet_owl_scholar',
    name: 'Cú Mèo Tri Thức Hedwig',
    description: 'Bạn đồng hành thông thái nhắc nhở học từ vựng mỗi sáng sớm.',
    category: 'companion',
    rarity: 'legendary',
    tokenPrice: 2500,
  },
  {
    id: '14',
    itemCode: 'aura_fire_legendary',
    name: 'Hào Quang Rực Lửa Chiến Binh',
    description: 'Ngọn lửa nhiệt huyết bao quanh nhân vật trong các trận đấu 1v1.',
    category: 'aura',
    rarity: 'legendary',
    tokenPrice: 1800,
  },
  {
    id: '15',
    itemCode: 'aura_stars_cosmic',
    name: 'Vũ Trụ Ngàn Sao Cosmic',
    description: 'Dải ngân hà lấp lánh nâng bước chân chinh phục IELTS 8.0.',
    category: 'aura',
    rarity: 'epic',
    tokenPrice: 1200,
  },
  {
    id: '16',
    itemCode: 'slot_preset_unlocked',
    name: 'Mở Khóa Slot Trang Phục Số 3',
    description: 'Mở rộng tủ đồ, cho phép lưu thêm 1 bộ phong cách dự phòng.',
    category: 'preset_slot',
    rarity: 'rare',
    tokenPrice: 1000,
  },
  {
    id: '17',
    itemCode: 'wings_angel_celestial',
    name: 'Đôi Cánh Thiên Thần Tri Thức',
    description: 'Đôi cánh thiên thần dát vàng thần thánh, tỏa ánh sáng tri thức bao la.',
    category: 'wings',
    rarity: 'legendary',
    tokenPrice: 2800,
  },
  {
    id: '18',
    itemCode: 'wings_cyber_neon',
    name: 'Đôi Cánh Cơ Khí Cyber Neon',
    description: 'Bộ cánh cơ khí công nghệ cao với các lưỡi dao laser phát sáng cyan và magenta.',
    category: 'wings',
    rarity: 'epic',
    tokenPrice: 1600,
  },
  {
    id: '19',
    itemCode: 'wings_phoenix_flame',
    name: 'Đôi Cánh Phượng Hoàng Lửa',
    description: 'Đôi cánh lửa phượng hoàng bất tử bùng cháy dữ dội cho những chuỗi học bất tận.',
    category: 'wings',
    rarity: 'legendary',
    tokenPrice: 3500,
  },
  {
    id: 'wings_devil_demonic',
    itemCode: 'wings_devil_demonic',
    name: 'Đôi Cánh Ác Quỷ Dạ Xoa',
    description: 'Đôi cánh dơi ác quỷ màu tím đen huyền bí tỏa luồng ma mị phong cách Avatar cổ điển.',
    category: 'wings',
    rarity: 'legendary',
    tokenPrice: 3000,
  },
  {
    id: 'wings_fairy_butterfly',
    itemCode: 'wings_fairy_butterfly',
    name: 'Đôi Cánh Bướm Tiên Giới Chibi',
    description: 'Đôi cánh bướm dạ quang bảy sắc cầu vồng tỏa bụi tiên lấp lánh như tiên nữ giáng trần.',
    category: 'wings',
    rarity: 'epic',
    tokenPrice: 2200,
  },
  {
    id: '20',
    itemCode: 'set_cyberpunk_master',
    name: 'Nguyên Set Cơ Khí Cyber Neon',
    description: 'Trọn bộ tương lai cao cấp: Áo Bomber Cyber + Quần Túi Hộp + Kính VR Cyber + Cánh Cơ Khí Cyber Neon + Hào Quang Ma Trận.',
    category: 'bundle',
    rarity: 'legendary',
    tokenPrice: 3200,
  },
  {
    id: '21',
    itemCode: 'set_royal_scholar',
    name: 'Nguyên Set Đại Học Giả Hoàng Gia',
    description: 'Trọn bộ học thuật vinh danh: Áo Vest Học Giả Oxford + Quần Kaki Chinos + Mũ Cử Nhân + Bút Lông Vũ Cổ Điển + Đôi Cánh Thiên Thần Tri Thức.',
    category: 'bundle',
    rarity: 'legendary',
    tokenPrice: 3500,
  },
  {
    id: '22',
    itemCode: 'set_phoenix_warlord',
    name: 'Nguyên Set Chiến Vương Phượng Hoàng',
    description: 'Trọn bộ rực lửa thần thoại: Áo Choàng Đại Pháp Sư + Quần Pháp Sư + Vương Miện Quán Quân + Đôi Cánh Phượng Hoàng Lửa + Hào Quang Lửa Vàng.',
    category: 'bundle',
    rarity: 'legendary',
    tokenPrice: 5800,
  },
  {
    id: '23',
    itemCode: 'ticket_ielts_mock_master',
    name: 'Vé Thi Thử IELTS 4 Kỹ Năng Chuẩn Quốc Tế',
    description: 'Mở khóa phòng thi IELTS tiêu chuẩn 4 kỹ năng với chấm điểm tự động và AI feedback chi tiết từng tiêu chí band điểm 1.0 - 9.0.',
    category: 'ticket',
    rarity: 'epic',
    tokenPrice: 450,
  },
  {
    id: '24',
    itemCode: 'ticket_toeic_champion_exam',
    name: 'Vé Đấu Trường TOEIC 990 Điểm',
    description: 'Vé mở khóa phòng thi Full Test 200 câu TOEIC chuẩn format ETS với áp lực bấm giờ thời gian thực và phân tích bẫy ngữ pháp.',
    category: 'ticket',
    rarity: 'rare',
    tokenPrice: 300,
  },
  {
    id: '25',
    itemCode: 'ticket_ielts_speaking_vip',
    name: 'Vé Luyện Nói 1-1 IELTS VIP Với Giám Khảo AI',
    description: 'Mở khóa 30 phút luyện nói chuyên sâu phòng thi 1v1 với giám khảo AI theo format Part 1-2-3 và nhận báo cáo phát âm Phoneme chi tiết.',
    category: 'ticket',
    rarity: 'legendary',
    tokenPrice: 750,
  }
];

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  userTokenBalance,
  dailyTokensEarned = 0,
  dailySoftCap = 600,
  currentPreset = {},
  catalogItems = DEFAULT_ITEMS,
  ownedItemIds = [],
  equippedItemIds = [],
  onPurchaseItem,
  onEquipItem,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLiveFitting, setShowLiveFitting] = useState<boolean>(true);
  const [tryOnPreset, setTryOnPreset] = useState<AvatarPresetConfig>({ ...currentPreset });
  const [triedItemCodes, setTriedItemCodes] = useState<Set<string>>(new Set());

  // Purchase modal state
  const [purchasingItem, setPurchasingItem] = useState<ShopItem | null>(null);
  const [isProcessingBuy, setIsProcessingBuy] = useState<boolean>(false);
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<ShopItem | null>(null);

  if (!isOpen) return null;

  // Categories
  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'bundle', label: '🎁 Nguyên Set' },
    { id: 'ticket', label: '🎟️ Vé IELTS & TOEIC' },
    { id: 'wings', label: '🪽 Cánh' },
    { id: 'tops', label: 'Áo' },
    { id: 'bottoms', label: 'Quần & Váy' },
    { id: 'footwear', label: 'Giày Dép' },
    { id: 'headwear', label: 'Mũ Nón' },
    { id: 'eyewear', label: 'Kính Mắt' },
    { id: 'neckwear', label: 'Phụ Kiện' },
    { id: 'companion', label: 'Thú Cưng' },
    { id: 'aura', label: 'Hào Quang' },
    { id: 'preset_slot', label: 'Slot Preset' },
  ];

  // Rarities
  const rarities: Array<{ id: string; label: string; tier?: RarityTier }> = [
    { id: 'all', label: 'Tất Cả Rarity' },
    { id: 'common', label: 'Common', tier: 'common' },
    { id: 'rare', label: 'Rare', tier: 'rare' },
    { id: 'epic', label: 'Epic', tier: 'epic' },
    { id: 'legendary', label: 'Legendary', tier: 'legendary' },
  ];

  // Filtered items
  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Rarity filter
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [catalogItems, selectedCategory, selectedRarity, searchQuery]);

  // Try-on toggle handler
  const handleToggleTryOn = (item: ShopItem) => {
    const isCurrentlyTrying = triedItemCodes.has(item.itemCode);
    const newTried = new Set(triedItemCodes);
    const nextPreset = { ...tryOnPreset };

    if (isCurrentlyTrying) {
      newTried.delete(item.itemCode);
      // Revert to original
      const catKey = item.category as keyof AvatarPresetConfig;
      (nextPreset as any)[catKey] = (currentPreset as any)[catKey] || null;
    } else {
      // Remove any previously tried item of the same category (cùng loại)
      catalogItems.forEach(ci => {
        if (ci.category === item.category && ci.itemCode !== item.itemCode) {
          newTried.delete(ci.itemCode);
        }
      });
      newTried.add(item.itemCode);
      // Equip item in preview
      if (item.category === 'tops') nextPreset.topsId = item.itemCode;
      if (item.category === 'bottoms') nextPreset.bottomsId = item.itemCode;
      if (item.category === 'footwear') nextPreset.footwearId = item.itemCode;
      if (item.category === 'headwear') nextPreset.headwearId = item.itemCode;
      if (item.category === 'eyewear') nextPreset.eyewearId = item.itemCode;
      if (item.category === 'neckwear') nextPreset.neckwearId = item.itemCode;
      if (item.category === 'wings') nextPreset.wingsId = item.itemCode;
      if (item.category === 'companion') nextPreset.companionId = item.itemCode;
      if (item.category === 'aura') nextPreset.auraId = item.itemCode;
      if (item.category === 'bundle') {
        const bundleMap: Record<string, Partial<AvatarPresetConfig>> = {
          set_cyberpunk_master: { topsId: 'top_cyber_jacket', bottomsId: 'bot_cargo_joggers', eyewearId: 'eye_vr_visor', wingsId: 'wings_cyber_neon', auraId: 'aura_floating_books' },
          set_royal_scholar: { topsId: 'top_oxford_blazer', bottomsId: 'bot_classic_chinos', headwearId: 'head_graduation_cap', wingsId: 'wings_angel_celestial' },
          set_phoenix_warlord: { topsId: 'top_wizard_robe', bottomsId: 'bot_wizard_skirt', headwearId: 'head_olympus_crown', wingsId: 'wings_phoenix_flame', auraId: 'aura_golden_triumph' },
          set_detective_holmes: { topsId: 'top_detective_trench', bottomsId: 'bot_suit_pants', headwearId: 'head_detective_hat', eyewearId: 'eye_steampunk_goggles' },
          set_celestial_angel: { topsId: 'top_scholastic_hoodie', headwearId: 'head_olympus_crown', wingsId: 'wings_angel_celestial' },
          set_devil_night: { topsId: 'top_devil_hoodie', bottomsId: 'bot_devil_pants', headwearId: 'head_devil_horns', wingsId: 'wings_devil_demonic' },
          set_angel_divine: { topsId: 'top_angel_tunic', bottomsId: 'bot_angel_skirt', headwearId: 'head_angel_halo', wingsId: 'wings_angel_celestial' },
          set_princess_lolita: { topsId: 'top_princess_lolita', bottomsId: 'bot_lolita_skirt', headwearId: 'head_bunny_ears', wingsId: 'wings_fairy_butterfly' }
        };
        const parts = bundleMap[item.itemCode];
        if (parts) Object.assign(nextPreset, parts);
      }
    }

    setTriedItemCodes(newTried);
    setTryOnPreset(nextPreset);
  };

  // Reset Try On
  const handleClearTryOn = () => {
    setTriedItemCodes(new Set());
    setTryOnPreset({ ...currentPreset });
  };

  // Execute buy
  const handleConfirmPurchase = async () => {
    if (!purchasingItem) return;
    setIsProcessingBuy(true);
    try {
      if (onPurchaseItem) {
        await onPurchaseItem(purchasingItem);
      }
      setPurchaseSuccessItem(purchasingItem);
      setPurchasingItem(null);
    } finally {
      setIsProcessingBuy(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none ${className}`}>
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[880px] bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShoppingBag className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Cửa Hàng Vật Phẩm & Thời Trang Học Giả
              </h3>
              <p className="text-xs text-slate-400">
                Đổi Token từ bài tập & mini-game để nâng cấp diện mạo cá nhân
              </p>
            </div>
          </div>

          {/* Right Header: Token Balance + Close Button */}
          <div className="flex items-center gap-3">
            <TokenBalanceBadge
              balance={userTokenBalance}
              size="md"
              showSoftCap={true}
              dailyTokensEarned={dailyTokensEarned}
              dailySoftCap={dailySoftCap}
            />

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border
                  ${selectedCategory === cat.id
                    ? 'bg-amber-500 text-yellow-950 border-amber-400 shadow-[0_2px_0_#b45309]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Toggle Live Fitting */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm vật phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Live Fitting Toggle */}
            <button
              type="button"
              onClick={() => setShowLiveFitting(!showLiveFitting)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border
                ${showLiveFitting
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_2px_0_#047857]'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }
              `}
              title="Bật/Tắt phòng thử đồ trực quan"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phòng Thử Đồ</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Live Fitting Room Avatar (Visible when showLiveFitting is true) */}
          {showLiveFitting && (
            <div className="hidden md:flex w-72 lg:w-80 flex-col items-center justify-between p-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-r border-slate-800 shrink-0">
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Thử Đồ Trực Quan
                </span>
                {triedItemCodes.size > 0 && (
                  <button
                    type="button"
                    onClick={handleClearTryOn}
                    className="text-[11px] text-rose-400 font-bold hover:underline"
                  >
                    Bỏ thử ({triedItemCodes.size})
                  </button>
                )}
              </div>

              {/* Live Preview Canvas */}
              <div className="w-full flex-1 flex items-center justify-center py-2">
                <AvatarRenderer
                  preset={tryOnPreset}
                  mode="full"
                  size={270}
                  isAnimated={true}
                />
              </div>

              {/* Status Note */}
              <div className="w-full p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
                <span className="text-[11px] text-slate-300 font-medium">
                  {triedItemCodes.size > 0
                    ? `Đang mặc thử ${triedItemCodes.size} vật phẩm từ Shop`
                    : 'Bấm nút "Thử" trên thẻ vật phẩm để xem trước'}
                </span>
              </div>
            </div>
          )}

          {/* RIGHT: Items Grid */}
          <div className="flex-1 p-5 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-sm font-extrabold text-white">Không tìm thấy vật phẩm nào phù hợp</p>
                <p className="text-xs text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                  const isOwned = ownedItemIds.includes(item.itemCode) || ownedItemIds.includes(item.id);
                  const isEquipped = equippedItemIds.includes(item.itemCode) || equippedItemIds.includes(item.id);
                  const isTryingOn = triedItemCodes.has(item.itemCode);

                  return (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      userTokenBalance={userTokenBalance}
                      isOwned={isOwned}
                      isEquipped={isEquipped}
                      isTryingOn={isTryingOn}
                      onTryOn={() => handleToggleTryOn(item)}
                      onBuy={() => setPurchasingItem(item)}
                      onEquip={onEquipItem ? () => onEquipItem(item) : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* MODAL: Confirmation Drawer for Purchase */}
        {purchasingItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
            <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-pop-bounce">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Coins className="w-6 h-6 animate-coin-shine" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Xác Nhận Mua Vật Phẩm</h4>
                  <p className="text-xs text-slate-400">Giao dịch được khấu trừ ngay từ số dư Token</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-5 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Vật phẩm:</span>
                  <span className="font-extrabold text-white">{purchasingItem.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Giá niêm yết:</span>
                  <span className="font-black text-amber-400 tabular-nums">
                    -{purchasingItem.tokenPrice.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-700/60 pt-2">
                  <span className="text-slate-400">Số dư còn lại:</span>
                  <span className="font-black text-emerald-400 tabular-nums">
                    {(userTokenBalance - purchasingItem.tokenPrice).toLocaleString()} Tokens
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setPurchasingItem(null)}
                  disabled={isProcessingBuy}
                >
                  Hủy Bỏ
                </Button>
                <Button
                  variant="token"
                  size="md"
                  isLoading={isProcessingBuy}
                  onClick={handleConfirmPurchase}
                  className="font-black px-6"
                >
                  Đồng Ý Mua
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Purchase Celebration */}
        {purchaseSuccessItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-emerald-400 rounded-3xl p-6 text-center shadow-[0_20px_50px_rgba(16,185,129,0.4)] animate-pop-bounce">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-white mb-1">Mua Hàng Thành Công!</h4>
              <p className="text-xs text-slate-300 mb-4">
                Bạn đã mở khóa <span className="text-amber-400 font-extrabold">{purchaseSuccessItem.name}</span> và thêm vào Tủ đồ cá nhân.
              </p>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setPurchaseSuccessItem(null)}
                className="font-black"
              >
                Tuyệt Vời
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

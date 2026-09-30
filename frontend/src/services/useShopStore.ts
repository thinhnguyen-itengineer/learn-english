import { create } from 'zustand';
import { ShopItemDto, PurchaseResultDto, PurchaseBundleResultDto } from '../types/avatarAndShop';
import { avatarShopService } from './avatarShopService';
import { useAvatarStore } from './useAvatarStore';

export const FALLBACK_SHOP_ITEMS: ShopItemDto[] = [
  // Wings Category (Item dạng cánh)
  {
    id: 'wings_angel_celestial',
    itemCode: 'wings_angel_celestial',
    nameEn: 'Celestial Seraph Wings',
    nameVi: 'Đôi Cánh Thiên Thần Tri Thức',
    description: 'Đôi cánh lông vũ vàng kim phát quang rực rỡ, nâng bước học giả vượt ngưỡng giới hạn.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'legendary',
    tokenPrice: 2800,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_angel_celestial.svg',
    zIndex: 5
  },
  {
    id: 'wings_cyber_neon',
    itemCode: 'wings_cyber_neon',
    nameEn: 'Cyber Neon Mech Wings',
    nameVi: 'Đôi Cánh Cơ Khí Cyber Neon',
    description: 'Cánh năng lượng photon phát sáng xanh tím neon chuyển động nhịp nhàng theo hơi thở.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'epic',
    tokenPrice: 1600,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_cyber_neon.svg',
    zIndex: 5
  },
  {
    id: 'wings_phoenix_flame',
    itemCode: 'wings_phoenix_flame',
    nameEn: 'Blazing Phoenix Wings',
    nameVi: 'Đôi Cánh Phượng Hoàng Lửa',
    description: 'Đôi cánh rực lửa thần thoại tỏa tàn tro vàng óng ánh cho người học chăm chỉ nhất.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'legendary',
    tokenPrice: 3500,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_phoenix_flame.svg',
    zIndex: 5
  },
  {
    id: 'wings_devil_demonic',
    itemCode: 'wings_devil_demonic',
    nameEn: 'Demonic Shadow Bat Wings',
    nameVi: 'Đôi Cánh Ác Quỷ Dạ Xoa',
    description: 'Đôi cánh dơi ác quỷ màu tím đen huyền bí, tỏa luồng hắc ám ma mị phong cách Avatar cổ điển.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'legendary',
    tokenPrice: 3000,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_devil_demonic.svg',
    zIndex: 5
  },
  {
    id: 'wings_fairy_butterfly',
    itemCode: 'wings_fairy_butterfly',
    nameEn: 'Ethereal Fairy Wings',
    nameVi: 'Đôi Cánh Bướm Tiên Giới Chibi',
    description: 'Đôi cánh bướm dạ quang bảy sắc cầu vồng, tỏa bụi tiên lấp lánh như tiên nữ giáng trần.',
    category: 'wings',
    layerSlot: 'wings',
    rarityTier: 'epic',
    tokenPrice: 2200,
    requiredLevel: 12,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/wings/wings_fairy_butterfly.svg',
    zIndex: 5
  },

  // Tops
  {
    id: 'top_oxford_blazer',
    itemCode: 'top_oxford_blazer',
    nameEn: 'Oxford Scholar Blazer',
    nameVi: 'Áo Vest Học Giả Oxford',
    description: 'Huy hiệu ngực vàng thêu tinh xảo phong cách quý tộc.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'rare',
    tokenPrice: 450,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/oxford_blazer.svg',
    zIndex: 60
  },
  {
    id: 'top_cyber_hoodie',
    itemCode: 'top_cyber_hoodie',
    nameEn: 'Cyber Neon Hoodie',
    nameVi: 'Áo Hoodie Neon Tương Lai',
    description: 'Dải đèn LED dạ quang chạy dọc tay áo phát sáng trong bóng tối.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'epic',
    tokenPrice: 950,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/cyber_hoodie.svg',
    zIndex: 60
  },
  {
    id: 'top_wizard_robe',
    itemCode: 'top_wizard_robe',
    nameEn: 'Archmage Lexicon Robe',
    nameVi: 'Áo Choàng Đại Pháp Sư Từ Vựng',
    description: 'Cổ áo thêu chòm sao phát sáng huyền ảo của hội phù thủy ngôn từ.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'legendary',
    tokenPrice: 3200,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/wizard_robe.svg',
    zIndex: 60
  },
  {
    id: 'top_scholastic_hoodie',
    itemCode: 'top_scholastic_hoodie',
    nameEn: 'Scholastic Comfort Hoodie',
    nameVi: 'Áo Hoodie Học Giả Trẻ',
    description: 'Áo hoodie nỉ bông ấm áp thoải mái luyện tập cả ngày.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'common',
    tokenPrice: 180,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/scholastic_hoodie.svg',
    zIndex: 60
  },
  {
    id: 'top_cyber_jacket',
    itemCode: 'top_cyber_jacket',
    nameEn: 'Cyberpunk Street Bomber',
    nameVi: 'Áo Khoác Bomber Cyber',
    description: 'Áo khoác bomber phối màu tím neon phong cách tương lai.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'rare',
    tokenPrice: 480,
    requiredLevel: 6,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/cyber_jacket.svg',
    zIndex: 60
  },
  {
    id: 'top_devil_hoodie',
    itemCode: 'top_devil_hoodie',
    nameEn: 'Shadow Imp Hoodie',
    nameVi: 'Áo Hoodie Ác Quỷ Dạ Xoa',
    description: 'Áo hoodie nỉ đen tím có cánh dơi nhỏ sau lưng và họa tiết cute.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'epic',
    tokenPrice: 850,
    requiredLevel: 8,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/devil_hoodie.svg',
    zIndex: 60
  },
  {
    id: 'top_angel_tunic',
    itemCode: 'top_angel_tunic',
    nameEn: 'Celestial Silk Tunic',
    nameVi: 'Áo Choàng Lụa Thiên Thần',
    description: 'Áo choàng trắng tinh khôi dệt bằng tơ trời, thắt nơ vàng kim thanh khiết.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'epic',
    tokenPrice: 900,
    requiredLevel: 9,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/angel_tunic.svg',
    zIndex: 60
  },
  {
    id: 'top_princess_lolita',
    itemCode: 'top_princess_lolita',
    nameEn: 'Sweet Lolita Princess Dress',
    nameVi: 'Đầm Công Chúa Lolita Dạ Hội',
    description: 'Váy xòe ren hồng phấn phối nơ ngực bồng bềnh ngọt ngào chuẩn phong cách tiểu thư.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'legendary',
    tokenPrice: 1800,
    requiredLevel: 14,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/princess_lolita.svg',
    zIndex: 60
  },
  {
    id: 'top_chibi_bear_hoodie',
    itemCode: 'top_chibi_bear_hoodie',
    nameEn: 'Teddy Bear Chibi Hoodie',
    nameVi: 'Áo Hoodie Gấu Bông Chibi',
    description: 'Áo bông gấu nâu ấm áp có túi bàn chân gấu siêu cấp dễ thương.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'rare',
    tokenPrice: 380,
    requiredLevel: 3,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/bear_hoodie.svg',
    zIndex: 60
  },
  {
    id: 'top_prince_vest',
    itemCode: 'top_prince_vest',
    nameEn: 'Royal Prince Gala Vest',
    nameVi: 'Áo Vest Hoàng Tử Quý Tộc',
    description: 'Vest hoàng gia xanh navy phối trắng đính nút vàng và cầu vai lộng lẫy.',
    category: 'tops',
    layerSlot: 'tops',
    rarityTier: 'legendary',
    tokenPrice: 1600,
    requiredLevel: 12,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/tops/prince_vest.svg',
    zIndex: 60
  },

  // Bottoms
  {
    id: 'bot_pleated_skirt',
    itemCode: 'bot_pleated_skirt',
    nameEn: 'Academic Pleated Skirt',
    nameVi: 'Váy Xếp Ly Đồng Phục',
    description: 'Chân váy xếp ly trang nhã học đường chuẩn phong cách quý tộc.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'common',
    tokenPrice: 180,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/pleated_skirt.svg',
    zIndex: 50
  },
  {
    id: 'bot_cargo_joggers',
    itemCode: 'bot_cargo_joggers',
    nameEn: 'Urban Cargo Joggers',
    nameVi: 'Quần Túi Hộp Chiến Thuật',
    description: 'Túi hộp đai khóa phong cách Streetwear cực chất.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'rare',
    tokenPrice: 350,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/cargo_joggers.svg',
    zIndex: 50
  },
  {
    id: 'bot_wizard_skirt',
    itemCode: 'bot_wizard_skirt',
    nameEn: 'Runic Mage Trousers',
    nameVi: 'Quần Pháp Sư Thêu Chỉ Vàng',
    description: 'Họa tiết chữ Runes phát sáng viền gấu huyền bí.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'epic',
    tokenPrice: 850,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/wizard_skirt.svg',
    zIndex: 50
  },
  {
    id: 'bot_classic_chinos',
    itemCode: 'bot_classic_chinos',
    nameEn: 'Classic Khaki Chinos',
    nameVi: 'Quần Kaki Chinos Lịch Sự',
    description: 'Quần kaki màu cát trang nhã cho học viên chăm chỉ.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'common',
    tokenPrice: 160,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/classic_chinos.svg',
    zIndex: 50
  },
  {
    id: 'bot_devil_pants',
    itemCode: 'bot_devil_pants',
    nameEn: 'Shadow Punk Trousers',
    nameVi: 'Quần Jean Đen Rách Gối Ác Quỷ',
    description: 'Quần skinny đen rách gối cá tính phối xích sắt nhỏ.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'rare',
    tokenPrice: 320,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/devil_pants.svg',
    zIndex: 50
  },
  {
    id: 'bot_lolita_skirt',
    itemCode: 'bot_lolita_skirt',
    nameEn: 'Tiered Frill Lolita Skirt',
    nameVi: 'Chân Váy Xòe Ren Bồng Bềnh',
    description: 'Váy ren 3 tầng xếp nếp viền đăng ten trắng xòe bồng đáng yêu.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'epic',
    tokenPrice: 650,
    requiredLevel: 8,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/lolita_skirt.svg',
    zIndex: 50
  },
  {
    id: 'bot_angel_skirt',
    itemCode: 'bot_angel_skirt',
    nameEn: 'Celestial Silk Skirt',
    nameVi: 'Chân Váy Lụa Thiên Thần Trắng',
    description: 'Chân váy lụa trắng viền ren vàng kim thánh thiện.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'epic',
    tokenPrice: 580,
    requiredLevel: 7,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/angel_skirt.svg',
    zIndex: 50
  },
  {
    id: 'bot_chibi_shorts',
    itemCode: 'bot_chibi_shorts',
    nameEn: 'Denim Dungaree Shorts',
    nameVi: 'Quần Yếm Denim Chibi Cute',
    description: 'Quần yếm bò xanh năng động đính cúc tròn to bản.',
    category: 'bottoms',
    layerSlot: 'bottoms',
    rarityTier: 'common',
    tokenPrice: 180,
    requiredLevel: 2,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bottoms/chibi_shorts.svg',
    zIndex: 50
  },

  // Footwear
  {
    id: 'foot_leather_oxford',
    itemCode: 'foot_leather_oxford',
    nameEn: 'Polished Oxford Shoes',
    nameVi: 'Giày Da Oxford Bóng Bẩy',
    description: 'Ánh sáng bóng loáng phản chiếu đẳng cấp học giả.',
    category: 'footwear',
    layerSlot: 'footwear',
    rarityTier: 'rare',
    tokenPrice: 320,
    requiredLevel: 3,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/footwear/leather_oxford.svg',
    zIndex: 40
  },
  {
    id: 'foot_cyber_kicks',
    itemCode: 'foot_cyber_kicks',
    nameEn: 'Neon Air Striders',
    nameVi: 'Giày Thể Thao Đệm Khí Neon',
    description: 'Đế giày nhấp nháy ánh sáng tím Neon cực kỳ bắt mắt.',
    category: 'footwear',
    layerSlot: 'footwear',
    rarityTier: 'epic',
    tokenPrice: 900,
    requiredLevel: 12,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/footwear/cyber_kicks.svg',
    zIndex: 40
  },
  {
    id: 'foot_hermes_boots',
    itemCode: 'foot_hermes_boots',
    nameEn: 'Hermes Winged Boots',
    nameVi: 'Bốt Thần Gió Có Cánh',
    description: 'Đôi cánh vàng nhỏ vẫy nhẹ ở gót chân thần tốc.',
    category: 'footwear',
    layerSlot: 'footwear',
    rarityTier: 'legendary',
    tokenPrice: 2500,
    requiredLevel: 20,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/footwear/hermes_boots.svg',
    zIndex: 40
  },

  // Headwear
  {
    id: 'head_graduation_cap',
    itemCode: 'head_graduation_cap',
    nameEn: 'Valedictorian Mortarboard',
    nameVi: 'Mũ Cử Nhân Tri Thức',
    description: 'Dải tua rua vàng lay nhẹ trong gió chứng nhận thủ khoa.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 500,
    requiredLevel: 8,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/graduation_cap.svg',
    zIndex: 90
  },
  {
    id: 'head_cyber_headphones',
    itemCode: 'head_cyber_headphones',
    nameEn: 'Cyber Cat Headphones',
    nameVi: 'Tai Nghe Chụp Tai Gaming LED',
    description: 'Vành tai mèo phát sáng đổi 7 màu sống động.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'epic',
    tokenPrice: 1200,
    requiredLevel: 14,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/cyber_headphones.svg',
    zIndex: 90
  },
  {
    id: 'head_olympus_crown',
    itemCode: 'head_olympus_crown',
    nameEn: 'Golden Laurels of Olympus',
    nameVi: 'Vòng Nguyệt Quế Vàng Olympus',
    description: 'Lá vàng óng ánh tỏa bụi sáng lấp lánh vinh danh nhà vô địch.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'legendary',
    tokenPrice: 4000,
    requiredLevel: 30,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/olympus_crown.svg',
    zIndex: 90
  },
  {
    id: 'head_beret_paris',
    itemCode: 'head_beret_paris',
    nameEn: 'Parisian Artist Beret',
    nameVi: 'Mũ Nồi Nghệ Sĩ Paris',
    description: 'Mũ beret nỉ đỏ phong cách quý phái lãng mạn.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 360,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/beret_paris.svg',
    zIndex: 90
  },
  {
    id: 'head_devil_horns',
    itemCode: 'head_devil_horns',
    nameEn: 'Little Demon Horns',
    nameVi: 'Cặp Sừng Ác Quỷ Chibi Cute',
    description: 'Cặp sừng ác quỷ đỏ ruby nhỏ nhắn cực kỳ đáng yêu phong cách chibi.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 450,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/devil_horns.svg',
    zIndex: 90
  },
  {
    id: 'head_angel_halo',
    itemCode: 'head_angel_halo',
    nameEn: 'Seraphic Golden Halo',
    nameVi: 'Vòng Hào Quang Thiên Thần',
    description: 'Vòng tròn thiên sứ vàng kim bay lơ lửng trên đỉnh đầu phát sáng ấm áp.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 520,
    requiredLevel: 6,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/angel_halo.svg',
    zIndex: 90
  },
  {
    id: 'head_bunny_ears',
    itemCode: 'head_bunny_ears',
    nameEn: 'Fluffy Bunny Ears',
    nameVi: 'Tai Thỏ Cute Siêu Đáng Yêu',
    description: 'Đôi tai thỏ trắng hồng lúc lắc, trang sức quốc dân của các tín đồ Chibi dễ thương.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 380,
    requiredLevel: 3,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/bunny_ears.svg',
    zIndex: 90
  },
  {
    id: 'head_cat_ears',
    itemCode: 'head_cat_ears',
    nameEn: 'Neko Bell Ears',
    nameVi: 'Tai Mèo Chibi Có Chuông Vàng',
    description: 'Tai mèo nhung đen mềm mại gắn chuông leng keng vui tai mỗi bước đi.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'rare',
    tokenPrice: 400,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/cat_ears.svg',
    zIndex: 90
  },
  {
    id: 'head_crown_royal',
    itemCode: 'head_crown_royal',
    nameEn: 'Chibi Imperial Crown',
    nameVi: 'Vương Miện Hoàng Gia Chibi',
    description: 'Vương miện vàng nạm kim cương và hồng ngọc danh giá.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'legendary',
    tokenPrice: 2800,
    requiredLevel: 20,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/crown_royal.svg',
    zIndex: 90
  },
  {
    id: 'head_straw_hat',
    itemCode: 'head_straw_hat',
    nameEn: 'Cozy Farm Straw Hat',
    nameVi: 'Nón Rơm Nông Trại Chibi',
    description: 'Nón rơm mộc mạc gắn nơ hoa cúc đồng nội gợi nhớ ký ức Avatar TeaMobi xưa.',
    category: 'headwear',
    layerSlot: 'headwear',
    rarityTier: 'common',
    tokenPrice: 160,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/headwear/straw_hat.svg',
    zIndex: 90
  },

  // Eyewear
  {
    id: 'eye_smart_glasses',
    itemCode: 'eye_smart_glasses',
    nameEn: 'Scholastic Wireframe Glasses',
    nameVi: 'Kính Cận Trí Thức Mạ Vàng',
    description: 'Tròng kính phản chiếu ánh sáng thông tuệ của học giả chăm chỉ.',
    category: 'eyewear',
    layerSlot: 'eyewear',
    rarityTier: 'common',
    tokenPrice: 220,
    requiredLevel: 2,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/eyewear/smart_glasses.svg',
    zIndex: 95
  },
  {
    id: 'eye_vr_visor',
    itemCode: 'eye_vr_visor',
    nameEn: 'Cyber Tactical Visor',
    nameVi: 'Kính Thực Tế Ảo Cyber',
    description: 'Màn hình hiển thị dữ liệu số HUD quét liên tục.',
    category: 'eyewear',
    layerSlot: 'eyewear',
    rarityTier: 'epic',
    tokenPrice: 1050,
    requiredLevel: 16,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/eyewear/vr_visor.svg',
    zIndex: 95
  },
  {
    id: 'eye_aviator_shades',
    itemCode: 'eye_aviator_shades',
    nameEn: 'Cool Aviator Sunglasses',
    nameVi: 'Kính Râm Phi Công Cực Ngầu',
    description: 'Gọng mạ bạc bóng bẩy chống tia cực tím từ vựng.',
    category: 'eyewear',
    layerSlot: 'eyewear',
    rarityTier: 'rare',
    tokenPrice: 380,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/eyewear/aviator_shades.svg',
    zIndex: 95
  },

  // Handheld
  {
    id: 'hand_magic_tome',
    itemCode: 'hand_magic_tome',
    nameEn: 'Grimoire of Ancient Grammar',
    nameVi: 'Sách Cổ Ngữ Pháp Cấm Thuật',
    description: 'Sách bay lơ lửng bên tay tự động lật trang ghi chép từ vựng cổ.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'legendary',
    tokenPrice: 3500,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/magic_tome.svg',
    zIndex: 100
  },
  {
    id: 'hand_golden_mic',
    itemCode: 'hand_golden_mic',
    nameEn: 'Golden Voice Champion Mic',
    nameVi: 'Micro Mạ Vàng Thần Thoại',
    description: 'Sóng âm nhạc nốt vàng tỏa ra xung quanh nâng tầm giọng nói.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'epic',
    tokenPrice: 1500,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/golden_mic.svg',
    zIndex: 100
  },
  {
    id: 'hand_quill_pen',
    itemCode: 'hand_quill_pen',
    nameEn: 'Scholar Golden Quill',
    nameVi: 'Bút Lông Vũ Cổ Điển',
    description: 'Bút lông ngỗng vàng ngòi kim sa viết nên bài luận hoàn hảo.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'rare',
    tokenPrice: 450,
    requiredLevel: 7,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/quill_pen.svg',
    zIndex: 100
  },
  {
    id: 'hand_giant_lollipop',
    itemCode: 'hand_giant_lollipop',
    nameEn: 'Rainbow Swirl Giant Lollipop',
    nameVi: 'Cây Kẹo Mút Khổng Lồ Cầu Vồng',
    description: 'Cây kẹo mút xoắn ốc 7 màu siêu to ngọt ngào đậm chất Chibi.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'epic',
    tokenPrice: 900,
    requiredLevel: 6,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/giant_lollipop.svg',
    zIndex: 100
  },
  {
    id: 'hand_star_wand',
    itemCode: 'hand_star_wand',
    nameEn: 'Magical Girl Star Scepter',
    nameVi: 'Gậy Ma Thuật Ngôi Sao Biến Hình',
    description: 'Gậy phép ngôi sao vàng gắn cánh nhỏ phát sáng lung linh.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'legendary',
    tokenPrice: 1600,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/star_wand.svg',
    zIndex: 100
  },
  {
    id: 'hand_devil_pitchfork',
    itemCode: 'hand_devil_pitchfork',
    nameEn: 'Crimson Imp Trident',
    nameVi: 'Đinh Ba Ác Quỷ Mini Cute',
    description: 'Cây chĩa 3 nhỏ nhắn màu đỏ đen ngầu lòi nhưng cực kỳ đáng yêu.',
    category: 'handheld',
    layerSlot: 'handheld',
    rarityTier: 'rare',
    tokenPrice: 550,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/handheld/devil_pitchfork.svg',
    zIndex: 100
  },

  // Aura & Pedestal
  {
    id: 'aura_floating_books',
    itemCode: 'aura_floating_books',
    nameEn: 'Orbiting Lexicon Runes',
    nameVi: 'Vòng Xoáy Sách Tri Thức',
    description: '4 quyển từ điển thu nhỏ bay xoay quanh người tiếp thêm cảm hứng.',
    category: 'aura_background',
    layerSlot: 'pedestal_aura',
    rarityTier: 'epic',
    tokenPrice: 1600,
    requiredLevel: 18,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/aura/floating_books.svg',
    zIndex: 0
  },
  {
    id: 'aura_golden_triumph',
    itemCode: 'aura_golden_triumph',
    nameEn: 'Aura of Victorious Flames',
    nameVi: 'Hào Quang Lửa Vàng Vinh Quang',
    description: 'Lửa thần vàng rực bốc lên từ bục chân tôn vinh sự kiên trì.',
    category: 'aura_background',
    layerSlot: 'pedestal_aura',
    rarityTier: 'legendary',
    tokenPrice: 4500,
    requiredLevel: 35,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/aura/golden_triumph.svg',
    zIndex: 0
  },

  // Consumables
  {
    id: 'boost_streak_freeze',
    itemCode: 'boost_streak_freeze',
    nameEn: 'Streak Freeze Shield',
    nameVi: 'Băng Bảo Vệ Chuỗi Ngày Học',
    description: 'Tự động bảo lưu Streak nếu quên học 1 ngày.',
    category: 'consumable',
    layerSlot: 'consumable',
    rarityTier: 'rare',
    tokenPrice: 200,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/streak_freeze.svg',
    zIndex: 0
  },
  {
    id: 'boost_double_xp',
    itemCode: 'boost_double_xp',
    nameEn: '2-Hour Double XP Potion',
    nameVi: 'Bình Nhân Đôi XP 2 Giờ',
    description: 'Gấp đôi kinh nghiệm nhận được từ tất cả mini-game trong 2 giờ.',
    category: 'consumable',
    layerSlot: 'consumable',
    rarityTier: 'rare',
    tokenPrice: 250,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/potion_xp.svg',
    zIndex: 0
  },

  // ==========================================
  // Full Outfit Sets / Bundles (Nguyên Set Đồ)
  // ==========================================
  {
    id: 'set_cyberpunk_master',
    itemCode: 'set_cyberpunk_master',
    nameEn: 'Cyberpunk Luminary Full Set',
    nameVi: 'Nguyên Set Cơ Khí Cyber Neon',
    description: 'Trọn bộ tương lai cao cấp: Áo Bomber Cyber + Quần Túi Hộp + Kính VR Cyber + Cánh Cơ Khí Cyber Neon + Hào Quang Ma Trận.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 3200,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_cyberpunk.svg',
    zIndex: 120
  },
  {
    id: 'set_royal_scholar',
    itemCode: 'set_royal_scholar',
    nameEn: 'Royal Grand Scholar Full Set',
    nameVi: 'Nguyên Set Đại Học Giả Hoàng Gia',
    description: 'Trọn bộ học thuật vinh danh: Áo Vest Học Giả Oxford + Quần Kaki Chinos + Mũ Cử Nhân + Bút Lông Vũ Cổ Điển + Đôi Cánh Thiên Thần Tri Thức.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 3500,
    requiredLevel: 12,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_scholar.svg',
    zIndex: 120
  },
  {
    id: 'set_phoenix_warlord',
    itemCode: 'set_phoenix_warlord',
    nameEn: 'Blazing Phoenix Warlord Set',
    nameVi: 'Nguyên Set Chiến Vương Phượng Hoàng',
    description: 'Trọn bộ rực lửa thần thoại: Áo Choàng Đại Pháp Sư + Quần Pháp Sư + Vương Miện Quán Quân + Đôi Cánh Phượng Hoàng Lửa + Hào Quang Lửa Vàng.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 5800,
    requiredLevel: 25,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_phoenix.svg',
    zIndex: 120
  },
  {
    id: 'set_detective_holmes',
    itemCode: 'set_detective_holmes',
    nameEn: 'Baker Street Master Detective Set',
    nameVi: 'Nguyên Set Thám Tử Huyền Thoại',
    description: 'Trọn bộ phá án London: Áo Măng Tô Baker + Quần Tây Doanh Nhân + Mũ Thám Tử Săn Hươu + Kính Phi Công Cổ Điển + Bút Lông Vũ Cổ Điển.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'epic',
    tokenPrice: 2200,
    requiredLevel: 8,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_detective.svg',
    zIndex: 120
  },
  {
    id: 'set_celestial_angel',
    itemCode: 'set_celestial_angel',
    nameEn: 'Celestial Archangel Seraph Set',
    nameVi: 'Nguyên Set Sứ Giả Ánh Sáng',
    description: 'Trọn bộ thiên thần thánh khiết: Áo Hoodie Học Giả + Mũ Nguyệt Quế Olympus + Micro Mạ Vàng Thần Thoại + Đôi Cánh Thiên Thần Tri Thức.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 4200,
    requiredLevel: 18,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_angel.svg',
    zIndex: 120
  },
  {
    id: 'set_devil_night',
    itemCode: 'set_devil_night',
    nameEn: 'Midnight Imp Demonic Full Set',
    nameVi: 'Nguyên Set Ác Quỷ Dạ Xoa Cute',
    description: 'Trọn bộ ác quỷ bóng đêm siêu ngầu: Đôi Cánh Ác Quỷ Dạ Xoa + Cặp Sừng Ác Quỷ + Áo Hoodie Ác Quỷ + Quần Jean Đen + Đinh Ba Mini.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 4500,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_devil.svg',
    zIndex: 120
  },
  {
    id: 'set_angel_divine',
    itemCode: 'set_angel_divine',
    nameEn: 'Celestial Angel Seraph Full Set',
    nameVi: 'Nguyên Set Thiên Thần Thánh Thiện Chibi',
    description: 'Trọn bộ thiên thần thánh khiết: Đôi Cánh Thiên Thần + Vòng Hào Quang + Áo Choàng Lụa Thiên Thần + Chân Váy Lụa + Gậy Ngôi Sao.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 4800,
    requiredLevel: 15,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_angel_divine.svg',
    zIndex: 120
  },
  {
    id: 'set_princess_lolita',
    itemCode: 'set_princess_lolita',
    nameEn: 'Sweet Lolita Princess Full Set',
    nameVi: 'Nguyên Set Công Chúa Lolita Ngọt Ngào',
    description: 'Trọn bộ công chúa kẹo ngọt: Tai Thỏ Cute + Đầm Lolita Dạ Hội + Chân Váy Xòe Ren + Kẹo Mút Khổng Lồ + Đôi Cánh Bướm Tiên Giới.',
    category: 'bundle',
    layerSlot: 'bundle',
    rarityTier: 'legendary',
    tokenPrice: 5200,
    requiredLevel: 16,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/avatar/bundles/set_lolita.svg',
    zIndex: 120
  },

  // ==========================================
  // IELTS & TOEIC Exam Tickets (Vé Thi Thử / Luyện Thi)
  // ==========================================
  {
    id: 'ticket_ielts_mock_master',
    itemCode: 'ticket_ielts_mock_master',
    nameEn: 'IELTS Mock Exam Master Pass',
    nameVi: 'Vé Thi Thử IELTS 4 Kỹ Năng Chuẩn Quốc Tế',
    description: 'Vé mở khóa phòng thi mô phỏng chuẩn đề thi thật IELTS (Nghe, Nói, Đọc, Viết) với đồng hồ bấm giờ, chấm điểm tự động và nhận xét chi tiết band 1.0 - 9.0 từ AI Examiner.',
    category: 'ticket',
    layerSlot: 'ticket',
    rarityTier: 'epic',
    tokenPrice: 450,
    requiredLevel: 5,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/ticket_ielts.svg',
    zIndex: 10
  },
  {
    id: 'ticket_toeic_champion_exam',
    itemCode: 'ticket_toeic_champion_exam',
    nameEn: 'TOEIC Speed Champion 990 Pass',
    nameVi: 'Vé Đấu Trường TOEIC 990 Điểm',
    description: 'Vé mở khóa phòng thi Full Test 200 câu TOEIC chuẩn format ETS với áp lực bấm giờ thời gian thực, bảng phân tích điểm mạnh yếu và bẫy ngữ pháp.',
    category: 'ticket',
    layerSlot: 'ticket',
    rarityTier: 'rare',
    tokenPrice: 300,
    requiredLevel: 3,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/ticket_toeic.svg',
    zIndex: 10
  },
  {
    id: 'ticket_ielts_speaking_vip',
    itemCode: 'ticket_ielts_speaking_vip',
    nameEn: 'IELTS Speaking 1-on-1 VIP Room Pass',
    nameVi: 'Vé Luyện Nói 1-1 IELTS VIP Với Giám Khảo AI',
    description: 'Mở khóa 30 phút luyện nói chuyên sâu phòng thi 1v1 với giám khảo AI theo format Part 1-2-3 và nhận báo cáo ngữ điệu, phát âm Phoneme chi tiết.',
    category: 'ticket',
    layerSlot: 'ticket',
    rarityTier: 'legendary',
    tokenPrice: 750,
    requiredLevel: 10,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/ticket_speaking.svg',
    zIndex: 10
  },
  {
    id: 'ticket_toeic_listening_booster',
    itemCode: 'ticket_toeic_listening_booster',
    nameEn: 'TOEIC Rapid Audio Sprint Ticket',
    nameVi: 'Vé Luyện Nghe Tốc Độ Cao TOEIC Part 3-4',
    description: 'Vé tham gia bài test nghe nhanh x1.25 tốc độ chuẩn đề thi TOEIC Part 3 & 4 để rèn phản xạ bắt từ khóa trong 5 giây.',
    category: 'ticket',
    layerSlot: 'ticket',
    rarityTier: 'common',
    tokenPrice: 120,
    requiredLevel: 1,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/ticket_listening.svg',
    zIndex: 10
  },
  {
    id: 'ticket_ielts_writing_review',
    itemCode: 'ticket_ielts_writing_review',
    nameEn: 'IELTS AI Writing Examiner Fast-Pass',
    nameVi: 'Vé Chấm Bài Writing IELTS Siêu Tốc',
    description: 'Gửi 1 bài luận Task 1 hoặc Task 2 để nhận báo cáo sửa lỗi ngữ pháp, nâng cấp từ vựng học thuật C1-C2 và dự đoán Band điểm chi tiết.',
    category: 'ticket',
    layerSlot: 'ticket',
    rarityTier: 'rare',
    tokenPrice: 250,
    requiredLevel: 4,
    isPurchasable: true,
    isLimitedEdition: false,
    assetSvgKey: 'assets/icons/ticket_writing.svg',
    zIndex: 10
  }
];

export function getSlotKey(item: { category?: string; layerSlot?: string }): string {
  const cat = (item.category || '').toLowerCase();
  const slot = (item.layerSlot || '').toLowerCase();
  if (cat === 'bundle' || slot === 'bundle') return 'bundle';
  if (cat === 'wings' || slot === 'wings') return 'wings';
  if (cat === 'tops' || slot === 'tops') return 'tops';
  if (cat === 'bottoms' || slot === 'bottoms') return 'bottoms';
  if (cat === 'footwear' || slot === 'footwear') return 'footwear';
  if (cat === 'headwear' || slot === 'headwear') return 'headwear';
  if (cat === 'eyewear' || slot === 'eyewear') return 'eyewear';
  if (cat === 'neckwear' || slot === 'neckwear') return 'neckwear';
  if (cat === 'handheld' || slot === 'handheld') return 'handheld';
  if (cat === 'aura_background' || slot === 'pedestal_aura' || cat === 'aura') return 'pedestal_aura';
  if (cat === 'ticket' || slot === 'ticket') return `ticket_${(item as any).itemCode || ''}`;
  if (cat === 'consumable' || slot === 'consumable') return `consumable_${(item as any).itemCode || ''}`;
  return slot || cat;
}

interface ShopState {
  catalog: ShopItemDto[];
  total: number;
  category: string;
  rarity: string;
  search: string;
  loading: boolean;
  error: string | null;
  // Key is normalized slot category key, value is ShopItemDto
  tryingOnItems: Record<string, ShopItemDto>;
  lastReplacementNotice: string | null;
  clearReplacementNotice: () => void;

  fetchCatalog: () => Promise<void>;
  setCategory: (cat: string) => void;
  setRarity: (r: string) => void;
  setSearch: (s: string) => void;
  tryOnItem: (item: ShopItemDto) => void;
  removeTryOn: (slot: string) => void;
  clearTryOn: () => void;
  purchaseItem: (itemCode: string, autoEquip?: boolean) => Promise<PurchaseResultDto | null>;
  purchaseTryOnBundle: (autoEquip?: boolean) => Promise<PurchaseBundleResultDto | null>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  catalog: FALLBACK_SHOP_ITEMS,
  total: FALLBACK_SHOP_ITEMS.length,
  category: 'all',
  rarity: 'all',
  search: '',
  loading: false,
  error: null,
  tryingOnItems: {},
  lastReplacementNotice: null,

  clearReplacementNotice: () => set({ lastReplacementNotice: null }),

  fetchCatalog: async () => {
    try {
      set({ loading: true, error: null });
      const { category, rarity, search } = get();
      const res = await avatarShopService.getShopCatalog({
        category: category === 'all' ? undefined : category,
        rarity: rarity === 'all' ? undefined : rarity,
        search: search.trim() || undefined,
        pageSize: 100
      });

      if (res && res.items && res.items.length > 0) {
        set({ catalog: res.items, total: res.total, loading: false });
      } else {
        // Filter fallback items
        let items = FALLBACK_SHOP_ITEMS;
        if (category !== 'all') items = items.filter(i => i.category === category);
        if (rarity !== 'all') items = items.filter(i => i.rarityTier === rarity);
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          items = items.filter(i => i.nameVi.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q));
        }
        set({ catalog: items, total: items.length, loading: false });
      }
    } catch (err: any) {
      // Graceful fallback to rich sample items so the shop is never empty
      const { category, rarity, search } = get();
      let items = FALLBACK_SHOP_ITEMS;
      if (category !== 'all') items = items.filter(i => i.category === category);
      if (rarity !== 'all') items = items.filter(i => i.rarityTier === rarity);
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        items = items.filter(i => i.nameVi.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q));
      }
      set({ catalog: items, total: items.length, error: null, loading: false });
    }
  },

  setCategory: (cat: string) => {
    set({ category: cat });
    get().fetchCatalog();
  },

  setRarity: (r: string) => {
    set({ rarity: r });
    get().fetchCatalog();
  },

  setSearch: (s: string) => {
    set({ search: s });
    get().fetchCatalog();
  },

  tryOnItem: (item: ShopItemDto) => {
    if (item.category === 'bundle') {
      const bundleMap: Record<string, string[]> = {
        set_cyberpunk_master: ['top_cyber_jacket', 'bot_cargo_joggers', 'eye_vr_visor', 'wings_cyber_neon', 'aura_floating_books'],
        set_royal_scholar: ['top_oxford_blazer', 'bot_classic_chinos', 'head_graduation_cap', 'hand_quill_pen', 'wings_angel_celestial'],
        set_phoenix_warlord: ['top_wizard_robe', 'bot_wizard_skirt', 'head_olympus_crown', 'wings_phoenix_flame', 'aura_golden_triumph'],
        set_detective_holmes: ['top_detective_trench', 'bot_suit_pants', 'head_detective_hat', 'eye_steampunk_goggles', 'hand_quill_pen'],
        set_celestial_angel: ['top_scholastic_hoodie', 'head_olympus_crown', 'hand_golden_mic', 'wings_angel_celestial'],
        set_devil_night: ['top_devil_hoodie', 'bot_devil_pants', 'head_devil_horns', 'hand_devil_pitchfork', 'wings_devil_demonic'],
        set_angel_divine: ['top_angel_tunic', 'bot_angel_skirt', 'head_angel_halo', 'hand_star_wand', 'wings_angel_celestial'],
        set_princess_lolita: ['top_princess_lolita', 'bot_lolita_skirt', 'head_bunny_ears', 'hand_giant_lollipop', 'wings_fairy_butterfly']
      };
      const codes = bundleMap[item.itemCode] || [];
      const catalog = get().catalog;
      set(state => {
        const next = { ...state.tryingOnItems };
        let notice: string | null = null;
        if (next['bundle']?.itemCode === item.itemCode) {
          delete next['bundle'];
          codes.forEach(c => {
            const sub = catalog.find(x => x.itemCode === c) || FALLBACK_SHOP_ITEMS.find(x => x.itemCode === c);
            if (sub) {
              const k = getSlotKey(sub);
              if (next[k]?.itemCode === c) delete next[k];
            }
          });
          notice = `Đã gỡ ${item.nameVi} khỏi giỏ thử đồ`;
        } else {
          // Replace previous bundle and replace constituent slots
          next['bundle'] = item;
          codes.forEach(c => {
            const sub = catalog.find(x => x.itemCode === c) || FALLBACK_SHOP_ITEMS.find(x => x.itemCode === c);
            if (sub) {
              const k = getSlotKey(sub);
              next[k] = sub;
            }
          });
          notice = `✨ Đã thử ${item.nameVi} và tự động thay thế các trang phục cùng loại!`;
        }
        return { tryingOnItems: next, lastReplacementNotice: notice };
      });
      return;
    }

    const slotKey = getSlotKey(item);
    set(state => {
      const next = { ...state.tryingOnItems };
      let notice: string | null = null;
      const existingItem = next[slotKey];

      if (existingItem && existingItem.itemCode === item.itemCode) {
        // Toggle off if already trying on this exact item
        delete next[slotKey];
        notice = `Đã bỏ chọn ${item.nameVi}`;
      } else {
        if (existingItem) {
          // User selected item B while item A was already selected in the same category/slot:
          // Remove item A and replace with item B!
          delete next[slotKey];
          notice = `Đã đổi "${existingItem.nameVi}" sang "${item.nameVi}" (cùng loại)`;
        } else {
          notice = `Đã thêm "${item.nameVi}" vào giỏ thử`;
        }
        next[slotKey] = item;
      }
      return { tryingOnItems: next, lastReplacementNotice: notice };
    });
  },

  removeTryOn: (slot: string) => {
    set(state => {
      const next = { ...state.tryingOnItems };
      // slot can be normalized slotKey or itemCode or layerSlot
      let removedItemName: string | null = null;
      if (next[slot]) {
        removedItemName = next[slot].nameVi;
        delete next[slot];
      } else {
        // Look up by itemCode or layerSlot
        for (const [k, v] of Object.entries(next)) {
          if (v.itemCode === slot || v.layerSlot === slot || k === slot) {
            removedItemName = v.nameVi;
            delete next[k];
            break;
          }
        }
      }
      return {
        tryingOnItems: next,
        lastReplacementNotice: removedItemName ? `Đã xóa "${removedItemName}" khỏi giỏ thử` : null
      };
    });
  },

  clearTryOn: () => {
    set({ tryingOnItems: {} });
  },

  purchaseItem: async (itemCode: string, autoEquip = false) => {
    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.purchaseItem({ itemCode, autoEquip });
      
      // Update catalog ownership
      set(state => ({
        catalog: state.catalog.map(i => i.itemCode === itemCode ? { ...i, isOwned: true } : i),
        loading: false
      }));

      // If auto equipped, refresh avatar config
      if (autoEquip) {
        useAvatarStore.getState().fetchConfig();
      }

      return res;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi mua vật phẩm', loading: false });
      return null;
    }
  },

  purchaseTryOnBundle: async (autoEquip = false) => {
    const tryingOn = get().tryingOnItems;
    const itemCodes = Object.values(tryingOn).map(i => i.itemCode);
    if (itemCodes.length === 0) return null;

    try {
      set({ loading: true, error: null });
      const res = await avatarShopService.purchaseBundle({ itemCodes, autoEquip });

      // Update catalog items
      set(state => ({
        catalog: state.catalog.map(i => itemCodes.includes(i.itemCode) ? { ...i, isOwned: true } : i),
        tryingOnItems: {},
        loading: false
      }));

      if (autoEquip) {
        useAvatarStore.getState().fetchConfig();
      }

      return res;
    } catch (err: any) {
      set({ error: err.message || 'Lỗi thanh toán giỏ đồ thử', loading: false });
      return null;
    }
  }
}));

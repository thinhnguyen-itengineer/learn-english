using LearnEnglish.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LearnEnglish.Api.Data;

public static class DataSeeder3D
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var items = new List<AvatarItem3D>
        {
            // === 1. BASE_BODY (3 items) ===
            new()
            {
                Id = "body_chibi_male_01",
                Name = "Thân Chibi Nam Tiêu Chuẩn (Standard Boy)",
                Description = "Khung cơ thể Chibi nam chuẩn SD tỷ lệ 2.8 đầu, phong cách Vinyl Toy bóng bẩy.",
                Slot = "BASE_BODY",
                Rarity = "COMMON",
                Gender = "MALE",
                ModelUrl = "/models/3d/body_chibi_male_01.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_male_01.webp",
                PriceTokens = 0,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 4200,
                FileSizeBytes = 450000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "body_chibi_female_01",
                Name = "Thân Chibi Nữ Tiêu Chuẩn (Standard Girl)",
                Description = "Khung cơ thể Chibi nữ chuẩn SD tỷ lệ 2.8 đầu, đường nét mềm mại dễ thương.",
                Slot = "BASE_BODY",
                Rarity = "COMMON",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/body_chibi_female_01.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_female_01.webp",
                PriceTokens = 0,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 4100,
                FileSizeBytes = 440000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "body_chibi_mecha_01",
                Name = "Thân Chibi Cơ Giáp Cyber (Cyber Mecha)",
                Description = "Khung cơ thể bán cơ khí tương lai với đèn LED neon chạy dọc sống lưng.",
                Slot = "BASE_BODY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/body_chibi_mecha_01.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_mecha_01.webp",
                PriceTokens = 1500,
                LevelRequired = 10,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 4800,
                FileSizeBytes = 520000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // === 2. HAIR (3 items) ===
            new()
            {
                Id = "hair_zingspeed_spiky_grey",
                Name = "Tóc Vuốt Nhọn Tốc Độ (Zing Racer Grey)",
                Description = "Mái tóc vuốt dựng phong trần xám khói điểm dải highlight vàng chanh.",
                Slot = "HAIR",
                Rarity = "RARE",
                Gender = "MALE",
                ModelUrl = "/models/3d/hair_zingspeed_spiky_grey.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_zingspeed_spiky_grey.webp",
                PriceTokens = 350,
                LevelRequired = 2,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2900,
                FileSizeBytes = 280000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_zingspeed_pink_twintails",
                Name = "Tóc Hai Chùm Idol Kẹo Ngọt (Sweet Idol Twintails)",
                Description = "Mái tóc bồng bềnh hồng pastel buộc hai chùm dài kẹp ngôi sao lấp lánh.",
                Slot = "HAIR",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/hair_zingspeed_pink_twintails.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_zingspeed_pink_twintails.webp",
                PriceTokens = 600,
                LevelRequired = 3,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3200,
                FileSizeBytes = 310000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_cyber_neon_dreadlocks",
                Name = "Tóc Cyberpunk Dạ Quang (Neon Dreadlocks)",
                Description = "Búi tóc tết dreadlocks phát quang theo nhịp điệu âm nhạc điện tử.",
                Slot = "HAIR",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/hair_cyber_neon_dreadlocks.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_cyber_neon_dreadlocks.webp",
                PriceTokens = 1200,
                LevelRequired = 8,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3400,
                FileSizeBytes = 330000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // === 3. TOP (3 items) ===
            new()
            {
                Id = "top_zingspeed_black_hoodie",
                Name = "Áo Hoodie ZingSpeed Đen Tia Chớp (Speed Lightning Hoodie)",
                Description = "Hoodie đen thời trang đường phố in huy hiệu đôi cánh sấm sét ZingSpeed và sọc dạ quang neon.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "MALE",
                ModelUrl = "/models/3d/top_zingspeed_black_hoodie.glb",
                ThumbnailUrl = "/thumbnails/3d/top_zingspeed_black_hoodie.webp",
                PriceTokens = 450,
                LevelRequired = 2,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string> { "Slot_Neckwear" },
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3100,
                FileSizeBytes = 300000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_zingspeed_white_hoodie",
                Name = "Áo Hoodie Trắng Kem Sweetheart (Sweetheart Oversized Hoodie)",
                Description = "Hoodie trắng kem form rộng siêu dễ thương với logo cánh sấm sét xanh vàng.",
                Slot = "TOP",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/top_zingspeed_white_hoodie.glb",
                ThumbnailUrl = "/thumbnails/3d/top_zingspeed_white_hoodie.webp",
                PriceTokens = 550,
                LevelRequired = 3,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3000,
                FileSizeBytes = 295000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_cyber_racing_jacket",
                Name = "Áo Jacket Đua Xe Cyber Giáp Quang (Neon Drift Jacket)",
                Description = "Jacket da kết hợp giáp vai sợi carbon với viền LED năng lượng đổi màu.",
                Slot = "TOP",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_cyber_racing_jacket.glb",
                ThumbnailUrl = "/thumbnails/3d/top_cyber_racing_jacket.webp",
                PriceTokens = 1400,
                LevelRequired = 9,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string> { "Slot_Neckwear" },
                MaskedBodyParts = new List<string> { "Mat_Torso", "Mat_Arms" },
                PolyCount = 3400,
                FileSizeBytes = 340000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // === 4. BOTTOM (3 items) ===
            new()
            {
                Id = "bot_zingspeed_cargo_shorts",
                Name = "Quần Short Thể Thao Dáng Rộng (Racer Cargo Shorts)",
                Description = "Quần short túi hộp đen hầm hố có dây đai neon vàng viền viền gối.",
                Slot = "BOTTOM",
                Rarity = "RARE",
                Gender = "MALE",
                ModelUrl = "/models/3d/bot_zingspeed_cargo_shorts.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_zingspeed_cargo_shorts.webp",
                PriceTokens = 300,
                LevelRequired = 2,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2200,
                FileSizeBytes = 210000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_zingspeed_pleated_skirt",
                Name = "Váy Xếp Ly Navy Năng Động (Navy Pleated Skirt)",
                Description = "Chân váy chữ A tennis xếp ly viền trắng tôn dáng Chibi tinh nghịch.",
                Slot = "BOTTOM",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/bot_zingspeed_pleated_skirt.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_zingspeed_pleated_skirt.webp",
                PriceTokens = 400,
                LevelRequired = 3,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2100,
                FileSizeBytes = 200000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_cyber_neon_joggers",
                Name = "Quần Jogger Cyber Quang Phổ (Hologram Street Joggers)",
                Description = "Quần jogger chất liệu phản quang ba chiều đổi màu theo góc nhìn.",
                Slot = "BOTTOM",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/bot_cyber_neon_joggers.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_cyber_neon_joggers.webp",
                PriceTokens = 1100,
                LevelRequired = 7,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2400,
                FileSizeBytes = 230000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // === 5. SHOES (3 items) ===
            new()
            {
                Id = "foot_zingspeed_combat_boots",
                Name = "Bốt Đua Cao Cổ Đen Chỉ Vàng (Speed Combat Boots)",
                Description = "Giày bốt da đen cao cổ đan dây gold nổi bật kết hợp tất vàng thể thao.",
                Slot = "SHOES",
                Rarity = "RARE",
                Gender = "MALE",
                ModelUrl = "/models/3d/foot_zingspeed_combat_boots.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_zingspeed_combat_boots.webp",
                PriceTokens = 280,
                LevelRequired = 2,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 1900,
                FileSizeBytes = 180000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "foot_zingspeed_pastel_sneakers",
                Name = "Sneaker Đế Bánh Mì Pastel (Sweet Pastel Platform)",
                Description = "Giày thể thao đế cao màu tím hồng pastel phối cùng tất trắng dài qua gối.",
                Slot = "SHOES",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/foot_zingspeed_pastel_sneakers.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_zingspeed_pastel_sneakers.webp",
                PriceTokens = 380,
                LevelRequired = 3,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 1850,
                FileSizeBytes = 175000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "foot_cyber_maglev_skates",
                Name = "Giày Trượt Từ Tính Đệm Khí (Maglev Hover Boots)",
                Description = "Đôi giày bay từ tính phát ra tia ion xanh lơ mỗi khi di chuyển.",
                Slot = "SHOES",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/foot_cyber_maglev_skates.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_cyber_maglev_skates.webp",
                PriceTokens = 1250,
                LevelRequired = 8,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 2000,
                FileSizeBytes = 190000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // === 6. ACCESSORY (3 items) ===
            new()
            {
                Id = "acc_cat_paw_sling_bag",
                Name = "Túi Đeo Chéo Chân Mèo Neko (Neko Paw Crossbody Bag)",
                Description = "Túi đeo chéo hình chân mèo 3D đệm hồng phấn siêu dễ thương.",
                Slot = "ACCESSORY",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/acc_cat_paw_sling_bag.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_cat_paw_sling_bag.webp",
                PriceTokens = 420,
                LevelRequired = 2,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1400,
                FileSizeBytes = 135000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_star_choker",
                Name = "Vòng Choker Da Ngôi Sao (Golden Star Choker)",
                Description = "Vòng cổ da đen đính ngôi sao vàng gold cá tính đậm chất tay đua Zing.",
                Slot = "ACCESSORY",
                Rarity = "RARE",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/acc_star_choker.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_star_choker.webp",
                PriceTokens = 200,
                LevelRequired = 1,
                BoneBindingRoot = "Neck",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 800,
                FileSizeBytes = 80000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_cyber_photon_wings",
                Name = "Đôi Cánh Năng Lượng Photon 3D (Photon Energy Wings)",
                Description = "Cặp cánh photon đa diện tỏa sáng rực rỡ và đập cánh theo nhịp thở.",
                Slot = "ACCESSORY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_cyber_photon_wings.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_cyber_photon_wings.webp",
                PriceTokens = 2000,
                LevelRequired = 12,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1500,
                FileSizeBytes = 150000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        // 1. Insert 3D items if not exist
        var existingIds = await context.AvatarItems3D.Select(x => x.Id).ToListAsync();
        var existingSet = new HashSet<string>(existingIds, StringComparer.OrdinalIgnoreCase);

        var newItems = items.Where(i => !existingSet.Contains(i.Id)).ToList();
        if (newItems.Count > 0)
        {
            context.AvatarItems3D.AddRange(newItems);
            await context.SaveChangesAsync();
        }

        // 2. Ensure each user has a UserAvatarEquip3D entry
        var users = await context.Users.ToListAsync();
        foreach (var user in users)
        {
            var equip = await context.UserAvatarEquips3D.FirstOrDefaultAsync(e => e.UserId == user.Id);
            if (equip == null)
            {
                context.UserAvatarEquips3D.Add(new UserAvatarEquip3D
                {
                    UserId = user.Id,
                    BaseBodyId = "body_chibi_male_01",
                    HairId = "hair_zingspeed_spiky_grey",
                    TopId = "top_zingspeed_black_hoodie",
                    BottomId = "bot_zingspeed_cargo_shorts",
                    ShoesId = "foot_zingspeed_combat_boots",
                    AccessoryId = null,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            // Ensure Preset 1 exists for user
            var hasPreset = await context.AvatarPresets3D.AnyAsync(p => p.UserId == user.Id && p.PresetSlot == 1);
            if (!hasPreset)
            {
                var starterConfig = new
                {
                    baseBodyId = "body_chibi_male_01",
                    hairId = "hair_zingspeed_spiky_grey",
                    topId = "top_zingspeed_black_hoodie",
                    bottomId = "bot_zingspeed_cargo_shorts",
                    shoesId = "foot_zingspeed_combat_boots",
                    accessoryId = (string?)null
                };

                context.AvatarPresets3D.Add(new AvatarPreset3D
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    PresetSlot = 1,
                    PresetName = "Tay Đua ZingSpeed Đường Phố 3D",
                    Config = JsonSerializer.Serialize(starterConfig),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }
        }

        await context.SaveChangesAsync();
    }
}

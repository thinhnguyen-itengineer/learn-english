using LearnEnglish.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LearnEnglish.Api.Data;

public static class DataSeeder3D
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // 0. Deprecate and purge obsolete 2.5D items per PHU-33 contract
        try
        {
            if (await context.UserInventories.AnyAsync())
            {
                context.UserInventories.RemoveRange(context.UserInventories);
                await context.SaveChangesAsync();
            }

            if (await context.ShopItems.AnyAsync())
            {
                context.ShopItems.RemoveRange(context.ShopItems);
                await context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DataSeeder3D] Note on 2.5D ShopItem cleanup: {ex.Message}");
        }

        var items = new List<AvatarItem3D>
        {
            // ==========================================
            // === 1. BASE_BODY (4 items) ===
            // ==========================================
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
            new()
            {
                Id = "body_chibi_golden_divine",
                Name = "Thân Chibi Hoàng Kim Thần Thoại (Golden Divine Chibi)",
                Description = "Khung cơ thể bán thần tỏa hào quang lấp lánh ánh kim dành cho quán quân Anh ngữ.",
                Slot = "BASE_BODY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/body_chibi_golden_divine.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_golden_divine.webp",
                PriceTokens = 2500,
                LevelRequired = 15,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 5200,
                FileSizeBytes = 560000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // ==========================================
            // === 2. HAIR (6 items) ===
            // ==========================================
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
                Rarity = "EPIC",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/hair_cyber_neon_dreadlocks.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_cyber_neon_dreadlocks.webp",
                PriceTokens = 750,
                LevelRequired = 5,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3400,
                FileSizeBytes = 330000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_anime_bob_blonde",
                Name = "Tóc Bob Ngắn Vàng Bạch Kim (Anime Blonde Bob)",
                Description = "Kiểu tóc bob ngắn cá tính ôm sát khuôn mặt Chibi màu vàng óng ả.",
                Slot = "HAIR",
                Rarity = "RARE",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/hair_anime_bob_blonde.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_anime_bob_blonde.webp",
                PriceTokens = 400,
                LevelRequired = 2,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2800,
                FileSizeBytes = 270000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_kpop_curtain_brown",
                Name = "Tóc Hai Mái Lãng Tử Hàn Quốc (K-Pop Curtain Brown)",
                Description = "Kiểu tóc rẽ ngôi đôi Hàn Quốc bồng bềnh màu hạt dẻ lịch lãm tự nhiên.",
                Slot = "HAIR",
                Rarity = "COMMON",
                Gender = "MALE",
                ModelUrl = "/models/3d/hair_kpop_curtain_brown.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_kpop_curtain_brown.webp",
                PriceTokens = 150,
                LevelRequired = 1,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2500,
                FileSizeBytes = 240000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_magical_ponytail_purple",
                Name = "Tóc Đuôi Ngựa Ma Pháp Tím (Magical Ponytail Purple)",
                Description = "Mái tóc buộc đuôi ngựa cao màu tím thạch anh huyền bí tỏa ánh sáng nhẹ.",
                Slot = "HAIR",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/hair_magical_ponytail_purple.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_magical_ponytail_purple.webp",
                PriceTokens = 650,
                LevelRequired = 4,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3100,
                FileSizeBytes = 300000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // ==========================================
            // === 3. TOP (8 items) ===
            // ==========================================
            new()
            {
                Id = "top_zingspeed_black_hoodie",
                Name = "Áo Hoodie ZingSpeed Đen Tia Chớp (Speed Lightning Hoodie)",
                Description = "Áo hoodie nỉ đen dày dặn form rộng phong cách ZingSpeed với biểu tượng sấm sét.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_zingspeed_black_hoodie.glb",
                ThumbnailUrl = "/thumbnails/3d/top_zingspeed_black_hoodie.webp",
                PriceTokens = 450,
                LevelRequired = 2,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3200,
                FileSizeBytes = 310000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_zingspeed_white_hoodie",
                Name = "Áo Hoodie Trắng Kem Sweetheart (Sweetheart Oversized Hoodie)",
                Description = "Áo hoodie trắng kem ấm áp có mũ trùm tai thỏ siêu cute.",
                Slot = "TOP",
                Rarity = "COMMON",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/top_zingspeed_white_hoodie.glb",
                ThumbnailUrl = "/thumbnails/3d/top_zingspeed_white_hoodie.webp",
                PriceTokens = 200,
                LevelRequired = 1,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3000,
                FileSizeBytes = 290000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_cyber_racing_jacket",
                Name = "Áo Jacket Đua Xe Cyber Giáp Quang (Neon Drift Jacket)",
                Description = "Áo khoác da biker tương lai với vai giáp carbon và dây phát quang năng lượng.",
                Slot = "TOP",
                Rarity = "EPIC",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_cyber_racing_jacket.glb",
                ThumbnailUrl = "/thumbnails/3d/top_cyber_racing_jacket.webp",
                PriceTokens = 850,
                LevelRequired = 6,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso", "Mat_Arms" },
                PolyCount = 3600,
                FileSizeBytes = 350000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_oxford_scholar_blazer",
                Name = "Áo Vest Học Giả Oxford 3D (Scholar Oxford Blazer)",
                Description = "Vest xanh navy phối cà vạt đỏ rượu và huy hiệu vàng học thuật danh giá.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_oxford_scholar_blazer.glb",
                ThumbnailUrl = "/thumbnails/3d/top_oxford_scholar_blazer.webp",
                PriceTokens = 500,
                LevelRequired = 3,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3400,
                FileSizeBytes = 330000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_angel_silk_tunic",
                Name = "Áo Choàng Lụa Thiên Thần 3D (Celestial Silk Tunic)",
                Description = "Áo choàng trắng viền vàng kim lấp lánh như sương mai của các thiên thần.",
                Slot = "TOP",
                Rarity = "EPIC",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_angel_silk_tunic.glb",
                ThumbnailUrl = "/thumbnails/3d/top_angel_silk_tunic.webp",
                PriceTokens = 950,
                LevelRequired = 7,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3800,
                FileSizeBytes = 370000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_princess_lolita_dress",
                Name = "Đầm Công Chúa Lolita Dạ Hội 3D (Sweet Lolita Dress)",
                Description = "Váy dạ hội Lolita ren hồng pastel bồng bềnh phối nơ ngực đính ngọc trai quý phái.",
                Slot = "TOP",
                Rarity = "LEGENDARY",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/top_princess_lolita_dress.glb",
                ThumbnailUrl = "/thumbnails/3d/top_princess_lolita_dress.webp",
                PriceTokens = 1800,
                LevelRequired = 12,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string> { "Slot_Bottom" },
                MaskedBodyParts = new List<string> { "Mat_Torso", "Mat_Legs" },
                PolyCount = 4600,
                FileSizeBytes = 490000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_teddy_bear_hoodie",
                Name = "Áo Hoodie Tai Gấu Cute 3D (Teddy Bear Chibi Hoodie)",
                Description = "Áo bông gấu nâu mềm mại có tai tròn và túi bụng hình bàn chân gấu đáng yêu.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_teddy_bear_hoodie.glb",
                ThumbnailUrl = "/thumbnails/3d/top_teddy_bear_hoodie.webp",
                PriceTokens = 380,
                LevelRequired = 2,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3300,
                FileSizeBytes = 320000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_archmage_lexicon_robe",
                Name = "Áo Choàng Đại Pháp Sư 3D (Archmage Lexicon Robe)",
                Description = "Áo thụng tím thêu chòm sao ma thuật phát sáng và huy hiệu học giả tối cao.",
                Slot = "TOP",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/top_archmage_lexicon_robe.glb",
                ThumbnailUrl = "/thumbnails/3d/top_archmage_lexicon_robe.webp",
                PriceTokens = 2200,
                LevelRequired = 15,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 4400,
                FileSizeBytes = 460000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // ==========================================
            // === 4. BOTTOM (6 items) ===
            // ==========================================
            new()
            {
                Id = "bot_zingspeed_cargo_shorts",
                Name = "Quần Short Thể Thao Dáng Rộng (Racer Cargo Shorts)",
                Description = "Quần short thể thao đen vạch phản quang cam, có túi hộp hai bên.",
                Slot = "BOTTOM",
                Rarity = "COMMON",
                Gender = "MALE",
                ModelUrl = "/models/3d/bot_zingspeed_cargo_shorts.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_zingspeed_cargo_shorts.webp",
                PriceTokens = 180,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1800,
                FileSizeBytes = 175000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_zingspeed_pleated_skirt",
                Name = "Váy Xếp Ly Navy Năng Động (Navy Pleated Skirt)",
                Description = "Chân váy xếp ly màu xanh navy có viền sọc trắng thể thao trẻ trung năng động.",
                Slot = "BOTTOM",
                Rarity = "COMMON",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/bot_zingspeed_pleated_skirt.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_zingspeed_pleated_skirt.webp",
                PriceTokens = 180,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2000,
                FileSizeBytes = 190000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_cyber_neon_joggers",
                Name = "Quần Jogger Cyber Quang Phổ (Hologram Street Joggers)",
                Description = "Quần jogger bo gấu đai kim loại với đường viền dạ quang đổi màu theo góc nhìn.",
                Slot = "BOTTOM",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/bot_cyber_neon_joggers.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_cyber_neon_joggers.webp",
                PriceTokens = 420,
                LevelRequired = 4,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Legs" },
                PolyCount = 2400,
                FileSizeBytes = 230000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_school_uniform_skirt",
                Name = "Chân Váy Xếp Ly Học Đường 3D (Classic School Skirt)",
                Description = "Chân váy học sinh xòe nhẹ họa tiết caro xám thanh lịch chuẩn đồng phục.",
                Slot = "BOTTOM",
                Rarity = "COMMON",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/bot_school_uniform_skirt.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_school_uniform_skirt.webp",
                PriceTokens = 160,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1900,
                FileSizeBytes = 180000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_streetwear_cargo_pants",
                Name = "Quần Túi Hộp Streetwear 3D (Streetwear Cargo Pants)",
                Description = "Quần dài kaki túi hộp rêu xám phong cách đường phố cá tính.",
                Slot = "BOTTOM",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/bot_streetwear_cargo_pants.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_streetwear_cargo_pants.webp",
                PriceTokens = 350,
                LevelRequired = 3,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Legs" },
                PolyCount = 2200,
                FileSizeBytes = 210000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bot_lolita_frill_skirt",
                Name = "Chân Váy Ren Xòe Lolita 3D (Lolita Frill Skirt)",
                Description = "Váy xòe ren 2 tầng màu hồng phấn ngọt ngào viền nơ bướm xinh xắn.",
                Slot = "BOTTOM",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/bot_lolita_frill_skirt.glb",
                ThumbnailUrl = "/thumbnails/3d/bot_lolita_frill_skirt.webp",
                PriceTokens = 650,
                LevelRequired = 6,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2600,
                FileSizeBytes = 250000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // ==========================================
            // === 5. SHOES (5 items) ===
            // ==========================================
            new()
            {
                Id = "foot_zingspeed_combat_boots",
                Name = "Bốt Đua Cao Cổ Đen Chỉ Vàng (Speed Combat Boots)",
                Description = "Đôi bốt da đen cao cổ buộc dây chắc chắn với đế răng cưa chống trượt.",
                Slot = "SHOES",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/foot_zingspeed_combat_boots.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_zingspeed_combat_boots.webp",
                PriceTokens = 320,
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
                Description = "Giày thể thao đế bánh mì dày màu kẹo ngọt pastel tôn dáng Chibi dễ thương.",
                Slot = "SHOES",
                Rarity = "COMMON",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/foot_zingspeed_pastel_sneakers.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_zingspeed_pastel_sneakers.webp",
                PriceTokens = 150,
                LevelRequired = 1,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 1600,
                FileSizeBytes = 155000,
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
            new()
            {
                Id = "foot_school_loafers",
                Name = "Giày Da Đồng Phục Học Sinh 3D (Classic School Loafers)",
                Description = "Giày lười da nâu bóng cổ điển kèm tất trắng ngắn thanh lịch học đường.",
                Slot = "SHOES",
                Rarity = "COMMON",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/foot_school_loafers.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_school_loafers.webp",
                PriceTokens = 120,
                LevelRequired = 1,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 1500,
                FileSizeBytes = 145000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "foot_cyber_neon_sneakers",
                Name = "Giày Thể Thao Neon Cyber 3D (Cyber Neon Kicks)",
                Description = "Sneaker tương lai với đế phát sáng xanh cyan và đệm khí năng lượng.",
                Slot = "SHOES",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/foot_cyber_neon_sneakers.glb",
                ThumbnailUrl = "/thumbnails/3d/foot_cyber_neon_sneakers.webp",
                PriceTokens = 380,
                LevelRequired = 4,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 1800,
                FileSizeBytes = 175000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // ==========================================
            // === 6. ACCESSORY & 3D WINGS (11 items) ===
            // ==========================================
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
            },
            new()
            {
                Id = "acc_angel_celestial_wings",
                Name = "Đôi Cánh Thiên Thần Ánh Sáng 3D (Celestial Angel Wings)",
                Description = "Cặp cánh lông vũ trắng tinh khôi viền vàng kim thần thoại, xòe rộng nâng đỡ bước chân học giả.",
                Slot = "ACCESSORY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_angel_celestial_wings.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_angel_celestial_wings.webp",
                PriceTokens = 2800,
                LevelRequired = 15,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2200,
                FileSizeBytes = 210000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_devil_bat_wings",
                Name = "Đôi Cánh Ác Quỷ Dạ Xoa 3D (Demonic Shadow Wings)",
                Description = "Đôi cánh dơi hắc ám màu tím đen huyền bí, tỏa luồng khí ma mị quyến rũ.",
                Slot = "ACCESSORY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_devil_bat_wings.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_devil_bat_wings.webp",
                PriceTokens = 3000,
                LevelRequired = 15,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2100,
                FileSizeBytes = 200000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_fairy_butterfly_wings",
                Name = "Đôi Cánh Tiên Bướm Dạ Quang 3D (Ethereal Fairy Wings)",
                Description = "Đôi cánh bướm trong suốt dạ quang màu hồng ngọc và xanh ngọc lấp lánh như tiên tử.",
                Slot = "ACCESSORY",
                Rarity = "EPIC",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/acc_fairy_butterfly_wings.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_fairy_butterfly_wings.webp",
                PriceTokens = 1800,
                LevelRequired = 10,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1800,
                FileSizeBytes = 175000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_phoenix_fire_wings",
                Name = "Đôi Cánh Phượng Hoàng Lửa 3D (Blazing Phoenix Wings)",
                Description = "Đôi cánh rực lửa thần thoại tỏa tàn tro vàng cam rực cháy dành cho chiến thần bất bại.",
                Slot = "ACCESSORY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_phoenix_fire_wings.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_phoenix_fire_wings.webp",
                PriceTokens = 3500,
                LevelRequired = 20,
                BoneBindingRoot = "Chest",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2400,
                FileSizeBytes = 230000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_cat_ears_headband",
                Name = "Băng Đô Tai Mèo Cute (Neko Ears Headband)",
                Description = "Băng đô tai mèo Chibi bằng nỉ bông đính nơ chuông vàng kêu leng keng khi lắc lư.",
                Slot = "ACCESSORY",
                Rarity = "RARE",
                Gender = "FEMALE",
                ModelUrl = "/models/3d/acc_cat_ears_headband.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_cat_ears_headband.webp",
                PriceTokens = 350,
                LevelRequired = 2,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1200,
                FileSizeBytes = 115000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_angel_halo",
                Name = "Vòng Thiên Thần Hào Quang (Holy Golden Halo)",
                Description = "Vòng hào quang vàng kim lơ lửng trên đỉnh đầu phát sáng nhịp nhàng.",
                Slot = "ACCESSORY",
                Rarity = "EPIC",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_angel_halo.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_angel_halo.webp",
                PriceTokens = 850,
                LevelRequired = 5,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 900,
                FileSizeBytes = 85000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_cyber_visor",
                Name = "Kính Thực Tế Ảo Cyber (Holo Cyber Visor)",
                Description = "Kính bảo hộ hiển thị số liệu ba chiều màu xanh neon viền kim loại.",
                Slot = "ACCESSORY",
                Rarity = "EPIC",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_cyber_visor.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_cyber_visor.webp",
                PriceTokens = 750,
                LevelRequired = 6,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1100,
                FileSizeBytes = 105000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_wizard_hat",
                Name = "Nón Pháp Sư Tri Thức (Arcane Wizard Hat)",
                Description = "Nón chóp nhọn pháp sư bọc nhung tím thêu trăng sao vàng kim đính đá thạch anh.",
                Slot = "ACCESSORY",
                Rarity = "RARE",
                Gender = "UNISEX",
                ModelUrl = "/models/3d/acc_wizard_hat.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_wizard_hat.webp",
                PriceTokens = 400,
                LevelRequired = 3,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1300,
                FileSizeBytes = 125000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        // 1. Insert or update 3D items
        var existingItems = await context.AvatarItems3D.ToListAsync();
        var existingMap = existingItems.ToDictionary(x => x.Id, StringComparer.OrdinalIgnoreCase);

        foreach (var item in items)
        {
            if (existingMap.TryGetValue(item.Id, out var existing))
            {
                // Update item metadata
                existing.Name = item.Name;
                existing.Description = item.Description;
                existing.Slot = item.Slot;
                existing.Rarity = item.Rarity;
                existing.Gender = item.Gender;
                existing.ModelUrl = item.ModelUrl;
                existing.ThumbnailUrl = item.ThumbnailUrl;
                existing.PriceTokens = item.PriceTokens;
                existing.LevelRequired = item.LevelRequired;
                existing.BoneBindingRoot = item.BoneBindingRoot;
                existing.HideSlotsWhenEquipped = item.HideSlotsWhenEquipped;
                existing.MaskedBodyParts = item.MaskedBodyParts;
                existing.PolyCount = item.PolyCount;
                existing.FileSizeBytes = item.FileSizeBytes;
                existing.IsActive = true;
            }
            else
            {
                context.AvatarItems3D.Add(item);
            }
        }
        await context.SaveChangesAsync();

        // 2. Ensure each user has a valid UserAvatarEquip3D entry
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

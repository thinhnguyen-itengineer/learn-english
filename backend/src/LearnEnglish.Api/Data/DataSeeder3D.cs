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
            // === 0. AOI & REN DUAL CHIBI CHARACTERS & MODULAR WARDROBE (PHU-34 / PHU-35) ===
            // ==========================================
            new()
            {
                Id = "body_chibi_female_aoi",
                Name = "Thân Nữ Chibi Aoi (Meshy AI .glb Gốc)",
                Description = "Khung cơ thể Chibi Nữ tỷ lệ vàng 1:2.8, tối ưu từ file Meshy AI 426k tris.",
                Slot = "BASE_BODY",
                Rarity = "COMMON",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/Meshy_AI_Chibi_Figure_0930081629_texture.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_female_aoi.webp",
                SourceAiReference = "D:\\Meshy_AI_Chibi_Figure_0930081629_texture.glb",
                MeshVariantFemaleUrl = "/models/3d/body_chibi_female_aoi.glb",
                PriceTokens = 0,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 4800,
                FileSizeBytes = 524288,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "body_chibi_male_ren",
                Name = "Thân Nam Chibi Ren (Khung Xương Đối Ứng)",
                Description = "Khung cơ thể Chibi Nam tỷ lệ 1:2.8, vai thể thao, rig xương Humanoid 42 bones.",
                Slot = "BASE_BODY",
                Rarity = "COMMON",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/chibi_male_ren_master_rig.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_male_ren.webp",
                SourceAiReference = "Mixamo Humanoid 42 Bones Normalized Rig",
                MeshVariantMaleUrl = "/models/3d/body_chibi_male_ren.glb",
                PriceTokens = 0,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 4900,
                FileSizeBytes = 535000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "body_chibi_tan_athletic_01",
                Name = "Thân Chibi Thể Thao Bánh Mật",
                Description = "Cơ thể thể thao năng động, nước da rám nắng khỏe khoắn.",
                Slot = "BASE_BODY",
                Rarity = "RARE",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/body_chibi_tan_athletic_01.glb",
                ThumbnailUrl = "/thumbnails/3d/body_chibi_tan_athletic_01.webp",
                PriceTokens = 350,
                LevelRequired = 3,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 4950,
                FileSizeBytes = 535000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_twin_tails_cherry_01",
                Name = "Tóc Cột Hai Bên Sakura Pop",
                Description = "Tóc bím hai bên bồng bềnh phong cách Anime Idol Nhật Bản.",
                Slot = "HAIR",
                Rarity = "RARE",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/hair_twin_tails_cherry_01.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_twin_tails_cherry_01.webp",
                PriceTokens = 500,
                LevelRequired = 2,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3200,
                FileSizeBytes = 245000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_short_bob_scholar_01",
                Name = "Tóc Ngắn Bob Học Đường Anime",
                Description = "Mái tóc ngắn ôm cằm xinh xắn của nữ sinh chăm chỉ.",
                Slot = "HAIR",
                Rarity = "COMMON",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/hair_short_bob_scholar_01.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_short_bob_scholar_01.webp",
                PriceTokens = 250,
                LevelRequired = 1,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2600,
                FileSizeBytes = 210000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_side_part_scholar_01",
                Name = "Tóc Học Giả Rẽ Ngôi 7/3",
                Description = "Mái tóc rẽ ngôi 7/3 gọn gàng, phong thái điềm tĩnh của Ren.",
                Slot = "HAIR",
                Rarity = "COMMON",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/hair_side_part_scholar_01.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_side_part_scholar_01.webp",
                PriceTokens = 200,
                LevelRequired = 1,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2100,
                FileSizeBytes = 180000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_anime_spiky_layer_01",
                Name = "Tóc Layer Gai Học Trưởng Cool Ngầu",
                Description = "Mái tóc layer gai nhọn highlight xanh cá tính của học trưởng Ren.",
                Slot = "HAIR",
                Rarity = "EPIC",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/hair_anime_spiky_layer_01.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_anime_spiky_layer_01.webp",
                PriceTokens = 750,
                LevelRequired = 5,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3400,
                FileSizeBytes = 275000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "hair_anime_spiky_blue_01",
                Name = "Tóc Anime Gai Xanh Điện Unisex",
                Description = "Tóc anime gai xanh điện phong cách hiện đại cho cả hai.",
                Slot = "HAIR",
                Rarity = "EPIC",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/hair_anime_spiky_blue_01.glb",
                ThumbnailUrl = "/thumbnails/3d/hair_anime_spiky_blue_01.webp",
                PriceTokens = 750,
                LevelRequired = 5,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3300,
                FileSizeBytes = 265000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_chibi_female_sailor_01",
                Name = "Áo Thủy Thủ Nữ Sinh Kèm Nơ Đỏ",
                Description = "Áo sơ mi thủy thủ cổ bẻ thắt nơ đỏ ruby duyên dáng của Aoi.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/top_chibi_female_sailor_01.glb",
                ThumbnailUrl = "/thumbnails/3d/top_chibi_female_sailor_01.webp",
                PriceTokens = 550,
                LevelRequired = 2,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3800,
                FileSizeBytes = 320000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_chibi_female_hoodie_pink_01",
                Name = "Áo Hoodie Chibi Tai Thỏ Pastel",
                Description = "Áo hoodie tai thỏ màu hồng pastel mềm mại đáng yêu.",
                Slot = "TOP",
                Rarity = "EPIC",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/top_chibi_female_hoodie_pink_01.glb",
                ThumbnailUrl = "/thumbnails/3d/top_chibi_female_hoodie_pink_01.webp",
                PriceTokens = 850,
                LevelRequired = 4,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string> { "Slot_Hair" },
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 4200,
                FileSizeBytes = 360000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_chibi_male_vest_gilet_01",
                Name = "Áo Gile Len Kèm Sơ Mi Trắng",
                Description = "Sơ mi trắng cổ đứng kết hợp áo gile len xanh navy viền vàng của Ren.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/top_chibi_male_vest_gilet_01.glb",
                ThumbnailUrl = "/thumbnails/3d/top_chibi_male_vest_gilet_01.webp",
                PriceTokens = 600,
                LevelRequired = 2,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3900,
                FileSizeBytes = 330000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_chibi_male_cyber_jacket_01",
                Name = "Áo Khoác Techwear Cyan Electric",
                Description = "Áo khoác phong cách cyberpunk với đường viền dạ quang rực rỡ.",
                Slot = "TOP",
                Rarity = "EPIC",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/top_chibi_male_cyber_jacket_01.glb",
                ThumbnailUrl = "/thumbnails/3d/top_chibi_male_cyber_jacket_01.webp",
                PriceTokens = 900,
                LevelRequired = 5,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 4500,
                FileSizeBytes = 380000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_school_blazer_oxford_01",
                Name = "Áo Blazer Học Viện Hoàng Gia",
                Description = "Áo blazer học đường phong cách Oxford danh giá dùng chung cho cả hai.",
                Slot = "TOP",
                Rarity = "RARE",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/top_school_blazer_oxford_01.glb",
                ThumbnailUrl = "/thumbnails/3d/top_school_blazer_oxford_01.webp",
                PriceTokens = 600,
                LevelRequired = 2,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 3800,
                FileSizeBytes = 310000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "top_golden_dragon_robe_01",
                Name = "Áo Choàng Hoàng Kim Long (Top 1)",
                Description = "Áo choàng hoàng kim thêu rồng tỏa ánh hào quang pháp thuật tối cao.",
                Slot = "TOP",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/top_golden_dragon_robe_01.glb",
                ThumbnailUrl = "/thumbnails/3d/top_golden_dragon_robe_01.webp",
                PriceTokens = 2500,
                LevelRequired = 10,
                BoneBindingRoot = "Spine",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Torso" },
                PolyCount = 5200,
                FileSizeBytes = 460000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bottom_chibi_female_pleated_01",
                Name = "Váy Xếp Ly Đồng Phục Học Viện",
                Description = "Váy xếp ly ca rô đỏ phong cách nữ sinh học viện của Aoi.",
                Slot = "BOTTOM",
                Rarity = "COMMON",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/bottom_chibi_female_pleated_01.glb",
                ThumbnailUrl = "/thumbnails/3d/bottom_chibi_female_pleated_01.webp",
                PriceTokens = 200,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2800,
                FileSizeBytes = 220000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bottom_chibi_female_denim_01",
                Name = "Quần Short Yếm Denim Trẻ Trung",
                Description = "Quần yếm denim năng động cá tính dạo phố.",
                Slot = "BOTTOM",
                Rarity = "RARE",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/bottom_chibi_female_denim_01.glb",
                ThumbnailUrl = "/thumbnails/3d/bottom_chibi_female_denim_01.webp",
                PriceTokens = 450,
                LevelRequired = 2,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3100,
                FileSizeBytes = 250000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bottom_chibi_male_slacks_01",
                Name = "Quần Âu Thể Thao Dáng Ôm",
                Description = "Quần âu ống côn thể thao màu xám than lịch lãm của Ren.",
                Slot = "BOTTOM",
                Rarity = "COMMON",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/bottom_chibi_male_slacks_01.glb",
                ThumbnailUrl = "/thumbnails/3d/bottom_chibi_male_slacks_01.webp",
                PriceTokens = 200,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2600,
                FileSizeBytes = 210000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bottom_cargo_shorts_01",
                Name = "Quần Cargo Techwear Túi Hộp",
                Description = "Quần short túi hộp tiện dụng thể thao cho cả hai.",
                Slot = "BOTTOM",
                Rarity = "COMMON",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/bottom_cargo_shorts_01.glb",
                ThumbnailUrl = "/thumbnails/3d/bottom_cargo_shorts_01.webp",
                PriceTokens = 150,
                LevelRequired = 1,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2400,
                FileSizeBytes = 195000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "bottom_hologram_tech_skirt_01",
                Name = "Váy Hologram Neon Dạ Quang",
                Description = "Váy phản quang hologram chuyển sắc kỳ ảo theo nhịp điệu.",
                Slot = "BOTTOM",
                Rarity = "EPIC",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/bottom_hologram_tech_skirt_01.glb",
                ThumbnailUrl = "/thumbnails/3d/bottom_hologram_tech_skirt_01.webp",
                PriceTokens = 750,
                LevelRequired = 4,
                BoneBindingRoot = "Hips",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3300,
                FileSizeBytes = 270000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "shoes_chibi_female_oxford_01",
                Name = "Giày Oxford Nữ Kèm Vớ Cổ Ngắn",
                Description = "Giày da bóng oxford kèm vớ trắng ren cổ ngắn trang nhã của Aoi.",
                Slot = "SHOES",
                Rarity = "COMMON",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/shoes_chibi_female_oxford_01.glb",
                ThumbnailUrl = "/thumbnails/3d/shoes_chibi_female_oxford_01.webp",
                PriceTokens = 150,
                LevelRequired = 1,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 2200,
                FileSizeBytes = 180000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "shoes_chibi_male_sneaker_cyan_01",
                Name = "Giày Sneaker Cổ Cao Đế Khí Cyan",
                Description = "Sneaker thể thao cổ cao đệm khí năng động viền cyan của Ren.",
                Slot = "SHOES",
                Rarity = "RARE",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/shoes_chibi_male_sneaker_cyan_01.glb",
                ThumbnailUrl = "/thumbnails/3d/shoes_chibi_male_sneaker_cyan_01.webp",
                PriceTokens = 400,
                LevelRequired = 2,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 2800,
                FileSizeBytes = 230000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "shoes_runner_sneakers_01",
                Name = "Giày Thể Thao Siêu Nhẹ Neon",
                Description = "Sneaker chạy bộ siêu nhẹ dạ quang cho các buổi luyện tập.",
                Slot = "SHOES",
                Rarity = "RARE",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/shoes_runner_sneakers_01.glb",
                ThumbnailUrl = "/thumbnails/3d/shoes_runner_sneakers_01.webp",
                PriceTokens = 400,
                LevelRequired = 2,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 2700,
                FileSizeBytes = 225000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "shoes_high_boots_cyber_01",
                Name = "Bốt Chiến Binh Cyber 2077",
                Description = "Bốt da cao cổ công nghệ tương lai bảo vệ đôi chân hoàn hảo.",
                Slot = "SHOES",
                Rarity = "EPIC",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/shoes_high_boots_cyber_01.glb",
                ThumbnailUrl = "/thumbnails/3d/shoes_high_boots_cyber_01.webp",
                PriceTokens = 700,
                LevelRequired = 4,
                BoneBindingRoot = "LeftFoot",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string> { "Mat_Feet" },
                PolyCount = 3200,
                FileSizeBytes = 260000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_chibi_female_star_clip_01",
                Name = "Kẹp Tóc Ngôi Sao Vàng May Mắn",
                Description = "Kẹp tóc ngôi sao vàng nhỏ xinh cài trên mái tóc Aoi.",
                Slot = "ACCESSORY",
                Rarity = "COMMON",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/acc_chibi_female_star_clip_01.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_chibi_female_star_clip_01.webp",
                PriceTokens = 100,
                LevelRequired = 1,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1200,
                FileSizeBytes = 95000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_chibi_female_cat_headphones_01",
                Name = "Tai Nghe Tai Mèo Phát Quang RGB",
                Description = "Tai nghe gaming tai mèo phát quang đổi 16 triệu màu RGB sống động.",
                Slot = "ACCESSORY",
                Rarity = "EPIC",
                Gender = "FEMALE",
                GenderCompatibility = "FEMALE",
                ModelUrl = "/models/3d/acc_chibi_female_cat_headphones_01.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_chibi_female_cat_headphones_01.webp",
                PriceTokens = 900,
                LevelRequired = 5,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2800,
                FileSizeBytes = 230000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_chibi_male_smart_glasses_01",
                Name = "Kính Mắt Trí Tuệ AR Scanner",
                Description = "Kính thông minh quét hiển thị nghĩa từ vựng thời gian thực.",
                Slot = "ACCESSORY",
                Rarity = "RARE",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/acc_chibi_male_smart_glasses_01.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_chibi_male_smart_glasses_01.webp",
                PriceTokens = 450,
                LevelRequired = 3,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 1800,
                FileSizeBytes = 150000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_chibi_male_cyber_headset_01",
                Name = "Tai Nghe Bluetooth Chụp Tai Studio",
                Description = "Tai nghe studio chống ồn chủ động chuyên nghiệp của Ren.",
                Slot = "ACCESSORY",
                Rarity = "RARE",
                Gender = "MALE",
                GenderCompatibility = "MALE",
                ModelUrl = "/models/3d/acc_chibi_male_cyber_headset_01.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_chibi_male_cyber_headset_01.webp",
                PriceTokens = 500,
                LevelRequired = 3,
                BoneBindingRoot = "Head",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 2200,
                FileSizeBytes = 180000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "acc_angel_wings_aurora_01",
                Name = "Đôi Cánh Thiên Thần Bắc Cực Quang",
                Description = "Cánh thiên thần tỏa dải cực quang lung linh chuyển động theo từng bước đi.",
                Slot = "ACCESSORY",
                Rarity = "LEGENDARY",
                Gender = "UNISEX",
                GenderCompatibility = "UNISEX",
                ModelUrl = "/models/3d/acc_angel_wings_aurora_01.glb",
                ThumbnailUrl = "/thumbnails/3d/acc_angel_wings_aurora_01.webp",
                PriceTokens = 3000,
                LevelRequired = 10,
                BoneBindingRoot = "Spine2",
                HideSlotsWhenEquipped = new List<string>(),
                MaskedBodyParts = new List<string>(),
                PolyCount = 3800,
                FileSizeBytes = 310000,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },

            // ==========================================
            // === 1. BASE_BODY (Legacy & Special bodies) ===
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
                existing.GenderCompatibility = string.IsNullOrWhiteSpace(item.GenderCompatibility) ? item.Gender : item.GenderCompatibility;
                existing.SourceAiReference = item.SourceAiReference;
                existing.MeshVariantFemaleUrl = item.MeshVariantFemaleUrl;
                existing.MeshVariantMaleUrl = item.MeshVariantMaleUrl;
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
                if (string.IsNullOrWhiteSpace(item.GenderCompatibility))
                {
                    item.GenderCompatibility = item.Gender;
                }
                context.AvatarItems3D.Add(item);
            }
        }
        await context.SaveChangesAsync();

        // 1.5. Seed 4 Matching Sets for Couple Wardrobe (PHU-34 / PHU-35)
        var matchingSets = new List<AvatarMatchingSet3D>
        {
            new()
            {
                Id = "set_royal_academy_duo",
                Name = "Set Đồng Phục Học Viện Hoàng Gia",
                Theme = "Academic Elegance",
                Description = "Blazer xanh navy viền vàng gold, cà vạt/nơ học sinh thanh lịch",
                BadgeText = "Bộ Đôi Học Viện",
                TokenPriceTotal = 1200,
                DiscountPercentage = 15,
                FemaleItemIds = new List<string> { "top_chibi_female_sailor_01", "bottom_chibi_female_pleated_01", "shoes_chibi_female_oxford_01", "acc_chibi_female_star_clip_01" },
                MaleItemIds = new List<string> { "top_chibi_male_vest_gilet_01", "bottom_chibi_male_slacks_01", "shoes_chibi_male_sneaker_cyan_01", "acc_chibi_male_cyber_headset_01" },
                FemalePreviewNames = new List<string> { "Blazer Sakura", "Váy Xếp Ly Caro", "Giày Oxford Cổ Ngắn", "Kẹp Tóc Ngôi Sao" },
                MalePreviewNames = new List<string> { "Blazer Navy Gold", "Quần Âu Thể Thao", "Giày Loafer Da", "Cà Vạt Học Viện" },
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "set_cyberpunk_neon_duo",
                Name = "Set Đường Phố Cyberpunk Neon 2077",
                Theme = "Cyber Futuristic",
                Description = "Áo khoác dạ quang Hologram phát sáng trong phòng thi đấu 1v1",
                BadgeText = "Bộ Đôi Chiến Binh",
                TokenPriceTotal = 2500,
                DiscountPercentage = 15,
                FemaleItemIds = new List<string> { "top_chibi_female_hoodie_pink_01", "bottom_hologram_tech_skirt_01", "shoes_high_boots_cyber_01", "acc_chibi_female_cat_headphones_01" },
                MaleItemIds = new List<string> { "top_chibi_male_cyber_jacket_01", "bottom_cargo_shorts_01", "shoes_high_boots_cyber_01", "acc_chibi_male_cyber_headset_01" },
                FemalePreviewNames = new List<string> { "Hoodie Neon Pink", "Váy Hologram Tech", "Bốt Cao Gót Cyber", "Kính AR Visor" },
                MalePreviewNames = new List<string> { "Áo Khoác Cyber Cyan", "Quần Cargo Techwear", "Sneaker Phát Sáng", "Tai Nghe Cyber" },
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "set_athletic_runner_duo",
                Name = "Set Năng Lượng Thể Thao Marathon",
                Theme = "Athletic Runner",
                Description = "Bộ đồ thể thao thoáng khí, tối ưu cho các bài luyện phát âm tốc độ",
                BadgeText = "Bộ Đôi Thể Thao",
                TokenPriceTotal = 850,
                DiscountPercentage = 10,
                FemaleItemIds = new List<string> { "top_chibi_female_sailor_01", "bottom_chibi_female_denim_01", "shoes_runner_sneakers_01", "acc_chibi_female_star_clip_01" },
                MaleItemIds = new List<string> { "top_school_blazer_oxford_01", "bottom_cargo_shorts_01", "shoes_runner_sneakers_01", "acc_chibi_male_smart_glasses_01" },
                FemalePreviewNames = new List<string> { "Áo Croptop Runner", "Quần Short Thể Thao", "Sneaker Siêu Nhẹ", "Băng Đô Thể Thao" },
                MalePreviewNames = new List<string> { "Áo Thun Co Giãn", "Quần Jogger Năng Động", "Sneaker Chạy Bộ", "Đồng Hồ Đo Nhịp" },
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = "set_mystic_scholar_duo",
                Name = "Set Pháp Sư Học Thuật Huyền Bí",
                Theme = "Mystic Fantasy",
                Description = "Áo choàng pháp sư thêu chỉ vàng phép thuật, hào quang sao rơi",
                BadgeText = "Bộ Đôi Huyền Thoại",
                TokenPriceTotal = 3800,
                DiscountPercentage = 20,
                FemaleItemIds = new List<string> { "top_golden_dragon_robe_01", "bottom_hologram_tech_skirt_01", "shoes_chibi_female_oxford_01", "acc_angel_wings_aurora_01" },
                MaleItemIds = new List<string> { "top_golden_dragon_robe_01", "bottom_chibi_male_slacks_01", "shoes_chibi_male_sneaker_cyan_01", "acc_angel_wings_aurora_01" },
                FemalePreviewNames = new List<string> { "Áo Choàng Pháp Sư Nữ", "Váy Phù Thủy Huyền Ảo", "Giày Phép Thuật", "Trượng Ngữ Pháp" },
                MalePreviewNames = new List<string> { "Áo Choàng Pháp Sư Nam", "Quần Phép Thuật", "Bốt Da Thần Kỳ", "Sách Cổ Phép Thuật" },
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        var existingSets = await context.AvatarMatchingSets3D.ToListAsync();
        var existingSetMap = existingSets.ToDictionary(s => s.Id, StringComparer.OrdinalIgnoreCase);
        foreach (var s in matchingSets)
        {
            if (existingSetMap.TryGetValue(s.Id, out var existingSet))
            {
                existingSet.Name = s.Name;
                existingSet.Theme = s.Theme;
                existingSet.Description = s.Description;
                existingSet.BadgeText = s.BadgeText;
                existingSet.TokenPriceTotal = s.TokenPriceTotal;
                existingSet.DiscountPercentage = s.DiscountPercentage;
                existingSet.FemaleItemIds = s.FemaleItemIds;
                existingSet.MaleItemIds = s.MaleItemIds;
                existingSet.FemalePreviewNames = s.FemalePreviewNames;
                existingSet.MalePreviewNames = s.MalePreviewNames;
                existingSet.IsActive = true;
            }
            else
            {
                context.AvatarMatchingSets3D.Add(s);
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
                    ActiveGender = "FEMALE",
                    BaseBodyId = "body_chibi_female_aoi",
                    HairId = "hair_twin_tails_cherry_01",
                    TopId = "top_chibi_female_sailor_01",
                    BottomId = "bottom_chibi_female_pleated_01",
                    ShoesId = "shoes_chibi_female_oxford_01",
                    AccessoryId = "acc_chibi_female_star_clip_01",
                    UpdatedAt = DateTime.UtcNow
                });
            }
            else
            {
                if (string.IsNullOrWhiteSpace(equip.ActiveGender))
                {
                    equip.ActiveGender = "FEMALE";
                }
            }

            // Ensure Preset 1 exists for user
            var hasPreset = await context.AvatarPresets3D.AnyAsync(p => p.UserId == user.Id && p.PresetSlot == 1);
            if (!hasPreset)
            {
                var starterConfig = new
                {
                    activeGender = "FEMALE",
                    baseBodyId = "body_chibi_female_aoi",
                    hairId = "hair_twin_tails_cherry_01",
                    topId = "top_chibi_female_sailor_01",
                    bottomId = "bottom_chibi_female_pleated_01",
                    shoesId = "shoes_chibi_female_oxford_01",
                    accessoryId = "acc_chibi_female_star_clip_01"
                };

                context.AvatarPresets3D.Add(new AvatarPreset3D
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    PresetSlot = 1,
                    PresetName = "Nữ Sinh Aoi Học Viện Hoàng Gia",
                    Config = JsonSerializer.Serialize(starterConfig),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }
        }

        await context.SaveChangesAsync();
    }
}

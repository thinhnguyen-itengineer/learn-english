using LearnEnglish.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LearnEnglish.Api.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Topics.AnyAsync())
        {
            await SeedBattleDataAsync(context);
            return;
        }

        // 1. Topic: Daily Routines
        var topicDaily = new Topic
        {
            Id = Guid.Parse("e4a2d810-75b2-4d2c-9821-2a62d49c0012"),
            Name = "Daily Routines (Thói quen hàng ngày)",
            Slug = "daily-routines",
            Description = "Từ vựng và các cấu trúc câu sinh hoạt thường nhật mỗi ngày.",
            IconName = "Sun",
            DifficultyLevel = "Easy",
            DisplayOrder = 1,
            IsActive = true
        };

        var dailyWords = new List<Word>
        {
            new() { TopicId = topicDaily.Id, Term = "Breakfast", Phonetic = "/ˈbrek.fəst/", PartOfSpeech = "noun", DefinitionVi = "Bữa ăn sáng", ExampleSentence = "I always eat breakfast at 7 AM.", DifficultyLevel = "Easy" },
            new() { TopicId = topicDaily.Id, Term = "Exercise", Phonetic = "/ˈek.sə.saɪz/", PartOfSpeech = "verb", DefinitionVi = "Tập thể dục", ExampleSentence = "She exercises regularly every morning.", DifficultyLevel = "Easy" },
            new() { TopicId = topicDaily.Id, Term = "Commute", Phonetic = "/kəˈmjuːt/", PartOfSpeech = "verb", DefinitionVi = "Đi lại làm việc", ExampleSentence = "It takes an hour to commute to work.", DifficultyLevel = "Medium" },
            new() { TopicId = topicDaily.Id, Term = "Wake up", Phonetic = "/weɪk ʌp/", PartOfSpeech = "verb", DefinitionVi = "Thức giấc", ExampleSentence = "I usually wake up early on weekdays.", DifficultyLevel = "Easy" },
            new() { TopicId = topicDaily.Id, Term = "Shower", Phonetic = "/ˈʃaʊ.ər/", PartOfSpeech = "noun", DefinitionVi = "Tắm vòi sen", ExampleSentence = "Taking a warm shower helps me relax.", DifficultyLevel = "Easy" },
            new() { TopicId = topicDaily.Id, Term = "Bedtime", Phonetic = "/ˈbed.taɪm/", PartOfSpeech = "noun", DefinitionVi = "Giờ đi ngủ", ExampleSentence = "Reading a book before bedtime improves sleep.", DifficultyLevel = "Easy" },
            new() { TopicId = topicDaily.Id, Term = "Schedule", Phonetic = "/ˈskedʒ.uːl/", PartOfSpeech = "noun", DefinitionVi = "Lịch trình / Thời gian biểu", ExampleSentence = "I check my daily schedule every morning.", DifficultyLevel = "Medium" },
            new() { TopicId = topicDaily.Id, Term = "Meditation", Phonetic = "/ˌmed.ɪˈteɪ.ʃən/", PartOfSpeech = "noun", DefinitionVi = "Thiền định", ExampleSentence = "Ten minutes of meditation refreshes the mind.", DifficultyLevel = "Medium" }
        };

        var dailySentences = new List<Sentence>
        {
            new()
            {
                TopicId = topicDaily.Id,
                EnglishText = "I always drink a glass of water after waking up.",
                VietnameseTranslation = "Tôi luôn uống một ly nước sau khi thức dậy.",
                Tokens = new() { "I", "always", "drink", "a", "glass", "of", "water", "after", "waking", "up." },
                DifficultyLevel = "Easy",
                HintText = "Bắt đầu với chủ ngữ 'I' và trạng từ 'always'."
            },
            new()
            {
                TopicId = topicDaily.Id,
                EnglishText = "She prepares a healthy breakfast before going to school.",
                VietnameseTranslation = "Cô ấy chuẩn bị một bữa sáng lành mạnh trước khi đi học.",
                Tokens = new() { "She", "prepares", "a", "healthy", "breakfast", "before", "going", "to", "school." },
                DifficultyLevel = "Easy",
                HintText = "Chủ ngữ là 'She' đi với động từ chia 'prepares'."
            },
            new()
            {
                TopicId = topicDaily.Id,
                EnglishText = "Regular physical exercise keeps your body fit and energetic.",
                VietnameseTranslation = "Tập thể dục thường xuyên giúp cơ thể khỏe mạnh và tràn đầy năng lượng.",
                Tokens = new() { "Regular", "physical", "exercise", "keeps", "your", "body", "fit", "and", "energetic." },
                DifficultyLevel = "Medium",
                HintText = "Bắt đầu với cụm danh từ 'Regular physical exercise'."
            }
        };

        // 2. Topic: Technology & Coding
        var topicTech = new Topic
        {
            Id = Guid.Parse("f5b3e921-86c3-5e3d-0932-3b73e50d1123"),
            Name = "Technology & Coding (Công nghệ & Lập trình)",
            Slug = "tech-coding",
            Description = "Thuật ngữ chuyên ngành công nghệ thông tin và phát triển phần mềm.",
            IconName = "Cpu",
            DifficultyLevel = "Medium",
            DisplayOrder = 2,
            IsActive = true
        };

        var techWords = new List<Word>
        {
            new() { TopicId = topicTech.Id, Term = "Algorithm", Phonetic = "/ˈæl.ɡə.rɪ.ðəm/", PartOfSpeech = "noun", DefinitionVi = "Thuật toán", ExampleSentence = "We optimized the search algorithm for speed.", DifficultyLevel = "Medium" },
            new() { TopicId = topicTech.Id, Term = "Database", Phonetic = "/ˈdeɪ.tə.beɪs/", PartOfSpeech = "noun", DefinitionVi = "Cơ sở dữ liệu", ExampleSentence = "PostgreSQL is a robust relational database.", DifficultyLevel = "Easy" },
            new() { TopicId = topicTech.Id, Term = "Framework", Phonetic = "/ˈfreɪm.wɜːk/", PartOfSpeech = "noun", DefinitionVi = "Khung lập trình", ExampleSentence = ".NET is a powerful cross-platform framework.", DifficultyLevel = "Medium" },
            new() { TopicId = topicTech.Id, Term = "Debugging", Phonetic = "/diːˈbʌɡ.ɪŋ/", PartOfSpeech = "noun", DefinitionVi = "Tìm và sửa lỗi code", ExampleSentence = "Debugging code requires patience and attention.", DifficultyLevel = "Easy" },
            new() { TopicId = topicTech.Id, Term = "Deployment", Phonetic = "/dɪˈplɔɪ.mənt/", PartOfSpeech = "noun", DefinitionVi = "Triển khai phần mềm", ExampleSentence = "Automated deployment reduces downtime.", DifficultyLevel = "Hard" },
            new() { TopicId = topicTech.Id, Term = "Refactor", Phonetic = "/riːˈfæk.tər/", PartOfSpeech = "verb", DefinitionVi = "Tối ưu hóa cấu trúc mã nguồn", ExampleSentence = "We should refactor legacy modules for readability.", DifficultyLevel = "Hard" },
            new() { TopicId = topicTech.Id, Term = "Endpoint", Phonetic = "/ˈend.pɔɪnt/", PartOfSpeech = "noun", DefinitionVi = "Điểm kết nối API", ExampleSentence = "The REST endpoint returns JSON data.", DifficultyLevel = "Medium" },
            new() { TopicId = topicTech.Id, Term = "Security", Phonetic = "/səˈkjʊə.rə.ti/", PartOfSpeech = "noun", DefinitionVi = "Bảo mật an toàn thông tin", ExampleSentence = "Security authentication must use encryption.", DifficultyLevel = "Medium" }
        };

        var techSentences = new List<Sentence>
        {
            new()
            {
                TopicId = topicTech.Id,
                EnglishText = "Clean architecture makes software systems scalable and maintainable.",
                VietnameseTranslation = "Kiến trúc sạch giúp hệ thống phần mềm dễ mở rộng và bảo trì.",
                Tokens = new() { "Clean", "architecture", "makes", "software", "systems", "scalable", "and", "maintainable." },
                DifficultyLevel = "Medium",
                HintText = "Khởi đầu bằng thuật ngữ 'Clean architecture'."
            },
            new()
            {
                TopicId = topicTech.Id,
                EnglishText = "Developers write automated tests to prevent regressions in production.",
                VietnameseTranslation = "Lập trình viên viết kiểm thử tự động để ngăn ngừa lỗi hồi quy trên môi trường chạy thật.",
                Tokens = new() { "Developers", "write", "automated", "tests", "to", "prevent", "regressions", "in", "production." },
                DifficultyLevel = "Hard",
                HintText = "Bắt đầu với 'Developers write automated tests'."
            },
            new()
            {
                TopicId = topicTech.Id,
                EnglishText = "REST APIs enable seamless communication between backend and frontend.",
                VietnameseTranslation = "Các giao diện REST API cho phép giao tiếp liền mạch giữa backend và frontend.",
                Tokens = new() { "REST", "APIs", "enable", "seamless", "communication", "between", "backend", "and", "frontend." },
                DifficultyLevel = "Medium",
                HintText = "Chủ ngữ là 'REST APIs' đi cùng động từ 'enable'."
            }
        };

        // 3. Topic: Travel & Food
        var topicTravel = new Topic
        {
            Id = Guid.Parse("a1c4e732-97d4-6f4e-1a43-4c84f61e2234"),
            Name = "Travel & Food (Du lịch & Ẩm thực)",
            Slug = "travel-food",
            Description = "Khám phá thế giới, văn hóa ẩm thực và giao tiếp khi đi du lịch.",
            IconName = "Compass",
            DifficultyLevel = "Easy",
            DisplayOrder = 3,
            IsActive = true
        };

        var travelWords = new List<Word>
        {
            new() { TopicId = topicTravel.Id, Term = "Destination", Phonetic = "/ˌdes.tɪˈneɪ.ʃən/", PartOfSpeech = "noun", DefinitionVi = "Điểm đến du lịch", ExampleSentence = "Da Nang is a popular travel destination.", DifficultyLevel = "Easy" },
            new() { TopicId = topicTravel.Id, Term = "Delicious", Phonetic = "/dɪˈlɪʃ.əs/", PartOfSpeech = "adjective", DefinitionVi = "Ngon miệng", ExampleSentence = "Vietnamese pho is delicious and aromatic.", DifficultyLevel = "Easy" },
            new() { TopicId = topicTravel.Id, Term = "Luggage", Phonetic = "/ˈlʌɡ.ɪdʒ/", PartOfSpeech = "noun", DefinitionVi = "Hành lý", ExampleSentence = "Please keep your luggage with you at all times.", DifficultyLevel = "Easy" },
            new() { TopicId = topicTravel.Id, Term = "Souvenir", Phonetic = "/ˌsuː.vəˈnɪər/", PartOfSpeech = "noun", DefinitionVi = "Quà lưu niệm", ExampleSentence = "I bought a handcrafted souvenir for my friend.", DifficultyLevel = "Medium" },
            new() { TopicId = topicTravel.Id, Term = "Reservation", Phonetic = "/ˌrez.əˈveɪ.ʃən/", PartOfSpeech = "noun", DefinitionVi = "Đặt chỗ trước", ExampleSentence = "We have a hotel reservation for three nights.", DifficultyLevel = "Medium" },
            new() { TopicId = topicTravel.Id, Term = "Specialty", Phonetic = "/ˈspeʃ.əl.ti/", PartOfSpeech = "noun", DefinitionVi = "Đặc sản địa phương", ExampleSentence = "Try the seafood specialty of this coastal town.", DifficultyLevel = "Medium" },
            new() { TopicId = topicTravel.Id, Term = "Itinerary", Phonetic = "/aɪˈtɪn.ər.ər.i/", PartOfSpeech = "noun", DefinitionVi = "Lịch trình chuyến đi", ExampleSentence = "Our travel itinerary includes four famous museums.", DifficultyLevel = "Hard" },
            new() { TopicId = topicTravel.Id, Term = "Hospitality", Phonetic = "/ˌhɒs.pɪˈtæl.ə.ti/", PartOfSpeech = "noun", DefinitionVi = "Lòng hiếu khách", ExampleSentence = "The local hospitality made our trip memorable.", DifficultyLevel = "Hard" }
        };

        var travelSentences = new List<Sentence>
        {
            new()
            {
                TopicId = topicTravel.Id,
                EnglishText = "Exploring different cultures expands your perspective and mindset.",
                VietnameseTranslation = "Khám phá các nền văn hóa khác nhau mở rộng góc nhìn và tư duy của bạn.",
                Tokens = new() { "Exploring", "different", "cultures", "expands", "your", "perspective", "and", "mindset." },
                DifficultyLevel = "Medium",
                HintText = "Khởi đầu bằng danh động từ 'Exploring different cultures'."
            },
            new()
            {
                TopicId = topicTravel.Id,
                EnglishText = "Could you recommend a traditional restaurant nearby?",
                VietnameseTranslation = "Bạn có thể giới thiệu một nhà hàng truyền thống gần đây không?",
                Tokens = new() { "Could", "you", "recommend", "a", "traditional", "restaurant", "nearby?" },
                DifficultyLevel = "Easy",
                HintText = "Câu hỏi lịch sự bắt đầu bằng 'Could you recommend'."
            }
        };

        // Add to database
        context.Topics.AddRange(topicDaily, topicTech, topicTravel);
        context.Words.AddRange(dailyWords);
        context.Words.AddRange(techWords);
        context.Words.AddRange(travelWords);
        context.Sentences.AddRange(dailySentences);
        context.Sentences.AddRange(techSentences);
        context.Sentences.AddRange(travelSentences);

        // Seed a sample top leaderboard
        var demoUsers = new List<User>
        {
            new()
            {
                Id = Guid.Parse("b1111111-1111-1111-1111-111111111111"),
                Username = "alex_tran",
                IsGuest = false,
                Profile = new UserProfile
                {
                    UserId = Guid.Parse("b1111111-1111-1111-1111-111111111111"),
                    DisplayName = "Alex Trần",
                    AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=alex",
                    TotalXp = 2840,
                    CurrentLevel = 15,
                    CurrentStreak = 12,
                    HighestStreak = 24,
                    LastActiveDate = DateOnly.FromDateTime(DateTime.UtcNow)
                }
            },
            new()
            {
                Id = Guid.Parse("b2222222-2222-2222-2222-222222222222"),
                Username = "minh_vu",
                IsGuest = false,
                Profile = new UserProfile
                {
                    UserId = Guid.Parse("b2222222-2222-2222-2222-222222222222"),
                    DisplayName = "Minh Vũ",
                    AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=minh",
                    TotalXp = 2100,
                    CurrentLevel = 12,
                    CurrentStreak = 9,
                    HighestStreak = 15,
                    LastActiveDate = DateOnly.FromDateTime(DateTime.UtcNow)
                }
            },
            new()
            {
                Id = Guid.Parse("b3333333-3333-3333-3333-333333333333"),
                Username = "sarah_connor",
                IsGuest = false,
                Profile = new UserProfile
                {
                    UserId = Guid.Parse("b3333333-3333-3333-3333-333333333333"),
                    DisplayName = "Sarah Nguyễn",
                    AvatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=sarah",
                    TotalXp = 1950,
                    CurrentLevel = 11,
                    CurrentStreak = 7,
                    HighestStreak = 10,
                    LastActiveDate = DateOnly.FromDateTime(DateTime.UtcNow)
                }
            }
        };

        context.Users.AddRange(demoUsers);
        await context.SaveChangesAsync();

        // 4. Seed Season & Battle Leaderboard
        await SeedBattleDataAsync(context);
    }

    public static async Task SeedBattleDataAsync(AppDbContext context)
    {
        if (await context.Seasons.AnyAsync())
        {
            return;
        }

        var activeSeason = new Season
        {
            Id = Guid.Parse("e3b0c442-98fc-1c14-9afb-4c8996fb9242"),
            SeasonNumber = 1,
            Name = "Mùa 1: Khởi Nguyên Chiến Binh",
            StartAt = DateTime.UtcNow.AddDays(-10),
            EndAt = DateTime.UtcNow.AddDays(18),
            IsActive = true,
            RewardsConfig = "{\"goldReward\": 1000, \"exclusiveBadge\": \"Season1Champion\"}",
            CreatedAt = DateTime.UtcNow.AddDays(-10)
        };

        context.Seasons.Add(activeSeason);

        // Seed more top ranked users if not existing
        var rankedUsers = new List<(Guid id, string username, string name, string avatar, int trophy, RankTier tier, string div, int winStreak, int wins, int losses, int draws)>
        {
            (Guid.Parse("11111111-2222-3333-4444-555555555555"), "hoang_nam_pro", "Hoàng Nam Pro", "https://api.dicebear.com/7.x/bottts/svg?seed=nam", 5420, RankTier.Master, "I", 9, 128, 22, 5),
            (Guid.Parse("66666666-7777-8888-9999-000000000000"), "minh_anh_lang", "Minh Anh Language", "https://api.dicebear.com/7.x/bottts/svg?seed=minhanh", 5210, RankTier.Master, "I", 4, 114, 28, 3),
            (Guid.Parse("b1111111-1111-1111-1111-111111111111"), "alex_tran", "Alex Trần", "https://api.dicebear.com/7.x/bottts/svg?seed=alex", 4850, RankTier.Diamond, "I", 6, 98, 24, 4),
            (Guid.Parse("b2222222-2222-2222-2222-222222222222"), "minh_vu", "Minh Vũ", "https://api.dicebear.com/7.x/bottts/svg?seed=minh", 4420, RankTier.Diamond, "II", 3, 85, 30, 2),
            (Guid.Parse("b3333333-3333-3333-3333-333333333333"), "sarah_connor", "Sarah Nguyễn", "https://api.dicebear.com/7.x/bottts/svg?seed=sarah", 3890, RankTier.Platinum, "I", 2, 70, 25, 3),
            (Guid.Parse("77777777-1111-2222-3333-444444444444"), "david_beck", "David Beckham VN", "https://api.dicebear.com/7.x/bottts/svg?seed=david", 3450, RankTier.Platinum, "II", 5, 62, 28, 1),
            (Guid.Parse("88888888-2222-3333-4444-555555555555"), "emily_in_paris", "Emily Đặng", "https://api.dicebear.com/7.x/bottts/svg?seed=emily", 2850, RankTier.Gold, "I", 4, 55, 31, 2),
            (Guid.Parse("99999999-3333-4444-5555-666666666666"), "brain_master", "Siêu Trí Tuệ", "https://api.dicebear.com/7.x/bottts/svg?seed=brain", 2420, RankTier.Gold, "II", 3, 48, 26, 4)
        };

        foreach (var r in rankedUsers)
        {
            var user = await context.Users.Include(u => u.Profile).Include(u => u.Rank).FirstOrDefaultAsync(u => u.Id == r.id);
            if (user == null)
            {
                user = new User
                {
                    Id = r.id,
                    Username = r.username,
                    IsGuest = false,
                    Profile = new UserProfile
                    {
                        UserId = r.id,
                        DisplayName = r.name,
                        AvatarUrl = r.avatar,
                        TotalXp = r.wins * 30 + r.trophy,
                        CurrentLevel = Math.Max(1, r.trophy / 400),
                        CurrentStreak = r.winStreak,
                        HighestStreak = r.winStreak + 3,
                        LastActiveDate = DateOnly.FromDateTime(DateTime.UtcNow)
                    }
                };
                context.Users.Add(user);
            }

            if (user.Rank == null)
            {
                user.Rank = new UserRank
                {
                    UserId = r.id,
                    Trophy = r.trophy,
                    HighestTrophy = r.trophy + 50,
                    Tier = r.tier,
                    Division = r.div,
                    WinStreak = r.winStreak,
                    HighestWinStreak = r.winStreak + 4,
                    ProtectionGamesLeft = 0,
                    TotalMatches = r.wins + r.losses + r.draws,
                    Wins = r.wins,
                    Losses = r.losses,
                    Draws = r.draws,
                    AbandonCount = 0,
                    UpdatedAt = DateTime.UtcNow
                };
                context.UserRanks.Add(user.Rank);
            }
        }

        await context.SaveChangesAsync();
    }
}

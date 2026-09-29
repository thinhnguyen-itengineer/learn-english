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
            await SeedNewMiniGamesAsync(context);
            await SeedSkillDomainsAsync(context);
            await SeedRetentionDataAsync(context);
            await SeedAvatarAndShopDataAsync(context);
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
        await SeedNewMiniGamesAsync(context);
        await SeedSkillDomainsAsync(context);
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

    public static async Task SeedNewMiniGamesAsync(AppDbContext context)
    {
        var topicDailyId = Guid.Parse("e4a2d810-75b2-4d2c-9821-2a62d49c0012");
        var topicTechId = Guid.Parse("f5b3e921-86c3-5e3d-0932-3b73e50d1123");
        var topicTravelId = Guid.Parse("a1c4e732-97d4-6f4e-1a43-4c84f61e2234");

        // 1. Audio Blitz Questions
        if (!await context.AudioBlitzQuestions.AnyAsync())
        {
            var words = await context.Words.ToListAsync();
            Word? FindWord(string term) => words.FirstOrDefault(w => w.Term.Equals(term, StringComparison.OrdinalIgnoreCase)) ?? words.FirstOrDefault();

            var abQuestions = new List<AudioBlitzQuestion>
            {
                // Daily Routines
                new()
                {
                    TopicId = topicDailyId,
                    WordId = FindWord("Breakfast")?.Id ?? Guid.NewGuid(),
                    TargetWord = "BREAKFAST",
                    Phonetic = "/ˈbrek.fəst/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Bữa ăn sáng",
                    ContextSentence = "Reading and having ________ together brings family joy.",
                    AudioUrl = "https://assets.learnenglish.local/audio/breakfast.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/breakfast_slow.mp3",
                    DistractorLetters = "ETAOIN",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicDailyId,
                    WordId = FindWord("Exercise")?.Id ?? Guid.NewGuid(),
                    TargetWord = "EXERCISE",
                    Phonetic = "/ˈek.sə.saɪz/",
                    PartOfSpeech = "Verb",
                    DefinitionVi = "Tập thể dục",
                    ContextSentence = "Regular ________ improves both physical and mental health.",
                    AudioUrl = "https://assets.learnenglish.local/audio/exercise.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/exercise_slow.mp3",
                    DistractorLetters = "PLOMNQ",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicDailyId,
                    WordId = FindWord("Commute")?.Id ?? Guid.NewGuid(),
                    TargetWord = "COMMUTE",
                    Phonetic = "/kəˈmjuːt/",
                    PartOfSpeech = "Verb",
                    DefinitionVi = "Đi lại làm việc",
                    ContextSentence = "Many professionals ________ by train to avoid traffic.",
                    AudioUrl = "https://assets.learnenglish.local/audio/commute.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/commute_slow.mp3",
                    DistractorLetters = "ZWRTKY",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicDailyId,
                    WordId = FindWord("Schedule")?.Id ?? Guid.NewGuid(),
                    TargetWord = "SCHEDULE",
                    Phonetic = "/ˈskedʒ.uːl/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Lịch trình / Thời gian biểu",
                    ContextSentence = "She organized her daily ________ carefully.",
                    AudioUrl = "https://assets.learnenglish.local/audio/schedule.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/schedule_slow.mp3",
                    DistractorLetters = "BFGVWX",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicDailyId,
                    WordId = FindWord("Meditation")?.Id ?? Guid.NewGuid(),
                    TargetWord = "MEDITATION",
                    Phonetic = "/ˌmed.ɪˈteɪ.ʃən/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Thiền định",
                    ContextSentence = "Daily ________ calms the mind after stressful hours.",
                    AudioUrl = "https://assets.learnenglish.local/audio/meditation.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/meditation_slow.mp3",
                    DistractorLetters = "CPLKRT",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicDailyId,
                    WordId = FindWord("Shower")?.Id ?? Guid.NewGuid(),
                    TargetWord = "SHOWER",
                    Phonetic = "/ˈʃaʊ.ər/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Tắm vòi sen",
                    ContextSentence = "Taking a warm ________ refreshes you after workout.",
                    AudioUrl = "https://assets.learnenglish.local/audio/shower.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/shower_slow.mp3",
                    DistractorLetters = "ZMNBVC",
                    DifficultyLevel = "Easy"
                },

                // Tech & Coding
                new()
                {
                    TopicId = topicTechId,
                    WordId = FindWord("Algorithm")?.Id ?? Guid.NewGuid(),
                    TargetWord = "ALGORITHM",
                    Phonetic = "/ˈæl.ɡə.rɪ.ðəm/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Thuật toán",
                    ContextSentence = "The search ________ sorts millions of records in milliseconds.",
                    AudioUrl = "https://assets.learnenglish.local/audio/algorithm.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/algorithm_slow.mp3",
                    DistractorLetters = "POIUYT",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTechId,
                    WordId = FindWord("Database")?.Id ?? Guid.NewGuid(),
                    TargetWord = "DATABASE",
                    Phonetic = "/ˈdeɪ.tə.beɪs/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Cơ sở dữ liệu",
                    ContextSentence = "PostgreSQL is an open-source relational ________ system.",
                    AudioUrl = "https://assets.learnenglish.local/audio/database.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/database_slow.mp3",
                    DistractorLetters = "ZXCVBN",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicTechId,
                    WordId = FindWord("Framework")?.Id ?? Guid.NewGuid(),
                    TargetWord = "FRAMEWORK",
                    Phonetic = "/ˈfreɪm.wɜːk/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Khung lập trình",
                    ContextSentence = ".NET is a modular and high-performance developer ________.",
                    AudioUrl = "https://assets.learnenglish.local/audio/framework.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/framework_slow.mp3",
                    DistractorLetters = "QWERTY",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTechId,
                    WordId = FindWord("Debugging")?.Id ?? Guid.NewGuid(),
                    TargetWord = "DEBUGGING",
                    Phonetic = "/diːˈbʌɡ.ɪŋ/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Tìm và sửa lỗi code",
                    ContextSentence = "Effective ________ requires tracing stack calls meticulously.",
                    AudioUrl = "https://assets.learnenglish.local/audio/debugging.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/debugging_slow.mp3",
                    DistractorLetters = "LKJHGF",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicTechId,
                    WordId = FindWord("Deployment")?.Id ?? Guid.NewGuid(),
                    TargetWord = "DEPLOYMENT",
                    Phonetic = "/dɪˈplɔɪ.mənt/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Triển khai phần mềm",
                    ContextSentence = "Automated CI/CD pipeline speeds up software ________.",
                    AudioUrl = "https://assets.learnenglish.local/audio/deployment.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/deployment_slow.mp3",
                    DistractorLetters = "ASDFGH",
                    DifficultyLevel = "Hard"
                },
                new()
                {
                    TopicId = topicTechId,
                    WordId = FindWord("Security")?.Id ?? Guid.NewGuid(),
                    TargetWord = "SECURITY",
                    Phonetic = "/səˈkjʊə.rə.ti/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Bảo mật an toàn thông tin",
                    ContextSentence = "Network ________ prevents unauthorized access and data breaches.",
                    AudioUrl = "https://assets.learnenglish.local/audio/security.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/security_slow.mp3",
                    DistractorLetters = "POIUYT",
                    DifficultyLevel = "Medium"
                },

                // Travel & Food
                new()
                {
                    TopicId = topicTravelId,
                    WordId = FindWord("Destination")?.Id ?? Guid.NewGuid(),
                    TargetWord = "DESTINATION",
                    Phonetic = "/ˌdes.tɪˈneɪ.ʃən/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Điểm đến du lịch",
                    ContextSentence = "Paris remains the most romantic travel ________ in Europe.",
                    AudioUrl = "https://assets.learnenglish.local/audio/destination.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/destination_slow.mp3",
                    DistractorLetters = "MNBVCX",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicTravelId,
                    WordId = FindWord("Delicious")?.Id ?? Guid.NewGuid(),
                    TargetWord = "DELICIOUS",
                    Phonetic = "/dɪˈlɪʃ.əs/",
                    PartOfSpeech = "Adjective",
                    DefinitionVi = "Ngon miệng",
                    ContextSentence = "Street food here is both affordable and ________.",
                    AudioUrl = "https://assets.learnenglish.local/audio/delicious.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/delicious_slow.mp3",
                    DistractorLetters = "LKJHGF",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicTravelId,
                    WordId = FindWord("Itinerary")?.Id ?? Guid.NewGuid(),
                    TargetWord = "ITINERARY",
                    Phonetic = "/aɪˈtɪn.ər.ər.i/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Lịch trình chuyến đi",
                    ContextSentence = "Our flight and hotel details are listed on the ________.",
                    AudioUrl = "https://assets.learnenglish.local/audio/itinerary.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/itinerary_slow.mp3",
                    DistractorLetters = "POIUYT",
                    DifficultyLevel = "Hard"
                },
                new()
                {
                    TopicId = topicTravelId,
                    WordId = FindWord("Hospitality")?.Id ?? Guid.NewGuid(),
                    TargetWord = "HOSPITALITY",
                    Phonetic = "/ˌhɒs.pɪˈtæl.ə.ti/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Lòng hiếu khách",
                    ContextSentence = "We were deeply touched by the warm ________ of local villagers.",
                    AudioUrl = "https://assets.learnenglish.local/audio/hospitality.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/hospitality_slow.mp3",
                    DistractorLetters = "ZXCVBN",
                    DifficultyLevel = "Hard"
                },
                new()
                {
                    TopicId = topicTravelId,
                    WordId = FindWord("Reservation")?.Id ?? Guid.NewGuid(),
                    TargetWord = "RESERVATION",
                    Phonetic = "/ˌrez.əˈveɪ.ʃən/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Đặt chỗ trước",
                    ContextSentence = "Please confirm your hotel ________ at the front desk.",
                    AudioUrl = "https://assets.learnenglish.local/audio/reservation.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/reservation_slow.mp3",
                    DistractorLetters = "QAZWSX",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTravelId,
                    WordId = FindWord("Souvenir")?.Id ?? Guid.NewGuid(),
                    TargetWord = "SOUVENIR",
                    Phonetic = "/ˌsuː.vəˈnɪər/",
                    PartOfSpeech = "Noun",
                    DefinitionVi = "Quà lưu niệm",
                    ContextSentence = "I bought a traditional scarf as a travel ________.",
                    AudioUrl = "https://assets.learnenglish.local/audio/souvenir.mp3",
                    SlowAudioUrl = "https://assets.learnenglish.local/audio/souvenir_slow.mp3",
                    DistractorLetters = "EDCRFV",
                    DifficultyLevel = "Medium"
                }
            };

            context.AudioBlitzQuestions.AddRange(abQuestions);
        }

        // 2. Cloze Questions
        if (!await context.ClozeQuestions.AnyAsync())
        {
            var clozeList = new List<ClozeQuestion>
            {
                // Tech & Coding
                new()
                {
                    TopicId = topicTechId,
                    ContextSentence = "Despite facing unexpected logistical delays, the team managed to [BLANK] their sales target for Q3.",
                    SentenceTranslationVi = "Dù gặp sự chậm trễ ngoài dự kiến về hậu cần, đội ngũ vẫn hoàn thành vượt chỉ tiêu doanh số quý 3.",
                    PartOfSpeechHint = "verb (động từ nguyên mẫu)",
                    CorrectWord = "exceed",
                    CorrectDefinitionVi = "vượt quá, hoàn thành vượt mức",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "expand", DefinitionVi = "mở rộng kích thước, diện tích" },
                        new() { Word = "extend", DefinitionVi = "kéo dài thời gian, kỳ hạn" },
                        new() { Word = "excess", DefinitionVi = "sự vượt quá (danh từ)" }
                    },
                    ExplanationText = "Collocation chuẩn xác là 'exceed a target' (vượt chỉ tiêu). 'Excess' là danh từ, 'extend' dùng kéo dài hạn, 'expand' dùng mở rộng quy mô.",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTechId,
                    ContextSentence = "All developers are highly encouraged to participate [BLANK] the upcoming architecture workshop.",
                    SentenceTranslationVi = "Tất cả lập trình viên được khuyến khích tham gia vào buổi hội thảo kiến trúc sắp tới.",
                    PartOfSpeechHint = "preposition (giới từ)",
                    CorrectWord = "in",
                    CorrectDefinitionVi = "trong, tham gia vào",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "at", DefinitionVi = "tại địa điểm" },
                        new() { Word = "on", DefinitionVi = "trên bề mặt" },
                        new() { Word = "with", DefinitionVi = "cùng với" }
                    },
                    ExplanationText = "Cụm động từ cố định 'participate in something' có nghĩa là tham gia vào một hoạt động hoặc sự kiện.",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicTechId,
                    ContextSentence = "Developers should [BLANK] legacy code regularly to enhance maintainability and readability.",
                    SentenceTranslationVi = "Lập trình viên nên tối ưu cấu trúc mã nguồn cũ định kỳ để nâng cao khả năng bảo trì và tính dễ đọc.",
                    PartOfSpeechHint = "verb (động từ nguyên mẫu)",
                    CorrectWord = "refactor",
                    CorrectDefinitionVi = "tối ưu hóa cấu trúc mã nguồn",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "redo", DefinitionVi = "làm lại từ đầu" },
                        new() { Word = "reject", DefinitionVi = "từ chối, bác bỏ" },
                        new() { Word = "repeat", DefinitionVi = "lặp lại" }
                    },
                    ExplanationText = "'Refactor code' là thuật ngữ kỹ thuật chỉ việc cấu trúc lại mã nguồn mà không làm thay đổi hành vi bên ngoài.",
                    DifficultyLevel = "Hard"
                },

                // Daily Routines
                new()
                {
                    TopicId = topicDailyId,
                    ContextSentence = "She usually [BLANK] at 6 AM every morning before preparing breakfast.",
                    SentenceTranslationVi = "Cô ấy thường thức giấc lúc 6 giờ sáng mỗi ngày trước khi chuẩn bị bữa sáng.",
                    PartOfSpeechHint = "phrasal verb (cụm động từ)",
                    CorrectWord = "wakes up",
                    CorrectDefinitionVi = "thức giấc, mở mắt thức dậy",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "stays up", DefinitionVi = "thức khuya" },
                        new() { Word = "gives up", DefinitionVi = "từ bỏ" },
                        new() { Word = "looks up", DefinitionVi = "tra cứu thông tin" }
                    },
                    ExplanationText = "'Wake up' là hành động thức giấc sau một đêm ngủ. 'Stay up' là thức khuya không đi ngủ.",
                    DifficultyLevel = "Easy"
                },
                new()
                {
                    TopicId = topicDailyId,
                    ContextSentence = "Drinking a glass of warm water after waking up is very [BLANK] for your health.",
                    SentenceTranslationVi = "Uống một ly nước ấm sau khi thức dậy rất có lợi cho sức khỏe của bạn.",
                    PartOfSpeechHint = "adjective (tính từ)",
                    CorrectWord = "beneficial",
                    CorrectDefinitionVi = "có lợi, mang lại hiệu quả tốt",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "benefit", DefinitionVi = "lợi ích (danh từ)" },
                        new() { Word = "benefited", DefinitionVi = "được hưởng lợi (quá khứ)" },
                        new() { Word = "beneficially", DefinitionVi = "một cách có lợi (trạng từ)" }
                    },
                    ExplanationText = "Sau trạng từ 'very' và động từ 'is', ta cần một tính từ 'beneficial' để bổ nghĩa.",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicDailyId,
                    ContextSentence = "Taking ten minutes for meditation can significantly [BLANK] daily stress levels.",
                    SentenceTranslationVi = "Dành mười phút thiền định có thể giảm đáng kể mức độ căng thẳng hàng ngày.",
                    PartOfSpeechHint = "verb (động từ)",
                    CorrectWord = "reduce",
                    CorrectDefinitionVi = "giảm bớt, làm suy giảm",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "refuse", DefinitionVi = "từ chối" },
                        new() { Word = "recover", DefinitionVi = "hồi phục" },
                        new() { Word = "replace", DefinitionVi = "thay thế" }
                    },
                    ExplanationText = "'Reduce stress' (giảm căng thẳng) là collocation tự nhiên và phổ biến nhất.",
                    DifficultyLevel = "Easy"
                },

                // Travel & Food
                new()
                {
                    TopicId = topicTravelId,
                    ContextSentence = "Before boarding the international flight, passengers must [BLANK] their passports and visas.",
                    SentenceTranslationVi = "Trước khi lên máy bay quốc tế, hành khách phải xuất trình hộ chiếu và thị thực.",
                    PartOfSpeechHint = "verb (động từ)",
                    CorrectWord = "present",
                    CorrectDefinitionVi = "xuất trình giấy tờ",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "propose", DefinitionVi = "đề xuất ý tưởng" },
                        new() { Word = "pretend", DefinitionVi = "giả vờ, làm bộ" },
                        new() { Word = "protect", DefinitionVi = "bảo vệ, che chắn" }
                    },
                    ExplanationText = "'Present passport' là cụm từ quy chuẩn tại sân bay và cơ quan hải quan có nghĩa là xuất trình hộ chiếu.",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTravelId,
                    ContextSentence = "The hotel staff is renowned for their exceptional [BLANK] towards all guests.",
                    SentenceTranslationVi = "Đội ngũ nhân viên khách sạn nổi tiếng với lòng hiếu khách đặc biệt đối với mọi du khách.",
                    PartOfSpeechHint = "noun (danh từ)",
                    CorrectWord = "hospitality",
                    CorrectDefinitionVi = "lòng hiếu khách, sự đón tiếp nồng hậu",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "hostility", DefinitionVi = "sự thù địch" },
                        new() { Word = "horizon", DefinitionVi = "đường chân trời" },
                        new() { Word = "humidity", DefinitionVi = "độ ẩm không khí" }
                    },
                    ExplanationText = "'Hospitality' là danh từ chỉ sự hiếu khách và chất lượng phục vụ nồng nhiệt trong ngành du lịch khách sạn.",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTravelId,
                    ContextSentence = "Could you please [BLANK] a reservation for a table of four this Saturday evening?",
                    SentenceTranslationVi = "Bạn có thể làm ơn đặt trước một bàn bốn người vào tối thứ Bảy này không?",
                    PartOfSpeechHint = "verb (động từ)",
                    CorrectWord = "make",
                    CorrectDefinitionVi = "thực hiện đặt chỗ",
                    Distractors = new List<ClozeDistractorItem>
                    {
                        new() { Word = "do", DefinitionVi = "làm hành động" },
                        new() { Word = "take", DefinitionVi = "cầm lấy" },
                        new() { Word = "build", DefinitionVi = "xây dựng" }
                    },
                    ExplanationText = "Collocation chính xác là 'make a reservation' (đặt chỗ trước). Không nói 'do a reservation'.",
                    DifficultyLevel = "Easy"
                }
            };

            context.ClozeQuestions.AddRange(clozeList);
        }

        // 3. Grammar Detective Questions
        if (!await context.GrammarDetectiveQuestions.AnyAsync())
        {
            var gdCases = new List<GrammarDetectiveQuestion>
            {
                // Daily Routines
                new()
                {
                    TopicId = topicDailyId,
                    CaseTitle = "Vụ Án #1: Giới Từ Thời Gian & Thì Hiện Tại Hoàn Thành",
                    RawSentence = "She has worked as a software engineer in this company since five years .",
                    TokenSequence = new List<GrammarTokenItem>
                    {
                        new() { Index = 0, Text = "She" },
                        new() { Index = 1, Text = "has" },
                        new() { Index = 2, Text = "worked" },
                        new() { Index = 3, Text = "as" },
                        new() { Index = 4, Text = "a" },
                        new() { Index = 5, Text = "software" },
                        new() { Index = 6, Text = "engineer" },
                        new() { Index = 7, Text = "in" },
                        new() { Index = 8, Text = "this" },
                        new() { Index = 9, Text = "company" },
                        new() { Index = 10, Text = "since", IsError = true },
                        new() { Index = 11, Text = "five" },
                        new() { Index = 12, Text = "years" },
                        new() { Index = 13, Text = "." }
                    },
                    ErrorTokenIndex = 10,
                    ErrorTokenText = "since",
                    CorrectionOptions = new List<string> { "for", "during", "from" },
                    CorrectReplacement = "for",
                    GrammarRuleExplanation = "Với khoảng thời gian kéo dài ('five years'), ta phải dùng giới từ 'for'. Giới từ 'since' chỉ dùng với mốc thời gian xác định (ví dụ: 'since 2019').",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicDailyId,
                    CaseTitle = "Vụ Án #2: Sự Hòa Hợp Giữa Chủ Ngữ Và Động Từ (Subject-Verb Agreement)",
                    RawSentence = "The cost of all these new equipment are higher than expected .",
                    TokenSequence = new List<GrammarTokenItem>
                    {
                        new() { Index = 0, Text = "The" },
                        new() { Index = 1, Text = "cost" },
                        new() { Index = 2, Text = "of" },
                        new() { Index = 3, Text = "all" },
                        new() { Index = 4, Text = "these" },
                        new() { Index = 5, Text = "new" },
                        new() { Index = 6, Text = "equipment" },
                        new() { Index = 7, Text = "are", IsError = true },
                        new() { Index = 8, Text = "higher" },
                        new() { Index = 9, Text = "than" },
                        new() { Index = 10, Text = "expected" },
                        new() { Index = 11, Text = "." }
                    },
                    ErrorTokenIndex = 7,
                    ErrorTokenText = "are",
                    CorrectionOptions = new List<string> { "is", "were", "being" },
                    CorrectReplacement = "is",
                    GrammarRuleExplanation = "Chủ ngữ chính của câu là danh từ số ít 'The cost' (chứ không phải 'equipment'), do đó động từ to be phải chia số ít là 'is'.",
                    DifficultyLevel = "Medium"
                },

                // Tech & Coding
                new()
                {
                    TopicId = topicTechId,
                    CaseTitle = "Vụ Án #3: Danh Từ Đếm Được & Không Đếm Được (Countable vs Uncountable)",
                    RawSentence = "The senior architect gave me several useful advices on system design .",
                    TokenSequence = new List<GrammarTokenItem>
                    {
                        new() { Index = 0, Text = "The" },
                        new() { Index = 1, Text = "senior" },
                        new() { Index = 2, Text = "architect" },
                        new() { Index = 3, Text = "gave" },
                        new() { Index = 4, Text = "me" },
                        new() { Index = 5, Text = "several" },
                        new() { Index = 6, Text = "useful" },
                        new() { Index = 7, Text = "advices", IsError = true },
                        new() { Index = 8, Text = "on" },
                        new() { Index = 9, Text = "system" },
                        new() { Index = 10, Text = "design" },
                        new() { Index = 11, Text = "." }
                    },
                    ErrorTokenIndex = 7,
                    ErrorTokenText = "advices",
                    CorrectionOptions = new List<string> { "advice", "pieces of advice", "suggestion" },
                    CorrectReplacement = "advice",
                    GrammarRuleExplanation = "Từ 'advice' trong tiếng Anh là danh từ không đếm được (uncountable noun), không bao giờ có dạng số nhiều thêm 's'.",
                    DifficultyLevel = "Medium"
                },
                new()
                {
                    TopicId = topicTechId,
                    CaseTitle = "Vụ Án #4: Cấu Trúc Song Hành Trong Liệt Kê (Parallel Structure)",
                    RawSentence = "Our engineer enjoys writing clean code , debugging issues , and to optimize queries .",
                    TokenSequence = new List<GrammarTokenItem>
                    {
                        new() { Index = 0, Text = "Our" },
                        new() { Index = 1, Text = "engineer" },
                        new() { Index = 2, Text = "enjoys" },
                        new() { Index = 3, Text = "writing" },
                        new() { Index = 4, Text = "clean" },
                        new() { Index = 5, Text = "code" },
                        new() { Index = 6, Text = "," },
                        new() { Index = 7, Text = "debugging" },
                        new() { Index = 8, Text = "issues" },
                        new() { Index = 9, Text = "," },
                        new() { Index = 10, Text = "and" },
                        new() { Index = 11, Text = "to optimize", IsError = true },
                        new() { Index = 12, Text = "queries" },
                        new() { Index = 13, Text = "." }
                    },
                    ErrorTokenIndex = 11,
                    ErrorTokenText = "to optimize",
                    CorrectionOptions = new List<string> { "optimizing", "optimized", "optimize" },
                    CorrectReplacement = "optimizing",
                    GrammarRuleExplanation = "Khi các vế liệt kê bằng liên từ 'and', tất cả các động từ phải cùng một dạng: writing..., debugging..., and optimizing... (cấu trúc V-ing song hành).",
                    DifficultyLevel = "Hard"
                },

                // Travel & Food
                new()
                {
                    TopicId = topicTravelId,
                    CaseTitle = "Vụ Án #5: Cấu Trúc So Sánh Hơn (Double Comparative Error)",
                    RawSentence = "Traveling by high-speed train is more faster than taking the regional bus .",
                    TokenSequence = new List<GrammarTokenItem>
                    {
                        new() { Index = 0, Text = "Traveling" },
                        new() { Index = 1, Text = "by" },
                        new() { Index = 2, Text = "high-speed" },
                        new() { Index = 3, Text = "train" },
                        new() { Index = 4, Text = "is" },
                        new() { Index = 5, Text = "more faster", IsError = true },
                        new() { Index = 6, Text = "than" },
                        new() { Index = 7, Text = "taking" },
                        new() { Index = 8, Text = "the" },
                        new() { Index = 9, Text = "regional" },
                        new() { Index = 10, Text = "bus" },
                        new() { Index = 11, Text = "." }
                    },
                    ErrorTokenIndex = 5,
                    ErrorTokenText = "more faster",
                    CorrectionOptions = new List<string> { "faster", "much faster", "more fast" },
                    CorrectReplacement = "faster",
                    GrammarRuleExplanation = "Tính từ ngắn 'fast' khi chuyển sang so sánh hơn chỉ thêm đuôi '-er' thành 'faster'. Không dùng 'more faster' vì đây là lỗi lặp từ so sánh thừa.",
                    DifficultyLevel = "Easy"
                }
            };

            context.GrammarDetectiveQuestions.AddRange(gdCases);
        }

        await context.SaveChangesAsync();
    }

    public static async Task SeedSkillDomainsAsync(AppDbContext context)
    {
        if (await context.SkillDomains.AnyAsync())
        {
            return;
        }

        var domains = new List<SkillDomain>
        {
            new()
            {
                Code = "LISTENING",
                NameVi = "Kỹ Năng Nghe",
                NameEn = "Listening Academy",
                Description = "Rèn luyện khả năng nhận diện âm thanh bản xứ, chép chính tả và phản xạ nghe hiểu tức thì.",
                IconName = "Headphones",
                ThemeColor = "sky-500",
                DisplayOrder = 1,
                IsActive = true
            },
            new()
            {
                Code = "READING",
                NameVi = "Kỹ Năng Đọc",
                NameEn = "Reading Academy",
                Description = "Mở rộng vốn từ vựng theo ngữ cảnh, đọc lướt nắm keyword và phản xạ nhận diện nghĩa.",
                IconName = "BookOpen",
                ThemeColor = "emerald-500",
                DisplayOrder = 2,
                IsActive = true
            },
            new()
            {
                Code = "WRITING",
                NameVi = "Kỹ Năng Viết",
                NameEn = "Writing Academy",
                Description = "Làm chủ cú pháp câu, cụm từ học thuật Collocations và thám tử sửa lỗi ngữ pháp.",
                IconName = "PenTool",
                ThemeColor = "amber-500",
                DisplayOrder = 3,
                IsActive = true
            },
            new()
            {
                Code = "SPEAKING",
                NameVi = "Kỹ Năng Nói",
                NameEn = "Speaking Academy",
                Description = "Chuẩn hóa phát âm âm vị, đánh bắt trọng âm và luyện nhại giọng ngữ điệu tự nhiên.",
                IconName = "Mic",
                ThemeColor = "rose-500",
                DisplayOrder = 4,
                IsActive = true
            }
        };

        context.SkillDomains.AddRange(domains);
        await context.SaveChangesAsync();

        var games = new List<SkillDomainGame>
        {
            // LISTENING
            new() { SkillDomainCode = "LISTENING", GameTypeCode = "AUDIO_BLITZ", DisplayTitle = "Audio Blitz (Nghe & Điền Chính Tả)", DifficultyTier = "A1_A2", IsPrimary = true, DisplayOrder = 1 },
            new() { SkillDomainCode = "LISTENING", GameTypeCode = "DICTATION_DASH", DisplayTitle = "Dictation Dash (Chép Chính Tả Biểu Mẫu)", DifficultyTier = "B1_B2", IsPrimary = true, DisplayOrder = 2 },
            new() { SkillDomainCode = "LISTENING", GameTypeCode = "SPEED_AUDIO_MATCH", DisplayTitle = "Speed Audio Match (Phản Xạ Âm Thanh Siêu Tốc)", DifficultyTier = "A1_A2", IsPrimary = false, DisplayOrder = 3 },
            new() { SkillDomainCode = "LISTENING", GameTypeCode = "SHADOWING_BEAT", DisplayTitle = "Shadowing Beat (Luyện Nhại Giọng Ngắt Nhịp)", DifficultyTier = "IELTS_ADVANCED", IsPrimary = false, DisplayOrder = 4 },

            // READING
            new() { SkillDomainCode = "READING", GameTypeCode = "WORD_MATCH", DisplayTitle = "Word Match (Ghép Thẻ Từ Vựng & Nghĩa)", DifficultyTier = "A1_A2", IsPrimary = true, DisplayOrder = 1 },
            new() { SkillDomainCode = "READING", GameTypeCode = "FALLING_WORDS", DisplayTitle = "Speed Falling Word (Từ Rơi Tốc Độ Cao)", DifficultyTier = "B1_B2", IsPrimary = true, DisplayOrder = 2 },
            new() { SkillDomainCode = "READING", GameTypeCode = "CLOZE_MASTER", DisplayTitle = "Cloze Master (Điền Từ Ngữ Cảnh & Collocation)", DifficultyTier = "B1_B2", IsPrimary = true, DisplayOrder = 3 },
            new() { SkillDomainCode = "READING", GameTypeCode = "SKIM_SCAN_SPRINT", DisplayTitle = "Skim & Scan Sprint (Đọc Lướt Bắt Chi Tiết)", DifficultyTier = "IELTS_ADVANCED", IsPrimary = false, DisplayOrder = 4 },

            // WRITING
            new() { SkillDomainCode = "WRITING", GameTypeCode = "SENTENCE_SCRAMBLE", DisplayTitle = "Sentence Scramble (Sắp Xếp Trật Tự Câu)", DifficultyTier = "A1_A2", IsPrimary = true, DisplayOrder = 1 },
            new() { SkillDomainCode = "WRITING", GameTypeCode = "GRAMMAR_DETECTIVE", DisplayTitle = "Grammar Detective (Thám Tử Bắt Lỗi Ngữ Pháp)", DifficultyTier = "B1_B2", IsPrimary = true, DisplayOrder = 2 },
            new() { SkillDomainCode = "WRITING", GameTypeCode = "COLLOCATION_CHAIN", DisplayTitle = "Collocation Chain (Chuỗi Cụm Từ Cố Định)", DifficultyTier = "IELTS_ADVANCED", IsPrimary = false, DisplayOrder = 3 },
            new() { SkillDomainCode = "WRITING", GameTypeCode = "PARAPHRASE_RUSH", DisplayTitle = "Paraphrase Rush (Viết Lại Câu Học Thuật)", DifficultyTier = "IELTS_ADVANCED", IsPrimary = false, DisplayOrder = 4 },

            // SPEAKING
            new() { SkillDomainCode = "SPEAKING", GameTypeCode = "MINIMAL_PAIRS", DisplayTitle = "Minimal Pairs Duel (Đấu Sĩ Phân Biệt Cặp Âm)", DifficultyTier = "A1_A2", IsPrimary = true, DisplayOrder = 1 },
            new() { SkillDomainCode = "SPEAKING", GameTypeCode = "STRESS_HUNTER", DisplayTitle = "Word Stress Hunter (Săn Trọng Âm Từ Vựng)", DifficultyTier = "B1_B2", IsPrimary = true, DisplayOrder = 2 },
            new() { SkillDomainCode = "SPEAKING", GameTypeCode = "INTONATION_CURVE", DisplayTitle = "Intonation Curve (Đường Cong Ngữ Điệu Câu)", DifficultyTier = "B1_B2", IsPrimary = false, DisplayOrder = 3 },
            new() { SkillDomainCode = "SPEAKING", GameTypeCode = "FLUENCY_SPRINT", DisplayTitle = "45-Sec Fluency Sprint (Phản Xạ Nói Tự Nhiên)", DifficultyTier = "IELTS_ADVANCED", IsPrimary = false, DisplayOrder = 4 }
        };

        context.SkillDomainGames.AddRange(games);
        await context.SaveChangesAsync();

        // Seed initial progress for sample ranked users so leaderboard & radar look great
        var sampleUserIds = new[]
        {
            Guid.Parse("b1111111-1111-1111-1111-111111111111"), // Alex Trần
            Guid.Parse("b2222222-2222-2222-2222-222222222222"), // Minh Vũ
            Guid.Parse("b3333333-3333-3333-3333-333333333333")  // Sarah Nguyễn
        };

        foreach (var uid in sampleUserIds)
        {
            if (!await context.UserSkillProgresses.AnyAsync(p => p.UserId == uid))
            {
                context.UserSkillProgresses.AddRange(
                    new UserSkillProgress { UserId = uid, SkillDomainCode = "LISTENING", MasteryScore = 85.0m, TotalXp = 1250, GamesPlayed = 42, PerfectGames = 12 },
                    new UserSkillProgress { UserId = uid, SkillDomainCode = "READING", MasteryScore = 80.0m, TotalXp = 1100, GamesPlayed = 38, PerfectGames = 9 },
                    new UserSkillProgress { UserId = uid, SkillDomainCode = "WRITING", MasteryScore = 70.0m, TotalXp = 850, GamesPlayed = 25, PerfectGames = 6 },
                    new UserSkillProgress { UserId = uid, SkillDomainCode = "SPEAKING", MasteryScore = 45.0m, TotalXp = 320, GamesPlayed = 12, PerfectGames = 2 }
                );
            }
        }
        await context.SaveChangesAsync();
    }

    private static async Task SeedRetentionDataAsync(AppDbContext context)
    {
        var sampleLeaderId = Guid.Parse("b1111111-1111-1111-1111-111111111111"); // Alex Trần
        var user2Id = Guid.Parse("b2222222-2222-2222-2222-222222222222"); // Minh Vũ
        var user3Id = Guid.Parse("b3333333-3333-3333-3333-333333333333"); // Sarah Nguyễn

        // 1. Seed sample StudySquad if none exists
        if (!await context.StudySquads.AnyAsync())
        {
            var squad = new StudySquad
            {
                SquadCode = "IELTS9",
                Name = "The IELTS Overcomers",
                Description = "Biệt đội cày 5,000 XP mỗi tuần để chinh phục học bổng và IELTS 8.0!",
                LeaderUserId = sampleLeaderId,
                MaxMembers = 10,
                CurrentMembersCount = 3,
                TotalAccumulatedXp = 2750,
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            };

            context.StudySquads.Add(squad);
            context.SquadMembers.AddRange(
                new SquadMember { SquadId = squad.Id, UserId = sampleLeaderId, Role = "Leader", WeeklyContributedXp = 1250, JoinedAt = DateTime.UtcNow.AddDays(-5) },
                new SquadMember { SquadId = squad.Id, UserId = user2Id, Role = "Member", WeeklyContributedXp = 850, JoinedAt = DateTime.UtcNow.AddDays(-4) },
                new SquadMember { SquadId = squad.Id, UserId = user3Id, Role = "Member", WeeklyContributedXp = 650, JoinedAt = DateTime.UtcNow.AddDays(-3) }
            );
        }

        // 2. Seed default Weekly Leagues if none
        if (!await context.WeeklyLeagues.AnyAsync())
        {
            var nowVn = DateTime.UtcNow.AddHours(7);
            var today = DateOnly.FromDateTime(nowVn);
            int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            var monday = today.AddDays(-diff);
            var sunday = monday.AddDays(6);

            var sapphireRoom = new WeeklyLeague
            {
                LeagueTier = 4, // Sapphire
                WeekStartDate = monday,
                WeekEndDate = sunday,
                RoomCode = "Sapphire-Room-142",
                MaxParticipants = 30,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            context.WeeklyLeagues.Add(sapphireRoom);

            context.WeeklyLeagueMembers.AddRange(
                new WeeklyLeagueMember { LeagueId = sapphireRoom.Id, UserId = sampleLeaderId, WeeklyXp = 2450, OutcomeStatus = "Pending" },
                new WeeklyLeagueMember { LeagueId = sapphireRoom.Id, UserId = user2Id, WeeklyXp = 1620, OutcomeStatus = "Pending" },
                new WeeklyLeagueMember { LeagueId = sapphireRoom.Id, UserId = user3Id, WeeklyXp = 1590, OutcomeStatus = "Pending" }
            );
        }

        await context.SaveChangesAsync();
    }

    public static async Task SeedAvatarAndShopDataAsync(AppDbContext context)
    {
        // 1. Seed Shop Items (28 catalog items + starter basic items)
        if (!await context.ShopItems.AnyAsync())
        {
            var items = new List<ShopItem>
            {
                // Starter Items (Free default gear)
                new() { ItemCode = "starter_tee_white", NameEn = "Classic White T-Shirt", NameVi = "Áo Thun Trắng Năng Động", Description = "Trang phục thường ngày cơ bản khởi đầu.", Category = "tops", LayerSlot = "tops", RarityTier = "common", TokenPrice = 0, RequiredLevel = 1, AssetSvgKey = "assets/avatar/tops/starter_tee_white.svg", ZIndex = 60 },
                new() { ItemCode = "starter_jeans_blue", NameEn = "Classic Denim Jeans", NameVi = "Quần Jeans Xanh Cổ Điển", Description = "Quần jeans xanh thoải mái tiện dụng.", Category = "bottoms", LayerSlot = "bottoms", RarityTier = "common", TokenPrice = 0, RequiredLevel = 1, AssetSvgKey = "assets/avatar/bottoms/starter_jeans_blue.svg", ZIndex = 50 },
                new() { ItemCode = "starter_sneakers_white", NameEn = "White Canvas Sneakers", NameVi = "Giày Thể Thao Trắng Trẻ Trung", Description = "Giày thể thao trắng năng động mọi lúc mọi nơi.", Category = "footwear", LayerSlot = "footwear", RarityTier = "common", TokenPrice = 0, RequiredLevel = 1, AssetSvgKey = "assets/avatar/footwear/starter_sneakers_white.svg", ZIndex = 40 },
                new() { ItemCode = "pedestal_wood_circle", NameEn = "Minimalist Wooden Pedestal", NameVi = "Bục Gỗ Tròn Tối Giản", Description = "Bục gỗ đứng tiêu chuẩn tôn dáng nhân vật.", Category = "aura_background", LayerSlot = "pedestal_aura", RarityTier = "common", TokenPrice = 0, RequiredLevel = 1, AssetSvgKey = "assets/avatar/aura/pedestal_wood_circle.svg", ZIndex = 0 },

                // 28 Catalog Items according to SPEC-AVATAR-SHOP-V1
                new() { ItemCode = "top_oxford_blazer", NameEn = "Oxford Scholar Blazer", NameVi = "Áo Vest Học Giả Oxford", Description = "Huy hiệu ngực vàng thêu tinh xảo", Category = "tops", LayerSlot = "tops", RarityTier = "rare", TokenPrice = 450, RequiredLevel = 5, AssetSvgKey = "assets/avatar/tops/oxford_blazer.svg", ZIndex = 60 },
                new() { ItemCode = "top_cyber_hoodie", NameEn = "Cyber Neon Hoodie", NameVi = "Áo Hoodie Neon Tương Lai", Description = "Dải đèn LED dạ quang chạy dọc tay áo", Category = "tops", LayerSlot = "tops", RarityTier = "epic", TokenPrice = 950, RequiredLevel = 10, AssetSvgKey = "assets/avatar/tops/cyber_hoodie.svg", ZIndex = 60 },
                new() { ItemCode = "top_wizard_robe", NameEn = "Archmage Lexicon Robe", NameVi = "Áo Choàng Đại Pháp Sư Từ Vựng", Description = "Cổ áo thêu chòm sao phát sáng huyền ảo", Category = "tops", LayerSlot = "tops", RarityTier = "legendary", TokenPrice = 3200, RequiredLevel = 25, AssetSvgKey = "assets/avatar/tops/wizard_robe.svg", ZIndex = 60 },
                new() { ItemCode = "top_detective_trench", NameEn = "Baker Street Trench Coat", NameVi = "Áo Măng Tô Thám Tử Baker", Description = "Khăn choàng kẻ caro phong cách London", Category = "tops", LayerSlot = "tops", RarityTier = "epic", TokenPrice = 1100, RequiredLevel = 12, AssetSvgKey = "assets/avatar/tops/detective_trench.svg", ZIndex = 60 },
                new() { ItemCode = "top_vintage_denim", NameEn = "Vintage Denim Jacket", NameVi = "Áo Khoác Bò Cổ Điển", Description = "Áo khoác phong cách cổ điển thanh lịch", Category = "tops", LayerSlot = "tops", RarityTier = "common", TokenPrice = 200, RequiredLevel = 2, AssetSvgKey = "assets/avatar/tops/vintage_denim.svg", ZIndex = 60 },
                new() { ItemCode = "top_astronaut_suit", NameEn = "Apollo Flight Suit", NameVi = "Bộ Đồ Phi Hành Gia Apollo", Description = "Cờ phù hiệu vũ trụ phản quang", Category = "tops", LayerSlot = "tops", RarityTier = "legendary", TokenPrice = 3800, RequiredLevel = 30, AssetSvgKey = "assets/avatar/tops/astronaut_suit.svg", ZIndex = 60 },

                new() { ItemCode = "bot_pleated_skirt", NameEn = "Academic Pleated Skirt", NameVi = "Váy Xếp Ly Đồng Phục", Description = "Chân váy xếp ly trang nhã học đường", Category = "bottoms", LayerSlot = "bottoms", RarityTier = "common", TokenPrice = 180, RequiredLevel = 1, AssetSvgKey = "assets/avatar/bottoms/pleated_skirt.svg", ZIndex = 50 },
                new() { ItemCode = "bot_cargo_joggers", NameEn = "Urban Cargo Joggers", NameVi = "Quần Túi Hộp Chiến Thuật", Description = "Túi hộp đai khóa phong cách Streetwear", Category = "bottoms", LayerSlot = "bottoms", RarityTier = "rare", TokenPrice = 350, RequiredLevel = 4, AssetSvgKey = "assets/avatar/bottoms/cargo_joggers.svg", ZIndex = 50 },
                new() { ItemCode = "bot_wizard_skirt", NameEn = "Runic Mage Trousers", NameVi = "Quần Pháp Sư Thêu Chỉ Vàng", Description = "Họa tiết chữ Runes phát sáng viền gấu", Category = "bottoms", LayerSlot = "bottoms", RarityTier = "epic", TokenPrice = 850, RequiredLevel = 15, AssetSvgKey = "assets/avatar/bottoms/wizard_skirt.svg", ZIndex = 50 },
                new() { ItemCode = "bot_suit_pants", NameEn = "Tailored Suit Trousers", NameVi = "Quần Tây Doanh Nhân Lịch Lãm", Description = "Nếp gấp thẳng tắp cao cấp", Category = "bottoms", LayerSlot = "bottoms", RarityTier = "rare", TokenPrice = 380, RequiredLevel = 5, AssetSvgKey = "assets/avatar/bottoms/suit_pants.svg", ZIndex = 50 },

                new() { ItemCode = "foot_leather_oxford", NameEn = "Polished Oxford Shoes", NameVi = "Giày Da Oxford Bóng Bẩy", Description = "Ánh sáng bóng loáng phản chiếu", Category = "footwear", LayerSlot = "footwear", RarityTier = "rare", TokenPrice = 320, RequiredLevel = 3, AssetSvgKey = "assets/avatar/footwear/leather_oxford.svg", ZIndex = 40 },
                new() { ItemCode = "foot_cyber_kicks", NameEn = "Neon Air Striders", NameVi = "Giày Thể Thao Đệm Khí Neon", Description = "Đế giày nhấp nháy ánh sáng tím Neon", Category = "footwear", LayerSlot = "footwear", RarityTier = "epic", TokenPrice = 900, RequiredLevel = 12, AssetSvgKey = "assets/avatar/footwear/cyber_kicks.svg", ZIndex = 40 },
                new() { ItemCode = "foot_hermes_boots", NameEn = "Hermes Winged Boots", NameVi = "Bốt Thần Gió Có Cánh", Description = "Đôi cánh vàng nhỏ vẫy nhẹ ở gót chân", Category = "footwear", LayerSlot = "footwear", RarityTier = "legendary", TokenPrice = 2500, RequiredLevel = 20, AssetSvgKey = "assets/avatar/footwear/hermes_boots.svg", ZIndex = 40 },
                new() { ItemCode = "foot_canvas_high", NameEn = "Classic High-Top Canvas", NameVi = "Giày Cổ Cao Vải Canvas", Description = "Giày vải cổ cao năng động", Category = "footwear", LayerSlot = "footwear", RarityTier = "common", TokenPrice = 150, RequiredLevel = 1, AssetSvgKey = "assets/avatar/footwear/canvas_high.svg", ZIndex = 40 },

                new() { ItemCode = "head_graduation_cap", NameEn = "Valedictorian Mortarboard", NameVi = "Mũ Cử Nhân Tri Thức", Description = "Dải tua rua vàng lay nhẹ trong gió", Category = "headwear", LayerSlot = "headwear", RarityTier = "rare", TokenPrice = 500, RequiredLevel = 8, AssetSvgKey = "assets/avatar/headwear/graduation_cap.svg", ZIndex = 90 },
                new() { ItemCode = "head_detective_hat", NameEn = "Deerstalker Investigator Hat", NameVi = "Mũ Thám Tử Săn Hươu", Description = "Nơ thắt đỉnh mũ phong cách cổ điển", Category = "headwear", LayerSlot = "headwear", RarityTier = "rare", TokenPrice = 420, RequiredLevel = 6, AssetSvgKey = "assets/avatar/headwear/detective_hat.svg", ZIndex = 90 },
                new() { ItemCode = "head_cyber_headphones", NameEn = "Cyber Cat Headphones", NameVi = "Tai Nghe Chụp Tai Gaming LED", Description = "Vành tai mèo phát sáng đổi 7 màu", Category = "headwear", LayerSlot = "headwear", RarityTier = "epic", TokenPrice = 1200, RequiredLevel = 14, AssetSvgKey = "assets/avatar/headwear/cyber_headphones.svg", ZIndex = 90 },
                new() { ItemCode = "head_olympus_crown", NameEn = "Golden Laurels of Olympus", NameVi = "Vòng Nguyệt Quế Vàng Olympus", Description = "Lá vàng óng ánh tỏa bụi sáng lấp lánh", Category = "headwear", LayerSlot = "headwear", RarityTier = "legendary", TokenPrice = 4000, RequiredLevel = 30, AssetSvgKey = "assets/avatar/headwear/olympus_crown.svg", ZIndex = 90 },
                new() { ItemCode = "head_wizard_hat", NameEn = "Centennial Sorcerer Hat", NameVi = "Mũ Phù Thủy Ngàn Năm", Description = "Mặt trăng lưỡi liềm vàng đu đưa ở chóp", Category = "headwear", LayerSlot = "headwear", RarityTier = "epic", TokenPrice = 1400, RequiredLevel = 18, AssetSvgKey = "assets/avatar/headwear/wizard_hat.svg", ZIndex = 90 },

                new() { ItemCode = "eye_smart_glasses", NameEn = "Scholastic Wireframe Glasses", NameVi = "Kính Cận Trí Thức Mạ Vàng", Description = "Tròng kính phản chiếu ánh sáng thông tuệ", Category = "eyewear", LayerSlot = "eyewear", RarityTier = "common", TokenPrice = 220, RequiredLevel = 2, AssetSvgKey = "assets/avatar/eyewear/smart_glasses.svg", ZIndex = 95 },
                new() { ItemCode = "eye_vr_visor", NameEn = "Cyber Tactical Visor", NameVi = "Kính Thực Tế Ảo Cyber", Description = "Màn hình hiển thị dữ liệu số HUD quét liên tục", Category = "eyewear", LayerSlot = "eyewear", RarityTier = "epic", TokenPrice = 1050, RequiredLevel = 16, AssetSvgKey = "assets/avatar/eyewear/vr_visor.svg", ZIndex = 95 },
                new() { ItemCode = "eye_steampunk_goggles", NameEn = "Steampunk Aviator Goggles", NameVi = "Kính Phi Công Cổ Điển Bằng Đồng", Description = "Bánh răng đồng hồ xoay nhẹ trên gọng", Category = "eyewear", LayerSlot = "eyewear", RarityTier = "rare", TokenPrice = 550, RequiredLevel = 7, AssetSvgKey = "assets/avatar/eyewear/steampunk_goggles.svg", ZIndex = 95 },

                new() { ItemCode = "hand_magic_tome", NameEn = "Grimoire of Ancient Grammar", NameVi = "Sách Cổ Ngữ Pháp Cấm Thuật", Description = "Sách bay lơ lửng bên tay tự động lật trang", Category = "handheld", LayerSlot = "handheld", RarityTier = "legendary", TokenPrice = 3500, RequiredLevel = 25, AssetSvgKey = "assets/avatar/handheld/magic_tome.svg", ZIndex = 100 },
                new() { ItemCode = "hand_golden_mic", NameEn = "Golden Voice Champion Mic", NameVi = "Micro Mạ Vàng Thần Thoại", Description = "Sóng âm nhạc nốt vàng tỏa ra xung quanh", Category = "handheld", LayerSlot = "handheld", RarityTier = "epic", TokenPrice = 1500, RequiredLevel = 15, AssetSvgKey = "assets/avatar/handheld/golden_mic.svg", ZIndex = 100 },

                new() { ItemCode = "aura_floating_books", NameEn = "Orbiting Lexicon Runes", NameVi = "Vòng Xoáy Sách Tri Thức", Description = "4 quyển từ điển thu nhỏ bay xoay quanh người", Category = "aura_background", LayerSlot = "pedestal_aura", RarityTier = "epic", TokenPrice = 1600, RequiredLevel = 18, AssetSvgKey = "assets/avatar/aura/floating_books.svg", ZIndex = 0 },
                new() { ItemCode = "aura_golden_triumph", NameEn = "Aura of Victorious Flames", NameVi = "Hào Quang Lửa Vàng Vinh Quang", Description = "Lửa thần vàng rực bốc lên từ bục chân 60fps", Category = "aura_background", LayerSlot = "pedestal_aura", RarityTier = "legendary", TokenPrice = 4500, RequiredLevel = 35, AssetSvgKey = "assets/avatar/aura/golden_triumph.svg", ZIndex = 0 },
                new() { ItemCode = "aura_royal_library", NameEn = "Grand Royal Archives", NameVi = "Nền Thư Viện Hoàng Gia Cổ Kính", Description = "Giá sách gỗ sồi cổ kính và ánh nến ấm áp", Category = "aura_background", LayerSlot = "pedestal_aura", RarityTier = "rare", TokenPrice = 600, RequiredLevel = 10, AssetSvgKey = "assets/avatar/aura/royal_library.svg", ZIndex = 0 },

                new() { ItemCode = "boost_streak_freeze", NameEn = "Streak Freeze Shield", NameVi = "Băng Bảo Vệ Chuỗi Ngày Học", Description = "Tự động bảo lưu Streak nếu quên học 1 ngày", Category = "consumable", LayerSlot = "consumable", RarityTier = "rare", TokenPrice = 200, RequiredLevel = 1, AssetSvgKey = "assets/icons/streak_freeze.svg", ZIndex = 0 }
            };

            context.ShopItems.AddRange(items);
            await context.SaveChangesAsync();
        }

        // 2. Ensure each UserProfile has an AvatarConfig, Starter Inventory, Preset 1, and Initial Tokens
        var profiles = await context.UserProfiles.ToListAsync();
        var starterItems = await context.ShopItems
            .Where(x => x.ItemCode == "starter_tee_white" || x.ItemCode == "starter_jeans_blue" || x.ItemCode == "starter_sneakers_white" || x.ItemCode == "pedestal_wood_circle")
            .ToListAsync();

        foreach (var profile in profiles)
        {
            if (profile.TokenBalance <= 0)
            {
                profile.TokenBalance = 350;
                profile.TotalTokensEarned = 350;
                profile.Coins = 350;
            }

            var hasAvatarConfig = await context.AvatarConfigs.AnyAsync(a => a.UserId == profile.UserId);
            if (!hasAvatarConfig)
            {
                var avatarConfig = new AvatarConfig
                {
                    Id = Guid.NewGuid(),
                    UserId = profile.UserId,
                    BodyType = "neutral",
                    SkinColor = "#E8B898",
                    HairStyleId = "short_crop",
                    HairColor = "#1C1917",
                    EyeExpression = "friendly_smile",
                    MouthExpression = "smile_open",
                    TopsId = "starter_tee_white",
                    BottomsId = "starter_jeans_blue",
                    FootwearId = "starter_sneakers_white",
                    AuraBackgroundId = "pedestal_wood_circle",
                    IsActive = true,
                    UpdatedAt = DateTime.UtcNow
                };
                context.AvatarConfigs.Add(avatarConfig);
            }

            // Ensure starter items in user_inventory
            foreach (var starter in starterItems)
            {
                var owned = await context.UserInventories.AnyAsync(i => i.UserId == profile.UserId && i.ItemId == starter.Id);
                if (!owned)
                {
                    context.UserInventories.Add(new UserInventory
                    {
                        Id = Guid.NewGuid(),
                        UserId = profile.UserId,
                        ItemId = starter.Id,
                        TokenSpent = 0,
                        IsEquipped = true,
                        AcquiredFrom = "system_gift",
                        AcquiredAt = DateTime.UtcNow
                    });
                }
            }

            // Ensure preset 1 exists
            var hasPreset = await context.AvatarPresets.AnyAsync(p => p.UserId == profile.UserId && p.PresetIndex == 1);
            if (!hasPreset)
            {
                var starterJson = System.Text.Json.JsonSerializer.Serialize(new
                {
                    bodyType = "neutral",
                    skinColor = "#E8B898",
                    hairStyleId = "short_crop",
                    hairColor = "#1C1917",
                    eyeExpression = "friendly_smile",
                    mouthExpression = "smile_open",
                    topsId = "starter_tee_white",
                    bottomsId = "starter_jeans_blue",
                    footwearId = "starter_sneakers_white",
                    auraBackgroundId = "pedestal_wood_circle"
                });

                context.AvatarPresets.Add(new AvatarPreset
                {
                    Id = Guid.NewGuid(),
                    UserId = profile.UserId,
                    PresetIndex = 1,
                    PresetName = "Phong Cách Đi Học (Campus Casual)",
                    ConfigData = starterJson,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            // Ensure initial welcome token transaction
            var hasTx = await context.TokenTransactions.AnyAsync(t => t.UserId == profile.UserId);
            if (!hasTx)
            {
                context.TokenTransactions.Add(new TokenTransaction
                {
                    Id = Guid.NewGuid(),
                    UserId = profile.UserId,
                    Amount = profile.TokenBalance,
                    BalanceAfter = profile.TokenBalance,
                    TransactionType = "admin_adjustment",
                    Description = "Quà tặng chào mừng tân thủ",
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await context.SaveChangesAsync();
    }
}

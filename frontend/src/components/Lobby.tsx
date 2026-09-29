import React, { useState } from 'react';
import { 
  Sun, Cpu, Compass, BookOpen, Layers, Zap, AlignLeft, 
  Play, CheckCircle2, Sparkles, Swords, Trophy, Flame, Shield, ArrowRight,
  Volume2, Search
} from 'lucide-react';
import { DifficultyLevel, GameType, TopicDto, UserRankProfileDto, RankTier, RankDivision } from '../types/game';
import { RankBadge, TrophyBadge, StreakBadge, ShieldBadge } from './ui/RankBadge';
import { Button } from './ui/Button';

interface LobbyProps {
  topics: TopicDto[];
  myRank: UserRankProfileDto | null;
  onStartGame: (gameType: GameType, topicId: string, difficulty: DifficultyLevel) => void;
  onStart1v1Battle: (topicId?: string) => void;
  onOpenBattleLeaderboard: () => void;
  isLoading: boolean;
}

export const Lobby: React.FC<LobbyProps> = ({ 
  topics, 
  myRank,
  onStartGame, 
  onStart1v1Battle,
  onOpenBattleLeaderboard,
  isLoading 
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Easy');

  const getTopicIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      default: return <BookOpen className="w-5 h-5 text-cyan-400" />;
    }
  };

  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Banner with 1v1 Battle Arena Highlight */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Nền tảng Học Tiếng Anh Gamified
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Đấu Trường <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">1v1 Realtime</span> & Mini-game
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Thi đấu trực tiếp với đối thủ cùng trình độ qua Speed Word Match, leo Rank từ Đồng đến Cao Thủ và khẳng định vị thế trên Bảng Xếp Hạng!
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="gold"
                size="lg"
                onClick={() => onStart1v1Battle(activeTopic?.id)}
                leftIcon={<Swords className="w-5 h-5" />}
              >
                Tìm Trận Đấu 1v1 Ngay
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenBattleLeaderboard}
                leftIcon={<Trophy className="w-5 h-5 text-yellow-400" />}
              >
                Bảng Xếp Hạng Đấu Thủ
              </Button>
            </div>
          </div>

          {/* User Rank Card Profile */}
          {myRank && (
            <div className="w-full md:w-72 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col items-center text-center shrink-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Hồ Sơ Xếp Hạng Cá Nhân
              </span>

              <div className="my-1">
                <RankBadge
                  tier={(myRank.tier as RankTier) || 'Bronze'}
                  division={(myRank.division as RankDivision) || 'III'}
                  size="lg"
                />
              </div>

              <div className="mt-3">
                <TrophyBadge trophy={myRank.trophy} size="md" />
              </div>

              <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-800/60 rounded-xl p-2">
                  <span className="text-slate-400 block text-[10px]">Tỷ lệ thắng</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">
                    {myRank.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-2">
                  <span className="text-slate-400 block text-[10px]">Chuỗi thắng</span>
                  <span className="font-black text-orange-400 font-mono text-sm flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" />
                    {myRank.winStreak}
                  </span>
                </div>
              </div>

              {myRank.protectionGamesLeft > 0 && (
                <div className="mt-2 text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  Khiên bảo vệ: {myRank.protectionGamesLeft} trận
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-20 pointer-events-none hidden md:block">
          <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500 via-rose-500 to-purple-400 blur-3xl" />
        </div>
      </div>

      {/* Step 1: Select Topic & Difficulty */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
              Chọn Chủ Đề Từ Vựng
            </h3>
            <p className="text-xs text-slate-400">Từ vựng và cấu trúc câu sẽ được lấy theo chủ đề này</p>
          </div>

          {/* Difficulty selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === level
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {level === 'Easy' ? 'Cơ bản' : level === 'Medium' ? 'Trung cấp' : 'Nâng cao'}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((topic) => {
            const isSelected = selectedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-700/50 border border-slate-600/40">
                    {getTopicIcon(topic.iconName)}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  )}
                </div>
                <h4 className="mt-4 font-bold text-slate-100 text-base">{topic.name}</h4>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{topic.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                  <span>{topic.wordCount} từ vựng</span>
                  <span>{topic.sentenceCount} câu luyện tập</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: Choose Mini-game */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
            Chọn Trò Chơi Trải Nghiệm
          </h3>
          <p className="text-xs text-slate-400">Mỗi trò chơi tập trung vào một kỹ năng ghi nhớ và phản xạ ngôn ngữ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Game 1: Word Match */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900 border border-slate-700 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">1. Word Match</h4>
              <p className="text-xs text-indigo-300 font-medium">Ghép Thẻ Từ Vựng & Nghĩa</p>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Lật và ghép các cặp thẻ Tiếng Anh - Tiếng Việt tương ứng. Nhận thêm +2s thời gian khi ghép đúng và chuỗi Combo x2.0 điểm thưởng.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">60s Đếm ngược</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Luyện nhớ từ</span>
              </div>
            </div>

            <button
              disabled={isLoading || !activeTopic}
              onClick={() => activeTopic && onStartGame('WordMatch', activeTopic.id, selectedDifficulty)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              Chơi Word Match
            </button>
          </div>

          {/* Game 2: Speed Falling Word */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900 border border-slate-700 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">2. Speed Falling Word</h4>
              <p className="text-xs text-amber-300 font-medium">Từ Rơi Tốc Độ Cao</p>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Từ vựng rơi từ trên xuống! Chọn nghĩa đúng từ 4 đáp án trước khi chạm đáy. Bạn có 3 mạng sống và tốc độ tăng dần theo các đợt.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">3 Mạng sống</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Phím tắt 1-4</span>
              </div>
            </div>

            <button
              disabled={isLoading || !activeTopic}
              onClick={() => activeTopic && onStartGame('SpeedFalling', activeTopic.id, selectedDifficulty)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              Chơi Speed Falling
            </button>
          </div>

          {/* Game 3: Sentence Scramble */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900 border border-slate-700 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <AlignLeft className="w-6 h-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">3. Sentence Scramble</h4>
              <p className="text-xs text-emerald-300 font-medium">Sắp Xếp Trật Tự Câu</p>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Đọc nghĩa câu tiếng Việt và sắp xếp các thẻ từ xáo trộn thành câu tiếng Anh hoàn chỉnh chuẩn ngữ pháp kèm giọng đọc bản ngữ.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Ngữ pháp thực tế</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Phát âm TTS</span>
              </div>
            </div>

            <button
              disabled={isLoading || !activeTopic}
              onClick={() => activeTopic && onStartGame('SentenceScramble', activeTopic.id, selectedDifficulty)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              Chơi Sentence Scramble
            </button>
          </div>

          {/* Game 4: Audio Blitz */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900 border border-slate-700 hover:border-cyan-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">4. Audio Blitz</h4>
              <p className="text-xs text-cyan-300 font-medium">Âm Thanh Đoán Chữ & Chính Tả</p>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Lắng nghe phát âm bản xứ chuẩn, quan sát phiên âm IPA và gõ đúng chính tả từng ký tự trước khi hết giờ. Chế độ nghe chậm 0.75x hỗ trợ.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">15s/từ (8 từ)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Nghe & Điền chữ</span>
              </div>
            </div>

            <button
              disabled={isLoading || !activeTopic}
              onClick={() => activeTopic && onStartGame('AudioBlitz', activeTopic.id, selectedDifficulty)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              Chơi Audio Blitz
            </button>
          </div>

          {/* Game 5: Cloze Master */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900 border border-slate-700 hover:border-purple-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">5. Cloze Master</h4>
              <p className="text-xs text-purple-300 font-medium">Điền Từ Ngữ Cảnh & Collocations</p>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Đọc đoạn câu ngữ cảnh thực tế và chọn 1 trong 4 đáp án thông minh. Trợ giúp 50:50 và gợi ý ký tự đầu kèm Mini Grammar Bite giải thích sâu.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">20s/câu (10 câu)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Ngữ cảnh & Cụm từ</span>
              </div>
            </div>

            <button
              disabled={isLoading || !activeTopic}
              onClick={() => activeTopic && onStartGame('ClozeMaster', activeTopic.id, selectedDifficulty)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              Chơi Cloze Master
            </button>
          </div>

          {/* Game 6: Grammar Detective */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900 border border-slate-700 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">6. Grammar Detective</h4>
              <p className="text-xs text-amber-300 font-medium">Thám Tử Bắt Lỗi Ngữ Pháp</p>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Nhập vai thám tử soi hồ sơ vụ án: Chạm đúng từ bị sai ngữ pháp trong câu và chọn phương án sửa chính xác để phá án trọn vẹn!
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">3 Kính lúp (Mạng)</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Phá 5 vụ án</span>
              </div>
            </div>

            <button
              disabled={isLoading || !activeTopic}
              onClick={() => activeTopic && onStartGame('GrammarDetective', activeTopic.id, selectedDifficulty)}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              Chơi Grammar Detective
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

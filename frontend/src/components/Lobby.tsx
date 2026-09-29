import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Swords, 
  Trophy, 
  Flame, 
  Shield, 
  CheckCircle2,
  Gift,
  Coins,
  Heart,
  Users,
  Mic,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DifficultyLevel, 
  GameType, 
  TopicDto, 
  UserRankProfileDto, 
  RankTier, 
  RankDivision,
  SkillsOverviewResponse,
  DailyBalancedStatusDto,
  RecommendedSkillDto,
  SkillDomainCode
} from '../types/game';
import { DailyHabitWidget } from './DailyHabitWidget';
import { WeaknessClinicModal } from './WeaknessClinicModal';
import { WeeklyLeagueModal } from './WeeklyLeagueModal';
import { StudySquadModal } from './StudySquadModal';
import { SpeechEvaluationModal } from './SpeechEvaluationModal';
import { AsyncChallengeModal } from './AsyncChallengeModal';
import { useRetentionStore } from '../services/useRetentionStore';
import { RankBadge, TrophyBadge } from './ui/RankBadge';
import { Button } from './ui/Button';
import { SkillDomainCard, SkillBadgeTier } from './ui/SkillDomainCard';
import { SkillRadarChart } from './ui/SkillRadarChart';
import { DailyBalancedQuestCard } from './ui/DailyBalancedQuestCard';
import { SkillDomainHubHeader, DifficultyFilter } from './ui/SkillDomainHubHeader';
import { GameCardItem } from './ui/GameCardItem';
import { skillService } from '../services/skillService';
import { soundManager } from '../utils/sound';

interface LobbyProps {
  topics: TopicDto[];
  myRank: UserRankProfileDto | null;
  onStartGame: (gameType: GameType, topicId: string, difficulty: DifficultyLevel) => void;
  onStart1v1Battle: (topicId?: string) => void;
  onOpenBattleLeaderboard: () => void;
  onPlayTidGame: (gameCode: string) => void;
  onRefreshProfile?: () => void;
  isLoading: boolean;
}

// Fallback initial 4-skills data matching specification
const defaultSkillsData: SkillsOverviewResponse = {
  skills: [
    {
      code: 'LISTENING',
      nameVi: 'Kỹ Năng Nghe',
      nameEn: 'Listening Academy',
      description: 'Rèn luyện khả năng nhận diện âm thanh bản xứ, chép chính tả và phản xạ nghe hiểu tức thì.',
      iconName: 'Headphones',
      themeColor: 'sky-500',
      displayOrder: 1,
      masteryScore: 85.0,
      totalXp: 1250,
      gamesPlayed: 42,
      perfectGames: 12,
      badgeTier: 'Gold',
      badgeLevel: 'Master Decoder',
      games: [
        { id: '1', skillDomainCode: 'LISTENING', gameTypeCode: 'AUDIO_BLITZ', displayTitle: 'Audio Blitz (Nghe & Điền Chính Tả)', difficultyTier: 'A1_A2', isPrimary: true, displayOrder: 1 },
        { id: '2', skillDomainCode: 'LISTENING', gameTypeCode: 'DICTATION_DASH', displayTitle: 'Dictation Dash (Chép Chính Tả Biểu Mẫu)', difficultyTier: 'B1_B2', isPrimary: true, displayOrder: 2 },
        { id: '3', skillDomainCode: 'LISTENING', gameTypeCode: 'SPEED_AUDIO_MATCH', displayTitle: 'Speed Audio Match (Phản Xạ Âm Thanh Siêu Tốc)', difficultyTier: 'A1_A2', isPrimary: false, displayOrder: 3 },
        { id: '4', skillDomainCode: 'LISTENING', gameTypeCode: 'SHADOWING_BEAT', displayTitle: 'Shadowing Beat (Luyện Nhại Giọng Ngắt Nhịp)', difficultyTier: 'IELTS_ADVANCED', isPrimary: false, displayOrder: 4 },
      ]
    },
    {
      code: 'READING',
      nameVi: 'Kỹ Năng Đọc',
      nameEn: 'Reading Academy',
      description: 'Mở rộng vốn từ vựng theo ngữ cảnh, đọc lướt nắm keyword và phản xạ nhận diện nghĩa.',
      iconName: 'BookOpen',
      themeColor: 'emerald-500',
      displayOrder: 2,
      masteryScore: 80.0,
      totalXp: 1100,
      gamesPlayed: 38,
      perfectGames: 9,
      badgeTier: 'Gold',
      badgeLevel: 'Critical Reader',
      games: [
        { id: '5', skillDomainCode: 'READING', gameTypeCode: 'WORD_MATCH', displayTitle: 'Word Match (Ghép Thẻ Từ Vựng & Nghĩa)', difficultyTier: 'A1_A2', isPrimary: true, displayOrder: 1 },
        { id: '6', skillDomainCode: 'READING', gameTypeCode: 'FALLING_WORDS', displayTitle: 'Speed Falling Word (Từ Rơi Tốc Độ Cao)', difficultyTier: 'B1_B2', isPrimary: true, displayOrder: 2 },
        { id: '7', skillDomainCode: 'READING', gameTypeCode: 'CLOZE_MASTER', displayTitle: 'Cloze Master (Điền Từ Ngữ Cảnh & Collocation)', difficultyTier: 'B1_B2', isPrimary: true, displayOrder: 3 },
        { id: '8', skillDomainCode: 'READING', gameTypeCode: 'SKIM_SCAN_SPRINT', displayTitle: 'Skim & Scan Sprint (Đọc Lướt Bắt Chi Tiết)', difficultyTier: 'IELTS_ADVANCED', isPrimary: false, displayOrder: 4 },
      ]
    },
    {
      code: 'WRITING',
      nameVi: 'Kỹ Năng Viết',
      nameEn: 'Writing Academy',
      description: 'Làm chủ cú pháp câu, cụm từ học thuật Collocations và thám tử sửa lỗi ngữ pháp.',
      iconName: 'PenTool',
      themeColor: 'amber-500',
      displayOrder: 3,
      masteryScore: 70.0,
      totalXp: 850,
      gamesPlayed: 25,
      perfectGames: 6,
      badgeTier: 'Silver',
      badgeLevel: 'Clause Architect',
      games: [
        { id: '9', skillDomainCode: 'WRITING', gameTypeCode: 'SENTENCE_SCRAMBLE', displayTitle: 'Sentence Scramble (Sắp Xếp Trật Tự Câu)', difficultyTier: 'A1_A2', isPrimary: true, displayOrder: 1 },
        { id: '10', skillDomainCode: 'WRITING', gameTypeCode: 'GRAMMAR_DETECTIVE', displayTitle: 'Grammar Detective (Thám Tử Bắt Lỗi Ngữ Pháp)', difficultyTier: 'B1_B2', isPrimary: true, displayOrder: 2 },
        { id: '11', skillDomainCode: 'WRITING', gameTypeCode: 'COLLOCATION_CHAIN', displayTitle: 'Collocation Chain (Chuỗi Cụm Từ Cố Định)', difficultyTier: 'IELTS_ADVANCED', isPrimary: false, displayOrder: 3 },
        { id: '12', skillDomainCode: 'WRITING', gameTypeCode: 'PARAPHRASE_RUSH', displayTitle: 'Paraphrase Rush (Viết Lại Câu Học Thuật)', difficultyTier: 'IELTS_ADVANCED', isPrimary: false, displayOrder: 4 },
      ]
    },
    {
      code: 'SPEAKING',
      nameVi: 'Kỹ Năng Nói',
      nameEn: 'Speaking Academy',
      description: 'Chuẩn hóa phát âm âm vị, đánh bắt trọng âm và luyện nhại giọng ngữ điệu tự nhiên.',
      iconName: 'Mic',
      themeColor: 'rose-500',
      displayOrder: 4,
      masteryScore: 45.0,
      totalXp: 320,
      gamesPlayed: 12,
      perfectGames: 2,
      badgeTier: 'Bronze',
      badgeLevel: 'Echo Apprentice',
      games: [
        { id: '13', skillDomainCode: 'SPEAKING', gameTypeCode: 'MINIMAL_PAIRS', displayTitle: 'Minimal Pairs Duel (Đấu Sĩ Phân Biệt Cặp Âm)', difficultyTier: 'A1_A2', isPrimary: true, displayOrder: 1 },
        { id: '14', skillDomainCode: 'SPEAKING', gameTypeCode: 'STRESS_HUNTER', displayTitle: 'Word Stress Hunter (Săn Trọng Âm Từ Vựng)', difficultyTier: 'B1_B2', isPrimary: true, displayOrder: 2 },
        { id: '15', skillDomainCode: 'SPEAKING', gameTypeCode: 'INTONATION_CURVE', displayTitle: 'Intonation Curve (Đường Cong Ngữ Điệu Câu)', difficultyTier: 'B1_B2', isPrimary: false, displayOrder: 3 },
        { id: '16', skillDomainCode: 'SPEAKING', gameTypeCode: 'FLUENCY_SPRINT', displayTitle: '45-Sec Fluency Sprint (Phản Xạ Nói Tự Nhiên)', difficultyTier: 'IELTS_ADVANCED', isPrimary: false, displayOrder: 4 },
      ]
    }
  ],
  radar: {
    listening: 85.0,
    reading: 80.0,
    writing: 70.0,
    speaking: 45.0,
    weakestSkill: 'SPEAKING',
    strongestSkill: 'LISTENING',
    recommendedGameCode: 'MINIMAL_PAIRS',
    recommendedGameTitle: 'Minimal Pairs Duel (Đấu Sĩ Phân Biệt Cặp Âm)'
  }
};

// Rich pedagogical game definitions for the Skill Domain Hub view
interface GameMetadata {
  code: string;
  title: string;
  description: string;
  pedagogicalFocus: string;
  difficultyTier: 'A1_A2' | 'B1_B2' | 'IELTS_ADVANCED';
  difficultyStars: number;
  timeEstimate: string;
  isHot?: boolean;
  isNew?: boolean;
  isTidInspired?: boolean;
}

const allGamesMetadata: Record<string, GameMetadata> = {
  // Listening
  AUDIO_BLITZ: {
    code: 'AUDIO_BLITZ',
    title: '1. Audio Blitz (Nghe & Điền Chính Tả)',
    description: 'Lắng nghe phát âm native chuẩn US/UK, quan sát phiên âm IPA và gõ/chạm đúng chính tả từ vựng.',
    pedagogicalFocus: 'Nhận diện âm vị, chính tả từ khó (Spelling accuracy)',
    difficultyTier: 'A1_A2',
    difficultyStars: 2,
    timeEstimate: '15s / từ',
    isHot: true
  },
  DICTATION_DASH: {
    code: 'DICTATION_DASH',
    title: '2. Dictation Dash (Chép Chính Tả Biểu Mẫu)',
    description: 'Nghe đoạn audio ngắn, bắt thông tin then chốt: Số điện thoại, ngày tháng, tên riêng, giá tiền.',
    pedagogicalFocus: 'Bắt keyword trong ngữ cảnh thực tế (IELTS Listening Section 1)',
    difficultyTier: 'B1_B2',
    difficultyStars: 3,
    timeEstimate: '45s / biểu mẫu',
    isTidInspired: true,
    isNew: true
  },
  SPEED_AUDIO_MATCH: {
    code: 'SPEED_AUDIO_MATCH',
    title: '3. Speed Audio Match (Phản Xạ Âm Thanh Siêu Tốc)',
    description: 'Nghe 1 từ/cụm từ trong 5 giây và chọn nhanh hình ảnh hoặc nghĩa tiếng Việt tương ứng.',
    pedagogicalFocus: 'Phản xạ âm thanh trực tiếp không qua dịch nhẩm (Audio Reflex)',
    difficultyTier: 'A1_A2',
    difficultyStars: 1,
    timeEstimate: '5s / từ',
    isNew: true
  },
  SHADOWING_BEAT: {
    code: 'SHADOWING_BEAT',
    title: '4. Shadowing Beat (Luyện Nhại Giọng Ngắt Nhịp)',
    description: 'Lắng nghe câu ngắn có ngữ điệu bản xứ và nhại lại theo sóng âm thanh nhịp điệu.',
    pedagogicalFocus: 'Nối âm, nuốt âm, nhịp điệu phát âm tự nhiên (Shadowing Technique)',
    difficultyTier: 'IELTS_ADVANCED',
    difficultyStars: 3,
    timeEstimate: '20s / câu',
    isTidInspired: true,
    isNew: true
  },

  // Reading
  WORD_MATCH: {
    code: 'WORD_MATCH',
    title: '1. Word Match (Ghép Thẻ Từ Vựng & Nghĩa)',
    description: 'Lật và ghép các cặp thẻ Tiếng Anh - Tiếng Việt tương ứng. Nhận thêm +2s và combo x2.0.',
    pedagogicalFocus: 'Nhận diện mặt chữ & nghĩa ngữ cảnh (Vocabulary Retention)',
    difficultyTier: 'A1_A2',
    difficultyStars: 1,
    timeEstimate: '60s / ván',
    isHot: true
  },
  FALLING_WORDS: {
    code: 'FALLING_WORDS',
    title: '2. Speed Falling Word (Từ Rơi Tốc Độ Cao)',
    description: 'Từ vựng rơi từ trên xuống! Chọn nghĩa đúng từ 4 đáp án trước khi chạm đáy với 3 mạng sống.',
    pedagogicalFocus: 'Phản xạ nghĩa từ dưới áp lực thời gian (Time Pressure Reflex)',
    difficultyTier: 'B1_B2',
    difficultyStars: 2,
    timeEstimate: '90s / ván',
    isHot: true
  },
  CLOZE_MASTER: {
    code: 'CLOZE_MASTER',
    title: '3. Cloze Master (Điền Từ Ngữ Cảnh & Collocation)',
    description: 'Đọc đoạn câu ngữ cảnh thực tế và chọn 1 trong 4 đáp án thông minh kèm Mini Grammar Bite.',
    pedagogicalFocus: 'Điền từ vào ngữ cảnh câu & Collocation chuẩn học thuật',
    difficultyTier: 'B1_B2',
    difficultyStars: 2,
    timeEstimate: '20s / câu',
    isNew: true
  },
  SKIM_SCAN_SPRINT: {
    code: 'SKIM_SCAN_SPRINT',
    title: '4. Skim & Scan Sprint (Đọc Lướt Bắt Chi Tiết)',
    description: 'Đọc Micro-Passage 50-70 từ và chọn True / False / Not Given dưới áp lực 30 giây.',
    pedagogicalFocus: 'Kỹ thuật Skimming & Scanning bắt keyword (IELTS Reading)',
    difficultyTier: 'IELTS_ADVANCED',
    difficultyStars: 3,
    timeEstimate: '30s / đoạn',
    isTidInspired: true,
    isNew: true
  },

  // Writing
  SENTENCE_SCRAMBLE: {
    code: 'SENTENCE_SCRAMBLE',
    title: '1. Sentence Scramble (Sắp Xếp Trật Tự Câu)',
    description: 'Đọc nghĩa câu tiếng Việt và sắp xếp các thẻ từ xáo trộn thành câu tiếng Anh hoàn chỉnh.',
    pedagogicalFocus: 'Cú pháp câu, vị trí trạng từ & cấu trúc mệnh đề',
    difficultyTier: 'A1_A2',
    difficultyStars: 1,
    timeEstimate: '120s / ván',
    isHot: true
  },
  GRAMMAR_DETECTIVE: {
    code: 'GRAMMAR_DETECTIVE',
    title: '2. Grammar Detective (Thám Tử Bắt Lỗi Ngữ Pháp)',
    description: 'Nhập vai thám tử soi hồ sơ vụ án: Chạm đúng từ bị sai ngữ pháp và chọn phương án sửa chính xác.',
    pedagogicalFocus: 'Bắt lỗi ngữ pháp: thì, mạo từ, chủ vị, giới từ',
    difficultyTier: 'B1_B2',
    difficultyStars: 2,
    timeEstimate: '60s / vụ án',
    isNew: true
  },
  COLLOCATION_CHAIN: {
    code: 'COLLOCATION_CHAIN',
    title: '3. Collocation Chain (Chuỗi Cụm Từ Cố Định)',
    description: 'Từ gốc ở trung tâm và 4 vệ tinh quay quanh. Chọn động từ/tính từ chuẩn học thuật C1/C2.',
    pedagogicalFocus: 'Nối cụm từ cố định tự nhiên (Academic Collocations)',
    difficultyTier: 'IELTS_ADVANCED',
    difficultyStars: 3,
    timeEstimate: '15s / cụm',
    isTidInspired: true,
    isNew: true
  },
  PARAPHRASE_RUSH: {
    code: 'PARAPHRASE_RUSH',
    title: '4. Paraphrase Rush (Viết Lại Câu Học Thuật)',
    description: 'Lựa chọn cách viết lại câu phong phú sử dụng từ đồng nghĩa và cấu trúc câu đảo ngữ nâng cao.',
    pedagogicalFocus: 'Kỹ năng paraphrase câu văn học thuật đa dạng',
    difficultyTier: 'IELTS_ADVANCED',
    difficultyStars: 3,
    timeEstimate: '30s / câu',
    isTidInspired: true,
    isNew: true
  },

  // Speaking
  MINIMAL_PAIRS: {
    code: 'MINIMAL_PAIRS',
    title: '1. Minimal Pairs Duel (Đấu Sĩ Phân Biệt Cặp Âm)',
    description: 'Lắng nghe âm thanh từ vựng bí mật và bấm chọn thẻ từ đúng giữa 2 cặp âm tương đồng.',
    pedagogicalFocus: 'Phân biệt cặp âm dễ nhầm (/iː/-/ɪ/, /l/-/r/, /θ/-/s/)',
    difficultyTier: 'A1_A2',
    difficultyStars: 1,
    timeEstimate: '8s / từ',
    isTidInspired: true,
    isHot: true,
    isNew: true
  },
  STRESS_HUNTER: {
    code: 'STRESS_HUNTER',
    title: '2. Word Stress Hunter (Săn Trọng Âm Từ Vựng)',
    description: 'Xác định trọng âm chính của từ vựng từ 2 đến 4 âm tiết dưới áp lực thời gian.',
    pedagogicalFocus: 'Quy tắc đánh trọng âm danh từ, động từ và từ có hậu tố',
    difficultyTier: 'B1_B2',
    difficultyStars: 2,
    timeEstimate: '12s / từ',
    isNew: true
  },
  INTONATION_CURVE: {
    code: 'INTONATION_CURVE',
    title: '3. Intonation Curve (Đường Cong Ngữ Điệu Câu)',
    description: 'Nhận diện ngữ điệu Lên (Rising) hay Xuống (Falling) của câu hỏi và câu trần thuật.',
    pedagogicalFocus: 'Ngữ điệu tự nhiên trong giao tiếp bản ngữ',
    difficultyTier: 'B1_B2',
    difficultyStars: 2,
    timeEstimate: '15s / câu',
    isNew: true
  },
  FLUENCY_SPRINT: {
    code: 'FLUENCY_SPRINT',
    title: '4. 45-Sec Fluency Sprint (Phản Xạ Nói Tự Nhiên)',
    description: 'Phản xạ trả lời chủ đề câu hỏi IELTS Speaking Part 1 trong 45 giây có dàn ý gợi ý.',
    pedagogicalFocus: 'Tốc độ phản xạ và mạch lạc trong diễn đạt (Fluency & Coherence)',
    difficultyTier: 'IELTS_ADVANCED',
    difficultyStars: 3,
    timeEstimate: '45s / chủ đề',
    isTidInspired: true,
    isNew: true
  }
};

export const Lobby: React.FC<LobbyProps> = ({ 
  topics, 
  myRank,
  onStartGame, 
  onStart1v1Battle,
  onOpenBattleLeaderboard,
  onPlayTidGame,
  onRefreshProfile,
  isLoading 
}) => {
  const [selectedSkillDomain, setSelectedSkillDomain] = useState<SkillDomainCode | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL');

  // Backend state
  const [skillsOverview, setSkillsOverview] = useState<SkillsOverviewResponse>(defaultSkillsData);
  const [dailyStatus, setDailyStatus] = useState<DailyBalancedStatusDto>({
    practiceDate: new Date().toISOString().split('T')[0],
    completedListening: false,
    completedReading: false,
    completedWriting: false,
    completedSpeaking: false,
    completedCount: 0,
    allCompleted: false,
    bonusClaimed: false,
    rewardCoins: 50,
    rewardXp: 100
  });
  const [recommended, setRecommended] = useState<RecommendedSkillDto | null>(null);
  const [isClaimingBonus, setIsClaimingBonus] = useState<boolean>(false);
  const [bonusClaimNotification, setBonusClaimNotification] = useState<string | null>(null);

  // Retention subsystem modals state
  const [isClinicOpen, setIsClinicOpen] = useState<boolean>(false);
  const [isLeagueOpen, setIsLeagueOpen] = useState<boolean>(false);
  const [isSquadOpen, setIsSquadOpen] = useState<boolean>(false);
  const [isSpeechOpen, setIsSpeechOpen] = useState<boolean>(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState<boolean>(false);
  const [challengeToken, setChallengeToken] = useState<string | undefined>(undefined);

  const { mistakesSummary, loadMistakesSummary } = useRetentionStore();

  useEffect(() => {
    loadMistakesSummary();
    const params = new URLSearchParams(window.location.search);
    const cToken = params.get('challenge');
    if (cToken) {
      setChallengeToken(cToken);
      setIsChallengeOpen(true);
    }
  }, [loadMistakesSummary]);

  // Fetch 4-skills data on mount
  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        const [overview, daily, rec] = await Promise.all([
          skillService.getSkills().catch(() => defaultSkillsData),
          skillService.getDailyStatus().catch(() => null),
          skillService.getRecommended().catch(() => null)
        ]);

        if (overview) setSkillsOverview(overview);
        if (daily) setDailyStatus(daily);
        if (rec) setRecommended(rec);
      } catch (err) {
        console.warn('Using default 4-skills configuration:', err);
      }
    };

    fetchSkillsData();
  }, []);

  // Compute completed skills list for daily quest
  const completedSkillsList: SkillDomainCode[] = [];
  if (dailyStatus.completedListening) completedSkillsList.push('LISTENING');
  if (dailyStatus.completedReading) completedSkillsList.push('READING');
  if (dailyStatus.completedWriting) completedSkillsList.push('WRITING');
  if (dailyStatus.completedSpeaking) completedSkillsList.push('SPEAKING');

  // Claim Balanced Bonus Handler
  const handleClaimBalancedBonus = async () => {
    if (isClaimingBonus || dailyStatus.bonusClaimed) return;
    setIsClaimingBonus(true);
    try {
      const res = await skillService.claimBalancedBonus();
      setDailyStatus((prev) => ({
        ...prev,
        bonusClaimed: true
      }));

      soundManager.playSuccess();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      setBonusClaimNotification(res.message);

      if (onRefreshProfile) {
        onRefreshProfile();
      }
    } catch (err: any) {
      alert(err.message || 'Không thể nhận phần thưởng.');
    } finally {
      setIsClaimingBonus(false);
    }
  };

  // Launch a game from Skill Domain Hub
  const handleLaunchGame = (gameCode: string, mode: 'practice' | 'ranked') => {
    const defaultTopicId = topics[0]?.id || 'e4a2d810-75b2-4d2c-9821-2a62d49c0012';
    const difficulty: DifficultyLevel = mode === 'ranked' ? 'Hard' : 'Medium';

    const normalized = gameCode.toUpperCase().replace(/-/g, '_');
    switch (normalized) {
      case 'WORD_MATCH':
      case 'WORDMATCH':
        onStartGame('WordMatch', defaultTopicId, difficulty);
        break;
      case 'FALLING_WORDS':
      case 'SPEED_FALLING':
      case 'SPEEDFALLING':
        onStartGame('SpeedFalling', defaultTopicId, difficulty);
        break;
      case 'SENTENCE_SCRAMBLE':
      case 'SENTENCESCRAMBLE':
        onStartGame('SentenceScramble', defaultTopicId, difficulty);
        break;
      case 'AUDIO_BLITZ':
      case 'AUDIOBLITZ':
        onStartGame('AudioBlitz', defaultTopicId, difficulty);
        break;
      case 'CLOZE_MASTER':
      case 'CLOZEMASTER':
        onStartGame('ClozeMaster', defaultTopicId, difficulty);
        break;
      case 'GRAMMAR_DETECTIVE':
      case 'GRAMMARDETECTIVE':
        onStartGame('GrammarDetective', defaultTopicId, difficulty);
        break;
      case 'DICTATION_DASH':
      case 'SKIM_SCAN_SPRINT':
      case 'COLLOCATION_CHAIN':
      case 'MINIMAL_PAIRS':
        onPlayTidGame(normalized);
        break;
      default:
        // Fallback for new games
        if (normalized.includes('AUDIO') || normalized.includes('SHADOW')) {
          onStartGame('AudioBlitz', defaultTopicId, difficulty);
        } else if (normalized.includes('STRESS') || normalized.includes('INTONATION') || normalized.includes('FLUENCY')) {
          onPlayTidGame('MINIMAL_PAIRS');
        } else if (normalized.includes('PARAPHRASE') || normalized.includes('COLLOCATION')) {
          onPlayTidGame('COLLOCATION_CHAIN');
        } else {
          onStartGame('WordMatch', defaultTopicId, difficulty);
        }
        break;
    }
  };

  // Current domain details if selected
  const activeDomain = selectedSkillDomain 
    ? skillsOverview.skills.find(s => s.code === selectedSkillDomain) || skillsOverview.skills[0]
    : null;

  // Filter games inside Skill Domain Hub View
  const filteredGames = activeDomain ? activeDomain.games.filter(g => {
    if (difficultyFilter === 'ALL') return true;
    return g.difficultyTier === difficultyFilter;
  }) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Bonus Claim Success Alert Modal / Notification */}
      {bonusClaimNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border-2 border-emerald-500 shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Thưởng Cân Bằng 4 Kỹ Năng!</h4>
            <p className="text-xs text-slate-300">{bonusClaimNotification}</p>
          </div>
          <button
            onClick={() => setBonusClaimNotification(null)}
            className="ml-2 text-slate-400 hover:text-white text-xs font-bold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 1: 4-SKILLS LEARNING HUB GATEWAY (Trang Chủ Cổng 4 Kỹ Năng)     */}
      {/* =================================================================== */}
      {!selectedSkillDomain ? (
        <div className="space-y-10">
          {/* Hero Welcome & Quick 1v1 Battle Access Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Cổng Học Tập Chuẩn Quốc Tế & Đấu Trường Realtime
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Cổng Học Tập <span className="bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">4 Kỹ Năng</span> Toàn Diện
                </h1>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">
                  Luyện tập đồng đều <strong>Nghe - Nói - Đọc - Viết</strong> chuẩn quốc tế (TID Inspired) kết hợp đấu trường 1v1 gay cấn để nâng cao phản xạ tiếng Anh tự nhiên mỗi ngày.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button
                    variant="gold"
                    size="md"
                    onClick={() => onStart1v1Battle()}
                    leftIcon={<Swords className="w-4 h-4" />}
                  >
                    Tìm Trận Đấu 1v1
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={onOpenBattleLeaderboard}
                    leftIcon={<Trophy className="w-4 h-4 text-yellow-400" />}
                  >
                    Bảng Xếp Hạng Đấu Thủ
                  </Button>
                </div>
              </div>

              {/* User Rank Card Profile */}
              {myRank && (
                <div className="w-full md:w-64 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-4 shadow-xl flex flex-col items-center text-center shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Chiến Binh Xếp Hạng
                  </span>

                  <RankBadge
                    tier={(myRank.tier as RankTier) || 'Bronze'}
                    division={(myRank.division as RankDivision) || 'III'}
                    size="md"
                  />

                  <div className="mt-2">
                    <TrophyBadge trophy={myRank.trophy} size="sm" />
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="bg-slate-800/60 rounded-xl p-1.5">
                      <span className="text-slate-400 block text-[10px]">Tỷ lệ thắng</span>
                      <span className="font-black text-emerald-400 font-mono text-xs">
                        {myRank.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-1.5">
                      <span className="text-slate-400 block text-[10px]">Chuỗi thắng</span>
                      <span className="font-black text-orange-400 font-mono text-xs flex items-center justify-center gap-1">
                        <Flame className="w-3 h-3 fill-orange-400" />
                        {myRank.winStreak}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Habit & Chests Widget */}
          <DailyHabitWidget />

          {/* Retention & Gamification Quick Hub */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setIsClinicOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 fill-emerald-500/20" />
                </div>
                {(mistakesSummary?.totalDueToday ?? 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                    {mistakesSummary?.totalDueToday} từ
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white text-sm">Phòng Khám Lỗi Sai</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">SM-2 Spaced Repetition</p>
            </button>

            <button
              onClick={() => setIsLeagueOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  30 Người
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Giải Đấu Tuần</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Đua top thăng hạng</p>
            </button>

            <button
              onClick={() => setIsSquadOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  5,000 XP
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Biệt Đội Học Tập</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Rương báu đồng đội</p>
            </button>

            <button
              onClick={() => setIsSpeechOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-b from-teal-950/40 to-slate-900 border border-teal-500/30 hover:border-teal-500/60 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                  AI Coach
                </span>
              </div>
              <h4 className="font-bold text-white text-sm">Luyện Nói & Âm Vị</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Phoneme Heatmap</p>
            </button>
          </div>

          {/* Top Row: Skill Radar Chart + Daily Balanced Quest Card */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* 1. Skill Radar Chart Matrix */}
            <SkillRadarChart
              scores={{
                listening: Number(skillsOverview.radar.listening),
                reading: Number(skillsOverview.radar.reading),
                writing: Number(skillsOverview.radar.writing),
                speaking: Number(skillsOverview.radar.speaking),
              }}
              onSelectSkill={(code) => setSelectedSkillDomain(code)}
              onSmartPickClick={(code) => setSelectedSkillDomain(code)}
            />

            {/* 2. Daily Balanced Quest Card */}
            <DailyBalancedQuestCard
              completedSkills={completedSkillsList}
              rewardClaimed={dailyStatus.bonusClaimed}
              bonusCoins={50}
              bonusXp={100}
              onClaimBonus={handleClaimBalancedBonus}
              onSelectSkill={(code) => setSelectedSkillDomain(code)}
              onSmartPick={() => {
                const weakest = (recommended?.skillDomainCode || skillsOverview.radar.weakestSkill) as SkillDomainCode;
                setSelectedSkillDomain(weakest);
              }}
            />
          </section>

          {/* Academy Domain Selection Section */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 text-sm flex items-center justify-center font-black">
                    🎓
                  </span>
                  Chọn Học Viện Kỹ Năng Để Bắt Đầu
                </h2>
                <p className="text-xs text-slate-400">
                  Mỗi kỹ năng sở hữu kho bài tập mini-game chuyên sâu theo phương pháp sư phạm TID
                </p>
              </div>

              {recommended && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Gợi ý: {recommended.reason}
                </div>
              )}
            </div>

            {/* 4 Skill Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillsOverview.skills.map((domain) => {
                const isSmartPick = domain.code === (recommended?.skillDomainCode || skillsOverview.radar.weakestSkill);
                const isCompletedToday = completedSkillsList.includes(domain.code as SkillDomainCode);

                const featuredPreviews = domain.games.slice(0, 3).map((g) => ({
                  code: g.gameTypeCode,
                  name: g.displayTitle.split('(')[0].trim(),
                  isHot: g.gameTypeCode === 'AUDIO_BLITZ' || g.gameTypeCode === 'WORD_MATCH' || g.gameTypeCode === 'SENTENCE_SCRAMBLE' || g.gameTypeCode === 'MINIMAL_PAIRS',
                  isNew: g.gameTypeCode === 'DICTATION_DASH' || g.gameTypeCode === 'SKIM_SCAN_SPRINT' || g.gameTypeCode === 'COLLOCATION_CHAIN'
                }));

                return (
                  <SkillDomainCard
                    key={domain.code}
                    code={domain.code as SkillDomainCode}
                    titleVi={domain.nameVi}
                    titleEn={domain.nameEn}
                    description={domain.description || ''}
                    masteryPercentage={Number(domain.masteryScore)}
                    tierTitle={domain.badgeLevel}
                    badgeTier={domain.badgeTier.toLowerCase() as SkillBadgeTier}
                    gameCount={domain.games.length}
                    featuredGames={featuredPreviews}
                    isCompletedToday={isCompletedToday}
                    isSmartPick={isSmartPick}
                    onExplore={(code) => setSelectedSkillDomain(code)}
                    onQuickPlay={(gameCode) => {
                      if (gameCode) {
                        handleLaunchGame(gameCode, 'practice');
                      } else {
                        setSelectedSkillDomain(domain.code as SkillDomainCode);
                      }
                    }}
                  />
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        /* =================================================================== */
        /* VIEW 2: SKILL DOMAIN HUB VIEW (Chi Tiết Học Viện Kỹ Năng Đã Chọn)   */
        /* =================================================================== */
        activeDomain && (
          <div className="space-y-8 animate-fade-in">
            {/* Hub Header with Navigation, Progress & Difficulty Filter */}
            <SkillDomainHubHeader
              domain={selectedSkillDomain}
              titleVi={activeDomain.nameVi}
              titleEn={activeDomain.nameEn}
              description={activeDomain.description || ''}
              masteryPercentage={Number(activeDomain.masteryScore)}
              tierTitle={activeDomain.badgeLevel}
              selectedDifficulty={difficultyFilter}
              onDifficultyChange={setDifficultyFilter}
              onBack={() => setSelectedSkillDomain(null)}
            />

            {/* List of Game Cards for this Skill Domain */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Kho Mini-Game Trực Thuộc ({filteredGames.length} Trò Chơi)</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Chọn chế độ <strong>Luyện Tập</strong> để học kỹ hoặc <strong>Đua Rank</strong> để thử thách tốc độ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGames.map((game) => {
                  const meta = allGamesMetadata[game.gameTypeCode] || {
                    code: game.gameTypeCode,
                    title: game.displayTitle,
                    description: 'Trò chơi rèn luyện phản xạ và củng cố kiến thức ngôn ngữ.',
                    pedagogicalFocus: 'Kỹ năng ngôn ngữ thực hành',
                    difficultyTier: game.difficultyTier,
                    difficultyStars: 2,
                    timeEstimate: '30s / câu'
                  };

                  return (
                    <GameCardItem
                      key={game.id}
                      code={game.gameTypeCode}
                      title={meta.title}
                      description={meta.description}
                      pedagogicalFocus={meta.pedagogicalFocus}
                      difficultyTier={meta.difficultyTier}
                      difficultyStars={meta.difficultyStars}
                      timeEstimate={meta.timeEstimate}
                      isHot={meta.isHot}
                      isNew={meta.isNew}
                      isTidInspired={meta.isTidInspired}
                      onPlayPractice={(code) => handleLaunchGame(code, 'practice')}
                      onPlayRanked={(code) => handleLaunchGame(code, 'ranked')}
                    />
                  );
                })}
              </div>

              {filteredGames.length === 0 && (
                <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <p className="text-slate-400 text-sm">
                    Không có mini-game nào ở cấp độ này trong kỹ năng {activeDomain.nameVi}.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setDifficultyFilter('ALL')}>
                    Xem tất cả cấp độ
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Retention & Gamification Subsystem Modals */}
      {isClinicOpen && (
        <WeaknessClinicModal
          onClose={() => setIsClinicOpen(false)}
          onFinishedSession={onRefreshProfile}
        />
      )}

      {isLeagueOpen && (
        <WeeklyLeagueModal
          onClose={() => setIsLeagueOpen(false)}
        />
      )}

      {isSquadOpen && (
        <StudySquadModal
          onClose={() => setIsSquadOpen(false)}
        />
      )}

      {isSpeechOpen && (
        <SpeechEvaluationModal
          onClose={() => setIsSpeechOpen(false)}
        />
      )}

      {isChallengeOpen && (
        <AsyncChallengeModal
          initialToken={challengeToken}
          onClose={() => {
            setIsChallengeOpen(false);
            setChallengeToken(undefined);
          }}
        />
      )}
    </div>
  );
};

export type GameType = 
  | 'WordMatch' 
  | 'SpeedFalling' 
  | 'SentenceScramble' 
  | 'AudioBlitz' 
  | 'ClozeMaster' 
  | 'GrammarDetective';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface UserSummaryDto {
  id: string;
  username: string;
  displayName: string;
  isGuest: boolean;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
}

export interface GuestAuthResponse {
  token: string;
  expiresAt: string;
  user: UserSummaryDto;
}

export interface UserProfileDto {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalXp: number;
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  currentStreak: number;
  highestStreak: number;
  streakFreezeCount: number;
  dailyXpEarned: number;
  dailyXpCap: number;
}

export interface TopicDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName: string;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  wordCount: number;
  sentenceCount: number;
}

// Word Match
export interface WordMatchCard {
  id: string;
  pairId: string;
  type: 'EN' | 'VI';
  content: string;
  subContent?: string;
}

export interface WordMatchInitResponse {
  sessionId: string;
  gameType: 'WordMatch';
  timeLimitSeconds: number;
  cards: WordMatchCard[];
}

// Speed Falling
export interface SpeedFallingWordItem {
  wordId: string;
  term: string;
  phonetic?: string;
  correctDefinitionVi: string;
  options: string[];
  baseFallDurationMs: number;
}

export interface SpeedFallingInitResponse {
  sessionId: string;
  gameType: 'SpeedFalling';
  initialLives: number;
  words: SpeedFallingWordItem[];
}

// Sentence Scramble
export interface TokenChip {
  id: string;
  word: string;
}

export interface SentenceScrambleItem {
  sentenceId: string;
  vietnameseTranslation: string;
  shuffledTokens: TokenChip[];
  correctOrderTokens: string[];
  hintText?: string;
}

export interface SentenceScrambleInitResponse {
  sessionId: string;
  gameType: 'SentenceScramble';
  totalTimeLimitSeconds: number;
  sentences: SentenceScrambleItem[];
}

// 4. Audio Blitz DTOs
export interface AudioBlitzItemDto {
  questionId: string;
  audioUrl: string;
  slowAudioUrl?: string;
  phonetic: string;
  partOfSpeech: string;
  definitionVi: string;
  contextSentence: string;
  targetWordLength: number;
  letterBank: string[];
  timeLimitSeconds: number;
}

export interface AudioBlitzInitResponse {
  sessionId: string;
  gameType: 'AudioBlitz';
  initialLives: number;
  items: AudioBlitzItemDto[];
}

// 5. Cloze Master DTOs
export interface ClozeOptionDto {
  id: string; // 'A', 'B', 'C', 'D'
  word: string;
  definitionVi: string;
}

export interface ClozeQuestionDto {
  questionId: string;
  contextSentence: string;
  sentenceTranslationVi: string;
  partOfSpeechHint: string;
  options: ClozeOptionDto[];
  explanationText: string;
}

export interface ClozeMasterInitResponse {
  sessionId: string;
  gameType: 'ClozeMaster';
  timePerQuestionSeconds: number;
  totalQuestions: number;
  questions: ClozeQuestionDto[];
}

// 6. Grammar Detective DTOs
export interface GrammarTokenDto {
  index: number;
  text: string;
}

export interface GrammarDetectiveCaseDto {
  caseId: string;
  caseTitle: string;
  rawSentence: string;
  tokens: GrammarTokenDto[];
  errorTokenIndex: number;
  errorTokenText: string;
  correctionOptions: string[];
  correctReplacement: string;
  grammarRuleExplanation: string;
}

export interface GrammarDetectiveInitResponse {
  sessionId: string;
  gameType: 'GrammarDetective';
  initialMagnifiers: number;
  timePerCaseSeconds: number;
  totalCases: number;
  cases: GrammarDetectiveCaseDto[];
}

// Completion
export interface CompleteSessionRequest {
  sessionId: string;
  score: number;
  durationSeconds: number;
  totalAttempts: number;
  correctAnswers: number;
  maxCombo: number;
  status: string;
}

export interface UnlockedBadge {
  badgeCode: string;
  badgeName: string;
  description: string;
  iconUrl: string;
}

export interface CompleteSessionResponse {
  sessionId: string;
  score: number;
  xpEarned: number;
  accuracyRate: number;
  isNewLevel: boolean;
  newLevel?: number;
  totalXp: number;
  currentStreak: number;
  streakIncrementedToday: boolean;
  unlockedBadges: UnlockedBadge[];
}

// Leaderboard
export interface LeaderboardRankDto {
  rank: number;
  displayName: string;
  weeklyXp: number;
  currentLevel: number;
  avatarUrl?: string;
}

export interface LeaderboardResponse {
  totalParticipants: number;
  myRank?: LeaderboardRankDto;
  topRankings: LeaderboardRankDto[];
}

// ============================================================================
// Realtime 1v1 Battle & Leaderboard DTOs (Strictly matching backend contracts)
// ============================================================================

export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
export type RankDivision = 'I' | 'II' | 'III';

export interface UserRankProfileDto {
  userId: string;
  trophy: number;
  highestTrophy: number;
  tier: RankTier | string;
  division: RankDivision | string;
  winStreak: number;
  highestWinStreak: number;
  protectionGamesLeft: number;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  penaltyUntil?: string | null;
}

export interface MatchPlayerDto {
  userId: string;
  displayName: string;
  avatarUrl: string;
  tier: RankTier | string;
  division: RankDivision | string;
  currentTrophy: number;
  isBot: boolean;
}

export interface WordPairDto {
  id: string;
  english: string;
  vietnamese: string;
}

export interface MatchFoundPayload {
  matchId: string;
  durationSeconds: number;
  topicId: string;
  topicName: string;
  opponent: MatchPlayerDto;
  pairs: WordPairDto[];
}

export interface PlayerProgressDto {
  matchId: string;
  currentScore: number;
  completedPairsCount: number;
  currentCombo: number;
  isCompleted: boolean;
}

export interface OpponentProgressPayload {
  matchId: string;
  opponentUserId: string;
  currentScore: number;
  completedPairsCount: number;
  currentCombo: number;
  isCompleted: boolean;
}

export interface FinishMatchRequest {
  matchId: string;
  totalTimeMs: number;
}

export interface ForfeitMatchRequest {
  matchId: string;
}

export interface ReconnectMatchRequest {
  matchId: string;
}

export interface JoinQueueRequest {
  preferredTopicId?: string;
}

export interface QueueStatusPayload {
  queueTimeSeconds: number;
  searchRangeTrophy: number;
}

export interface BattleStartedPayload {
  startTimeUtc: string;
}

export interface DisconnectGracePayload {
  gracePeriodSeconds: number;
}

export interface MatchResultPayload {
  matchId: string;
  isWinner: boolean;
  isDraw: boolean;
  finishReason: 'NormalCompletion' | 'Timeout' | 'Forfeit' | 'DisconnectTimeout' | string;
  myFinalScore: number;
  opponentFinalScore: number;
  trophyChange: number;
  newTrophy: number;
  newTier: RankTier | string;
  newDivision: RankDivision | string;
  earnedXp: number;
  winStreak: number;
  isPromotion: boolean;
  isDemoted: boolean;
}

export interface SeasonInfoDto {
  id: string;
  seasonNumber: number;
  name: string;
  daysRemaining: number;
}

export interface BattleLeaderboardItemDto {
  rankPosition: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  tier: RankTier | string;
  division: RankDivision | string;
  trophy: number;
  winRate: number;
  winStreak: number;
}

export interface BattleLeaderboardResponse {
  season?: SeasonInfoDto | null;
  myRank?: BattleLeaderboardItemDto | null;
  items: BattleLeaderboardItemDto[];
  totalCount: number;
}

export interface OpponentSummaryDto {
  displayName: string;
  avatarUrl: string;
  tier: string;
  division: string;
}

export interface MatchHistoryItemDto {
  matchId: string;
  topicName: string;
  opponent: OpponentSummaryDto;
  result: 'Win' | 'Loss' | 'Draw' | string;
  myScore: number;
  opponentScore: number;
  trophyChange: number;
  durationSeconds: number;
  playedAt: string;
}

export interface MatchHistorySummaryDto {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentWinStreak: number;
  highestWinStreak: number;
  currentTrophy: number;
  highestTrophy: number;
  currentTier: string;
  currentDivision: string;
}

export interface MatchHistoryResponse {
  summary: MatchHistorySummaryDto;
  history: MatchHistoryItemDto[];
}


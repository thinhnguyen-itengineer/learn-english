export type GameType = 'WordMatch' | 'SpeedFalling' | 'SentenceScramble';
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

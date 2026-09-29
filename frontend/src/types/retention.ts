// Retention & Gamification Subsystem Contracts

// --- 1. SRS & Mistake Clinic ---
export interface MistakesSummaryResponse {
  totalDueToday: number;
  learningCount: number;
  reviewingCount: number;
  masteredCount: number;
  bySkill: Record<string, number>;
}

export interface ClinicCardDto {
  id: string;
  questionId: string;
  originGameType: string;
  skillType: string;
  prompt: string;
  phonetic?: string;
  audioUrl?: string;
  contextSentence?: string;
  correctAnswer: string;
  wrongAttempts: string[];
  options: string[];
  timeLimitSeconds: number;
}

export interface ClinicSessionResponse {
  sessionId: string;
  cards: ClinicCardDto[];
}

export interface ClinicSubmitRequest {
  mistakeId: string;
  selectedAnswer: string;
  responseTimeMs: number;
  usedHint: boolean;
}

export interface ClinicSubmitResponse {
  mistakeId: string;
  isCorrect: boolean;
  qualityScore: number;
  newEaseFactor: number;
  newIntervalDays: number;
  nextReviewDate: string;
  isGraduated: boolean;
  awardedCoins: number;
  awardedXp: number;
  correctAnswer: string;
  explanation?: string;
}

export interface CaptureMistakeRequest {
  questionId: string;
  originGameType: string;
  skillType: string;
  prompt: string;
  phonetic?: string;
  audioUrl?: string;
  contextSentence?: string;
  correctAnswer: string;
  userWrongAnswer: string;
  explanation?: string;
}

// --- 2. Habits & Daily Chests ---
export interface ChestStatusDto {
  available: boolean;
  claimed: boolean;
  window: string;
}

export interface ChestsOverviewDto {
  earlyBird: ChestStatusDto;
  midday: ChestStatusDto;
  nightOwl: ChestStatusDto;
}

export interface HabitSummaryResponse {
  currentStreak: number;
  maxStreak: number;
  streakFreezeCount: number;
  maxAllowedFreeze: number;
  isStreakProtectedToday: boolean;
  isStreakInGracePeriod: boolean;
  gracePeriodExpiresAt?: string;
  chests: ChestsOverviewDto;
}

export interface BuyFreezeResponse {
  success: boolean;
  newStreakFreezeCount: number;
  remainingCoins: number;
  message: string;
}

export interface ClaimChestRequest {
  chestType: 'EarlyBird' | 'Midday' | 'NightOwl';
}

export interface ClaimChestResponse {
  chestType: string;
  awardedCoins: number;
  awardedXp: number;
  awardedBattleTickets: number;
  message: string;
}

export interface RepairStreakResponse {
  success: boolean;
  restoredStreak: number;
  remainingCoins: number;
  message: string;
}

// --- 3. Weekly Leagues ---
export interface LeagueMemberDto {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  weeklyXp: number;
  zone: 'Promotion' | 'Safe' | 'Demotion' | string;
  isCurrentUser: boolean;
}

export interface WeeklyLeagueCurrentResponse {
  leagueTier: number;
  leagueTierName: string;
  roomCode: string;
  timeRemainingSeconds: number;
  currentUserRank: number;
  currentUserXp: number;
  leaderboard: LeagueMemberDto[];
}

// --- 4. Study Squads ---
export interface SquadMemberDto {
  userId: string;
  userName: string;
  avatarUrl?: string;
  role: 'Leader' | 'Member' | string;
  weeklyXp: number;
  hasReachedThreshold: boolean;
  isCurrentUser: boolean;
}

export interface MySquadResponse {
  squadId: string;
  squadCode: string;
  name: string;
  description?: string;
  memberCount: number;
  maxMembers: number;
  weeklyGoalXp: number;
  currentWeeklyXp: number;
  currentUserContributionXp: number;
  isEligibleForReward: boolean;
  hasClaimedReward: boolean;
  members: SquadMemberDto[];
}

export interface CreateSquadRequest {
  name: string;
  description?: string;
}

export interface JoinSquadRequest {
  squadCode: string;
}

export interface ClaimSquadRewardResponse {
  success: boolean;
  awardedCoins: number;
  awardedBoosterHours: number;
  awardedFreeze: number;
  message: string;
}

// --- 5. Async Challenges ---
export interface CreateChallengeRequest {
  gameType: string;
  score: number;
  questionSnapshot?: any;
}

export interface CreateChallengeResponse {
  challengeToken: string;
  shareUrl: string;
  expiresAt: string;
}

export interface ChallengeAttemptDto {
  participantName: string;
  score: number;
  isWinner: boolean;
  completedAt: string;
}

export interface ChallengeDetailResponse {
  challengeToken: string;
  creatorId: string;
  creatorName: string;
  gameType: string;
  creatorScore: number;
  questionSnapshot?: any;
  expiresAt: string;
  isExpired: boolean;
  attemptCount: number;
  attempts: ChallengeAttemptDto[];
}

export interface SubmitChallengeAttemptRequest {
  participantName: string;
  score: number;
}

export interface SubmitChallengeAttemptResponse {
  isWinner: boolean;
  creatorScore: number;
  userScore: number;
  awardedCoins: number;
  message: string;
}

// --- 6. Speech & Phoneme Evaluation ---
export interface PhonemeScoreDto {
  phoneme: string;
  score: number;
  status: 'green' | 'yellow' | 'red' | string;
  feedback?: string;
}

export interface EvaluatePhonemeRequest {
  referenceText: string;
  referenceIpa?: string;
  audioData?: string;
  userTranscription?: string;
}

export interface EvaluatePhonemeResponse {
  overallScore: number;
  phonemes: PhonemeScoreDto[];
  actionableTip: string;
  recognizedText: string;
}

export interface RoleplayTurnDto {
  speaker: 'ai' | 'user' | string;
  text: string;
}

export interface SpeechRoleplayRequest {
  scenario: string;
  history: RoleplayTurnDto[];
  userInputText: string;
}

export interface SpeechRoleplayResponse {
  aiResponseText: string;
  fluencyScore: number;
  grammarAccuracyScore: number;
  vocabularyFeedback: string;
  isScenarioCompleted: boolean;
}

export type SkyBlasterMode = 'BOT' | 'MATCHMAKING';

export type BotDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type SkyBlasterStage =
  | 'COUNTDOWN'
  | 'AUDIO_PLAYING'
  | 'CANNON_FIRING'
  | 'CRATES_FALLING'
  | 'CHASE_AND_COLLECT'
  | 'ROUND_RESOLVED'
  | 'MATCH_FINISHED';

export type HazardType = 'STUN_BOMB' | 'SLOW_PUDDLE';

export interface ArenaHazard {
  id: string;
  type: HazardType;
  position: [number, number, number];
  radius: number;
  triggered?: boolean;
}

export interface FallingNuclearBomb {
  id: string;
  targetPos: [number, number, number];
  currentPos: [number, number, number];
  dropTimeSeconds: number; // When during the round this bomb drops (elapsed seconds)
  state: 'PENDING' | 'WARNING' | 'DROPPING' | 'EXPLODED' | 'FINISHED';
  fallProgress: number; // 0 to 1
  explosionProgress: number; // 0 to 1
  blastRadius: number;
}

export interface FallingCrate {
  id: string;
  word: string;
  vietnamese: string;
  icon: string;
  isCorrect: boolean;
  /** Initial launch pos from cannon */
  initialPos: [number, number, number];
  /** Target landing ground pos on arena */
  targetPos: [number, number, number];
  /** Current interpolated 3D pos */
  currentPos: [number, number, number];
  /** Fall progress 0.0 to 1.0 */
  fallProgress: number;
  /** Landed on ground */
  hasLanded: boolean;
  /** Picked up by player id ('P1' | 'P2' | null) */
  heldBy: 'P1' | 'P2' | null;
  /** Visual color theme */
  colorHex: string;
}

export interface SkyBlasterRound {
  roundNumber: number; // 1 to 15
  targetWord: string;
  ipa: string;
  vietnameseMeaning: string;
  category: string;
  hintSentence?: string;
  crates: Omit<FallingCrate, 'initialPos' | 'targetPos' | 'currentPos' | 'fallProgress' | 'hasLanded' | 'heldBy'>[];
}

export interface Player3DState {
  id: 'P1' | 'P2';
  name: string;
  position: [number, number, number];
  targetPosition: [number, number, number] | null;
  rotationY: number;
  animationState: 'IDLE' | 'RUN' | 'HOLD_ITEM';
  heldCrate: FallingCrate | null;
  basePosition: [number, number, number];
  score: number;
  isStunned: boolean;
  stunEndTime: number;
  accentColor: string;
  skinId: string;
}

export interface SkyBlasterMatchResult {
  playerScore: number;
  opponentScore: number;
  totalRounds: number;
  isWinner: boolean;
  accuracyPercent: number;
  earnedTokens: number;
  earnedXp: number;
  streakIncrement: number;
}

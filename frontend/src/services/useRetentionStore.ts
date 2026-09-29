import { create } from 'zustand';
import {
  BuyFreezeResponse,
  ChallengeDetailResponse,
  ClaimChestResponse,
  ClaimSquadRewardResponse,
  ClinicSessionResponse,
  ClinicSubmitRequest,
  ClinicSubmitResponse,
  CreateChallengeRequest,
  CreateChallengeResponse,
  CreateSquadRequest,
  EvaluatePhonemeRequest,
  EvaluatePhonemeResponse,
  HabitSummaryResponse,
  JoinSquadRequest,
  MistakesSummaryResponse,
  MySquadResponse,
  RepairStreakResponse,
  SpeechRoleplayRequest,
  SpeechRoleplayResponse,
  SubmitChallengeAttemptRequest,
  SubmitChallengeAttemptResponse,
  WeeklyLeagueCurrentResponse
} from '../types/retention';
import { retentionApi } from './retentionService';

interface RetentionState {
  habitSummary: HabitSummaryResponse | null;
  mistakesSummary: MistakesSummaryResponse | null;
  clinicSession: ClinicSessionResponse | null;
  currentLeague: WeeklyLeagueCurrentResponse | null;
  mySquad: MySquadResponse | null;
  activeChallenge: ChallengeDetailResponse | null;
  speechEvaluation: EvaluatePhonemeResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadHabits: () => Promise<void>;
  buyStreakFreeze: () => Promise<BuyFreezeResponse>;
  claimChest: (type: 'EarlyBird' | 'Midday' | 'NightOwl') => Promise<ClaimChestResponse>;
  repairStreak: () => Promise<RepairStreakResponse>;

  loadMistakesSummary: () => Promise<void>;
  loadClinicSession: () => Promise<void>;
  submitClinicCard: (payload: ClinicSubmitRequest) => Promise<ClinicSubmitResponse>;

  loadLeague: () => Promise<void>;

  loadSquad: () => Promise<void>;
  createSquad: (req: CreateSquadRequest) => Promise<MySquadResponse>;
  joinSquad: (req: JoinSquadRequest) => Promise<MySquadResponse>;
  claimSquadReward: () => Promise<ClaimSquadRewardResponse>;

  createChallenge: (req: CreateChallengeRequest) => Promise<CreateChallengeResponse>;
  loadChallenge: (token: string) => Promise<void>;
  submitChallengeAttempt: (token: string, req: SubmitChallengeAttemptRequest) => Promise<SubmitChallengeAttemptResponse>;

  evaluatePhoneme: (req: EvaluatePhonemeRequest) => Promise<EvaluatePhonemeResponse>;
  roleplayChat: (req: SpeechRoleplayRequest) => Promise<SpeechRoleplayResponse>;
}

export const useRetentionStore = create<RetentionState>((set, get) => ({
  habitSummary: null,
  mistakesSummary: null,
  clinicSession: null,
  currentLeague: null,
  mySquad: null,
  activeChallenge: null,
  speechEvaluation: null,
  loading: false,
  error: null,

  loadHabits: async () => {
    try {
      const data = await retentionApi.getHabitsSummary();
      set({ habitSummary: data });
    } catch (err: any) {
      console.warn('Could not load habits summary:', err);
    }
  },

  buyStreakFreeze: async () => {
    const res = await retentionApi.buyStreakFreeze();
    if (res.success) {
      await get().loadHabits();
    }
    return res;
  },

  claimChest: async (type) => {
    const res = await retentionApi.claimChest(type);
    await get().loadHabits();
    return res;
  },

  repairStreak: async () => {
    const res = await retentionApi.repairStreak();
    if (res.success) {
      await get().loadHabits();
    }
    return res;
  },

  loadMistakesSummary: async () => {
    try {
      const data = await retentionApi.getMistakesSummary();
      set({ mistakesSummary: data });
    } catch (err: any) {
      console.warn('Could not load mistakes summary:', err);
    }
  },

  loadClinicSession: async () => {
    set({ loading: true, error: null });
    try {
      const session = await retentionApi.getClinicSession();
      set({ clinicSession: session, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  submitClinicCard: async (payload) => {
    const res = await retentionApi.submitClinicCard(payload);
    // Refresh mistakes summary in background
    get().loadMistakesSummary();
    return res;
  },

  loadLeague: async () => {
    set({ loading: true, error: null });
    try {
      const league = await retentionApi.getCurrentLeague();
      set({ currentLeague: league, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  loadSquad: async () => {
    set({ loading: true, error: null });
    try {
      const squad = await retentionApi.getMySquad();
      set({ mySquad: squad, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createSquad: async (req) => {
    const squad = await retentionApi.createSquad(req);
    set({ mySquad: squad });
    return squad;
  },

  joinSquad: async (req) => {
    const squad = await retentionApi.joinSquad(req);
    set({ mySquad: squad });
    return squad;
  },

  claimSquadReward: async () => {
    const res = await retentionApi.claimSquadReward();
    if (res.success) {
      await get().loadSquad();
      await get().loadHabits();
    }
    return res;
  },

  createChallenge: async (req) => {
    return await retentionApi.createChallenge(req);
  },

  loadChallenge: async (token) => {
    set({ loading: true, error: null });
    try {
      const ch = await retentionApi.getChallenge(token);
      set({ activeChallenge: ch, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  submitChallengeAttempt: async (token, req) => {
    const res = await retentionApi.submitChallengeAttempt(token, req);
    await get().loadChallenge(token);
    return res;
  },

  evaluatePhoneme: async (req) => {
    const res = await retentionApi.evaluatePhoneme(req);
    set({ speechEvaluation: res });
    return res;
  },

  roleplayChat: async (req) => {
    return await retentionApi.roleplayChat(req);
  }
}));

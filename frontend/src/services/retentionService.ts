import {
  BuyFreezeResponse,
  ChallengeDetailResponse,
  ClaimChestRequest,
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
  WeeklyLeagueCurrentResponse,
  CaptureMistakeRequest
} from '../types/retention';
import { api } from './api';

const API_BASE = '/api/v1';

class RetentionApiService {
  // --- 1. SRS & Mistake Clinic ---
  public async getMistakesSummary(): Promise<MistakesSummaryResponse> {
    const res = await api.authFetch(`${API_BASE}/srs/mistakes/summary`);
    if (!res.ok) throw new Error('Không thể tải tổng kết lỗi sai.');
    return res.json();
  }

  public async getClinicSession(): Promise<ClinicSessionResponse> {
    const res = await api.authFetch(`${API_BASE}/srs/clinic/session`);
    if (!res.ok) throw new Error('Không thể khởi tạo phiên khám bệnh.');
    return res.json();
  }

  public async submitClinicCard(payload: ClinicSubmitRequest): Promise<ClinicSubmitResponse> {
    const res = await api.authFetch(`${API_BASE}/srs/clinic/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi gửi câu trả lời phòng khám.');
    }
    return res.json();
  }

  public async captureMistake(payload: CaptureMistakeRequest): Promise<void> {
    await api.authFetch(`${API_BASE}/srs/mistakes/capture`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- 2. Habits & Daily Chests ---
  public async getHabitsSummary(): Promise<HabitSummaryResponse> {
    const res = await api.authFetch(`${API_BASE}/habits/summary`);
    if (!res.ok) throw new Error('Không thể tải trạng thái thói quen & rương báu.');
    return res.json();
  }

  public async buyStreakFreeze(): Promise<BuyFreezeResponse> {
    const res = await api.authFetch(`${API_BASE}/habits/shop/buy-freeze`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok && !data.message) {
      throw new Error('Không thể mua Băng Bảo Vệ.');
    }
    return data;
  }

  public async claimChest(chestType: 'EarlyBird' | 'Midday' | 'NightOwl'): Promise<ClaimChestResponse> {
    const res = await api.authFetch(`${API_BASE}/habits/chests/claim`, {
      method: 'POST',
      body: JSON.stringify({ chestType } as ClaimChestRequest)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Không thể mở hòm thưởng.');
    }
    return res.json();
  }

  public async repairStreak(): Promise<RepairStreakResponse> {
    const res = await api.authFetch(`${API_BASE}/habits/streak/repair`, {
      method: 'POST'
    });
    const data = await res.json();
    return data;
  }

  // --- 3. Weekly Leagues ---
  public async getCurrentLeague(): Promise<WeeklyLeagueCurrentResponse> {
    const res = await api.authFetch(`${API_BASE}/leagues/current`);
    if (!res.ok) throw new Error('Không thể tải bảng xếp hạng giải đấu tuần.');
    return res.json();
  }

  // --- 4. Study Squads ---
  public async getMySquad(): Promise<MySquadResponse | null> {
    const res = await api.authFetch(`${API_BASE}/squads/my-squad`);
    if (!res.ok) throw new Error('Không thể tải thông tin nhóm học tập.');
    return res.json();
  }

  public async createSquad(payload: CreateSquadRequest): Promise<MySquadResponse> {
    const res = await api.authFetch(`${API_BASE}/squads/create`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Không thể tạo nhóm học tập.');
    }
    return res.json();
  }

  public async joinSquad(payload: JoinSquadRequest): Promise<MySquadResponse> {
    const res = await api.authFetch(`${API_BASE}/squads/join`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Không thể tham gia nhóm học tập.');
    }
    return res.json();
  }

  public async claimSquadReward(): Promise<ClaimSquadRewardResponse> {
    const res = await api.authFetch(`${API_BASE}/squads/claim-reward`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok && !data.message) {
      throw new Error('Không thể nhận phần thưởng nhóm.');
    }
    return data;
  }

  // --- 5. Async Challenges ---
  public async createChallenge(payload: CreateChallengeRequest): Promise<CreateChallengeResponse> {
    const res = await api.authFetch(`${API_BASE}/challenges/create`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Không thể tạo liên kết thách đấu.');
    return res.json();
  }

  public async getChallenge(token: string): Promise<ChallengeDetailResponse> {
    const res = await fetch(`${API_BASE}/challenges/${token}`);
    if (!res.ok) throw new Error('Không tìm thấy thử thách này.');
    return res.json();
  }

  public async submitChallengeAttempt(
    token: string,
    payload: SubmitChallengeAttemptRequest
  ): Promise<SubmitChallengeAttemptResponse> {
    const res = await api.authFetch(`${API_BASE}/challenges/${token}/attempt`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi gửi kết quả thách đấu.');
    }
    return res.json();
  }

  // --- 6. Speech & Phoneme Evaluation ---
  public async evaluatePhoneme(payload: EvaluatePhonemeRequest): Promise<EvaluatePhonemeResponse> {
    const res = await api.authFetch(`${API_BASE}/speech/evaluate-phoneme`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Lỗi khi đánh giá âm vị phát âm.');
    }
    return res.json();
  }

  public async roleplayChat(payload: SpeechRoleplayRequest): Promise<SpeechRoleplayResponse> {
    const res = await api.authFetch(`${API_BASE}/speech/roleplay/chat`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Lỗi khi hội thoại nhập vai với AI.');
    return res.json();
  }
}

export const retentionApi = new RetentionApiService();

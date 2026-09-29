import {
  ClaimBonusResponse,
  DailyBalancedStatusDto,
  RecommendedSkillDto,
  SkillDomainDto,
  SkillsOverviewResponse
} from '../types/game';
import { api } from './api';

const API_BASE = '/api/v1';

class SkillApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = api.getToken();
    if (!token) {
      await api.ensureGuestSession();
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api.getToken()}`
    };
  }

  public async getSkills(): Promise<SkillsOverviewResponse> {
    const res = await api.authFetch(`${API_BASE}/skills`);
    if (!res.ok) {
      throw new Error('Không thể tải dữ liệu cổng 4 kỹ năng.');
    }
    return res.json();
  }

  public async getSkillDetail(domainCode: string): Promise<SkillDomainDto> {
    const res = await api.authFetch(`${API_BASE}/skills/${domainCode}`);
    if (!res.ok) {
      throw new Error(`Không thể tải thông tin chi tiết kỹ năng ${domainCode}.`);
    }
    return res.json();
  }

  public async getDailyStatus(): Promise<DailyBalancedStatusDto> {
    const res = await api.authFetch(`${API_BASE}/skills/daily-status`);
    if (!res.ok) {
      throw new Error('Không thể tải trạng thái nhiệm vụ cân bằng hôm nay.');
    }
    return res.json();
  }

  public async claimBalancedBonus(): Promise<ClaimBonusResponse> {
    const res = await api.authFetch(`${API_BASE}/skills/claim-balanced-bonus`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Không thể nhận phần thưởng.');
    }
    return res.json();
  }

  public async getRecommended(): Promise<RecommendedSkillDto> {
    const res = await api.authFetch(`${API_BASE}/skills/recommended`);
    if (!res.ok) {
      throw new Error('Không thể tải gợi ý kỹ năng cần luyện tập.');
    }
    return res.json();
  }
}

export const skillService = new SkillApiService();

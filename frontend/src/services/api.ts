import {
  CompleteSessionRequest,
  CompleteSessionResponse,
  DifficultyLevel,
  GameType,
  GuestAuthResponse,
  LeaderboardResponse,
  SentenceScrambleInitResponse,
  SpeedFallingInitResponse,
  TopicDto,
  UserProfileDto,
  WordMatchInitResponse
} from '../types/game';

const API_BASE = '/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    if (!this.token) {
      await this.ensureGuestSession();
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  public async ensureGuestSession(): Promise<GuestAuthResponse> {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Khởi tạo phiên khách thất bại: ${res.statusText}`);
    }

    const data: GuestAuthResponse = await res.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  public async getProfile(): Promise<UserProfileDto> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/users/me/profile`, { headers });
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired, re-create guest session
        this.token = null;
        localStorage.removeItem('token');
        await this.ensureGuestSession();
        return this.getProfile();
      }
      throw new Error('Không thể tải thông tin hồ sơ');
    }
    return res.json();
  }

  public async getTopics(difficulty?: DifficultyLevel): Promise<TopicDto[]> {
    const url = difficulty
      ? `${API_BASE}/topics?difficulty=${difficulty}`
      : `${API_BASE}/topics`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Không thể tải danh sách chủ đề');
    }
    return res.json();
  }

  public async startWordMatch(topicId: string, difficultyLevel: DifficultyLevel): Promise<WordMatchInitResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/games/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameType: 'WordMatch',
        topicId,
        difficultyLevel
      })
    });
    if (!res.ok) throw new Error('Không thể khởi tạo ván Word Match');
    return res.json();
  }

  public async startSpeedFalling(topicId: string, difficultyLevel: DifficultyLevel): Promise<SpeedFallingInitResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/games/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameType: 'SpeedFalling',
        topicId,
        difficultyLevel
      })
    });
    if (!res.ok) throw new Error('Không thể khởi tạo ván Speed Falling');
    return res.json();
  }

  public async startSentenceScramble(topicId: string, difficultyLevel: DifficultyLevel): Promise<SentenceScrambleInitResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/games/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        gameType: 'SentenceScramble',
        topicId,
        difficultyLevel
      })
    });
    if (!res.ok) throw new Error('Không thể khởi tạo ván Sentence Scramble');
    return res.json();
  }

  public async completeSession(req: CompleteSessionRequest): Promise<CompleteSessionResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/games/session/complete`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Không thể nộp kết quả phiên chơi');
    return res.json();
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  public async getLeaderboard(): Promise<LeaderboardResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/leaderboard/weekly`, { headers });
    if (!res.ok) throw new Error('Không thể tải bảng xếp hạng');
    return res.json();
  }

  public async getBattleLeaderboard(
    type: 'Season' | 'AllTime' = 'Season',
    page = 1,
    pageSize = 50
  ): Promise<import('../types/game').BattleLeaderboardResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(
      `${API_BASE}/leaderboard/battle?type=${type}&page=${page}&pageSize=${pageSize}`,
      { headers }
    );
    if (!res.ok) throw new Error('Không thể tải bảng xếp hạng đấu thủ');
    return res.json();
  }

  public async getMyRank(): Promise<import('../types/game').UserRankProfileDto> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/users/me/rank`, { headers });
    if (!res.ok) throw new Error('Không thể tải thông tin Rank cá nhân');
    return res.json();
  }

  public async getUserRank(userId: string): Promise<import('../types/game').UserRankProfileDto> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/users/${userId}/rank`, { headers });
    if (!res.ok) throw new Error('Không thể tải thông tin Rank người dùng');
    return res.json();
  }

  public async getMatchHistory(
    page = 1,
    pageSize = 10
  ): Promise<import('../types/game').MatchHistoryResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_BASE}/matches/history?page=${page}&pageSize=${pageSize}`, {
      headers
    });
    if (!res.ok) throw new Error('Không thể tải lịch sử trận đấu');
    return res.json();
  }
}

export const api = new ApiService();


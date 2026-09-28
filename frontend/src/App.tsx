import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Lobby } from './components/Lobby';
import { WordMatchGame } from './components/WordMatchGame';
import { SpeedFallingGame } from './components/SpeedFallingGame';
import { SentenceScrambleGame } from './components/SentenceScrambleGame';
import { SummaryModal } from './components/SummaryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { 
  CompleteSessionRequest, 
  CompleteSessionResponse, 
  DifficultyLevel, 
  GameType, 
  LeaderboardResponse, 
  SentenceScrambleInitResponse, 
  SpeedFallingInitResponse, 
  TopicDto, 
  UserProfileDto, 
  WordMatchInitResponse 
} from './types/game';
import { api } from './services/api';

type ActiveView = 'lobby' | 'wordMatch' | 'speedFalling' | 'sentenceScramble';

export function App() {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [topics, setTopics] = useState<TopicDto[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('lobby');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active game session data
  const [wordMatchData, setWordMatchData] = useState<WordMatchInitResponse | null>(null);
  const [speedFallingData, setSpeedFallingData] = useState<SpeedFallingInitResponse | null>(null);
  const [sentenceScrambleData, setSentenceScrambleData] = useState<SentenceScrambleInitResponse | null>(null);
  const [lastGameParams, setLastGameParams] = useState<{ type: GameType; topicId: string; diff: DifficultyLevel } | null>(null);

  // Modals
  const [summaryResult, setSummaryResult] = useState<CompleteSessionResponse | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        // Ensure guest session
        await api.ensureGuestSession();
        // Load profile & topics
        const [prof, topList] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getTopics().catch(() => [])
        ]);

        if (prof) setProfile(prof);
        if (topList && topList.length > 0) {
          setTopics(topList);
        } else {
          // Fallback initial topics if API is not yet loaded
          setTopics([
            {
              id: 'e4a2d810-75b2-4d2c-9821-2a62d49c0012',
              name: 'Daily Routines (Thói quen hàng ngày)',
              slug: 'daily-routines',
              description: 'Từ vựng và các cấu trúc câu sinh hoạt thường nhật mỗi ngày.',
              iconName: 'Sun',
              difficultyLevel: 'Easy',
              wordCount: 8,
              sentenceCount: 3
            },
            {
              id: 'f5b3e921-86c3-5e3d-0932-3b73e50d1123',
              name: 'Technology & Coding (Công nghệ & Lập trình)',
              slug: 'tech-coding',
              description: 'Thuật ngữ chuyên ngành công nghệ thông tin và phát triển phần mềm.',
              iconName: 'Cpu',
              difficultyLevel: 'Medium',
              wordCount: 8,
              sentenceCount: 3
            },
            {
              id: 'a1c4e732-97d4-6f4e-1a43-4c84f61e2234',
              name: 'Travel & Food (Du lịch & Ẩm thực)',
              slug: 'travel-food',
              description: 'Khám phá thế giới, văn hóa ẩm thực và giao tiếp khi đi du lịch.',
              iconName: 'Compass',
              difficultyLevel: 'Easy',
              wordCount: 8,
              sentenceCount: 2
            }
          ]);
        }
      } catch (err) {
        console.warn('Backend connecting or offline mode:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const handleStartGame = async (gameType: GameType, topicId: string, difficulty: DifficultyLevel) => {
    setIsLoading(true);
    setLastGameParams({ type: gameType, topicId, diff: difficulty });

    try {
      if (gameType === 'WordMatch') {
        const data = await api.startWordMatch(topicId, difficulty);
        setWordMatchData(data);
        setActiveView('wordMatch');
      } else if (gameType === 'SpeedFalling') {
        const data = await api.startSpeedFalling(topicId, difficulty);
        setSpeedFallingData(data);
        setActiveView('speedFalling');
      } else if (gameType === 'SentenceScramble') {
        const data = await api.startSentenceScramble(topicId, difficulty);
        setSentenceScrambleData(data);
        setActiveView('sentenceScramble');
      }
    } catch (err) {
      console.error('Error starting game:', err);
      alert('Không thể khởi tạo ván chơi. Vui lòng kiểm tra backend API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSession = async (req: CompleteSessionRequest) => {
    try {
      const res = await api.completeSession(req);
      setSummaryResult(res);

      // Refresh profile to update XP, streak, levels
      const updatedProfile = await api.getProfile().catch(() => null);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (err) {
      console.error('Error completing session:', err);
      // Fallback local summary
      setSummaryResult({
        sessionId: req.sessionId,
        score: req.score,
        xpEarned: Math.round(req.score / 10),
        accuracyRate: req.totalAttempts > 0 ? Math.round((req.correctAnswers / req.totalAttempts) * 100) : 0,
        isNewLevel: false,
        totalXp: (profile?.totalXp || 0) + Math.round(req.score / 10),
        currentStreak: (profile?.currentStreak || 0) + 1,
        streakIncrementedToday: true,
        unlockedBadges: []
      });
    }
  };

  const handlePlayAgain = () => {
    setSummaryResult(null);
    if (lastGameParams) {
      handleStartGame(lastGameParams.type, lastGameParams.topicId, lastGameParams.diff);
    } else {
      setActiveView('lobby');
    }
  };

  const handleBackToLobby = () => {
    setSummaryResult(null);
    setWordMatchData(null);
    setSpeedFallingData(null);
    setSentenceScrambleData(null);
    setActiveView('lobby');
  };

  const handleOpenLeaderboard = async () => {
    setShowLeaderboard(true);
    try {
      const lb = await api.getLeaderboard();
      setLeaderboardData(lb);
    } catch (err) {
      console.warn('Leaderboard fetch error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        profile={profile} 
        onOpenLeaderboard={handleOpenLeaderboard} 
        onReturnToLobby={handleBackToLobby} 
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeView === 'lobby' && (
          <Lobby 
            topics={topics} 
            onStartGame={handleStartGame} 
            isLoading={isLoading} 
          />
        )}

        {activeView === 'wordMatch' && wordMatchData && (
          <WordMatchGame
            data={wordMatchData}
            onComplete={handleCompleteSession}
            onExit={handleBackToLobby}
          />
        )}

        {activeView === 'speedFalling' && speedFallingData && (
          <SpeedFallingGame
            data={speedFallingData}
            onComplete={handleCompleteSession}
            onExit={handleBackToLobby}
          />
        )}

        {activeView === 'sentenceScramble' && sentenceScrambleData && (
          <SentenceScrambleGame
            data={sentenceScrambleData}
            onComplete={handleCompleteSession}
            onExit={handleBackToLobby}
          />
        )}
      </main>

      {/* Post-game Summary Modal */}
      {summaryResult && (
        <SummaryModal
          result={summaryResult}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          data={leaderboardData}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}

export default App;

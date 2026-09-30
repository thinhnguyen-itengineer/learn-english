import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Lobby } from './components/Lobby';
import { WordMatchGame } from './components/WordMatchGame';
import { SpeedFallingGame } from './components/SpeedFallingGame';
import { SentenceScrambleGame } from './components/SentenceScrambleGame';
import { AudioBlitzGame } from './components/AudioBlitzGame';
import { ClozeMasterGame } from './components/ClozeMasterGame';
import { GrammarDetectiveGame } from './components/GrammarDetectiveGame';
import { SummaryModal } from './components/SummaryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { BattleLeaderboardModal } from './components/BattleLeaderboardModal';
import { Battle1v1Game } from './components/Battle1v1Game';
import { MatchmakingRadar, MatchmakingPlayer } from './components/ui/MatchmakingRadar';
import { MatchResultModal, MatchResultData } from './components/ui/MatchResultModal';
import { TidMiniGameModal } from './components/TidMiniGameModal';
import { ProfileModal } from './components/avatar/ProfileModal';
import { FittingRoom3DModal } from './components/avatar3d/FittingRoom3DModal';
import { useAvatar3DStore } from './services/useAvatar3DStore';
import { useProfileAndInventoryStore } from './services/useProfileAndInventoryStore';
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
  UserRankProfileDto,
  WordMatchInitResponse,
  AudioBlitzInitResponse,
  ClozeMasterInitResponse,
  GrammarDetectiveInitResponse,
  MatchFoundPayload,
  MatchResultPayload,
  RankTier,
  RankDivision
} from './types/game';
import { api } from './services/api';
import { battleSignalR } from './services/battleSignalR';

type ActiveView = 'lobby' | 'wordMatch' | 'speedFalling' | 'sentenceScramble' | 'audioBlitz' | 'clozeMaster' | 'grammarDetective' | 'battle';

export function App() {
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [myRank, setMyRank] = useState<UserRankProfileDto | null>(null);
  const [topics, setTopics] = useState<TopicDto[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('lobby');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active game session data
  const [wordMatchData, setWordMatchData] = useState<WordMatchInitResponse | null>(null);
  const [speedFallingData, setSpeedFallingData] = useState<SpeedFallingInitResponse | null>(null);
  const [sentenceScrambleData, setSentenceScrambleData] = useState<SentenceScrambleInitResponse | null>(null);
  const [audioBlitzData, setAudioBlitzData] = useState<AudioBlitzInitResponse | null>(null);
  const [clozeMasterData, setClozeMasterData] = useState<ClozeMasterInitResponse | null>(null);
  const [grammarDetectiveData, setGrammarDetectiveData] = useState<GrammarDetectiveInitResponse | null>(null);
  const [lastGameParams, setLastGameParams] = useState<{ type: GameType; topicId: string; diff: DifficultyLevel } | null>(null);

  // 1v1 Battle state
  const [matchmakingState, setMatchmakingState] = useState<'idle' | 'searching' | 'matched' | 'countdown'>('idle');
  const [matchmakingQueueSeconds, setMatchmakingQueueSeconds] = useState<number>(0);
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [matchedData, setMatchedData] = useState<MatchFoundPayload | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResultPayload | null>(null);
  const [showBattleLeaderboard, setShowBattleLeaderboard] = useState<boolean>(false);

  // Modals
  const [summaryResult, setSummaryResult] = useState<CompleteSessionResponse | null>(null);
  const [showWeeklyLeaderboard, setShowWeeklyLeaderboard] = useState<boolean>(false);
  const [weeklyLeaderboardData, setWeeklyLeaderboardData] = useState<LeaderboardResponse | null>(null);

  // 4-Skills TID Mini-Games state
  const [activeTidGame, setActiveTidGame] = useState<string | null>(null);

  // 3D Avatar & Boutique Modals
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showFittingRoom3DModal, setShowFittingRoom3DModal] = useState<boolean>(false);

  const refreshProfileAndRank = async () => {
    try {
      const [prof, rank] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getMyRank().catch(() => null),
        useAvatar3DStore.getState().fetchEquipped().catch(() => null),
        useProfileAndInventoryStore.getState().fetchProfile().catch(() => null)
      ]);
      if (prof) setProfile(prof);
      if (rank) setMyRank(rank);
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true);
        // Ensure guest session
        const auth = await api.ensureGuestSession();

        // Load profile, rank, topics, & avatar config
        const [prof, rank, topList] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getMyRank().catch(() => null),
          api.getTopics().catch(() => []),
          useAvatar3DStore.getState().fetchEquipped().catch(() => null),
          useProfileAndInventoryStore.getState().fetchProfile().catch(() => null)
        ]);

        if (prof) setProfile(prof);
        if (rank) setMyRank(rank);

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

        // Initialize SignalR connection to BattleHub
        if (auth.token) {
          try {
            await battleSignalR.connect(auth.token);
          } catch (e) {
            console.warn('SignalR initial connect error:', e);
          }
        }
      } catch (err) {
        console.warn('Backend connecting or offline mode:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    return () => {
      battleSignalR.disconnect();
    };
  }, []);

  // Subscribe to SignalR events for matchmaking & battle start
  useEffect(() => {
    const unsubQueue = battleSignalR.onQueueStatusUpdate((payload) => {
      setMatchmakingQueueSeconds(payload.queueTimeSeconds);
    });

    const unsubMatchFound = battleSignalR.onMatchFound((payload) => {
      setMatchedData(payload);
      setMatchmakingState('matched');
      setCountdownValue(3);

      // 3-second countdown
      let count = 3;
      const countTimer = setInterval(() => {
        count--;
        setCountdownValue(count);
        if (count <= 0) {
          clearInterval(countTimer);
        }
      }, 1000);
    });

    const unsubBattleStarted = battleSignalR.onBattleStarted(() => {
      setMatchmakingState('idle');
      setActiveView('battle');
    });

    const unsubError = battleSignalR.onError((err) => {
      console.error('SignalR Error:', err);
      setMatchmakingState('idle');
      alert(`Lỗi kết nối trận đấu: ${err}`);
    });

    return () => {
      unsubQueue();
      unsubMatchFound();
      unsubBattleStarted();
      unsubError();
    };
  }, []);

  // 1v1 Battle Handlers
  const handleStart1v1Battle = async (preferredTopicId?: string) => {
    try {
      const token = api.getToken();
      if (!token) {
        await api.ensureGuestSession();
      }
      if (!battleSignalR.isConnected()) {
        const activeToken = api.getToken();
        if (activeToken) await battleSignalR.connect(activeToken);
      }

      setMatchmakingQueueSeconds(0);
      setMatchmakingState('searching');
      await battleSignalR.joinMatchmakingQueue(preferredTopicId);
    } catch (err) {
      console.error('Failed to join matchmaking queue:', err);
      setMatchmakingState('idle');
      alert('Không thể kết nối vào hàng chờ tìm trận. Vui lòng thử lại.');
    }
  };

  const handleCancelMatchmaking = async () => {
    try {
      await battleSignalR.leaveMatchmakingQueue();
    } catch (err) {
      console.warn('Failed to leave matchmaking queue:', err);
    } finally {
      setMatchmakingState('idle');
      setMatchedData(null);
    }
  };

  const handleBattleMatchFinished = async (result: MatchResultPayload) => {
    setMatchResult(result);

    // Refresh profile and rank to reflect latest Trophy and XP
    try {
      const [updatedProfile, updatedRank] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getMyRank().catch(() => null)
      ]);
      if (updatedProfile) setProfile(updatedProfile);
      if (updatedRank) setMyRank(updatedRank);
    } catch (err) {
      console.warn('Failed to refresh profile after battle:', err);
    }
  };

  const handleBattlePlayAgain = () => {
    setMatchResult(null);
    setMatchedData(null);
    handleStart1v1Battle();
  };

  const handleBattleBackToLobby = () => {
    setMatchResult(null);
    setMatchedData(null);
    setActiveView('lobby');
  };

  // Solo Mini-game Handlers
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
      } else if (gameType === 'AudioBlitz') {
        const data = await api.startAudioBlitz(topicId, difficulty);
        setAudioBlitzData(data);
        setActiveView('audioBlitz');
      } else if (gameType === 'ClozeMaster') {
        const data = await api.startClozeMaster(topicId, difficulty);
        setClozeMasterData(data);
        setActiveView('clozeMaster');
      } else if (gameType === 'GrammarDetective') {
        const data = await api.startGrammarDetective(topicId, difficulty);
        setGrammarDetectiveData(data);
        setActiveView('grammarDetective');
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
    setAudioBlitzData(null);
    setClozeMasterData(null);
    setGrammarDetectiveData(null);
    setActiveView('lobby');
  };

  const handleOpenWeeklyLeaderboard = async () => {
    setShowWeeklyLeaderboard(true);
    try {
      const lb = await api.getLeaderboard();
      setWeeklyLeaderboardData(lb);
    } catch (err) {
      console.warn('Leaderboard fetch error:', err);
    }
  };

  // Convert for MatchmakingRadar
  const currentRadarPlayer: MatchmakingPlayer = {
    displayName: profile?.displayName || 'Bạn',
    avatarUrl: profile?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=me',
    tier: (myRank?.tier as RankTier) || 'Bronze',
    division: (myRank?.division as RankDivision) || 'III',
    trophy: myRank?.trophy || 0,
  };

  const opponentRadarPlayer: MatchmakingPlayer | null = matchedData?.opponent
    ? {
        displayName: matchedData.opponent.displayName,
        avatarUrl: matchedData.opponent.avatarUrl,
        tier: (matchedData.opponent.tier as RankTier) || 'Bronze',
        division: (matchedData.opponent.division as RankDivision) || 'III',
        trophy: matchedData.opponent.currentTrophy,
      }
    : null;

  // Convert for MatchResultModal
  const matchResultModalData: MatchResultData | null = matchResult
    ? {
        isWinner: matchResult.isWinner,
        isDraw: matchResult.isDraw,
        finishReason: matchResult.finishReason as MatchResultData['finishReason'],
        myFinalScore: matchResult.myFinalScore,
        opponentFinalScore: matchResult.opponentFinalScore,
        trophyChange: matchResult.trophyChange,
        newTrophy: matchResult.newTrophy,
        newTier: (matchResult.newTier as RankTier) || 'Bronze',
        newDivision: (matchResult.newDivision as RankDivision) || 'III',
        earnedXp: matchResult.earnedXp,
        winStreak: matchResult.winStreak,
        isPromotion: matchResult.isPromotion,
        isDemoted: matchResult.isDemoted,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        profile={profile} 
        myRank={myRank}
        onOpenLeaderboard={handleOpenWeeklyLeaderboard}
        onOpenBattleLeaderboard={() => setShowBattleLeaderboard(true)}
        onStart1v1Battle={() => handleStart1v1Battle()}
        onReturnToLobby={handleBackToLobby}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenFittingRoom3D={() => setShowFittingRoom3DModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeView === 'lobby' && (
          <Lobby 
            topics={topics} 
            myRank={myRank}
            onStartGame={handleStartGame} 
            onStart1v1Battle={handleStart1v1Battle}
            onOpenBattleLeaderboard={() => setShowBattleLeaderboard(true)}
            onPlayTidGame={(gameCode) => setActiveTidGame(gameCode)}
            onRefreshProfile={refreshProfileAndRank}
            isLoading={isLoading} 
          />
        )}

        {/* 1v1 Battle Mode Screen */}
        {activeView === 'battle' && matchedData && (
          <Battle1v1Game
            matchPayload={matchedData}
            profile={profile}
            myRank={myRank}
            onMatchFinished={handleBattleMatchFinished}
            onExit={handleBattleBackToLobby}
          />
        )}

        {/* Solo Games */}
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

        {activeView === 'audioBlitz' && audioBlitzData && (
          <AudioBlitzGame
            data={audioBlitzData}
            onComplete={handleCompleteSession}
            onExit={handleBackToLobby}
          />
        )}

        {activeView === 'clozeMaster' && clozeMasterData && (
          <ClozeMasterGame
            data={clozeMasterData}
            onComplete={handleCompleteSession}
            onExit={handleBackToLobby}
          />
        )}

        {activeView === 'grammarDetective' && grammarDetectiveData && (
          <GrammarDetectiveGame
            data={grammarDetectiveData}
            onComplete={handleCompleteSession}
            onExit={handleBackToLobby}
          />
        )}
      </main>

      {/* Matchmaking Radar Modal */}
      {matchmakingState !== 'idle' && (
        <MatchmakingRadar
          player={currentRadarPlayer}
          opponent={opponentRadarPlayer}
          status={matchmakingState}
          countdownValue={countdownValue}
          elapsedSeconds={matchmakingQueueSeconds}
          onCancel={handleCancelMatchmaking}
        />
      )}

      {/* 1v1 Battle Result Modal */}
      {matchResultModalData && (
        <MatchResultModal
          data={matchResultModalData}
          onPlayAgain={handleBattlePlayAgain}
          onBackToLobby={handleBattleBackToLobby}
        />
      )}

      {/* Solo Mini-game Summary Modal */}
      {summaryResult && (
        <SummaryModal
          result={summaryResult}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Global & Season Battle Podium Leaderboard Modal */}
      {showBattleLeaderboard && (
        <BattleLeaderboardModal
          onClose={() => setShowBattleLeaderboard(false)}
          onPlayBattle={() => {
            setShowBattleLeaderboard(false);
            handleStart1v1Battle();
          }}
        />
      )}

      {/* Solo Weekly XP Leaderboard Modal */}
      {showWeeklyLeaderboard && (
        <LeaderboardModal
          data={weeklyLeaderboardData}
          onClose={() => setShowWeeklyLeaderboard(false)}
        />
      )}

      {/* Designer TID 4-Skills Interactive Mini-Games Modal */}
      {activeTidGame && (
        <TidMiniGameModal
          gameCode={activeTidGame}
          onClose={() => setActiveTidGame(null)}
          onComplete={(score, xpEarned) => {
            console.log('TID Mini-game finished:', { score, xpEarned });
            refreshProfileAndRank();
          }}
        />
      )}

      {/* Profile & 3D Avatar Showcase Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          refreshProfileAndRank();
        }}
        onOpenFittingRoom={() => {
          setShowProfileModal(false);
          setShowFittingRoom3DModal(true);
        }}
      />

      {/* Standalone 3D WebGL Live Fitting Room & Boutique Showroom Modal */}
      <FittingRoom3DModal
        isOpen={showFittingRoom3DModal}
        onClose={() => {
          setShowFittingRoom3DModal(false);
          refreshProfileAndRank();
        }}
      />
    </div>
  );
}

export default App;

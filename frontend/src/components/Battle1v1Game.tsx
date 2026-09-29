import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MatchFoundPayload, 
  MatchResultPayload, 
  OpponentProgressPayload, 
  DisconnectGracePayload, 
  UserProfileDto, 
  UserRankProfileDto,
  RankTier,
  RankDivision
} from '../types/game';
import { battleSignalR } from '../services/battleSignalR';
import { DualBattleHUD, PlayerHUDInfo } from './ui/DualBattleHUD';
import { FlipCard, CardState } from './ui/FlipCard';
import { FeedbackToast, FeedbackType } from './ui/FeedbackToast';
import { sound } from '../utils/sound';

interface BattleCardItem {
  id: string;
  pairId: string;
  language: 'en' | 'vi';
  text: string;
  state: CardState;
}

export interface Battle1v1GameProps {
  matchPayload: MatchFoundPayload;
  profile: UserProfileDto | null;
  myRank: UserRankProfileDto | null;
  onMatchFinished: (result: MatchResultPayload) => void;
  onExit: () => void;
}

export const Battle1v1Game: React.FC<Battle1v1GameProps> = ({
  matchPayload,
  profile,
  myRank,
  onMatchFinished,
  onExit,
}) => {
  // Battle Timer: 60s
  const [remainingSeconds, setRemainingSeconds] = useState<number>(matchPayload.durationSeconds || 60);

  // Player state
  const [myScore, setMyScore] = useState<number>(0);
  const [myCompletedPairs, setMyCompletedPairs] = useState<number>(0);
  const [myCombo, setMyCombo] = useState<number>(0);
  const [myMaxCombo, setMyMaxCombo] = useState<number>(0);

  // Opponent state
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentCompletedPairs, setOpponentCompletedPairs] = useState<number>(0);
  const [opponentCombo, setOpponentCombo] = useState<number>(0);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState<boolean>(false);
  const [disconnectGrace, setDisconnectGrace] = useState<number>(15);

  // Feedback Toast state
  const [feedback, setFeedback] = useState<{
    type: FeedbackType;
    comboCount?: number;
    bonusPoints?: number;
    message?: string;
  } | null>(null);

  // Prepare cards: 10 English cards + 10 Vietnamese cards
  const initialCards = useMemo<BattleCardItem[]>(() => {
    const list: BattleCardItem[] = [];
    matchPayload.pairs.forEach((pair) => {
      list.push({
        id: `en_${pair.id}`,
        pairId: pair.id,
        language: 'en',
        text: pair.english,
        state: 'idle',
      });
      list.push({
        id: `vi_${pair.id}`,
        pairId: pair.id,
        language: 'vi',
        text: pair.vietnamese,
        state: 'idle',
      });
    });

    // Shuffle deterministic pseudo-randomly
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    return list;
  }, [matchPayload]);

  const [cards, setCards] = useState<BattleCardItem[]>(initialCards);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Tracking speed bonus
  const lastMatchTimestampRef = useRef<number>(Date.now());
  const matchStartTimeRef = useRef<number>(Date.now());

  // 1. Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. SignalR event listeners
  useEffect(() => {
    const unsubscribeOpponentProgress = battleSignalR.onOpponentProgressUpdate((payload: OpponentProgressPayload) => {
      if (payload.matchId === matchPayload.matchId) {
        setOpponentScore(payload.currentScore);
        setOpponentCompletedPairs(payload.completedPairsCount);
        setOpponentCombo(payload.currentCombo);
      }
    });

    const unsubscribeDisconnected = battleSignalR.onOpponentDisconnected((payload: DisconnectGracePayload) => {
      setIsOpponentDisconnected(true);
      setDisconnectGrace(payload.gracePeriodSeconds);
      setFeedback({
        type: 'disconnect_warning',
        message: `Đối thủ rớt mạng... Đang chờ (${payload.gracePeriodSeconds}s)`,
      });
    });

    const unsubscribeReconnected = battleSignalR.onOpponentReconnected(() => {
      setIsOpponentDisconnected(false);
      setFeedback({
        type: 'reconnected',
        message: 'Đối thủ đã kết nối lại! Tiếp tục thi đấu.',
      });
      setTimeout(() => setFeedback(null), 3000);
    });

    const unsubscribeMatchFinished = battleSignalR.onMatchFinished((payload: MatchResultPayload) => {
      if (payload.matchId === matchPayload.matchId) {
        if (payload.isWinner) {
          sound.playVictory();
        }
        onMatchFinished(payload);
      }
    });

    return () => {
      unsubscribeOpponentProgress();
      unsubscribeDisconnected();
      unsubscribeReconnected();
      unsubscribeMatchFinished();
    };
  }, [matchPayload.matchId, onMatchFinished]);

  // Grace timer countdown if disconnected
  useEffect(() => {
    if (!isOpponentDisconnected) return;
    const interval = setInterval(() => {
      setDisconnectGrace((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpponentDisconnected]);

  // 3. Card click handler
  const handleCardClick = (card: BattleCardItem) => {
    if (isLocked || card.state === 'matched' || card.state === 'disabled') return;
    sound.playClick();

    if (!selectedCardId) {
      // First card selection
      setSelectedCardId(card.id);
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, state: 'selected' } : c))
      );
      if (card.language === 'en') {
        sound.speak(card.text);
      }
      return;
    }

    if (selectedCardId === card.id) {
      // Deselect if clicking the same card
      setSelectedCardId(null);
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, state: 'idle' } : c))
      );
      return;
    }

    const firstCard = cards.find((c) => c.id === selectedCardId);
    if (!firstCard) {
      setSelectedCardId(card.id);
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, state: 'selected' } : c))
      );
      return;
    }

    // Must match different languages (EN with VI)
    if (firstCard.language === card.language) {
      // Switch selection to new card of same language
      setSelectedCardId(card.id);
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === card.id) return { ...c, state: 'selected' };
          if (c.id === firstCard.id) return { ...c, state: 'idle' };
          return c;
        })
      );
      if (card.language === 'en') {
        sound.speak(card.text);
      }
      return;
    }

    // Validate Match!
    const isMatch = firstCard.pairId === card.pairId;
    const now = Date.now();
    const timeSinceLastMatchMs = now - lastMatchTimestampRef.current;
    lastMatchTimestampRef.current = now;

    if (isMatch) {
      // ================= MATCH SUCCESS =================
      sound.playSuccess();
      const newCompleted = myCompletedPairs + 1;
      const newCombo = myCombo + 1;
      const newMaxCombo = Math.max(myMaxCombo, newCombo);

      // Speed bonus
      let speedBonus = 0;
      if (timeSinceLastMatchMs < 1500) speedBonus = 50;
      else if (timeSinceLastMatchMs < 3000) speedBonus = 30;
      else if (timeSinceLastMatchMs < 5000) speedBonus = 10;

      // Combo bonus
      let comboBonus = 0;
      if (newCombo >= 4) comboBonus = 60;
      else if (newCombo === 3) comboBonus = 40;
      else if (newCombo === 2) comboBonus = 20;

      const gainedScore = 100 + speedBonus + comboBonus;
      const updatedScore = myScore + gainedScore;

      setMyScore(updatedScore);
      setMyCompletedPairs(newCompleted);
      setMyCombo(newCombo);
      setMyMaxCombo(newMaxCombo);

      // Update card states to matched
      setCards((prev) =>
        prev.map((c) =>
          c.id === firstCard.id || c.id === card.id
            ? { ...c, state: 'matched' }
            : c
        )
      );
      setSelectedCardId(null);

      // Toast feedback
      if (newCombo >= 2) {
        setFeedback({ type: 'combo', comboCount: newCombo });
      } else if (speedBonus >= 30) {
        setFeedback({ type: 'speed_bonus', bonusPoints: speedBonus });
      }

      // Send SignalR progress
      const isFinishedAll = newCompleted >= 10;
      battleSignalR.sendPlayerProgress({
        matchId: matchPayload.matchId,
        currentScore: updatedScore,
        completedPairsCount: newCompleted,
        currentCombo: newCombo,
        isCompleted: isFinishedAll,
      });

      if (isFinishedAll) {
        const totalDurationMs = Date.now() - matchStartTimeRef.current;
        battleSignalR.finishMatchEarly(matchPayload.matchId, totalDurationMs);
      }
    } else {
      // ================= MATCH WRONG =================
      sound.playError();
      setIsLocked(true);
      const updatedScore = Math.max(0, myScore - 30);
      setMyScore(updatedScore);
      setMyCombo(0);

      // Flash red
      setCards((prev) =>
        prev.map((c) =>
          c.id === firstCard.id || c.id === card.id
            ? { ...c, state: 'wrong' }
            : c
        )
      );

      // Report wrong to opponent if needed
      battleSignalR.sendPlayerProgress({
        matchId: matchPayload.matchId,
        currentScore: updatedScore,
        completedPairsCount: myCompletedPairs,
        currentCombo: 0,
        isCompleted: false,
      });

      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstCard.id || c.id === card.id
              ? { ...c, state: 'idle' }
              : c
          )
        );
        setSelectedCardId(null);
        setIsLocked(false);
      }, 500);
    }
  };

  const handleForfeit = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đầu hàng và rời trận đấu 1v1 này không?')) {
      await battleSignalR.forfeitMatch(matchPayload.matchId);
      onExit();
    }
  };

  // Convert to DualHUD structs
  const p1HUD: PlayerHUDInfo = {
    userId: profile?.userId || 'me',
    displayName: profile?.displayName || 'Bạn',
    avatarUrl: profile?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=me',
    tier: (myRank?.tier as RankTier) || 'Bronze',
    division: (myRank?.division as RankDivision) || 'III',
    score: myScore,
    completedPairs: myCompletedPairs,
    totalPairs: 10,
    combo: myCombo,
  };

  const p2HUD: PlayerHUDInfo = {
    userId: matchPayload.opponent.userId,
    displayName: matchPayload.opponent.displayName,
    avatarUrl: matchPayload.opponent.avatarUrl,
    tier: (matchPayload.opponent.tier as RankTier) || 'Bronze',
    division: (matchPayload.opponent.division as RankDivision) || 'III',
    score: opponentScore,
    completedPairs: opponentCompletedPairs,
    totalPairs: 10,
    combo: opponentCombo,
    isDisconnected: isOpponentDisconnected,
    disconnectGraceSeconds: disconnectGrace,
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-slate-950 relative select-none">
      {/* Top Battle HUD */}
      <DualBattleHUD
        player={p1HUD}
        opponent={p2HUD}
        remainingSeconds={remainingSeconds}
        totalSeconds={60}
      />

      {/* Main Playing Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col items-center justify-between">
        {/* Topic Title & Subtitle */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-full">
              Chủ đề: {matchPayload.topicName}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              Ghép Cặp Từ Vựng (10 Cặp)
            </h2>
          </div>

          {/* Forfeit action button */}
          <button
            type="button"
            onClick={handleForfeit}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 border border-rose-900/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Đầu Hàng
          </button>
        </div>

        {/* Floating Toast Area */}
        <div className="h-10 flex items-center justify-center mb-2">
          {feedback && (
            <FeedbackToast
              type={feedback.type}
              comboCount={feedback.comboCount}
              bonusPoints={feedback.bonusPoints}
              graceSeconds={disconnectGrace}
              message={feedback.message}
            />
          )}
        </div>

        {/* 20-Cards Interactive Grid (4 x 5 on desktop, 2 x 10 or 3-cols on mobile) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3.5 my-auto">
          {cards.map((card) => (
            <FlipCard
              key={card.id}
              id={card.id}
              text={card.text}
              language={card.language}
              state={card.state}
              onClick={() => handleCardClick(card)}
              onAudioClick={() => sound.speak(card.text)}
            />
          ))}
        </div>

        {/* Bottom Helper Bar */}
        <div className="w-full text-center py-2 text-xs text-slate-500 font-semibold mt-4">
          Chọn 1 thẻ tiếng Anh và 1 thẻ tiếng Việt tương ứng • Ghép nhanh để nhận thưởng Tốc Độ & Combo!
        </div>
      </div>
    </div>
  );
};

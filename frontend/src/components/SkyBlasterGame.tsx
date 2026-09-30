import React, { useEffect, useState } from 'react';
import {
  Volume2,
  ArrowLeft,
  Trophy,
  Bot,
  Users,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Coins,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSkyBlasterStore } from '../services/useSkyBlasterStore';
import { SkyBlaster3DArena } from './avatar3d/SkyBlaster3DArena';
import { SkyBlasterMode, BotDifficulty } from '../types/skyBlaster';
import { skyBlasterAudio } from '../utils/skyBlasterAudio';

interface SkyBlasterGameProps {
  onExit: () => void;
}

export const SkyBlasterGame: React.FC<SkyBlasterGameProps> = ({ onExit }) => {
  const {
    mode,
    botDifficulty,
    stage,
    currentRoundIndex,
    totalRounds,
    countdown,
    roundTimeLeft,
    activeRound,
    matchRounds,
    player1,
    player2,
    lastRoundWinner,
    announcementText,
    matchResult,
    setMode,
    setBotDifficulty,
    startGame,
    repeatAudio,
  } = useSkyBlasterStore();

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Match Loading / Resource Preparation State
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStepText, setLoadingStepText] = useState<string>('Đang chuẩn bị tài nguyên đấu trường...');

  // Trigger confetti on victory match result
  useEffect(() => {
    if (stage === 'MATCH_FINISHED' && matchResult?.isWinner) {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  }, [stage, matchResult]);

  // Loading sequence before entering the match
  const handleStartMatch = (selectedMode: SkyBlasterMode, selectedDiff: BotDifficulty) => {
    setMode(selectedMode);
    setBotDifficulty(selectedDiff);
    setIsLoadingResources(true);
    setLoadingProgress(10);
    setLoadingStepText('Đang nạp 15 bộ từ vựng & ngữ âm chuẩn IPA...');

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + 18;
        if (next >= 35 && next < 65) {
          setLoadingStepText('Đang khởi tạo Đấu trường Vườn Ngọc Bích 3D & Giàn Hoa...');
        } else if (next >= 65 && next < 90) {
          setLoadingStepText('Đang nạp đại bác pháo hoa & chướng ngại vật...');
        } else if (next >= 90 && next < 100) {
          setLoadingStepText('Đồng bộ hóa 2 người chơi... Sẵn sàng!');
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoadingResources(false);
            setHasStarted(true);
            startGame('Bạn', selectedMode === 'BOT' ? 'Bot' : 'Người chơi 2');
          }, 350);
          return 100;
        }
        return next;
      });
    }, 280);
  };

  const handleRepeatAudioClick = () => {
    setIsAudioPlaying(true);
    repeatAudio();
    setTimeout(() => setIsAudioPlaying(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full overflow-hidden flex flex-col bg-slate-950 text-slate-800 select-none">
      {/* 1. 3D Arena Viewport (Canvas fills the entire background) */}
      <div className="absolute inset-0 z-0">
        <SkyBlaster3DArena className="w-full h-full" />
      </div>

      {/* 2. Top Minimalist Game HUD (Matching Concept Art Top Bar) */}
      <header className="relative z-20 px-4 sm:px-8 pt-3 sm:pt-4 flex items-center justify-between gap-3 pointer-events-none">
        {/* Top-Left: Player 1 Profile Card (Black Stickman Avatar + Sleek Bar) */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 shadow-xl shadow-emerald-950/20">
          {/* Black Stickman Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-white text-xs font-black shadow-inner">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-400">{player1.name}</span>
              <span className="text-xs font-black font-mono text-white">
                Điểm: {player1.score}
              </span>
            </div>
            {/* Sleek Score Progress Bar */}
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (player1.score / totalRounds) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Sleek Minimalist Round Capsule & Audio Listen Button */}
        <div className="pointer-events-auto flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-400/50 shadow-xl">
            {/* Round Count */}
            <span className="text-[11px] font-black text-amber-300 tracking-wider">
              ROUND {currentRoundIndex + 1}/{totalRounds}
            </span>

            <span className="text-slate-600 font-bold">|</span>

            {/* Timer */}
            <div
              className={`flex items-center gap-1 font-mono text-xs font-black ${
                roundTimeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-300'
              }`}
            >
              <span>⏱️</span>
              <span>{Math.ceil(roundTimeLeft)}s</span>
            </div>

            <span className="text-slate-600 font-bold">|</span>

            {/* Listen Button */}
            <button
              onClick={handleRepeatAudioClick}
              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 active:scale-95 ${
                isAudioPlaying
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
              }`}
              title="Phát lại âm thanh"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe Lại</span>
            </button>
          </div>

          {/* Toast / Announcement Badge */}
          {announcementText && (
            <div className="px-3.5 py-0.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-400/60 text-[10px] font-bold text-amber-300 shadow-md text-center animate-fade-in flex items-center gap-1 max-w-sm truncate">
              <span>✨</span>
              <span className="truncate">{announcementText}</span>
            </div>
          )}
        </div>

        {/* Top-Right: Player 2 Profile Card (White Stickman Avatar + Sleek Bar) */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/40 shadow-xl shadow-rose-950/20">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs font-black font-mono text-white">
                Điểm: {player2.score}
              </span>
              <span className="text-[11px] font-black text-rose-400">
                {player2.name}
              </span>
            </div>
            {/* Sleek Score Progress Bar */}
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-0.5 border border-white/10 ml-auto">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (player2.score / totalRounds) * 100)}%` }}
              />
            </div>
          </div>
          {/* White Stickman Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center text-slate-950 text-xs font-black shadow-inner">
            <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300" />
          </div>
        </div>
      </header>

      {/* 3. Floating Quick Action Buttons on Screen Edges */}
      <div className="absolute top-16 left-4 z-20 pointer-events-auto flex flex-col gap-2">
        <button
          onClick={onExit}
          className="p-2 px-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white transition-all border border-white/10 shadow-lg flex items-center gap-1.5 text-xs font-bold active:scale-95 backdrop-blur-md"
          title="Quay lại sảnh"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>Về Sảnh</span>
        </button>
      </div>

      <div className="absolute top-16 right-4 z-20 pointer-events-auto flex flex-col gap-2">
        <button
          onClick={() => setShowHowToPlay(true)}
          className="p-2 px-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white transition-all border border-white/10 shadow-lg flex items-center gap-1.5 text-xs font-bold active:scale-95 backdrop-blur-md"
          title="Xem hướng dẫn luật chơi"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Luật chơi</span>
        </button>
      </div>

      {/* 4. Fullscreen Countdown Overlay */}
      {stage === 'COUNTDOWN' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-sky-950/40 backdrop-blur-sm pointer-events-none">
          <div className="text-9xl font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] animate-ping">
            {countdown}
          </div>
          <p className="text-sm font-bold text-white bg-black/60 px-5 py-2 rounded-full mt-6 shadow-xl border border-white/20">
            🌸 Chuẩn bị xuất phát! Cổng hoa mở khi vật phẩm chạm đất!
          </p>
        </div>
      )}

      {/* 4b. Round Resolved 3s Countdown Overlay */}
      {stage === 'ROUND_RESOLVED' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/65 backdrop-blur-md pointer-events-none animate-fade-in">
          <div className="p-7 sm:p-9 rounded-3xl bg-slate-900/95 border-2 border-emerald-400 shadow-2xl flex flex-col items-center gap-3 text-center max-w-sm sm:max-w-md mx-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30">
              {lastRoundWinner === 'P1' ? '🏆' : '🤖'}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {lastRoundWinner === 'P1' ? 'BẠN ĐÃ NỘP CHÍNH XÁC!' : 'BOT ĐÃ NỘP TRƯỚC!'}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2">
              <span>+1 Điểm Cho {lastRoundWinner === 'P1' ? 'Bạn' : 'Bot'}</span>
              <span>•</span>
              <span>Hoàn tất Round {currentRoundIndex + 1}/{totalRounds}</span>
            </div>
            <div className="mt-3 flex flex-col items-center">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">
                Round {Math.min(totalRounds, currentRoundIndex + 2)} bắt đầu sau
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center text-3xl font-black shadow-xl shadow-emerald-500/50 animate-bounce font-mono">
                {countdown}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Frosted Control Dock */}
      <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-300 shadow-xl text-center">
          <span className="text-emerald-400 font-bold">🎮 Di chuyển:</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-mono text-white text-[10px] font-bold">
            W A S D
          </span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-mono text-white text-[10px] font-bold">
            Phím Mũi Tên
          </span>
          <span className="text-amber-400 font-bold">| Giữ SHIFT: Chạy Nhanh</span>
          <span className="text-rose-400 font-bold">| Né 💣 Mìn & 💧 Vũng Bùn</span>
        </div>
      </footer>

      {/* 6. Mode Selection Start Modal */}
      {!hasStarted && !isLoadingResources && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl flex flex-col gap-4 text-white animate-fade-in">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-3xl">🌸</span>
              </div>
              <h3 className="text-xl font-black text-white">ĐẤU TRƯỜNG VƯỜN NGỌC BÍCH</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                15 Round nghe hiểu • Bắt đúng vật phẩm rơi dù và mang về Cổng Hoa!
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Chọn Chế Độ Chơi:
              </div>

              {/* Bot Mode */}
              <button
                onClick={() => handleStartMatch('BOT', 'MEDIUM')}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 hover:from-emerald-900 hover:to-teal-900 border-2 border-emerald-500/50 text-left transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm text-white">Đấu với Bot (AI Bot)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Chơi Ngay
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Luyện phản xạ nghe 15 round không trùng lặp cùng máy trong khu vườn ngọc bích.
                </p>
              </button>

              {/* Matchmaking Mode */}
              <button
                onClick={() => handleStartMatch('MATCHMAKING', 'HARD')}
                className="w-full p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm text-white">Tìm Bạn Chơi (Online 1v1)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Ghép Đấu
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Ghép đấu đối kháng thời gian thực so tài nghe tiếng Anh với bạn bè hoặc học viên khác.
                </p>
              </button>
            </div>

            {/* Bot Difficulty Options */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] font-bold text-emerald-300 mb-1.5">
                Độ khó phản xạ của Bot:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as BotDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setBotDifficulty(diff)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      botDifficulty === diff
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff === 'EASY' ? 'Dễ (3s)' : diff === 'MEDIUM' ? 'Vừa (2s)' : 'Khó (1.2s)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onExit}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
              >
                Trở Về
              </button>
              <button
                onClick={() => handleStartMatch(mode, botDifficulty)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                VÀO TRẬN NGAY!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PROFESSIONAL RESOURCE LOADING & MATCH PREPARATION SCREEN */}
      {isLoadingResources && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 animate-fade-in select-none text-white">
          <div className="w-full max-w-xl flex flex-col items-center gap-6 text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>CHUẨN BỊ TÀI NGUYÊN ĐẤU TRƯỜNG 15 ROUNDS</span>
            </div>

            {/* VS Card Matchup Presentation */}
            <div className="w-full grid grid-cols-3 items-center gap-2 sm:gap-4 my-2">
              {/* Player 1 Card (Black Stickman) */}
              <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-900/90 border-2 border-emerald-400 shadow-xl shadow-emerald-500/10">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-emerald-400 flex items-center justify-center shadow-lg relative mb-2">
                  <div className="w-7 h-7 rounded-full bg-slate-950 border-2 border-emerald-300" />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black">
                    P1
                  </span>
                </div>
                <div className="text-sm font-black text-white">{player1.name}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Người que Đen</div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Sẵn Sàng
                </div>
              </div>

              {/* Center VS Emblem */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-pulse border-2 border-white/20">
                  <span className="text-2xl font-black text-slate-950 font-mono tracking-tighter">
                    VS
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-black tracking-widest mt-2 uppercase">
                  1v1 ARENA
                </div>
              </div>

              {/* Player 2 Card (White Stickman / Bot) */}
              <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-900/90 border-2 border-rose-400 shadow-xl shadow-rose-500/10">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-rose-400 flex items-center justify-center shadow-lg relative mb-2">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-300" />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                    {mode === 'BOT' ? 'BOT' : 'P2'}
                  </span>
                </div>
                <div className="text-sm font-black text-white">
                  {mode === 'BOT' ? `Bot AI (${botDifficulty})` : player2.name}
                </div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">Người que Trắng</div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-rose-300 font-bold bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">
                  <CheckCircle2 className="w-3 h-3 text-rose-400" /> Sẵn Sàng
                </div>
              </div>
            </div>

            {/* Dynamic Progress Bar & Step Description */}
            <div className="w-full space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs font-bold px-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {loadingStepText}
                </span>
                <span className="text-emerald-400 font-mono font-black">{loadingProgress}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 rounded-full bg-slate-800/90 p-0.5 border border-white/10 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 transition-all duration-300 shadow-[0_0_12px_#10b981]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 italic mt-1">
                Mẹo: Nhấn giữ Shift để chạy nước rút nhặt nhanh hơn đối thủ!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. Match Summary Modal (15 Rounds Finished) */}
      {stage === 'MATCH_FINISHED' && matchResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-amber-400 shadow-2xl flex flex-col gap-3.5 text-center text-white max-h-[92vh] overflow-y-auto">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce shrink-0">
              <Trophy className="w-7 h-7 text-slate-950" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {matchResult.isWinner ? '🏆 CHIẾN THẮNG TUYỆT ĐỐI!' : '⚔️ KẾT THÚC 15 ROUND!'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Đấu trường 15 round hoàn tất! Dưới đây là thành tích và danh sách từ vựng trong trận:
              </p>
            </div>

            {/* Score comparison pill */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around shrink-0">
              <div>
                <div className="text-xs text-emerald-400 font-bold">P1 (Bạn)</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-0.5">
                  {matchResult.playerScore}
                </div>
              </div>
              <div className="text-sm font-black text-slate-600">VS</div>
              <div>
                <div className="text-xs text-rose-400 font-bold">
                  {mode === 'BOT' ? 'Bot' : 'Đối Thủ'}
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400 mt-0.5">
                  {matchResult.opponentScore}
                </div>
              </div>
            </div>

            {/* Rewards Card */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-medium">Chính Xác</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5">
                  {matchResult.accuracyPercent}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" /> Token
                </span>
                <span className="text-sm font-bold text-amber-300 mt-0.5">
                  +{matchResult.earnedTokens}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-400" /> XP Nghe
                </span>
                <span className="text-sm font-bold text-rose-400 mt-0.5">
                  +{matchResult.earnedXp}
                </span>
              </div>
            </div>

            {/* 15-Round Vocabulary & Meaning Recap List */}
            <div className="flex flex-col gap-2 text-left mt-0.5 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300 px-1">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  Danh Sách 15 Từ Vựng & Nghĩa Trong Trận
                </span>
                <span className="text-[10px] text-slate-400">Bấm loa để nghe lại</span>
              </div>

              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/70 rounded-2xl bg-slate-950/80 p-2.5 border border-slate-800">
                {matchRounds.slice(0, totalRounds).map((round, idx) => {
                  const correctCrate = round.crates.find((c) => c.isCorrect);
                  return (
                    <div
                      key={round.roundNumber || idx}
                      className="pt-1.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 text-[11px] font-mono font-bold text-slate-500 text-center shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xl shrink-0">
                          {correctCrate?.icon || '📦'}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-emerald-400 uppercase tracking-wide text-xs">
                              {round.targetWord}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {round.ipa}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 truncate">
                            {round.vietnameseMeaning}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => skyBlasterAudio.speakWord(round.targetWord)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-all shrink-0 active:scale-90"
                        title={`Nghe lại phát âm ${round.targetWord}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <button
                onClick={onExit}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
              >
                Về Sảnh
              </button>
              <button
                onClick={() => startGame()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Đấu Trận Khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. How To Play Modal */}
      {showHowToPlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-white animate-fade-in">
            <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
              <span>🌸</span> Luật Chơi Đấu Trường Vườn Ngọc Bích (15 Rounds)
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <span className="p-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-black">1</span>
                <div>
                  <strong className="text-white">15 Round Từ Vựng Không Trùng Lặp:</strong> Mỗi round loa phát âm 1 từ tiếng Anh. 5 thùng quà mang hình ảnh trực quan rơi dù xuống vườn (1 ĐÚNG, 4 SAI).
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <span className="p-1 px-2 rounded-lg bg-amber-500/20 text-amber-300 font-black">2</span>
                <div>
                  <strong className="text-white">Vạch Xuất Phát & Cổng Hoa:</strong> Khi thùng chạm đất, vạch xuất phát mở ra. Chạy đi nhặt thùng đúng và bế chạy ngược về Cổng Hoa để nộp:
                  <ul className="list-disc list-inside mt-1 text-[11px] text-slate-400 space-y-0.5">
                    <li><span className="text-emerald-400 font-bold">Nộp ĐÚNG:</span> +1 điểm, hiển thị từ vựng & IPA, sang round kế tiếp.</li>
                    <li><span className="text-rose-400 font-bold">Nộp SAI:</span> Bị đẩy lùi, choáng 1.5s và rơi thùng lại sân!</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <span className="p-1 px-2 rounded-lg bg-rose-500/20 text-rose-300 font-black">3</span>
                <div>
                  <strong className="text-white">Chướng Ngại Vật:</strong>
                  <ul className="list-disc list-inside mt-1 text-[11px] text-slate-400 space-y-0.5">
                    <li><span className="text-rose-400 font-bold">💣 Mìn Choáng Gai:</span> Dẫm phải mìn sẽ nổ, choáng 1s và rơi thùng đang bế.</li>
                    <li><span className="text-purple-400 font-bold">🟣 Vũng Bùn Tím (CHẬM LẠI):</span> Giảm tốc độ di chuyển đi 45%.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <span className="p-1 px-2 rounded-lg bg-sky-500/20 text-sky-300 font-black">4</span>
                <div>
                  <strong className="text-white">Tăng Tốc & Trọng Lượng:</strong> Nhấn giữ <code className="text-amber-400 font-mono bg-slate-800 px-1 rounded">Shift</code> để chạy nước rút. Bế thùng nặng giảm 10% tốc độ chạy.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 mt-1"
            >
              Đã hiểu, vào chiến ngay!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkyBlasterGame;

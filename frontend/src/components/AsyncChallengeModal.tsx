import React, { useState, useEffect } from 'react';
import { X, Swords, Share2, Copy, Check, Trophy, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRetentionStore } from '../services/useRetentionStore';
import { Button } from './ui/Button';
import { soundManager } from '../utils/sound';

interface AsyncChallengeModalProps {
  initialToken?: string;
  gameScore?: number;
  gameType?: string;
  onClose: () => void;
}

export const AsyncChallengeModal: React.FC<AsyncChallengeModalProps> = ({
  initialToken,
  gameScore = 1200,
  gameType = 'SpeedFalling',
  onClose
}) => {
  const { createChallenge, loadChallenge, submitChallengeAttempt, activeChallenge, loading } = useRetentionStore();

  const [mode, setMode] = useState<'create' | 'play'>(initialToken ? 'play' : 'create');
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [participantName, setParticipantName] = useState<string>('');
  const [userScoreInput, setUserScoreInput] = useState<number>(gameScore);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);

  useEffect(() => {
    if (initialToken) {
      loadChallenge(initialToken);
    }
  }, [initialToken, loadChallenge]);

  const handleCreate = async () => {
    soundManager.playClick();
    try {
      const res = await createChallenge({
        gameType,
        score: gameScore,
        questionSnapshot: { sample: 'challenge_data' }
      });
      const fullUrl = `${window.location.origin}?challenge=${res.challengeToken}`;
      setCreatedUrl(fullUrl);
      soundManager.playCorrect();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (!createdUrl) return;
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialToken && !activeChallenge) return;
    const token = initialToken || activeChallenge?.challengeToken;
    if (!token) return;

    soundManager.playClick();
    try {
      const res = await submitChallengeAttempt(token, {
        participantName: participantName.trim() || 'Người Thách Đấu',
        score: userScoreInput
      });

      setIsWinner(res.isWinner);
      setResultMsg(res.message);
      if (res.isWinner) {
        soundManager.playCorrect();
        confetti({ particleCount: 100, spread: 80 });
      } else {
        soundManager.playWrong();
      }
    } catch (err: any) {
      setResultMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Thách Đấu Bất Đồng Bộ</h3>
              <p className="text-xs text-slate-400">Viral Ghost Race & Chia sẻ bạn bè</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode: Create Challenge */}
        {mode === 'create' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-center">
              <span className="text-xs font-semibold text-slate-400">Điểm số kỷ lục của bạn</span>
              <div className="text-3xl font-black text-amber-400">{gameScore} điểm</div>
              <p className="text-xs text-slate-400">
                Trò chơi: <strong className="text-slate-200">{gameType}</strong>
              </p>
            </div>

            {!createdUrl ? (
              <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleCreate}>
                <Share2 className="w-4 h-4" /> Tạo Link Thách Đấu Ngay
              </Button>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-2">
                  <input
                    readOnly
                    value={createdUrl}
                    className="w-full bg-transparent text-xs text-slate-300 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Gửi link này qua Zalo, Messenger hoặc Facebook. Bạn bè sẽ thi đấu lại đúng bộ câu hỏi của bạn!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mode: Play / Submit Attempt */}
        {mode === 'play' && (
          <div className="space-y-4">
            {activeChallenge && (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Người thách đấu:</span>
                  <span className="font-bold text-indigo-300">{activeChallenge.creatorName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Điểm cần vượt qua:</span>
                  <span className="font-extrabold text-amber-400 text-sm">{activeChallenge.creatorScore} điểm</span>
                </div>
              </div>
            )}

            {!resultMsg ? (
              <form onSubmit={handleSubmitAttempt} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tên của bạn</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ tên hiển thị..."
                    value={participantName}
                    onChange={e => setParticipantName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Điểm bạn vừa chơi được</label>
                  <input
                    type="number"
                    min={0}
                    value={userScoreInput}
                    onChange={e => setUserScoreInput(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full">
                  Nộp Kết Quả Thách Đấu
                </Button>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    {isWinner ? '🎉 Bạn Đã Chiến Thắng!' : '👍 Hoàn Thành Ván Thách Đấu!'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">{resultMsg}</p>
                </div>
                <Button variant="secondary" onClick={onClose} className="w-full">
                  Quay Lại Sảnh Chính
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

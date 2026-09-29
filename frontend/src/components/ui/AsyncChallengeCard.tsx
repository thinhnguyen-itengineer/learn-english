import React, { useState } from 'react';
import { 
  Swords, 
  Share2, 
  Copy, 
  Check, 
  Trophy, 
  Flame, 
  Ghost, 
  Coins, 
  Timer, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from './Button';

export interface AsyncChallengeCardProps {
  challengeToken: string;
  shareableUrl: string;
  creatorName: string;
  creatorAvatar?: string;
  gameType: string;
  gameTypeName?: string;
  targetScore: number;
  timeLimitSeconds: number;
  userScore?: number;
  status: 'pending' | 'beaten' | 'defended' | 'expired';
  isCreator?: boolean;
  onPlayChallenge?: () => void;
  isLoading?: boolean;
}

export const AsyncChallengeCard: React.FC<AsyncChallengeCardProps> = ({
  challengeToken,
  shareableUrl,
  creatorName,
  creatorAvatar,
  gameType,
  gameTypeName,
  targetScore,
  timeLimitSeconds,
  userScore,
  status = 'pending',
  isCreator = false,
  onPlayChallenge,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBeaten = status === 'beaten';
  const isDefended = status === 'defended';

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(168,85,247,0.2)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40 shadow-3d-purple">
            <Swords className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-600/40">
                Ghost Race (Đua Với Bóng)
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {gameTypeName || gameType}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white mt-0.5">
              Thách Đấu Bất Đồng Bộ (Async Challenge)
            </h3>
          </div>
        </div>

        {/* Challenge Token & Link Copy */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 p-1.5 pl-3 rounded-2xl">
          <span className="text-xs font-mono font-bold text-purple-300">
            {challengeToken}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer shadow-3d-purple active:shadow-none active:translate-y-[2px]"
            title="Sao chép link thách đấu"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Duel Visualization: Challenger Record vs You */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Creator Record Card */}
        <div className="rounded-2xl bg-slate-800/70 border border-purple-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white overflow-hidden border-2 border-purple-400">
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="w-full h-full object-cover" />
              ) : (
                creatorName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                {isCreator ? 'Kỷ Lục Của Bạn' : 'Người Thách Đấu'}
              </div>
              <div className="text-sm font-black text-white">{creatorName}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Timer className="w-3 h-3" /> {timeLimitSeconds} giây giới hạn
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-amber-400">{targetScore.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Điểm kỷ lục</div>
          </div>
        </div>

        {/* Opponent / Your Card */}
        <div className="rounded-2xl bg-slate-800/70 border border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-950/80 flex items-center justify-center text-indigo-300 border-2 border-indigo-400">
              <Ghost className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                {isCreator ? 'Đối Thủ Thách Đấu' : 'Điểm Số Của Bạn'}
              </div>
              <div className="text-sm font-black text-white">
                {userScore !== undefined ? 'Hoàn thành' : 'Đang chờ chơi...'}
              </div>
              <div className="text-[11px] text-slate-400">
                Mục tiêu: Vượt qua {targetScore.toLocaleString()} điểm
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-indigo-300">
              {userScore !== undefined ? userScore.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] font-bold uppercase text-slate-400">Điểm của bạn</div>
          </div>
        </div>
      </div>

      {/* Result Status Banner */}
      {status !== 'pending' && (
        <div className={`rounded-2xl p-4 mb-5 flex items-center justify-between border-2 ${
          isBeaten 
            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' 
            : 'bg-rose-950/60 border-rose-500 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-xs md:text-sm font-black">
              {isBeaten 
                ? '🏆 KỶ LỤC ĐÃ BỊ PHÁ! Người thách đấu nhận +50 Coins' 
                : '🛡️ BẢO VỆ THÀNH CÔNG! Kỷ lục vẫn thuộc về người tạo link'}
            </span>
          </div>
          <div className="flex items-center gap-1 font-bold text-xs">
            <Coins className="w-4 h-4 text-yellow-400" />
            {isBeaten ? '+50 Coins' : '+10 Coins'}
          </div>
        </div>
      )}

      {/* CTA Bottom Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={handleCopy}
          leftIcon={<Share2 className="w-4 h-4" />}
          className="text-xs"
        >
          {copied ? 'Đã sao chép link!' : 'Chia sẻ link cho bạn bè'}
        </Button>

        {!isCreator && status === 'pending' && (
          <Button
            variant="purple"
            size="md"
            isLoading={isLoading}
            onClick={onPlayChallenge}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-3d-purple font-black"
          >
            Chấp Nhận Thách Đấu Ngay!
          </Button>
        )}
      </div>
    </div>
  );
};

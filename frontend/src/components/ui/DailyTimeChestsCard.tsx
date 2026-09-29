import React, { useState } from 'react';
import { 
  Sunrise, 
  Sun, 
  Moon, 
  Gift, 
  Check, 
  Lock, 
  Sparkles, 
  Coins, 
  Ticket, 
  Zap, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from './Button';

export type ChestWindowType = 'morning' | 'noon' | 'daily_master';

export interface ChestStatus {
  type: ChestWindowType;
  title: string;
  subTitle: string;
  timeWindow: string; // e.g. "06:00 - 10:00"
  status: 'ready' | 'locked' | 'claimed' | 'missed';
  rewardsText: string;
  conditionText: string;
  progressText?: string; // e.g. "2/3 nhiệm vụ"
  icon: 'sunrise' | 'sun' | 'moon';
}

export interface DailyTimeChestsCardProps {
  chests: ChestStatus[];
  onClaimChest?: (type: ChestWindowType) => void;
  isLoading?: boolean;
}

export const DailyTimeChestsCard: React.FC<DailyTimeChestsCardProps> = ({
  chests,
  onClaimChest,
  isLoading = false,
}) => {
  const [activeRewardPopup, setActiveRewardPopup] = useState<string | null>(null);

  const handleClaim = (chest: ChestStatus) => {
    if (chest.status !== 'ready') return;
    if (onClaimChest) {
      onClaimChest(chest.type);
    }
    setActiveRewardPopup(`Bạn đã nhận thành công: ${chest.rewardsText}!`);
    setTimeout(() => {
      setActiveRewardPopup(null);
    }, 3500);
  };

  const getChestColors = (type: ChestWindowType) => {
    switch (type) {
      case 'morning':
        return {
          border: 'border-amber-500/50',
          bg: 'from-amber-950/40 to-slate-900',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          accent: 'text-amber-400',
          buttonVariant: 'gold' as const,
        };
      case 'noon':
        return {
          border: 'border-cyan-500/50',
          bg: 'from-cyan-950/40 to-slate-900',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          accent: 'text-cyan-400',
          buttonVariant: 'frost' as const,
        };
      case 'daily_master':
        return {
          border: 'border-purple-500/50',
          bg: 'from-purple-950/40 to-slate-900',
          badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          accent: 'text-purple-400',
          buttonVariant: 'purple' as const,
        };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700/80 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 text-white shadow-3d-gold">
            <Gift className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/40">
                Daily Habit Loop
              </span>
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Múi giờ UTC+7
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-white mt-0.5">
              Hòm Báu 3 Khung Giờ Vàng (Daily Quest Chests)
            </h3>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Mở rương đúng giờ nhận thưởng Booster & Vé đấu
        </div>
      </div>

      {/* Reward Toast Notice */}
      {activeRewardPopup && (
        <div className="mb-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 p-3.5 text-emerald-200 text-xs md:text-sm font-bold flex items-center justify-between animate-pop-bounce">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            {activeRewardPopup}
          </div>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* 3 Chests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chests.map((chest) => {
          const style = getChestColors(chest.type);
          const isReady = chest.status === 'ready';
          const isClaimed = chest.status === 'claimed';
          const isLocked = chest.status === 'locked';
          const isMissed = chest.status === 'missed';

          return (
            <div
              key={chest.type}
              className={`relative rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${style.border} bg-gradient-to-b ${style.bg} ${
                isReady ? 'shadow-[0_0_20px_rgba(245,158,11,0.25)]' : ''
              } ${isMissed ? 'opacity-60 grayscale' : ''}`}
            >
              {/* Chest Top Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl border ${style.badgeBg} flex items-center gap-1.5`}>
                    {chest.icon === 'sunrise' && <Sunrise className="w-3.5 h-3.5" />}
                    {chest.icon === 'sun' && <Sun className="w-3.5 h-3.5" />}
                    {chest.icon === 'moon' && <Moon className="w-3.5 h-3.5" />}
                    {chest.timeWindow}
                  </span>

                  {isClaimed && (
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-600/40 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã Nhận
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Chưa Tới Giờ
                    </span>
                  )}
                  {isMissed && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-lg">
                      Đã Qua Giờ
                    </span>
                  )}
                </div>

                {/* Chest Visual Artwork */}
                <div className="flex items-center justify-center py-4">
                  <div className={`relative p-5 rounded-3xl ${
                    isReady 
                      ? 'bg-gradient-to-tr from-amber-500/20 to-yellow-500/30 text-yellow-300 border-2 border-yellow-400/60 animate-chest-bounce' 
                      : isClaimed
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800/60 text-slate-500 border border-slate-700/60'
                  }`}>
                    <Gift className="w-12 h-12" />
                    {isReady && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-black text-white text-center mb-1">
                  {chest.title}
                </h4>
                <p className="text-xs text-slate-300 text-center font-medium mb-3">
                  {chest.conditionText}
                </p>

                {/* Progress if any */}
                {chest.progressText && (
                  <div className="mb-3 px-3 py-1 rounded-xl bg-slate-800 text-center text-xs font-bold text-purple-300 border border-purple-500/30">
                    {chest.progressText}
                  </div>
                )}

                {/* Rewards preview */}
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 mb-4 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Phần thưởng:</span>
                  <span className={`text-xs font-black ${style.accent} flex items-center justify-center gap-1.5`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {chest.rewardsText}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isReady ? (
                  <Button
                    variant={style.buttonVariant}
                    size="md"
                    fullWidth
                    isLoading={isLoading}
                    onClick={() => handleClaim(chest)}
                    className="shadow-3d-gold font-black"
                  >
                    Mở Hòm Nhận Thưởng!
                  </Button>
                ) : isClaimed ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Đã Mở Khóa Hôm Nay
                  </button>
                ) : isMissed ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-slate-500 text-xs font-bold text-center"
                  >
                    Hẹn gặp lại ngày mai!
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-4 h-4" /> Chờ Mở Khung Giờ
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

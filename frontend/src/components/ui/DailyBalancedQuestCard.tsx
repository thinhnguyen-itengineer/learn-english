import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Gift, 
  Coins, 
  Zap, 
  Flame, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './Button';
import { SkillDomainCode } from './SkillDomainCard';

export interface DailyBalancedQuestCardProps {
  completedSkills: SkillDomainCode[];
  rewardClaimed?: boolean;
  bonusCoins?: number;
  bonusXp?: number;
  onClaimBonus: () => void;
  onSelectSkill: (code: SkillDomainCode) => void;
  onSmartPick?: () => void;
  className?: string;
}

const skillItems: Array<{
  code: SkillDomainCode;
  name: string;
  sub: string;
  icon: any;
  themeColor: string;
  activeBg: string;
  borderActive: string;
}> = [
  {
    code: 'LISTENING',
    name: 'Nghe',
    sub: 'Audio Blitz / Dictation',
    icon: Headphones,
    themeColor: 'text-sky-400',
    activeBg: 'bg-sky-950/40',
    borderActive: 'border-sky-500/50',
  },
  {
    code: 'READING',
    name: 'Đọc',
    sub: 'Word Match / Skim & Scan',
    icon: BookOpen,
    themeColor: 'text-emerald-400',
    activeBg: 'bg-emerald-950/40',
    borderActive: 'border-emerald-500/50',
  },
  {
    code: 'WRITING',
    name: 'Viết',
    sub: 'Sentence / Collocations',
    icon: PenTool,
    themeColor: 'text-amber-400',
    activeBg: 'bg-amber-950/40',
    borderActive: 'border-amber-500/50',
  },
  {
    code: 'SPEAKING',
    name: 'Nói',
    sub: 'Minimal Pairs / Stress',
    icon: Mic,
    themeColor: 'text-rose-400',
    activeBg: 'bg-rose-950/40',
    borderActive: 'border-rose-500/50',
  },
];

export const DailyBalancedQuestCard: React.FC<DailyBalancedQuestCardProps> = ({
  completedSkills,
  rewardClaimed = false,
  bonusCoins = 50,
  bonusXp = 100,
  onClaimBonus,
  onSelectSkill,
  onSmartPick,
  className = '',
}) => {
  const completedCount = completedSkills.length;
  const isAllCompleted = completedCount >= 4;
  const progressPercent = Math.min(100, Math.round((completedCount / 4) * 100));

  const handleClaim = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaimBonus();
  };

  return (
    <div
      className={`
        relative flex flex-col justify-between
        rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950
        border-2 border-slate-800 p-6 shadow-xl
        ${isAllCompleted && !rewardClaimed ? 'border-yellow-500/70 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Gift className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-black text-white">
                Nhiệm Vụ Cân Bằng Hôm Nay
              </h3>
              <p className="text-xs text-slate-400">
                Luyện ít nhất 1 bài ở mỗi kỹ năng để nhận thưởng lớn
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-800 text-slate-200 border border-slate-700 font-mono">
            {completedCount}/4 Đã Xong
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 mb-5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isAllCompleted ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Skills Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {skillItems.map((item) => {
            const isDone = completedSkills.includes(item.code);
            const Icon = item.icon;

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => onSelectSkill(item.code)}
                className={`
                  flex items-center justify-between p-3 rounded-2xl border text-left
                  transition-all duration-150 cursor-pointer
                  hover:bg-slate-800/80 active:scale-[0.98]
                  ${
                    isDone
                      ? `${item.activeBg} ${item.borderActive} text-slate-100`
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isDone ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isDone ? item.themeColor : ''}`} />
                  </div>
                  <div className="truncate">
                    <p className={`text-sm font-bold ${isDone ? 'text-white' : 'text-slate-300'}`}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{item.sub}</p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rewards Showcase & Claim Action */}
      <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black">
              <Coins className="w-4 h-4 text-amber-400" />
              +{bonusCoins} Coins
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-black">
              <Zap className="w-4 h-4 text-blue-400" />
              +{bonusXp} XP
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Giữ chuỗi Streak 1.2x
            </div>
          </div>

          <div>
            {rewardClaimed ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-slate-800 text-slate-400 border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Đã nhận hôm nay
              </span>
            ) : isAllCompleted ? (
              <Button
                variant="gold"
                size="md"
                onClick={handleClaim}
                leftIcon={<Sparkles className="w-4 h-4 fill-current" />}
              >
                Nhận Thưởng Ngay!
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onSmartPick}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Luyện Tập Bù
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

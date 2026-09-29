import React, { useEffect } from 'react';
import { Award, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './Button';
import { SkillBadgeTier, SkillDomainCode } from './SkillDomainCard';

export interface SkillBadgeModalProps {
  isOpen: boolean;
  domain: SkillDomainCode;
  domainTitleVi: string;
  badgeTier: SkillBadgeTier;
  tierTitle: string; // e.g. "Silver Listener" or "Master Wordsmith"
  description: string;
  rewardXp?: number;
  rewardCoins?: number;
  onClose: () => void;
}

const badgeColorStyles: Record<SkillBadgeTier, { bg: string; border: string; glow: string; text: string; label: string }> = {
  bronze: {
    bg: 'from-amber-800 to-amber-950',
    border: 'border-amber-600',
    glow: 'shadow-[0_0_40px_rgba(217,119,6,0.5)]',
    text: 'text-amber-400',
    label: 'Huy Hiệu Đồng (Bronze Tier)',
  },
  silver: {
    bg: 'from-slate-400 to-slate-700',
    border: 'border-slate-300',
    glow: 'shadow-[0_0_40px_rgba(203,213,225,0.5)]',
    text: 'text-slate-200',
    label: 'Huy Hiệu Bạc (Silver Tier)',
  },
  gold: {
    bg: 'from-amber-400 via-yellow-500 to-amber-600',
    border: 'border-yellow-300',
    glow: 'shadow-[0_0_50px_rgba(234,179,8,0.7)]',
    text: 'text-yellow-300',
    label: 'Huy Hiệu Vàng (Gold Tier)',
  },
  diamond: {
    bg: 'from-cyan-400 via-blue-500 to-indigo-600',
    border: 'border-cyan-300',
    glow: 'shadow-[0_0_60px_rgba(6,182,212,0.8)]',
    text: 'text-cyan-300',
    label: 'Huy Hiệu Kim Cương (Diamond Tier)',
  },
};

export const SkillBadgeModal: React.FC<SkillBadgeModalProps> = ({
  isOpen,
  domain,
  domainTitleVi,
  badgeTier,
  tierTitle,
  description,
  rewardXp = 150,
  rewardCoins = 50,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const style = badgeColorStyles[badgeTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-slate-700 p-8 text-center shadow-2xl animate-pop-bounce">
        {/* Glow Background Circle */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden rounded-3xl pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl animate-pulse" />
        </div>

        {/* Small Tag */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 mb-4">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          Mở Khóa Cấp Độ Mới!
        </span>

        {/* Big Rotating Metallic Badge */}
        <div className="my-6 flex justify-center">
          <div
            className={`
              w-28 h-28 rounded-full flex items-center justify-center
              bg-gradient-to-tr ${style.bg} border-4 ${style.border} ${style.glow}
              animate-combo-bounce
            `}
          >
            <Award className="w-14 h-14 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Titles */}
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
          {domainTitleVi} • {style.label}
        </span>
        <h2 className={`text-2xl md:text-3xl font-black ${style.text} tracking-wide mb-2`}>
          {tierTitle}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed mb-6">
          {description}
        </p>

        {/* Reward Stats Box */}
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex items-center justify-around mb-6">
          <div className="text-center">
            <span className="text-xs text-slate-400 block">Thưởng XP</span>
            <span className="text-lg font-black text-blue-400 font-mono">+{rewardXp} XP</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-xs text-slate-400 block">Thưởng Coins</span>
            <span className="text-lg font-black text-amber-400 font-mono">+{rewardCoins} 💰</span>
          </div>
        </div>

        {/* Button */}
        <Button
          variant="gold"
          size="lg"
          fullWidth
          onClick={onClose}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Tiếp Tục Chinh Phục
        </Button>
      </div>
    </div>
  );
};

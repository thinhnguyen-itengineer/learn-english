import React from 'react';
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Gamepad2, 
  ChevronRight,
  Award
} from 'lucide-react';
import { Button } from './Button';

export type SkillDomainCode = 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING';
export type SkillBadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface FeaturedGamePreview {
  code: string;
  name: string;
  isHot?: boolean;
  isNew?: boolean;
}

export interface SkillDomainCardProps {
  code: SkillDomainCode;
  titleVi: string;
  titleEn: string;
  description: string;
  masteryPercentage: number; // 0 - 100
  tierTitle: string; // e.g. "Master Ear", "Agile Scanner"
  badgeTier?: SkillBadgeTier;
  gameCount: number;
  featuredGames?: FeaturedGamePreview[];
  isCompletedToday?: boolean;
  isSmartPick?: boolean; // Recommended as weakest skill to practice
  onExplore: (code: SkillDomainCode) => void;
  onQuickPlay?: (gameCode?: string) => void;
  className?: string;
}

const domainThemeConfig = {
  LISTENING: {
    bgGradient: 'from-sky-950/80 via-slate-900/90 to-sky-900/40',
    borderColor: 'border-sky-500/50 hover:border-sky-400',
    shadow3D: 'shadow-[0_6px_0_#0369a1]',
    glowColor: 'hover:shadow-[0_0_25px_rgba(14,165,233,0.35)]',
    accentText: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    progressColor: 'bg-sky-500',
    buttonVariant: 'listening' as const,
    icon: Headphones,
    iconBg: 'bg-sky-500/20 text-sky-400 ring-2 ring-sky-500/40',
  },
  READING: {
    bgGradient: 'from-emerald-950/80 via-slate-900/90 to-emerald-900/40',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400',
    shadow3D: 'shadow-[0_6px_0_#047857]',
    glowColor: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    accentText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    progressColor: 'bg-emerald-500',
    buttonVariant: 'reading' as const,
    icon: BookOpen,
    iconBg: 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40',
  },
  WRITING: {
    bgGradient: 'from-amber-950/80 via-slate-900/90 to-amber-900/40',
    borderColor: 'border-amber-500/50 hover:border-amber-400',
    shadow3D: 'shadow-[0_6px_0_#b45309]',
    glowColor: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    progressColor: 'bg-amber-500',
    buttonVariant: 'writing' as const,
    icon: PenTool,
    iconBg: 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40',
  },
  SPEAKING: {
    bgGradient: 'from-rose-950/80 via-slate-900/90 to-rose-900/40',
    borderColor: 'border-rose-500/50 hover:border-rose-400',
    shadow3D: 'shadow-[0_6px_0_#be123c]',
    glowColor: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]',
    accentText: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    progressColor: 'bg-rose-500',
    buttonVariant: 'speaking' as const,
    icon: Mic,
    iconBg: 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/40',
  },
};

const badgeTierLabels: Record<SkillBadgeTier, { label: string; color: string }> = {
  bronze: { label: 'Huy hiệu Đồng', color: 'text-amber-500' },
  silver: { label: 'Huy hiệu Bạc', color: 'text-slate-300' },
  gold: { label: 'Huy hiệu Vàng', color: 'text-yellow-400' },
  diamond: { label: 'Huy hiệu Kim Cương', color: 'text-cyan-400' },
};

export const SkillDomainCard: React.FC<SkillDomainCardProps> = ({
  code,
  titleVi,
  titleEn,
  description,
  masteryPercentage,
  tierTitle,
  badgeTier = 'bronze',
  gameCount,
  featuredGames = [],
  isCompletedToday = false,
  isSmartPick = false,
  onExplore,
  onQuickPlay,
  className = '',
}) => {
  const theme = domainThemeConfig[code];
  const IconComponent = theme.icon;
  const clampedMastery = Math.min(100, Math.max(0, masteryPercentage));

  return (
    <div
      className={`
        relative flex flex-col justify-between
        rounded-3xl border-2 bg-gradient-to-b ${theme.bgGradient} ${theme.borderColor}
        ${theme.shadow3D} ${theme.glowColor}
        p-6 transition-all duration-200
        hover:-translate-y-1 active:translate-y-0
        ${isSmartPick ? 'ring-2 ring-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.25)]' : ''}
        ${className}
      `}
    >
      {/* Top Banner Tags: Smart Pick & Daily Completion */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {isSmartPick ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-yellow-400 text-yellow-950 shadow-[0_2px_0_#ca8a04] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            CẦN CẢI THIỆN (SMART PICK)
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${theme.badgeBg}`}>
            {titleEn}
          </span>
        )}

        {isCompletedToday && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Đã hoàn thành hôm nay
          </span>
        )}
      </div>

      {/* Main Title & Domain Icon */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3.5 rounded-2xl shrink-0 ${theme.iconBg} shadow-inner`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-wide flex items-center gap-2">
            {titleVi}
          </h3>
          <p className="text-xs md:text-sm font-semibold text-slate-300 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Mastery Progress Bar & Tier */}
      <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 mb-5">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Award className={`w-3.5 h-3.5 ${badgeTierLabels[badgeTier].color}`} />
            {tierTitle}
          </span>
          <span className={`font-mono text-sm font-black ${theme.accentText}`}>
            {clampedMastery}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${theme.progressColor}`}
            style={{ width: `${clampedMastery}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mt-2">
          <span>0% Mới bắt đầu</span>
          <span className={badgeTierLabels[badgeTier].color}>
            {badgeTierLabels[badgeTier].label}
          </span>
          <span>100% Thuần thục</span>
        </div>
      </div>

      {/* Featured Mini-Games List Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-slate-300" />
            {gameCount} Mini-games chuyên sâu:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {featuredGames.map((game) => (
            <button
              key={game.code}
              type="button"
              onClick={() => onQuickPlay?.(game.code)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <span>{game.name}</span>
              {game.isHot && <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />}
              {game.isNew && <span className="text-[10px] font-black text-emerald-400">NEW</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
        <Button
          variant={theme.buttonVariant}
          size="lg"
          fullWidth
          onClick={() => onExplore(code)}
          rightIcon={<ChevronRight className="w-5 h-5" />}
        >
          Khám Phá Hub {titleVi.replace('Kỹ Năng ', '')}
        </Button>
      </div>
    </div>
  );
};

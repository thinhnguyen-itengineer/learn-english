import React from 'react';
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic, Award, Filter } from 'lucide-react';
import { Button } from './Button';
import { SkillDomainCode } from './SkillDomainCard';

export type DifficultyFilter = 'ALL' | 'A1_A2' | 'B1_B2' | 'IELTS';

export interface SkillDomainHubHeaderProps {
  domain: SkillDomainCode;
  titleVi: string;
  titleEn: string;
  description: string;
  masteryPercentage: number;
  tierTitle: string;
  selectedDifficulty: DifficultyFilter;
  onDifficultyChange: (diff: DifficultyFilter) => void;
  onBack: () => void;
  className?: string;
}

const domainHeaders = {
  LISTENING: {
    bgGradient: 'from-sky-950 via-slate-900 to-slate-950',
    borderColor: 'border-sky-500/40',
    iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
    progressBg: 'bg-sky-500',
    accentText: 'text-sky-400',
    icon: Headphones,
  },
  READING: {
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    borderColor: 'border-emerald-500/40',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    progressBg: 'bg-emerald-500',
    accentText: 'text-emerald-400',
    icon: BookOpen,
  },
  WRITING: {
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    borderColor: 'border-amber-500/40',
    iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    progressBg: 'bg-amber-500',
    accentText: 'text-amber-400',
    icon: PenTool,
  },
  SPEAKING: {
    bgGradient: 'from-rose-950 via-slate-900 to-slate-950',
    borderColor: 'border-rose-500/40',
    iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
    progressBg: 'bg-rose-500',
    accentText: 'text-rose-400',
    icon: Mic,
  },
};

const filterTabs: Array<{ id: DifficultyFilter; label: string }> = [
  { id: 'ALL', label: 'Tất cả cấp độ' },
  { id: 'A1_A2', label: 'Cơ bản (A1 - A2)' },
  { id: 'B1_B2', label: 'Trung cấp (B1 - B2)' },
  { id: 'IELTS', label: 'Học thuật (IELTS 6.5+)' },
];

export const SkillDomainHubHeader: React.FC<SkillDomainHubHeaderProps> = ({
  domain,
  titleVi,
  titleEn,
  description,
  masteryPercentage,
  tierTitle,
  selectedDifficulty,
  onDifficultyChange,
  onBack,
  className = '',
}) => {
  const theme = domainHeaders[domain];
  const IconComponent = theme.icon;
  const clampedMastery = Math.min(100, Math.max(0, masteryPercentage));

  return (
    <div
      className={`
        rounded-3xl border-2 bg-gradient-to-b ${theme.bgGradient} ${theme.borderColor}
        p-6 md:p-8 shadow-xl mb-8 ${className}
      `}
    >
      {/* Top Nav: Back to 4-Skills Hub & Quick Stats */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Cổng 4 Kỹ Năng
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-bold text-slate-300">
            <Award className={`w-4 h-4 ${theme.accentText}`} />
            <span>{tierTitle}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-black font-mono">
            <span className="text-slate-400">Mastery:</span>
            <span className={theme.accentText}>{clampedMastery}%</span>
          </div>
        </div>
      </div>

      {/* Main Hub Title Banner */}
      <div className="flex items-start gap-4 md:gap-6 mb-6">
        <div className={`p-4 md:p-5 rounded-3xl ${theme.iconBg} shrink-0 shadow-lg`}>
          <IconComponent className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {titleEn}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-wide mt-1">
            {titleVi}
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-medium mt-2 max-w-2xl">
            {description}
          </p>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80 mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span>Tiến độ thuần thục kỹ năng</span>
          <span className={`font-mono text-sm font-black ${theme.accentText}`}>
            {clampedMastery} / 100%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${theme.progressBg}`}
            style={{ width: `${clampedMastery}%` }}
          />
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Lọc cấp độ:
        </span>
        {filterTabs.map((tab) => {
          const isActive = selectedDifficulty === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onDifficultyChange(tab.id)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer
                ${
                  isActive
                    ? 'bg-slate-200 text-slate-950 shadow-[0_2px_0_#94a3b8]'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

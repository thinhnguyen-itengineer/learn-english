import React from 'react';
import { Star, Flame, Sparkles, Clock, Target, Play, Zap, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

export interface GameCardItemProps {
  code: string;
  title: string;
  description: string;
  pedagogicalFocus: string;
  difficultyTier: 'A1_A2' | 'B1_B2' | 'IELTS_ADVANCED';
  difficultyStars: number; // 1, 2, 3
  timeEstimate: string; // e.g. "30s / câu"
  isHot?: boolean;
  isNew?: boolean;
  isTidInspired?: boolean;
  onPlayPractice: (code: string) => void;
  onPlayRanked: (code: string) => void;
  className?: string;
}

const difficultyLabels = {
  A1_A2: { label: 'Cơ bản (A1 - A2)', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  B1_B2: { label: 'Trung cấp (B1 - B2)', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  IELTS_ADVANCED: { label: 'Học thuật (IELTS 6.5+)', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
};

export const GameCardItem: React.FC<GameCardItemProps> = ({
  code,
  title,
  description,
  pedagogicalFocus,
  difficultyTier,
  difficultyStars = 1,
  timeEstimate,
  isHot = false,
  isNew = false,
  isTidInspired = false,
  onPlayPractice,
  onPlayRanked,
  className = '',
}) => {
  const diff = difficultyLabels[difficultyTier] || difficultyLabels.B1_B2;

  return (
    <div
      className={`
        flex flex-col justify-between
        rounded-3xl bg-slate-900/90 border-2 border-slate-800
        p-6 transition-all duration-200
        hover:border-slate-700 hover:shadow-xl
        ${className}
      `}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diff.color}`}>
              {diff.label}
            </span>
            {isTidInspired && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                🎓 TID Inspired
              </span>
            )}
            {isHot && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/40">
                <Flame className="w-3 h-3 fill-current" />
                HOT
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Sparkles className="w-3 h-3" />
                NEW
              </span>
            )}
          </div>

          {/* Difficulty Stars */}
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < difficultyStars ? 'fill-amber-400' : 'text-slate-700 fill-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white tracking-wide mb-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
          {description}
        </p>

        {/* Pedagogical Focus Box */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3 mb-6">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-300">Rèn luyện trọng tâm: </span>
              <span className="text-slate-400">{pedagogicalFocus}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Thời lượng ước tính: <strong className="text-slate-300 font-mono">{timeEstimate}</strong></span>
          </div>
        </div>
      </div>

      {/* Two Action Buttons: Practice vs Ranked */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
        <Button
          variant="outline"
          size="md"
          onClick={() => onPlayPractice(code)}
          leftIcon={<Play className="w-4 h-4 fill-current" />}
        >
          Luyện Tập
        </Button>
        <Button
          variant="flame"
          size="md"
          onClick={() => onPlayRanked(code)}
          leftIcon={<Zap className="w-4 h-4 fill-current" />}
        >
          Đua Rank (3 Tim)
        </Button>
      </div>
    </div>
  );
};

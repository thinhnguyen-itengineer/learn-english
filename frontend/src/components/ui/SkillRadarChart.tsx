import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, Headphones, BookOpen, PenTool, Mic, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { SkillDomainCode } from './SkillDomainCard';

export interface SkillMasteryScores {
  listening: number; // 0 - 100
  reading: number;   // 0 - 100
  writing: number;   // 0 - 100
  speaking: number;  // 0 - 100
}

export interface SkillRadarChartProps {
  scores: SkillMasteryScores;
  selectedSkill?: SkillDomainCode;
  onSelectSkill?: (code: SkillDomainCode) => void;
  onSmartPickClick?: (code: SkillDomainCode) => void;
  className?: string;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  scores,
  selectedSkill,
  onSelectSkill,
  onSmartPickClick,
  className = '',
}) => {
  // Center is (160, 160), Radius is 110
  const cx = 160;
  const cy = 160;
  const maxR = 105;

  // Clamped scores (0 - 100)
  const l = Math.min(100, Math.max(5, scores.listening));
  const r = Math.min(100, Math.max(5, scores.reading));
  const w = Math.min(100, Math.max(5, scores.writing));
  const s = Math.min(100, Math.max(5, scores.speaking));

  // Determine lowest skill for Smart Pick recommendation
  const skillEntries: Array<{ code: SkillDomainCode; label: string; score: number; color: string; icon: any }> = [
    { code: 'LISTENING', label: 'Nghe', score: l, color: 'text-sky-400', icon: Headphones },
    { code: 'READING', label: 'Đọc', score: r, color: 'text-emerald-400', icon: BookOpen },
    { code: 'WRITING', label: 'Viết', score: w, color: 'text-amber-400', icon: PenTool },
    { code: 'SPEAKING', label: 'Nói', score: s, color: 'text-rose-400', icon: Mic },
  ];

  const lowestSkill = [...skillEntries].sort((a, b) => a.score - b.score)[0];
  const averageScore = Math.round((l + r + w + s) / 4);

  // Coordinate computation:
  // Top: Listening (x = cx, y = cy - (score/100)*maxR)
  // Right: Reading (x = cx + (score/100)*maxR, y = cy)
  // Bottom: Writing (x = cx, y = cy + (score/100)*maxR)
  // Left: Speaking (x = cx - (score/100)*maxR, y = cy)

  const getPolygonPoints = (scale: number) => {
    const top = `${cx},${cy - maxR * scale}`;
    const right = `${cx + maxR * scale},${cy}`;
    const bottom = `${cx},${cy + maxR * scale}`;
    const left = `${cx - maxR * scale},${cy}`;
    return `${top} ${right} ${bottom} ${left}`;
  };

  const userPolygonPoints = `
    ${cx},${cy - (l / 100) * maxR} 
    ${cx + (r / 100) * maxR},${cy} 
    ${cx},${cy + (w / 100) * maxR} 
    ${cx - (s / 100) * maxR},${cy}
  `.trim();

  return (
    <div className={`flex flex-col rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 shadow-xl ${className}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Ma Trận Cân Bằng 4 Kỹ Năng
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mục tiêu phát triển đồng đều, loại bỏ học lệch
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 font-semibold">Điểm Toàn Diện</span>
          <span className="text-xl font-black text-yellow-400 font-mono">
            {averageScore}%
          </span>
        </div>
      </div>

      {/* SVG Radar Chart Box */}
      <div className="relative flex items-center justify-center py-2">
        <svg
          viewBox="0 0 320 320"
          className="w-full max-w-[280px] sm:max-w-[320px] aspect-square overflow-visible"
        >
          <defs>
            {/* Gradient for user polygon */}
            <linearGradient id="radarUserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
            </linearGradient>
            {/* Filter for glow */}
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric grid rings (25%, 50%, 75%, 100%) */}
          {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
            <polygon
              key={level}
              points={getPolygonPoints(level)}
              fill="none"
              stroke="#334155"
              strokeWidth={idx === 3 ? '2' : '1'}
              strokeDasharray={idx === 3 ? 'none' : '3 3'}
              opacity="0.7"
            />
          ))}

          {/* Axes */}
          <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke="#475569" strokeWidth="1.5" />
          <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke="#475569" strokeWidth="1.5" />

          {/* Center Point */}
          <circle cx={cx} cy={cy} r="3" fill="#64748b" />

          {/* User Score Polygon Area */}
          <polygon
            points={userPolygonPoints}
            fill="url(#radarUserGrad)"
            stroke="#38bdf8"
            strokeWidth="3"
            filter="url(#radarGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Vertices Data Dots */}
          {/* Top: Listening */}
          <circle
            cx={cx}
            cy={cy - (l / 100) * maxR}
            r="6"
            fill="#38bdf8"
            stroke="#082f49"
            strokeWidth="2"
            className="cursor-pointer hover:scale-125 transition-transform"
            onClick={() => onSelectSkill?.('LISTENING')}
          />
          {/* Right: Reading */}
          <circle
            cx={cx + (r / 100) * maxR}
            cy={cy}
            r="6"
            fill="#34d399"
            stroke="#022c22"
            strokeWidth="2"
            className="cursor-pointer hover:scale-125 transition-transform"
            onClick={() => onSelectSkill?.('READING')}
          />
          {/* Bottom: Writing */}
          <circle
            cx={cx}
            cy={cy + (w / 100) * maxR}
            r="6"
            fill="#fbbf24"
            stroke="#451a03"
            strokeWidth="2"
            className="cursor-pointer hover:scale-125 transition-transform"
            onClick={() => onSelectSkill?.('WRITING')}
          />
          {/* Left: Speaking */}
          <circle
            cx={cx - (s / 100) * maxR}
            cy={cy}
            r="6"
            fill="#fb7185"
            stroke="#4c0519"
            strokeWidth="2"
            className="cursor-pointer hover:scale-125 transition-transform"
            onClick={() => onSelectSkill?.('SPEAKING')}
          />

          {/* Axis Vertex Labels with Percentages */}
          {/* Top Label: Listening */}
          <text
            x={cx}
            y={cy - maxR - 16}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer select-none"
            onClick={() => onSelectSkill?.('LISTENING')}
          >
            🎧 Nghe {l}%
          </text>

          {/* Right Label: Reading */}
          <text
            x={cx + maxR + 10}
            y={cy + 4}
            textAnchor="start"
            fill="#34d399"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer select-none"
            onClick={() => onSelectSkill?.('READING')}
          >
            📖 Đọc {r}%
          </text>

          {/* Bottom Label: Writing */}
          <text
            x={cx}
            y={cy + maxR + 24}
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer select-none"
            onClick={() => onSelectSkill?.('WRITING')}
          >
            ✍️ Viết {w}%
          </text>

          {/* Left Label: Speaking */}
          <text
            x={cx - maxR - 10}
            y={cy + 4}
            textAnchor="end"
            fill="#fb7185"
            fontSize="12"
            fontWeight="bold"
            className="cursor-pointer select-none"
            onClick={() => onSelectSkill?.('SPEAKING')}
          >
            🗣️ Nói {s}%
          </text>
        </svg>
      </div>

      {/* Smart Pick Recommendation Alert Box */}
      <div className="mt-4 rounded-2xl bg-slate-950/70 border border-yellow-500/30 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                Gợi ý nâng cao độ cân bằng (Smart Pick)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kỹ năng <strong className={lowestSkill.color}>[{lowestSkill.label}]</strong> của bạn đang ở mức{' '}
              <strong className="font-mono text-white">{lowestSkill.score}%</strong>. Hãy hoàn thành 1 bài luyện tập để kéo đều ma trận kỹ năng!
            </p>
            <div className="mt-3">
              <Button
                variant="gold"
                size="sm"
                onClick={() => onSmartPickClick?.(lowestSkill.code)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                ⚡ Luyện Tập Kỹ Năng {lowestSkill.label} Ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

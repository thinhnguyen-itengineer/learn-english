import React from 'react';
import {
  Smile,
  HelpCircle,
  CheckCircle2,
  Flame,
  AlertCircle,
  Sparkles,
  Trophy,
  Frown,
  Play,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type AnimationState3D =
  | 'IDLE'
  | 'THINKING'
  | 'CORRECT'
  | 'STREAK'
  | 'CONFUSED'
  | 'TRYON'
  | 'VICTORY'
  | 'DEFEAT';

export interface AnimationDefinition {
  id: AnimationState3D;
  label: string;
  shortLabel: string;
  gestureDescription: string;
  vfx: string;
  icon: React.ReactNode;
  activeColor: string;
  badgeBg: string;
  durationMs: number;
}

export const ANIMATION_DEFINITIONS: AnimationDefinition[] = [
  {
    id: 'IDLE',
    label: 'Thư Giãn (Idle)',
    shortLabel: 'Nghỉ ngơi',
    gestureDescription: 'Nhún nhảy nhịp nhàng 60 BPM, chớp mắt thân thiện',
    vfx: 'Chuyển động thở nhẹ',
    icon: <Smile className="w-3.5 h-3.5" />,
    activeColor: 'text-slate-200 border-slate-400 bg-slate-800',
    badgeBg: 'bg-slate-700',
    durationMs: 3000,
  },
  {
    id: 'THINKING',
    label: 'Đang Suy Nghĩ (Thinking)',
    shortLabel: 'Suy nghĩ',
    gestureDescription: 'Ngón trỏ đặt lên cằm, nghiêng đầu 15°, mắt ngước lên',
    vfx: 'Bong bóng suy nghĩ (...)',
    icon: <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />,
    activeColor: 'text-cyan-300 border-cyan-400 bg-cyan-950/60 shadow-glow-cyan',
    badgeBg: 'bg-cyan-600',
    durationMs: 2500,
  },
  {
    id: 'CORRECT',
    label: 'Trả Lời Đúng (Correct)',
    shortLabel: 'Đúng',
    gestureDescription: 'Nở nụ cười tươi, giơ hai tay chữ V chiến thắng',
    vfx: 'Vòng sáng xanh ngọc tỏa nhẹ',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    activeColor: 'text-emerald-300 border-emerald-400 bg-emerald-950/60 shadow-glow-emerald',
    badgeBg: 'bg-emerald-600',
    durationMs: 1500,
  },
  {
    id: 'STREAK',
    label: 'Chuỗi Rực Lửa (Streak Fire)',
    shortLabel: 'Chuỗi 🔥',
    gestureDescription: 'Lộn nhào 360°, tiếp đất kiêu hãnh với ánh mắt rực lửa',
    vfx: 'Hào quang lửa bùng cháy quanh chân',
    icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
    activeColor: 'text-orange-300 border-orange-400 bg-orange-950/60 shadow-glow-flame',
    badgeBg: 'bg-orange-600',
    durationMs: 2000,
  },
  {
    id: 'CONFUSED',
    label: 'Bối Rối / Sai (Confused)',
    shortLabel: 'Sai',
    gestureDescription: 'Đưa tay gãi đầu, người chùng xuống, mắt xoay bối rối',
    vfx: 'Đốm mồ hôi rơi 💧',
    icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
    activeColor: 'text-rose-300 border-rose-400 bg-rose-950/60',
    badgeBg: 'bg-rose-600',
    durationMs: 1800,
  },
  {
    id: 'TRYON',
    label: 'Thử Đồ Lấp Lánh (Try-On)',
    shortLabel: 'Thử đồ ✨',
    gestureDescription: 'Xoay nhẹ 1 vòng khoe đồ mới, tay chỉ vào trang phục',
    vfx: 'Ngôi sao lấp lánh (Sparkle Particles)',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
    activeColor: 'text-amber-300 border-amber-400 bg-amber-950/60 shadow-glow-tryon',
    badgeBg: 'bg-amber-600',
    durationMs: 1200,
  },
  {
    id: 'VICTORY',
    label: 'Chiến Thắng 1v1 (Victory)',
    shortLabel: 'Thắng 🏆',
    gestureDescription: 'Vũ điệu Chibi Dance sôi động, lộn nhào vẫy cờ',
    vfx: 'Pháo hoa Confetti tung bay rực rỡ',
    icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />,
    activeColor: 'text-yellow-300 border-yellow-400 bg-yellow-950/60 shadow-glow-gold',
    badgeBg: 'bg-yellow-500',
    durationMs: 3500,
  },
  {
    id: 'DEFEAT',
    label: 'Tiếc Nuối / Hết Tim (Defeat)',
    shortLabel: 'Thua 😢',
    gestureDescription: 'Ngồi bệt xuống sàn, hai tay ôm gối buồn bã',
    vfx: 'Mây xám nhỏ mưa bay',
    icon: <Frown className="w-3.5 h-3.5 text-purple-400" />,
    activeColor: 'text-purple-300 border-purple-400 bg-purple-950/60',
    badgeBg: 'bg-purple-600',
    durationMs: 2500,
  },
];

export interface AnimationStateHUDProps {
  /** Currently playing animation state */
  activeAnimation?: AnimationState3D;
  /** Callback triggered when user clicks to test an animation */
  onTriggerAnimation?: (state: AnimationState3D) => void;
  /** Whether to fire confetti automatically on VICTORY state */
  fireConfettiOnVictory?: boolean;
  /** Compact floating mode */
  compact?: boolean;
  /** Custom container class */
  className?: string;
}

export const AnimationStateHUD: React.FC<AnimationStateHUDProps> = ({
  activeAnimation = 'IDLE',
  onTriggerAnimation,
  fireConfettiOnVictory = true,
  compact = false,
  className = '',
}) => {
  const currentDef =
    ANIMATION_DEFINITIONS.find((a) => a.id === activeAnimation) || ANIMATION_DEFINITIONS[0];

  const handleSelect = (anim: AnimationDefinition) => {
    if (anim.id === 'VICTORY' && fireConfettiOnVictory) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // Ignore canvas confetti errors in non-browser envs
      }
    }
    onTriggerAnimation?.(anim.id);
  };

  return (
    <div
      className={`z-20 flex flex-col gap-2 select-none pointer-events-auto transition-all ${className}`}
      role="region"
      aria-label="3D Avatar Animation States Controller"
    >
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-xl text-white flex flex-col gap-2">
        {/* Header: Current Active Animation Status */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="text-[11px] font-bold text-slate-300">Biểu cảm Chibi:</span>
            <span className="text-xs font-black text-cyan-300 flex items-center gap-1">
              {currentDef.icon}
              {currentDef.label}
            </span>
          </div>

          {activeAnimation !== 'IDLE' && onTriggerAnimation && (
            <button
              type="button"
              onClick={() => onTriggerAnimation('IDLE')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 flex items-center gap-1 transition-colors"
              title="Về trạng thái nghỉ (IDLE)"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset Idle
            </button>
          )}
        </div>

        {/* 8 Animation State Trigger Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {ANIMATION_DEFINITIONS.map((anim) => {
            const isSelected = activeAnimation === anim.id;

            return (
              <button
                key={anim.id}
                type="button"
                onClick={() => handleSelect(anim)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${anim.activeColor} border-2 scale-[1.03] shadow-md`
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/70 hover:border-slate-500'
                }`}
                title={`${anim.gestureDescription} (${anim.vfx})`}
              >
                <span>{anim.icon}</span>
                <span>{compact ? anim.shortLabel : anim.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Caption description of current gesture */}
        <div className="px-1 text-[10px] text-slate-400 font-medium flex items-center justify-between border-t border-slate-800/70 pt-1.5">
          <span className="truncate">👉 {currentDef.gestureDescription}</span>
          <span className="text-cyan-400/80 shrink-0 font-mono text-[9px] ml-2">VFX: {currentDef.vfx}</span>
        </div>
      </div>
    </div>
  );
};

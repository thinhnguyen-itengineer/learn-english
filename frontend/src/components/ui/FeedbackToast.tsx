import React from 'react';
import { Flame, Zap, WifiOff, CheckCircle2, AlertTriangle } from 'lucide-react';

export type FeedbackType = 'combo' | 'speed_bonus' | 'disconnect_warning' | 'reconnected' | 'forfeit';

export interface FeedbackToastProps {
  type: FeedbackType;
  comboCount?: number;
  bonusPoints?: number;
  graceSeconds?: number;
  message?: string;
  className?: string;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type,
  comboCount = 2,
  bonusPoints = 50,
  graceSeconds = 15,
  message,
  className = '',
}) => {
  if (type === 'combo') {
    const comboTitles: Record<number, string> = {
      2: 'COMBO X2!',
      3: 'ON FIRE! X3',
      4: 'UNSTOPPABLE! X4',
    };
    const title = comboTitles[comboCount] || `GODLIKE! X${comboCount}`;

    return (
      <div
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-2xl
          bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-sm sm:text-base
          shadow-[0_0_20px_rgba(249,115,22,0.6)] border-2 border-yellow-200
          animate-pop-bounce select-none pointer-events-none
          ${className}
        `}
      >
        <Flame className="w-5 h-5 fill-yellow-200 text-yellow-200 animate-bounce" />
        <span className="tracking-wide uppercase">{title}</span>
      </div>
    );
  }

  if (type === 'speed_bonus') {
    return (
      <div
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
          bg-blue-600/90 text-white font-black text-xs sm:text-sm
          shadow-[0_0_15px_rgba(59,130,246,0.6)] border border-blue-300
          animate-pop-bounce select-none pointer-events-none
          ${className}
        `}
      >
        <Zap className="w-4 h-4 fill-cyan-300 text-cyan-300" />
        <span>+{bonusPoints} TỐC ĐỘ!</span>
      </div>
    );
  }

  if (type === 'disconnect_warning') {
    return (
      <div
        className={`
          flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
          bg-rose-950/90 border-2 border-rose-500/80 text-rose-200 text-xs sm:text-sm font-bold
          shadow-[0_0_20px_rgba(244,63,94,0.4)] backdrop-blur-md animate-pulse select-none
          ${className}
        `}
      >
        <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
        <span>
          {message || `Đối thủ đang gặp sự cố mạng... Đang chờ kết nối lại (${graceSeconds}s)`}
        </span>
      </div>
    );
  }

  if (type === 'reconnected') {
    return (
      <div
        className={`
          flex items-center gap-2.5 px-4 py-2 rounded-2xl
          bg-emerald-950/90 border-2 border-emerald-500 text-emerald-200 text-xs sm:text-sm font-bold
          shadow-[0_0_15px_rgba(16,185,129,0.4)] backdrop-blur-md animate-in fade-in select-none
          ${className}
        `}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{message || 'Đối thủ đã kết nối lại thành công! Trận đấu tiếp tục.'}</span>
      </div>
    );
  }

  if (type === 'forfeit') {
    return (
      <div
        className={`
          flex items-center gap-2.5 px-4 py-2.5 rounded-2xl
          bg-amber-950/90 border-2 border-amber-500 text-amber-200 text-xs sm:text-sm font-bold
          shadow-[0_0_15px_rgba(245,158,11,0.4)] backdrop-blur-md select-none
          ${className}
        `}
      >
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{message || 'Đối thủ đã rời trận đấu! Chiến thắng thuộc về bạn.'}</span>
      </div>
    );
  }

  return null;
};

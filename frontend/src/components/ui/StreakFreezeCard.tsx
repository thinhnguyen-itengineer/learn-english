import React from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Coins, 
  Clock, 
  Check, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Snowflake
} from 'lucide-react';
import { Button } from './Button';

export interface StreakFreezeCardProps {
  currentStreak: number;
  maxStreak: number;
  freezeCount: number; // 0, 1, or 2
  maxFreezes?: number; // default 2
  freezePriceCoins?: number; // default 100
  userCoins: number;
  isFrozenYesterday?: boolean;
  canRepairStreak?: boolean;
  repairPriceCoins?: number; // default 200
  repairTimeLeftHours?: number; // e.g. 18 hours left
  onBuyFreeze?: () => void;
  onRepairStreak?: () => void;
  isLoading?: boolean;
}

export const StreakFreezeCard: React.FC<StreakFreezeCardProps> = ({
  currentStreak,
  maxStreak,
  freezeCount,
  maxFreezes = 2,
  freezePriceCoins = 100,
  userCoins,
  isFrozenYesterday = false,
  canRepairStreak = false,
  repairPriceCoins = 200,
  repairTimeLeftHours = 24,
  onBuyFreeze,
  onRepairStreak,
  isLoading = false,
}) => {
  const isInventoryFull = freezeCount >= maxFreezes;
  const canAffordFreeze = userCoins >= freezePriceCoins;
  const canAffordRepair = userCoins >= repairPriceCoins;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-sky-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5 md:p-7 shadow-[0_8px_30px_rgba(56,189,248,0.2)]">
      {/* Background Frost Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Header: Flame & Frost Harmony */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-3d-amber">
            <Flame className="w-7 h-7 animate-pulse-fast fill-amber-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-black text-white">
                {currentStreak} <span className="text-amber-400 text-base md:text-lg font-bold">Ngày Chuỗi</span>
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                Kỷ lục: {maxStreak} ngày
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              Duy trì ít nhất 10 XP mỗi ngày để giữ vững ngọn lửa học tập!
            </p>
          </div>
        </div>

        {/* User Coin Balance */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-black text-yellow-300">
            {userCoins.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-slate-400">Coins</span>
        </div>
      </div>

      {/* Yesterday Frozen Notification */}
      {isFrozenYesterday && (
        <div className="mb-5 rounded-2xl bg-sky-950/70 border border-sky-500/50 p-4 flex items-center gap-3 text-sky-200">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <Snowflake className="w-5 h-5 animate-ice-sparkle" />
          </div>
          <div className="text-xs md:text-sm">
            <span className="font-black text-white">Băng Bảo Vệ Đã Tự Kích Hoạt! 🧊</span> Chuỗi {currentStreak} ngày của bạn hôm qua đã được cứu an toàn. Đừng quên mua bổ sung nhé!
          </div>
        </div>
      )}

      {/* Main Grid: Streak Freeze Inventory & Shop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Left: Inventory Slots */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Hòm Đồ Bảo Vệ Chuỗi
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {freezeCount} / {maxFreezes} ô
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Tự động đóng băng chuỗi vào lúc nửa đêm nếu bạn lỡ quên học trong ngày.
            </p>

            {/* 2 Shield / Freeze Slots */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {Array.from({ length: maxFreezes }).map((_, index) => {
                const isEquipped = index < freezeCount;
                return (
                  <div
                    key={index}
                    className={`relative rounded-2xl p-4 flex flex-col items-center justify-center text-center border-2 transition-all ${
                      isEquipped
                        ? 'bg-gradient-to-b from-sky-950/70 to-slate-900 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'bg-slate-900/40 border-dashed border-slate-700 text-slate-500'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <div className="p-2.5 rounded-full bg-sky-500/20 text-sky-300 mb-2 border border-sky-400/40">
                          <Snowflake className="w-6 h-6 animate-ice-sparkle" />
                        </div>
                        <span className="text-xs font-black text-sky-200">Đã Trang Bị</span>
                        <span className="text-[10px] text-sky-400 font-semibold">Tự động cứu chuỗi</span>
                      </>
                    ) : (
                      <>
                        <div className="p-2.5 rounded-full bg-slate-800 text-slate-600 mb-2">
                          <Snowflake className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Ô Trống #{index + 1}</span>
                        <span className="text-[10px] text-slate-600">Chưa mua</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
            <Check className="w-3.5 h-3.5 text-teal-400" />
            Giới hạn tối đa 2 Băng Bảo Vệ để giữ tính cân bằng trò chơi.
          </div>
        </div>

        {/* Right: Shop Purchase Card */}
        <div className="rounded-2xl bg-slate-800/80 border-2 border-sky-500/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Cửa Hàng Vật Phẩm
              </span>
              <div className="flex items-center gap-1 text-sm font-black text-yellow-400 bg-yellow-950/60 px-2.5 py-0.5 rounded-lg border border-yellow-700/40">
                <Coins className="w-4 h-4" />
                {freezePriceCoins} Coins
              </div>
            </div>

            <h4 className="text-base font-black text-white mb-1">
              Băng Bảo Vệ Chuỗi (Streak Freeze)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Cứu trọn vẹn chuỗi học tập của bạn qua 1 ngày nghỉ ngơi hoặc bận rộn đột xuất mà không sợ mất chuỗi.
            </p>
          </div>

          <div className="pt-2">
            {isInventoryFull ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-center text-xs font-bold text-slate-400">
                Đã đạt giới hạn tối đa ({maxFreezes}/{maxFreezes})
              </div>
            ) : !canAffordFreeze ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-rose-950/50 border border-rose-800/50 text-center text-xs font-bold text-rose-300">
                Không đủ Coins (Cần {freezePriceCoins} Coins)
              </div>
            ) : (
              <Button
                variant="ice"
                size="md"
                fullWidth
                isLoading={isLoading}
                onClick={onBuyFreeze}
                leftIcon={<Snowflake className="w-4 h-4" />}
                className="shadow-3d-ice"
              >
                Mua Thêm Băng Bảo Vệ (100 Coins)
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 24-Hour Streak Repair Banner (If Streak is broken) */}
      {canRepairStreak && (
        <div className="rounded-2xl bg-gradient-to-r from-orange-950/70 via-red-950/70 to-slate-900 border-2 border-orange-500/60 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-orange-400 bg-orange-950 px-2 py-0.5 rounded-md border border-orange-700/50">
                  Cứu Chuỗi Khẩn Cấp (24h Window)
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Còn {repairTimeLeftHours} giờ
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 font-medium mt-1">
                Lỡ mất chuỗi? Bạn có thể khôi phục lại chuỗi ngày đã mất trước khi cửa sổ 24 giờ đóng lại!
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="flame"
              size="md"
              isLoading={isLoading}
              disabled={!canAffordRepair}
              onClick={onRepairStreak}
              rightIcon={<Coins className="w-4 h-4 text-yellow-300" />}
              className="shadow-[0_4px_0_#c2410c]"
            >
              Cứu Chuỗi ({repairPriceCoins} Coins)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

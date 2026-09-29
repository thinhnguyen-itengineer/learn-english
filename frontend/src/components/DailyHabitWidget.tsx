import React, { useState, useEffect } from 'react';
import { Flame, Shield, Sun, Coffee, Moon, Sparkles, Gift, Check, AlertTriangle, ShoppingBag, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRetentionStore } from '../services/useRetentionStore';
import { soundManager } from '../utils/sound';

export const DailyHabitWidget: React.FC = () => {
  const { habitSummary, loadHabits, claimChest, buyStreakFreeze, repairStreak } = useRetentionStore();
  const [shopOpen, setShopOpen] = useState<boolean>(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  if (!habitSummary) return null;

  const handleClaimChest = async (type: 'EarlyBird' | 'Midday' | 'NightOwl') => {
    setClaiming(type);
    soundManager.playClick();
    try {
      const res = await claimChest(type);
      soundManager.playCorrect();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      soundManager.playWrong();
      setActionMessage(err.message || 'Chưa đến khung giờ mở hòm hoặc đã nhận hôm nay!');
      setTimeout(() => setActionMessage(null), 4000);
    } finally {
      setClaiming(null);
    }
  };

  const handleBuyFreeze = async () => {
    soundManager.playClick();
    try {
      const res = await buyStreakFreeze();
      if (res.success) {
        soundManager.playCorrect();
        confetti({ particleCount: 50, spread: 50 });
      } else {
        soundManager.playWrong();
      }
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage(err.message);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleRepair = async () => {
    soundManager.playClick();
    try {
      const res = await repairStreak();
      if (res.success) {
        soundManager.playCorrect();
        confetti({ particleCount: 90, spread: 70 });
      }
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      setActionMessage(err.message);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const chests = habitSummary.chests;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Top Bar: Streak & Freeze Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-400 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6 fill-orange-500/30 animate-pulse text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white tracking-tight">
                {habitSummary.currentStreak} Ngày
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">
                Kỷ lục: {habitSummary.maxStreak}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {habitSummary.isStreakProtectedToday
                ? 'Chuỗi học hôm nay đã được bảo vệ an toàn!'
                : 'Hãy hoàn thành 1 bài học để duy trì ngọn lửa chuỗi ngày!'}
            </p>
          </div>
        </div>

        {/* Freeze Inventory & Shop Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            <span>Băng bảo vệ: {habitSummary.streakFreezeCount} / {habitSummary.maxAllowedFreeze}</span>
          </div>

          <button
            onClick={() => setShopOpen(true)}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-semibold flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Cửa hàng</span>
          </button>
        </div>
      </div>

      {/* Grace period warning if broken */}
      {habitSummary.isStreakInGracePeriod && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Chuỗi của bạn vừa bị đứt! Bạn có 24h để cứu lại chuỗi ngày.</span>
          </div>
          <button
            onClick={handleRepair}
            className="px-3 py-1 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition-all shadow-md shadow-rose-500/20"
          >
            Cứu chuỗi (200 Xu)
          </button>
        </div>
      )}

      {/* Notification banner */}
      {actionMessage && (
        <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs font-medium text-center animate-in fade-in">
          {actionMessage}
        </div>
      )}

      {/* 3 Chests Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Early Bird Chest */}
        <div className={`p-4 rounded-2xl border transition-all ${
          chests.earlyBird.claimed
            ? 'bg-slate-800/30 border-slate-800 text-slate-500'
            : chests.earlyBird.available
            ? 'bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-500/40 shadow-lg shadow-amber-500/5'
            : 'bg-slate-800/50 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Hòm Bình Minh</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {chests.earlyBird.window}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Thưởng: +15 Xu & +30 XP Booster</p>
          <button
            disabled={!chests.earlyBird.available || chests.earlyBird.claimed || claiming !== null}
            onClick={() => handleClaimChest('EarlyBird')}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chests.earlyBird.claimed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : chests.earlyBird.available
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-400 cursor-not-allowed'
            }`}
          >
            {chests.earlyBird.claimed ? (
              <>
                <Check className="w-3.5 h-3.5" /> Đã mở hôm nay
              </>
            ) : (
              <>
                <Gift className="w-3.5 h-3.5" /> Mở Hòm Sáng
              </>
            )}
          </button>
        </div>

        {/* Midday Chest */}
        <div className={`p-4 rounded-2xl border transition-all ${
          chests.midday.claimed
            ? 'bg-slate-800/30 border-slate-800 text-slate-500'
            : chests.midday.available
            ? 'bg-gradient-to-b from-cyan-500/10 to-cyan-500/5 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
            : 'bg-slate-800/50 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
              <Coffee className="w-4 h-4 text-cyan-400" />
              <span>Hòm Năng Lượng</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {chests.midday.window}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Thưởng: +20 Xu & 1 Vé Đấu 1v1</p>
          <button
            disabled={!chests.midday.available || chests.midday.claimed || claiming !== null}
            onClick={() => handleClaimChest('Midday')}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chests.midday.claimed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : chests.midday.available
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 cursor-not-allowed'
            }`}
          >
            {chests.midday.claimed ? (
              <>
                <Check className="w-3.5 h-3.5" /> Đã mở hôm nay
              </>
            ) : (
              <>
                <Gift className="w-3.5 h-3.5" /> Mở Hòm Trưa
              </>
            )}
          </button>
        </div>

        {/* Night Owl Chest */}
        <div className={`p-4 rounded-2xl border transition-all ${
          chests.nightOwl.claimed
            ? 'bg-slate-800/30 border-slate-800 text-slate-500'
            : chests.nightOwl.available
            ? 'bg-gradient-to-b from-purple-500/10 to-purple-500/5 border-purple-500/40 shadow-lg shadow-purple-500/5'
            : 'bg-slate-800/50 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Hòm Báu Ngày</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {chests.nightOwl.window}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Thưởng: +50 Xu & +100 XP Đột Phá</p>
          <button
            disabled={!chests.nightOwl.available || chests.nightOwl.claimed || claiming !== null}
            onClick={() => handleClaimChest('NightOwl')}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chests.nightOwl.claimed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : chests.nightOwl.available
                ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-800/80 text-slate-400 cursor-not-allowed'
            }`}
          >
            {chests.nightOwl.claimed ? (
              <>
                <Check className="w-3.5 h-3.5" /> Đã mở hôm nay
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Mở Hòm Tối
              </>
            )}
          </button>
        </div>
      </div>

      {/* Shop Modal */}
      {shopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Cửa Hàng Vật Phẩm Chuỗi</h3>
              </div>
              <button
                onClick={() => setShopOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">Băng Bảo Vệ Chuỗi (Streak Freeze)</h4>
                    <p className="text-xs text-slate-400">Tự động kích hoạt khi bạn bận không thể học.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-700/60">
                <span className="text-slate-400">Hiện có: {habitSummary.streakFreezeCount} / 2 bình</span>
                <span className="font-extrabold text-amber-400">100 Xu</span>
              </div>

              <button
                disabled={habitSummary.streakFreezeCount >= 2}
                onClick={handleBuyFreeze}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  habitSummary.streakFreezeCount >= 2
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                }`}
              >
                {habitSummary.streakFreezeCount >= 2 ? 'Túi đồ đã đầy (Tối đa 2)' : 'Mua Ngay (100 Xu)'}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShopOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

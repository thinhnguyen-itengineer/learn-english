import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Swords,
  Coins,
  Shirt,
  ShoppingBag,
  Share2,
  CheckCircle2,
  Calendar,
  Clock,
  History,
  TrendingUp,
} from 'lucide-react';
import { AvatarRenderer, AvatarPresetConfig } from './AvatarRenderer';
import { TokenBalanceBadge } from './TokenBalanceBadge';
import { Button } from './Button';

export interface UserBadgeInfo {
  id: string;
  code: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  description: string;
  icon: string;
  isUnlocked: boolean;
  isShowcased?: boolean;
  unlockedAt?: string;
  progressPercent?: number;
}

export interface ActivityHistoryItem {
  id: string;
  activityType: 'four_skills_lesson' | 'core_minigame' | 'battle_1v1' | 'shop_purchase' | 'chest_claim';
  title: string;
  tokensDelta: number;
  xpGained?: number;
  timeAgo: string;
  isVictory?: boolean;
}

export interface UserProfileShowcaseCardProps {
  displayName: string;
  level: number;
  customTitle?: string;
  bio?: string;
  tokenBalance: number;
  streakDays: number;
  maxStreakDays?: number;
  totalXp: number;
  eloRating?: number;
  rankName?: string;
  avatarPreset?: AvatarPresetConfig;
  skillProficiency?: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  badges?: UserBadgeInfo[];
  recentActivities?: ActivityHistoryItem[];
  onOpenCustomizer?: () => void;
  onOpenShop?: () => void;
  onShareProfile?: () => void;
  onToggleShowcaseBadge?: (badgeId: string) => void;
  className?: string;
}

const DEFAULT_BADGES: UserBadgeInfo[] = [
  {
    id: 'b1',
    code: 'bug_slayer',
    name: 'Bug Slayer',
    tier: 'gold',
    description: 'Bắt chính xác 100 lỗi ngữ pháp trong Grammar Detective',
    icon: '🐛',
    isUnlocked: true,
    isShowcased: true,
  },
  {
    id: 'b2',
    code: 'combo_master',
    name: 'Combo Master',
    tier: 'diamond',
    description: 'Đạt chuỗi Combo x15 trong màn chơi Speed Falling Word',
    icon: '⚡',
    isUnlocked: true,
    isShowcased: true,
  },
  {
    id: 'b3',
    code: 'night_owl',
    name: 'Night Owl',
    tier: 'silver',
    description: 'Hoàn thành 14 buổi học trong khung giờ Hòm Tối',
    icon: '🦉',
    isUnlocked: true,
    isShowcased: true,
  },
  {
    id: 'b4',
    code: 'streak_keeper',
    name: 'Streak Keeper 30D',
    tier: 'gold',
    description: 'Giữ chuỗi học tập liên tục không ngắt quãng trong 30 ngày',
    icon: '🔥',
    isUnlocked: true,
    isShowcased: false,
  },
  {
    id: 'b5',
    code: 'oxford_scholar',
    name: 'Oxford Scholar',
    tier: 'bronze',
    description: 'Hoàn thành trọn vẹn 50 bài học đọc hiểu chuyên sâu',
    icon: '📚',
    isUnlocked: true,
    isShowcased: false,
  },
  {
    id: 'b6',
    code: 'battle_champion',
    name: 'Battle Champion',
    tier: 'diamond',
    description: 'Giành chiến thắng 50 trận đấu đối kháng 1v1',
    icon: '⚔️',
    isUnlocked: true,
    isShowcased: false,
  },
  {
    id: 'b7',
    code: 'dictation_ace',
    name: 'Dictation Ace',
    tier: 'silver',
    description: 'Đạt độ chính xác 100% trong 20 bài chép chính tả Dictation Dash',
    icon: '🎧',
    isUnlocked: false,
    isShowcased: false,
    progressPercent: 65,
  },
  {
    id: 'b8',
    code: 'fashion_icon',
    name: 'Fashion Icon',
    tier: 'gold',
    description: 'Sở hữu ít nhất 10 vật phẩm trang phục trong Shop',
    icon: '👑',
    isUnlocked: false,
    isShowcased: false,
    progressPercent: 80,
  },
];

const DEFAULT_ACTIVITIES: ActivityHistoryItem[] = [
  {
    id: 'a1',
    activityType: 'battle_1v1',
    title: 'Thắng Trận 1v1 Battle (vs. Elena)',
    tokensDelta: 25,
    xpGained: 50,
    timeAgo: '15 phút trước',
    isVictory: true,
  },
  {
    id: 'a2',
    activityType: 'shop_purchase',
    title: 'Mua Áo Khoác Cyber Neon Hoodie',
    tokensDelta: -850,
    timeAgo: '2 giờ trước',
  },
  {
    id: 'a3',
    activityType: 'chest_claim',
    title: 'Mở Hòm Nhiệm Vụ Giữa Trưa',
    tokensDelta: 25,
    timeAgo: '5 giờ trước',
  },
  {
    id: 'a4',
    activityType: 'four_skills_lesson',
    title: 'Hoàn thành Bài Đọc Hiểu B2 (100% Điểm)',
    tokensDelta: 23,
    xpGained: 60,
    timeAgo: 'Hôm qua',
  },
];

export const UserProfileShowcaseCard: React.FC<UserProfileShowcaseCardProps> = ({
  displayName = 'Trần Văn An',
  level = 28,
  customTitle = 'Bậc Thầy Ngữ Pháp',
  bio = 'Chăm chỉ mỗi ngày 15 phút để làm chủ từ vựng và tự tin giao tiếp cùng bạn bè!',
  tokenBalance = 3450,
  streakDays = 45,
  maxStreakDays = 60,
  totalXp = 18250,
  eloRating = 1850,
  rankName = 'Kim Cương II',
  avatarPreset = {},
  skillProficiency = {
    listening: 85,
    speaking: 70,
    reading: 92,
    writing: 78,
  },
  badges = DEFAULT_BADGES,
  recentActivities = DEFAULT_ACTIVITIES,
  onOpenCustomizer,
  onOpenShop,
  onShareProfile,
  onToggleShowcaseBadge,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'history'>('overview');

  // Radar points geometry
  const radarCenter = 100;
  const radarRadius = 70;
  const { listening, speaking, reading, writing } = skillProficiency;

  // Radar point coordinates (Listening: Top, Reading: Right, Writing: Bottom, Speaking: Left)
  const lX = radarCenter;
  const lY = radarCenter - (listening / 100) * radarRadius;

  const rX = radarCenter + (reading / 100) * radarRadius;
  const rY = radarCenter;

  const wX = radarCenter;
  const wY = radarCenter + (writing / 100) * radarRadius;

  const sX = radarCenter - (speaking / 100) * radarRadius;
  const sY = radarCenter;

  const radarPolygonPoints = `${lX},${lY} ${rX},${rY} ${wX},${wY} ${sX},${sY}`;

  // Showcase badges (max 3)
  const showcasedBadges = badges.filter((b) => b.isShowcased && b.isUnlocked).slice(0, 3);

  return (
    <div
      className={`
        relative w-full max-w-5xl mx-auto rounded-3xl bg-slate-900/95 border-2 border-slate-700/80
        shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden select-none
        ${className}
      `}
    >
      {/* Top Banner Cover */}
      <div className="relative h-32 sm:h-40 w-full bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 border-b border-slate-700/80 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {onShareProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShareProfile}
              className="text-xs backdrop-blur-md bg-slate-900/50"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" /> Chia Sẻ Hồ Sơ
            </Button>
          )}
        </div>
      </div>

      {/* Main Profile Header Bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
        {/* User Identity & Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {displayName}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
              Lv. {level}
            </span>
            {customTitle && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> {customTitle}
              </span>
            )}
          </div>
          {bio && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {bio}
            </p>
          )}
        </div>

        {/* 4 Stats Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
          {/* Token Balance */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-amber-500/40 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400 shrink-0 animate-coin-shine" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Token</div>
              <div className="text-xs font-black text-amber-300 tabular-nums">
                {tokenBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-orange-500/40 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Streak</div>
              <div className="text-xs font-black text-orange-300 tabular-nums">
                {streakDays} Ngày
              </div>
            </div>
          </div>

          {/* Total XP */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-indigo-500/40 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Kinh Nghiệm</div>
              <div className="text-xs font-black text-indigo-300 tabular-nums">
                {totalXp.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* 1v1 Elo Rank */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-blue-500/40 flex items-center gap-2">
            <Swords className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Rank 1v1</div>
              <div className="text-xs font-black text-blue-300 tabular-nums">
                {rankName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-900/60">
        {[
          { id: 'overview', label: 'Tổng Quan & Avatar', icon: '👤' },
          { id: 'badges', label: `Huy Hiệu (${badges.filter((b) => b.isUnlocked).length}/${badges.length})`, icon: '🎖️' },
          { id: 'history', label: 'Lịch Sử Giao Dịch & Đấu', icon: '📜' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border
              ${activeTab === tab.id
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_2px_0_#047857]'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & AVATAR SHOWCASE */}
      {activeTab === 'overview' && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT: Full-body Avatar Showcase on Podium (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Bục Vinh Danh
              </span>
              <span>Kỷ lục streak: {maxStreakDays} ngày</span>
            </div>

            {/* Avatar Renderer */}
            <div className="my-4 w-full flex items-center justify-center min-h-[300px]">
              <AvatarRenderer
                preset={avatarPreset}
                mode="full"
                size={320}
                isAnimated={true}
              />
            </div>

            {/* Quick CTA Actions */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {onOpenCustomizer && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenCustomizer}
                  className="text-xs font-black"
                >
                  <Shirt className="w-3.5 h-3.5 mr-1" /> Đổi Trang Phục
                </Button>
              )}

              {onOpenShop && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={onOpenShop}
                  className="text-xs font-black"
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Cửa Hàng
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT: Radar 4 Kỹ Năng + Pinned Badges (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {/* 4-Skills Radar Capability Card */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📊</span> Radar Năng Lực 4 Kỹ Năng Sư Phạm
              </h4>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
                {/* SVG Radar Chart */}
                <div className="relative w-48 h-48 shrink-0">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Background concentric circles */}
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="100" cy="100" r="46" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="100" cy="100" r="23" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Axis cross */}
                    <line x1="100" y1="30" x2="100" y2="170" stroke="#334155" strokeWidth="1" />
                    <line x1="30" y1="100" x2="170" y2="100" stroke="#334155" strokeWidth="1" />

                    {/* Skill polygon shape */}
                    <polygon
                      points={radarPolygonPoints}
                      fill="rgba(16, 185, 129, 0.35)"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      className="drop-shadow-md"
                    />

                    {/* Vertices */}
                    <circle cx={lX} cy={lY} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                    <circle cx={rX} cy={rY} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                    <circle cx={wX} cy={wY} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                    <circle cx={sX} cy={sY} r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                  </svg>
                </div>

                {/* Skill percentages grid */}
                <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-sky-500/40">
                    <div className="text-[10px] text-sky-400 font-bold uppercase">🎧 Nghe (Listening)</div>
                    <div className="text-base font-black text-white">{listening}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/40">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">📖 Đọc (Reading)</div>
                    <div className="text-base font-black text-white">{reading}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-500/40">
                    <div className="text-[10px] text-amber-400 font-bold uppercase">✍️ Viết (Writing)</div>
                    <div className="text-base font-black text-white">{writing}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-rose-500/40">
                    <div className="text-[10px] text-rose-400 font-bold uppercase">🗣️ Nói (Speaking)</div>
                    <div className="text-base font-black text-white">{speaking}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Badges Row (Top 3 Pinned Badges) */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🎖️</span> Tủ Trưng Bày Huy Hiệu Ghim (Top 3)
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('badges')}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {showcasedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border-2 border-amber-500/60 shadow-[0_3px_0_#78350f] text-center flex flex-col items-center gap-1"
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span className="text-xs font-black text-white line-clamp-1">{badge.name}</span>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Tier {badge.tier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL BADGES GRID */}
      {activeTab === 'badges' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-white">Bộ Sưu Tập 24 Huy Hiệu Thành Tích</h3>
              <p className="text-xs text-slate-400">Ghim tối đa 3 huy hiệu vinh dự lên trang hồ sơ cá nhân</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
              Đã mở khóa: {badges.filter((b) => b.isUnlocked).length}/{badges.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`
                  p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center justify-between
                  ${b.isUnlocked
                    ? b.isShowcased
                      ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/40 shadow-[0_4px_0_#78350f]'
                      : 'bg-slate-800/80 border-slate-700 shadow-[0_4px_0_#1e293b]'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">{b.icon}</span>
                  <h5 className="text-sm font-black text-white mb-0.5">{b.name}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{b.description}</p>
                </div>

                <div className="w-full pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-400">
                    Tier {b.tier}
                  </span>

                  {b.isUnlocked ? (
                    onToggleShowcaseBadge && (
                      <button
                        type="button"
                        onClick={() => onToggleShowcaseBadge(b.id)}
                        className={`
                          px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors
                          ${b.isShowcased
                            ? 'bg-amber-500 text-yellow-950'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }
                        `}
                      >
                        {b.isShowcased ? '★ Đang ghim' : 'Ghim'}
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">
                      {b.progressPercent ? `${b.progressPercent}%` : 'Chưa mở'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY HISTORY & TOKEN LEDGER */}
      {activeTab === 'history' && (
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-base font-black text-white">Lịch Sử Hoạt Động & Biến Động Token</h3>
            <p className="text-xs text-slate-400">Ghi nhận minh bạch mọi luồng Token từ học tập và cửa hàng</p>
          </div>

          <div className="space-y-2.5">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-lg">
                    {act.activityType === 'battle_1v1'
                      ? '⚔️'
                      : act.activityType === 'shop_purchase'
                      ? '🛍️'
                      : act.activityType === 'chest_claim'
                      ? '🎁'
                      : '📚'}
                  </span>
                  <div>
                    <h5 className="text-sm font-extrabold text-white">{act.title}</h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{act.timeAgo}</span>
                      {act.xpGained && (
                        <span className="text-indigo-400 font-bold">+{act.xpGained} XP</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`
                      text-sm font-black tabular-nums
                      ${act.tokensDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}
                    `}
                  >
                    {act.tokensDelta > 0 ? `+${act.tokensDelta}` : act.tokensDelta} 🪙
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

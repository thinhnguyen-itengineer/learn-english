import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Heart,
  Zap,
  RotateCw,
  Crown,
  Shirt,
  Check,
  Play,
  ArrowRightLeft,
  Flame,
  Star,
} from 'lucide-react';
import { AvatarItem3DData, Slot3D } from './Item3DCard';
import { WardrobeItemCompatibilityBadge } from './WardrobeItemCompatibilityBadge';

export interface MatchingOutfitSet {
  id: string;
  name: string;
  theme: string;
  description: string;
  badgeText: string;
  tokenPriceTotal: number;
  femaleItems: string[];
  maleItems: string[];
}

export const MATCHING_DUO_SETS: MatchingOutfitSet[] = [
  {
    id: 'set_royal_academy_duo',
    name: 'Set Đồng Phục Học Viện Hoàng Gia',
    theme: 'Academic Elegance',
    description: 'Blazer xanh navy viền vàng gold, cà vạt/nơ học sinh thanh lịch',
    badgeText: 'Bộ Đôi Học Viện',
    tokenPriceTotal: 1200,
    femaleItems: ['Blazer Sakura', 'Váy Xếp Ly Caro', 'Giày Oxford Cổ Ngắn', 'Kẹp Tóc Ngôi Sao'],
    maleItems: ['Blazer Navy Gold', 'Quần Âu Thể Thao', 'Giày Loafer Da', 'Cà Vạt Học Viện'],
  },
  {
    id: 'set_cyberpunk_neon_duo',
    name: 'Set Đường Phố Cyberpunk Neon 2077',
    theme: 'Cyber Futuristic',
    description: 'Áo khoác dạ quang Hologram phát sáng trong phòng thi đấu 1v1',
    badgeText: 'Bộ Đôi Chiến Binh',
    tokenPriceTotal: 2500,
    femaleItems: ['Hoodie Neon Pink', 'Váy Hologram Tech', 'Bốt Cao Gót Cyber', 'Kính AR Visor'],
    maleItems: ['Áo Khoác Cyber Cyan', 'Quần Cargo Techwear', 'Sneaker Phát Sáng', 'Tai Nghe Cyber'],
  },
  {
    id: 'set_athletic_runner_duo',
    name: 'Set Năng Lượng Thể Thao Marathon',
    theme: 'Athletic Runner',
    description: 'Bộ đồ thể thao thoáng khí, tối ưu cho các bài luyện phát âm tốc độ',
    badgeText: 'Bộ Đôi Thể Thao',
    tokenPriceTotal: 850,
    femaleItems: ['Áo Croptop Runner', 'Quần Short Thể Thao', 'Sneaker Siêu Nhẹ', 'Băng Đô Thể Thao'],
    maleItems: ['Áo Thun Co Giãn', 'Quần Jogger Năng Động', 'Sneaker Chạy Bộ', 'Đồng Hồ Đo Nhịp'],
  },
  {
    id: 'set_mystic_scholar_duo',
    name: 'Set Pháp Sư Học Thuật Huyền Bí',
    theme: 'Mystic Fantasy',
    description: 'Áo choàng pháp sư thêu chỉ vàng phép thuật, hào quang sao rơi',
    badgeText: 'Bộ Đôi Huyền Thoại',
    tokenPriceTotal: 3800,
    femaleItems: ['Áo Choàng Pháp Sư Nữ', 'Váy Phù Thủy Huyền Ảo', 'Giày Phép Thuật', 'Trượng Ngữ Pháp'],
    maleItems: ['Áo Choàng Pháp Sư Nam', 'Quần Phép Thuật', 'Bốt Da Thần Kỳ', 'Sách Cổ Phép Thuật'],
  },
];

export interface DualCharacterShowcaseProps {
  /** User token balance */
  userTokenBalance?: number;
  /** Active matching set ID */
  activeSetId?: string;
  /** Callback when equipping or previewing a matching couple outfit */
  onSelectMatchingSet?: (set: MatchingOutfitSet) => void;
  /** Callback when testing a synchronized interaction pose */
  onTriggerSyncPose?: (poseName: string) => void;
  /** Custom Canvas 3D render node for senior fullstack engineer */
  canvas3DNode?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const DualCharacterShowcase: React.FC<DualCharacterShowcaseProps> = ({
  userTokenBalance = 2500,
  activeSetId = 'set_royal_academy_duo',
  onSelectMatchingSet,
  onTriggerSyncPose,
  canvas3DNode,
  className = '',
}) => {
  const [selectedSet, setSelectedSet] = useState<MatchingOutfitSet>(
    MATCHING_DUO_SETS.find((s) => s.id === activeSetId) || MATCHING_DUO_SETS[0]
  );
  const [isSyncRotating, setIsSyncRotating] = useState(true);
  const [syncPose, setSyncPose] = useState<string>('anim_idle');

  const handleSetChange = (set: MatchingOutfitSet) => {
    setSelectedSet(set);
    onSelectMatchingSet?.(set);
  };

  const handlePoseTrigger = (pose: string) => {
    setSyncPose(pose);
    onTriggerSyncPose?.(pose);
  };

  return (
    <div className={`rounded-3xl border border-purple-500/30 bg-slate-950/90 overflow-hidden shadow-2xl shadow-purple-950/40 ${className}`}>
      {/* Top Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-rose-950/50 via-purple-950/60 to-cyan-950/50 border-b border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-3d-duo">
            <Users size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Sàn Diễn 3D Chibi Cặp Đôi (Dual Showcase)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Aoi & Ren
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Phối đồ đồng điệu cho 2 nhân vật đại diện, gắn kết và tỏa sáng trên Đấu Trường 1v1
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSyncRotating(!isSyncRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isSyncRotating
                ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-sm'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw size={14} className={isSyncRotating ? 'animate-spin' : ''} />
            <span>{isSyncRotating ? 'Đang Xoay 360°' : 'Dừng Xoay'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Stage View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-800">
        {/* Left: 3D Dual Pedestals Viewport (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 overflow-hidden">
          {/* Subtle Stage Grid and Lights */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />

          {canvas3DNode ? (
            <div className="w-full h-full min-h-[340px]">{canvas3DNode}</div>
          ) : (
            /* Mock Dual 3D Stage Visuals */
            <div className="w-full flex items-end justify-center gap-8 md:gap-14 relative z-10 py-6">
              {/* Female Stage & Model (Aoi) */}
              <div className="flex flex-col items-center">
                {/* Character Silhouette & Aura */}
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="absolute -top-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-3d-female z-20">
                    Aoi • 0.95m
                  </div>
                  {/* Chibi Figure Graphic Mockup */}
                  <div className="w-32 h-44 rounded-3xl bg-gradient-to-b from-rose-950/80 to-slate-900 border-2 border-rose-500/60 shadow-glow-female flex flex-col items-center justify-center p-3 text-center animate-avatar-breathe">
                    <Heart size={36} className="text-rose-400 mb-1 fill-rose-500/30" />
                    <span className="text-xs font-black text-white">Chibi Aoi</span>
                    <span className="text-[10px] text-rose-300 font-medium leading-tight mt-1">
                      {selectedSet.femaleItems[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">4.8k tris</span>
                  </div>
                </div>

                {/* Pedestal Base */}
                <div className="w-36 h-8 rounded-full bg-slate-800 border-2 border-rose-500/40 shadow-3d-female flex items-center justify-center">
                  <span className="w-24 h-2 rounded-full bg-rose-500/40 blur-xs" />
                </div>
              </div>

              {/* Center Duo Heart / Sparkle Connector */}
              <div className="flex flex-col items-center justify-center pb-8">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-glow-duo animate-pulse">
                  <Sparkles size={18} />
                </div>
                <span className="text-[10px] font-bold text-purple-300 mt-1 uppercase tracking-wider">
                  Duo Sync
                </span>
              </div>

              {/* Male Stage & Model (Ren) */}
              <div className="flex flex-col items-center">
                {/* Character Silhouette & Aura */}
                <div className="relative mb-3 flex flex-col items-center">
                  <div className="absolute -top-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 shadow-3d-male z-20">
                    Ren • 0.98m
                  </div>
                  {/* Chibi Figure Graphic Mockup */}
                  <div className="w-32 h-44 rounded-3xl bg-gradient-to-b from-cyan-950/80 to-slate-900 border-2 border-cyan-500/60 shadow-glow-male flex flex-col items-center justify-center p-3 text-center animate-avatar-breathe">
                    <Zap size={36} className="text-cyan-400 mb-1 fill-cyan-500/30" />
                    <span className="text-xs font-black text-white">Chibi Ren</span>
                    <span className="text-[10px] text-cyan-300 font-medium leading-tight mt-1">
                      {selectedSet.maleItems[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-1">4.9k tris</span>
                  </div>
                </div>

                {/* Pedestal Base */}
                <div className="w-36 h-8 rounded-full bg-slate-800 border-2 border-cyan-500/40 shadow-3d-male flex items-center justify-center">
                  <span className="w-24 h-2 rounded-full bg-cyan-500/40 blur-xs" />
                </div>
              </div>
            </div>
          )}

          {/* Synchronized Poses HUD Floating Bar */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center gap-2 bg-slate-950/85 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
            <span className="text-[11px] text-slate-400 font-bold shrink-0 hidden sm:inline">
              Cử chỉ đôi:
            </span>
            {[
              { id: 'anim_idle', label: 'Idle Nhún Nhảy', icon: '✨' },
              { id: 'anim_victory', label: 'Cùng Chiến Thắng', icon: '🎉' },
              { id: 'anim_highfive', label: 'Đập Tay High-Five', icon: '🙌' },
              { id: 'anim_study', label: 'Cùng Ôn Bài', icon: '📚' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePoseTrigger(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  syncPose === p.id
                    ? 'bg-purple-500 text-white shadow-3d-duo'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{p.icon}</span>
                <span className="hidden md:inline">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Matching Sets Selector & Wardrobe Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900/60 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Chọn Bộ Phối Đồ Cặp Đôi:
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Crown size={14} />
                Bộ Sưu Tập 3D V1
              </span>
            </div>

            {/* Set Cards Grid */}
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {MATCHING_DUO_SETS.map((set) => {
                const isSelected = set.id === selectedSet.id;
                return (
                  <div
                    key={set.id}
                    onClick={() => handleSetChange(set)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-950/60 to-slate-900 border-purple-500 shadow-md translate-y-[-1px]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="text-xs font-black text-white">{set.name}</h4>
                        <p className="text-[11px] text-slate-400">{set.description}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 shrink-0">
                        {set.badgeText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-300 font-medium">♀ Aoi: {set.femaleItems.length} món</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-300 font-medium">♂ Ren: {set.maleItems.length} món</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-amber-400">
                        <span>{set.tokenPriceTotal}</span>
                        <span className="text-[10px]">Tokens</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Item List for Active Set */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Chi tiết trang phục theo nhân vật:</span>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {/* Female Items */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-rose-400 font-bold">
                    <Heart size={12} className="fill-rose-400" />
                    <span>Nữ (Aoi):</span>
                  </div>
                  <ul className="space-y-0.5 text-slate-300 list-disc list-inside">
                    {selectedSet.femaleItems.map((item, idx) => (
                      <li key={idx} className="truncate">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Male Items */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Zap size={12} className="fill-cyan-400" />
                    <span>Nam (Ren):</span>
                  </div>
                  <ul className="space-y-0.5 text-slate-300 list-disc list-inside">
                    {selectedSet.maleItems.map((item, idx) => (
                      <li key={idx} className="truncate">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 mt-4">
            <div className="text-xs">
              <span className="text-slate-400 block">Tổng Token Cặp Đôi:</span>
              <span className="font-black text-amber-400 text-sm">{selectedSet.tokenPriceTotal} Tokens</span>
            </div>

            <button
              type="button"
              onClick={() => handleSetChange(selectedSet)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs shadow-3d-duo hover:brightness-110 active:translate-y-[2px] cursor-pointer transition-all"
            >
              <Crown size={16} />
              <span>Mặc Trọn Bộ Cho Cả Hai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, Heart, Zap, Users, Check, ArrowRight, Shield, Crown } from 'lucide-react';
import { Gender3D } from './Item3DCard';

export type CharacterSelectionMode = 'FEMALE' | 'MALE' | 'DUO';

export interface CharacterProfileInfo {
  gender: 'FEMALE' | 'MALE';
  id: string;
  name: string;
  subname: string;
  title: string;
  heightMeter: number;
  proportionRatio: string;
  themeColor: 'rose' | 'cyan';
  personality: string;
  signatureStyle: string;
  modelSource: string;
  rawPolycount: string;
  optimizedPolycount: string;
  equippedCount?: number;
  activeOutfitName?: string;
}

export const CHARACTER_PROFILES: Record<'FEMALE' | 'MALE', CharacterProfileInfo> = {
  FEMALE: {
    gender: 'FEMALE',
    id: 'chibi_female_aoi',
    name: 'Aoi',
    subname: 'Ánh Dương',
    title: 'Học Muội Năng Động & Trực Giác Phát Âm',
    heightMeter: 0.95,
    proportionRatio: '1:2.8 SD Chibi',
    themeColor: 'rose',
    personality: 'Rạng rỡ, hoạt bát, tràn đầy năng lượng tích cực',
    signatureStyle: 'Đồng phục học viện thắt nơ, kẹp tóc ngôi sao, váy xếp ly',
    modelSource: 'Meshy_AI_Chibi_Figure_0930081629_texture.glb',
    rawPolycount: '426.8k tris (Meshy AI)',
    optimizedPolycount: '4.8k tris (Base) / 18.5k (Full)',
    equippedCount: 5,
    activeOutfitName: 'Học Viện Sakura Tinh Khôi',
  },
  MALE: {
    gender: 'MALE',
    id: 'chibi_male_ren',
    name: 'Ren',
    subname: 'Tuệ Minh',
    title: 'Học Trưởng Điềm Tĩnh & Chuyên Gia Ngữ Pháp',
    heightMeter: 0.98,
    proportionRatio: '1:2.8 SD Chibi',
    themeColor: 'cyan',
    personality: 'Điềm đạm, tập trung cao độ, tư duy phản biện sắc bén',
    signatureStyle: 'Gile len học viện, tai nghe công nghệ, sneaker thể thao',
    modelSource: 'Chibi Male Rigged Skeleton (Complementary)',
    rawPolycount: '430.0k tris (AI Quad Reference)',
    optimizedPolycount: '4.9k tris (Base) / 19.0k (Full)',
    equippedCount: 5,
    activeOutfitName: 'Học Trưởng Cyber Academy',
  },
};

export interface CharacterGenderSelectorProps {
  /** Currently selected character or duo mode */
  selectedCharacter: CharacterSelectionMode;
  /** Selection callback */
  onSelectCharacter: (character: CharacterSelectionMode) => void;
  /** Display variant: 'compact-tabs' | 'cards-split' | 'hero-showcase' */
  variant?: 'compact-tabs' | 'cards-split' | 'hero-showcase';
  /** Allow duo mode button */
  allowDuoMode?: boolean;
  /** Optional override for female equipped summary */
  femaleSummary?: { equippedCount?: number; activeOutfitName?: string };
  /** Optional override for male equipped summary */
  maleSummary?: { equippedCount?: number; activeOutfitName?: string };
  /** Additional CSS class */
  className?: string;
}

export const CharacterGenderSelector: React.FC<CharacterGenderSelectorProps> = ({
  selectedCharacter,
  onSelectCharacter,
  variant = 'compact-tabs',
  allowDuoMode = true,
  femaleSummary,
  maleSummary,
  className = '',
}) => {
  const femaleProfile = {
    ...CHARACTER_PROFILES.FEMALE,
    equippedCount: femaleSummary?.equippedCount ?? CHARACTER_PROFILES.FEMALE.equippedCount,
    activeOutfitName: femaleSummary?.activeOutfitName ?? CHARACTER_PROFILES.FEMALE.activeOutfitName,
  };

  const maleProfile = {
    ...CHARACTER_PROFILES.MALE,
    equippedCount: maleSummary?.equippedCount ?? CHARACTER_PROFILES.MALE.equippedCount,
    activeOutfitName: maleSummary?.activeOutfitName ?? CHARACTER_PROFILES.MALE.activeOutfitName,
  };

  // Compact Tab Switcher (Used in Modal Headers and compact toolbars)
  if (variant === 'compact-tabs') {
    return (
      <div className={`inline-flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-700/70 shadow-inner ${className}`}>
        {/* Female Tab */}
        <button
          type="button"
          onClick={() => onSelectCharacter('FEMALE')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
            selectedCharacter === 'FEMALE'
              ? 'bg-rose-500 text-white shadow-3d-female translate-y-[-1px]'
              : 'text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
          }`}
        >
          <Heart size={14} className={selectedCharacter === 'FEMALE' ? 'fill-white' : ''} />
          <span>Nữ: Aoi</span>
          {selectedCharacter === 'FEMALE' && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
        </button>

        {/* Male Tab */}
        <button
          type="button"
          onClick={() => onSelectCharacter('MALE')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
            selectedCharacter === 'MALE'
              ? 'bg-cyan-500 text-slate-950 shadow-3d-male translate-y-[-1px]'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
          }`}
        >
          <Zap size={14} className={selectedCharacter === 'MALE' ? 'fill-slate-950' : ''} />
          <span>Nam: Ren</span>
          {selectedCharacter === 'MALE' && (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
          )}
        </button>

        {/* Duo Mode Tab */}
        {allowDuoMode && (
          <button
            type="button"
            onClick={() => onSelectCharacter('DUO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
              selectedCharacter === 'DUO'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-3d-duo translate-y-[-1px]'
                : 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/10'
            }`}
            title="Xem sàn diễn cặp đôi 3D đồng điệu"
          >
            <Users size={14} />
            <span>Cặp Đôi</span>
          </button>
        )}
      </div>
    );
  }

  // Cards Split View (Detailed Cards for Selecting Initial Character or Full Customizer)
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* Female Card: Aoi */}
      <div
        onClick={() => onSelectCharacter('FEMALE')}
        className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
          selectedCharacter === 'FEMALE'
            ? 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-500 shadow-glow-female translate-y-[-2px]'
            : 'bg-slate-900/60 border-slate-700/60 hover:border-rose-400/50 hover:bg-slate-900/90'
        }`}
      >
        {/* Glow halo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-400 flex items-center justify-center text-white shadow-3d-female">
              <Heart size={24} className="fill-white/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{femaleProfile.name}</h3>
                <span className="text-xs text-rose-300 font-semibold">({femaleProfile.subname})</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  Nữ Chibi
                </span>
              </div>
              <p className="text-xs text-slate-400">{femaleProfile.title}</p>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              selectedCharacter === 'FEMALE'
                ? 'bg-rose-500 border-rose-400 text-white'
                : 'border-slate-600 bg-slate-800'
            }`}
          >
            {selectedCharacter === 'FEMALE' && <Check size={14} strokeWidth={3} />}
          </div>
        </div>

        {/* 3D Model Technical Provenance Badge */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-3 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">File 3D glTF Gốc:</span>
            <span className="font-mono text-[10px] text-amber-400 truncate max-w-[190px]" title={femaleProfile.modelSource}>
              Meshy_AI_Chibi_Figure...glb
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Tỷ lệ Chibi:</span>
            <span className="font-semibold text-rose-300">{femaleProfile.proportionRatio} ({femaleProfile.heightMeter}m)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Tối ưu WebGL:</span>
            <span className="font-mono text-emerald-400 font-semibold">{femaleProfile.optimizedPolycount}</span>
          </div>
        </div>

        {/* Style & Outfit summary */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
          <span className="text-slate-400">Trang phục hiện tại:</span>
          <span className="font-semibold text-rose-200">{femaleProfile.activeOutfitName}</span>
        </div>
      </div>

      {/* Male Card: Ren */}
      <div
        onClick={() => onSelectCharacter('MALE')}
        className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
          selectedCharacter === 'MALE'
            ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500 shadow-glow-male translate-y-[-2px]'
            : 'bg-slate-900/60 border-slate-700/60 hover:border-cyan-400/50 hover:bg-slate-900/90'
        }`}
      >
        {/* Glow halo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-slate-950 shadow-3d-male">
              <Zap size={24} className="fill-slate-950/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{maleProfile.name}</h3>
                <span className="text-xs text-cyan-300 font-semibold">({maleProfile.subname})</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Nam Chibi
                </span>
              </div>
              <p className="text-xs text-slate-400">{maleProfile.title}</p>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              selectedCharacter === 'MALE'
                ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                : 'border-slate-600 bg-slate-800'
            }`}
          >
            {selectedCharacter === 'MALE' && <Check size={14} strokeWidth={3} />}
          </div>
        </div>

        {/* 3D Model Technical Provenance Badge */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-3 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Khung Xương:</span>
            <span className="font-mono text-[10px] text-cyan-300 truncate max-w-[190px]">
              Mixamo Humanoid (42 Bones)
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Tỷ lệ Chibi:</span>
            <span className="font-semibold text-cyan-300">{maleProfile.proportionRatio} ({maleProfile.heightMeter}m)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Tối ưu WebGL:</span>
            <span className="font-mono text-emerald-400 font-semibold">{maleProfile.optimizedPolycount}</span>
          </div>
        </div>

        {/* Style & Outfit summary */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
          <span className="text-slate-400">Trang phục hiện tại:</span>
          <span className="font-semibold text-cyan-200">{maleProfile.activeOutfitName}</span>
        </div>
      </div>
    </div>
  );
};

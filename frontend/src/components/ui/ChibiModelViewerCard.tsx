import React, { useState } from 'react';
import {
  Layers,
  HardDrive,
  Cpu,
  Sparkles,
  FileCode,
  ShieldCheck,
  Zap,
  Heart,
  Activity,
  Play,
  CheckCircle2,
  Box,
  Eye,
} from 'lucide-react';
import { Gender3D } from './Item3DCard';

export interface ChibiModelViewerCardProps {
  /** Active character gender view */
  character?: 'FEMALE' | 'MALE';
  /** Callback when testing an animation gesture */
  onTestAnimation?: (animName: string) => void;
  /** Additional CSS class */
  className?: string;
}

export const ChibiModelViewerCard: React.FC<ChibiModelViewerCardProps> = ({
  character = 'FEMALE',
  onTestAnimation,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'SPEC' | 'PIPELINE' | 'GESTURES'>('SPEC');
  const [activeGesture, setActiveGesture] = useState<string>('anim_idle');

  const isFemale = character === 'FEMALE';

  const handleTriggerGesture = (anim: string) => {
    setActiveGesture(anim);
    onTestAnimation?.(anim);
  };

  return (
    <div
      className={`rounded-2xl border bg-slate-900/90 overflow-hidden shadow-2xl ${
        isFemale ? 'border-rose-500/40 shadow-glow-female/20' : 'border-cyan-500/40 shadow-glow-male/20'
      } ${className}`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 border-b flex items-center justify-between ${
          isFemale
            ? 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border-rose-500/30'
            : 'bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border-cyan-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
              isFemale ? 'bg-rose-500 shadow-3d-female' : 'bg-cyan-500 text-slate-950 shadow-3d-male'
            }`}
          >
            <Box size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">
                {isFemale ? 'Chibi Female: Aoi (File Gốc .glb)' : 'Chibi Male: Ren (Mô Hình Đối Ứng)'}
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isFemale
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                }`}
              >
                glTF 2.0 Binary
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {isFemale ? 'Meshy_AI_Chibi_Figure_0930081629_texture.glb' : 'Chibi_Male_Figure_Master_Rig.glb'}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('SPEC')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'SPEC'
                ? isFemale
                  ? 'bg-rose-500 text-white'
                  : 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Thông Số
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PIPELINE')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'PIPELINE'
                ? isFemale
                  ? 'bg-rose-500 text-white'
                  : 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quy Trình Retopo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('GESTURES')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'GESTURES'
                ? isFemale
                  ? 'bg-rose-500 text-white'
                  : 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cử Chỉ Hoạt Họa
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5">
        {activeTab === 'SPEC' && (
          <div className="space-y-4">
            {/* Comparison Metrics: Raw AI vs WebGL Target */}
            <div className="grid grid-cols-2 gap-3">
              {/* Raw AI File */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <FileCode size={14} />
                    Mô Hình Thô Meshy AI
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                    Source
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Đa giác (Poly):</span>
                    <span className="text-amber-400 font-bold">426,804 tris</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dung lượng tệp:</span>
                    <span className="text-amber-400 font-bold">48.36 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cấu trúc Mesh:</span>
                    <span>1 Monolithic Mesh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Khung xương:</span>
                    <span className="text-rose-400">Chưa Rig xương (Static)</span>
                  </div>
                </div>
              </div>

              {/* WebGL Production Target */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Mục Tiêu WebGL Mobile
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                    Target V1
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Body Mesh:</span>
                    <span className="text-emerald-400 font-bold">~4,800 tris</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Full Trang Phục:</span>
                    <span className="text-emerald-400 font-bold">18k - 22k tris</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nén Draco / Meshopt:</span>
                    <span className="text-emerald-400 font-bold">&le; 1.8 MB (Toàn bộ)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Khung xương:</span>
                    <span className="text-emerald-400 font-bold">Mixamo 42 Bones</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Rigging & Material Rules */}
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
              <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu size={14} className="text-blue-400" />
                Chuẩn Hóa Khung Xương & Vật Liệu Cel-Shaded
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-400">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-0.5">Khung Xương Gốc</span>
                  <span>Humanoid Rig 42 bones, tương thích 100% hoạt họa Mixamo/WebGL.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-0.5">Đóng Gói Kênh ORM</span>
                  <span>R: Ambient Occlusion, G: Roughness, B: Metallic (1024x1024).</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-0.5">Re-parenting Quần Áo</span>
                  <span>SkinnedMesh tự động map vào xương của BaseBody khi thay đồ.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PIPELINE' && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300">
              Quy Trình Chuyển Đổi Từ File Meshy AI 426k Tris Sang WebGL Module:
            </h5>
            <ol className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-slate-200 block">Tách Sub-Mesh & Retopology Trong Blender:</strong>
                  Nhập tệp <code className="text-amber-300">Meshy_AI_Chibi_Figure...glb</code>, phân tách thành 6 cụm độc lập: Thân (`BaseBody`), Tóc (`Hair`), Áo (`Top`), Váy (`Bottom`), Giày (`Shoes`), Phụ kiện (`Accessory`). Tiến hành giảm lưới Retopo Quad-Flow từ 426k tris xuống còn ~4.8k tris cho BaseBody.
                </div>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-slate-200 block">Rigging Khung Xương Mixamo Humanoid:</strong>
                  Gắn xương 42 khớp (Root, Hips, Spine, Chest, Neck, Head, Vai, Tay, Chân). Weight paint da mềm mại, tránh biến dạng đầu to Chibi khi gật gù hoặc xoay cổ.
                </div>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-slate-200 block">Bake Texture & Nén glTF Draco:</strong>
                  Bake chi tiết nếp gấp vải và ánh sáng từ high-poly sang low-poly. Đóng gói Texture ORM 1024x1024 và xuất file glTF nén Draco/Meshoptimizer với kích thước &le; 650 KB cho BaseBody.
                </div>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  4
                </span>
                <div>
                  <strong className="text-slate-200 block">Nhân Bản Mô Hình Nam Đối Ứng (Ren):</strong>
                  Điều chỉnh tỷ lệ khung xương (vai hơi vuông hơn, chiều cao 0.98m, tóc layer anime), tạo bộ base body nam chia sẻ chung chuẩn Mixamo Rig để dùng chung hoạt họa cử chỉ.
                </div>
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'GESTURES' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold">Thử Nghiệm Cử Chỉ Hoạt Họa (React Three Fiber Preview):</span>
              <span className="text-[11px] font-mono text-cyan-300">Đang chọn: {activeGesture}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'anim_idle', label: 'Idle Nhún Nhảy', icon: '✨' },
                { id: 'anim_thinking', label: 'Suy Nghĩ', icon: '🤔' },
                { id: 'anim_correct', label: 'Đáp Án Đúng', icon: '✌️' },
                { id: 'anim_streak_fire', label: 'Lửa Combo x3', icon: '🔥' },
                { id: 'anim_confused', label: 'Bối Rối / Sai', icon: '💧' },
                { id: 'anim_tryon', label: 'Xoay Khoe Đồ', icon: '👗' },
                { id: 'anim_victory', label: 'Vũ Đạo Thắng', icon: '🎉' },
                { id: 'anim_defeat', label: 'Ôm Gối Buồn', icon: '🌧️' },
              ].map((anim) => (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => handleTriggerGesture(anim.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeGesture === anim.id
                      ? isFemale
                        ? 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-3d-female'
                        : 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-3d-male'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{anim.icon}</span>
                  <span className="truncate">{anim.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

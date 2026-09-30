import React, { useState } from 'react';
import {
  RotateCcw,
  RotateCw,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Sun,
  Flame,
  Zap,
  Sparkles,
  User,
  Scan,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type CameraPreset = 'full' | 'face' | 'front' | 'back' | 'side';
export type LightingTheme = 'studio' | 'daylight' | 'sunset' | 'cyberpunk';

export interface OrbitControlsHUDProps {
  /** Current yaw rotation in degrees (0 - 360) */
  yawAngle?: number;
  /** Current zoom distance in meters or percent (e.g. 2.3) */
  zoomDistance?: number;
  /** Minimum zoom distance */
  minDistance?: number;
  /** Maximum zoom distance */
  maxDistance?: number;
  /** Whether auto-rotation is currently enabled */
  isAutoRotating?: boolean;
  /** Current active camera preset view */
  activePreset?: CameraPreset;
  /** Current active lighting rig */
  activeLighting?: LightingTheme;
  /** Callback when rotating left */
  onRotateLeft?: (deg?: number) => void;
  /** Callback when rotating right */
  onRotateRight?: (deg?: number) => void;
  /** Callback to flip view 180 degrees (view back / front) */
  onFlip180?: () => void;
  /** Callback to toggle auto-rotation */
  onToggleAutoRotate?: () => void;
  /** Callback to zoom camera in */
  onZoomIn?: () => void;
  /** Callback to zoom camera out */
  onZoomOut?: () => void;
  /** Callback to reset camera to default perspective */
  onResetView?: () => void;
  /** Callback to select a camera angle preset */
  onSelectPreset?: (preset: CameraPreset) => void;
  /** Callback to toggle lighting theme */
  onSelectLighting?: (theme: LightingTheme) => void;
  /** Compact HUD mode for small mobile viewports */
  compact?: boolean;
  /** Custom container class */
  className?: string;
}

export const OrbitControlsHUD: React.FC<OrbitControlsHUDProps> = ({
  yawAngle = 0,
  zoomDistance = 2.3,
  minDistance = 1.2,
  maxDistance = 3.0,
  isAutoRotating = false,
  activePreset = 'front',
  activeLighting = 'studio',
  onRotateLeft,
  onRotateRight,
  onFlip180,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onResetView,
  onSelectPreset,
  onSelectLighting,
  compact = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showLightingMenu, setShowLightingMenu] = useState(false);

  // Normalize yaw to 0..359
  const normalizedYaw = Math.round(((yawAngle % 360) + 360) % 360);

  // Calculate zoom percentage (inverted: minDistance is 100% zoom-in, maxDistance is 0%)
  const zoomPercent = Math.round(
    Math.max(0, Math.min(100, ((maxDistance - zoomDistance) / (maxDistance - minDistance)) * 100))
  );

  const presets: { id: CameraPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'full', label: 'Toàn thân', icon: <Scan className="w-3.5 h-3.5" /> },
    { id: 'face', label: 'Cận cảnh mặt', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'front', label: 'Chính diện', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'side', label: 'Góc nghiêng', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'back', label: 'Sau lưng', icon: <RotateCw className="w-3.5 h-3.5" /> },
  ];

  const lightingThemes: { id: LightingTheme; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'studio', label: 'Studio 3-Point', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-amber-300' },
    { id: 'daylight', label: 'Nắng Ban Ngày', icon: <Sun className="w-3.5 h-3.5" />, color: 'text-yellow-400' },
    { id: 'sunset', label: 'Hoàng Hôn Ấm', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-rose-400' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: <Zap className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  ];

  return (
    <div
      className={`relative z-20 flex flex-col gap-2 select-none pointer-events-auto transition-all ${className}`}
      role="region"
      aria-label="3D Camera Orbit Controls"
    >
      {/* Main Pill Controls Container */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl p-2 shadow-2xl shadow-black/50 text-white flex flex-col gap-2">
        {/* Top Control Bar: Compass Angle, 360 Auto-Rotate & Reset */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Compass & Rotation Angle Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div
              className="w-4 h-4 rounded-full border border-cyan-400/60 flex items-center justify-center transition-transform duration-200"
              style={{ transform: `rotate(${normalizedYaw}deg)` }}
            >
              <div className="w-0.5 h-2 bg-gradient-to-t from-transparent to-cyan-400 rounded-full" />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300 min-w-[36px]">
              {normalizedYaw}°
            </span>
          </div>

          {/* Quick Rotation Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onRotateLeft?.(45)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
              title="Xoay trái 45°"
              aria-label="Rotate left 45 degrees"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onFlip180?.()}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-90 flex items-center gap-1"
              title="Lật 180° xem sau lưng / trước"
              aria-label="Flip 180 degrees"
            >
              180°
            </button>

            <button
              type="button"
              onClick={() => onRotateRight?.(45)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
              title="Xoay phải 45°"
              aria-label="Rotate right 45 degrees"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              isAutoRotating
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-glow-cyan'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
            title={isAutoRotating ? 'Tắt tự động xoay 360°' : 'Bật tự động xoay 360°'}
            aria-label="Toggle 360 auto rotate"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">360°</span>
          </button>

          {/* Reset Camera Button */}
          <button
            type="button"
            onClick={onResetView}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
            title="Đặt lại góc nhìn chuẩn [0, 0.6, 2.3]"
            aria-label="Reset camera view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Expand Details */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title={isExpanded ? 'Thu gọn HUD' : 'Mở rộng tùy chọn HUD'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Options: Zoom Bar, Camera Presets & Lighting Selector */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {/* Zoom Controls & Slider */}
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-cyan-400" />
                Zoom
              </span>

              <div className="flex items-center gap-1.5 flex-1 max-w-[150px]">
                <button
                  type="button"
                  onClick={onZoomOut}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-90"
                  title="Thu nhỏ camera"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>

                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-150"
                    style={{ width: `${zoomPercent}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={onZoomIn}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-90"
                  title="Phóng to camera"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>

              <span className="text-[10px] font-mono font-bold text-slate-400 min-w-[32px] text-right">
                {zoomPercent}%
              </span>
            </div>

            {/* Camera View Presets */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset?.(preset.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    activePreset === preset.id
                      ? 'bg-blue-600 text-white shadow-3d-blue scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {preset.icon}
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Lighting Studio Theme Menu */}
            {onSelectLighting && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLightingMenu(!showLightingMenu)}
                  className="w-full flex items-center justify-between px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700/40"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Ánh sáng: <strong className="text-white font-bold">{lightingThemes.find(l => l.id === activeLighting)?.label}</strong>
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showLightingMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col gap-0.5 z-30">
                    {lightingThemes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          onSelectLighting(theme.id);
                          setShowLightingMenu(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
                          activeLighting === theme.id
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={theme.color}>{theme.icon}</span>
                          {theme.label}
                        </span>
                        {activeLighting === theme.id && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { AvatarConfigDto } from '../../types/avatarAndShop';
import { Sparkles, Volume2, RotateCcw, Eye, Shirt, Users, Layers } from 'lucide-react';

export interface ModularAvatarProps {
  config: AvatarConfigDto;
  size?: number | string;
  animateBreath?: boolean;
  enable4D?: boolean;
  showControls?: boolean;
  mode?: 'full' | 'bust' | 'head';
  className?: string;
  onClick?: () => void;
  // 3D rotation & inspection controls
  rotationY?: number;
  rotationX?: number;
  pan?: { x: number; y: number };
  zoom?: number;
  interactiveOrbit?: boolean;
  onRotationChange?: (rotY: number, rotX: number) => void;
  onPanChange?: (pan: { x: number; y: number }) => void;
  onZoomChange?: (zoom: number) => void;
  // ZingSpeed 3D Showroom & Model Settings
  characterModel?: 'auto' | 'boy' | 'girl' | 'duo';
  sceneMode?: 'showroom' | 'pedestal' | 'clean';
  showHoloCards?: boolean;
}

export const ModularAvatar: React.FC<ModularAvatarProps> = ({
  config,
  size = '100%',
  animateBreath = false,
  enable4D = true,
  showControls = true,
  mode = 'full',
  className = '',
  onClick,
  rotationY: externalRotY,
  rotationX: externalRotX,
  pan: externalPan,
  zoom: externalZoom,
  interactiveOrbit = true,
  onRotationChange,
  onPanChange,
  onZoomChange,
  characterModel: explicitModel = 'auto',
  sceneMode: defaultSceneMode = 'showroom',
  showHoloCards: defaultShowHolo = true
}) => {
  // Internal orbit / rotation states
  const [internalRotY, setInternalRotY] = useState(0);
  const [internalRotX, setInternalRotX] = useState(0);
  const [internalPan, setInternalPan] = useState({ x: 0, y: 0 });
  const [internalZoom, setInternalZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'rotate' | 'pan'>('rotate');
  const lastMousePos = useRef({ x: 0, y: 0 });

  const currentRotY = externalRotY !== undefined ? externalRotY : internalRotY;
  const currentRotX = externalRotX !== undefined ? externalRotX : internalRotX;
  const currentPan = externalPan !== undefined ? externalPan : internalPan;
  const currentZoom = externalZoom !== undefined ? externalZoom : internalZoom;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [is4DMode, setIs4DMode] = useState(enable4D);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isCheering, setIsCheering] = useState(false);

  // Active scene and model modes
  const [sceneMode, setSceneMode] = useState<'showroom' | 'pedestal' | 'clean'>(defaultSceneMode);
  const [activeModel, setActiveModel] = useState<'auto' | 'boy' | 'girl' | 'duo'>(explicitModel);
  const [showHolo, setShowHolo] = useState(defaultShowHolo);

  // Determine effective model
  const effectiveModel: 'boy' | 'girl' | 'duo' = (() => {
    if (activeModel === 'boy') return 'boy';
    if (activeModel === 'girl') return 'girl';
    if (activeModel === 'duo') return 'duo';
    // Auto-detect based on config
    const isGirlItems =
      config.bodyType === 'female' ||
      config.topsId === 'top_zingspeed_white_hoodie' ||
      config.bottomsId === 'bot_zingspeed_pleated_skirt' ||
      config.footwearId === 'foot_zingspeed_pastel_sneakers' ||
      config.hairStyleId === 'hair_zingspeed_pink_twintails' ||
      config.topsId === 'top_princess_lolita' ||
      config.bottomsId === 'bot_lolita_skirt';
    return isGirlItems ? 'girl' : 'boy';
  })();

  // Eyelid procedural blink cycle every 3.2s
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Clear speech bubble after 4.5s
  useEffect(() => {
    if (speech) {
      const timer = setTimeout(() => setSpeech(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [speech]);

  const QUOTES = [
    "Sẵn sàng bứt tốc đường đua tiếng Anh hôm nay chưa bạn ơi! 🏎️💨",
    "ZingSpeed Chibi 3D phong cách đường phố siêu ngầu và bóng bẩy! ✨",
    "Hãy giữ chuỗi ngày học rực lửa! Luyện từ vựng để mở khóa trang phục hiếm! 🌟",
    "Túi chân mèo Neko Paw 3D và giày Pastel này xinh xỉu luôn á! 🐾💖",
    "Đôi cánh sấm sét tốc độ giúp bạn vượt qua mọi chướng ngại IELTS 8.5! ⚡",
    "Phong cách đồ chơi sưu tập Chibi SD 3D Vinyl cao cấp chuẩn ZingSpeed! 🎮"
  ];

  const speakQuote = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[^\w\s\.\?!,']/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'vi-VN';
        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback safely
      }
    }
  };

  const handleAvatarClick = () => {
    if (isDragging) return;
    setIsCheering(true);
    setTimeout(() => setIsCheering(false), 600);
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setSpeech(quote);
    speakQuote(quote);
    if (onClick) onClick();
  };

  // Mouse & Touch 3D Orbit Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveOrbit) return;
    if (e.button === 2 || e.shiftKey) {
      setDragMode('pan');
    } else if (e.button === 0) {
      setDragMode('rotate');
    }
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && interactiveOrbit) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (dragMode === 'rotate') {
        const newY = currentRotY + dx * 0.8;
        const newX = Math.max(-25, Math.min(25, currentRotX - dy * 0.4));
        if (onRotationChange) {
          onRotationChange(newY, newX);
        } else {
          setInternalRotY(newY);
          setInternalRotX(newX);
        }
      } else {
        const newPan = { x: currentPan.x + dx, y: currentPan.y + dy };
        if (onPanChange) {
          onPanChange(newPan);
        } else {
          setInternalPan(newPan);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!interactiveOrbit) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const newZoom = Math.max(0.6, Math.min(2.0, currentZoom + delta));
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactiveOrbit || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragMode('rotate');
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !interactiveOrbit || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    const newY = currentRotY + dx * 0.8;
    const newX = Math.max(-25, Math.min(25, currentRotX - dy * 0.4));
    if (onRotationChange) {
      onRotationChange(newY, newX);
    } else {
      setInternalRotY(newY);
      setInternalRotX(newX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Normalized rotation angle for back/front detection
  const normalizedRotY = ((currentRotY % 360) + 360) % 360;
  const isBackView = normalizedRotY > 90 && normalizedRotY < 270;
  const faceOpacity = isBackView ? 0 : Math.max(0, 1 - Math.abs(normalizedRotY - 0) / 90);

  // Viewbox setup
  let viewBox = '0 0 540 620';
  if (effectiveModel === 'duo') {
    viewBox = '-30 -10 600 640';
  } else if (mode === 'head') {
    viewBox = '150 90 240 240';
  } else if (mode === 'bust') {
    viewBox = '120 75 300 330';
  }

  return (
    <div
      onClick={handleAvatarClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={e => e.preventDefault()}
      className={`relative inline-flex items-center justify-center select-none cursor-grab active:cursor-grabbing group ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        aspectRatio: effectiveModel === 'duo' ? '600 / 640' : mode === 'full' ? '540 / 620' : '1 / 1',
        maxWidth: '100%',
        perspective: '1000px',
        touchAction: 'none'
      }}
      title="Giữ chuột trái để xoay 360° 3D • Cuộn chuột để zoom • Bấm để nghe âm thanh"
    >
      {/* 5D Interactive Voice Speech Bubble */}
      {speech && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/95 text-white border-2 border-amber-400 text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2 max-w-[320px] pointer-events-none">
          <Volume2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="line-clamp-2 leading-tight">{speech}</span>
        </div>
      )}

      {/* Floating Control Badges (Top-Right) */}
      {showControls && mode === 'full' && (
        <div className="absolute top-2 right-2 z-40 flex items-center gap-1.5 flex-wrap justify-end">
          {/* Model Switcher Button (Boy / Girl / Duo) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const next: Record<string, 'boy' | 'girl' | 'duo'> = {
                boy: 'girl',
                girl: 'duo',
                duo: 'boy'
              };
              setActiveModel(next[effectiveModel]);
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-400/50 shadow-md hover:bg-slate-900 transition-all"
            title="Đổi nhân vật: Boy Racer / Girl Idol / Duo Cả Hai"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {effectiveModel === 'boy' ? '👦 Boy Racer' : effectiveModel === 'girl' ? '👧 Girl Idol' : '👫 Duo ZingSpeed'}
            </span>
          </button>

          {/* Showroom Scene Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSceneMode(sceneMode === 'showroom' ? 'pedestal' : sceneMode === 'pedestal' ? 'clean' : 'showroom');
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-cyan-400/50 shadow-md hover:bg-slate-900 transition-all"
            title="Đổi cảnh nền: Cửa Hàng Showroom / Bục Đứng / Tối Giản"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {sceneMode === 'showroom' ? '🏬 Showroom' : sceneMode === 'pedestal' ? '🏛️ Bục Đứng' : '✨ Tối Giản'}
            </span>
          </button>

          {/* 4D/5D Live Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIs4DMode(!is4DMode);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 border transition-all ${
              is4DMode
                ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 text-pink-400 border-pink-400/80 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
            title="Bật/Tắt hiệu ứng chuyển động sống động"
          >
            <Sparkles className={`w-3 h-3 ${is4DMode ? 'text-pink-400 animate-spin' : ''}`} />
            <span>{is4DMode ? '3D Live' : 'Static'}</span>
          </button>
        </div>
      )}

      {/* SVG Canvas Container with 3D Transforms */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translate3d(${currentPan.x}px, ${currentPan.y}px, 0px) scale(${currentZoom}) rotateX(${currentRotX + tilt.y}deg) rotateY(${currentRotY + tilt.x}deg) ${isCheering ? 'scale(1.04)' : ''}`,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        <svg
          viewBox={viewBox}
          className={`w-full h-full overflow-visible ${
            animateBreath ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{`
              @keyframes flutterLeft {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-5deg) translateY(-3px); }
              }
              @keyframes flutterRight {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(5deg) translateY(-3px); }
              }
              @keyframes floatHolo {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-6px); }
              }
              .wing-left-anim {
                animation: flutterLeft 2.8s ease-in-out infinite;
                transform-origin: 220px 280px;
              }
              .wing-right-anim {
                animation: flutterRight 2.8s ease-in-out infinite;
                transform-origin: 280px 280px;
              }
              .holo-float-left {
                animation: floatHolo 3.5s ease-in-out infinite;
              }
              .holo-float-right {
                animation: floatHolo 3.8s ease-in-out infinite 0.5s;
              }
            `}</style>

            {/* 3D Skin Gradients */}
            <radialGradient id="skin-boy-3d" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF4EC" />
              <stop offset="55%" stopColor="#FED7BA" />
              <stop offset="100%" stopColor="#F5B290" />
            </radialGradient>

            <radialGradient id="skin-girl-3d" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FFF8F4" />
              <stop offset="60%" stopColor="#FEE2D5" />
              <stop offset="100%" stopColor="#FBAF9D" />
            </radialGradient>

            {/* Eye Gradients */}
            <radialGradient id="boy-eye-emerald" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#022C22" />
            </radialGradient>

            <radialGradient id="girl-eye-purple" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="35%" stopColor="#C084FC" />
              <stop offset="70%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#2E1065" />
            </radialGradient>

            {/* ZingSpeed Clothing 3D Gradients */}
            <linearGradient id="hoodie-black-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2E3440" />
              <stop offset="40%" stopColor="#1E222A" />
              <stop offset="100%" stopColor="#12151B" />
            </linearGradient>

            <linearGradient id="hoodie-white-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            <linearGradient id="neon-cyan-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            <linearGradient id="neon-gold-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            <linearGradient id="boots-black-leather" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="sneaker-pastel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            <linearGradient id="skirt-navy-pleat" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="boy-hair-slate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="40%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="girl-hair-pink" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="45%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>

            {/* Showroom Boutique Scene Gradients */}
            <linearGradient id="room-wall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF8F0" />
              <stop offset="60%" stopColor="#FCECDC" />
              <stop offset="100%" stopColor="#F7DFCA" />
            </linearGradient>

            <linearGradient id="wood-floor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F6D5B4" />
              <stop offset="40%" stopColor="#E6B88A" />
              <stop offset="100%" stopColor="#C88E5A" />
            </linearGradient>

            <linearGradient id="holo-card-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.12" />
            </linearGradient>

            {/* Drop Shadows and Glow Filters */}
            <filter id="toy-3d-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.22" />
            </filter>

            <filter id="neon-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#06B6D4" floodOpacity="0.75" />
            </filter>

            <filter id="neon-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#EAB308" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* ========================================================
              LAYER 0: BOUTIQUE SHOWROOM / WARDROBE ENVIRONMENT
          ======================================================== */}
          {sceneMode === 'showroom' && (
            <g id="showroom-background">
              {/* Back Wall */}
              <rect x="-100" y="-80" width="800" height="490" fill="url(#room-wall)" />

              {/* Upper Wall Shelves with Folded Clothes & Caps */}
              <g id="upper-shelves" opacity="0.65">
                <rect x="-80" y="30" width="760" height="14" rx="4" fill="#E2C1A2" stroke="#C8A584" strokeWidth="1" />
                {/* Folded Hats on top shelf */}
                <ellipse cx="20" cy="22" rx="30" ry="12" fill="#1E293B" />
                <path d="M 0 20 Q 20 8 40 20" stroke="#FACC15" strokeWidth="2.5" fill="none" />
                <ellipse cx="90" cy="22" rx="26" ry="11" fill="#F472B6" />
                <ellipse cx="450" cy="22" rx="28" ry="12" fill="#38BDF8" />
                <ellipse cx="510" cy="22" rx="26" ry="11" fill="#FDE047" />
              </g>

              {/* Clothes Hanging Racks on Left & Right */}
              <g id="racks-left" opacity="0.6">
                <line x1="-30" y1="90" x2="110" y2="90" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
                {/* Hanging Hoodies Left */}
                <path d="M -10 90 L -25 190 L 15 190 L 5 90 Z" fill="#38BDF8" opacity="0.85" rx="6" />
                <path d="M 25 90 L 10 195 L 50 195 L 40 90 Z" fill="#F472B6" opacity="0.85" rx="6" />
                <path d="M 60 90 L 50 200 L 95 200 L 80 90 Z" fill="#CBD5E1" opacity="0.9" rx="6" />
              </g>

              <g id="racks-right" opacity="0.6">
                <line x1="430" y1="90" x2="570" y2="90" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
                {/* Hanging Hoodies Right */}
                <path d="M 450 90 L 440 195 L 485 195 L 470 90 Z" fill="#FDE047" opacity="0.85" rx="6" />
                <path d="M 495 90 L 480 200 L 530 200 L 515 90 Z" fill="#C084FC" opacity="0.85" rx="6" />
                <path d="M 535 90 L 525 195 L 565 195 L 555 90 Z" fill="#1E293B" opacity="0.9" rx="6" />
              </g>

              {/* Polished Wooden Floor */}
              <rect x="-100" y="410" width="800" height="230" fill="url(#wood-floor)" />
              {/* Floor Plank Seams */}
              <line x1="-100" y1="460" x2="700" y2="460" stroke="#B87D4A" strokeWidth="1.5" opacity="0.45" />
              <line x1="-100" y1="520" x2="700" y2="520" stroke="#B87D4A" strokeWidth="1.5" opacity="0.45" />
              <line x1="-100" y1="585" x2="700" y2="585" stroke="#B87D4A" strokeWidth="1.5" opacity="0.45" />

              {/* Mini Cute Toy Cars on Floor */}
              {/* Orange Toy Car */}
              <g id="toy-car-orange" transform="translate(60, 480)">
                <ellipse cx="0" cy="18" rx="26" ry="6" fill="#000000" opacity="0.2" />
                <rect x="-24" y="2" width="48" height="15" rx="6" fill="#FB923C" stroke="#EA580C" strokeWidth="1" />
                <path d="M -15 2 L -8 -8 L 12 -8 L 18 2 Z" fill="#FDBA74" stroke="#EA580C" strokeWidth="1" />
                <circle cx="-14" cy="16" r="6" fill="#1E293B" />
                <circle cx="14" cy="16" r="6" fill="#1E293B" />
                <circle cx="-14" cy="16" r="2.5" fill="#E2E8F0" />
                <circle cx="14" cy="16" r="2.5" fill="#E2E8F0" />
              </g>

              {/* Blue Toy Car */}
              <g id="toy-car-blue" transform="translate(460, 490)">
                <ellipse cx="0" cy="18" rx="26" ry="6" fill="#000000" opacity="0.2" />
                <rect x="-24" y="2" width="48" height="15" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
                <path d="M -15 2 L -8 -8 L 12 -8 L 18 2 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
                <circle cx="-14" cy="16" r="6" fill="#1E293B" />
                <circle cx="14" cy="16" r="6" fill="#1E293B" />
                <circle cx="-14" cy="16" r="2.5" fill="#E2E8F0" />
                <circle cx="14" cy="16" r="2.5" fill="#E2E8F0" />
              </g>

              {/* Character Cast Shadows on Floor */}
              <ellipse cx="250" cy="545" rx="140" ry="24" fill="#000000" opacity="0.28" filter="url(#toy-3d-shadow)" />
            </g>
          )}

          {sceneMode === 'pedestal' && (
            <g id="pedestal-scene">
              <ellipse cx="250" cy="545" rx="160" ry="32" fill="#000000" opacity="0.25" />
              <ellipse cx="250" cy="535" rx="150" ry="26" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
              <ellipse cx="250" cy="530" rx="130" ry="20" fill="#FFFFFF" opacity="0.7" />
            </g>
          )}

          {/* ========================================================
              LAYER 1: WINGS (IF EQUIPPED)
          ======================================================== */}
          {config.wingsId && (
            <g id="layer-wings">
              {config.wingsId.includes('devil') ? (
                <g className="wing-left-anim">
                  <path d="M 210 270 Q 130 170 70 175 Q 110 230 90 275 Q 140 290 160 325 Z" fill="#3B0764" stroke="#A855F7" strokeWidth="2.5" />
                </g>
              ) : config.wingsId.includes('angel') ? (
                <g>
                  <g className="wing-left-anim">
                    <path d="M 210 270 C 160 180, 90 130, 65 145 C 45 185, 60 250, 100 310 C 130 335, 175 350, 205 285 Z" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" filter="url(#toy-3d-shadow)" />
                    <circle cx="68" cy="148" r="4" fill="#FDE68A" className="animate-ping" />
                  </g>
                  <g className="wing-right-anim">
                    <path d="M 290 270 C 340 180, 410 130, 435 145 C 455 185, 440 250, 400 310 C 370 335, 325 350, 295 285 Z" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" filter="url(#toy-3d-shadow)" />
                    <circle cx="432" cy="148" r="4" fill="#FDE68A" className="animate-ping" />
                  </g>
                </g>
              ) : null}
            </g>
          )}

          {/* ========================================================
              LAYER 2: CHARACTERS (BOY / GIRL / DUO)
          ======================================================== */}

          {/* --------------------------------------------------------
              CHARACTER A: ZINGSPEED BOY (STREET RACER CHIBI 3D)
          -------------------------------------------------------- */}
          {(effectiveModel === 'boy' || effectiveModel === 'duo') && (
            <g
              id="character-boy"
              transform={effectiveModel === 'duo' ? 'translate(190, 290)' : 'translate(250, 310)'}
              filter="url(#toy-3d-shadow)"
            >
              {/* REAR HAIR (Boy) */}
              <path
                d="M -75 -100 C -85 -160, 85 -160, 75 -100 C 90 -40, 80 0, 60 20 C -60 20, -80 0, -75 -100 Z"
                fill="url(#boy-hair-slate)"
              />

              {/* NECK (Boy) */}
              <rect x="-14" y="-20" width="28" height="28" rx="8" fill="url(#skin-boy-3d)" />

              {/* 3D HEAD (Boy): Smooth Spherical Chibi SD 2.5-3 heads */}
              <ellipse cx="0" cy="-105" rx="84" ry="76" fill="url(#skin-boy-3d)" />
              {/* Ears */}
              <circle cx="-82" cy="-102" r="14" fill="url(#skin-boy-3d)" />
              <circle cx="82" cy="-102" r="14" fill="url(#skin-boy-3d)" />
              <circle cx="-82" cy="-102" r="7" fill="#F5B290" opacity="0.6" />
              <circle cx="82" cy="-102" r="7" fill="#F5B290" opacity="0.6" />

              {/* LEGS & FEET (Boy) */}
              {/* Legs */}
              <rect x="-35" y="95" width="26" height="75" rx="10" fill="url(#skin-boy-3d)" />
              <rect x="9" y="95" width="26" height="75" rx="10" fill="url(#skin-boy-3d)" />

              {/* Mustard Gold Crew Socks */}
              <rect x="-35" y="145" width="26" height="22" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
              <line x1="-35" y1="152" x2="-9" y2="152" stroke="#EAB308" strokeWidth="1.5" />
              <rect x="9" y="145" width="26" height="22" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
              <line x1="9" y1="152" x2="35" y2="152" stroke="#EAB308" strokeWidth="1.5" />

              {/* Street Racer Combat Boots (High-Top Black Leather with Gold Laces) */}
              {/* Left Boot */}
              <g id="boy-left-boot" transform="translate(-22, 185)">
                <path d="M -16 -24 L 16 -24 L 20 20 L -22 20 Z" fill="url(#boots-black-leather)" stroke="#09090B" strokeWidth="2" rx="6" />
                {/* Thick Rubber Tread Sole */}
                <rect x="-24" y="16" width="46" height="12" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="2" />
                <line x1="-20" y1="23" x2="18" y2="23" stroke="#FACC15" strokeWidth="2" />
                {/* Yellow-Gold Cross Laces */}
                <line x1="-10" y1="-18" x2="10" y2="-12" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="-18" x2="-10" y2="-12" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-10" y1="-8" x2="10" y2="-2" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="-8" x2="-10" y2="-2" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Right Boot */}
              <g id="boy-right-boot" transform="translate(22, 185)">
                <path d="M -16 -24 L 16 -24 L 22 20 L -20 20 Z" fill="url(#boots-black-leather)" stroke="#09090B" strokeWidth="2" rx="6" />
                <rect x="-22" y="16" width="46" height="12" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="2" />
                <line x1="-18" y1="23" x2="20" y2="23" stroke="#FACC15" strokeWidth="2" />
                {/* Yellow-Gold Cross Laces */}
                <line x1="-10" y1="-18" x2="10" y2="-12" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="-18" x2="-10" y2="-12" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-10" y1="-8" x2="10" y2="-2" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="-8" x2="-10" y2="-2" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* BOTTOMS: Cyber Speed Racing Shorts (Black with Cyan & Yellow Stripes) */}
              <g id="boy-shorts">
                <path d="M -48 65 L 48 65 L 44 125 L 6 125 L 0 85 L -6 125 L -44 125 Z" fill="#12151B" stroke="#020617" strokeWidth="2.5" rx="4" />
                {/* Neon Yellow & Cyan Speed Trim on Hems */}
                <line x1="-43" y1="120" x2="-8" y2="120" stroke="#06B6D4" strokeWidth="3.5" />
                <line x1="-43" y1="124" x2="-8" y2="124" stroke="#FACC15" strokeWidth="2.5" />
                <line x1="8" y1="120" x2="43" y2="120" stroke="#06B6D4" strokeWidth="3.5" />
                <line x1="8" y1="124" x2="43" y2="124" stroke="#FACC15" strokeWidth="2.5" />
                {/* Side Cargo Pocket with Yellow Tab */}
                <rect x="-47" y="80" width="12" height="24" rx="2" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
                <rect x="-48" y="78" width="14" height="6" rx="1.5" fill="#FACC15" />
              </g>

              {/* TOPS: ZingSpeed Street Lightning Hoodie (Black + Cyan/Gold Stripes + Winged Lightning Emblem) */}
              <g id="boy-hoodie">
                {/* Main Torso */}
                <path d="M -54 0 L 54 0 L 50 80 L -50 80 Z" fill="url(#hoodie-black-grad)" stroke="#020617" strokeWidth="2.5" rx="6" />

                {/* Inner Yellow Hood Lining behind neck */}
                <ellipse cx="0" cy="-6" rx="34" ry="12" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />

                {/* Left Sleeve (arm resting/in pocket) */}
                <path d="M -52 5 L -72 65 L -48 72 L -35 20 Z" fill="url(#hoodie-black-grad)" stroke="#020617" strokeWidth="2" rx="4" />
                {/* Double Speed Stripes on Left Arm: Cyan + Yellow */}
                <path d="M -50 15 L -67 60" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M -46 15 L -63 60" stroke="#FACC15" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                {/* Left Hand in pocket / posed */}
                <circle cx="-58" cy="72" r="10" fill="url(#skin-boy-3d)" />

                {/* Right Arm: Reaching around / resting */}
                <path d="M 52 5 L 82 45 L 68 58 L 44 20 Z" fill="url(#hoodie-black-grad)" stroke="#020617" strokeWidth="2" rx="4" />
                <path d="M 50 15 L 75 42" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 46 15 L 71 42" stroke="#FACC15" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <circle cx="80" cy="50" r="10" fill="url(#skin-boy-3d)" />

                {/* Kangaroo Pocket */}
                <path d="M -28 42 L 28 42 L 32 75 L -32 75 Z" fill="#18181B" stroke="#06B6D4" strokeWidth="2" rx="4" />
                <line x1="-28" y1="42" x2="28" y2="42" stroke="#FACC15" strokeWidth="2" />

                {/* Yellow Drawstring Cords with Metallic Aglets */}
                <path d="M -12 4 Q -16 26 -14 36" stroke="#FACC15" strokeWidth="2" fill="none" />
                <rect x="-16" y="34" width="4" height="6" rx="1.5" fill="#E2E8F0" />
                <path d="M 12 4 Q 16 26 14 36" stroke="#FACC15" strokeWidth="2" fill="none" />
                <rect x="12" y="34" width="4" height="6" rx="1.5" fill="#E2E8F0" />

                {/* ICONIC ZINGSPEED EMBLEM: Golden Winged Lightning (⚡🪽) */}
                <g id="boy-zingspeed-emblem" transform="translate(0, 22)">
                  {/* Cyan Wings */}
                  <path d="M -2 0 C -12 -8, -26 -4, -28 6 C -20 8, -12 6, -2 3 Z" fill="url(#neon-cyan-stripe)" filter="url(#neon-glow-cyan)" />
                  <path d="M 2 0 C 12 -8, 26 -4, 28 6 C 20 8, 12 6, 2 3 Z" fill="url(#neon-cyan-stripe)" filter="url(#neon-glow-cyan)" />
                  {/* Golden Lightning Bolt */}
                  <polygon points="0,-12 4,-2 -1,-2 3,12 -5,0 0,0" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" filter="url(#neon-glow-gold)" />
                </g>
              </g>

              {/* FACE & EXPRESSION (Boy: Big Emerald Green Eyes + Confident Smile) */}
              {!isBackView && (
                <g id="boy-face" style={{ opacity: faceOpacity }}>
                  {/* Rosy Cheek Blush */}
                  <ellipse cx="-42" cy="-86" rx="14" ry="7" fill="#FB7185" opacity="0.38" />
                  <ellipse cx="42" cy="-86" rx="14" ry="7" fill="#FB7185" opacity="0.38" />

                  {/* Eyebrows (Dynamic & Confident) */}
                  <g stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none">
                    <path d="M -48 -134 Q -32 -142 -18 -132" />
                    <path d="M 18 -132 Q 32 -142 48 -134" />
                  </g>

                  {/* Left Eye (Emerald Green 3D Iris) */}
                  <g id="boy-eye-left">
                    <ellipse cx="-34" cy="-108" rx="16" ry="19" fill="#022C22" />
                    <ellipse cx="-34" cy="-105" rx="14" ry="15" fill="url(#boy-eye-emerald)" />
                    {/* Upper dark lid */}
                    <path d="M -50 -118 Q -34 -128 -18 -118" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
                    {/* Double Crisp White Catchlights */}
                    <circle cx="-38" cy="-114" r="5.5" fill="#FFFFFF" />
                    <circle cx="-28" cy="-103" r="2.8" fill="#FFFFFF" />
                  </g>

                  {/* Right Eye (Emerald Green 3D Iris) */}
                  <g id="boy-eye-right">
                    <ellipse cx="34" cy="-108" rx="16" ry="19" fill="#022C22" />
                    <ellipse cx="34" cy="-105" rx="14" ry="15" fill="url(#boy-eye-emerald)" />
                    <path d="M 18 -118 Q 34 -128 50 -118" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <circle cx="30" cy="-114" r="5.5" fill="#FFFFFF" />
                    <circle cx="40" cy="-103" r="2.8" fill="#FFFFFF" />
                  </g>

                  {/* Cute Nose */}
                  <circle cx="0" cy="-90" r="2" fill="#E11D48" opacity="0.35" />

                  {/* Confident Friendly Smile */}
                  <path d="M -14 -78 Q 0 -66 14 -78" stroke="#0F172A" strokeWidth="3" fill="#F43F5E" strokeLinecap="round" />
                  {/* Pearly White Teeth glint */}
                  <path d="M -8 -77 Q 0 -72 8 -77" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                </g>
              )}

              {/* FRONT HAIR (Boy: Modern Spiky Anime with Golden Highlight Streaks) */}
              <g id="boy-front-hair">
                {/* Base Slate Hair Tufts */}
                <path
                  d="M -84 -115 C -88 -175, 88 -175, 84 -115 C 68 -135, 45 -142, 20 -138 C 0 -140, -45 -135, -84 -115 Z"
                  fill="url(#boy-hair-slate)"
                />
                {/* Spiky Fringe Tufts */}
                <polygon points="-75,-120 -55,-155 -40,-130" fill="url(#boy-hair-slate)" />
                <polygon points="-45,-130 -25,-175 -5,-135" fill="url(#boy-hair-slate)" />
                <polygon points="-10,-135 15,-185 35,-140" fill="url(#boy-hair-slate)" />
                <polygon points="30,-140 60,-165 75,-120" fill="url(#boy-hair-slate)" />

                {/* ICONIC GOLDEN RACING STREAK HIGHLIGHTS (⚡) */}
                <polygon points="-28,-140 -20,-172 -10,-142" fill="url(#neon-gold-stripe)" filter="url(#neon-glow-gold)" />
                <polygon points="12,-142 18,-182 28,-148" fill="url(#neon-gold-stripe)" filter="url(#neon-glow-gold)" />
                <path d="M 40 -142 Q 52 -160 58 -138" stroke="#FDE047" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                {/* 3D Specular Vinyl Gloss Band across hair */}
                <path d="M -60 -150 Q 0 -170 60 -150" stroke="#FFFFFF" strokeWidth="3.5" fill="none" opacity="0.45" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* --------------------------------------------------------
              CHARACTER B: ZINGSPEED GIRL (SWEET IDOL CHIBI 3D)
          -------------------------------------------------------- */}
          {(effectiveModel === 'girl' || effectiveModel === 'duo') && (
            <g
              id="character-girl"
              transform={effectiveModel === 'duo' ? 'translate(315, 290)' : 'translate(250, 310)'}
              filter="url(#toy-3d-shadow)"
            >
              {/* REAR HAIR & BOUNCY TWINTAILS (Girl) */}
              <g id="girl-twintails">
                {/* Left Long Twintail */}
                <path
                  d="M -75 -110 C -145 -80, -155 40, -115 120 C -95 70, -85 -20, -65 -85 Z"
                  fill="url(#girl-hair-pink)"
                />
                {/* Purple Twintail Hair Tie + Star Barrette */}
                <circle cx="-75" cy="-105" r="9" fill="#9333EA" />
                <polygon points="-85,-115 -80,-102 -70,-102 -77,-95 -73,-85 -85,-92 -95,-85 -91,-95 -100,-102 -90,-102" fill="#FACC15" />

                {/* Right Long Twintail */}
                <path
                  d="M 75 -110 C 145 -80, 155 40, 115 120 C 95 70, 85 -20, 65 -85 Z"
                  fill="url(#girl-hair-pink)"
                />
                {/* Purple Twintail Hair Tie + Cyan Star Barrette */}
                <circle cx="75" cy="-105" r="9" fill="#9333EA" />
                <polygon points="85,-115 80,-102 70,-102 77,-95 73,-85 85,-92 95,-85 91,-95 100,-102 90,-102" fill="#38BDF8" />
              </g>

              {/* NECK (Girl) + Star Choker */}
              <rect x="-12" y="-20" width="24" height="28" rx="8" fill="url(#skin-girl-3d)" />
              {/* Black Star Choker Ribbon */}
              <rect x="-13" y="-12" width="26" height="5" rx="2" fill="#18181B" />
              <polygon points="0,-16 2.5,-12 7,-12 3.5,-9.5 5,-5 0,-8 -5,-5 -3.5,-9.5 -7,-12 -2.5,-12" fill="#FACC15" />

              {/* 3D HEAD (Girl): Smooth Cute Round Cheek Chibi SD */}
              <ellipse cx="0" cy="-105" rx="82" ry="74" fill="url(#skin-girl-3d)" />
              {/* Ears */}
              <circle cx="-80" cy="-102" r="13" fill="url(#skin-girl-3d)" />
              <circle cx="80" cy="-102" r="13" fill="url(#skin-girl-3d)" />
              <circle cx="-80" cy="-102" r="6" fill="#FBAF9D" opacity="0.6" />
              <circle cx="80" cy="-102" r="6" fill="#FBAF9D" opacity="0.6" />

              {/* LEGS & FEET (Girl): Slim Chibi legs + Knee-High White Socks */}
              <rect x="-32" y="95" width="24" height="75" rx="10" fill="url(#skin-girl-3d)" />
              <rect x="8" y="95" width="24" height="75" rx="10" fill="url(#skin-girl-3d)" />

              {/* White Knee-High Sports Socks with subtle shade */}
              <rect x="-32" y="105" width="24" height="65" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              <line x1="-32" y1="112" x2="-8" y2="112" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="8" y="105" width="24" height="65" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              <line x1="8" y1="112" x2="32" y2="112" stroke="#CBD5E1" strokeWidth="1" />

              {/* Pastel Chunky High-Top Sneakers (Lavender Purple & Soft Pink + Platform Sole) */}
              {/* Left Sneaker */}
              <g id="girl-left-sneaker" transform="translate(-20, 185)">
                <path d="M -15 -22 L 15 -22 L 18 18 L -20 18 Z" fill="url(#sneaker-pastel-grad)" stroke="#7E22CE" strokeWidth="1.5" rx="6" />
                {/* Thick White Platform Sole */}
                <rect x="-22" y="14" width="42" height="14" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="-18" y1="21" x2="16" y2="21" stroke="#E2E8F0" strokeWidth="1.5" />
                {/* Pink/Lilac Laces */}
                <line x1="-8" y1="-14" x2="8" y2="-10" stroke="#FCE7F3" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="-14" x2="-8" y2="-10" stroke="#FCE7F3" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Right Sneaker */}
              <g id="girl-right-sneaker" transform="translate(20, 185)">
                <path d="M -15 -22 L 15 -22 L 20 18 L -18 18 Z" fill="url(#sneaker-pastel-grad)" stroke="#7E22CE" strokeWidth="1.5" rx="6" />
                <rect x="-20" y="14" width="42" height="14" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="-16" y1="21" x2="18" y2="21" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="-8" y1="-14" x2="8" y2="-10" stroke="#FCE7F3" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="-14" x2="-8" y2="-10" stroke="#FCE7F3" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* BOTTOMS: Cyber Idol Pleated Tennis Skirt (Navy Blue with Crisp White Hem) */}
              <g id="girl-skirt">
                <path d="M -44 65 L 44 65 L 56 115 L -56 115 Z" fill="url(#skirt-navy-pleat)" stroke="#090D16" strokeWidth="2" rx="4" />
                {/* Crisp White Hem Stripe */}
                <path d="M -54 110 L 54 110" stroke="#FFFFFF" strokeWidth="3" />
                {/* Shaded 3D Pleat Folds */}
                <line x1="-36" y1="65" x2="-44" y2="110" stroke="#020617" strokeWidth="1.5" />
                <line x1="-18" y1="65" x2="-22" y2="110" stroke="#020617" strokeWidth="1.5" />
                <line x1="0" y1="65" x2="0" y2="110" stroke="#020617" strokeWidth="1.5" />
                <line x1="18" y1="65" x2="22" y2="110" stroke="#020617" strokeWidth="1.5" />
                <line x1="36" y1="65" x2="44" y2="110" stroke="#020617" strokeWidth="1.5" />
              </g>

              {/* TOPS: Starlight Speed White Hoodie (Oversized White + Cyan Wings/Gold Bolt Logo) */}
              <g id="girl-hoodie">
                {/* Oversized White Torso */}
                <path d="M -52 0 L 52 0 L 46 76 L -46 76 Z" fill="url(#hoodie-white-grad)" stroke="#CBD5E1" strokeWidth="2" rx="6" />

                {/* Soft Blue Hood Collar */}
                <ellipse cx="0" cy="-6" rx="32" ry="12" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />

                {/* Right Arm: Peace Sign ✌️ Hand raised */}
                <g id="girl-peace-arm">
                  <path d="M 48 5 L 75 15 L 85 -20 L 68 -25 L 44 15 Z" fill="url(#hoodie-white-grad)" stroke="#CBD5E1" strokeWidth="2" rx="4" />
                  {/* Candy bead bracelet on wrist */}
                  <circle cx="74" cy="-18" r="3" fill="#F472B6" />
                  <circle cx="78" cy="-21" r="3" fill="#FACC15" />
                  <circle cx="82" cy="-18" r="3" fill="#38BDF8" />
                  {/* Hand in Anime Peace Sign ✌️ */}
                  <circle cx="78" cy="-30" r="8" fill="url(#skin-girl-3d)" />
                  {/* Two cute peace fingers */}
                  <rect x="74" y="-45" width="4" height="15" rx="2" fill="url(#skin-girl-3d)" />
                  <rect x="80" y="-43" width="4" height="14" rx="2" fill="url(#skin-girl-3d)" />
                </g>

                {/* Left Arm: Resting naturally */}
                <path d="M -48 5 L -72 55 L -52 62 L -38 18 Z" fill="url(#hoodie-white-grad)" stroke="#CBD5E1" strokeWidth="2" rx="4" />
                <circle cx="-62" cy="62" r="9" fill="url(#skin-girl-3d)" />

                {/* Light Blue Drawstring Cords */}
                <path d="M -10 4 Q -14 26 -12 36" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <circle cx="-12" cy="38" r="2.5" fill="#38BDF8" />
                <path d="M 10 4 Q 14 26 12 36" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <circle cx="12" cy="38" r="2.5" fill="#38BDF8" />

                {/* Chest Emblem: Cyan Wings + Golden Lightning Bolt (⚡🪽) */}
                <g id="girl-zingspeed-emblem" transform="translate(0, 22)">
                  <path d="M -2 0 C -12 -8, -24 -4, -26 6 C -18 8, -10 6, -2 3 Z" fill="url(#neon-cyan-stripe)" filter="url(#neon-glow-cyan)" />
                  <path d="M 2 0 C 12 -8, 24 -4, 26 6 C 18 8, 10 6, 2 3 Z" fill="url(#neon-cyan-stripe)" filter="url(#neon-glow-cyan)" />
                  <polygon points="0,-12 4,-2 -1,-2 3,12 -5,0 0,0" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" filter="url(#neon-glow-gold)" />
                </g>
              </g>

              {/* ACCESSORY: Neko Paw 3D Crossbody Sling Bag (White Plush with Pink Paw Pads) */}
              <g id="girl-cat-paw-bag">
                {/* Black Diagonal Crossbody Strap */}
                <path d="M -25 -2 L 28 65" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
                {/* Rounded White Sling Pouch at Hip */}
                <g transform="translate(26, 68)">
                  <ellipse cx="0" cy="0" rx="18" ry="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" filter="url(#toy-3d-shadow)" />
                  {/* Pink 3D Paw Pads (🐾) */}
                  <ellipse cx="0" cy="3" rx="7" ry="5.5" fill="#FB7185" />
                  <circle cx="-6" cy="-4.5" r="3" fill="#FB7185" />
                  <circle cx="0" cy="-6.5" r="3.2" fill="#FB7185" />
                  <circle cx="6" cy="-4.5" r="3" fill="#FB7185" />
                </g>
              </g>

              {/* FACE & EXPRESSION (Girl: Big Amethyst Purple Eyes + Sweet Smile) */}
              {!isBackView && (
                <g id="girl-face" style={{ opacity: faceOpacity }}>
                  {/* Rosy Peach Cheek Blush with Twinkling Sparkles */}
                  <ellipse cx="-40" cy="-86" rx="15" ry="8" fill="#FB7185" opacity="0.45" />
                  <text x="-44" y="-82" fontSize="9" fill="#FFFFFF" fontWeight="bold">✦</text>

                  <ellipse cx="40" cy="-86" rx="15" ry="8" fill="#FB7185" opacity="0.45" />
                  <text x="36" y="-82" fontSize="9" fill="#FFFFFF" fontWeight="bold">✦</text>

                  {/* Eyebrows (Sweet & Gentle arch) */}
                  <g stroke="#DB2777" strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M -46 -132 Q -30 -140 -16 -132" />
                    <path d="M 16 -132 Q 30 -140 46 -132" />
                  </g>

                  {/* Left Eye (Luminous Amethyst Purple 3D) */}
                  <g id="girl-eye-left">
                    <ellipse cx="-32" cy="-108" rx="16" ry="19" fill="#2E1065" />
                    <ellipse cx="-32" cy="-105" rx="14" ry="15" fill="url(#girl-eye-purple)" />
                    {/* Double Anime Eyelashes */}
                    <path d="M -48 -118 Q -32 -128 -16 -118" stroke="#1E1B4B" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M -18 -120 L -12 -124" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M -16 -115 L -10 -117" stroke="#1E1B4B" strokeWidth="2.2" strokeLinecap="round" />
                    {/* Catchlights */}
                    <circle cx="-36" cy="-114" r="5.5" fill="#FFFFFF" />
                    <circle cx="-26" cy="-103" r="3" fill="#FFFFFF" />
                    <ellipse cx="-32" cy="-97" rx="6" ry="2" fill="#FFFFFF" opacity="0.6" />
                  </g>

                  {/* Right Eye (Luminous Amethyst Purple 3D) */}
                  <g id="girl-eye-right">
                    <ellipse cx="32" cy="-108" rx="16" ry="19" fill="#2E1065" />
                    <ellipse cx="32" cy="-105" rx="14" ry="15" fill="url(#girl-eye-purple)" />
                    <path d="M 16 -118 Q 32 -128 48 -118" stroke="#1E1B4B" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M 48 -120 L 54 -124" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 46 -115 L 52 -117" stroke="#1E1B4B" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="28" cy="-114" r="5.5" fill="#FFFFFF" />
                    <circle cx="38" cy="-103" r="3" fill="#FFFFFF" />
                    <ellipse cx="32" cy="-97" rx="6" ry="2" fill="#FFFFFF" opacity="0.6" />
                  </g>

                  {/* Tiny Cute Button Nose */}
                  <circle cx="0" cy="-90" r="2" fill="#E11D48" opacity="0.4" />

                  {/* Sweet anime smile with lip gloss highlight */}
                  <path d="M -12 -76 Q 0 -66 12 -76" stroke="#9F1239" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  <circle cx="0" cy="-71" r="2" fill="#FDA4AF" />
                </g>
              )}

              {/* FRONT HAIR & BANGS (Girl: Pastel Pink Bangs + Ahoge + Star Barrettes) */}
              <g id="girl-front-hair">
                {/* Bangs Dome */}
                <path
                  d="M -82 -115 C -86 -175, 86 -175, 82 -115 C 60 -138, 30 -140, 0 -138 C -30 -140, -60 -138, -82 -115 Z"
                  fill="url(#girl-hair-pink)"
                />
                {/* Soft Bangs Tips */}
                <polygon points="-50,-130 -35,-105 -25,-130" fill="url(#girl-hair-pink)" />
                <polygon points="-20,-130 -5,-102 10,-130" fill="url(#girl-hair-pink)" />
                <polygon points="15,-130 30,-105 45,-130" fill="url(#girl-hair-pink)" />

                {/* Ahoge (Playful Antenna Hair Curl) */}
                <path d="M 0 -165 Q 12 -195 24 -185 Q 16 -175 4 -162" fill="url(#girl-hair-pink)" stroke="#DB2777" strokeWidth="1" />

                {/* Star Barrettes on front hair */}
                <polygon points="-60,-135 -56,-124 -46,-124 -52,-118 -49,-109 -60,-115 -71,-109 -68,-118 -74,-124 -64,-124" fill="#38BDF8" />
                <polygon points="-48,-148 -44,-137 -34,-137 -40,-131 -37,-122 -48,-128 -59,-122 -56,-131 -62,-137 -52,-137" fill="#FACC15" />

                {/* 3D Gloss Highlight Sheen across hair */}
                <path d="M -60 -150 Q 0 -168 60 -150" stroke="#FFFFFF" strokeWidth="3.5" fill="none" opacity="0.5" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ========================================================
              LAYER 3: FLOATING HOLOGRAPHIC UI CARDS (MATCHING THE IMAGE)
          ======================================================== */}
          {showHolo && sceneMode === 'showroom' && mode === 'full' && (
            <g id="holographic-cards" style={{ pointerEvents: 'none' }}>
              {/* Left Holographic Card (Boy's Street Racing Gear) */}
              <g className="holo-float-left" transform="translate(45, 230)">
                {/* Glass Card Plate */}
                <rect x="-35" y="-35" width="110" height="90" rx="10" fill="url(#holo-card-glass)" stroke="#38BDF8" strokeWidth="1.5" filter="url(#toy-3d-shadow)" />
                {/* Card Corner Tech Decals */}
                <line x1="-30" y1="-30" x2="-20" y2="-30" stroke="#22D3EE" strokeWidth="2" />
                <line x1="-30" y1="-30" x2="-30" y2="-20" stroke="#22D3EE" strokeWidth="2" />
                <line x1="70" y1="50" x2="60" y2="50" stroke="#22D3EE" strokeWidth="2" />
                <line x1="70" y1="50" x2="70" y2="40" stroke="#22D3EE" strokeWidth="2" />

                {/* Item Thumbnail (Mini Black Hoodie) */}
                <rect x="-24" y="-24" width="30" height="30" rx="6" fill="#0F172A" stroke="#06B6D4" strokeWidth="1" />
                <path d="M -18 -14 L -10 -14 L -8 0 L -20 0 Z" fill="#1E293B" />
                <polygon points="-14,-10 -12,-5 -16,-5" fill="#FACC15" />

                {/* Item Title & Tags */}
                <text x="12" y="-14" fontSize="9" fontWeight="bold" fill="#F8FAFC">Tia Chớp</text>
                <rect x="12" y="-6" width="24" height="9" rx="2" fill="#0284C7" />
                <text x="14" y="1" fontSize="7" fontWeight="bold" fill="#FFFFFF">SPEED</text>

                {/* Price & Stats */}
                <text x="-24" y="24" fontSize="8" fill="#94A3B8">Giá Token: 1,500 🪙</text>
                <text x="-24" y="38" fontSize="8" fill="#38BDF8">Cấp mở: Lv.10 ★</text>
              </g>

              {/* Right Holographic Card (Girl's Starlight Idol Gear) */}
              <g className="holo-float-right" transform="translate(405, 230)">
                <rect x="-35" y="-35" width="110" height="90" rx="10" fill="url(#holo-card-glass)" stroke="#38BDF8" strokeWidth="1.5" filter="url(#toy-3d-shadow)" />
                <line x1="-30" y1="-30" x2="-20" y2="-30" stroke="#22D3EE" strokeWidth="2" />
                <line x1="-30" y1="-30" x2="-30" y2="-20" stroke="#22D3EE" strokeWidth="2" />
                <line x1="70" y1="50" x2="60" y2="50" stroke="#22D3EE" strokeWidth="2" />
                <line x1="70" y1="50" x2="70" y2="40" stroke="#22D3EE" strokeWidth="2" />

                {/* Item Thumbnail (Mini White Hoodie) */}
                <rect x="-24" y="-24" width="30" height="30" rx="6" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1" />
                <path d="M -18 -14 L -10 -14 L -8 0 L -20 0 Z" fill="#F1F5F9" />
                <polygon points="-14,-10 -12,-5 -16,-5" fill="#38BDF8" />

                {/* Item Title & Tags */}
                <text x="12" y="-14" fontSize="9" fontWeight="bold" fill="#F8FAFC">Sứ Giả</text>
                <rect x="12" y="-6" width="24" height="9" rx="2" fill="#EC4899" />
                <text x="15" y="1" fontSize="7" fontWeight="bold" fill="#FFFFFF">IDOL</text>

                {/* Price & Stats */}
                <text x="-24" y="24" fontSize="8" fill="#94A3B8">Giá Token: 1,500 🪙</text>
                <text x="-24" y="38" fontSize="8" fill="#F472B6">Cấp mở: Lv.10 ★</text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

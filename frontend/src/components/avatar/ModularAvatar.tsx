import React, { useState, useEffect, useRef } from 'react';
import { AvatarConfigDto } from '../../types/avatarAndShop';
import { Sparkles, Volume2, RotateCcw, Eye } from 'lucide-react';

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
  onZoomChange
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

  // Eyelid procedural blink cycle every 3.2s
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Clear speech bubble after 4s
  useEffect(() => {
    if (speech) {
      const timer = setTimeout(() => setSpeech(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [speech]);

  const QUOTES = [
    "Ready for your IELTS practice? Let's aim for Band 8.5! 🌟",
    "Trang phục Chibi hôm nay dễ thương và lung linh quá! ✨",
    "Keep that learning streak alive, champion! 🔥",
    "TOEIC 990 is within reach! 15 minutes of focus! 🎯",
    "Cánh Ác Quỷ & Thiên Thần bay bổng cùng tri thức! 🪽",
    "Phong cách Chibi TeaMobi huyền thoại thật hoài niệm! 💖"
  ];

  const speakQuote = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[^\w\s\.\?!,']/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
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
    // Right click or Shift key triggers Pan mode, left click triggers Rotate
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
      return;
    }

    if (!is4DMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: x * 6, y: -y * 6 });
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
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    const newZoom = Math.max(0.75, Math.min(1.85, currentZoom + delta));
    if (onZoomChange) {
      onZoomChange(newZoom);
    } else {
      setInternalZoom(newZoom);
    }
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactiveOrbit || e.touches.length === 0) return;
    setIsDragging(true);
    setDragMode('rotate');
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !interactiveOrbit || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastMousePos.current.x;
    const dy = touch.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };

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

  const skin = config.skinColor || '#FFDFC4';
  const hair = config.hairColor || '#261C14';

  let viewBox = '0 0 500 600';
  if (mode === 'head') {
    viewBox = '130 80 240 240';
  } else if (mode === 'bust') {
    viewBox = '110 70 280 320';
  }

  const hairStyle = config.hairStyleId || 'short_crop';
  const isLongHair = ['long_waves', 'twin_tails', 'high_ponytail', 'bob_cut'].includes(hairStyle);

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
        aspectRatio: mode === 'full' ? '500 / 600' : '1 / 1',
        maxWidth: '100%',
        perspective: '1000px',
        touchAction: 'none'
      }}
      title="Giữ chuột trái để xoay 360° • Cuộn chuột để zoom • Bấm để nghe tương tác"
    >
      {/* 5D Interactive Voice Speech Bubble */}
      {speech && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-2xl bg-slate-900/95 text-white border-2 border-amber-400 text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2 max-w-[280px] pointer-events-none">
          <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="line-clamp-2">{speech}</span>
        </div>
      )}

      {/* 4D/5D Mode Indicator & Switcher */}
      {showControls && mode === 'full' && (
        <div className="absolute top-2 right-2 z-40 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIs4DMode(!is4DMode);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border transition-all ${
              is4DMode
                ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 text-pink-500 border-pink-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Bật/Tắt hiệu ứng 4D/5D Chibi sống động"
          >
            <Sparkles className={`w-3 h-3 ${is4DMode ? 'text-pink-400 animate-spin' : ''}`} />
            <span>{is4DMode ? '💖 Chibi 4D Live' : '2D Static'}</span>
          </button>
        </div>
      )}

      {/* SVG Canvas Container with 3D Transforms */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translate3d(${currentPan.x}px, ${currentPan.y}px, 0px) scale(${currentZoom}) rotateX(${currentRotX + tilt.y}deg) rotateY(${currentRotY + tilt.x}deg) ${isCheering ? 'scale(1.05)' : ''}`,
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
                50% { transform: rotate(-6deg) translateY(-4px); }
              }
              @keyframes flutterRight {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(6deg) translateY(-4px); }
              }
              @keyframes fairyGlow {
                0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 6px rgba(244,114,182,0.8)); }
                50% { opacity: 1; filter: drop-shadow(0 0 14px rgba(168,85,247,0.9)); }
              }
              .chibi-wing-left {
                animation: flutterLeft 2.8s ease-in-out infinite;
                transform-origin: 210px 280px;
              }
              .chibi-wing-right {
                animation: flutterRight 2.8s ease-in-out infinite;
                transform-origin: 290px 280px;
              }
              .fairy-dust {
                animation: fairyGlow 3s ease-in-out infinite;
              }
            `}</style>

            {/* Gradients */}
            <radialGradient id="chibi-triumph-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="chibi-gold-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Cánh Thiên Thần (Angel Wings) */}
            <linearGradient id="chibi-angel-wings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FEF3C7" />
              <stop offset="75%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Cánh Ác Quỷ (Devil Wings) */}
            <linearGradient id="chibi-devil-wings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B0764" />
              <stop offset="40%" stopColor="#1E1B4B" />
              <stop offset="70%" stopColor="#4C1D95" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="chibi-devil-bone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#E879F9" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>

            {/* Cánh Bướm Tiên Giới (Fairy Wings) */}
            <linearGradient id="chibi-fairy-wings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#C084FC" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0.9" />
            </linearGradient>

            {/* Cánh Cyber Mech */}
            <linearGradient id="chibi-cyber-wings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>

            {/* Cánh Phượng Hoàng Lửa */}
            <linearGradient id="chibi-phoenix-wings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#F97316" />
              <stop offset="75%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>

            {/* Soft Shadow */}
            <filter id="chibi-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.16" />
            </filter>
            <filter id="chibi-glow-pink" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F43F5E" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* ========================================================
              LAYER 0: AURA & BACKGROUND (Z: 0)
          ======================================================== */}
          {mode === 'full' && (
            <g id="layer-0-aura">
              {config.auraBackgroundId === 'aura_golden_triumph' && (
                <g id="aura-triumph">
                  <circle cx="250" cy="300" r="230" fill="url(#chibi-triumph-glow)" />
                  <circle cx="180" cy="340" r="6" fill="#FDE68A" className="animate-ping" />
                  <circle cx="320" cy="310" r="5" fill="#FDE68A" className="animate-ping" />
                  <circle cx="250" cy="200" r="7" fill="#FDE68A" />
                </g>
              )}

              {config.auraBackgroundId === 'aura_floating_books' && (
                <g id="aura-books">
                  <ellipse cx="250" cy="320" rx="210" ry="110" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
                  <g transform="translate(60, 270) rotate(-15)">
                    <rect width="36" height="24" rx="3" fill="#4F46E5" />
                    <rect x="2" y="2" width="32" height="20" rx="2" fill="#818CF8" />
                  </g>
                  <g transform="translate(400, 260) rotate(15)">
                    <rect width="36" height="24" rx="3" fill="#EC4899" />
                    <rect x="2" y="2" width="32" height="20" rx="2" fill="#F472B6" />
                  </g>
                </g>
              )}

              {/* Base Pedestal Platform */}
              <g id="pedestal" transform="translate(250, 520)">
                <ellipse cx="0" cy="10" rx="140" ry="24" fill="#000000" opacity="0.12" />
                <ellipse cx="0" cy="0" rx="130" ry="20" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2.5" />
                <ellipse cx="0" cy="-3" rx="115" ry="15" fill="#FFFFFF" opacity="0.6" />
              </g>
            </g>
          )}

          {/* ========================================================
              LAYER 1: WINGS (Z: 1)
          ======================================================== */}
          {mode !== 'head' && config.wingsId && (
            <g id="layer-1-wings">
              {/* Đôi Cánh Ác Quỷ Dạ Xoa (Demonic Shadow Bat Wings) */}
              {config.wingsId === 'wings_devil_demonic' && (
                <g id="wings-devil" filter="url(#chibi-drop-shadow)">
                  {/* Left Bat Wing */}
                  <g className="chibi-wing-left">
                    <path
                      d="M 210 270 Q 140 180 80 185 Q 115 230 100 275 Q 140 290 160 325 Q 185 300 210 270 Z"
                      fill="url(#chibi-devil-wings)"
                      stroke="#581C87"
                      strokeWidth="2.5"
                    />
                    {/* Sharp bone ribs */}
                    <path d="M 205 270 Q 145 190 80 185" stroke="url(#chibi-devil-bone)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 145 220 Q 115 240 100 275" stroke="url(#chibi-devil-bone)" strokeWidth="2.5" fill="none" />
                    <path d="M 175 250 Q 155 285 160 325" stroke="url(#chibi-devil-bone)" strokeWidth="2" fill="none" />
                    {/* Top Horn Talon */}
                    <polygon points="80,185 70,170 85,180" fill="#C084FC" />
                    <circle cx="75" cy="175" r="3.5" fill="#E879F9" className="animate-ping" />
                  </g>
                  {/* Right Bat Wing */}
                  <g className="chibi-wing-right">
                    <path
                      d="M 290 270 Q 360 180 420 185 Q 385 230 400 275 Q 360 290 340 325 Q 315 300 290 270 Z"
                      fill="url(#chibi-devil-wings)"
                      stroke="#581C87"
                      strokeWidth="2.5"
                    />
                    <path d="M 295 270 Q 355 190 420 185" stroke="url(#chibi-devil-bone)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M 355 220 Q 385 240 400 275" stroke="url(#chibi-devil-bone)" strokeWidth="2.5" fill="none" />
                    <path d="M 325 250 Q 345 285 340 325" stroke="url(#chibi-devil-bone)" strokeWidth="2" fill="none" />
                    <polygon points="420,185 430,170 415,180" fill="#C084FC" />
                    <circle cx="425" cy="175" r="3.5" fill="#E879F9" className="animate-ping" />
                  </g>
                  {/* Center demonic brooch */}
                  <polygon points="250,265 258,276 250,287 242,276" fill="#A855F7" stroke="#3B0764" strokeWidth="2" />
                </g>
              )}

              {/* Đôi Cánh Bướm Tiên Giới Chibi (Ethereal Fairy Wings) */}
              {config.wingsId === 'wings_fairy_butterfly' && (
                <g id="wings-fairy" className="fairy-dust">
                  {/* Left Fairy Wing */}
                  <g className="chibi-wing-left">
                    <path
                      d="M 210 270 C 160 170, 70 160, 65 210 C 60 260, 120 280, 150 285 C 100 310, 110 360, 145 365 C 180 370, 195 320, 210 270 Z"
                      fill="url(#chibi-fairy-wings)"
                      stroke="#F472B6"
                      strokeWidth="2.5"
                    />
                    {/* Iridescent Veins */}
                    <path d="M 205 270 Q 140 220 85 205" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.8" />
                    <path d="M 160 250 Q 110 265 85 255" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <circle cx="75" cy="200" r="4.5" fill="#FFFFFF" className="animate-ping" />
                    <circle cx="120" cy="340" r="3.5" fill="#FDE047" />
                  </g>
                  {/* Right Fairy Wing */}
                  <g className="chibi-wing-right">
                    <path
                      d="M 290 270 C 340 170, 430 160, 435 210 C 440 260, 380 280, 350 285 C 400 310, 390 360, 355 365 C 320 370, 305 320, 290 270 Z"
                      fill="url(#chibi-fairy-wings)"
                      stroke="#F472B6"
                      strokeWidth="2.5"
                    />
                    <path d="M 295 270 Q 360 220 415 205" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.8" />
                    <path d="M 340 250 Q 390 265 415 255" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <circle cx="425" cy="200" r="4.5" fill="#FFFFFF" className="animate-ping" />
                    <circle cx="380" cy="340" r="3.5" fill="#FDE047" />
                  </g>
                </g>
              )}

              {/* Đôi Cánh Thiên Thần Tri Thức (Celestial Angel Wings) */}
              {config.wingsId === 'wings_angel_celestial' && (
                <g id="wings-angel" fill="url(#chibi-angel-wings)" stroke="#D97706" strokeWidth="2" filter="url(#chibi-drop-shadow)">
                  <g className="chibi-wing-left">
                    <path d="M 210 270 C 170 190, 100 135, 75 150 C 55 190, 65 250, 105 310 C 130 335, 175 350, 205 285 Z" />
                    <path d="M 205 270 C 160 215, 105 185, 90 225 C 85 255, 110 295, 140 320 Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="78" cy="152" r="5" fill="#FDE68A" className="animate-ping" />
                  </g>
                  <g className="chibi-wing-right">
                    <path d="M 290 270 C 330 190, 400 135, 425 150 C 445 190, 435 250, 395 310 C 370 335, 325 350, 295 285 Z" />
                    <path d="M 295 270 C 340 215, 395 185, 410 225 C 415 255, 390 295, 360 320 Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="422" cy="152" r="5" fill="#FDE68A" className="animate-ping" />
                  </g>
                  <ellipse cx="250" cy="275" rx="26" ry="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                </g>
              )}

              {/* Đôi Cánh Cơ Khí Cyber Neon */}
              {config.wingsId === 'wings_cyber_neon' && (
                <g id="wings-cyber">
                  <g className="chibi-wing-left">
                    <polygon points="210,260 110,170 90,185 180,270" fill="#0F172A" stroke="#06B6D4" strokeWidth="2.5" />
                    <polygon points="205,275 80,240 70,258 175,290" fill="#1E1B4B" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="95" cy="178" r="4" fill="#22D3EE" />
                  </g>
                  <g className="chibi-wing-right">
                    <polygon points="290,260 390,170 410,185 320,270" fill="#0F172A" stroke="#06B6D4" strokeWidth="2.5" />
                    <polygon points="295,275 420,240 430,258 325,290" fill="#1E1B4B" stroke="#3B82F6" strokeWidth="2.5" />
                    <circle cx="405" cy="178" r="4" fill="#22D3EE" />
                  </g>
                  <circle cx="250" cy="270" r="7" fill="#22D3EE" className="animate-ping" />
                </g>
              )}

              {/* Đôi Cánh Phượng Hoàng Lửa */}
              {config.wingsId === 'wings_phoenix_flame' && (
                <g id="wings-phoenix" fill="url(#chibi-phoenix-wings)" stroke="#7F1D1D" strokeWidth="1.5">
                  <g className="chibi-wing-left">
                    <path d="M 210 260 Q 150 170 90 155 Q 120 200 115 235 Q 170 245 205 275 Z" />
                    <circle cx="85" cy="148" r="4" fill="#FDE68A" className="animate-ping" />
                  </g>
                  <g className="chibi-wing-right">
                    <path d="M 290 260 Q 350 170 410 155 Q 380 200 385 235 Q 330 245 295 275 Z" />
                    <circle cx="415" cy="148" r="4" fill="#FDE68A" className="animate-ping" />
                  </g>
                </g>
              )}
            </g>
          )}

          {/* ========================================================
              LAYER 2: REAR HAIR (Z: 2)
          ======================================================== */}
          <g id="layer-2-rear-hair">
            {isLongHair && (
              <path
                d="M 155 190 C 130 270, 125 350, 155 380 C 185 400, 195 360, 205 310 C 295 310, 305 400, 345 380 C 375 350, 370 270, 345 190 Z"
                fill={hair}
              />
            )}
            {hairStyle === 'twin_tails' && (
              <g fill={hair}>
                {/* Left ponytail */}
                <path d="M 160 190 Q 90 220 100 330 Q 135 340 145 280 Z" />
                <circle cx="150" cy="200" r="7" fill="#F43F5E" />
                {/* Right ponytail */}
                <path d="M 340 190 Q 410 220 400 330 Q 365 340 355 280 Z" />
                <circle cx="350" cy="200" r="7" fill="#F43F5E" />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 3: CHIBI BASE BODY & CUTE HEAD (Z: 3)
              Proportion: 2.3 heads tall (Avatar TeaMobi style)
          ======================================================== */}
          <g id="layer-3-chibi-body">
            {/* Cute neck */}
            <rect x="242" y="260" width="16" height="22" rx="6" fill={skin} />

            {/* Chibi Head: Big, round, plump cheeks */}
            <ellipse cx="250" cy="185" rx="88" ry="82" fill={skin} filter="url(#chibi-drop-shadow)" />

            {/* Cute Round Ears */}
            <circle cx="162" cy="190" r="14" fill={skin} />
            <circle cx="163" cy="190" r="7" fill="#000000" opacity="0.06" />
            <circle cx="338" cy="190" r="14" fill={skin} />
            <circle cx="337" cy="190" r="7" fill="#000000" opacity="0.06" />

            {/* Chibi Limbs in full mode */}
            {mode === 'full' && (
              <g id="chibi-limbs">
                {/* Cute compact torso */}
                <path d="M 205 275 L 295 275 L 285 385 L 215 385 Z" fill={skin} />

                {/* Chubby Arms & Mitten Hands */}
                <path d="M 205 280 L 165 365 L 182 370 L 218 295 Z" fill={skin} />
                <circle cx="168" cy="372" r="11" fill={skin} /> {/* Left hand */}

                <path d="M 295 280 L 335 365 L 318 370 L 282 295 Z" fill={skin} />
                <circle cx="332" cy="372" r="11" fill={skin} /> {/* Right hand */}

                {/* Short Chubby Chibi Legs */}
                <rect x="216" y="380" width="26" height="95" rx="10" fill={skin} />
                <rect x="258" y="380" width="26" height="95" rx="10" fill={skin} />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 4: FACIAL EXPRESSION (Z: 4)
              Avatar TeaMobi Anime Chibi Eyes & Cute Blush
          ======================================================== */}
          {!isBackView && (
            <g id="layer-4-face" style={{ opacity: faceOpacity, transition: 'opacity 0.2s' }}>
              {/* Rosy Cheek Blush with Twinkling Sparkles */}
              <ellipse cx="195" cy="205" rx="16" ry="9" fill="#FB7185" opacity="0.38" />
              <text x="190" y="209" fontSize="10" fill="#FFFFFF" fontWeight="bold">+</text>

              <ellipse cx="305" cy="205" rx="16" ry="9" fill="#FB7185" opacity="0.38" />
              <text x="300" y="209" fontSize="10" fill="#FFFFFF" fontWeight="bold">+</text>

              {/* Tiny Cute Nose */}
              <circle cx="250" cy="195" r="2" fill="#E11D48" opacity="0.35" />

              {/* Eyebrows */}
              <g stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 198 152 Q 215 146 230 151" />
                <path d="M 270 151 Q 285 146 302 152" />
              </g>

              {/* Eyes */}
              {isBlinking && is4DMode ? (
                <g stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none">
                  <path d="M 200 178 Q 215 186 230 178" />
                  <path d="M 270 178 Q 285 186 300 178" />
                </g>
              ) : config.eyeExpression === 'playful_wink' ? (
                <g>
                  {/* Left Eye: Big & Sparkling */}
                  <ellipse cx="215" cy="176" rx="16" ry="19" fill="#0F172A" />
                  <ellipse cx="215" cy="182" rx="13" ry="13" fill="#2563EB" opacity="0.85" />
                  <circle cx="210" cy="170" r="5.5" fill="#FFFFFF" />
                  <circle cx="221" cy="183" r="2.8" fill="#FFFFFF" />
                  <path d="M 198 168 Q 215 160 232 168" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                  {/* Right Eye: Wink with Star */}
                  <path d="M 268 178 Q 285 168 302 178" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <text x="305" y="174" fontSize="14" fill="#F59E0B" className="animate-spin">✦</text>
                </g>
              ) : (
                /* Default Big Anime Chibi Eyes with Triple Catchlights */
                <g>
                  {/* Left Eye */}
                  <ellipse cx="214" cy="175" rx="17" ry="20" fill="#0F172A" />
                  <ellipse cx="214" cy="181" rx="14" ry="13" fill="#3B82F6" opacity="0.75" />
                  {/* Eyelash lid */}
                  <path d="M 197 167 Q 215 158 233 167" stroke="#0F172A" strokeWidth="3.8" fill="none" strokeLinecap="round" />
                  <path d="M 230 165 L 235 162" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Catchlights */}
                  <circle cx="209" cy="169" r="6" fill="#FFFFFF" />
                  <circle cx="221" cy="183" r="3" fill="#FFFFFF" />
                  <ellipse cx="214" cy="190" rx="6" ry="2" fill="#FFFFFF" opacity="0.5" />

                  {/* Right Eye */}
                  <ellipse cx="286" cy="175" rx="17" ry="20" fill="#0F172A" />
                  <ellipse cx="286" cy="181" rx="14" ry="13" fill="#3B82F6" opacity="0.75" />
                  <path d="M 269 167 Q 287 158 305 167" stroke="#0F172A" strokeWidth="3.8" fill="none" strokeLinecap="round" />
                  <path d="M 302 165 L 307 162" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="281" cy="169" r="6" fill="#FFFFFF" />
                  <circle cx="293" cy="183" r="3" fill="#FFFFFF" />
                  <ellipse cx="286" cy="190" rx="6" ry="2" fill="#FFFFFF" opacity="0.5" />
                </g>
              )}

              {/* Mouth: Cute small anime smile */}
              {config.mouthExpression === 'smile_open' ? (
                <path d="M 241 210 Q 250 226 259 210 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
              ) : config.mouthExpression === 'confident_grin' ? (
                <path d="M 240 210 Q 250 220 260 210" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : (
                /* Cute subtle smile with lip gloss */
                <g>
                  <path d="M 243 210 Q 250 217 257 210" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="250" cy="214" r="1.5" fill="#FDA4AF" />
                </g>
              )}
            </g>
          )}

          {/* ========================================================
              LAYER 5: BOTTOMS (Z: 5)
          ======================================================== */}
          {mode === 'full' && (
            <g id="layer-5-bottoms">
              {/* Quần Jean Đen Rách Gối Ác Quỷ */}
              {config.bottomsId === 'bot_devil_pants' ? (
                <g>
                  <path d="M 210 345 L 290 345 L 284 465 L 254 465 L 250 375 L 246 465 L 216 465 Z" fill="#18181B" stroke="#09090B" strokeWidth="2" />
                  {/* Knee Tears */}
                  <line x1="222" y1="415" x2="238" y2="415" stroke={skin} strokeWidth="3" strokeLinecap="round" />
                  <line x1="262" y1="425" x2="278" y2="425" stroke={skin} strokeWidth="3" strokeLinecap="round" />
                  {/* Silver chain */}
                  <path d="M 230 355 Q 245 375 255 360" stroke="#E2E8F0" strokeWidth="2" fill="none" />
                </g>
              ) : config.bottomsId === 'bot_lolita_skirt' ? (
                /* Chân Váy Xòe Ren Bồng Bềnh Lolita */
                <g>
                  <path d="M 210 345 L 290 345 L 325 425 L 175 425 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
                  {/* 3 Frill layers */}
                  <path d="M 185 390 Q 250 405 315 390" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
                  <path d="M 175 425 Q 250 440 325 425" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                </g>
              ) : config.bottomsId === 'bot_angel_skirt' ? (
                /* Chân Váy Lụa Thiên Thần Trắng */
                <g>
                  <path d="M 212 345 L 288 345 L 315 420 L 185 420 Z" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                  <path d="M 185 420 Q 250 432 315 420" stroke="#FBBF24" strokeWidth="3.5" fill="none" />
                </g>
              ) : config.bottomsId === 'bot_chibi_shorts' ? (
                /* Quần Yếm Denim Chibi Cute */
                <g>
                  <path d="M 210 345 L 290 345 L 286 425 L 253 425 L 250 375 L 247 425 L 214 425 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
                  <circle cx="225" cy="355" r="3.5" fill="#F59E0B" />
                  <circle cx="275" cy="355" r="3.5" fill="#F59E0B" />
                </g>
              ) : config.bottomsId === 'bot_pleated_skirt' ? (
                <path d="M 210 345 L 290 345 L 320 415 L 180 415 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              ) : config.bottomsId === 'bot_cargo_joggers' ? (
                <path d="M 208 345 L 292 345 L 284 465 L 253 465 L 250 375 L 247 465 L 216 465 Z" fill="#365314" stroke="#1A2E05" strokeWidth="2" />
              ) : config.bottomsId === 'bot_wizard_skirt' ? (
                <g>
                  <path d="M 205 345 L 295 345 L 320 475 L 180 475 Z" fill="#312E81" stroke="#F59E0B" strokeWidth="2.5" />
                  <line x1="180" y1="470" x2="320" y2="470" stroke="#FBBF24" strokeWidth="4" />
                </g>
              ) : (
                /* Default Jeans */
                <path d="M 210 345 L 290 345 L 284 465 L 253 465 L 250 375 L 247 465 L 216 465 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
              )}
            </g>
          )}

          {/* ========================================================
              LAYER 6: FOOTWEAR (Z: 6)
          ======================================================== */}
          {mode === 'full' && (
            <g id="layer-6-footwear">
              {config.footwearId === 'foot_hermes_boots' ? (
                <g fill="#D97706" stroke="#92400E">
                  <path d="M 212 460 L 244 460 L 248 495 L 202 495 Z" rx="5" />
                  <path d="M 202 470 Q 185 450 190 480 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
                  <path d="M 256 460 L 288 460 L 298 495 L 252 495 Z" rx="5" />
                  <path d="M 298 470 Q 315 450 310 480 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
                </g>
              ) : config.footwearId === 'foot_cyber_kicks' ? (
                <g fill="#0F172A">
                  <path d="M 212 460 L 244 460 L 248 495 L 198 495 Z" rx="4" />
                  <rect x="198" y="490" width="50" height="6" rx="2" fill="#06B6D4" className="animate-pulse" />
                  <path d="M 256 460 L 288 460 L 302 495 L 252 495 Z" rx="4" />
                  <rect x="252" y="490" width="50" height="6" rx="2" fill="#EC4899" className="animate-pulse" />
                </g>
              ) : (
                /* Default: Cute Chibi Canvas Sneakers */
                <g fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2">
                  <path d="M 212 460 L 244 460 L 248 495 L 200 495 Z" rx="5" />
                  <path d="M 256 460 L 288 460 L 300 495 L 252 495 Z" rx="5" />
                  <circle cx="215" cy="480" r="3" fill="#3B82F6" />
                  <circle cx="285" cy="480" r="3" fill="#3B82F6" />
                </g>
              )}
            </g>
          )}

          {/* ========================================================
              LAYER 7: TOPS (Z: 7)
          ======================================================== */}
          <g id="layer-7-tops">
            {/* Áo Hoodie Ác Quỷ Dạ Xoa */}
            {config.topsId === 'top_devil_hoodie' ? (
              <g id="top-devil-hoodie">
                <path d="M 195 270 L 305 270 L 320 360 L 180 360 Z" fill="#1E1035" stroke="#3B0764" strokeWidth="2.5" />
                {/* Purple Kangaroo Pocket */}
                <rect x="220" y="315" width="60" height="35" rx="8" fill="#3B0764" stroke="#A855F7" strokeWidth="1.5" />
                {/* Cute skull / devil decal */}
                <circle cx="250" cy="300" r="10" fill="#A855F7" />
                <polygon points="244,295 242,288 247,293" fill="#E879F9" />
                <polygon points="256,295 258,288 253,293" fill="#E879F9" />
                <circle cx="247" cy="300" r="2" fill="#09090B" />
                <circle cx="253" cy="300" r="2" fill="#09090B" />
              </g>
            ) : config.topsId === 'top_angel_tunic' ? (
              /* Áo Choàng Lụa Thiên Thần */
              <g id="top-angel-tunic">
                <path d="M 196 270 L 304 270 L 318 360 L 182 360 Z" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                <polygon points="236,270 264,270 250,305" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                {/* Golden chest ribbon */}
                <circle cx="250" cy="305" r="6" fill="#F59E0B" />
                <path d="M 244 305 Q 230 320 235 335" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
                <path d="M 256 305 Q 270 320 265 335" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
              </g>
            ) : config.topsId === 'top_princess_lolita' ? (
              /* Đầm Công Chúa Lolita Dạ Hội */
              <g id="top-princess-lolita">
                <path d="M 195 270 L 305 270 L 322 365 L 178 365 Z" fill="#FCE7F3" stroke="#F472B6" strokeWidth="2" />
                {/* White lace chest insert */}
                <polygon points="230,270 270,270 250,315" fill="#FFFFFF" stroke="#F472B6" strokeWidth="1" />
                {/* Pink big bow ribbon */}
                <polygon points="250,315 235,305 235,325" fill="#EC4899" />
                <polygon points="250,315 265,305 265,325" fill="#EC4899" />
                <circle cx="250" cy="315" r="4" fill="#BE185D" />
              </g>
            ) : config.topsId === 'top_chibi_bear_hoodie' ? (
              /* Áo Hoodie Gấu Bông Chibi */
              <g id="top-bear-hoodie">
                <path d="M 194 270 L 306 270 L 320 365 L 180 365 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
                {/* Cream Bear Belly / Pouch */}
                <ellipse cx="250" cy="330" rx="32" ry="25" fill="#FEF3C7" />
                {/* Bear Paw prints */}
                <circle cx="250" cy="334" r="5" fill="#B45309" />
                <circle cx="243" cy="326" r="2.5" fill="#B45309" />
                <circle cx="250" cy="324" r="2.5" fill="#B45309" />
                <circle cx="257" cy="326" r="2.5" fill="#B45309" />
              </g>
            ) : config.topsId === 'top_prince_vest' ? (
              /* Áo Vest Hoàng Tử Quý Tộc */
              <g id="top-prince-vest">
                <path d="M 194 270 L 306 270 L 318 360 L 182 360 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
                <polygon points="236,270 264,270 250,310" fill="#FFFFFF" />
                {/* Gold epaulettes on shoulders */}
                <rect x="188" y="270" width="16" height="8" rx="2" fill="#F59E0B" />
                <rect x="296" y="270" width="16" height="8" rx="2" fill="#F59E0B" />
                {/* Gold buttons */}
                <circle cx="250" cy="320" r="3.5" fill="#F59E0B" />
                <circle cx="250" cy="340" r="3.5" fill="#F59E0B" />
              </g>
            ) : config.topsId === 'top_oxford_blazer' ? (
              <g>
                <path d="M 194 270 L 306 270 L 318 360 L 182 360 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
                <polygon points="236,270 264,270 250,305" fill="#FFFFFF" />
                <polygon points="248,290 252,290 254,320 246,320" fill="#DC2626" />
              </g>
            ) : config.topsId === 'top_scholastic_hoodie' ? (
              <g>
                <path d="M 194 270 L 306 270 L 318 360 L 182 360 Z" fill="#047857" stroke="#065F46" strokeWidth="2" />
                <rect x="225" y="315" width="50" height="30" rx="6" fill="#065F46" />
              </g>
            ) : (
              /* Default T-Shirt */
              <path d="M 198 270 L 302 270 L 314 355 L 186 355 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            )}
          </g>

          {/* ========================================================
              LAYER 8: FRONT HAIR & BANGS (Z: 8)
          ======================================================== */}
          <g id="layer-8-front-hair">
            {hairStyle === 'short_crop' && (
              <g fill={hair}>
                <path d="M 162 175 C 155 105, 230 85, 250 85 C 280 85, 345 105, 338 175 C 330 145, 300 130, 250 132 C 200 130, 170 145, 162 175 Z" />
                {/* Cute bangs jagged tips */}
                <polygon points="210,132 225,150 220,132" fill={hair} />
                <polygon points="240,132 250,152 255,132" fill={hair} />
                <polygon points="270,132 280,148 285,132" fill={hair} />
                {/* Hair sheen highlight */}
                <path d="M 185 110 Q 250 95 315 110" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
              </g>
            )}

            {hairStyle === 'spiky_anime' && (
              <g fill={hair}>
                <polygon points="160,170 140,120 180,130" />
                <polygon points="180,130 185,85 220,110" />
                <polygon points="220,110 250,70 270,105" />
                <polygon points="270,105 315,85 320,130" />
                <polygon points="320,130 360,120 340,170" />
                <path d="M 165 170 C 180 140, 320 140, 335 170 Z" />
              </g>
            )}

            {hairStyle === 'twin_tails' && (
              <g fill={hair}>
                <path d="M 162 175 C 155 100, 230 85, 250 85 C 280 85, 345 100, 338 175 C 320 140, 280 135, 250 135 C 220 135, 180 140, 162 175 Z" />
                <path d="M 185 110 Q 250 95 315 110" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
              </g>
            )}

            {hairStyle === 'long_waves' && (
              <g fill={hair}>
                <path d="M 160 185 C 155 100, 240 85, 250 85 C 280 85, 345 100, 340 185 C 325 140, 280 135, 250 135 C 220 135, 175 140, 160 185 Z" />
                <path d="M 185 110 Q 250 95 315 110" stroke="#FFFFFF" strokeWidth="3.5" fill="none" opacity="0.35" strokeLinecap="round" />
              </g>
            )}

            {!['short_crop', 'spiky_anime', 'twin_tails', 'long_waves'].includes(hairStyle) && (
              <g fill={hair}>
                <path d="M 162 175 C 155 105, 230 85, 250 85 C 280 85, 345 105, 338 175 C 320 140, 280 132, 250 132 C 220 132, 180 140, 162 175 Z" />
                <path d="M 185 110 Q 250 95 315 110" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round" />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 9: HEADWEAR (Z: 9)
          ======================================================== */}
          <g id="layer-9-headwear">
            {/* Cặp Sừng Ác Quỷ Cute (Little Demon Horns) */}
            {config.headwearId === 'head_devil_horns' && (
              <g id="devil-horns" filter="url(#chibi-glow-pink)">
                {/* Left Horn */}
                <path d="M 195 115 Q 165 70 180 50 Q 200 70 205 110 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                {/* Right Horn */}
                <path d="M 305 115 Q 335 70 320 50 Q 300 70 295 110 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
                {/* Purple ribbons on horn roots */}
                <circle cx="200" cy="112" r="5" fill="#9333EA" />
                <circle cx="300" cy="112" r="5" fill="#9333EA" />
              </g>
            )}

            {/* Vòng Hào Quang Thiên Thần (Angel Golden Halo) */}
            {config.headwearId === 'head_angel_halo' && (
              <g id="angel-halo">
                <ellipse cx="250" cy="70" rx="60" ry="16" fill="none" stroke="url(#chibi-gold-shimmer)" strokeWidth="6" filter="url(#chibi-drop-shadow)" />
                <ellipse cx="250" cy="70" rx="60" ry="16" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
                <circle cx="210" cy="68" r="3.5" fill="#FFFFFF" className="animate-ping" />
                <circle cx="290" cy="72" r="3.5" fill="#FFFFFF" className="animate-ping" />
              </g>
            )}

            {/* Tai Thỏ Cute Siêu Đáng Yêu (Fluffy Bunny Ears) */}
            {config.headwearId === 'head_bunny_ears' && (
              <g id="bunny-ears" filter="url(#chibi-drop-shadow)">
                {/* Left Ear */}
                <path d="M 190 110 C 160 30, 185 0, 205 0 C 220 0, 225 50, 215 110 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
                <path d="M 195 95 C 180 40, 195 20, 205 20 C 212 20, 215 50, 210 95 Z" fill="#FDA4AF" />
                {/* Right Ear - Slightly tilted */}
                <path d="M 285 110 C 275 50, 280 0, 295 0 C 315 0, 340 30, 310 110 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
                <path d="M 290 95 C 285 50, 288 20, 295 20 C 305 20, 320 40, 305 95 Z" fill="#FDA4AF" />
                {/* Cute daisy or pink bow in center */}
                <circle cx="250" cy="115" r="7" fill="#F43F5E" />
              </g>
            )}

            {/* Tai Mèo Chibi Có Chuông Vàng (Neko Bell Ears) */}
            {config.headwearId === 'head_cat_ears' && (
              <g id="cat-ears" filter="url(#chibi-drop-shadow)">
                <polygon points="185,115 160,55 215,95" fill="#18181B" stroke="#09090B" strokeWidth="2" />
                <polygon points="182,108 170,72 202,96" fill="#FDA4AF" />
                <polygon points="315,115 340,55 285,95" fill="#18181B" stroke="#09090B" strokeWidth="2" />
                <polygon points="318,108 330,72 298,96" fill="#FDA4AF" />
                {/* Red ribbons & gold bells */}
                <circle cx="178" cy="112" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                <circle cx="322" cy="112" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              </g>
            )}

            {/* Vương Miện Hoàng Gia Chibi (Chibi Imperial Crown) */}
            {config.headwearId === 'head_crown_royal' && (
              <g id="crown-royal" filter="url(#chibi-drop-shadow)">
                <polygon points="210,110 215,75 235,90 250,65 265,90 285,75 290,110" fill="url(#chibi-gold-shimmer)" stroke="#B45309" strokeWidth="2" />
                <circle cx="250" cy="65" r="4.5" fill="#EF4444" />
                <circle cx="215" cy="75" r="3.5" fill="#3B82F6" />
                <circle cx="285" cy="75" r="3.5" fill="#10B981" />
                <rect x="210" y="105" width="80" height="8" rx="3" fill="#D97706" />
              </g>
            )}

            {/* Nón Rơm Nông Trại Chibi (Straw Hat) */}
            {config.headwearId === 'head_straw_hat' && (
              <g id="straw-hat" filter="url(#chibi-drop-shadow)">
                <ellipse cx="250" cy="115" rx="100" ry="24" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
                <ellipse cx="250" cy="100" rx="55" ry="30" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
                <path d="M 195 110 Q 250 118 305 110" stroke="#3B82F6" strokeWidth="6" fill="none" />
              </g>
            )}

            {config.headwearId === 'head_graduation_cap' && (
              <g id="grad-cap">
                <polygon points="250,55 330,80 250,105 170,80" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                <path d="M 210 95 Q 250 88 290 95 L 285 120 Q 250 112 215 120 Z" fill="#1E293B" />
                <circle cx="250" cy="80" r="4" fill="#F59E0B" />
                <path d="M 250 80 Q 300 90 295 125" stroke="#FBBF24" strokeWidth="2" fill="none" />
              </g>
            )}

            {config.headwearId === 'head_cyber_headphones' && (
              <g id="cyber-headphones">
                <path d="M 175 160 Q 250 60 325 160" stroke="#09090B" strokeWidth="10" fill="none" strokeLinecap="round" />
                <polygon points="195,100 170,55 215,80" fill="#18181B" stroke="#06B6D4" strokeWidth="2" />
                <polygon points="305,100 330,55 285,80" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
                <rect x="168" y="145" width="18" height="38" rx="8" fill="#18181B" stroke="#06B6D4" strokeWidth="2" />
                <rect x="314" y="145" width="18" height="38" rx="8" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
              </g>
            )}
          </g>

          {/* ========================================================
              LAYER 10: EYEWEAR (Z: 10)
          ======================================================== */}
          {!isBackView && (
            <g id="layer-10-eyewear" style={{ opacity: faceOpacity }}>
              {config.eyewearId === 'eye_smart_glasses' && (
                <g stroke="#D97706" strokeWidth="2.5" fill="none">
                  <circle cx="214" cy="176" r="18" fill="#FFFFFF" fillOpacity="0.2" />
                  <circle cx="286" cy="176" r="18" fill="#FFFFFF" fillOpacity="0.2" />
                  <line x1="232" y1="176" x2="268" y2="176" strokeWidth="2.5" />
                  <line x1="205" y1="168" x2="220" y2="168" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
                </g>
              )}
              {config.eyewearId === 'eye_vr_visor' && (
                <g>
                  <rect x="195" y="162" width="110" height="28" rx="7" fill="#09090B" stroke="#06B6D4" strokeWidth="2.5" />
                  <line x1="200" y1="176" x2="300" y2="176" stroke="#22D3EE" strokeWidth="2" className="animate-pulse" />
                </g>
              )}
            </g>
          )}

          {/* ========================================================
              LAYER 11: HANDHELD & WEAPONS (Z: 11)
          ======================================================== */}
          {mode === 'full' && (
            <g id="layer-11-handheld">
              {/* Cây Kẹo Mút Khổng Lồ Cầu Vồng (Rainbow Swirl Giant Lollipop) */}
              {config.handheldId === 'hand_giant_lollipop' && (
                <g transform="translate(325, 300) rotate(15)" filter="url(#chibi-drop-shadow)">
                  {/* White plastic stick */}
                  <rect x="22" y="45" width="8" height="90" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Giant spiral candy disc */}
                  <circle cx="26" cy="26" r="32" fill="#F43F5E" />
                  <circle cx="26" cy="26" r="26" fill="#FB923C" />
                  <circle cx="26" cy="26" r="20" fill="#FACC15" />
                  <circle cx="26" cy="26" r="14" fill="#34D399" />
                  <circle cx="26" cy="26" r="8" fill="#38BDF8" />
                  {/* Swirl spiral overlay */}
                  <path d="M 26 26 Q 38 12 48 26 Q 38 48 26 48 Q 4 38 8 20" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
                  {/* Pink Ribbon Knot */}
                  <circle cx="26" cy="62" r="5" fill="#EC4899" />
                  <polygon points="26,62 16,56 16,68" fill="#F472B6" />
                  <polygon points="26,62 36,56 36,68" fill="#F472B6" />
                </g>
              )}

              {/* Gậy Ma Thuật Ngôi Sao Biến Hình (Magical Star Scepter) */}
              {config.handheldId === 'hand_star_wand' && (
                <g transform="translate(325, 290) rotate(12)" filter="url(#chibi-drop-shadow)">
                  {/* Golden shaft */}
                  <rect x="22" y="40" width="7" height="95" rx="3.5" fill="url(#chibi-gold-shimmer)" stroke="#B45309" strokeWidth="1" />
                  {/* Tiny wings on scepter head */}
                  <path d="M 12 25 Q 0 15 10 32 Z" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
                  <path d="M 38 25 Q 50 15 40 32 Z" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
                  {/* Brilliant Gold Star */}
                  <polygon points="25,5 31,18 45,18 33,27 38,40 25,32 12,40 17,27 5,18 19,18" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
                  <circle cx="25" cy="24" r="5" fill="#F43F5E" />
                  <circle cx="25" cy="24" r="2" fill="#FFFFFF" />
                  {/* Sparkle ping */}
                  <circle cx="25" cy="5" r="3" fill="#FFFFFF" className="animate-ping" />
                </g>
              )}

              {/* Đinh Ba Ác Quỷ Mini Cute (Crimson Imp Trident) */}
              {config.handheldId === 'hand_devil_pitchfork' && (
                <g transform="translate(325, 290) rotate(15)" filter="url(#chibi-drop-shadow)">
                  {/* Black shaft */}
                  <rect x="23" y="38" width="6" height="100" rx="3" fill="#18181B" stroke="#09090B" strokeWidth="1" />
                  {/* Trident forkhead in crimson */}
                  <path d="M 10 20 Q 14 36 26 38 Q 38 36 42 20" stroke="#DC2626" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Left prong spear */}
                  <polygon points="10,20 6,10 14,10" fill="#DC2626" />
                  {/* Center prong spear */}
                  <polygon points="26,16 21,2 31,2" fill="#EF4444" />
                  {/* Right prong spear */}
                  <polygon points="42,20 38,10 46,10" fill="#DC2626" />
                </g>
              )}

              {config.handheldId === 'hand_magic_tome' && (
                <g transform="translate(120, 320) rotate(-10)">
                  <rect width="45" height="58" rx="4" fill="#312E81" stroke="#F59E0B" strokeWidth="2.5" />
                  <rect x="4" y="4" width="37" height="50" rx="2" fill="#4338CA" />
                  <circle cx="22" cy="29" r="10" fill="none" stroke="#FDE68A" strokeWidth="2" />
                  <circle cx="22" cy="29" r="16" fill="none" stroke="#818CF8" strokeWidth="1" opacity="0.6" className="animate-ping" />
                </g>
              )}

              {config.handheldId === 'hand_golden_mic' && (
                <g transform="translate(340, 325) rotate(15)">
                  <rect x="8" y="15" width="8" height="32" rx="3" fill="#18181B" stroke="#D97706" strokeWidth="1" />
                  <ellipse cx="12" cy="12" rx="9" ry="12" fill="url(#chibi-gold-shimmer)" stroke="#B45309" strokeWidth="1.5" />
                  <text x="25" y="5" fontSize="16" fill="#F59E0B" className="animate-bounce">♪</text>
                </g>
              )}

              {config.handheldId === 'hand_quill_pen' && (
                <g transform="translate(340, 325) rotate(-35)">
                  <path d="M 10 50 Q 5 25 20 0 Q 30 20 15 50 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                </g>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

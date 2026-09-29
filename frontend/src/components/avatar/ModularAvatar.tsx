import React from 'react';
import { AvatarConfigDto } from '../../types/avatarAndShop';

interface ModularAvatarProps {
  config: AvatarConfigDto;
  size?: number | string;
  animateBreath?: boolean;
  mode?: 'full' | 'bust' | 'head';
  className?: string;
  onClick?: () => void;
}

export const ModularAvatar: React.FC<ModularAvatarProps> = ({
  config,
  size = '100%',
  animateBreath = false,
  mode = 'full',
  className = '',
  onClick
}) => {
  const skin = config.skinColor || '#E8B898';
  const hair = config.hairColor || '#1C1917';

  // Determine viewBox based on mode
  // Canvas coordinate system: 500 wide, 600 high.
  // Head center: (250, 150), radius ~65
  // Bust: y from 60 to 320
  // Full: y from 0 to 600
  let viewBox = '0 0 500 600';
  if (mode === 'head') {
    viewBox = '175 75 150 150';
  } else if (mode === 'bust') {
    viewBox = '130 65 240 250';
  }

  const hairStyle = config.hairStyleId || 'short_crop';
  const isFemaleOrLongHair = ['long_waves', 'high_ponytail', 'bob_cut', 'curly_afro'].includes(hairStyle);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        aspectRatio: mode === 'full' ? '500 / 600' : '1 / 1',
        maxWidth: '100%'
      }}
    >
      <svg
        viewBox={viewBox}
        className={`w-full h-full overflow-visible transition-transform duration-300 ${
          animateBreath ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="triumph-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <filter id="shadow-drop" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* ========================================================
            LAYER 0: AURA / PEDESTAL / BACKGROUND (Z: 0)
        ======================================================== */}
        {mode === 'full' && (
          <g id="layer-0-aura">
            {config.auraBackgroundId === 'aura_golden_triumph' && (
              <g id="aura-triumph">
                <circle cx="250" cy="300" r="230" fill="url(#triumph-glow)" />
                <path d="M 120 540 Q 250 180 380 540 Z" fill="#F59E0B" opacity="0.3" />
                <path d="M 160 540 Q 250 240 340 540 Z" fill="#FBBF24" opacity="0.4" />
                {/* Flame sparkles */}
                <circle cx="180" cy="360" r="6" fill="#FDE68A" className="animate-ping" />
                <circle cx="320" cy="320" r="5" fill="#FDE68A" className="animate-ping" />
                <circle cx="250" cy="220" r="7" fill="#FDE68A" />
              </g>
            )}

            {config.auraBackgroundId === 'aura_floating_books' && (
              <g id="aura-books">
                <ellipse cx="250" cy="320" rx="210" ry="110" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
                {/* 4 Orbiting Runes/Books */}
                <g transform="translate(60, 280) rotate(-15)">
                  <rect width="36" height="24" rx="3" fill="#4F46E5" />
                  <rect x="2" y="2" width="32" height="20" rx="2" fill="#818CF8" />
                  <line x1="8" y1="8" x2="28" y2="8" stroke="#EEF2FF" strokeWidth="2" />
                  <line x1="8" y1="14" x2="24" y2="14" stroke="#EEF2FF" strokeWidth="1.5" />
                </g>
                <g transform="translate(400, 270) rotate(15)">
                  <rect width="36" height="24" rx="3" fill="#EC4899" />
                  <rect x="2" y="2" width="32" height="20" rx="2" fill="#F472B6" />
                  <line x1="8" y1="8" x2="28" y2="8" stroke="#FFF1F2" strokeWidth="2" />
                </g>
                <g transform="translate(140, 160) rotate(10)">
                  <rect width="30" height="20" rx="3" fill="#10B981" />
                  <rect x="2" y="2" width="26" height="16" rx="2" fill="#34D399" />
                </g>
                <g transform="translate(330, 170) rotate(-10)">
                  <rect width="30" height="20" rx="3" fill="#F59E0B" />
                  <rect x="2" y="2" width="26" height="16" rx="2" fill="#FBBF24" />
                </g>
              </g>
            )}

            {config.auraBackgroundId === 'aura_royal_library' && (
              <g id="aura-library" opacity="0.6">
                <rect x="80" y="80" width="340" height="420" rx="16" fill="#78350F" opacity="0.1" />
                {/* Bookshelf columns */}
                <rect x="90" y="100" width="20" height="380" fill="#92400E" rx="3" />
                <rect x="390" y="100" width="20" height="380" fill="#92400E" rx="3" />
                <line x1="90" y1="200" x2="410" y2="200" stroke="#78350F" strokeWidth="8" />
                <line x1="90" y1="340" x2="410" y2="340" stroke="#78350F" strokeWidth="8" />
              </g>
            )}

            {/* Base Pedestal (Default) */}
            <g id="pedestal" transform="translate(250, 550)">
              <ellipse cx="0" cy="10" rx="150" ry="24" fill="#000000" opacity="0.12" />
              {config.auraBackgroundId === 'aura_golden_triumph' ? (
                <ellipse cx="0" cy="0" rx="140" ry="22" fill="url(#gold-shimmer)" stroke="#B45309" strokeWidth="3" />
              ) : (
                <ellipse cx="0" cy="0" rx="135" ry="20" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
              )}
              <ellipse cx="0" cy="-3" rx="120" ry="16" fill="#F59E0B" opacity="0.4" />
            </g>
          </g>
        )}

        {/* ========================================================
            LAYER 1: REAR HAIR (Z: 1)
        ======================================================== */}
        <g id="layer-1-rear-hair">
          {isFemaleOrLongHair && (
            <path
              d="M 170 160 C 140 250, 130 350, 160 380 C 190 400, 200 360, 210 300 C 290 300, 300 400, 340 380 C 370 350, 360 250, 330 160 Z"
              fill={hair}
              opacity="0.95"
            />
          )}
        </g>

        {/* ========================================================
            LAYER 2: BASE BODY & SKIN (Z: 2)
        ======================================================== */}
        <g id="layer-2-base-body">
          {/* Neck */}
          <rect x="235" y="195" width="30" height="35" rx="6" fill={skin} />

          {/* Head base oval */}
          <ellipse cx="250" cy="150" rx="62" ry="70" fill={skin} filter="url(#shadow-drop)" />

          {/* Ears */}
          <circle cx="186" cy="155" r="13" fill={skin} />
          <circle cx="187" cy="155" r="7" fill="#000000" opacity="0.08" />
          <circle cx="314" cy="155" r="13" fill={skin} />
          <circle cx="313" cy="155" r="7" fill="#000000" opacity="0.08" />

          {mode === 'full' && (
            <g id="full-body-limbs">
              {/* Torso */}
              <path
                d="M 195 225 L 305 225 L 290 380 L 210 380 Z"
                fill={skin}
              />
              {/* Arms */}
              <path d="M 195 230 L 155 350 L 175 355 L 210 250 Z" fill={skin} />
              <circle cx="160" cy="360" r="13" fill={skin} /> {/* Left hand */}

              <path d="M 305 230 L 345 350 L 325 355 L 290 250 Z" fill={skin} />
              <circle cx="340" cy="360" r="13" fill={skin} /> {/* Right hand */}

              {/* Legs */}
              <rect x="215" y="375" width="28" height="150" rx="10" fill={skin} />
              <rect x="257" y="375" width="28" height="150" rx="10" fill={skin} />
            </g>
          )}
        </g>

        {/* ========================================================
            LAYER 3: FACE EXPRESSION (Z: 3)
        ======================================================== */}
        <g id="layer-3-facial-features">
          {/* Cheeks Blush */}
          <circle cx="210" cy="172" r="11" fill="#F43F5E" opacity="0.22" />
          <circle cx="290" cy="172" r="11" fill="#F43F5E" opacity="0.22" />

          {/* Nose */}
          <path d="M 248 152 Q 252 160 248 163" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.25" />

          {/* Eyebrows */}
          {config.eyeExpression === 'intellectual_focus' ? (
            <g stroke={hair} strokeWidth="3.5" strokeLinecap="round">
              <line x1="210" y1="125" x2="236" y2="131" />
              <line x1="290" y1="125" x2="264" y2="131" />
            </g>
          ) : (
            <g stroke={hair} strokeWidth="3" strokeLinecap="round">
              <path d="M 210 126 Q 225 120 238 125" fill="none" />
              <path d="M 262 125 Q 275 120 290 126" fill="none" />
            </g>
          )}

          {/* Eyes */}
          {config.eyeExpression === 'playful_wink' ? (
            <g>
              {/* Left Eye: Open & Happy */}
              <circle cx="225" cy="142" r="8" fill="#1F2937" />
              <circle cx="223" cy="139" r="2.8" fill="#FFFFFF" />
              {/* Right Eye: Wink */}
              <path d="M 267 142 Q 278 134 289 142" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <circle cx="224" cy="142" r="8.5" fill="#1F2937" />
              <circle cx="222" cy="139" r="3" fill="#FFFFFF" />
              <circle cx="226" cy="144" r="1.2" fill="#FFFFFF" opacity="0.7" />

              {/* Right Eye */}
              <circle cx="276" cy="142" r="8.5" fill="#1F2937" />
              <circle cx="274" cy="139" r="3" fill="#FFFFFF" />
              <circle cx="278" cy="144" r="1.2" fill="#FFFFFF" opacity="0.7" />
            </g>
          )}

          {/* Mouth */}
          {config.mouthExpression === 'smile_open' ? (
            <path
              d="M 236 176 Q 250 196 264 176 Z"
              fill="#E11D48"
              stroke="#881337"
              strokeWidth="1.5"
            />
          ) : config.mouthExpression === 'confident_grin' ? (
            <path d="M 235 178 Q 250 190 265 178" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M 238 178 Q 250 186 262 178" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
        </g>

        {/* ========================================================
            LAYER 4: BOTTOMS (Z: 4)
        ======================================================== */}
        {mode === 'full' && (
          <g id="layer-4-bottoms">
            {config.bottomsId === 'bot_pleated_skirt' ? (
              <path d="M 210 340 L 290 340 L 315 420 L 185 420 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            ) : config.bottomsId === 'bot_cargo_joggers' ? (
              <g>
                <path d="M 205 340 L 295 340 L 285 500 L 253 500 L 250 380 L 247 500 L 215 500 Z" fill="#365314" stroke="#1A2E05" strokeWidth="2" />
                {/* Cargo Pocket Straps */}
                <rect x="200" y="410" width="16" height="24" rx="2" fill="#4D7C0F" />
                <rect x="284" y="410" width="16" height="24" rx="2" fill="#4D7C0F" />
              </g>
            ) : config.bottomsId === 'bot_wizard_skirt' ? (
              <g>
                <path d="M 205 340 L 295 340 L 320 510 L 180 510 Z" fill="#312E81" stroke="#F59E0B" strokeWidth="2.5" />
                <line x1="180" y1="504" x2="320" y2="504" stroke="#FBBF24" strokeWidth="4" />
              </g>
            ) : config.bottomsId === 'bot_suit_pants' ? (
              <path d="M 208 340 L 292 340 L 285 505 L 253 505 L 250 380 L 247 505 L 215 505 Z" fill="#374151" stroke="#1F2937" strokeWidth="2" />
            ) : (
              /* Default: starter_jeans_blue */
              <path d="M 208 340 L 292 340 L 283 500 L 254 500 L 250 375 L 246 500 L 217 500 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
            )}
          </g>
        )}

        {/* ========================================================
            LAYER 5: FOOTWEAR (Z: 5)
        ======================================================== */}
        {mode === 'full' && (
          <g id="layer-5-footwear">
            {config.footwearId === 'foot_leather_oxford' ? (
              <g fill="#451A03" stroke="#290E02" strokeWidth="1.5">
                <path d="M 210 500 L 240 500 L 245 530 L 195 530 Z" rx="4" />
                <path d="M 260 500 L 290 500 L 305 530 L 255 530 Z" rx="4" />
              </g>
            ) : config.footwearId === 'foot_cyber_kicks' ? (
              <g>
                <path d="M 212 500 L 240 500 L 246 532 L 192 532 Z" fill="#0F172A" />
                <path d="M 190 528 L 248 528 L 248 534 L 190 534 Z" fill="#06B6D4" className="animate-pulse" />
                <path d="M 260 500 L 288 500 L 308 532 L 254 532 Z" fill="#0F172A" />
                <path d="M 252 528 L 310 528 L 310 534 L 252 534 Z" fill="#EC4899" className="animate-pulse" />
              </g>
            ) : config.footwearId === 'foot_hermes_boots' ? (
              <g fill="#D97706">
                <path d="M 212 490 L 242 490 L 246 530 L 195 530 Z" stroke="#B45309" strokeWidth="2" />
                {/* Left wing */}
                <path d="M 195 500 Q 170 480 178 510 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
                <path d="M 258 490 L 288 490 L 305 530 L 254 530 Z" stroke="#B45309" strokeWidth="2" />
                {/* Right wing */}
                <path d="M 305 500 Q 330 480 322 510 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            ) : (
              /* Default: starter_sneakers_white */
              <g fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2">
                <path d="M 214 500 L 242 500 L 246 530 L 198 530 Z" rx="3" />
                <path d="M 258 500 L 286 500 L 302 530 L 254 530 Z" rx="3" />
                {/* Laces */}
                <line x1="220" y1="512" x2="236" y2="512" stroke="#3B82F6" strokeWidth="2" />
                <line x1="264" y1="512" x2="280" y2="512" stroke="#3B82F6" strokeWidth="2" />
              </g>
            )}
          </g>
        )}

        {/* ========================================================
            LAYER 6: TOPS (Z: 6)
        ======================================================== */}
        <g id="layer-6-tops">
          {config.topsId === 'top_oxford_blazer' ? (
            <g>
              <path d="M 188 220 L 312 220 L 325 355 L 175 355 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
              {/* White collar shirt inside */}
              <polygon points="236,220 264,220 250,265" fill="#FFFFFF" />
              <polygon points="248,245 252,245 254,285 246,285" fill="#DC2626" /> {/* Red Tie */}
              {/* Gold Crest */}
              <circle cx="218" cy="270" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            </g>
          ) : config.topsId === 'top_cyber_hoodie' ? (
            <g>
              <path d="M 185 215 L 315 215 L 330 360 L 170 360 Z" fill="#18181B" stroke="#27272A" strokeWidth="2" />
              {/* Neon LED Stripes */}
              <path d="M 188 225 L 165 345" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
              <path d="M 312 225 L 335 345" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
              <circle cx="250" cy="290" r="14" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
            </g>
          ) : config.topsId === 'top_wizard_robe' ? (
            <g>
              <path d="M 180 215 L 320 215 L 340 375 L 160 375 Z" fill="#4338CA" stroke="#312E81" strokeWidth="2" />
              {/* Constellation Stars */}
              <line x1="250" y1="230" x2="250" y2="375" stroke="#FDE68A" strokeWidth="3" />
              <circle cx="210" cy="280" r="3" fill="#FDE68A" />
              <circle cx="290" cy="280" r="3" fill="#FDE68A" />
              <circle cx="225" cy="330" r="2.5" fill="#FDE68A" />
              <circle cx="275" cy="330" r="2.5" fill="#FDE68A" />
            </g>
          ) : config.topsId === 'top_detective_trench' ? (
            <g>
              <path d="M 185 220 L 315 220 L 330 370 L 170 370 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              {/* Plaid lapel */}
              <polygon points="230,220 250,285 270,220" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" />
              <line x1="250" y1="285" x2="250" y2="370" stroke="#78350F" strokeWidth="3" />
              <circle cx="242" cy="310" r="3" fill="#451A03" />
              <circle cx="242" cy="340" r="3" fill="#451A03" />
            </g>
          ) : config.topsId === 'top_astronaut_suit' ? (
            <g>
              <path d="M 182 220 L 318 220 L 328 360 L 172 360 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
              {/* NASA-style chest badge */}
              <rect x="210" y="250" width="22" height="15" rx="3" fill="#2563EB" />
              <rect x="270" y="250" width="20" height="15" rx="3" fill="#EF4444" />
              <line x1="250" y1="220" x2="250" y2="360" stroke="#64748B" strokeWidth="2" />
            </g>
          ) : (
            /* Default: starter_tee_white */
            <g>
              <path d="M 195 220 L 305 220 L 315 350 L 185 350 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              <path d="M 230 220 Q 250 235 270 220 Z" fill={skin} />
            </g>
          )}
        </g>

        {/* ========================================================
            LAYER 7: NECKWEAR (Z: 7)
        ======================================================== */}
        <g id="layer-7-neckwear">
          {config.neckwearId && (
            <g>
              <ellipse cx="250" cy="225" rx="32" ry="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* ========================================================
            LAYER 8: FRONT HAIR & BANGS (Z: 8)
        ======================================================== */}
        <g id="layer-8-front-hair">
          {hairStyle === 'short_crop' && (
            <path
              d="M 186 140 C 180 95, 230 75, 250 75 C 280 75, 320 95, 314 140 C 310 115, 290 100, 250 102 C 210 100, 190 115, 186 140 Z"
              fill={hair}
            />
          )}

          {hairStyle === 'side_part' && (
            <path
              d="M 185 145 C 180 85, 230 70, 260 70 C 300 70, 325 90, 316 145 C 300 110, 260 100, 220 110 C 200 115, 190 130, 185 145 Z"
              fill={hair}
            />
          )}

          {hairStyle === 'messy_fringe' && (
            <g fill={hair}>
              <path d="M 185 135 C 180 80, 250 65, 315 135 C 295 105, 275 125, 250 105 C 230 125, 205 105, 185 135 Z" />
            </g>
          )}

          {hairStyle === 'bob_cut' && (
            <path
              d="M 180 160 C 175 90, 230 70, 250 70 C 280 70, 325 90, 320 160 C 310 110, 280 100, 250 102 C 220 100, 190 110, 180 160 Z"
              fill={hair}
            />
          )}

          {hairStyle === 'long_waves' && (
            <path
              d="M 178 180 C 175 80, 240 68, 250 68 C 280 68, 325 80, 322 180 C 305 110, 275 100, 250 100 C 225 100, 195 110, 178 180 Z"
              fill={hair}
            />
          )}

          {!['short_crop', 'side_part', 'messy_fringe', 'bob_cut', 'long_waves'].includes(hairStyle) && (
            /* Fallback sleek haircut */
            <path
              d="M 186 140 C 180 90, 230 75, 250 75 C 280 75, 320 90, 314 140 C 300 105, 270 98, 250 98 C 230 98, 200 105, 186 140 Z"
              fill={hair}
            />
          )}
        </g>

        {/* ========================================================
            LAYER 9: HEADWEAR (Z: 9)
        ======================================================== */}
        <g id="layer-9-headwear">
          {config.headwearId === 'head_graduation_cap' && (
            <g id="grad-cap">
              {/* Cap Diamond */}
              <polygon points="250,45 340,75 250,105 160,75" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
              {/* Skull cap band */}
              <path d="M 205 90 Q 250 82 295 90 L 290 120 Q 250 110 210 120 Z" fill="#1E293B" />
              {/* Golden Tassel */}
              <circle cx="250" cy="75" r="4" fill="#F59E0B" />
              <path d="M 250 75 Q 310 85 305 130" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
              <rect x="300" y="130" width="8" height="15" rx="2" fill="#D97706" />
            </g>
          )}

          {config.headwearId === 'head_detective_hat' && (
            <g id="detective-hat">
              {/* Hat dome */}
              <ellipse cx="250" cy="90" rx="72" ry="40" fill="#78350F" stroke="#451A03" strokeWidth="2" />
              {/* Houndstooth lines */}
              <path d="M 195 95 Q 250 85 305 95" stroke="#92400E" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              {/* Front and back visors */}
              <path d="M 175 95 Q 155 105 170 115 Q 200 110 205 95 Z" fill="#92400E" />
              <path d="M 325 95 Q 345 105 330 115 Q 300 110 295 95 Z" fill="#92400E" />
              {/* Top Ribbon Knot */}
              <rect x="244" y="65" width="12" height="10" rx="3" fill="#B45309" />
            </g>
          )}

          {config.headwearId === 'head_cyber_headphones' && (
            <g id="cyber-headphones">
              {/* Headband */}
              <path d="M 170 150 Q 250 40 330 150" stroke="#09090B" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M 170 150 Q 250 40 330 150" stroke="#06B6D4" strokeWidth="4" fill="none" strokeLinecap="round" className="animate-pulse" />
              {/* Cat Ears */}
              <polygon points="190,85 160,35 210,65" fill="#18181B" stroke="#06B6D4" strokeWidth="2" />
              <polygon points="310,85 340,35 290,65" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
              {/* Ear Cups */}
              <rect x="165" y="130" width="18" height="42" rx="8" fill="#18181B" stroke="#06B6D4" strokeWidth="2" />
              <rect x="317" y="130" width="18" height="42" rx="8" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
            </g>
          )}

          {config.headwearId === 'head_olympus_crown' && (
            <g id="olympus-crown" fill="url(#gold-shimmer)" stroke="#D97706" strokeWidth="1">
              {/* Golden Laurel leaves */}
              <path d="M 185 105 Q 195 85 210 100 Q 195 115 185 105 Z" />
              <path d="M 215 90 Q 230 70 245 88 Q 230 102 215 90 Z" />
              <path d="M 255 88 Q 270 70 285 90 Q 270 102 255 88 Z" />
              <path d="M 290 100 Q 305 85 315 105 Q 305 115 290 100 Z" />
            </g>
          )}

          {config.headwearId === 'head_wizard_hat' && (
            <g id="wizard-hat">
              {/* Cone */}
              <path d="M 160 105 Q 240 0 310 15 Q 260 50 340 105 Z" fill="#312E81" stroke="#1E1B4B" strokeWidth="2" />
              {/* Brim */}
              <ellipse cx="250" cy="105" rx="90" ry="16" fill="#3730A3" stroke="#1E1B4B" strokeWidth="2" />
              {/* Crescent Moon Buckle */}
              <path d="M 255 90 A 8 8 0 1 0 255 104 A 6 6 0 1 1 255 90 Z" fill="#FDE68A" />
            </g>
          )}
        </g>

        {/* ========================================================
            LAYER 10: EYEWEAR (Z: 10)
        ======================================================== */}
        <g id="layer-10-eyewear">
          {config.eyewearId === 'eye_smart_glasses' && (
            <g stroke="#D97706" strokeWidth="2.5" fill="none">
              {/* Round frame left */}
              <circle cx="224" cy="142" r="17" fill="#FFFFFF" fillOpacity="0.15" />
              {/* Round frame right */}
              <circle cx="276" cy="142" r="17" fill="#FFFFFF" fillOpacity="0.15" />
              {/* Bridge */}
              <line x1="241" y1="142" x2="259" y2="142" strokeWidth="2.5" />
              {/* Glare */}
              <line x1="214" y1="135" x2="228" y2="135" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="266" y1="135" x2="280" y2="135" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </g>
          )}

          {config.eyewearId === 'eye_vr_visor' && (
            <g>
              <rect x="200" y="130" width="100" height="26" rx="6" fill="#09090B" stroke="#06B6D4" strokeWidth="2" />
              <line x1="205" y1="143" x2="295" y2="143" stroke="#22D3EE" strokeWidth="2" className="animate-pulse" />
              <circle cx="215" cy="143" r="3" fill="#A855F7" />
              <circle cx="285" cy="143" r="3" fill="#A855F7" />
            </g>
          )}

          {config.eyewearId === 'eye_steampunk_goggles' && (
            <g stroke="#78350F" strokeWidth="3" fill="#B45309">
              <rect x="202" y="130" width="38" height="28" rx="6" />
              <rect x="260" y="130" width="38" height="28" rx="6" />
              <line x1="240" y1="144" x2="260" y2="144" stroke="#451A03" strokeWidth="4" />
              {/* Tinted glass */}
              <rect x="206" y="134" width="30" height="20" rx="3" fill="#F59E0B" fillOpacity="0.5" stroke="none" />
              <rect x="264" y="134" width="30" height="20" rx="3" fill="#F59E0B" fillOpacity="0.5" stroke="none" />
            </g>
          )}
        </g>

        {/* ========================================================
            LAYER 11: HANDHELD / COMPANIONS (Z: 11)
        ======================================================== */}
        {mode === 'full' && (
          <g id="layer-11-handheld">
            {config.handheldId === 'hand_magic_tome' && (
              <g transform="translate(115, 320) rotate(-10)">
                {/* Ancient Grimoire Book */}
                <rect width="45" height="58" rx="4" fill="#312E81" stroke="#F59E0B" strokeWidth="2.5" />
                <rect x="4" y="4" width="37" height="50" rx="2" fill="#4338CA" />
                <circle cx="22" cy="29" r="10" fill="none" stroke="#FDE68A" strokeWidth="2" />
                <line x1="14" y1="29" x2="30" y2="29" stroke="#FDE68A" strokeWidth="1.5" />
                <line x1="22" y1="21" x2="22" y2="37" stroke="#FDE68A" strokeWidth="1.5" />
                {/* Arcane glow */}
                <circle cx="22" cy="29" r="18" fill="none" stroke="#818CF8" strokeWidth="1" opacity="0.6" className="animate-ping" />
              </g>
            )}

            {config.handheldId === 'hand_golden_mic' && (
              <g transform="translate(345, 330) rotate(15)">
                {/* Mic handle */}
                <rect x="8" y="15" width="8" height="32" rx="3" fill="#18181B" stroke="#D97706" strokeWidth="1" />
                {/* Gold Mic head */}
                <ellipse cx="12" cy="12" rx="9" ry="12" fill="url(#gold-shimmer)" stroke="#B45309" strokeWidth="1.5" />
                {/* Musical notes floating */}
                <text x="25" y="5" fontSize="16" fill="#F59E0B" className="animate-bounce">♪</text>
                <text x="32" y="22" fontSize="12" fill="#FBBF24">♫</text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

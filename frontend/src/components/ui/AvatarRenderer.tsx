import React from 'react';

export interface AvatarPresetConfig {
  bodyType?: 'male' | 'female' | 'neutral';
  skinToneHex?: string;
  hairStyleId?: string;
  hairColorHex?: string;
  faceExpressionId?: 'friendly_smile' | 'intellectual_focus' | 'playful_wink' | 'confident_sparkle' | string;
  topsId?: string | null;
  bottomsId?: string | null;
  footwearId?: string | null;
  headwearId?: string | null;
  eyewearId?: string | null;
  neckwearId?: string | null;
  wingsId?: string | null;
  companionId?: string | null;
  handheldId?: string | null;
  auraId?: string | null;
}

export interface AvatarRendererProps {
  preset?: AvatarPresetConfig;
  mode?: 'full' | 'headshot' | 'bust';
  size?: number | string;
  isAnimated?: boolean;
  state?: 'idle' | 'victory' | 'defeated';
  className?: string;
  onClick?: () => void;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  preset = {},
  mode = 'full',
  size,
  isAnimated = true,
  state = 'idle',
  className = '',
  onClick,
}) => {
  const {
    bodyType = 'neutral',
    skinToneHex = '#F8D5C2',
    hairStyleId = 'hair_front_short_crop',
    hairColorHex = '#3B2219',
    faceExpressionId = 'friendly_smile',
    topsId = 'starter_tee_white',
    bottomsId = 'starter_jeans_blue',
    footwearId = 'starter_sneakers_white',
    headwearId = null,
    eyewearId = null,
    neckwearId = null,
    wingsId = null,
    companionId = null,
    handheldId = null,
    auraId = 'pedestal_wood_circle',
  } = preset;

  const activeHandheld = handheldId || companionId;

  // Mode-based viewBox & Dimensions
  const viewBox =
    mode === 'headshot'
      ? '150 70 200 200'
      : mode === 'bust'
      ? '100 80 300 320'
      : '0 0 500 600';

  const defaultDimensions =
    mode === 'headshot'
      ? size || 64
      : mode === 'bust'
      ? size || 180
      : size || 280;

  // CSS variables for dynamic tinting
  const dynamicStyle = {
    '--avatar-skin-color': skinToneHex,
    '--avatar-hair-color': hairColorHex,
  } as React.CSSProperties;

  return (
    <div
      style={dynamicStyle}
      onClick={onClick}
      className={`
        relative inline-block select-none overflow-visible
        ${mode === 'headshot' ? 'rounded-full' : ''}
        ${isAnimated ? 'animate-avatar-breathe' : ''}
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        ${className}
      `}
    >
      <svg
        viewBox={viewBox}
        width={defaultDimensions}
        height={defaultDimensions}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="gold-pedestal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="wood-pedestal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <radialGradient id="aura-fire-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-cosmic-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-neon-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#083344" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* LAYER 0 (Z: 0): AURA & BACKGROUND PEDESTAL                    */}
        {/* ------------------------------------------------------------- */}
        {mode === 'full' && (
          <g id="layer-0-aura-pedestal">
            {/* Fire Aura */}
            {auraId === 'aura_fire_legendary' && (
              <g className="animate-pulse">
                <circle cx="250" cy="300" r="220" fill="url(#aura-fire-grad)" />
                <path d="M 220 180 Q 250 120 280 180 Q 320 220 250 150 Z" fill="#fbbf24" opacity="0.6" className="animate-ping" />
              </g>
            )}

            {/* Cosmic Aura */}
            {auraId === 'aura_stars_cosmic' && (
              <g>
                <circle cx="250" cy="300" r="230" fill="url(#aura-cosmic-grad)" />
                <circle cx="140" cy="200" r="4" fill="#fde047" className="animate-ping" />
                <circle cx="360" cy="180" r="5" fill="#fde047" className="animate-ping" />
                <circle cx="380" cy="320" r="3" fill="#67e8f9" />
                <circle cx="120" cy="340" r="4" fill="#f43f5e" />
              </g>
            )}

            {/* Cyber Neon Aura */}
            {auraId === 'aura_cyber_neon' && (
              <g className="animate-pulse">
                <circle cx="250" cy="300" r="225" fill="url(#aura-neon-grad)" />
                <circle cx="250" cy="300" r="215" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="10 8" className="animate-aura-rotate" />
              </g>
            )}

            {/* Pedestal Stand */}
            {auraId === 'pedestal_gold_champion' ? (
              <g id="pedestal-gold">
                <ellipse cx="250" cy="550" rx="160" ry="40" fill="#713f12" />
                <ellipse cx="250" cy="542" rx="150" ry="34" fill="url(#gold-pedestal-grad)" stroke="#fde047" strokeWidth="3" />
                <ellipse cx="250" cy="538" rx="130" ry="26" fill="#fef08a" opacity="0.4" />
                <polygon points="250,528 255,538 265,539 257,546 260,556 250,550 240,556 243,546 235,539 245,538" fill="#ca8a04" />
              </g>
            ) : (
              <g id="pedestal-wood">
                <ellipse cx="250" cy="550" rx="150" ry="36" fill="#451a03" />
                <ellipse cx="250" cy="542" rx="140" ry="30" fill="url(#wood-pedestal-grad)" stroke="#d97706" strokeWidth="2" />
                <ellipse cx="250" cy="538" rx="115" ry="20" fill="#d97706" opacity="0.3" />
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 1 (Z: 1): REAR HAIR                                     */}
        {/* ------------------------------------------------------------- */}
        <g id="layer-1-rear-hair" fill="var(--avatar-hair-color, #3B2219)">
          {(hairStyleId.includes('long_waves') || hairStyleId.includes('long')) && (
            <path d="M 160 160 C 130 220 120 320 140 400 C 150 420 170 420 180 390 C 190 320 185 240 190 200 Z M 340 160 C 370 220 380 320 360 400 C 350 420 330 420 320 390 C 310 320 315 240 310 200 Z" />
          )}
          {hairStyleId.includes('ponytail') && (
            <g>
              <ellipse cx="250" cy="110" rx="30" ry="30" />
              <path d="M 250 110 Q 320 90 350 160 Q 360 220 330 280 Q 315 240 315 180 Z" />
            </g>
          )}
          {hairStyleId.includes('curly_afro') && (
            <circle cx="250" cy="170" r="95" />
          )}
          {hairStyleId.includes('bob_cut') && (
            <path d="M 165 160 Q 140 260 175 300 Q 200 310 200 280 Q 185 220 190 190 Z M 335 160 Q 360 260 325 300 Q 300 310 300 280 Q 315 220 310 190 Z" />
          )}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* LAYER 1B (Z: 5): WINGS                                        */}
        {/* ------------------------------------------------------------- */}
        {mode !== 'headshot' && wingsId && (
          <g id="layer-1b-wings">
            {wingsId === 'wings_angel_celestial' && (
              <g id="wings-angel" fill="#FEF3C7" stroke="#D97706" strokeWidth="2">
                <path d="M 210 240 C 180 180, 110 120, 80 130 C 65 170, 70 230, 110 290 C 130 320, 170 340, 205 270 Z" />
                <path d="M 290 240 C 320 180, 390 120, 420 130 C 435 170, 430 230, 390 290 C 370 320, 330 340, 295 270 Z" />
                <ellipse cx="250" cy="245" rx="36" ry="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" opacity="0.8" />
              </g>
            )}
            {wingsId === 'wings_cyber_neon' && (
              <g id="wings-cyber">
                <polygon points="210,230 110,130 90,145 180,240" fill="#0F172A" stroke="#06B6D4" strokeWidth="2.5" />
                <polygon points="290,230 390,130 410,145 320,240" fill="#0F172A" stroke="#06B6D4" strokeWidth="2.5" />
                <ellipse cx="250" cy="245" rx="22" ry="14" fill="#020617" stroke="#06B6D4" strokeWidth="2.5" />
              </g>
            )}
            {wingsId === 'wings_phoenix_flame' && (
              <g id="wings-phoenix" fill="#F97316" stroke="#7F1D1D" strokeWidth="1.5">
                <path d="M 210 230 Q 150 140 85 125 Q 120 170 115 205 Q 170 215 205 245 Z" />
                <path d="M 290 230 Q 350 140 415 125 Q 380 170 385 205 Q 330 215 295 245 Z" />
                <polygon points="250,232 260,246 250,260 240,246" fill="#FEF08A" stroke="#DC2626" strokeWidth="2" />
              </g>
            )}
            {wingsId === 'wings_devil_demonic' && (
              <g id="wings-devil-demonic" fill="#4c0519" stroke="#be123c" strokeWidth="2">
                <path d="M 210 240 Q 150 150 70 120 Q 90 170 80 200 Q 115 190 100 240 Q 140 230 130 280 Q 170 260 205 255 Z" />
                <path d="M 70 120 Q 120 180 205 245" stroke="#f43f5e" strokeWidth="3" fill="none" />
                <path d="M 290 240 Q 350 150 430 120 Q 410 170 420 200 Q 385 190 400 240 Q 360 230 370 280 Q 330 260 295 255 Z" />
                <path d="M 430 120 Q 380 180 295 245" stroke="#f43f5e" strokeWidth="3" fill="none" />
                <circle cx="250" cy="245" r="10" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
              </g>
            )}
            {wingsId === 'wings_fairy_butterfly' && (
              <g id="wings-fairy-butterfly" fill="#fbcfe8" fillOpacity="0.85" stroke="#ec4899" strokeWidth="2">
                <ellipse cx="140" cy="180" rx="65" ry="50" transform="rotate(-25 140 180)" />
                <ellipse cx="360" cy="180" rx="65" ry="50" transform="rotate(25 360 180)" />
                <ellipse cx="160" cy="270" rx="45" ry="35" transform="rotate(15 160 270)" fill="#c4b5fd" fillOpacity="0.8" />
                <ellipse cx="340" cy="270" rx="45" ry="35" transform="rotate(-15 340 270)" fill="#c4b5fd" fillOpacity="0.8" />
                <circle cx="135" cy="175" r="8" fill="#ffffff" opacity="0.7" />
                <circle cx="365" cy="175" r="8" fill="#ffffff" opacity="0.7" />
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 2 (Z: 2): BASE BODY & SKIN                             */}
        {/* ------------------------------------------------------------- */}
        <g id="layer-2-base-body" fill="var(--avatar-skin-color, #F8D5C2)">
          {/* Neck */}
          <rect x="228" y="220" width="44" height="40" rx="6" />

          {/* Torso Base */}
          {bodyType === 'female' ? (
            <path d="M 185 255 Q 250 250 315 255 Q 310 330 300 380 Q 250 390 200 380 Q 190 330 185 255 Z" />
          ) : bodyType === 'male' ? (
            <path d="M 175 250 Q 250 245 325 250 Q 320 330 310 385 Q 250 390 190 385 Q 180 330 175 250 Z" />
          ) : (
            <path d="M 180 252 Q 250 248 320 252 Q 315 330 305 382 Q 250 390 195 382 Q 185 330 180 252 Z" />
          )}

          {/* Arms */}
          <path d="M 180 255 Q 155 310 150 380 Q 165 390 175 375 Q 180 320 195 270 Z" />
          <path d="M 320 255 Q 345 310 350 380 Q 335 390 325 375 Q 320 320 305 270 Z" />

          {/* Hands */}
          <circle cx="150" cy="385" r="14" />
          <circle cx="350" cy="385" r="14" />

          {/* Legs Base */}
          <rect x="205" y="380" width="38" height="130" rx="10" />
          <rect x="257" y="380" width="38" height="130" rx="10" />

          {/* Head & Face Contour */}
          <ellipse cx="250" cy="170" rx="65" ry="72" />
          {/* Ears */}
          <circle cx="183" cy="175" r="12" />
          <circle cx="317" cy="175" r="12" />
          <circle cx="183" cy="175" r="6" fill="#e2a893" opacity="0.5" />
          <circle cx="317" cy="175" r="6" fill="#e2a893" opacity="0.5" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* LAYER 3 (Z: 3): FACE EXPRESSION (Eyes, Brows, Mouth, Blush)  */}
        {/* ------------------------------------------------------------- */}
        <g id="layer-3-face">
          {/* Soft Cheek Blush with Nostalgic Chibi Sparkles */}
          <ellipse cx="205" cy="190" rx="15" ry="8" fill="#fb7185" opacity="0.5" />
          <ellipse cx="295" cy="190" rx="15" ry="8" fill="#fb7185" opacity="0.5" />
          {/* Cheek Star Sparkles */}
          <circle cx="198" cy="188" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="302" cy="188" r="1.5" fill="#ffffff" opacity="0.8" />

          {/* Eyebrows */}
          {faceExpressionId === 'intellectual_focus' ? (
            <g stroke="#262626" strokeWidth="3.5" strokeLinecap="round">
              <path d="M 205 145 Q 225 152 235 154" />
              <path d="M 295 145 Q 275 152 265 154" />
            </g>
          ) : (
            <g stroke="#262626" strokeWidth="3.5" strokeLinecap="round">
              <path d="M 205 148 Q 222 142 235 148" />
              <path d="M 295 148 Q 278 142 265 148" />
            </g>
          )}

          {/* Eyes Expression */}
          {faceExpressionId === 'playful_wink' ? (
            <g>
              {/* Left Eye: Open wink */}
              <circle cx="218" cy="170" r="12" fill="#1e293b" />
              <circle cx="221" cy="167" r="4.5" fill="#ffffff" />
              <circle cx="214" cy="173" r="2" fill="#ffffff" />
              {/* Right Eye: Closed wink curve */}
              <path d="M 272 170 Q 285 160 298 170" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : faceExpressionId === 'confident_sparkle' ? (
            <g>
              <circle cx="218" cy="170" r="13" fill="#1e293b" />
              <circle cx="282" cy="170" r="13" fill="#1e293b" />
              {/* Sparkle star highlights */}
              <polygon points="220,165 222,168 226,169 222,171 220,175 218,171 214,169 218,168" fill="#fde047" />
              <polygon points="284,165 286,168 290,169 286,171 284,175 282,171 278,169 282,168" fill="#fde047" />
            </g>
          ) : (
            // Default: Friendly Smile Anime Chibi Eyes with Double Catchlights
            <g>
              <ellipse cx="218" cy="170" rx="12" ry="13" fill="#1e293b" />
              <ellipse cx="282" cy="170" rx="12" ry="13" fill="#1e293b" />
              {/* Primary Highlights */}
              <circle cx="221" cy="166" r="4.5" fill="#ffffff" />
              <circle cx="285" cy="166" r="4.5" fill="#ffffff" />
              {/* Secondary Catchlights */}
              <circle cx="215" cy="173" r="2.2" fill="#ffffff" opacity="0.9" />
              <circle cx="279" cy="173" r="2.2" fill="#ffffff" opacity="0.9" />
            </g>
          )}

          {/* Cute Nose */}
          <path d="M 248 180 Q 250 185 253 184" stroke="#d97706" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Mouth */}
          {state === 'defeated' ? (
            <path d="M 235 210 Q 250 198 265 210" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
          ) : faceExpressionId === 'intellectual_focus' ? (
            <path d="M 240 205 Q 250 207 260 205" fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
          ) : (
            // Cheerful Open Smile
            <g>
              <path d="M 235 198 Q 250 220 265 198 Z" fill="#e11d48" />
              <path d="M 238 200 Q 250 206 262 200" fill="#ffffff" />
            </g>
          )}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* LAYER 4 (Z: 4): BOTTOMS (Pants / Skirt)                      */}
        {/* ------------------------------------------------------------- */}
        {mode === 'full' && (
          <g id="layer-4-bottoms">
            {bottomsId?.includes('devil') ? (
              <g id="bottoms-devil-pants" fill="#18181b">
                <path d="M 195 350 L 305 350 L 302 480 L 258 480 L 252 390 L 248 390 L 242 480 L 198 480 Z" stroke="#e11d48" strokeWidth="2" />
                <path d="M 252 380 Q 290 400 310 380 Q 320 370 330 385 L 340 375 L 332 395 Z" fill="#e11d48" stroke="#881337" strokeWidth="1.5" />
              </g>
            ) : bottomsId?.includes('lolita') ? (
              <g id="bottoms-lolita-skirt" fill="#f472b6">
                <path d="M 190 350 L 310 350 L 335 435 L 165 435 Z" stroke="#db2777" strokeWidth="2" />
                <path d="M 160 435 Q 175 448 190 435 Q 205 448 220 435 Q 235 448 250 435 Q 265 448 280 435 Q 295 448 310 435 Q 325 448 340 435" fill="#fdf2f8" stroke="#f472b6" strokeWidth="2" />
                <circle cx="250" cy="365" r="5" fill="#ffffff" />
              </g>
            ) : bottomsId?.includes('angel') ? (
              <g id="bottoms-angel-skirt" fill="#fef9c3">
                <polygon points="190,350 310,350 330,430 170,430" stroke="#eab308" strokeWidth="2" />
                <line x1="225" y1="350" x2="215" y2="430" stroke="#facc15" strokeWidth="2" />
                <line x1="250" y1="350" x2="250" y2="430" stroke="#facc15" strokeWidth="2" />
                <line x1="275" y1="350" x2="285" y2="430" stroke="#facc15" strokeWidth="2" />
              </g>
            ) : bottomsId?.includes('shorts') ? (
              <g id="bottoms-chibi-shorts" fill="#0284c7">
                <path d="M 196 350 L 304 350 L 302 430 L 260 430 L 253 385 L 247 385 L 240 430 L 198 430 Z" stroke="#0369a1" strokeWidth="2" />
                <rect x="195" y="422" width="46" height="8" rx="2" fill="#38bdf8" />
                <rect x="259" y="422" width="46" height="8" rx="2" fill="#38bdf8" />
              </g>
            ) : bottomsId?.includes('skirt') ? (
              <g id="bottoms-skirt" fill="#1e3a8a">
                <polygon points="195,355 305,355 330,425 170,425" stroke="#172554" strokeWidth="2" />
                <line x1="225" y1="355" x2="215" y2="425" stroke="#1d4ed8" strokeWidth="2" />
                <line x1="250" y1="355" x2="250" y2="425" stroke="#1d4ed8" strokeWidth="2" />
                <line x1="275" y1="355" x2="285" y2="425" stroke="#1d4ed8" strokeWidth="2" />
              </g>
            ) : bottomsId?.includes('cyber') ? (
              <g id="bottoms-cyber-cargo" fill="#0f172a">
                <path d="M 195 350 L 305 350 L 305 480 L 260 480 L 253 390 L 247 390 L 240 480 L 195 480 Z" stroke="#38bdf8" strokeWidth="2" />
                {/* Cyber neon stripes */}
                <line x1="200" y1="410" x2="235" y2="410" stroke="#06b6d4" strokeWidth="3" />
                <line x1="265" y1="410" x2="300" y2="410" stroke="#06b6d4" strokeWidth="3" />
              </g>
            ) : (
              // Default: Classic Blue Jeans
              <g id="bottoms-classic-jeans" fill="#2563eb">
                <path d="M 198 350 L 302 350 L 298 480 L 257 480 L 252 390 L 248 390 L 243 480 L 202 480 Z" stroke="#1d4ed8" strokeWidth="2" />
                {/* Belt & Pockets */}
                <rect x="200" y="350" width="100" height="12" fill="#78350f" />
                <rect x="242" y="348" width="16" height="16" fill="#eab308" rx="2" />
                <path d="M 210 370 Q 225 385 235 370" fill="none" stroke="#60a5fa" strokeWidth="2" />
                <path d="M 290 370 Q 275 385 265 370" fill="none" stroke="#60a5fa" strokeWidth="2" />
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 5 (Z: 5): FOOTWEAR (Sneakers / Boots)                   */}
        {/* ------------------------------------------------------------- */}
        {mode === 'full' && (
          <g id="layer-5-footwear">
            {footwearId?.includes('boots') ? (
              <g id="footwear-boots" fill="#78350f">
                <path d="M 198 475 L 242 475 L 245 520 L 180 520 Q 180 495 198 475 Z" stroke="#451a03" strokeWidth="2" />
                <path d="M 258 475 L 302 475 L 320 520 L 255 520 Q 255 495 258 475 Z" stroke="#451a03" strokeWidth="2" />
                <rect x="175" y="515" width="70" height="10" rx="3" fill="#262626" />
                <rect x="255" y="515" width="70" height="10" rx="3" fill="#262626" />
              </g>
            ) : footwearId?.includes('cyber') ? (
              <g id="footwear-cyber" fill="#0f172a">
                <path d="M 200 475 L 242 475 L 245 520 L 180 520 Q 185 495 200 475 Z" stroke="#06b6d4" strokeWidth="2" />
                <path d="M 258 475 L 300 475 L 320 520 L 255 520 Q 270 495 258 475 Z" stroke="#06b6d4" strokeWidth="2" />
                <rect x="178" y="515" width="67" height="9" rx="3" fill="#06b6d4" />
                <rect x="255" y="515" width="67" height="9" rx="3" fill="#06b6d4" />
              </g>
            ) : (
              // Default: Clean White Sneakers
              <g id="footwear-sneakers" fill="#f8fafc">
                <path d="M 200 475 L 242 475 L 245 520 L 180 520 Q 185 495 200 475 Z" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M 258 475 L 300 475 L 320 520 L 255 520 Q 270 495 258 475 Z" stroke="#cbd5e1" strokeWidth="2" />
                {/* Sole & Accent line */}
                <rect x="178" y="514" width="68" height="10" rx="4" fill="#047857" />
                <rect x="254" y="514" width="68" height="10" rx="4" fill="#047857" />
                <line x1="205" y1="495" x2="235" y2="495" stroke="#10b981" strokeWidth="2" />
                <line x1="265" y1="495" x2="295" y2="495" stroke="#10b981" strokeWidth="2" />
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 6 (Z: 6): TOPS (T-Shirt, Hoodie, Suit, Jacket)         */}
        {/* ------------------------------------------------------------- */}
        <g id="layer-6-tops">
          {topsId?.includes('devil') ? (
            <g id="tops-devil-hoodie" fill="#18181b">
              <path d="M 175 250 Q 250 240 325 250 L 315 370 Q 250 380 185 370 Z" stroke="#e11d48" strokeWidth="2.5" />
              <path d="M 180 252 L 145 350 L 175 355 L 195 270 Z" />
              <path d="M 320 252 L 355 350 L 325 355 L 305 270 Z" />
              <polygon points="215,325 285,325 275,360 225,360" fill="#27272a" stroke="#f43f5e" strokeWidth="1.5" />
              <path d="M 235 290 Q 250 310 265 290 Q 250 325 235 290 Z" fill="#e11d48" />
            </g>
          ) : topsId?.includes('angel') ? (
            <g id="tops-angel-tunic" fill="#fefce8">
              <path d="M 175 250 Q 250 242 325 250 L 316 372 Q 250 380 184 372 Z" stroke="#eab308" strokeWidth="2" />
              <path d="M 180 252 L 140 345 L 175 350 L 195 270 Z" />
              <path d="M 320 252 L 360 345 L 325 350 L 305 270 Z" />
              <path d="M 215 250 Q 250 280 285 250" fill="none" stroke="#facc15" strokeWidth="3" />
              <circle cx="250" cy="300" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>
          ) : topsId?.includes('lolita') ? (
            <g id="tops-princess-lolita" fill="#fbcfe8">
              <path d="M 176 250 Q 250 242 324 250 L 312 365 Q 250 372 188 365 Z" stroke="#ec4899" strokeWidth="2" />
              <circle cx="160" cy="275" r="16" fill="#fdf2f8" stroke="#f472b6" strokeWidth="1.5" />
              <circle cx="340" cy="275" r="16" fill="#fdf2f8" stroke="#f472b6" strokeWidth="1.5" />
              <path d="M 220 250 Q 250 275 280 250" fill="#fdf2f8" stroke="#ec4899" strokeWidth="1.5" />
              <polygon points="244,270 256,270 250,285" fill="#f43f5e" />
            </g>
          ) : topsId?.includes('bear') ? (
            <g id="tops-bear-hoodie" fill="#78350f">
              <path d="M 175 250 Q 250 240 325 250 L 315 370 Q 250 380 185 370 Z" stroke="#451a03" strokeWidth="2.5" />
              <path d="M 180 252 L 145 350 L 175 355 L 195 270 Z" />
              <path d="M 320 252 L 355 350 L 325 355 L 305 270 Z" />
              <circle cx="250" cy="315" r="22" fill="#fef3c7" />
              <circle cx="250" cy="310" r="5" fill="#451a03" />
            </g>
          ) : topsId?.includes('prince') ? (
            <g id="tops-prince-vest" fill="#1e3a8a">
              <path d="M 175 250 Q 250 242 325 250 L 312 370 Q 250 376 188 370 Z" stroke="#172554" strokeWidth="2" />
              <polygon points="225,248 275,248 250,295" fill="#ffffff" />
              <rect x="170" y="248" width="22" height="10" rx="3" fill="#eab308" />
              <rect x="308" y="248" width="22" height="10" rx="3" fill="#eab308" />
              <circle cx="250" cy="320" r="4" fill="#fbbf24" />
              <circle cx="250" cy="345" r="4" fill="#fbbf24" />
            </g>
          ) : topsId?.includes('hoodie') ? (
            <g id="tops-cyber-hoodie" fill="#09090b">
              {/* Torso */}
              <path d="M 175 250 Q 250 240 325 250 L 315 370 Q 250 380 185 370 Z" stroke="#a855f7" strokeWidth="3" />
              {/* Sleeves */}
              <path d="M 180 252 L 145 350 L 175 355 L 195 270 Z" />
              <path d="M 320 252 L 355 350 L 325 355 L 305 270 Z" />
              {/* Kangaroo Pocket & Neon Decal */}
              <polygon points="215,325 285,325 275,360 225,360" fill="#18181b" stroke="#c084fc" strokeWidth="2" />
              <circle cx="250" cy="285" r="10" fill="#a855f7" />
              <polygon points="250,278 253,284 259,285 255,289 256,295 250,292 244,295 245,289 241,285 247,284" fill="#fde047" />
            </g>
          ) : topsId?.includes('suit') ? (
            <g id="tops-oxford-suit" fill="#1e293b">
              <path d="M 175 250 Q 250 242 325 250 L 312 370 Q 250 376 188 370 Z" />
              {/* White Shirt Collar peek */}
              <polygon points="230,246 270,246 250,290" fill="#ffffff" />
              {/* Tie */}
              <polygon points="247,260 253,260 255,310 250,320 245,310" fill="#dc2626" />
              {/* Suit Lapels */}
              <polygon points="175,250 225,320 200,320" fill="#334155" />
              <polygon points="325,250 275,320 300,320" fill="#334155" />
            </g>
          ) : topsId?.includes('detective') ? (
            <g id="tops-detective-coat" fill="#b45309">
              <path d="M 172 250 Q 250 240 328 250 L 320 395 Q 250 405 180 395 Z" stroke="#78350f" strokeWidth="2" />
              <line x1="250" y1="260" x2="250" y2="395" stroke="#78350f" strokeWidth="3" />
              {/* Double buttons */}
              <circle cx="240" cy="290" r="4" fill="#451a03" />
              <circle cx="260" cy="290" r="4" fill="#451a03" />
              <circle cx="240" cy="330" r="4" fill="#451a03" />
              <circle cx="260" cy="330" r="4" fill="#451a03" />
            </g>
          ) : (
            // Default: Classic Tee
            <g id="tops-starter-tee" fill="#f8fafc">
              <path d="M 178 250 Q 250 244 322 250 L 310 365 Q 250 372 190 365 Z" stroke="#cbd5e1" strokeWidth="2" />
              {/* Sleeves */}
              <path d="M 178 250 L 150 300 L 175 310 L 192 270 Z" />
              <path d="M 322 250 L 350 300 L 325 310 L 308 270 Z" />
              {/* Collar curve */}
              <path d="M 226 248 Q 250 265 274 248" fill="none" stroke="#94a3b8" strokeWidth="3" />
              {/* Small logo emblem */}
              <circle cx="225" cy="285" r="7" fill="#10b981" />
              <path d="M 222 285 L 224 288 L 228 282" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* LAYER 7 (Z: 7): NECKWEAR (Scarf, Headphones, Tie)            */}
        {/* ------------------------------------------------------------- */}
        {neckwearId && (
          <g id="layer-7-neckwear">
            {neckwearId.includes('scarf') ? (
              <g id="neckwear-scarf" fill="#dc2626">
                <rect x="215" y="235" width="70" height="24" rx="10" stroke="#991b1b" strokeWidth="2" />
                <path d="M 255 245 L 270 330 L 290 330 L 275 245 Z" stroke="#991b1b" strokeWidth="2" />
                {/* Yellow stripes */}
                <line x1="225" y1="235" x2="225" y2="259" stroke="#facc15" strokeWidth="4" />
                <line x1="262" y1="285" x2="282" y2="285" stroke="#facc15" strokeWidth="5" />
              </g>
            ) : neckwearId.includes('headphone') ? (
              <g id="neckwear-headphones" fill="#0f172a">
                <path d="M 195 245 Q 250 270 305 245" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" />
                <rect x="180" y="235" width="22" height="30" rx="8" fill="#0891b2" stroke="#22d3ee" strokeWidth="2" />
                <rect x="298" y="235" width="22" height="30" rx="8" fill="#0891b2" stroke="#22d3ee" strokeWidth="2" />
              </g>
            ) : null}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 8 (Z: 8): FRONT HAIR & BANGS                           */}
        {/* ------------------------------------------------------------- */}
        <g id="layer-8-front-hair" fill="var(--avatar-hair-color, #3B2219)">
          {hairStyleId.includes('short_crop') ? (
            <path d="M 180 160 Q 185 105 250 100 Q 315 105 320 160 Q 305 130 275 145 Q 250 125 220 145 Q 195 135 180 160 Z" />
          ) : hairStyleId.includes('side_part') ? (
            <path d="M 180 165 Q 185 98 250 95 Q 315 100 320 165 C 290 135 250 140 220 155 C 205 150 190 155 180 165 Z" />
          ) : hairStyleId.includes('messy_fringe') ? (
            <g>
              <path d="M 178 165 Q 185 98 250 95 Q 315 98 322 165 Z" />
              <polygon points="190,140 205,165 215,140" />
              <polygon points="215,140 230,170 240,140" />
              <polygon points="240,140 255,168 265,140" />
              <polygon points="265,140 280,165 295,140" />
              <polygon points="295,140 305,160 315,140" />
            </g>
          ) : hairStyleId.includes('bob_cut') ? (
            <path d="M 175 165 Q 185 95 250 95 Q 315 95 325 165 C 320 185 305 145 285 145 C 255 145 240 145 215 145 C 195 145 180 185 175 165 Z" />
          ) : hairStyleId.includes('curly_afro') ? (
            <path d="M 175 150 Q 180 90 250 85 Q 320 90 325 150 Q 305 135 250 135 Q 195 135 175 150 Z" />
          ) : (
            // Default: Chic modern cut
            <path d="M 182 160 Q 188 102 250 98 Q 312 102 318 160 Q 295 130 250 135 Q 205 130 182 160 Z" />
          )}
        </g>

        {/* ------------------------------------------------------------- */}
        {/* LAYER 9 (Z: 9): HEADWEAR (Hats, Caps, Crowns)                */}
        {/* ------------------------------------------------------------- */}
        {headwearId && (
          <g id="layer-9-headwear">
            {headwearId.includes('devil') || headwearId.includes('horns') ? (
              <g id="headwear-devil-horns" fill="#881337" stroke="#e11d48" strokeWidth="2">
                <path d="M 205 125 Q 180 80 160 55 Q 185 75 220 115 Z" />
                <path d="M 295 125 Q 320 80 340 55 Q 315 75 280 115 Z" />
                <circle cx="160" cy="55" r="3" fill="#f43f5e" />
                <circle cx="340" cy="55" r="3" fill="#f43f5e" />
              </g>
            ) : headwearId.includes('halo') || headwearId.includes('angel') ? (
              <g id="headwear-angel-halo" className="animate-pulse">
                <ellipse cx="250" cy="65" rx="55" ry="16" fill="none" stroke="#facc15" strokeWidth="6" opacity="0.9" />
                <ellipse cx="250" cy="65" rx="55" ry="16" fill="none" stroke="#fef08a" strokeWidth="2" />
                <circle cx="210" cy="62" r="3" fill="#ffffff" />
                <circle cx="290" cy="62" r="3" fill="#ffffff" />
              </g>
            ) : headwearId.includes('bunny') ? (
              <g id="headwear-bunny-ears">
                <ellipse cx="205" cy="65" rx="16" ry="50" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" transform="rotate(-8 205 65)" />
                <ellipse cx="205" cy="65" rx="8" ry="36" fill="#fbcfe8" transform="rotate(-8 205 65)" />
                <ellipse cx="295" cy="65" rx="16" ry="50" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" transform="rotate(8 295 65)" />
                <ellipse cx="295" cy="65" rx="8" ry="36" fill="#fbcfe8" transform="rotate(8 295 65)" />
              </g>
            ) : headwearId.includes('cat') ? (
              <g id="headwear-cat-ears">
                <polygon points="190,125 175,70 225,105" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
                <polygon points="192,120 183,82 216,108" fill="#fdf2f8" />
                <polygon points="310,125 325,70 275,105" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
                <polygon points="308,120 317,82 284,108" fill="#fdf2f8" />
              </g>
            ) : headwearId.includes('cap') ? (
              <g id="headwear-cap" fill="#dc2626">
                <ellipse cx="250" cy="115" rx="72" ry="40" />
                <path d="M 180 115 Q 140 120 125 140 Q 180 135 220 120 Z" fill="#991b1b" />
                <circle cx="250" cy="78" r="6" fill="#facc15" />
              </g>
            ) : headwearId.includes('beanie') ? (
              <g id="headwear-beanie" fill="#0d9488">
                <path d="M 175 135 Q 180 75 250 70 Q 320 75 325 135 Z" stroke="#0f766e" strokeWidth="2" />
                <rect x="170" y="125" width="160" height="24" rx="8" fill="#14b8a6" />
                <circle cx="250" cy="65" r="14" fill="#fde047" />
              </g>
            ) : headwearId.includes('crown') ? (
              <g id="headwear-crown" fill="url(#gold-pedestal-grad)" stroke="#a16207" strokeWidth="2">
                <polygon points="190,115 210,65 230,95 250,50 270,95 290,65 310,115" />
                <rect x="190" y="110" width="120" height="15" rx="3" fill="#ca8a04" />
                <circle cx="250" cy="50" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                <circle cx="210" cy="65" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                <circle cx="290" cy="65" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              </g>
            ) : headwearId.includes('beret') ? (
              <g id="headwear-beret" fill="#475569">
                <ellipse cx="240" cy="100" rx="80" ry="32" transform="rotate(-8 240 100)" />
                <circle cx="230" cy="70" r="4" fill="#0f172a" />
              </g>
            ) : null}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 10 (Z: 10): EYEWEAR (Glasses, Sunglasses)              */}
        {/* ------------------------------------------------------------- */}
        {eyewearId && (
          <g id="layer-10-eyewear">
            {eyewearId.includes('round') ? (
              <g id="eyewear-round" fill="none" stroke="#d97706" strokeWidth="3.5">
                <circle cx="218" cy="170" r="18" fill="#ffffff" fillOpacity="0.15" />
                <circle cx="282" cy="170" r="18" fill="#ffffff" fillOpacity="0.15" />
                <line x1="236" y1="170" x2="264" y2="170" />
                <line x1="200" y1="170" x2="183" y2="173" />
                <line x1="300" y1="170" x2="317" y2="173" />
              </g>
            ) : eyewearId.includes('shades') ? (
              <g id="eyewear-shades" fill="#0f172a" stroke="#000000" strokeWidth="2">
                <polygon points="198,158 238,158 234,185 204,185" rx="4" />
                <polygon points="262,158 302,158 296,185 266,185" rx="4" />
                <line x1="238" y1="164" x2="262" y2="164" stroke="#0f172a" strokeWidth="4" />
                {/* Glare line */}
                <line x1="205" y1="162" x2="225" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
                <line x1="270" y1="162" x2="290" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
              </g>
            ) : eyewearId.includes('visor') ? (
              <g id="eyewear-cyber-visor">
                <polygon points="195,155 305,155 295,185 205,185" fill="#06b6d4" fillOpacity="0.75" stroke="#22d3ee" strokeWidth="3" />
                <line x1="205" y1="170" x2="295" y2="170" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 4" />
              </g>
            ) : null}
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LAYER 11 (Z: 11): COMPANION / HANDHELD ITEM                   */}
        {/* ------------------------------------------------------------- */}
        {mode === 'full' && activeHandheld && (
          <g id="layer-11-companion">
            {activeHandheld.includes('lollipop') ? (
              <g id="handheld-lollipop">
                {/* Stick */}
                <line x1="350" y1="390" x2="385" y2="330" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                {/* Giant Candy */}
                <circle cx="390" cy="315" r="26" fill="#f43f5e" stroke="#e11d48" strokeWidth="2" />
                <circle cx="390" cy="315" r="20" fill="#fbbf24" />
                <circle cx="390" cy="315" r="14" fill="#38bdf8" />
                <circle cx="390" cy="315" r="8" fill="#f472b6" />
                <circle cx="390" cy="315" r="3" fill="#ffffff" />
                {/* Ribbon Bow */}
                <polygon points="375,340 380,345 375,350" fill="#ec4899" />
                <polygon points="385,340 380,345 385,350" fill="#ec4899" />
              </g>
            ) : activeHandheld.includes('pitchfork') || activeHandheld.includes('trident') ? (
              <g id="handheld-pitchfork">
                {/* Shaft */}
                <line x1="350" y1="410" x2="385" y2="290" stroke="#18181b" strokeWidth="5" strokeLinecap="round" />
                {/* Red Demon Trident Prongs */}
                <path d="M 370 290 Q 385 305 400 290" fill="none" stroke="#e11d48" strokeWidth="4" />
                <polygon points="368,290 373,270 375,290" fill="#e11d48" />
                <polygon points="383,285 385,260 387,285" fill="#e11d48" />
                <polygon points="395,290 397,270 402,290" fill="#e11d48" />
              </g>
            ) : activeHandheld.includes('owl') ? (
              <g id="companion-owl" className="animate-float-orbit">
                {/* Cute Owl on shoulder */}
                <ellipse cx="380" cy="240" rx="24" ry="30" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                <ellipse cx="380" cy="246" rx="16" ry="18" fill="#fef3c7" />
                {/* Big Glasses Eyes */}
                <circle cx="372" cy="230" r="8" fill="#ffffff" stroke="#eab308" strokeWidth="2" />
                <circle cx="388" cy="230" r="8" fill="#ffffff" stroke="#eab308" strokeWidth="2" />
                <circle cx="372" cy="230" r="3.5" fill="#1e293b" />
                <circle cx="388" cy="230" r="3.5" fill="#1e293b" />
                <polygon points="380,236 376,242 384,242" fill="#d97706" />
                {/* Grad cap */}
                <polygon points="380,212 360,220 380,225 400,220" fill="#1e293b" />
              </g>
            ) : activeHandheld.includes('cat') ? (
              <g id="companion-cat" className="animate-float-orbit">
                <circle cx="380" cy="250" r="22" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                <polygon points="364,235 372,218 378,234" fill="#f97316" />
                <polygon points="384,234 390,218 398,235" fill="#f97316" />
                <circle cx="372" cy="248" r="3" fill="#1e293b" />
                <circle cx="388" cy="248" r="3" fill="#1e293b" />
                <polygon points="380,253 377,256 383,256" fill="#fb7185" />
              </g>
            ) : activeHandheld.includes('dictionary') ? (
              <g id="handheld-dictionary">
                <rect x="120" y="340" width="35" height="50" rx="4" fill="#047857" stroke="#064e3b" strokeWidth="2" transform="rotate(-15 130 360)" />
                <rect x="123" y="343" width="28" height="44" fill="#ecfdf5" transform="rotate(-15 130 360)" />
                <text x="127" y="370" fontSize="12" fontWeight="bold" fill="#047857" transform="rotate(-15 130 360)">EN</text>
              </g>
            ) : activeHandheld.includes('wand') ? (
              <g id="handheld-wand" className="animate-pulse">
                <line x1="350" y1="380" x2="395" y2="330" stroke="#a16207" strokeWidth="5" strokeLinecap="round" />
                <polygon points="395,330 405,325 410,315 415,325 425,330 415,335 410,345 405,335" fill="#fde047" stroke="#eab308" strokeWidth="2" className="animate-spin" />
              </g>
            ) : null}
          </g>
        )}
      </svg>
    </div>
  );
};

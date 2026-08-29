import fs from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "client", "public", "blocks");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Definition of each block's SVG artwork matching the uploaded 28 blocks
const blockSvgs = {
  "aoiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#60a5fa"/>
        <stop offset="100%" stop-color="#3b82f6"/>
      </linearGradient>
      <linearGradient id="leftG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2563eb"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="rightG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e40af"/>
        <stop offset="100%" stop-color="#172554"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#shadow)">
      <!-- Outline / Base -->
      <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
      <!-- Top Face -->
      <polygon points="50,15 85,33 50,51 15,33" fill="url(#topG)"/>
      <path d="M 30,30 Q 50,22 70,32" stroke="#93c5fd" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M 40,38 Q 55,42 65,36" stroke="#1d4ed8" stroke-width="1.5" fill="none" opacity="0.4"/>
      <!-- Left Face -->
      <polygon points="15,33 50,51 50,88 15,70" fill="url(#leftG)"/>
      <path d="M 20,45 Q 35,55 45,50 M 22,60 Q 30,68 46,65" stroke="#60a5fa" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M 28,38 L 26,62" stroke="#1e3a8a" stroke-width="1.5" fill="none" opacity="0.5"/>
      <!-- Right Face -->
      <polygon points="50,51 85,33 85,70 50,88" fill="url(#rightG)"/>
      <path d="M 55,48 Q 70,42 80,55 M 55,68 Q 68,62 80,72" stroke="#3b82f6" stroke-width="1.5" fill="none" opacity="0.3"/>
    </g>
  </svg>`,

  "aodoukutusiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="cLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0369a1"/>
        <stop offset="100%" stop-color="#075985"/>
      </linearGradient>
      <linearGradient id="cRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c4a6e"/>
        <stop offset="100%" stop-color="#082f49"/>
      </linearGradient>
    </defs>
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0c4a6e" stroke="#082f49" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="url(#cTop)"/>
    <!-- Horizontal geological strata/layers -->
    <polygon points="15,33 50,51 50,88 15,70" fill="url(#cLeft)"/>
    <path d="M 15,44 Q 32,58 50,60" stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 15,56 Q 30,70 50,72" stroke="#0284c7" stroke-width="3.5" fill="none" opacity="0.9"/>
    <path d="M 15,63 Q 32,77 50,79" stroke="#7dd3fc" stroke-width="2" fill="none" opacity="0.6"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="url(#cRight)"/>
    <path d="M 50,60 Q 68,46 85,42" stroke="#0284c7" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M 50,72 Q 68,58 85,54" stroke="#0369a1" stroke-width="3.5" fill="none" opacity="0.8"/>
    <path d="M 50,79 Q 68,66 85,62" stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.4"/>
  </svg>`,

  "arafuruuroko.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#67e8f9"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0f172a" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="url(#scTop)"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
    <!-- Fish scale patterns -->
    <path d="M 20,45 A 8,8 0 0,1 35,45 A 8,8 0 0,1 50,45" fill="#4ade80" stroke="#15803d" stroke-width="1.5" opacity="0.85"/>
    <path d="M 15,58 A 9,9 0 0,1 30,58 A 9,9 0 0,1 45,58" fill="#fb923c" stroke="#c2410c" stroke-width="1.5" opacity="0.85"/>
    <path d="M 22,70 A 9,9 0 0,1 38,70 A 9,9 0 0,1 50,70" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5" opacity="0.85"/>
    <path d="M 50,45 A 8,8 0 0,0 65,40 A 8,8 0 0,0 80,38" fill="#fb923c" stroke="#c2410c" stroke-width="1.5" opacity="0.85"/>
    <path d="M 50,58 A 9,9 0 0,0 65,54 A 9,9 0 0,0 80,50" fill="#4ade80" stroke="#15803d" stroke-width="1.5" opacity="0.85"/>
    <path d="M 50,70 A 9,9 0 0,0 66,66 A 9,9 0 0,0 82,62" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5" opacity="0.85"/>
  </svg>`,

  "arafurusango.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#fbcfe8" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fdf2f8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fce7f3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fbcfe8"/>
    <!-- Coral flora patterns -->
    <circle cx="30" cy="48" r="5" fill="#f43f5e"/>
    <circle cx="40" cy="62" r="4" fill="#fb923c"/>
    <circle cx="25" cy="68" r="5" fill="#a855f7"/>
    <path d="M 32,54 Q 38,50 42,56" stroke="#22c55e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="65" cy="45" r="5" fill="#38bdf8"/>
    <circle cx="75" cy="58" r="4.5" fill="#f43f5e"/>
    <circle cx="60" cy="68" r="4" fill="#eab308"/>
    <path d="M 68,52 Q 74,48 78,54" stroke="#ec4899" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`,

  "ishikoshi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#64748b" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f1f5f9"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#e2e8f0"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#cbd5e1"/>
    <!-- Inset panel box frame -->
    <polygon points="22,42 43,53 43,76 22,63" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
    <polygon points="26,46 39,53 39,71 26,62" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/>
    <polygon points="57,53 78,42 78,63 57,76" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
    <polygon points="61,53 74,46 74,62 61,71" fill="#64748b" stroke="#475569" stroke-width="1.5"/>
  </svg>`,

  "irodoritsurutsurutairu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <!-- 4 Pastel Quadrants -->
    <polygon points="50,15 67,24 50,33 32,24" fill="#fbcfe8"/>
    <polygon points="67,24 85,33 67,42 50,33" fill="#bae6fd"/>
    <polygon points="32,24 50,33 32,42 15,33" fill="#ddd6fe"/>
    <polygon points="50,33 67,42 50,51 32,42" fill="#fed7aa"/>
    <!-- Left Face with tile grid -->
    <polygon points="15,33 32,42 32,60 15,51" fill="#f472b6"/>
    <polygon points="32,42 50,51 50,70 32,60" fill="#a78bfa"/>
    <polygon points="15,51 32,60 32,79 15,70" fill="#60a5fa"/>
    <polygon points="32,60 50,70 50,88 32,79" fill="#38bdf8"/>
    <!-- Right Face with tile grid -->
    <polygon points="50,51 68,42 68,60 50,70" fill="#818cf8"/>
    <polygon points="68,42 85,33 85,51 68,60" fill="#38bdf8"/>
    <polygon points="50,70 68,60 68,79 50,88" fill="#c084fc"/>
    <polygon points="68,60 85,51 85,70 68,79" fill="#60a5fa"/>
    <!-- Bevel Lines -->
    <line x1="32" y1="42" x2="32" y2="79" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
    <line x1="15" y1="51" x2="50" y2="70" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
    <line x1="68" y1="42" x2="68" y2="79" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
    <line x1="50" y1="70" x2="85" y2="51" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
  </svg>`,

  "umikoketsuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#9f1239" stroke="#881337" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fb7185"/>
    <!-- Textured moss top -->
    <path d="M 25,28 Q 35,22 45,30 Q 55,38 65,26 Q 75,34 82,32" stroke="#fda4af" stroke-width="2" fill="none" opacity="0.8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f43f5e"/>
    <!-- Spore spots -->
    <circle cx="28" cy="45" r="3" fill="#ffe4e6" opacity="0.7"/>
    <circle cx="40" cy="56" r="4" fill="#fda4af" opacity="0.6"/>
    <circle cx="22" cy="62" r="3" fill="#be123c" opacity="0.8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e11d48"/>
    <circle cx="62" cy="48" r="3.5" fill="#fda4af" opacity="0.6"/>
    <circle cx="75" cy="58" r="3" fill="#ffe4e6" opacity="0.7"/>
    <circle cx="60" cy="68" r="4" fill="#9f1239" opacity="0.8"/>
  </svg>`,

  "urushinurikabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#450a0a" stroke="#1c1917" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#7f1d1d"/>
    <!-- Wood grain reflection top -->
    <polygon points="15,33 50,51 50,88 15,70" fill="#b91c1c"/>
    <line x1="20" y1="40" x2="20" y2="65" stroke="#ef4444" stroke-width="1.5" opacity="0.6"/>
    <line x1="32" y1="45" x2="32" y2="75" stroke="#7f1d1d" stroke-width="2" opacity="0.8"/>
    <line x1="42" y1="50" x2="42" y2="82" stroke="#ef4444" stroke-width="1.5" opacity="0.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#991b1b"/>
    <line x1="58" y1="50" x2="58" y2="82" stroke="#7f1d1d" stroke-width="2" opacity="0.8"/>
    <line x1="68" y1="45" x2="68" y2="75" stroke="#ef4444" stroke-width="1.5" opacity="0.4"/>
    <line x1="78" y1="40" x2="78" y2="65" stroke="#7f1d1d" stroke-width="1.5" opacity="0.8"/>
  </svg>`,

  "ougimetamon.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#581c87" stroke="#3b0764" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f3e8ff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fae8ff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e9d5ff"/>
    <!-- Traditional fan crest patterns in purple -->
    <path d="M 20,46 Q 32,38 45,50 L 32,60 Z" fill="#a855f7" opacity="0.9"/>
    <path d="M 20,66 Q 32,58 45,70 L 32,80 Z" fill="#c084fc" opacity="0.9"/>
    <path d="M 55,50 Q 68,38 80,46 L 68,60 Z" fill="#9333ea" opacity="0.9"/>
    <path d="M 55,70 Q 68,58 80,66 L 68,80 Z" fill="#a855f7" opacity="0.9"/>
  </svg>`,

  "ogosokanokabe_ueshita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#64748b" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fed7aa"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ffedd5"/>
    <!-- Heart & arabesque relief in white/gold -->
    <path d="M 32,52 C 24,44 20,56 32,66 C 44,56 40,44 32,52 Z" fill="none" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"/>
    <path d="M 68,52 C 60,44 56,56 68,66 C 80,56 76,44 68,52 Z" fill="none" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"/>
  </svg>`,

  "ogosokanokabe_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#64748b" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
    <!-- Marble Diamond relief -->
    <polygon points="32,44 44,56 32,74 20,62" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
    <polygon points="68,44 80,62 68,74 56,56" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  </svg>`,

  "ogosokanayuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <!-- Gold inlaid top tile -->
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="50,22 72,33 50,44 28,33" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <!-- Gold band around waist -->
    <polygon points="15,45 50,63 50,73 15,55" fill="#d97706"/>
    <circle cx="32" cy="59" r="3" fill="#fef08a"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <polygon points="50,63 85,45 85,55 50,73" fill="#b45309"/>
    <circle cx="68" cy="59" r="3" fill="#fef08a"/>
  </svg>`,

  "orientaru.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#2d0606" stroke="#1a0000" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#450a0a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#7f1d1d"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#4c0519"/>
    <!-- Emerald Green oriental lattice grid -->
    <rect x="22" y="44" width="20" height="28" fill="none" stroke="#34d399" stroke-width="2.5" transform="skewY(20)"/>
    <line x1="16" y1="56" x2="48" y2="72" stroke="#34d399" stroke-width="2.5"/>
    <rect x="58" y="44" width="20" height="28" fill="none" stroke="#34d399" stroke-width="2.5" transform="skewY(-20)"/>
    <line x1="52" y1="72" x2="84" y2="56" stroke="#34d399" stroke-width="2.5"/>
  </svg>`,

  "kaiteinomo.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#ca8a04" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <!-- Cyan algae cap on sand -->
    <polygon points="50,15 85,33 50,51 15,33" fill="#00ffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde68a"/>
    <path d="M 15,33 L 15,44 Q 25,48 35,42 Q 45,52 50,48 L 50,51 Z" fill="#00ffff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fcd34d"/>
    <path d="M 50,51 L 50,48 Q 65,42 75,48 Q 80,44 85,40 L 85,33 Z" fill="#06b6d4"/>
  </svg>`,

  "kasanarinamimoyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e3a8a" stroke="#172554" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#bfdbfe"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#60a5fa"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#3b82f6"/>
    <!-- Layered wave scales -->
    <path d="M 16,42 Q 24,36 32,46 Q 40,36 48,46" stroke="#fef08a" stroke-width="3" fill="none"/>
    <path d="M 16,55 Q 24,49 32,59 Q 40,49 48,59" stroke="#ffffff" stroke-width="3" fill="none"/>
    <path d="M 16,68 Q 24,62 32,72 Q 40,62 48,72" stroke="#fef08a" stroke-width="3" fill="none"/>
    <path d="M 52,46 Q 60,36 68,46 Q 76,36 84,42" stroke="#ffffff" stroke-width="3" fill="none"/>
    <path d="M 52,59 Q 60,49 68,59 Q 76,49 84,55" stroke="#fef08a" stroke-width="3" fill="none"/>
    <path d="M 52,72 Q 60,62 68,72 Q 76,62 84,68" stroke="#ffffff" stroke-width="3" fill="none"/>
  </svg>`,

  "karafuruikari.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e1b4b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#312e81"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#3730a3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e1b4b"/>
    <!-- Marine Anchors (Orange & Cyan) -->
    <!-- Left anchor (Orange) -->
    <path d="M 32,46 L 32,66 M 24,58 Q 32,68 40,58" stroke="#fb923c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="45" r="2.5" fill="#fb923c"/>
    <!-- Right anchor (Cyan) -->
    <path d="M 68,46 L 68,66 M 60,58 Q 68,68 76,58" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="68" cy="45" r="2.5" fill="#38bdf8"/>
  </svg>`,

  "guradeue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradUeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="60%" stop-color="#fca5a5"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
      <linearGradient id="gradUeRight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e11d48"/>
        <stop offset="60%" stop-color="#f87171"/>
        <stop offset="100%" stop-color="#f1f5f9"/>
      </linearGradient>
    </defs>
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#be123c" stroke="#9f1239" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fb7185"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="url(#gradUeLeft)"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="url(#gradUeRight)"/>
  </svg>`,

  "guradeshita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradShitaLeft" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#fca5a5"/>
        <stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
      <linearGradient id="gradShitaRight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#f87171"/>
        <stop offset="100%" stop-color="#e11d48"/>
      </linearGradient>
    </defs>
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#be123c" stroke="#9f1239" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="url(#gradShitaLeft)"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="url(#gradShitaRight)"/>
  </svg>`,

  "sangonomori.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#67e8f9" stroke="#22d3ee" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e0f2fe"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#bae6fd"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#7dd3fc"/>
    <!-- Coral branches and bubbles in pastel -->
    <path d="M 22,70 Q 24,55 30,52 Q 35,45 32,38 M 30,52 Q 38,50 42,42" stroke="#f472b6" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="25" cy="46" r="3" fill="#fb923c"/>
    <path d="M 58,72 Q 62,58 70,55 Q 75,48 72,40 M 70,55 Q 78,52 82,45" stroke="#f472b6" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="64" cy="50" r="3" fill="#facc15"/>
  </svg>`,

  "shikkunaikari.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#64748b" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
    <!-- Helm / Ship wheel etched lines -->
    <circle cx="32" cy="58" r="8" fill="none" stroke="#71717a" stroke-width="1.5"/>
    <path d="M 32,46 L 32,70 M 20,58 L 44,58 M 24,50 L 40,66 M 24,66 L 40,50" stroke="#71717a" stroke-width="1.5"/>
    <path d="M 68,48 L 68,68 M 60,60 Q 68,70 76,60" stroke="#71717a" stroke-width="2" fill="none"/>
    <circle cx="68" cy="47" r="2.5" fill="none" stroke="#71717a" stroke-width="1.5"/>
  </svg>`,

  "shimashimanamimoyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0f766e" stroke="#115e59" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ccfbf1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f0fdfa"/>
    <!-- Mint green wavy stripes -->
    <path d="M 15,42 Q 24,36 32,46 Q 41,36 50,46" stroke="#2dd4bf" stroke-width="4" fill="none"/>
    <path d="M 15,55 Q 24,49 32,59 Q 41,49 50,59" stroke="#2dd4bf" stroke-width="4" fill="none"/>
    <path d="M 15,68 Q 24,62 32,72 Q 41,62 50,72" stroke="#2dd4bf" stroke-width="4" fill="none"/>
    <path d="M 50,46 Q 59,36 68,46 Q 76,36 85,42" stroke="#14b8a6" stroke-width="4" fill="none"/>
    <path d="M 50,59 Q 59,49 68,59 Q 76,49 85,55" stroke="#14b8a6" stroke-width="4" fill="none"/>
    <path d="M 50,72 Q 59,62 68,72 Q 76,62 85,68" stroke="#14b8a6" stroke-width="4" fill="none"/>
  </svg>`,

  "tsuton.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#67e8f9"/>
    <!-- Split top half cyan, bottom half coral -->
    <polygon points="15,33 50,51 50,68 15,50" fill="#38bdf8"/>
    <polygon points="15,50 50,68 50,88 15,70" fill="#f87171"/>
    <polygon points="50,51 85,33 85,50 50,68" fill="#0284c7"/>
    <polygon points="50,68 85,50 85,70 50,88" fill="#ef4444"/>
  </svg>`,

  "tsurutsurutairu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e0f2fe"/>
    <!-- Top 4 sub-tiles -->
    <line x1="50" y1="15" x2="50" y2="51" stroke="#0284c7" stroke-width="1.5"/>
    <line x1="15" y1="33" x2="85" y2="33" stroke="#0284c7" stroke-width="1.5"/>
    <!-- Left face 4 sub-tiles -->
    <polygon points="15,33 50,51 50,88 15,70" fill="#bae6fd"/>
    <line x1="32" y1="42" x2="32" y2="79" stroke="#0284c7" stroke-width="2"/>
    <line x1="15" y1="51" x2="50" y2="70" stroke="#0284c7" stroke-width="2"/>
    <!-- Right face 4 sub-tiles -->
    <polygon points="50,51 85,33 85,70 50,88" fill="#7dd3fc"/>
    <line x1="68" y1="42" x2="68" y2="79" stroke="#0369a1" stroke-width="2"/>
    <line x1="50" y1="70" x2="85" y2="51" stroke="#0369a1" stroke-width="2"/>
  </svg>`,

  "dejitaru.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#083344" stroke="#164e63" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#06b6d4"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0891b2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0e7490"/>
    <!-- Digital matrix grid & glowing cyber nodes -->
    <rect x="22" y="44" width="8" height="8" fill="#22d3ee" transform="skewY(20)"/>
    <rect x="36" y="58" width="8" height="8" fill="#a7f3d0" transform="skewY(20)"/>
    <line x1="15" y1="42" x2="50" y2="60" stroke="#155e75" stroke-width="1.5"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#155e75" stroke-width="1.5"/>
    <rect x="56" y="56" width="8" height="8" fill="#38bdf8" transform="skewY(-20)"/>
    <rect x="70" y="44" width="8" height="8" fill="#22c55e" transform="skewY(-20)"/>
    <line x1="50" y1="60" x2="85" y2="42" stroke="#164e63" stroke-width="1.5"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#164e63" stroke-width="1.5"/>
  </svg>`,

  "burokkuuki.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0369a1" stroke="#075985" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
    <!-- Embossed circular studs matrix (Lego/tactile dots) -->
    <circle cx="24" cy="46" r="2" fill="#7dd3fc"/>
    <circle cx="32" cy="50" r="2" fill="#7dd3fc"/>
    <circle cx="40" cy="54" r="2" fill="#7dd3fc"/>
    <circle cx="24" cy="56" r="2" fill="#7dd3fc"/>
    <circle cx="32" cy="60" r="2" fill="#7dd3fc"/>
    <circle cx="40" cy="64" r="2" fill="#7dd3fc"/>
    <circle cx="24" cy="66" r="2" fill="#7dd3fc"/>
    <circle cx="32" cy="70" r="2" fill="#7dd3fc"/>
    <circle cx="40" cy="74" r="2" fill="#7dd3fc"/>
    <!-- Right side studs -->
    <circle cx="60" cy="54" r="2" fill="#0284c7"/>
    <circle cx="68" cy="50" r="2" fill="#0284c7"/>
    <circle cx="76" cy="46" r="2" fill="#0284c7"/>
    <circle cx="60" cy="64" r="2" fill="#0284c7"/>
    <circle cx="68" cy="60" r="2" fill="#0284c7"/>
    <circle cx="76" cy="56" r="2" fill="#0284c7"/>
  </svg>`,

  "hoshitsubuiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <!-- Sparkling stardust crystals & cyan ore vein -->
    <path d="M 15,55 Q 32,68 50,60" stroke="#38bdf8" stroke-width="3" fill="none"/>
    <path d="M 50,60 Q 68,52 85,62" stroke="#0284c7" stroke-width="3" fill="none"/>
    <!-- Stars -->
    <path d="M 30,42 L 32,46 L 36,48 L 32,50 L 30,54 L 28,50 L 24,48 L 28,46 Z" fill="#ffffff"/>
    <path d="M 68,64 L 70,68 L 74,70 L 70,72 L 68,76 L 66,72 L 62,70 L 66,68 Z" fill="#fef08a"/>
    <circle cx="42" cy="74" r="2" fill="#ffffff"/>
    <circle cx="60" cy="46" r="2" fill="#38bdf8"/>
  </svg>`,

  "metaru.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <!-- Steel plate panel & rivets -->
    <polygon points="20,42 45,55 45,80 20,67" fill="#64748b" stroke="#475569" stroke-width="1.5"/>
    <circle cx="23" cy="46" r="1.5" fill="#f1f5f9"/>
    <circle cx="42" cy="56" r="1.5" fill="#f1f5f9"/>
    <circle cx="23" cy="64" r="1.5" fill="#f1f5f9"/>
    <circle cx="42" cy="76" r="1.5" fill="#f1f5f9"/>
    <polygon points="55,55 80,42 80,67 55,80" fill="#475569" stroke="#334155" stroke-width="1.5"/>
    <circle cx="58" cy="56" r="1.5" fill="#cbd5e1"/>
    <circle cx="77" cy="46" r="1.5" fill="#cbd5e1"/>
    <circle cx="58" cy="76" r="1.5" fill="#cbd5e1"/>
    <circle cx="77" cy="64" r="1.5" fill="#cbd5e1"/>
  </svg>`,

  "yokonagashikaku.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e0f2fe"/>
    <!-- Horizontal brick tile lines -->
    <polygon points="15,33 50,51 50,88 15,70" fill="#bae6fd"/>
    <line x1="15" y1="45" x2="50" y2="63" stroke="#0284c7" stroke-width="2"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#0284c7" stroke-width="2"/>
    <line x1="32" y1="42" x2="32" y2="54" stroke="#0284c7" stroke-width="2"/>
    <line x1="24" y1="54" x2="24" y2="67" stroke="#0284c7" stroke-width="2"/>
    <line x1="40" y1="63" x2="40" y2="76" stroke="#0284c7" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#7dd3fc"/>
    <line x1="50" y1="63" x2="85" y2="45" stroke="#0369a1" stroke-width="2"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#0369a1" stroke-width="2"/>
    <line x1="68" y1="42" x2="68" y2="54" stroke="#0369a1" stroke-width="2"/>
    <line x1="60" y1="54" x2="60" y2="67" stroke="#0369a1" stroke-width="2"/>
    <line x1="76" y1="63" x2="76" y2="76" stroke="#0369a1" stroke-width="2"/>
  </svg>`
};

for (const [filename, content] of Object.entries(blockSvgs)) {
  fs.writeFileSync(path.join(outputDir, filename), content.trim());
}

console.log("Successfully generated all 28 block SVGs in", outputDir);

import fs from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "client", "public", "blocks");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 43 blocks with dedicated custom SVG matching isometric voxel styling
const batch1Svgs = {
  "argyle_check.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="argRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ef4444"/>
        <stop offset="100%" stop-color="#b91c1c"/>
      </linearGradient>
      <linearGradient id="argDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#991b1b"/>
        <stop offset="100%" stop-color="#7f1d1d"/>
      </linearGradient>
    </defs>
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7f1d1d" stroke="#450a0a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="url(#argRed)"/>
    <polygon points="50,23 68,33 50,43 32,33" fill="#fef08a" stroke="#fef9c3" stroke-width="1"/>
    <line x1="15" y1="33" x2="85" y2="33" stroke="#fef9c3" stroke-width="1.5" opacity="0.8"/>
    <line x1="50" y1="15" x2="50" y2="51" stroke="#fef9c3" stroke-width="1.5" opacity="0.8"/>
    
    <polygon points="15,33 50,51 50,88 15,70" fill="url(#argRed)"/>
    <polygon points="32,42 42,56 32,70 22,56" fill="#fef08a" stroke="#fef9c3" stroke-width="1"/>
    <line x1="15" y1="52" x2="50" y2="70" stroke="#fef9c3" stroke-width="1.5" opacity="0.7"/>
    <line x1="15" y1="70" x2="50" y2="52" stroke="#fef9c3" stroke-width="1.5" opacity="0.7"/>

    <polygon points="50,51 85,33 85,70 50,88" fill="url(#argDark)"/>
    <polygon points="68,42 78,56 68,70 58,56" fill="#fef08a" stroke="#fef9c3" stroke-width="1"/>
    <line x1="50" y1="70" x2="85" y2="52" stroke="#fef9c3" stroke-width="1.5" opacity="0.7"/>
    <line x1="50" y1="52" x2="85" y2="70" stroke="#fef9c3" stroke-width="1.5" opacity="0.7"/>
  </svg>`,

  "arch_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="archTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fb923c"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
    </defs>
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#431407" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="url(#archTop)"/>
    <path d="M 25,28 Q 50,42 75,28 M 30,35 Q 50,47 70,35" stroke="#7c2d12" stroke-width="1.5" fill="none"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#c2410c"/>
    <path d="M 15,50 Q 32,68 50,60 M 15,68 Q 32,82 50,75" stroke="#7c2d12" stroke-width="1.5" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#9a3412"/>
    <path d="M 50,60 Q 68,48 85,55 M 50,75 Q 68,65 85,72" stroke="#431407" stroke-width="1.5" fill="none"/>
  </svg>`,

  "akai_kezuretaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#450a0a" stroke="#260404" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#b91c1c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#991b1b"/>
    <!-- stepped/notched cut -->
    <polygon points="15,48 35,58 35,78 15,68" fill="#7f1d1d"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#7f1d1d"/>
    <polygon points="50,68 70,58 70,78 50,88" fill="#450a0a"/>
  </svg>`,

  "akai_tsubugakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#431407" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ea580c"/>
    <!-- Top and bottom sand stripes with middle grains -->
    <polygon points="15,33 50,51 50,57 15,39" fill="#fed7aa"/>
    <polygon points="15,64 50,82 50,88 15,70" fill="#fed7aa"/>
    <circle cx="25" cy="50" r="2.5" fill="#fef08a"/>
    <circle cx="38" cy="62" r="3" fill="#fef08a"/>
    <circle cx="42" cy="52" r="2" fill="#b91c1c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#c2410c"/>
    <polygon points="50,51 85,33 85,39 50,57" fill="#fed7aa"/>
    <polygon points="50,82 85,64 85,70 50,88" fill="#fed7aa"/>
    <circle cx="65" cy="48" r="2.5" fill="#fef08a"/>
    <circle cx="75" cy="55" r="3" fill="#991b1b"/>
  </svg>`,

  "akaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7f1d1d" stroke="#450a0a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#dc2626"/>
    <path d="M 28,30 Q 52,24 68,36" stroke="#f87171" stroke-width="2" fill="none" opacity="0.6"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b91c1c"/>
    <path d="M 20,48 Q 32,58 45,52 M 22,65 Q 35,72 45,68" stroke="#ef4444" stroke-width="1.5" fill="none" opacity="0.4"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#991b1b"/>
    <path d="M 55,52 Q 68,45 80,58" stroke="#7f1d1d" stroke-width="2" fill="none"/>
  </svg>`,

  "akagakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#431407" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fb923c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ea580c"/>
    <path d="M 15,45 Q 32,58 50,55 M 15,62 Q 32,74 50,72" stroke="#fb923c" stroke-width="2.5" fill="none" opacity="0.7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#c2410c"/>
    <path d="M 50,55 Q 68,42 85,50 M 50,72 Q 68,60 85,68" stroke="#fb923c" stroke-width="2.5" fill="none" opacity="0.7"/>
  </svg>`,

  "akacha_doukutusiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#450a0a" stroke="#260404" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#991b1b"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#7f1d1d"/>
    <path d="M 15,44 Q 32,56 50,58 M 15,62 Q 32,76 50,78" stroke="#450a0a" stroke-width="4" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#581c87"/>
    <path d="M 50,58 Q 68,45 85,48 M 50,78 Q 68,65 85,68" stroke="#260404" stroke-width="4" fill="none"/>
  </svg>`,

  "asphalt_no_michi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#475569"/>
    <!-- Asphalt dark top texture -->
    <polygon points="50,17 82,33 50,49 18,33" fill="#334155"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <circle cx="28" cy="58" r="2" fill="#64748b"/>
    <circle cx="40" cy="72" r="2.5" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <circle cx="68" cy="52" r="2" fill="#475569"/>
  </svg>`,

  "antique_kabe_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <!-- Antique top molding & arabesque -->
    <polygon points="15,33 50,51 50,59 15,41" fill="#78350f"/>
    <path d="M 22,65 Q 32,58 42,65" stroke="#fef3c7" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#92400e"/>
    <polygon points="50,51 85,33 85,41 50,59" fill="#78350f"/>
    <path d="M 58,65 Q 68,58 78,65" stroke="#fef3c7" stroke-width="2" fill="none"/>
  </svg>`,

  "antique_kabe_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <rect x="22" y="52" width="20" height="24" transform="skewY(26)" fill="#78350f" stroke="#fef3c7" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#92400e"/>
    <rect x="58" y="32" width="20" height="24" transform="skewY(-26)" fill="#78350f" stroke="#fef3c7" stroke-width="1.5"/>
  </svg>`,

  "antique_kabe_naka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <!-- Center relief -->
    <circle cx="32" cy="60" r="8" fill="#78350f" stroke="#fef3c7" stroke-width="1.5"/>
    <path d="M 32,54 L 32,66 M 26,60 L 38,60" stroke="#fef3c7" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#92400e"/>
    <circle cx="68" cy="60" r="8" fill="#78350f" stroke="#fef3c7" stroke-width="1.5"/>
    <path d="M 68,54 L 68,66 M 62,60 L 74,60" stroke="#fef3c7" stroke-width="1.5"/>
  </svg>`,

  "ie_no_dodai.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <!-- Top warm stripe, bottom cool concrete foundation -->
    <polygon points="15,33 50,51 50,60 15,42" fill="#f97316"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <polygon points="50,51 85,33 85,42 50,60" fill="#ea580c"/>
  </svg>`,

  "ishizumi_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <!-- Round stone pile lines -->
    <path d="M 18,48 Q 28,42 36,49 Q 44,44 48,50" stroke="#334155" stroke-width="2" fill="none"/>
    <path d="M 16,62 Q 26,58 35,63 Q 42,58 49,66" stroke="#334155" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <path d="M 52,50 Q 62,44 72,48 Q 80,43 84,48" stroke="#334155" stroke-width="2" fill="none"/>
    <path d="M 52,66 Q 62,60 74,65 Q 81,60 84,65" stroke="#334155" stroke-width="2" fill="none"/>
  </svg>`,

  "ishi_no_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e2e8f0"/>
    <line x1="32" y1="24" x2="68" y2="42" stroke="#64748b" stroke-width="1.5"/>
    <line x1="32" y1="42" x2="68" y2="24" stroke="#64748b" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#cbd5e1"/>
    <line x1="15" y1="52" x2="50" y2="70" stroke="#64748b" stroke-width="2"/>
    <line x1="32" y1="42" x2="32" y2="79" stroke="#64748b" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#94a3b8"/>
    <line x1="50" y1="70" x2="85" y2="52" stroke="#475569" stroke-width="2"/>
    <line x1="68" y1="42" x2="68" y2="79" stroke="#475569" stroke-width="2"/>
  </svg>`,

  "ishi_no_hashira_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <!-- Capital stepped molding -->
    <polygon points="15,33 50,51 50,57 15,39" fill="#e2e8f0"/>
    <polygon points="18,52 47,67 47,88 18,73" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,39 50,57" fill="#94a3b8"/>
    <polygon points="53,67 82,52 82,73 53,88" fill="#94a3b8"/>
  </svg>`,

  "ishi_no_hashira_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <!-- Base stepped molding -->
    <polygon points="15,64 50,82 50,88 15,70" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#cbd5e1"/>
    <polygon points="50,82 85,64 85,70 50,88" fill="#94a3b8"/>
  </svg>`,

  "ishi_no_hashira_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <!-- Fluted vertical lines -->
    <line x1="26" y1="39" x2="26" y2="76" stroke="#94a3b8" stroke-width="2.5"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#94a3b8" stroke-width="2.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#cbd5e1"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#64748b" stroke-width="2.5"/>
    <line x1="74" y1="39" x2="74" y2="76" stroke="#64748b" stroke-width="2.5"/>
  </svg>`,

  "ishi_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f1f5f9"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#94a3b8"/>
  </svg>`,

  "ishi_line_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f1f5f9"/>
    <line x1="32" y1="24" x2="68" y2="42" stroke="#64748b" stroke-width="3"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#cbd5e1"/>
    <line x1="32" y1="42" x2="32" y2="79" stroke="#64748b" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#94a3b8"/>
    <line x1="68" y1="42" x2="68" y2="79" stroke="#475569" stroke-width="3"/>
  </svg>`,

  "ishi_renga_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#e2e8f0"/>
    <!-- Brick pattern lines -->
    <line x1="15" y1="45" x2="50" y2="63" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="25" y1="38" x2="25" y2="50" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="40" y1="45" x2="40" y2="58" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="25" y1="58" x2="25" y2="75" stroke="#94a3b8" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#cbd5e1"/>
    <line x1="50" y1="63" x2="85" y2="45" stroke="#64748b" stroke-width="1.5"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#64748b" stroke-width="1.5"/>
  </svg>`,

  "ukishima_no_gakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#eab308"/>
    <path d="M 15,48 Q 32,60 50,56" stroke="#ca8a04" stroke-width="3" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <path d="M 50,56 Q 68,44 85,52" stroke="#a16207" stroke-width="3" fill="none"/>
  </svg>`,

  "ukishima_no_suna.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef9c3"/>
    <circle cx="40" cy="30" r="1.5" fill="#ca8a04"/>
    <circle cx="60" cy="36" r="1.5" fill="#ca8a04"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
  </svg>`,

  "ukishima_no_sunaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#facc15"/>
    <path d="M 18,48 Q 32,54 46,49 M 20,68 Q 35,74 46,70" stroke="#ca8a04" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <path d="M 54,49 Q 68,44 82,50" stroke="#a16207" stroke-width="2" fill="none"/>
  </svg>`,

  "ukishima_no_tsubugakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef9c3"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="15,33 50,51 50,57 15,39" fill="#fef9c3"/>
    <polygon points="15,64 50,82 50,88 15,70" fill="#fef9c3"/>
    <circle cx="28" cy="50" r="2.5" fill="#ca8a04"/>
    <circle cx="38" cy="62" r="3" fill="#ca8a04"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <polygon points="50,51 85,33 85,39 50,57" fill="#fef9c3"/>
    <polygon points="50,82 85,64 85,70 50,88" fill="#fef9c3"/>
    <circle cx="68" cy="50" r="2.5" fill="#a16207"/>
  </svg>`,

  "usucha_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fb923c"/>
    <path d="M 22,46 Q 35,55 45,50" stroke="#ea580c" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ea580c"/>
    <path d="M 55,50 Q 68,42 78,54" stroke="#c2410c" stroke-width="2" fill="none"/>
  </svg>`,

  "usucha_no_kezuretaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fb923c"/>
    <!-- stepped cut -->
    <polygon points="15,48 35,58 35,78 15,68" fill="#ea580c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ea580c"/>
    <polygon points="50,68 70,58 70,78 50,88" fill="#c2410c"/>
  </svg>`,

  "uchippanashi_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f1f5f9"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#e2e8f0"/>
    <!-- Exposed concrete dots -->
    <circle cx="22" cy="42" r="2.5" fill="#94a3b8"/>
    <circle cx="43" cy="54" r="2.5" fill="#94a3b8"/>
    <circle cx="22" cy="65" r="2.5" fill="#94a3b8"/>
    <circle cx="43" cy="77" r="2.5" fill="#94a3b8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#cbd5e1"/>
    <circle cx="57" cy="54" r="2.5" fill="#64748b"/>
    <circle cx="78" cy="42" r="2.5" fill="#64748b"/>
    <circle cx="57" cy="77" r="2.5" fill="#64748b"/>
    <circle cx="78" cy="65" r="2.5" fill="#64748b"/>
  </svg>`,

  "umi_no_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#312e81" stroke="#1e1b4b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#c084fc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#7e22ce"/>
    <path d="M 15,46 Q 32,58 50,60 M 15,62 Q 32,74 50,76" stroke="#fde047" stroke-width="3" fill="none" opacity="0.8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#581c87"/>
    <path d="M 50,60 Q 68,48 85,46 M 50,76 Q 68,64 85,62" stroke="#fde047" stroke-width="3" fill="none" opacity="0.8"/>
  </svg>`,

  "umibe_no_suna.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fffbeb"/>
    <circle cx="35" cy="30" r="1.5" fill="#fde68a"/>
    <circle cx="65" cy="38" r="1.5" fill="#fde68a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fef3c7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fde68a"/>
  </svg>`,

  "uroko_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#4c1d95" stroke="#2e1065" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ede9fe"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ddd6fe"/>
    <!-- Scale arcs -->
    <path d="M 16,45 A 8,8 0 0,1 32,45 A 8,8 0 0,1 48,45" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <path d="M 24,58 A 8,8 0 0,1 40,58" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <path d="M 16,70 A 8,8 0 0,1 32,70 A 8,8 0 0,1 48,70" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#c4b5fd"/>
    <path d="M 52,45 A 8,8 0 0,0 68,42 A 8,8 0 0,0 84,39" fill="none" stroke="#8b5cf6" stroke-width="2"/>
    <path d="M 60,58 A 8,8 0 0,0 76,55" fill="none" stroke="#8b5cf6" stroke-width="2"/>
    <path d="M 52,70 A 8,8 0 0,0 68,67 A 8,8 0 0,0 84,64" fill="none" stroke="#8b5cf6" stroke-width="2"/>
  </svg>`,

  "ougon_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#eab308"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
  </svg>`,

  "oshare_kabe_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,60 15,42" fill="#b45309"/>
    <!-- Triangular wood bracket -->
    <polygon points="18,44 26,62 34,44" fill="#b45309"/>
    <polygon points="34,50 42,68 50,50" fill="#b45309"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <polygon points="50,51 85,33 85,42 50,60" fill="#92400e"/>
    <polygon points="50,50 58,68 66,50" fill="#92400e"/>
    <polygon points="66,44 74,62 82,44" fill="#92400e"/>
  </svg>`,

  "oshare_kabe_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <polygon points="15,64 50,82 50,88 15,70" fill="#b45309"/>
    <polygon points="18,62 26,44 34,62" fill="#b45309"/>
    <polygon points="34,68 42,50 50,68" fill="#b45309"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <polygon points="50,82 85,64 85,70 50,88" fill="#92400e"/>
    <polygon points="50,68 58,50 66,68" fill="#92400e"/>
    <polygon points="66,62 74,44 82,62" fill="#92400e"/>
  </svg>`,

  "oshare_kabe_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <line x1="32" y1="42" x2="32" y2="79" stroke="#b45309" stroke-width="8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <line x1="68" y1="42" x2="68" y2="79" stroke="#92400e" stroke-width="8"/>
  </svg>`,

  "oshare_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0369a1" stroke="#082f49" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#bae6fd"/>
    <circle cx="50" cy="33" r="8" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#38bdf8"/>
    <!-- 4-petal flower on left face -->
    <circle cx="32" cy="60" r="7" fill="#ffffff"/>
    <path d="M 32,53 L 32,67 M 25,60 L 39,60" stroke="#0284c7" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0284c7"/>
    <circle cx="68" cy="60" r="7" fill="#ffffff"/>
    <path d="M 68,53 L 68,67 M 61,60 L 75,60" stroke="#0369a1" stroke-width="2"/>
  </svg>`,

  "osharena_ougon_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#eab308"/>
    <!-- Double square frame & stud -->
    <rect x="22" y="52" width="20" height="24" transform="skewY(26)" fill="none" stroke="#713f12" stroke-width="2"/>
    <rect x="26" y="56" width="12" height="16" transform="skewY(26)" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <rect x="58" y="32" width="20" height="24" transform="skewY(-26)" fill="none" stroke="#713f12" stroke-width="2"/>
    <rect x="62" y="36" width="12" height="16" transform="skewY(-26)" fill="#eab308" stroke="#713f12" stroke-width="1.5"/>
  </svg>`,

  "osharena_tetsu_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <!-- Double square frame & stud -->
    <rect x="22" y="52" width="20" height="24" transform="skewY(26)" fill="none" stroke="#334155" stroke-width="2"/>
    <rect x="26" y="56" width="12" height="16" transform="skewY(26)" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <rect x="58" y="32" width="20" height="24" transform="skewY(-26)" fill="none" stroke="#1e293b" stroke-width="2"/>
    <rect x="62" y="36" width="12" height="16" transform="skewY(-26)" fill="#94a3b8" stroke="#1e293b" stroke-width="1.5"/>
  </svg>`,

  "osharena_bronze_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#431407" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fb923c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#d97706"/>
    <!-- Double square frame & stud -->
    <rect x="22" y="52" width="20" height="24" transform="skewY(26)" fill="none" stroke="#78350f" stroke-width="2"/>
    <rect x="26" y="56" width="12" height="16" transform="skewY(26)" fill="#f59e0b" stroke="#78350f" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#b45309"/>
    <rect x="58" y="32" width="20" height="24" transform="skewY(-26)" fill="none" stroke="#78350f" stroke-width="2"/>
    <rect x="62" y="36" width="12" height="16" transform="skewY(-26)" fill="#d97706" stroke="#78350f" stroke-width="1.5"/>
  </svg>`,

  "oshare_ball_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#831843" stroke="#500724" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f43f5e"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#db2777"/>
    <!-- Damask pattern with gold center -->
    <circle cx="32" cy="60" r="7" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <path d="M 22,50 Q 32,45 42,50 M 22,70 Q 32,75 42,70" stroke="#fef08a" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#be185d"/>
    <circle cx="68" cy="60" r="7" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <path d="M 58,50 Q 68,45 78,50 M 58,70 Q 68,75 78,70" stroke="#fef08a" stroke-width="2" fill="none"/>
  </svg>`,

  "oshare_yukaishi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <!-- Interlocking stone pavement -->
    <path d="M 15,48 L 32,40 L 32,60 L 15,68" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
    <path d="M 32,60 L 50,52 L 50,72 L 32,80" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
    <path d="M 50,52 L 68,44 L 68,64 L 50,72" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>
    <path d="M 68,64 L 85,56 L 85,76 L 68,84" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
  </svg>`,

  "oshare_renga_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,60 15,42" fill="#ea580c"/>
    <line x1="32" y1="42" x2="32" y2="51" stroke="#fed7aa" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <polygon points="50,51 85,33 85,42 50,60" fill="#c2410c"/>
    <line x1="68" y1="42" x2="68" y2="51" stroke="#fed7aa" stroke-width="1.5"/>
  </svg>`,

  "oshare_renga_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <polygon points="15,64 50,82 50,88 15,70" fill="#ea580c"/>
    <line x1="32" y1="73" x2="32" y2="82" stroke="#fed7aa" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <polygon points="50,82 85,64 85,70 50,88" fill="#c2410c"/>
    <line x1="68" y1="73" x2="68" y2="82" stroke="#fed7aa" stroke-width="1.5"/>
  </svg>`,

  "oshare_renga_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <polygon points="15,48 50,66 50,75 15,57" fill="#ea580c"/>
    <line x1="32" y1="57" x2="32" y2="66" stroke="#fed7aa" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <polygon points="50,66 85,48 85,57 50,75" fill="#c2410c"/>
    <line x1="68" y1="57" x2="68" y2="66" stroke="#fed7aa" stroke-width="1.5"/>
  </svg>`,
};

for (const [filename, svg] of Object.entries(batch1Svgs)) {
  fs.writeFileSync(path.join(outputDir, filename), svg.trim(), "utf-8");
}

console.log(`Generated ${Object.keys(batch1Svgs).length} batch 1 block SVGs.`);

import fs from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "client", "public", "blocks");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 49 blocks for Batch 2 with accurate isometric voxel styling
const batch2Svgs = {
  "kaigara_no_tsuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <circle cx="42" cy="28" r="2" fill="#38bdf8"/>
    <circle cx="65" cy="36" r="2" fill="#34d399"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <circle cx="25" cy="48" r="2" fill="#34d399"/>
    <circle cx="42" cy="58" r="2" fill="#38bdf8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <circle cx="68" cy="52" r="2" fill="#34d399"/>
    <circle cx="75" cy="68" r="2" fill="#38bdf8"/>
  </svg>`,

  "kaigan_no_shibafu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#bef264"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fef08a"/>
    <path d="M 15,33 Q 25,44 35,39 Q 45,46 50,42 L 50,51 L 15,33 Z" fill="#84cc16"/>
    <circle cx="28" cy="62" r="2" fill="#38bdf8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <path d="M 50,42 Q 60,46 70,39 Q 80,44 85,33 L 85,42 L 50,51 Z" fill="#65a30d"/>
  </svg>`,

  "gakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f97316"/>
    <path d="M 15,48 Q 32,58 50,54 M 15,66 Q 32,76 50,72" stroke="#ea580c" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#c2410c"/>
    <path d="M 50,54 Q 68,44 85,50 M 50,72 Q 68,62 85,68" stroke="#9a3412" stroke-width="2" fill="none"/>
  </svg>`,

  "kazan_no_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#450a0a" stroke="#260404" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#78350f"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#581c87"/>
    <path d="M 15,48 Q 32,60 50,55" stroke="#7f1d1d" stroke-width="3" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#3b0764"/>
    <path d="M 50,55 Q 68,45 85,52" stroke="#450a0a" stroke-width="3" fill="none"/>
  </svg>`,

  "kazanbai.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#475569"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#334155"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e293b"/>
  </svg>`,

  "karakusa_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#14532d" stroke="#052e16" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#86efac"/>
    <path d="M 35,28 Q 42,22 50,28 Q 58,34 65,28" stroke="#ffffff" stroke-width="1.5" fill="none"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#4ade80"/>
    <path d="M 22,50 Q 32,40 38,55 Q 44,70 32,75 Q 22,70 28,58" stroke="#ffffff" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#22c55e"/>
    <path d="M 58,55 Q 68,45 74,60 Q 80,75 68,80 Q 58,75 64,63" stroke="#ffffff" stroke-width="2" fill="none"/>
  </svg>`,

  "curry_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fffbeb"/>
    <circle cx="50" cy="33" r="8" fill="#d97706"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fef3c7"/>
    <!-- Curry plate illustration -->
    <ellipse cx="32" cy="62" rx="12" ry="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
    <ellipse cx="32" cy="62" rx="9" ry="5" fill="#b45309"/>
    <ellipse cx="28" cy="61" rx="4" ry="3" fill="#facc15"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fde68a"/>
    <circle cx="65" cy="50" r="4" fill="#ef4444"/>
    <circle cx="75" cy="68" r="4" fill="#22c55e"/>
  </svg>`,

  "kiiroi_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#facc15"/>
    <path d="M 22,48 Q 35,55 45,50" stroke="#eab308" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <path d="M 55,50 Q 68,42 78,54" stroke="#ca8a04" stroke-width="2" fill="none"/>
  </svg>`,

  "kiiroi_kezuretaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#facc15"/>
    <polygon points="15,48 35,58 35,78 15,68" fill="#eab308"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <polygon points="50,68 70,58 70,78 50,88" fill="#ca8a04"/>
  </svg>`,

  "kiken_chitai_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#475569"/>
    <!-- Yellow & Black Hazard Stripes -->
    <polygon points="15,33 50,51 50,88 15,70" fill="#1e293b"/>
    <polygon points="15,38 28,31 45,60 32,67" fill="#eab308"/>
    <polygon points="25,65 38,58 50,80 37,87" fill="#eab308"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#334155"/>
    <polygon points="55,58 68,51 85,80 72,87" fill="#eab308"/>
  </svg>`,

  "gizagiza_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#eab308"/>
    <!-- Chevron / Zigzag with cyan and orange -->
    <path d="M 15,42 L 25,37 L 35,42 L 45,37 L 50,40" stroke="#06b6d4" stroke-width="3" fill="none"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#f97316" stroke-width="4"/>
    <path d="M 15,72 L 25,67 L 35,72 L 45,67 L 50,70" stroke="#06b6d4" stroke-width="3" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <path d="M 50,40 L 55,37 L 65,42 L 75,37 L 85,42" stroke="#0891b2" stroke-width="3" fill="none"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#ea580c" stroke-width="4"/>
    <path d="M 50,70 L 55,67 L 65,72 L 75,67 L 85,72" stroke="#0891b2" stroke-width="3" fill="none"/>
  </svg>`,

  "kinomi_no_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <circle cx="50" cy="33" r="4" fill="#f59e0b"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <!-- Fruit dots (apple, orange, berries) -->
    <circle cx="25" cy="50" r="5" fill="#ef4444"/>
    <circle cx="38" cy="72" r="6" fill="#eab308"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <circle cx="68" cy="52" r="5" fill="#3b82f6"/>
    <circle cx="75" cy="70" r="4" fill="#a855f7"/>
  </svg>`,

  "kyakushitsu_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <!-- Cyan dual stripes on luxury hotel room wall -->
    <line x1="15" y1="45" x2="50" y2="63" stroke="#38bdf8" stroke-width="3"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#38bdf8" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f8fafc"/>
    <line x1="50" y1="63" x2="85" y2="45" stroke="#0284c7" stroke-width="3"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#0284c7" stroke-width="3"/>
  </svg>`,

  "gingham_check.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0369a1" stroke="#082f49" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#7dd3fc"/>
    <line x1="28" y1="22" x2="72" y2="44" stroke="#38bdf8" stroke-width="3"/>
    <line x1="28" y1="44" x2="72" y2="22" stroke="#38bdf8" stroke-width="3"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#38bdf8"/>
    <!-- Grid checks -->
    <line x1="15" y1="45" x2="50" y2="63" stroke="#0284c7" stroke-width="2"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#0284c7" stroke-width="2"/>
    <line x1="26" y1="39" x2="26" y2="76" stroke="#ffffff" stroke-width="2"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#ffffff" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0284c7"/>
    <line x1="50" y1="63" x2="85" y2="45" stroke="#0369a1" stroke-width="2"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#0369a1" stroke-width="2"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#ffffff" stroke-width="2"/>
    <line x1="74" y1="39" x2="74" y2="76" stroke="#ffffff" stroke-width="2"/>
  </svg>`,

  "crash_tile_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#831843" stroke="#500724" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fbcfe8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f472b6"/>
    <!-- Mosaic shards in pink/purple/orange -->
    <path d="M 18,42 L 28,38 L 26,52 Z" fill="#ec4899"/>
    <path d="M 28,38 L 42,42 L 35,55 Z" fill="#a855f7"/>
    <path d="M 26,52 L 35,55 L 28,68 L 18,60 Z" fill="#fb923c"/>
    <path d="M 35,55 L 48,50 L 45,72 L 32,80 Z" fill="#f43f5e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#db2777"/>
    <path d="M 52,55 L 65,48 L 62,62 Z" fill="#ec4899"/>
    <path d="M 65,48 L 80,40 L 75,58 Z" fill="#a855f7"/>
    <path d="M 62,62 L 75,58 L 80,72 L 65,78 Z" fill="#fb923c"/>
  </svg>`,

  "crystal_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#67e8f9"/>
    <!-- Geometric diamond facets -->
    <polygon points="15,33 50,51 50,88 15,70" fill="#22d3ee"/>
    <polygon points="32,42 42,56 32,70 22,56" fill="#a5f3fc"/>
    <polygon points="15,50 32,42 22,56" fill="#06b6d4"/>
    <polygon points="50,60 32,70 42,56" fill="#0891b2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#06b6d4"/>
    <polygon points="68,42 78,56 68,70 58,56" fill="#a5f3fc"/>
  </svg>`,

  "guruguru_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#431407" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffedd5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fed7aa"/>
    <!-- Greek meander / spiral pattern in orange & white -->
    <path d="M 18,48 H 28 V 56 H 22 V 52" stroke="#ea580c" stroke-width="2" fill="none"/>
    <path d="M 34,56 H 44 V 64 H 38 V 60" stroke="#ea580c" stroke-width="2" fill="none"/>
    <path d="M 18,68 H 28 V 76 H 22 V 72" stroke="#ea580c" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fdba74"/>
    <path d="M 54,48 H 64 V 56 H 58 V 52" stroke="#c2410c" stroke-width="2" fill="none"/>
    <path d="M 70,56 H 80 V 64 H 74 V 60" stroke="#c2410c" stroke-width="2" fill="none"/>
  </svg>`,

  "gray_na_maru_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e2e8f0"/>
    <circle cx="50" cy="33" r="8" fill="#64748b"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#94a3b8"/>
  </svg>`,

  "kuroi_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e1b4b" stroke="#09090b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#3f3f46"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#27272a"/>
    <path d="M 22,48 Q 35,56 45,50" stroke="#581c87" stroke-width="2" fill="none" opacity="0.6"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#18181b"/>
  </svg>`,

  "kuroi_tsubugakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e1b4b" stroke="#09090b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#52525b"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#27272a"/>
    <polygon points="15,33 50,51 50,57 15,39" fill="#52525b"/>
    <polygon points="15,64 50,82 50,88 15,70" fill="#52525b"/>
    <circle cx="28" cy="50" r="2.5" fill="#a1a1aa"/>
    <circle cx="38" cy="62" r="3" fill="#a1a1aa"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#18181b"/>
    <polygon points="50,51 85,33 85,39 50,57" fill="#52525b"/>
    <polygon points="50,82 85,64 85,70 50,88" fill="#52525b"/>
    <circle cx="68" cy="50" r="2.5" fill="#71717a"/>
  </svg>`,

  "kurogakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e1b4b" stroke="#09090b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#3f3f46"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#27272a"/>
    <path d="M 15,48 Q 32,58 50,54 M 15,66 Q 32,76 50,72" stroke="#3f3f46" stroke-width="2.5" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#18181b"/>
    <path d="M 50,54 Q 68,44 85,50 M 50,72 Q 68,62 85,68" stroke="#27272a" stroke-width="2.5" fill="none"/>
  </svg>`,

  "gouka_na_juutan.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7f1d1d" stroke="#450a0a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#dc2626"/>
    <polygon points="50,22 72,33 50,44 28,33" fill="#fef08a"/>
    <circle cx="50" cy="33" r="3" fill="#b91c1c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b91c1c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#991b1b"/>
  </svg>`,

  "koori.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e0f2fe"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#bae6fd"/>
    <!-- Snowflake frost crystalline marks -->
    <path d="M 28,52 L 36,60 M 36,52 L 28,60 M 32,48 L 32,64 M 24,56 L 40,56" stroke="#ffffff" stroke-width="1.5" opacity="0.9"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#7dd3fc"/>
    <path d="M 64,52 L 72,60 M 72,52 L 64,60 M 68,48 L 68,64 M 60,56 L 76,56" stroke="#ffffff" stroke-width="1.5" opacity="0.9"/>
  </svg>`,

  "koke_tsuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#a3e635"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#84cc16"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#65a30d"/>
  </svg>`,

  "cyber_na_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#082f49" stroke="#0284c7" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#0f172a"/>
    <line x1="15" y1="33" x2="85" y2="33" stroke="#22d3ee" stroke-width="1.5"/>
    <line x1="50" y1="15" x2="50" y2="51" stroke="#22d3ee" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#1e293b"/>
    <rect x="22" y="52" width="20" height="24" transform="skewY(26)" fill="none" stroke="#22d3ee" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0f172a"/>
    <rect x="58" y="32" width="20" height="24" transform="skewY(-26)" fill="none" stroke="#22d3ee" stroke-width="2"/>
  </svg>`,

  "zarazara_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e2e8f0"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#94a3b8"/>
  </svg>`,

  "zarazara_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
  </svg>`,

  "zarazara_sunahama.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef9c3"/>
    <circle cx="35" cy="30" r="1.5" fill="#ca8a04"/>
    <circle cx="65" cy="38" r="1.5" fill="#ca8a04"/>
    <circle cx="50" cy="42" r="1.5" fill="#22c55e"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <circle cx="28" cy="50" r="2" fill="#22c55e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
  </svg>`,

  "zarazara_no_kezuretaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#e2e8f0"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#cbd5e1"/>
    <polygon points="15,48 35,58 35,78 15,68" fill="#94a3b8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#94a3b8"/>
    <polygon points="50,68 70,58 70,78 50,88" fill="#64748b"/>
  </svg>`,

  "sangaku_no_shibafu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#15803d"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#d97706"/>
    <path d="M 15,33 Q 25,46 35,40 Q 45,48 50,44 L 50,51 L 15,33 Z" fill="#16a34a"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#b45309"/>
    <path d="M 50,44 Q 60,48 70,40 Q 80,46 85,33 L 85,44 L 50,51 Z" fill="#15803d"/>
  </svg>`,

  "sankaku_moyou_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#431407" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fffbeb"/>
    <polygon points="50,15 85,33 50,51" fill="#fca5a5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fef2f2"/>
    <polygon points="15,33 50,51 50,88" fill="#f87171"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fee2e2"/>
  </svg>`,

  "shikaku_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="50,22 72,33 50,44 28,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <rect x="22" y="52" width="20" height="24" transform="skewY(26)" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <rect x="58" y="32" width="20" height="24" transform="skewY(-26)" fill="#eab308" stroke="#ca8a04" stroke-width="1"/>
  </svg>`,

  "shikkui_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
  </svg>`,

  "shibafu_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#14532d" stroke="#052e16" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#4ade80"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#22c55e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#16a34a"/>
  </svg>`,

  "shimashima_no_tsuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fb923c"/>
    <line x1="15" y1="45" x2="50" y2="63" stroke="#ea580c" stroke-width="4"/>
    <line x1="15" y1="58" x2="50" y2="76" stroke="#ea580c" stroke-width="4"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ea580c"/>
    <line x1="50" y1="63" x2="85" y2="45" stroke="#c2410c" stroke-width="4"/>
    <line x1="50" y1="76" x2="85" y2="58" stroke="#c2410c" stroke-width="4"/>
  </svg>`,

  "shabon_no_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f0f9ff"/>
    <circle cx="50" cy="33" r="6" fill="#bae6fd" opacity="0.6"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#e0f2fe"/>
    <circle cx="28" cy="52" r="8" fill="#bae6fd" opacity="0.6"/>
    <circle cx="40" cy="70" r="5" fill="#fbcfe8" opacity="0.7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#bae6fd"/>
    <circle cx="68" cy="52" r="8" fill="#fef08a" opacity="0.6"/>
    <circle cx="75" cy="70" r="6" fill="#bae6fd" opacity="0.6"/>
  </svg>`,

  "jari.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <circle cx="42" cy="28" r="2.5" fill="#ca8a04"/>
    <circle cx="65" cy="36" r="3" fill="#94a3b8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <circle cx="25" cy="48" r="3" fill="#64748b"/>
    <circle cx="36" cy="60" r="4" fill="#ca8a04"/>
    <circle cx="24" cy="68" r="3" fill="#94a3b8"/>
    <circle cx="42" cy="74" r="3" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <circle cx="62" cy="52" r="3" fill="#64748b"/>
    <circle cx="75" cy="58" r="4" fill="#a16207"/>
    <circle cx="65" cy="72" r="3.5" fill="#94a3b8"/>
  </svg>`,

  "shop_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ffffff"/>
    <!-- Pale blue store stripes -->
    <line x1="26" y1="39" x2="26" y2="76" stroke="#7dd3fc" stroke-width="4"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#7dd3fc" stroke-width="4"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f8fafc"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#38bdf8" stroke-width="4"/>
    <line x1="74" y1="39" x2="74" y2="76" stroke="#38bdf8" stroke-width="4"/>
  </svg>`,

  "shiroi_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
  </svg>`,

  "shiroi_kezuretaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <polygon points="15,48 35,58 35,78 15,68" fill="#e2e8f0"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
    <polygon points="50,68 70,58 70,78 50,88" fill="#cbd5e1"/>
  </svg>`,

  "simple_shikaku_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <line x1="32" y1="24" x2="68" y2="42" stroke="#cbd5e1" stroke-width="1.5"/>
    <line x1="32" y1="42" x2="68" y2="24" stroke="#cbd5e1" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <line x1="15" y1="52" x2="50" y2="70" stroke="#cbd5e1" stroke-width="1.5"/>
    <line x1="32" y1="42" x2="32" y2="79" stroke="#cbd5e1" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
    <line x1="50" y1="70" x2="85" y2="52" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="68" y1="42" x2="68" y2="79" stroke="#94a3b8" stroke-width="1.5"/>
  </svg>`,

  "simple_na_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f1f5f9"/>
  </svg>`,

  "sweets_kabe_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#be185d" stroke="#831843" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f43f5e"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fb7185"/>
    <!-- Scalloped icing cream dripping -->
    <path d="M 15,44 Q 24,56 32,48 Q 40,58 50,50 L 50,88 L 15,70 Z" fill="#ffffff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e11d48"/>
    <path d="M 50,50 Q 60,58 68,48 Q 76,56 85,44 L 85,70 L 50,88 Z" fill="#f8fafc"/>
  </svg>`,

  "sweets_kabe_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#38bdf8"/>
    <circle cx="28" cy="58" r="6" fill="#f43f5e"/>
    <circle cx="42" cy="70" r="5" fill="#f43f5e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0284c7"/>
    <circle cx="64" cy="58" r="6" fill="#f43f5e"/>
    <circle cx="76" cy="70" r="5" fill="#f43f5e"/>
  </svg>`,

  "sweets_kabe_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#be185d" stroke="#831843" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fbcfe8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f472b6"/>
    <!-- Vertical strawberry candy stripes -->
    <line x1="24" y1="38" x2="24" y2="75" stroke="#ffffff" stroke-width="4"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#ffffff" stroke-width="4"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#db2777"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#ffffff" stroke-width="4"/>
    <line x1="76" y1="38" x2="76" y2="75" stroke="#ffffff" stroke-width="4"/>
  </svg>`,

  "scrap.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <!-- Junk metal shards, wires and plates -->
    <line x1="18" y1="40" x2="48" y2="80" stroke="#f59e0b" stroke-width="2"/>
    <line x1="15" y1="65" x2="45" y2="45" stroke="#22c55e" stroke-width="2"/>
    <polygon points="22,48 35,42 38,58 25,64" fill="#ef4444" opacity="0.8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
    <line x1="52" y1="45" x2="82" y2="65" stroke="#3b82f6" stroke-width="2"/>
    <polygon points="58,58 72,52 75,68 62,74" fill="#a855f7" opacity="0.8"/>
  </svg>`,

  "sunaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fb923c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ea580c"/>
  </svg>`,

  "sekkaiseki.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fef08a"/>
    <path d="M 15,46 Q 32,54 50,50 M 15,68 Q 32,76 50,72" stroke="#ca8a04" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fde047"/>
    <path d="M 50,50 Q 68,44 85,48 M 50,72 Q 68,66 85,70" stroke="#a16207" stroke-width="2" fill="none"/>
  </svg>`,

  "sougen_no_shibafu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#84cc16"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fed7aa"/>
    <path d="M 15,33 Q 25,45 35,40 Q 45,47 50,43 L 50,51 L 15,33 Z" fill="#65a30d"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#fb923c"/>
    <path d="M 50,43 Q 60,47 70,40 Q 80,45 85,33 L 85,43 L 50,51 Z" fill="#4d7c0f"/>
  </svg>`,
};

for (const [filename, svg] of Object.entries(batch2Svgs)) {
  fs.writeFileSync(path.join(outputDir, filename), svg.trim(), "utf-8");
}

console.log(`Generated ${Object.keys(batch2Svgs).length} batch 2 block SVGs.`);

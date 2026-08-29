import fs from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "client", "public", "blocks");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 83 blocks for Batch 3 (covering all remaining official Poketopia/Pokoa catalog blocks)
const batch3Svgs = {
  // --- 壁系 ---
  "ki_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#b45309"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#92400e"/>
    <line x1="26" y1="39" x2="26" y2="76" stroke="#78350f" stroke-width="2"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#78350f" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#78350f"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#451a03" stroke-width="2"/>
    <line x1="74" y1="39" x2="74" y2="76" stroke="#451a03" stroke-width="2"/>
  </svg>`,

  "ki_no_kabe_light.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#a16207" stroke="#713f12" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#eab308"/>
    <line x1="26" y1="39" x2="26" y2="76" stroke="#ca8a04" stroke-width="2"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#a16207" stroke-width="2"/>
    <line x1="74" y1="39" x2="74" y2="76" stroke="#a16207" stroke-width="2"/>
  </svg>`,

  "penkinuri_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <circle cx="28" cy="50" r="3" fill="#e0f2fe" opacity="0.6"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
    <circle cx="70" cy="55" r="4" fill="#bae6fd" opacity="0.5"/>
  </svg>`,

  "nuno_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#d97706" stroke="#92400e" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef3c7"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde68a"/>
    <line x1="15" y1="52" x2="50" y2="70" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#f59e0b"/>
    <line x1="50" y1="70" x2="85" y2="52" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
  </svg>`,

  "hoshizora_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0f172a" stroke="#020617" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#1e1b4b"/>
    <circle cx="45" cy="30" r="1.5" fill="#fef08a"/>
    <circle cx="65" cy="38" r="1" fill="#fff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#312e81"/>
    <polygon points="28,52 30,57 35,57 31,60 33,65 28,62 23,65 25,60 21,57 26,57" fill="#fef08a" transform="scale(0.6) translate(15, 30)"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e1b4b"/>
    <circle cx="68" cy="55" r="1.5" fill="#fef08a"/>
    <circle cx="75" cy="70" r="1" fill="#fff"/>
  </svg>`,

  "leather_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#451a03" stroke="#270e02" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#92400e"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#78350f"/>
    <circle cx="32" cy="60" r="1.5" fill="#451a03"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#451a03"/>
    <circle cx="68" cy="60" r="1.5" fill="#270e02"/>
  </svg>`,

  "modern_na_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#64748b"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#475569"/>
    <rect x="22" y="48" width="16" height="24" fill="#0284c7" opacity="0.7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e293b"/>
    <rect x="60" y="48" width="16" height="24" fill="#0369a1" opacity="0.7"/>
  </svg>`,

  "renga_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ea580c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#c2410c"/>
    <line x1="15" y1="50" x2="50" y2="68" stroke="#7c2d12" stroke-width="1.5"/>
    <line x1="15" y1="65" x2="50" y2="83" stroke="#7c2d12" stroke-width="1.5"/>
    <line x1="32" y1="41" x2="32" y2="59" stroke="#7c2d12" stroke-width="1.5"/>
    <line x1="25" y1="56" x2="25" y2="74" stroke="#7c2d12" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#9a3412"/>
    <line x1="50" y1="68" x2="85" y2="50" stroke="#451a03" stroke-width="1.5"/>
    <line x1="50" y1="83" x2="85" y2="65" stroke="#451a03" stroke-width="1.5"/>
    <line x1="68" y1="41" x2="68" y2="59" stroke="#451a03" stroke-width="1.5"/>
  </svg>`,

  "furubitai_ishikabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#3f3f46" stroke="#27272a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#71717a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#52525b"/>
    <path d="M 20,45 Q 35,55 45,50 M 22,65 Q 30,72 40,68" stroke="#3f3f46" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#3f3f46"/>
    <path d="M 55,55 Q 70,48 80,60" stroke="#27272a" stroke-width="2" fill="none"/>
  </svg>`,

  "furubitai_ishikabe_gara.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#3f3f46" stroke="#27272a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#71717a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#52525b"/>
    <circle cx="32" cy="60" r="6" stroke="#a1a1aa" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#3f3f46"/>
    <circle cx="68" cy="60" r="6" stroke="#71717a" stroke-width="2" fill="none"/>
  </svg>`,

  "tateline_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <line x1="22" y1="36" x2="22" y2="74" stroke="#334155" stroke-width="2"/>
    <line x1="32" y1="41" x2="32" y2="79" stroke="#334155" stroke-width="2"/>
    <line x1="42" y1="47" x2="42" y2="85" stroke="#334155" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
    <line x1="58" y1="47" x2="58" y2="85" stroke="#1e293b" stroke-width="2"/>
    <line x1="68" y1="41" x2="68" y2="79" stroke="#1e293b" stroke-width="2"/>
    <line x1="78" y1="36" x2="78" y2="74" stroke="#1e293b" stroke-width="2"/>
  </svg>`,

  "bronze_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#b45309"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#92400e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#78350f"/>
  </svg>`,

  "tetsu_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
  </svg>`,

  "monsterball_no_kabe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#991b1b" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ef4444"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#dc2626"/>
    <path d="M 15,52 L 50,70 L 50,88 L 15,70 Z" fill="#f8fafc"/>
    <line x1="15" y1="52" x2="50" y2="70" stroke="#0f172a" stroke-width="3"/>
    <circle cx="32.5" cy="61" r="5" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
    <circle cx="32.5" cy="61" r="2" fill="#e2e8f0"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#b91c1c"/>
    <path d="M 50,70 L 85,52 L 85,70 L 50,88 Z" fill="#e2e8f0"/>
    <line x1="50" y1="70" x2="85" y2="52" stroke="#0f172a" stroke-width="3"/>
    <circle cx="67.5" cy="61" r="5" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
    <circle cx="67.5" cy="61" r="2" fill="#cbd5e1"/>
  </svg>`,

  "light_antique_kabe_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#ca8a04" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <line x1="15" y1="42" x2="50" y2="60" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <line x1="50" y1="60" x2="85" y2="42" stroke="#a16207" stroke-width="2"/>
  </svg>`,

  "light_antique_kabe_naka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#ca8a04" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <rect x="22" y="44" width="20" height="30" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <rect x="58" y="44" width="20" height="30" fill="#fef08a" stroke="#a16207" stroke-width="1.5"/>
  </svg>`,

  "light_antique_kabe_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#ca8a04" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <line x1="15" y1="62" x2="50" y2="80" stroke="#ca8a04" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <line x1="50" y1="80" x2="85" y2="62" stroke="#a16207" stroke-width="3"/>
  </svg>`,

  "ki_no_hashira_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <polygon points="15,33 50,51 50,60 15,42" fill="#92400e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#92400e"/>
    <polygon points="50,51 85,33 85,42 50,60" fill="#78350f"/>
  </svg>`,

  "ki_no_hashira_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#b45309"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#92400e"/>
    <line x1="32" y1="41" x2="32" y2="79" stroke="#78350f" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#78350f"/>
    <line x1="68" y1="41" x2="68" y2="79" stroke="#451a03" stroke-width="2"/>
  </svg>`,

  "ki_no_hashira_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#b45309"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#92400e"/>
    <polygon points="15,61 50,79 50,88 15,70" fill="#78350f"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#78350f"/>
    <polygon points="50,79 85,61 85,70 50,88" fill="#451a03"/>
  </svg>`,

  "pop_kabe_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#db2777" stroke="#9d174d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f472b6"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ec4899"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#db2777"/>
  </svg>`,

  "pop_kabe_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#db2777" stroke="#9d174d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f472b6"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ec4899"/>
    <circle cx="32" cy="60" r="5" fill="#fef08a"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#db2777"/>
    <circle cx="68" cy="60" r="5" fill="#fef08a"/>
  </svg>`,

  "pop_kabe_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#db2777" stroke="#9d174d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f472b6"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ec4899"/>
    <line x1="15" y1="62" x2="50" y2="80" stroke="#be185d" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#db2777"/>
    <line x1="50" y1="80" x2="85" y2="62" stroke="#9d174d" stroke-width="3"/>
  </svg>`,

  "pokecen_kabe_fuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#b91c1c" stroke="#991b1b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ef4444"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#dc2626"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#b91c1c"/>
  </svg>`,

  "pokecen_kabe_ue.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <line x1="15" y1="42" x2="50" y2="60" stroke="#ef4444" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
    <line x1="50" y1="60" x2="85" y2="42" stroke="#dc2626" stroke-width="3"/>
  </svg>`,

  "pokecen_kabe_mannaka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
  </svg>`,

  "pokecen_kabe_shita.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <line x1="15" y1="62" x2="50" y2="80" stroke="#3b82f6" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
    <line x1="50" y1="80" x2="85" y2="62" stroke="#2563eb" stroke-width="3"/>
  </svg>`,

  // --- 床系 ---
  "ki_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <line x1="28" y1="23" x2="63" y2="41" stroke="#92400e" stroke-width="1.5"/>
    <line x1="38" y1="41" x2="73" y2="23" stroke="#92400e" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#92400e"/>
  </svg>`,

  "naname_ki_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#b45309"/>
    <line x1="20" y1="30" x2="60" y2="50" stroke="#78350f" stroke-width="2"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#92400e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#78350f"/>
  </svg>`,

  "tateyoko_ki_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <line x1="32" y1="24" x2="68" y2="42" stroke="#92400e" stroke-width="1.5"/>
    <line x1="32" y1="42" x2="68" y2="24" stroke="#92400e" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#92400e"/>
  </svg>`,

  "flooring_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#a16207" stroke="#713f12" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <line x1="25" y1="25" x2="60" y2="43" stroke="#ca8a04" stroke-width="1.5"/>
    <line x1="40" y1="41" x2="75" y2="23" stroke="#ca8a04" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
  </svg>`,

  "modern_na_carpet.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#475569"/>
    <polygon points="50,22 75,34 50,45 25,34" fill="#0284c7"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#334155"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e293b"/>
  </svg>`,

  "tile_carpet.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <line x1="50" y1="15" x2="50" y2="51" stroke="#475569" stroke-width="1.5"/>
    <line x1="15" y1="33" x2="85" y2="33" stroke="#475569" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
  </svg>`,

  "wata_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <circle cx="35" cy="30" r="6" fill="#f1f5f9"/>
    <circle cx="60" cy="35" r="7" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
  </svg>`,

  "fukafuka_juutan.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#991b1b" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ef4444"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#dc2626"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#b91c1c"/>
  </svg>`,

  "tatami.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#3f6212" stroke="#1a2e05" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#bef264"/>
    <line x1="15" y1="33" x2="85" y2="33" stroke="#15803d" stroke-width="3"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#a3e635"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#65a30d"/>
  </svg>`,

  "felt_mat.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#047857" stroke="#064e3b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#34d399"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#10b981"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#059669"/>
  </svg>`,

  "ki_no_fukafuka_hashira.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#78350f" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ca8a04"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#a16207"/>
  </svg>`,

  "dairiseki.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <path d="M 25,28 Q 45,35 75,25" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <path d="M 20,45 Q 35,65 45,55" stroke="#cbd5e1" stroke-width="1.5" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
    <path d="M 55,55 Q 70,45 80,65" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
  </svg>`,

  "dairiseki_yuka_dark.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#334155"/>
    <path d="M 25,28 Q 45,35 75,25" stroke="#64748b" stroke-width="1.5" fill="none"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#1e293b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0f172a"/>
  </svg>`,

  "dairiseki_yuka_light.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <path d="M 25,28 Q 45,35 75,25" stroke="#e2e8f0" stroke-width="1.5" fill="none"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f1f5f9"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
  </svg>`,

  "furubitai_ishiyuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#52525b" stroke="#3f3f46" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#a1a1aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#71717a"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#52525b"/>
  </svg>`,

  "rokkakukei_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <polygon points="50,22 68,28 68,38 50,44 32,38 32,28" fill="#0284c7"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
  </svg>`,

  "teppan_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <line x1="28" y1="24" x2="40" y2="30" stroke="#334155" stroke-width="1.5"/>
    <line x1="60" y1="36" x2="72" y2="42" stroke="#334155" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
  </svg>`,

  "tetsu_no_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#64748b"/>
    <rect x="35" y="25" width="30" height="15" fill="#94a3b8" stroke="#334155" stroke-width="1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#475569"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#334155"/>
  </svg>`,

  "neon_na_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#09090b" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#18181b"/>
    <polygon points="50,22 75,34 50,45 25,34" fill="#06b6d4" stroke="#22d3ee" stroke-width="2"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#09090b"/>
    <line x1="15" y1="42" x2="50" y2="60" stroke="#06b6d4" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#000000"/>
    <line x1="50" y1="60" x2="85" y2="42" stroke="#06b6d4" stroke-width="2"/>
  </svg>`,

  "mosaic_tile.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <polygon points="50,15 67,24 50,33 33,24" fill="#fbbf24"/>
    <polygon points="67,24 85,33 67,42 50,33" fill="#ec4899"/>
    <polygon points="50,33 67,42 50,51 33,42" fill="#10b981"/>
    <polygon points="33,24 50,33 33,42 15,33" fill="#818cf8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
  </svg>`,

  "renga_no_yuka.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7c2d12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ea580c"/>
    <line x1="32" y1="24" x2="68" y2="42" stroke="#7c2d12" stroke-width="1.5"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#c2410c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#9a3412"/>
  </svg>`,

  "hakusen_no_michi_yoko.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#334155"/>
    <polygon points="35,23 65,39 50,47 20,31" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#1e293b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0f172a"/>
  </svg>`,

  "hakusen_no_michi_tate.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#334155"/>
    <polygon points="45,17 55,22 55,47 45,42" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#1e293b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0f172a"/>
  </svg>`,

  "tsumiagewara.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#a16207" stroke="#713f12" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#eab308"/>
    <line x1="15" y1="45" x2="50" y2="63" stroke="#ca8a04" stroke-width="2"/>
    <line x1="15" y1="60" x2="50" y2="78" stroke="#ca8a04" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ca8a04"/>
    <line x1="50" y1="63" x2="85" y2="45" stroke="#a16207" stroke-width="2"/>
    <line x1="50" y1="78" x2="85" y2="60" stroke="#a16207" stroke-width="2"/>
  </svg>`,

  "teppan.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
  </svg>`,

  "block_light.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#eab308" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <circle cx="50" cy="50" r="16" fill="#ffffff" opacity="0.4"/>
  </svg>`,

  "teibou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#475569" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#94a3b8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#64748b"/>
  </svg>`,

  // --- 模様・装飾系 ---
  "mizutama_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <circle cx="35" cy="28" r="3.5" fill="#ffffff"/>
    <circle cx="65" cy="38" r="3.5" fill="#ffffff"/>
    <circle cx="50" cy="33" r="2.5" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <circle cx="28" cy="52" r="3.5" fill="#ffffff"/>
    <circle cx="42" cy="68" r="3.5" fill="#ffffff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
    <circle cx="62" cy="68" r="3.5" fill="#ffffff"/>
    <circle cx="76" cy="52" r="3.5" fill="#ffffff"/>
  </svg>`,

  "tate_stripe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#15803d" stroke="#166534" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#4ade80"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#22c55e"/>
    <line x1="22" y1="36" x2="22" y2="74" stroke="#ffffff" stroke-width="3"/>
    <line x1="38" y1="45" x2="38" y2="83" stroke="#ffffff" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#16a34a"/>
    <line x1="62" y1="45" x2="62" y2="83" stroke="#ffffff" stroke-width="3"/>
    <line x1="78" y1="36" x2="78" y2="74" stroke="#ffffff" stroke-width="3"/>
  </svg>`,

  "yoko_stripe.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#15803d" stroke="#166534" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#4ade80"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#22c55e"/>
    <line x1="15" y1="48" x2="50" y2="66" stroke="#ffffff" stroke-width="3"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#16a34a"/>
    <line x1="50" y1="66" x2="85" y2="48" stroke="#ffffff" stroke-width="3"/>
  </svg>`,

  "tartan_check.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#991b1b" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#dc2626"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b91c1c"/>
    <line x1="26" y1="39" x2="26" y2="76" stroke="#15803d" stroke-width="3"/>
    <line x1="15" y1="52" x2="50" y2="70" stroke="#15803d" stroke-width="3"/>
    <line x1="38" y1="45" x2="38" y2="82" stroke="#facc15" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#991b1b"/>
    <line x1="74" y1="39" x2="74" y2="76" stroke="#15803d" stroke-width="3"/>
    <line x1="50" y1="70" x2="85" y2="52" stroke="#15803d" stroke-width="3"/>
    <line x1="62" y1="45" x2="62" y2="82" stroke="#facc15" stroke-width="1.5"/>
  </svg>`,

  "ball_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#38bdf8"/>
    <circle cx="50" cy="33" r="6" fill="#ef4444"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#0284c7"/>
    <circle cx="32.5" cy="60" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0369a1"/>
    <circle cx="67.5" cy="60" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`,

  "chidorigoshi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#f8fafc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#334155"/>
    <polygon points="20,45 35,53 30,62 18,55" fill="#f8fafc"/>
    <polygon points="35,63 50,71 45,80 33,73" fill="#f8fafc"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e293b"/>
    <polygon points="55,53 70,45 72,55 60,62" fill="#f8fafc"/>
    <polygon points="70,71 85,63 87,73 75,80" fill="#f8fafc"/>
  </svg>`,

  "fuyu_no_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0369a1" stroke="#075985" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#7dd3fc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#38bdf8"/>
    <!-- Snowflake on left face -->
    <line x1="32.5" y1="48" x2="32.5" y2="72" stroke="#ffffff" stroke-width="2"/>
    <line x1="22" y1="54" x2="43" y2="66" stroke="#ffffff" stroke-width="2"/>
    <line x1="22" y1="66" x2="43" y2="54" stroke="#ffffff" stroke-width="2"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0284c7"/>
    <!-- Snowflake on right face -->
    <line x1="67.5" y1="48" x2="67.5" y2="72" stroke="#ffffff" stroke-width="2"/>
    <line x1="57" y1="54" x2="78" y2="66" stroke="#ffffff" stroke-width="2"/>
    <line x1="57" y1="66" x2="78" y2="54" stroke="#ffffff" stroke-width="2"/>
  </svg>`,

  "happa_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#15803d" stroke="#166534" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#86efac"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#4ade80"/>
    <path d="M 22,65 Q 35,45 42,60 Q 32,70 22,65 Z" fill="#166534"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#22c55e"/>
    <path d="M 58,60 Q 65,45 78,65 Q 68,70 58,60 Z" fill="#14532d"/>
  </svg>`,

  "hana_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#db2777" stroke="#9d174d" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fbcfe8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f472b6"/>
    <circle cx="32.5" cy="60" r="4" fill="#fde047"/>
    <circle cx="32.5" cy="53" r="3" fill="#ffffff"/>
    <circle cx="32.5" cy="67" r="3" fill="#ffffff"/>
    <circle cx="26" cy="60" r="3" fill="#ffffff"/>
    <circle cx="39" cy="60" r="3" fill="#ffffff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#ec4899"/>
    <circle cx="67.5" cy="60" r="4" fill="#fde047"/>
    <circle cx="67.5" cy="53" r="3" fill="#ffffff"/>
    <circle cx="67.5" cy="67" r="3" fill="#ffffff"/>
    <circle cx="61" cy="60" r="3" fill="#ffffff"/>
    <circle cx="74" cy="60" r="3" fill="#ffffff"/>
  </svg>`,

  "hoshi_no_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#ca8a04" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="32.5,50 35,56 41,57 37,61 38,67 32.5,64 27,67 28,61 24,57 30,56" fill="#ffffff"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <polygon points="67.5,50 70,56 76,57 72,61 73,67 67.5,64 62,67 63,61 59,57 65,56" fill="#ffffff"/>
  </svg>`,

  // --- 地形・自然・岩・鉱石系 ---
  "tenkuu_no_shibafu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#065f46" stroke="#064e3b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#6ee7b7"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#a7f3d0"/>
    <path d="M 15,33 Q 25,44 35,39 Q 45,46 50,42 L 50,51 L 15,33 Z" fill="#34d399"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#6ee7b7"/>
    <path d="M 50,42 Q 60,46 70,39 Q 80,44 85,33 L 85,42 L 50,51 Z" fill="#059669"/>
  </svg>`,

  "futsuu_no_tsuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#a16207"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#854d0e"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#713f12"/>
  </svg>`,

  "masshiro_na_tsuchi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#ffffff"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#f8fafc"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#e2e8f0"/>
  </svg>`,

  "futsuu_no_suna.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#a16207" stroke="#713f12" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
  </svg>`,

  "tsubugakeiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fed7aa"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ea580c"/>
    <circle cx="25" cy="50" r="2.5" fill="#7c2d12"/>
    <circle cx="40" cy="65" r="3" fill="#7c2d12"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#c2410c"/>
    <circle cx="65" cy="55" r="2.5" fill="#451a03"/>
    <circle cx="75" cy="70" r="3" fill="#451a03"/>
  </svg>`,

  "magmaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#450a0a" stroke="#260404" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#7f1d1d"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#450a0a"/>
    <path d="M 15,48 Q 30,55 50,52" stroke="#ea580c" stroke-width="3" fill="none"/>
    <path d="M 22,65 Q 35,70 48,65" stroke="#f97316" stroke-width="2.5" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#260404"/>
    <path d="M 50,52 Q 68,46 85,55" stroke="#ea580c" stroke-width="3" fill="none"/>
    <path d="M 52,68 Q 68,62 85,68" stroke="#f97316" stroke-width="2.5" fill="none"/>
  </svg>`,

  "doukutsu_no_iwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#475569"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#334155"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#1e293b"/>
  </svg>`,

  "doukouseki_pasapasa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d97706"/>
    <polygon points="40,25 48,22 55,27 47,30" fill="#ea580c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#b45309"/>
    <polygon points="25,50 35,46 42,54 32,58" fill="#ea580c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#78350f"/>
    <polygon points="60,54 70,48 76,56 66,62" fill="#c2410c"/>
  </svg>`,

  "doukouseki_donyori.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#1e293b" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#64748b"/>
    <polygon points="40,25 48,22 55,27 47,30" fill="#ea580c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#475569"/>
    <polygon points="25,50 35,46 42,54 32,58" fill="#ea580c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#334155"/>
    <polygon points="60,54 70,48 76,56 66,62" fill="#c2410c"/>
  </svg>`,

  "doukouseki_gotsugotsu.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#52525b" stroke="#3f3f46" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#71717a"/>
    <polygon points="40,25 48,22 55,27 47,30" fill="#ea580c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#52525b"/>
    <polygon points="25,50 35,46 42,54 32,58" fill="#ea580c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#3f3f46"/>
    <polygon points="60,54 70,48 76,56 66,62" fill="#c2410c"/>
  </svg>`,

  "doukouseki_kirakira.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0284c7" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#7dd3fc"/>
    <polygon points="40,25 48,22 55,27 47,30" fill="#ea580c"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#38bdf8"/>
    <polygon points="25,50 35,46 42,54 32,58" fill="#ea580c"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0284c7"/>
    <polygon points="60,54 70,48 76,56 66,62" fill="#c2410c"/>
  </svg>`,

  "tekkouseki.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#64748b"/>
    <polygon points="38,24 46,20 54,26 46,30" fill="#cbd5e1"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#475569"/>
    <polygon points="22,48 32,44 40,52 30,56" fill="#cbd5e1"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#334155"/>
    <polygon points="60,54 70,48 78,56 68,62" fill="#94a3b8"/>
  </svg>`,

  "pokemetal_kouseki.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#0f172a" stroke="#020617" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#334155"/>
    <polygon points="38,24 46,20 54,26 46,30" fill="#ec4899"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#1e293b"/>
    <polygon points="22,48 32,44 40,52 30,56" fill="#38bdf8"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#0f172a"/>
    <polygon points="60,54 70,48 78,56 68,62" fill="#facc15"/>
  </svg>`,

  "hikari_ishi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#ca8a04" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fef08a"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#eab308"/>
    <circle cx="50" cy="50" r="18" fill="#ffffff" opacity="0.5"/>
  </svg>`,

  "nazo_no_ishi.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#581c87" stroke="#3b0764" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#c084fc"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#a855f7"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#7e22ce"/>
    <circle cx="50" cy="50" r="12" fill="#e9d5ff" opacity="0.4"/>
  </svg>`,

  "hibiware_sunaiwa.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#713f12" stroke="#451a03" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#fde047"/>
    <path d="M 30,25 L 45,35 L 55,30 L 70,40" stroke="#713f12" stroke-width="2" fill="none"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#ca8a04"/>
    <path d="M 25,45 L 35,58 L 28,68 L 42,75" stroke="#713f12" stroke-width="2" fill="none"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#a16207"/>
    <path d="M 60,52 L 72,60 L 65,72 L 78,80" stroke="#451a03" stroke-width="2" fill="none"/>
  </svg>`,

  "nendo.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#64748b" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#94a3b8"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#64748b"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#475569"/>
  </svg>`,

  "kinkouseki.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#334155" stroke="#1e293b" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#64748b"/>
    <polygon points="38,24 46,20 54,26 46,30" fill="#facc15"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#475569"/>
    <polygon points="22,48 32,44 40,52 30,56" fill="#fde047"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#334155"/>
    <polygon points="60,54 70,48 78,56 68,62" fill="#eab308"/>
  </svg>`,

  "metamon_darake_moyou.svg": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,12 88,32 88,72 50,92 12,72 12,32" fill="#7e22ce" stroke="#581c87" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="50,15 85,33 50,51 15,33" fill="#d8b4fe"/>
    <!-- Dittos on top face -->
    <circle cx="50" cy="33" r="6" fill="#c084fc"/>
    <circle cx="48" cy="32" r="0.8" fill="#000"/>
    <circle cx="52" cy="32" r="0.8" fill="#000"/>
    <polygon points="15,33 50,51 50,88 15,70" fill="#a855f7"/>
    <!-- Dittos on left face -->
    <path d="M 24,55 Q 26,48 34,49 Q 42,50 40,58 Q 38,65 30,64 Q 22,63 24,55 Z" fill="#c084fc"/>
    <circle cx="29" cy="54" r="1" fill="#000"/>
    <circle cx="35" cy="55" r="1" fill="#000"/>
    <polygon points="50,51 85,33 85,70 50,88" fill="#9333ea"/>
    <!-- Dittos on right face -->
    <path d="M 58,55 Q 60,48 68,49 Q 76,50 74,58 Q 72,65 64,64 Q 56,63 58,55 Z" fill="#c084fc"/>
    <circle cx="63" cy="54" r="1" fill="#000"/>
    <circle cx="69" cy="55" r="1" fill="#000"/>
  </svg>`,
};

for (const [filename, svg] of Object.entries(batch3Svgs)) {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, svg.trim());
}

console.log(`Generated ${Object.keys(batch3Svgs).length} Batch 3 block SVGs in ${outputDir}`);

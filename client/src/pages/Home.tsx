import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Boxes, Cuboid, FileImage, Gem, Layers3, MapPinned, ScanSearch, Sparkles } from "lucide-react";
import { Link } from "wouter";

const steps = [
  { no: "01", icon: FileImage, title: "資料をアップロード", copy: "建築資料として適切な画像を1枚選びます。" },
  { no: "02", icon: ScanSearch, title: "AIが構造を解析", copy: "立体構造・色・部位・背景を採点し、レイヤーを設計します。" },
  { no: "03", icon: Cuboid, title: "ブロックを選定", copy: "部位ごとの候補から、使いたいブロックをあなたが決めます。" },
  { no: "04", icon: Gem, title: "建築をはじめる", copy: "設計図と素材調達リストをPNGで持ち出せます。" },
];

export default function Home() {
  return <div className="min-h-screen overflow-hidden bg-[#090d20] text-slate-100"><AppHeader />
    <main>
      <section className="hero-grid relative isolate overflow-hidden border-b border-cyan-300/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(41,244,255,.14),transparent_24%),radial-gradient(circle_at_58%_65%,rgba(255,61,186,.12),transparent_25%)]" />
        <div className="pixel-sprite sprite-a" /><div className="pixel-sprite sprite-b" /><div className="pixel-sprite sprite-c" />
        <div className="relative mx-auto grid min-h-[620px] max-w-[1440px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl"><Badge className="border-lime-300/30 bg-lime-300/10 px-3 py-1.5 text-lime-200"><Sparkles className="mr-2 h-3.5 w-3.5" /> IMAGE TO BUILDING BLUEPRINT</Badge><h1 className="mt-7 font-pixel text-[26px] leading-[1.85] text-[#f7f2d0] sm:text-[34px] lg:text-[42px]">画像から、<br /><span className="text-lime-300">建築できる</span>設計図へ。</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">ぽこあModellerは、あなたの建築資料を解析し、ブロック候補、レイヤー設計図、必要素材、採掘場所までを一続きに導く建築支援サービスです。</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/workspace"><Button size="lg" className="pixel-button h-12 bg-lime-300 px-6 text-[#090d20] hover:bg-lime-200">設計をはじめる <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/catalog"><Button size="lg" variant="outline" className="h-12 border-cyan-300/40 bg-cyan-300/5 px-6 text-cyan-100 hover:bg-cyan-300/15 hover:text-cyan-50">ブロック図鑑を見る</Button></Link></div><p className="mt-5 text-xs text-slate-500">AIは建築を自動完成しません。最終的なブロック選択はあなたが行います。</p></div>
          <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -inset-5 bg-fuchsia-400/10 blur-3xl" /><div className="relative border-2 border-cyan-300/70 bg-[#101a3d] p-3 shadow-[8px_8px_0_#ff3dba]"><div className="border border-white/15 bg-[#0a1027] p-5"><div className="mb-5 flex items-center justify-between text-[10px] font-pixel text-cyan-100"><span>BUILD_VISION</span><span className="text-lime-300">ONLINE</span></div><div className="relative grid h-[290px] place-items-center overflow-hidden border border-cyan-300/20 bg-[linear-gradient(rgba(41,244,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(41,244,255,.08)_1px,transparent_1px)] bg-[size:22px_22px]"><div className="model-pixel model-head" /><div className="model-pixel model-body" /><div className="model-pixel model-arm left" /><div className="model-pixel model-arm right" /><div className="model-pixel model-leg left" /><div className="model-pixel model-leg right" /><div className="absolute bottom-3 left-3 text-[9px] font-pixel text-cyan-200">SCAN READY</div></div><div className="mt-4 grid grid-cols-3 gap-2"><MiniStat label="立体構造" value="95" tone="lime" /><MiniStat label="色判定" value="91" tone="cyan" /><MiniStat label="背景" value="88" tone="pink" /></div></div></div></div>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="text-xs font-bold tracking-[0.18em] text-fuchsia-200">WORKFLOW</p><h2 className="mt-3 font-pixel text-lg leading-relaxed text-[#f7f2d0]">建築までの4ステップ</h2></div><Layers3 className="h-8 w-8 text-cyan-200" /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{steps.map(step => <article key={step.no} className="block-card relative p-5"><span className="font-pixel text-[10px] text-fuchsia-300">{step.no}</span><step.icon className="mt-6 h-7 w-7 text-lime-300" /><h3 className="mt-5 text-base font-bold text-slate-100">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.copy}</p></article>)}</div></section>
      <section className="border-y border-white/10 bg-[#0d1430]"><div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8"><div><p className="text-xs font-bold tracking-[0.18em] text-yellow-200">GOOD REFERENCE IMAGE</p><h2 className="mt-3 font-pixel text-lg leading-relaxed text-[#f7f2d0]">建築資料として<br />適した画像とは？</h2><p className="mt-5 text-sm leading-7 text-slate-400">「綺麗」よりも、AIがパーツと立体構造を読み取れることを大切にします。アップロード後に適性スコアと改善ポイントを表示します。</p></div><div className="grid gap-3 sm:grid-cols-2">{[["全体が写っている", "対象の全身と主要パーツが画面内に収まっている"], ["高解像度", "ブロックに置き換える色と輪郭を判別できる"], ["3/4ビュー", "奥行きと立体構造がわかる斜めの角度が理想"], ["隠れが少ない", "強いエフェクトや複雑すぎる背景を避ける"]].map(([title, copy]) => <div key={title} className="border border-white/10 bg-[#090d20] p-4"><MapPinned className="h-4 w-4 text-yellow-200" /><h3 className="mt-3 text-sm font-bold text-slate-100">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{copy}</p></div>)}</div></div></section>
    </main>
  </div>;
}
function MiniStat({ label, value, tone }: { label: string; value: string; tone: "lime" | "cyan" | "pink" }) { const colors = { lime: "text-lime-300", cyan: "text-cyan-200", pink: "text-fuchsia-300" }; return <div className="border border-white/10 bg-white/5 p-2"><p className="text-[9px] text-slate-400">{label}</p><p className={`mt-1 font-pixel text-xs ${colors[tone]}`}>{value}</p></div>; }

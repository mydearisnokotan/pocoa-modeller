import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2, ImagePlus, Info, Layers3, Loader2, ScanSearch, Sparkles, UploadCloud } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const conditions = [
  ["全体が写っている", "対象の全身と主要なパーツが画面内に収まっている"],
  ["立体構造が分かる", "3/4ビューなど、奥行きが読める角度が理想"],
  ["隠れが少ない", "強いエフェクト、手前の遮蔽物、激しい動きは避ける"],
  ["高解像度", "輪郭と色の境目が確認できる画像を選ぶ"],
  ["背景が整理されている", "複雑な背景より、対象が際立つものを優先する"],
];

export default function Workspace() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("新しい建築プロジェクト");
  const [height, setHeight] = useState(100);
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const analyze = trpc.workspace.analyze.useMutation({
    onSuccess: ({ projectId }) => { toast.success("AI解析が完了しました"); setLocation(`/workspace/${projectId}`); },
    onError: error => toast.error(error.message || "画像を解析できませんでした"),
  });

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    setFileError("");
    if (!selected) return;
    if (!/^image\/(png|jpeg|webp)$/.test(selected.type)) { setFileError("PNG、JPEG、WebP形式の画像を選択してください。"); return; }
    if (selected.size > 5 * 1024 * 1024) { setFileError("画像サイズは5MB以下にしてください。"); return; }
    const reader = new FileReader();
    reader.onload = () => { setFile(selected); setDataUrl(String(reader.result)); };
    reader.readAsDataURL(selected);
  };

  if (loading) return <div className="min-h-screen bg-[#090d20]" />;
  if (!user) return <LoginPrompt />;

  return <div className="min-h-screen bg-[#090d20] text-slate-100"><AppHeader /><main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-8"><p className="text-xs font-bold tracking-[.18em] text-lime-200">NEW BUILDING PROJECT</p><h1 className="mt-3 font-pixel text-xl leading-relaxed text-[#f7f2d0]">建築資料を解析する</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">画像アップロードだけで、建築適性、部位、色、建築レイヤーを解析します。画像生成機能は使わず、あなたの参照資料をそのまま設計の起点にします。</p></div>
    <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
      <section className="pixel-panel p-5 sm:p-7"><div className="flex items-center gap-2 text-xs font-bold tracking-[.16em] text-cyan-200"><UploadCloud className="h-4 w-4" /> STEP 01 / UPLOAD</div><div className="mt-6 space-y-5"><div className="space-y-2"><Label>プロジェクト名</Label><Input value={title} onChange={event => setTitle(event.target.value)} className="border-white/15 bg-[#090d20] text-white" /></div><div className="space-y-2"><div className="flex items-center justify-between"><Label>建築の高さ</Label><span className="font-pixel text-xs text-lime-300">{height} blocks</span></div><input aria-label="建築の高さ" type="range" min="20" max="500" step="10" value={height} onChange={event => setHeight(Number(event.target.value))} className="h-2 w-full cursor-pointer accent-lime-300" /><div className="flex justify-between text-[10px] text-slate-500"><span>20</span><span>100</span><span>500</span></div></div>
        <div className="space-y-2"><Label>建築資料画像 <span className="text-slate-500">PNG / JPEG / WebP・5MBまで</span></Label><label className="group flex min-h-64 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-cyan-300/30 bg-[#090d20] p-5 text-center transition-colors hover:border-lime-300/70 hover:bg-lime-300/5">{dataUrl ? <img src={dataUrl} alt="アップロードした建築資料" className="max-h-56 max-w-full object-contain" /> : <><span className="grid h-14 w-14 place-items-center border border-cyan-300/30 bg-cyan-300/10 text-cyan-200"><ImagePlus className="h-7 w-7" /></span><p className="mt-4 text-sm font-bold text-slate-100">画像を選択</p><p className="mt-2 text-xs text-slate-500">クリックしてファイルをアップロード</p></>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} className="sr-only" /></label>{file && <p className="flex items-center gap-2 text-xs text-lime-200"><CheckCircle2 className="h-4 w-4" />{file.name}</p>}{fileError && <p className="flex items-center gap-2 text-xs text-fuchsia-200"><AlertCircle className="h-4 w-4" />{fileError}</p>}</div>
        <Button size="lg" disabled={!file || !title.trim() || analyze.isPending} onClick={() => file && analyze.mutate({ title: title.trim(), buildingHeight: height, fileName: file.name, imageDataUrl: dataUrl })} className="pixel-button h-12 w-full bg-lime-300 text-[#090d20] hover:bg-lime-200">{analyze.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />AIが建築資料を解析中…</> : <><ScanSearch className="mr-2 h-4 w-4" />建築適性を解析する</>}</Button>
        {analyze.isPending && <div className="space-y-2"><Progress value={68} className="h-2 bg-white/10 [&>div]:bg-cyan-300" /><p className="text-center text-xs text-slate-400">部位・色・立体構造を確認しています。画像により数十秒かかる場合があります。</p></div>}
      </div></section>
      <aside className="space-y-5"><section className="border border-yellow-300/30 bg-yellow-300/5 p-5"><div className="flex items-center gap-2 text-xs font-bold tracking-[.16em] text-yellow-100"><Info className="h-4 w-4" /> GOOD REFERENCE GUIDE</div><h2 className="mt-4 font-pixel text-sm leading-loose text-[#f7f2d0]">建築資料に適した画像</h2><div className="mt-5 space-y-3">{conditions.map(([heading, copy]) => <div key={heading} className="flex gap-3 border-b border-yellow-100/10 pb-3 last:border-b-0 last:pb-0"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" /><div><h3 className="text-sm font-bold text-slate-100">{heading}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p></div></div>)}</div></section><section className="border border-fuchsia-400/25 bg-fuchsia-400/5 p-5"><div className="flex items-center gap-2 text-xs font-bold tracking-[.16em] text-fuchsia-200"><Sparkles className="h-4 w-4" /> WHAT AI DOES</div><p className="mt-3 text-sm leading-7 text-slate-300">AIは、建築を自動完成しません。部位、色、レイヤー、候補ブロックを整理し、選択と最終判断はあなたが行います。</p><Badge className="mt-4 border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100">画像生成は使用しません</Badge></section></aside>
    </div>
  </main></div>;
}

function LoginPrompt() { return <div className="min-h-screen bg-[#090d20] text-slate-100"><AppHeader /><div className="px-4 py-16"><div className="pixel-panel mx-auto max-w-lg p-8 text-center"><Layers3 className="mx-auto h-9 w-9 text-cyan-200" /><h1 className="mt-5 font-pixel text-base leading-relaxed text-[#f7f2d0]">プロジェクトをはじめる</h1><p className="mt-4 text-sm leading-7 text-slate-300">画像と解析結果を安全に保存するため、ログインしてから開始してください。</p><Button onClick={() => startLogin()} className="pixel-button mt-6 bg-lime-300 text-[#090d20]">ログインして開始</Button></div></div></div>; }

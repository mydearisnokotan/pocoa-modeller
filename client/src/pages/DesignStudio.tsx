import AppHeader from "@/components/AppHeader";
import { Blueprint2D, type Blueprint2DData } from "@/components/Blueprint2D";
import { Blueprint3D, type Blueprint3DData } from "@/components/Blueprint3D";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { restoreSavedBlueprint, type BlueprintResult } from "@/lib/restoreBlueprint";
import { toPng } from "html-to-image";
import { Box, Check, CircleAlert, Download, Gem, Grid2X2, Layers3, Loader2, MapPin, PackageCheck, RefreshCw, Rotate3D, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";

type Candidate = { id: number; name: string; colorHex: string; colorName: string; category: string; description: string | null };
type Selection = { partId: string; partName: string; layer: string; selectedBlockId: number | null; candidateBlocks: Candidate[] };
export default function DesignStudio() {
  const [, params] = useRoute("/workspace/:id/design");
  const projectId = Number(params?.id ?? 0);
  const initialPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "3d" ? "3d" : "2d";
  const utils = trpc.useUtils();
  const project = trpc.projects.designData.useQuery({ id: projectId }, { enabled: projectId > 0 });
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [blueprint, setBlueprint] = useState<BlueprintResult | null>(null);
  const [exports, setExports] = useState<{ twoD: string; threeD: string } | null>(null);
  const twoDRef = useRef<HTMLDivElement>(null);
  const threeDRef = useRef<HTMLDivElement>(null);
  const generate = trpc.projects.generateDesign.useMutation({ onSuccess: data => { setBlueprint(data); setExports(null); toast.success("設計図と素材リストを更新しました"); utils.projects.get.invalidate({ id: projectId }); } });
  const savePngs = trpc.projects.savePngs.useMutation({ onSuccess: data => { setExports({ twoD: data.blueprint2dImageUrl, threeD: data.blueprint3dImageUrl }); toast.success("PNGをプロジェクトへ保存しました"); utils.projects.get.invalidate({ id: projectId }); } });
  const selections = (project.data?.selections ?? []) as Selection[];

  useEffect(() => {
    if (selections.length) setPicked(Object.fromEntries(selections.filter(item => item.selectedBlockId).map(item => [item.partId, item.selectedBlockId!])));
  }, [project.data?.id]);
  useEffect(() => {
    const previous = restoreSavedBlueprint(project.data?.blueprint2d, project.data?.blueprint3d);
    if (previous) setBlueprint(previous);
    if (project.data?.blueprint2dImageUrl && project.data?.blueprint3dImageUrl) {
      setExports({ twoD: project.data.blueprint2dImageUrl, threeD: project.data.blueprint3dImageUrl });
    }
  }, [project.data?.blueprint2d, project.data?.blueprint3d, project.data?.blueprint2dImageUrl, project.data?.blueprint3dImageUrl]);
  const allPicked = selections.length > 0 && selections.every(item => picked[item.partId]);
  const selectedBlockNames = useMemo(() => new Map(selections.flatMap(item => item.candidateBlocks).map(block => [block.id, block.name])), [selections]);
  const createBlueprint = () => generate.mutate({ projectId, selections: selections.map(item => ({ partId: item.partId, blockId: picked[item.partId] })).filter((item): item is { partId: string; blockId: number } => Boolean(item.blockId)) });
  const exportPngs = async () => {
    if (!twoDRef.current || !threeDRef.current) return;
    try {
      const options = { pixelRatio: 1, backgroundColor: "#090d20", cacheBust: true };
      const [blueprint2dDataUrl, blueprint3dDataUrl] = await Promise.all([toPng(twoDRef.current, options), toPng(threeDRef.current, options)]);
      savePngs.mutate({ projectId, blueprint2dDataUrl, blueprint3dDataUrl });
    } catch { toast.error("PNGを書き出せませんでした。もう一度お試しください。"); }
  };

  if (project.isLoading) return <div className="min-h-screen bg-[#090d20]" />;
  if (project.isError || !project.data) return <div className="min-h-screen bg-[#090d20] text-slate-100"><AppHeader /><div className="pixel-panel mx-auto mt-20 max-w-lg p-8 text-center"><CircleAlert className="mx-auto h-8 w-8 text-fuchsia-200" /><h1 className="mt-4 font-pixel text-sm leading-relaxed text-[#f7f2d0]">設計データを開けません</h1><p className="mt-3 text-sm text-slate-400">{project.error?.message ?? "プロジェクトが見つかりません。"}</p></div></div>;
  return <div className="min-h-screen bg-[#090d20] text-slate-100"><AppHeader /><main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-xs font-bold tracking-[.18em] text-lime-200">BLOCK SELECTION & BLUEPRINT</p><h1 className="mt-3 font-pixel text-lg leading-relaxed text-[#f7f2d0]">{project.data.title}</h1><p className="mt-3 text-sm text-slate-400">部位ごとに候補を選ぶと、高さ {project.data.buildingHeight} blocks 用の設計図を再生成します。</p></div><Link href={`/workspace/${projectId}`}><Button variant="outline" className="border-cyan-300/40 bg-cyan-300/5 text-cyan-100 hover:bg-cyan-300/15 hover:text-cyan-50">解析結果へ戻る</Button></Link></div>
    <section className="mt-7 grid gap-5 xl:grid-cols-[.88fr_1.12fr]"><div className="pixel-panel max-h-[700px] overflow-y-auto p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-pixel text-xs text-cyan-200"><Box className="h-4 w-4" />部位別ブロック候補</h2><Badge className="border-white/15 bg-white/5 text-slate-300">{Object.keys(picked).length}/{selections.length}</Badge></div><p className="mt-3 text-xs leading-5 text-slate-400">候補数は、AIが認識した部位の占有率と可視性に応じて変わります。最終選択はあなたが行います。</p><div className="mt-5 space-y-5">{selections.map(selection => <section key={selection.partId} className="border border-white/10 bg-[#0b122b] p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-bold text-slate-100">{selection.partName}</h3><p className="mt-1 text-[10px] text-slate-500">LAYER: {selection.layer}</p></div>{picked[selection.partId] && <Badge className="border-lime-300/30 bg-lime-300/10 text-lime-200"><Check className="mr-1 h-3 w-3" />選択済み</Badge>}</div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{selection.candidateBlocks.map(block => <button type="button" key={block.id} onClick={() => setPicked(current => ({ ...current, [selection.partId]: block.id }))} className={`relative border p-2 text-left transition-all ${picked[selection.partId] === block.id ? "border-lime-300 bg-lime-300/10 shadow-[3px_3px_0_#c8ff00]" : "border-white/10 bg-white/[.03] hover:border-cyan-300/60"}`}><span className="block h-8 w-full border border-white/20" style={{ background: block.colorHex }} /><p className="mt-2 truncate text-[11px] font-bold text-slate-100">{block.name}</p><p className="mt-1 text-[10px] text-slate-500">{block.category}</p></button>)}</div></section>)}</div><Button onClick={createBlueprint} disabled={!allPicked || generate.isPending} className="pixel-button mt-6 w-full bg-lime-300 text-[#090d20] hover:bg-lime-200">{generate.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />設計図を生成中</> : <><RefreshCw className="mr-2 h-4 w-4" />選択内容で設計図を再生成</>}</Button>{!allPicked && <p className="mt-3 text-center text-xs text-yellow-200">すべての部位でブロックを選択してください。</p>}</div>
      <div className="space-y-5">{blueprint ? <><Tabs defaultValue={initialPreview}><TabsList className="rounded-sm bg-[#111a36]"><TabsTrigger value="2d"><Grid2X2 className="mr-2 h-4 w-4" />2Dレイヤー図</TabsTrigger><TabsTrigger value="3d"><Rotate3D className="mr-2 h-4 w-4" />3Dプレビュー</TabsTrigger></TabsList><TabsContent value="2d" className="mt-4"><Blueprint2D blueprint={blueprint.blueprint2d} exportRef={twoDRef} /></TabsContent><TabsContent value="3d" className="mt-4"><Blueprint3D blueprint={blueprint.blueprint3d} exportRef={threeDRef} /></TabsContent></Tabs>
          <section className="pixel-panel p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-pixel text-[10px] text-yellow-200">MATERIALS REQUIRED</p><p className="mt-2 text-sm text-slate-300">合計 <span className="font-pixel text-lime-300">{blueprint.totalBlocks}</span> blocks</p></div><Button onClick={exportPngs} disabled={savePngs.isPending} className="pixel-button bg-cyan-300 text-[#090d20] hover:bg-cyan-200">{savePngs.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}2D・3DをPNG保存</Button></div>{exports && <div className="mt-4 flex flex-wrap gap-3"><a href={exports.twoD} download="pocoa-blueprint-2d.png"><Button variant="outline" className="border-cyan-300/40 text-cyan-100 hover:bg-cyan-300/10 hover:text-cyan-50"><Download className="mr-2 h-4 w-4" />2D PNGを開く</Button></a><a href={exports.threeD} download="pocoa-blueprint-3d.png"><Button variant="outline" className="border-fuchsia-300/40 text-fuchsia-100 hover:bg-fuchsia-300/10 hover:text-fuchsia-50"><Download className="mr-2 h-4 w-4" />3D PNGを開く</Button></a></div>}<div className="mt-5 grid gap-3 md:grid-cols-2">{blueprint.blockSummary.map(block => <div key={block.blockId} className="flex items-center justify-between border border-white/10 bg-[#090d20] p-3"><div className="flex min-w-0 items-center gap-3"><span className="h-7 w-7 shrink-0 border border-white/20" style={{ background: block.colorHex }} /><p className="truncate text-sm font-bold text-slate-100">{block.blockName}</p></div><span className="font-pixel text-[10px] text-lime-300">{block.count}</span></div>)}</div><div className="mt-5 space-y-3">{blueprint.materialSummary.map(material => <article key={material.materialId} className="border border-white/10 bg-[#090d20] p-4"><div className="flex flex-col gap-3 sm:flex-row"><div className="flex-1"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><div className="flex items-center gap-2"><Gem className="h-4 w-4 text-yellow-200" /><h3 className="text-sm font-bold text-slate-100">{material.name}</h3></div><p className="mt-2 text-xs leading-5 text-slate-400">{material.description ?? "素材の説明は未登録です。"}</p></div><span className="font-pixel text-sm text-lime-300">{material.count}</span></div><div className="mt-3 flex items-start gap-2 border-t border-white/10 pt-3"><MapPin className="mt-.5 h-4 w-4 shrink-0 text-cyan-200" /><div><p className="text-xs font-bold text-cyan-100">{material.locationName ?? "採掘場所未登録"}</p><p className="mt-1 text-xs leading-5 text-slate-500">{material.locationDescription ?? "管理画面から採掘場所を登録してください。"}</p></div></div></div>{material.locationImageUrl && <img src={material.locationImageUrl} alt={`${material.locationName ?? "採掘場所"}の画像`} className="h-24 w-full object-cover sm:w-36" />}</div></article>)}</div></section></> : <div className="grid min-h-[520px] place-items-center border border-dashed border-cyan-300/25 bg-[#111a36] p-8 text-center"><div><Layers3 className="mx-auto h-10 w-10 text-cyan-200" /><h2 className="mt-5 font-pixel text-sm leading-relaxed text-[#f7f2d0]">選択から設計図へ</h2><p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">左の候補からブロックを選び、「設計図を再生成」を押すと、2D・3Dと素材調達リストを表示します。</p></div></div>}</div>
    </section>
  </main></div>;
}

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ImagePlus, Loader2, Trash2, View } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ViewLabel = "front" | "back" | "left" | "right" | "top" | "other";
type Reference = { id: number; view: ViewLabel; imageUrl: string; originalName: string };
const labels: Record<ViewLabel, string> = { front: "正面", back: "背面", left: "左側面", right: "右側面", top: "上面", other: "任意視点" };

function readDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("画像を読み取れませんでした。"));
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("画像を読み取れませんでした。"));
    reader.readAsDataURL(file);
  });
}

function guessView(fileName: string): ViewLabel {
  const name = fileName.toLowerCase();
  if (/front|正面/.test(name)) return "front";
  if (/back|rear|背面/.test(name)) return "back";
  if (/left|左/.test(name)) return "left";
  if (/right|右/.test(name)) return "right";
  if (/top|上面/.test(name)) return "top";
  return "other";
}

export function ReferenceGallery({ projectId, sourceImageUrl, references, onUpdated }: { projectId: number; sourceImageUrl: string | null; references: Reference[]; onUpdated: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drafts, setDrafts] = useState<Array<{ file: File; view: ViewLabel }>>([]);
  const utils = trpc.useUtils();
  const refreshProjectData = async () => {
    await Promise.all([utils.projects.get.invalidate({ id: projectId }), utils.projects.designData.invalidate({ id: projectId })]);
    onUpdated();
  };
  const addReferences = trpc.projects.addReferences.useMutation({
    onSuccess: async () => { setDrafts([]); await refreshProjectData(); toast.success("追加画像を統合解析しました。候補ブロックを確認してください。"); },
    onError: error => toast.error(error.message),
  });
  const removeReference = trpc.projects.removeReference.useMutation({ onSuccess: async () => { await refreshProjectData(); toast.success("参照画像を除外して解析結果を更新しました。"); }, onError: error => toast.error(error.message) });
  const chooseFiles = (files: FileList | null) => {
    const selected = Array.from(files ?? []).slice(0, 5).filter(file => file.size <= 5 * 1024 * 1024);
    if (selected.length !== (files?.length ?? 0)) toast.error("PNGまたはJPEGの5MB以下の画像を最大5枚まで選択してください。");
    setDrafts(selected.map(file => ({ file, view: guessView(file.name) })));
  };
  const submit = async () => {
    if (!drafts.length) return;
    const references = await Promise.all(drafts.map(async draft => ({ fileName: draft.file.name, view: draft.view, imageDataUrl: await readDataUrl(draft.file) })));
    addReferences.mutate({ projectId, references });
  };
  const additionalReferences = references.filter(reference => reference.imageUrl !== sourceImageUrl);
  return <section className="pixel-panel p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-pixel text-[10px] text-cyan-200">MULTI-VIEW REFERENCES</p><h2 className="mt-2 text-sm font-bold text-slate-100">追加画像で形状を補強</h2><p className="mt-2 max-w-lg text-xs leading-5 text-slate-400">正面・側面・背面などを追加すると、保存済みの全視点を統合して部位配置と3Dの厚みを再解析します。初回画像を含め最大6枚、PNG/JPEG・5MB以下に対応します。</p></div><Button type="button" variant="outline" onClick={() => inputRef.current?.click()} className="border-cyan-300/40 text-cyan-100 hover:bg-cyan-300/10 hover:text-cyan-50"><ImagePlus className="mr-2 h-4 w-4" />画像を追加</Button><input ref={inputRef} onChange={event => chooseFiles(event.target.files)} className="hidden" type="file" multiple accept="image/png,image/jpeg" /></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{sourceImageUrl && <div className="overflow-hidden border border-lime-300/30 bg-[#090d20]"><img src={sourceImageUrl} alt="初回参照画像" className="aspect-square w-full object-cover" /><p className="p-2 text-[10px] font-bold text-lime-200">初回画像（正面・固定）</p></div>}{additionalReferences.map(reference => <div key={reference.id} className="group relative overflow-hidden border border-white/10 bg-[#090d20]"><img src={reference.imageUrl} alt={`${labels[reference.view]}の参照画像`} className="aspect-square w-full object-cover" /><div className="flex items-center justify-between gap-2 p-2"><p className="truncate text-[10px] font-bold text-slate-200">{labels[reference.view]}</p><button type="button" aria-label="参照画像を削除" onClick={() => removeReference.mutate({ projectId, referenceId: reference.id })} className="text-slate-500 hover:text-fuchsia-200"><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}</div>{drafts.length > 0 && <div className="mt-4 border border-cyan-300/25 bg-cyan-300/5 p-3"><div className="space-y-2">{drafts.map((draft, index) => <div key={`${draft.file.name}-${index}`} className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="truncate text-slate-200">{draft.file.name}</span><select aria-label={`${draft.file.name}の視点`} value={draft.view} onChange={event => setDrafts(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, view: event.target.value as ViewLabel } : item))} className="border border-white/20 bg-[#090d20] px-2 py-1 text-xs text-slate-100">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>)}</div><Button onClick={submit} disabled={addReferences.isPending} className="pixel-button mt-4 w-full bg-lime-300 text-[#090d20] hover:bg-lime-200">{addReferences.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />統合解析中</> : <><View className="mr-2 h-4 w-4" />この視点を統合解析</>}</Button></div>}</section>;
}

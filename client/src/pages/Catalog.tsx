import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Blocks, CircleAlert, Filter, Inbox, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const colorOptions = ["すべて", "ホワイト", "グレー", "ライム", "シアン", "マゼンタ", "イエロー", "ネイビー"];

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("すべて");
  const [color, setColor] = useState("すべて");
  const filters = trpc.catalog.filters.useQuery();
  const params = useMemo(() => ({
    query: query || undefined,
    category: category === "すべて" ? undefined : category,
    color: color === "すべて" ? undefined : color,
    limit: 120,
  }), [query, category, color]);
  const catalog = trpc.catalog.list.useQuery(params);

  return (
    <div className="min-h-screen bg-[#090d20] text-slate-100">
      <AppHeader />
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="pixel-panel relative overflow-hidden p-6 sm:p-8">
          <div className="pixel-dot left-6 top-6" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-cyan-200"><Sparkles className="h-4 w-4" /> BLOCK LIBRARY</div>
              <h1 className="font-pixel text-xl leading-relaxed text-[#f7f2d0] sm:text-2xl">ブロック図鑑</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">名称、色、カテゴリから設計に使うブロックを探索できます。AI解析後は、ここにある候補から部位ごとの素材を選びます。</p>
            </div>
            <Badge className="w-fit border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-cyan-100"><Blocks className="mr-2 h-4 w-4" />200+ ブロックカタログ</Badge>
          </div>
        </section>

        <section className="mt-6 grid gap-3 rounded-sm border border-white/10 bg-[#111a36] p-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="ブロック名、色、カテゴリで検索" className="border-white/10 bg-[#090d20] pl-10 text-white placeholder:text-slate-500" /></div>
          <Select value={category} onValueChange={setCategory} disabled={filters.isError}><SelectTrigger className="border-white/10 bg-[#090d20] text-slate-100"><SelectValue placeholder="カテゴリ" /></SelectTrigger><SelectContent>{["すべて", ...(filters.data?.categories ?? [])].map(option => <SelectItem value={option} key={option}>{option}</SelectItem>)}</SelectContent></Select>
          <Select value={color} onValueChange={setColor}><SelectTrigger className="border-white/10 bg-[#090d20] text-slate-100"><SelectValue placeholder="色" /></SelectTrigger><SelectContent>{colorOptions.map(option => <SelectItem value={option} key={option}>{option}</SelectItem>)}</SelectContent></Select>
        </section>
        {filters.isError && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-sm text-yellow-100"><span>カテゴリ一覧を取得できませんでした。名前・色での検索は続けて利用できます。</span><Button onClick={() => filters.refetch()} variant="outline" size="sm" className="border-yellow-300/50 bg-transparent text-yellow-100 hover:bg-yellow-300/15 hover:text-yellow-50">カテゴリを再試行</Button></div>}

        <div className="mt-6 flex items-center justify-between"><p className="text-sm text-slate-400"><Filter className="mr-1 inline h-4 w-4" />{catalog.isLoading ? "読み込み中" : `${catalog.data?.length ?? 0}件のブロック`}</p><Button variant="ghost" onClick={() => { setQuery(""); setCategory("すべて"); setColor("すべて"); }} className="text-xs text-cyan-200 hover:bg-cyan-300/10 hover:text-cyan-100">フィルターをリセット</Button></div>

        {catalog.isError ? <section className="mt-4 border border-fuchsia-400/30 bg-fuchsia-400/10 p-7 text-center"><CircleAlert className="mx-auto h-7 w-7 text-fuchsia-200" /><h2 className="mt-3 font-bold text-fuchsia-100">カタログを取得できませんでした</h2><p className="mt-2 text-sm text-slate-300">通信状態を確認して、もう一度お試しください。</p><Button onClick={() => catalog.refetch()} className="mt-4 bg-fuchsia-300 text-[#090d20] hover:bg-fuchsia-200">再試行</Button></section> : <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {catalog.isLoading && Array.from({ length: 15 }, (_, index) => <Skeleton key={index} className="h-44 rounded-sm bg-white/5" />)}
          {catalog.data?.map(block => <article key={block.id} className="block-card group relative overflow-hidden p-3">
            <div className="mb-4 grid aspect-square place-items-center overflow-hidden border border-white/10 bg-[#0b122b]" style={{ backgroundImage: `linear-gradient(45deg, ${block.colorHex}20 25%, transparent 25%), linear-gradient(-45deg, ${block.colorHex}20 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${block.colorHex}20 75%), linear-gradient(-45deg, transparent 75%, ${block.colorHex}20 75%)`, backgroundSize: "16px 16px", backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0" }}>
              {block.imageUrl ? <img src={block.imageUrl} alt={`${block.name}のブロック画像`} className="h-full w-full object-cover" /> : <span className="h-16 w-16 border-4 border-[#090d20] shadow-[4px_4px_0_#ffffff30]" style={{ background: block.colorHex }} />}
            </div>
            <Badge variant="outline" className="border-white/15 bg-black/10 text-[10px] text-slate-300">{block.category}</Badge>
            <h2 className="mt-2 text-sm font-bold leading-5 text-slate-100">{block.name}</h2>
            <p className="mt-1 text-xs text-slate-400">{block.colorName}</p>
            {block.description?.includes("提供カタログキー:") && <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-cyan-100/75">{block.description.replace(/^提供カタログキー:.*\n?/, "")}</p>}
          </article>)}
          {!catalog.isLoading && catalog.data?.length === 0 && <div className="col-span-full border border-white/10 bg-[#111a36] px-6 py-14 text-center"><Inbox className="mx-auto h-8 w-8 text-cyan-200" /><h2 className="mt-4 font-bold text-slate-100">条件に合うブロックがありません</h2><p className="mt-2 text-sm text-slate-400">検索語や色、カテゴリを変更してみてください。</p><Button onClick={() => { setQuery(""); setCategory("すべて"); setColor("すべて"); }} variant="outline" className="mt-5 border-cyan-300/40 text-cyan-100 hover:bg-cyan-300/10 hover:text-cyan-50">すべてのブロックを見る</Button></div>}
        </section>}
      </main>
    </div>
  );
}

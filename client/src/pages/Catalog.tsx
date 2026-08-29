import AppHeader from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Blocks, CircleAlert, Filter, Inbox, Info, Layers, Palette, RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const colorOptions = [
  "すべて",
  "ホワイト",
  "グレー",
  "ブラック",
  "レッド",
  "オレンジ",
  "ブラウン",
  "イエロー",
  "黄緑",
  "グリーン",
  "ライム",
  "シアン",
  "ネイビー",
  "パープル",
  "マゼンタ",
];

const categoryPills = [
  "すべて",
  "石",
  "壁",
  "床",
  "装飾",
  "道路",
  "土",
  "草",
  "特殊",
];

const colorHexMap: Record<string, string> = {
  ホワイト: "#F8FAFC",
  グレー: "#94A3B8",
  ブラック: "#18181B",
  レッド: "#DC2626",
  オレンジ: "#FB923C",
  ブラウン: "#9C5146",
  イエロー: "#FACC15",
  黄緑: "#84CC16",
  グリーン: "#22C55E",
  ライム: "#2DD4BF",
  シアン: "#38BDF8",
  ネイビー: "#2563EB",
  パープル: "#A855F7",
  マゼンタ: "#F43F5E",
};

type BlockItem = {
  id: number;
  name: string;
  colorHex: string;
  colorName: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
};

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("すべて");
  const [color, setColor] = useState("すべて");
  const [selectedBlock, setSelectedBlock] = useState<BlockItem | null>(null);

  const filters = trpc.catalog.filters.useQuery();
  const params = useMemo(() => ({
    query: query.trim() || undefined,
    category: category === "すべて" ? undefined : category,
    color: color === "すべて" ? undefined : color,
    limit: 1000,
  }), [query, category, color]);

  const catalog = trpc.catalog.list.useQuery(params);

  // カテゴリごとの件数を計算（全体データ取得時用）
  const allBlocksQuery = trpc.catalog.list.useQuery({ limit: 1000 });
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { すべて: allBlocksQuery.data?.length ?? 0 };
    for (const b of allBlocksQuery.data ?? []) {
      counts[b.category] = (counts[b.category] ?? 0) + 1;
    }
    return counts;
  }, [allBlocksQuery.data]);

  return (
    <div className="min-h-screen bg-[#090d20] text-slate-100">
      <AppHeader />
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="pixel-panel relative overflow-hidden p-6 sm:p-8">
          <div className="pixel-dot left-6 top-6" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-cyan-200">
                <Sparkles className="h-4 w-4" /> OFFICIAL BLOCK LIBRARY (全120種)
              </div>
              <h1 className="font-pixel text-xl leading-relaxed text-[#f7f2d0] sm:text-2xl">ブロック図鑑</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                実物のイラスト・アイソメトリックテクスチャを持つ<strong className="text-cyan-200">全120種類の公式画像ブロック</strong>を完全収録。名称、カテゴリ、系統色から自由に検索・確認できます。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-lime-300/40 bg-lime-300/10 px-3.5 py-2 text-lime-200">
                <Blocks className="mr-2 h-4 w-4 text-lime-300" />
                全 {allBlocksQuery.data?.length ?? 120} 種 完全登録
              </Badge>
              <Badge className="border-cyan-300/30 bg-cyan-300/10 px-3.5 py-2 text-cyan-100">
                <Filter className="mr-1.5 h-3.5 w-3.5 text-cyan-300" />
                表示中: {catalog.data?.length ?? 0} 件
              </Badge>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <span className="flex items-center text-xs font-bold text-slate-400 mr-1">
              <Layers className="h-3.5 w-3.5 mr-1 text-cyan-300" /> カテゴリ:
            </span>
            {categoryPills.map(cat => {
              const count = categoryCounts[cat];
              const isSelected = category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                      : "bg-[#111a36] text-slate-300 border border-white/10 hover:border-cyan-400/40 hover:text-white"
                  }`}
                >
                  {cat}
                  {count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-slate-900/30 text-slate-950" : "bg-white/10 text-slate-400"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="mt-6 grid gap-3 rounded-sm border border-white/10 bg-[#111a36] p-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200" />
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="ブロック名・特徴・素材で検索（例: あおいわ、波模様、タイル、レンガ）"
              className="border-white/10 bg-[#090d20] pl-10 text-white placeholder:text-slate-500"
            />
          </div>
          <Select value={category} onValueChange={setCategory} disabled={filters.isError}>
            <SelectTrigger className="border-white/10 bg-[#090d20] text-slate-100">
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent className="border-cyan-500/30 bg-[#0b1429] text-slate-100">
              {categoryPills.map(option => (
                <SelectItem value={option} key={option}>
                  {option} {categoryCounts[option] !== undefined ? `(${categoryCounts[option]})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="border-white/10 bg-[#090d20] text-slate-100">
              <SelectValue placeholder="系統色" />
            </SelectTrigger>
            <SelectContent className="border-cyan-500/30 bg-[#0b1429] text-slate-100">
              {colorOptions.map(option => (
                <SelectItem value={option} key={option}>
                  <div className="flex items-center gap-2">
                    {colorHexMap[option] && (
                      <span className="inline-block h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: colorHexMap[option] }} />
                    )}
                    {option}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {filters.isError && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-sm text-yellow-100">
            <span>カテゴリ一覧を取得できませんでした。名前・色での検索は続けて利用できます。</span>
            <Button
              onClick={() => filters.refetch()}
              variant="outline"
              size="sm"
              className="border-yellow-300/50 bg-transparent text-yellow-100 hover:bg-yellow-300/15 hover:text-yellow-50"
            >
              カテゴリを再試行
            </Button>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            <Filter className="mr-1 inline h-4 w-4 text-cyan-300" />
            {catalog.isLoading ? "読み込み中..." : `${catalog.data?.length ?? 0} 件のブロックを表示中`}
          </p>
          {(query || category !== "すべて" || color !== "すべて") && (
            <Button
              variant="ghost"
              onClick={() => { setQuery(""); setCategory("すべて"); setColor("すべて"); }}
              className="text-xs text-cyan-200 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> フィルターをリセット
            </Button>
          )}
        </div>

        {catalog.isError ? (
          <section className="mt-4 border border-fuchsia-400/30 bg-fuchsia-400/10 p-7 text-center">
            <CircleAlert className="mx-auto h-7 w-7 text-fuchsia-200" />
            <h2 className="mt-3 font-bold text-fuchsia-100">カタログを取得できませんでした</h2>
            <p className="mt-2 text-sm text-slate-300">通信状態を確認して、もう一度お試しください。</p>
            <Button onClick={() => catalog.refetch()} className="mt-4 bg-fuchsia-300 text-[#090d20] hover:bg-fuchsia-200">
              再試行
            </Button>
          </section>
        ) : catalog.isLoading ? (
          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 15 }, (_, index) => (
              <Skeleton key={index} className="h-56 rounded-sm bg-white/5" />
            ))}
          </section>
        ) : (
          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {catalog.data?.map(block => (
              <BlockCard key={block.id} block={block as BlockItem} onSelect={setSelectedBlock} />
            ))}
            {catalog.data?.length === 0 && (
              <div className="col-span-full border border-white/10 bg-[#111a36] px-6 py-14 text-center">
                <Inbox className="mx-auto h-8 w-8 text-cyan-200" />
                <h2 className="mt-4 font-bold text-slate-100">条件に合うブロックがありません</h2>
                <p className="mt-2 text-sm text-slate-400">検索語や色、カテゴリを変更してみてください。</p>
                <Button
                  onClick={() => { setQuery(""); setCategory("すべて"); setColor("すべて"); }}
                  variant="outline"
                  className="mt-5 border-cyan-300/40 text-cyan-100 hover:bg-cyan-300/10 hover:text-cyan-50"
                >
                  すべてのブロック（全120種）を見る
                </Button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Block Detail Dialog */}
      <Dialog open={Boolean(selectedBlock)} onOpenChange={open => !open && setSelectedBlock(null)}>
        {selectedBlock && (
          <DialogContent className="border border-cyan-500/30 bg-[#0f172a] text-slate-100 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-cyan-200">
                <Info className="h-5 w-5 text-cyan-400" />
                {selectedBlock.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 flex flex-col gap-4">
              <div
                className="grid aspect-square max-h-56 place-items-center overflow-hidden rounded-md border border-white/10 bg-[#090d20] p-4"
                style={{
                  backgroundImage: `linear-gradient(45deg, ${selectedBlock.colorHex}20 25%, transparent 25%), linear-gradient(-45deg, ${selectedBlock.colorHex}20 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${selectedBlock.colorHex}20 75%), linear-gradient(-45deg, transparent 75%, ${selectedBlock.colorHex}20 75%)`,
                  backgroundSize: "20px 20px",
                }}
              >
                {selectedBlock.imageUrl ? (
                  <img
                    src={selectedBlock.imageUrl}
                    alt={selectedBlock.name}
                    className="max-h-48 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  />
                ) : (
                  <div
                    className="h-28 w-28 rounded-md border-4 border-white/30 shadow-[6px_6px_0_#ffffff20]"
                    style={{ backgroundColor: selectedBlock.colorHex }}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-sm border border-white/10 bg-slate-900/60 p-2.5">
                  <span className="text-[11px] text-slate-400">カテゴリ</span>
                  <p className="mt-0.5 font-bold text-cyan-200">{selectedBlock.category}</p>
                </div>
                <div className="rounded-sm border border-white/10 bg-slate-900/60 p-2.5">
                  <span className="text-[11px] text-slate-400">系統色</span>
                  <p className="mt-0.5 flex items-center gap-1.5 font-bold text-slate-100">
                    <span className="inline-block h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: selectedBlock.colorHex }} />
                    {selectedBlock.colorName} ({selectedBlock.colorHex})
                  </p>
                </div>
              </div>
              {selectedBlock.description && (
                <div className="rounded-sm border border-white/10 bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                  <span className="mb-1 block font-semibold text-slate-400">ブロック詳細・特徴:</span>
                  {selectedBlock.description}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function BlockCard({ block, onSelect }: { block: BlockItem; onSelect: (block: BlockItem) => void }) {
  return (
    <article
      onClick={() => onSelect(block)}
      className="block-card group relative cursor-pointer overflow-hidden rounded-sm border border-cyan-500/25 bg-[#0b1429] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
    >
      <div
        className="mb-3 grid aspect-square place-items-center overflow-hidden rounded-sm border border-white/10 bg-[#090d20] p-2"
        style={{
          backgroundImage: `linear-gradient(45deg, ${block.colorHex}15 25%, transparent 25%), linear-gradient(-45deg, ${block.colorHex}15 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${block.colorHex}15 75%), linear-gradient(-45deg, transparent 75%, ${block.colorHex}15 75%)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
        }}
      >
        {block.imageUrl ? (
          <img
            src={block.imageUrl}
            alt={`${block.name}のブロック画像`}
            className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <span
            className="h-14 w-14 rounded-sm border-2 border-white/20 shadow-[3px_3px_0_#ffffff30] transition-transform duration-200 group-hover:scale-105"
            style={{ background: block.colorHex }}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-1">
        <Badge variant="outline" className="border-white/15 bg-black/20 text-[10px] text-cyan-200">
          {block.category}
        </Badge>
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: block.colorHex }} />
          {block.colorName}
        </span>
      </div>

      <h3 className="mt-2 truncate text-sm font-bold text-slate-100 group-hover:text-cyan-200">
        {block.name}
      </h3>

      {block.description && (
        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">
          {block.description.replace(/^提供カタログキー:.*\n?/, "")}
        </p>
      )}
    </article>
  );
}

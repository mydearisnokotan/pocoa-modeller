import type { RefObject } from "react";
import { useMemo, useState } from "react";

export type Blueprint2DData = {
  gridSize: number;
  cells: Array<{ x: number; y: number; partId: string; layer?: string; blockId: number; blockName: string; colorHex: string }>;
  legend: Array<{ partId: string; partName: string; layer: string; blockId: number; blockName: string; colorHex: string }>;
};

export function Blueprint2D({ blueprint, exportRef }: { blueprint: Blueprint2DData; exportRef: RefObject<HTMLDivElement | null> }) {
  const fallbackLayer = useMemo(() => new Map(blueprint.legend.map(item => [item.partId, item.layer])), [blueprint.legend]);
  const layers = useMemo(() => Array.from(new Set(blueprint.cells.map(cell => cell.layer ?? fallbackLayer.get(cell.partId) ?? "未分類"))), [blueprint.cells, fallbackLayer]);
  const [selectedLayer, setSelectedLayer] = useState("すべて");
  const [active, setActive] = useState(blueprint.cells[0]);
  const visibleCells = useMemo(() => blueprint.cells.filter(cell => selectedLayer === "すべて" || (cell.layer ?? fallbackLayer.get(cell.partId) ?? "未分類") === selectedLayer), [blueprint.cells, fallbackLayer, selectedLayer]);
  const blockRows = useMemo(() => Array.from(visibleCells.reduce<Map<string, { layer: string; blockName: string; colorHex: string; positions: string[] }>>((rows, cell) => {
    const layer = cell.layer ?? fallbackLayer.get(cell.partId) ?? "未分類";
    const key = `${layer}-${cell.blockId}`;
    const current = rows.get(key) ?? { layer, blockName: cell.blockName, colorHex: cell.colorHex, positions: [] };
    current.positions.push(`(${cell.x + 1},${cell.y + 1})`);
    rows.set(key, current);
    return rows;
  }, new Map()).values()), [visibleCells, fallbackLayer]);
  const cellMap = new Map(blueprint.cells.map(cell => [`${cell.x}-${cell.y}`, cell]));
  return <div ref={exportRef} className="border border-cyan-300/30 bg-[#080d1d] p-4 text-slate-100"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-pixel text-[10px] text-cyan-200">2D LAYER BLUEPRINT</p><p className="mt-2 text-xs text-slate-400">レイヤーを選ぶと配置・ブロック名・座標を個別に確認できます。</p></div>{active && <div className="border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-right"><p className="text-[10px] text-lime-200">HOVERED BLOCK</p><p className="mt-1 text-xs font-bold text-slate-100">{active.blockName} / ({active.x + 1},{active.y + 1})</p></div>}</div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setSelectedLayer("すべて")} className={selectedLayer === "すべて" ? "border border-lime-300 bg-lime-300/15 px-3 py-2 font-pixel text-[10px] text-lime-200" : "border border-white/15 px-3 py-2 font-pixel text-[10px] text-slate-400"}>全レイヤー</button>{layers.map(layer => <button key={layer} type="button" onClick={() => setSelectedLayer(layer)} className={selectedLayer === layer ? "border border-cyan-300 bg-cyan-300/15 px-3 py-2 font-pixel text-[10px] text-cyan-100" : "border border-white/15 px-3 py-2 font-pixel text-[10px] text-slate-400"}>{layer}</button>)}</div><div className="mx-auto mt-5 grid w-full max-w-[600px] aspect-square overflow-hidden border border-white/20 bg-[#111a36]" style={{ gridTemplateColumns: `repeat(${blueprint.gridSize}, minmax(0, 1fr))` }}>{Array.from({ length: blueprint.gridSize ** 2 }, (_, index) => { const x = index % blueprint.gridSize; const y = Math.floor(index / blueprint.gridSize); const cell = cellMap.get(`${x}-${y}`); const isVisible = cell && (selectedLayer === "すべて" || (cell.layer ?? fallbackLayer.get(cell.partId) ?? "未分類") === selectedLayer); return <div key={index} title={cell ? `${cell.blockName} / ${cell.layer ?? fallbackLayer.get(cell.partId) ?? "未分類"} / (${x + 1},${y + 1})` : undefined} onMouseEnter={() => { if (cell) setActive(cell); }} className="border-[.5px] border-white/5" style={{ background: isVisible ? cell.colorHex : "transparent", opacity: isVisible ? 1 : .18 }} />; })}</div><section className="mt-5 border border-white/10 bg-[#111a36] p-3"><div className="flex items-center justify-between gap-3"><p className="font-pixel text-[10px] text-yellow-100">{selectedLayer === "すべて" ? "ALL LAYERS" : `LAYER: ${selectedLayer}`}</p><span className="text-xs text-slate-400">{visibleCells.length} blocks</span></div><div className="mt-3 space-y-2">{blockRows.map(row => <div key={`${row.layer}-${row.blockName}`} className="border border-white/10 bg-[#080d1d] p-3"><div className="flex items-center gap-2"><span className="h-4 w-4 shrink-0 border border-white/25" style={{ background: row.colorHex }} /><p className="text-xs font-bold text-slate-100">{row.blockName}</p><span className="ml-auto text-[10px] text-lime-200">{row.positions.length}個</span></div><p className="mt-2 break-words text-[10px] leading-5 text-slate-400">配置: {row.positions.join(" ")}</p></div>)}</div></section></div>;
}

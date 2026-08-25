import type { RefObject } from "react";
import { useState } from "react";

export type Blueprint2DData = {
  gridSize: number;
  cells: Array<{ x: number; y: number; partId: string; blockId: number; blockName: string; colorHex: string }>;
  legend: Array<{ partId: string; partName: string; layer: string; blockId: number; blockName: string; colorHex: string }>;
};

export function Blueprint2D({ blueprint, exportRef }: { blueprint: Blueprint2DData; exportRef: RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState(blueprint.legend[0]);
  const cellMap = new Map(blueprint.cells.map(cell => [`${cell.x}-${cell.y}`, cell]));
  return <div ref={exportRef} className="border border-cyan-300/30 bg-[#080d1d] p-4 text-slate-100"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-pixel text-[10px] text-cyan-200">2D LAYER BLUEPRINT</p><p className="mt-2 text-xs text-slate-400">マスにカーソルを置くとブロック名を確認できます。</p></div>{active && <div className="border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-right"><p className="text-[10px] text-lime-200">SELECTED BLOCK</p><p className="mt-1 text-xs font-bold text-slate-100">{active.blockName}</p></div>}</div><div className="mx-auto mt-5 grid w-full max-w-[600px] aspect-square grid-cols-[repeat(18,minmax(0,1fr))] overflow-hidden border border-white/20 bg-[#111a36]">{Array.from({ length: blueprint.gridSize ** 2 }, (_, index) => { const x = index % blueprint.gridSize; const y = Math.floor(index / blueprint.gridSize); const cell = cellMap.get(`${x}-${y}`); return <div key={index} onMouseEnter={() => { const item = blueprint.legend.find(legend => legend.partId === cell?.partId); if (item) setActive(item); }} className="border-[.5px] border-white/5" style={{ background: cell?.colorHex ?? "transparent", opacity: cell ? 1 : .18 }} />; })}</div><div className="mt-5 grid gap-2 sm:grid-cols-2">{blueprint.legend.map(item => <div key={item.partId} className="flex items-center gap-3 border border-white/10 bg-[#111a36] px-3 py-2"><span className="h-5 w-5 border border-white/25" style={{ background: item.colorHex }} /><div className="min-w-0"><p className="truncate text-xs font-bold text-slate-100">{item.partName}</p><p className="truncate text-[10px] text-slate-400">{item.blockName} / {item.layer}</p></div></div>)}</div></div>;
}

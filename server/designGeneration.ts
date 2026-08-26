import type { Silhouette } from "./silhouette";

export type DesignPart = {
  partId: string;
  partName: string;
  layer: string;
  blockId: number;
  blockName: string;
  colorHex: string;
  coveragePercent: number;
};

export type Recipe = {
  blockId: number;
  materialId: number;
  materialName: string;
  quantity: number;
  materialDescription: string | null;
  locationName: string | null;
  locationDescription: string | null;
  locationImageUrl: string | null;
};

export type PaletteBlock = { id: number; name: string; colorHex: string };

type Cell = { x: number; y: number; partId: string; layer: string; blockId: number; blockName: string; colorHex: string };
type Voxel = Cell & { z: number };

function normalizedHex(hex: string) {
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#8E98A8";
}

function rgb(hex: string) {
  const value = normalizedHex(hex).slice(1);
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)] as const;
}

function colorDistance(first: string, second: string) {
  const a = rgb(first);
  const b = rgb(second);
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function partKind(part: Pick<DesignPart, "partId" | "partName">) {
  const label = `${part.partId} ${part.partName}`.toLowerCase();
  if (/head|頭|horn|角/.test(label)) return "head";
  if (/neck|首/.test(label)) return "neck";
  if (/leg|foot|limb|脚|足|四肢/.test(label)) return "legs";
  if (/tail|尻尾|尾/.test(label)) return "tail";
  if (/wheel|ring|輪|リング/.test(label)) return "ring";
  if (/torso|body|胴|体/.test(label)) return "torso";
  return "detail";
}

function fallbackCells(parts: DesignPart[], gridSize: number) {
  const cells: Cell[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dx = (x - (gridSize - 1) / 2) / 8.7;
      const dy = (y - (gridSize - 1) / 2) / 9.3;
      if (dx * dx + dy * dy > 1 || (y < 3 && Math.abs(dx) > .55)) continue;
      const part = parts[Math.abs((Math.floor(x / 3) + Math.floor(y / 3) * 2 + (x % 2)) % parts.length)];
      cells.push({ x, y, partId: part.partId, layer: part.layer, blockId: part.blockId, blockName: part.blockName, colorHex: normalizedHex(part.colorHex) });
    }
  }
  return cells;
}

function assignPart(cell: { x: number; y: number; colorHex: string }, parts: DesignPart[], bounds: { minX: number; maxX: number; minY: number; maxY: number }) {
  const relativeX = (cell.x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX);
  const relativeY = (cell.y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY);
  const closest = [...parts].sort((a, b) => colorDistance(cell.colorHex, a.colorHex) - colorDistance(cell.colorHex, b.colorHex))[0];
  if (closest && partKind(closest) === "ring" && colorDistance(cell.colorHex, closest.colorHex) < 90) return closest;
  const find = (kind: string) => parts.find(part => partKind(part) === kind);
  if (relativeY < .26) return find("head") ?? closest ?? parts[0];
  if (relativeY > .7) return find("legs") ?? closest ?? parts[0];
  if (relativeX > .78) return find("tail") ?? closest ?? parts[0];
  if (relativeY < .43 && relativeX < .47) return find("neck") ?? find("torso") ?? closest ?? parts[0];
  return find("torso") ?? closest ?? parts[0];
}

function closestPaletteBlock(colorHex: string, palette: PaletteBlock[]) {
  return palette.length ? [...palette].sort((first, second) => colorDistance(colorHex, first.colorHex) - colorDistance(colorHex, second.colorHex))[0] : undefined;
}

function silhouetteCells(silhouette: Silhouette, parts: DesignPart[], palette: PaletteBlock[]) {
  const bounds = silhouette.cells.reduce((current, cell) => ({ minX: Math.min(current.minX, cell.x), maxX: Math.max(current.maxX, cell.x), minY: Math.min(current.minY, cell.y), maxY: Math.max(current.maxY, cell.y) }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  return silhouette.cells.map(cell => {
    const part = assignPart(cell, parts, bounds);
    const displayBlock = closestPaletteBlock(cell.colorHex, palette);
    return { x: cell.x, y: cell.y, partId: part.partId, layer: part.layer, blockId: displayBlock?.id ?? part.blockId, blockName: displayBlock?.name ?? part.blockName, colorHex: normalizedHex(displayBlock?.colorHex ?? part.colorHex) };
  });
}

function sideDepthAt(silhouette: Silhouette | undefined, targetY: number, outputGridSize: number) {
  if (!silhouette?.cells.length) return undefined;
  const sourceY = Math.round((targetY / Math.max(1, outputGridSize - 1)) * (silhouette.gridSize - 1));
  const row = silhouette.cells.filter(cell => Math.abs(cell.y - sourceY) <= 1);
  if (!row.length) return undefined;
  const minX = Math.min(...row.map(cell => cell.x));
  const maxX = Math.max(...row.map(cell => cell.x));
  return Math.max(1, Math.min(6, Math.round(1 + ((maxX - minX + 1) / silhouette.gridSize) * 10)));
}

function silhouetteVoxels(cells: Cell[], gridSize: number, parts: DesignPart[], sideSilhouettes: Silhouette[] = []) {
  const result = new Map<string, Voxel>();
  const depth = { head: 4, neck: 3, torso: 6, legs: 3, tail: 3, ring: 2, detail: 3 } as const;
  const partsById = new Map(parts.map(part => [part.partId, part]));
  const active = new Set(cells.map(cell => `${cell.x}:${cell.y}`));
  const edgeDistance = (cell: Cell) => {
    for (let radius = 1; radius <= 4; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          if (!active.has(`${cell.x + dx}:${cell.y + dy}`)) return radius;
        }
      }
    }
    return 4;
  };
  for (const cell of cells) {
    const kind = partKind(partsById.get(cell.partId) ?? { partId: cell.partId, partName: "" });
    const profileDepths = sideSilhouettes.map(silhouette => sideDepthAt(silhouette, cell.y, gridSize)).filter((value): value is number => value !== undefined);
    const sideDepth = profileDepths.length ? Math.round(profileDepths.reduce((sum, value) => sum + value, 0) / profileDepths.length) : depth[kind];
    const thickness = Math.min(depth[kind], Math.max(1, Math.min(sideDepth, edgeDistance(cell) * 2 - 1)));
    for (let index = 0; index < thickness; index++) {
      const y = Math.round(gridSize / 2 - thickness / 2 + index);
      const z = gridSize - 1 - cell.y;
      const key = `${cell.x}:${y}:${z}`;
      result.set(key, { ...cell, y, z });
    }
  }
  return Array.from(result.values());
}

function buildStructuredVoxels(parts: DesignPart[]) {
  const voxels = new Map<string, Voxel>();
  const add = (part: DesignPart, x: number, y: number, z: number) => {
    const key = `${x}:${y}:${z}`;
    if (!voxels.has(key)) voxels.set(key, { x, y, z, partId: part.partId, layer: part.layer, blockId: part.blockId, blockName: part.blockName, colorHex: normalizedHex(part.colorHex) });
  };
  for (const part of parts) {
    const kind = partKind(part);
    for (let x = 3; x <= 14; x++) for (let z = 3; z <= 9; z++) {
      const inside = ((x - 9) / 5.5) ** 2 + ((z - 6) / 3.2) ** 2 < 1;
      if (inside && kind === "torso") for (let y = 6; y <= 11; y++) add(part, x, y, z);
    }
    if (kind === "head") for (let step = 0; step < 6; step++) add(part, 5 - step, 9, 9 + step);
    if (kind === "legs") [[6, 4], [6, 8], [11, 4], [11, 8]].forEach(([x, z]) => { for (let y = 4; y <= 7; y++) add(part, x, y, z); });
    if (kind === "tail") for (let step = 0; step < 5; step++) add(part, 13 + step, 9, 6 + step / 2);
    if (kind === "ring") for (let index = 0; index < 18; index++) { const angle = Math.PI * 2 * index / 18; add(part, Math.round(9 + Math.cos(angle) * 4), 6, Math.round(6 + Math.sin(angle) * 3)); }
  }
  return Array.from(voxels.values());
}

/** 選択内容と、利用できる場合は実画像の輪郭を表示専用の2D／3D設計データと素材数に変換する。 */
export function generateBlueprint(buildingHeight: number, parts: DesignPart[], recipes: Recipe[], silhouette?: Silhouette, sideSilhouettes: Silhouette[] = [], palette: PaletteBlock[] = []) {
  if (!parts.length) throw new Error("少なくとも1つの部位でブロックを選択してください。");
  const gridSize = silhouette?.gridSize ?? 18;
  const cells = silhouette?.cells.length ? silhouetteCells(silhouette, parts, palette) : fallbackCells(parts, gridSize);
  const partCounts = new Map(parts.map(part => [part.partId, Math.max(8, Math.round((buildingHeight ** 2) * .08 * (part.coveragePercent / 100)))]));
  const estimate = Array.from(partCounts.values()).reduce((sum, count) => sum + count, 0);
  const rawCounts = cells.reduce<Map<number, { blockId: number; blockName: string; colorHex: string; count: number }>>((result, cell) => {
    const current = result.get(cell.blockId);
    result.set(cell.blockId, current ? { ...current, count: current.count + 1 } : { blockId: cell.blockId, blockName: cell.blockName, colorHex: normalizedHex(cell.colorHex), count: 1 });
    return result;
  }, new Map());
  const blockSummary = Array.from(rawCounts.values()).map(item => ({ ...item, count: Math.max(1, Math.round((item.count / Math.max(1, cells.length)) * estimate)) }));
  const materialSummary = new Map<number, { materialId: number; name: string; count: number; description: string | null; locationName: string | null; locationDescription: string | null; locationImageUrl: string | null }>();
  for (const block of blockSummary) for (const recipe of recipes.filter(item => item.blockId === block.blockId)) {
    const current = materialSummary.get(recipe.materialId);
    const count = block.count * recipe.quantity;
    materialSummary.set(recipe.materialId, current ? { ...current, count: current.count + count } : { materialId: recipe.materialId, name: recipe.materialName, count, description: recipe.materialDescription, locationName: recipe.locationName, locationDescription: recipe.locationDescription, locationImageUrl: recipe.locationImageUrl });
  }
  return {
    blueprint2d: { gridSize, cells, legend: Array.from(new Map(cells.map(cell => [cell.blockId, { partId: cell.partId, partName: parts.find(part => part.partId === cell.partId)?.partName ?? cell.partId, layer: parts.find(part => part.partId === cell.partId)?.layer ?? "", blockId: cell.blockId, blockName: cell.blockName, colorHex: normalizedHex(cell.colorHex) }])).values()) },
    blueprint3d: { voxels: silhouette?.cells.length ? silhouetteVoxels(cells, gridSize, parts, sideSilhouettes) : buildStructuredVoxels(parts), gridSize },
    blockSummary,
    materialSummary: Array.from(materialSummary.values()).sort((a, b) => b.count - a.count),
    totalBlocks: blockSummary.reduce((sum, item) => sum + item.count, 0),
  };
}

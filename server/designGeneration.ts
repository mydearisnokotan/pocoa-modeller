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

type Cell = { x: number; y: number; partId: string; blockId: number; blockName: string; colorHex: string };

function normalizedHex(hex: string) {
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#8E98A8";
}

/** 選択内容を再現可能な表示専用の2D／3D設計データと素材数に変換する。 */
export function generateBlueprint(buildingHeight: number, parts: DesignPart[], recipes: Recipe[]) {
  if (!parts.length) throw new Error("少なくとも1つの部位でブロックを選択してください。");
  const gridSize = 18;
  const cells: Cell[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dx = (x - (gridSize - 1) / 2) / 8.7;
      const dy = (y - (gridSize - 1) / 2) / 9.3;
      if (dx * dx + dy * dy > 1 || (y < 3 && Math.abs(dx) > .55)) continue;
      const index = Math.abs((Math.floor(x / 3) + Math.floor(y / 3) * 2 + (x % 2)) % parts.length);
      const part = parts[index];
      cells.push({ x, y, partId: part.partId, blockId: part.blockId, blockName: part.blockName, colorHex: normalizedHex(part.colorHex) });
    }
  }

  const partCounts = new Map(parts.map(part => [part.partId, Math.max(8, Math.round((buildingHeight ** 2) * .08 * (part.coveragePercent / 100)))]));
  const blockSummary = parts.map(part => ({
    blockId: part.blockId,
    blockName: part.blockName,
    colorHex: normalizedHex(part.colorHex),
    count: partCounts.get(part.partId) ?? 0,
  })).reduce<Array<{ blockId: number; blockName: string; colorHex: string; count: number }>>((result, item) => {
    const existing = result.find(value => value.blockId === item.blockId);
    if (existing) existing.count += item.count; else result.push(item);
    return result;
  }, []);

  const materialSummary = new Map<number, { materialId: number; name: string; count: number; description: string | null; locationName: string | null; locationDescription: string | null; locationImageUrl: string | null }>();
  for (const block of blockSummary) {
    for (const recipe of recipes.filter(item => item.blockId === block.blockId)) {
      const current = materialSummary.get(recipe.materialId);
      const count = block.count * recipe.quantity;
      materialSummary.set(recipe.materialId, current ? { ...current, count: current.count + count } : {
        materialId: recipe.materialId, name: recipe.materialName, count, description: recipe.materialDescription,
        locationName: recipe.locationName, locationDescription: recipe.locationDescription, locationImageUrl: recipe.locationImageUrl,
      });
    }
  }

  return {
    blueprint2d: {
      gridSize, cells, legend: parts.map(part => ({ partId: part.partId, partName: part.partName, layer: part.layer, blockId: part.blockId, blockName: part.blockName, colorHex: normalizedHex(part.colorHex) })),
    },
    blueprint3d: {
      voxels: cells.filter((_, index) => index % 2 === 0).map((cell, index) => ({ ...cell, z: 1 + ((cell.x * 3 + cell.y * 5 + index) % 5) })),
      gridSize,
    },
    blockSummary,
    materialSummary: Array.from(materialSummary.values()).sort((a, b) => b.count - a.count),
    totalBlocks: blockSummary.reduce((sum, item) => sum + item.count, 0),
  };
}

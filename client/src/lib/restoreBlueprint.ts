import type { Blueprint2DData } from "@/components/Blueprint2D";
import type { Blueprint3DData } from "@/components/Blueprint3D";

export type BlueprintResult = {
  blueprint2d: Blueprint2DData;
  blueprint3d: Blueprint3DData;
  blockSummary: Array<{ blockId: number; blockName: string; colorHex: string; count: number }>;
  materialSummary: Array<{ materialId: number; name: string; count: number; description: string | null; locationName: string | null; locationDescription: string | null; locationImageUrl: string | null }>;
  totalBlocks: number;
};

function toStoredObject(value: unknown): object | null {
  if (typeof value === "object" && value !== null) return value;
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export function restoreSavedBlueprint(value2d: unknown, value3d: unknown): BlueprintResult | null {
  const saved2d = toStoredObject(value2d);
  const saved3d = toStoredObject(value3d);
  if (!saved2d || !saved3d) return null;
  const twoD = saved2d as Partial<Blueprint2DData & BlueprintResult>;
  const threeD = saved3d as Partial<Blueprint3DData>;
  if (!Array.isArray(twoD.cells) || !Array.isArray(threeD.voxels) || typeof twoD.gridSize !== "number" || typeof threeD.gridSize !== "number") return null;
  return {
    blueprint2d: { gridSize: twoD.gridSize, cells: twoD.cells, legend: Array.isArray(twoD.legend) ? twoD.legend : [] },
    blueprint3d: { gridSize: threeD.gridSize, voxels: threeD.voxels },
    blockSummary: Array.isArray(twoD.blockSummary) ? twoD.blockSummary as BlueprintResult["blockSummary"] : [],
    materialSummary: Array.isArray(twoD.materialSummary) ? twoD.materialSummary as BlueprintResult["materialSummary"] : [],
    totalBlocks: typeof twoD.totalBlocks === "number" ? twoD.totalBlocks : 0,
  };
}

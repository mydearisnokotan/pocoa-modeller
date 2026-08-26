import { eq } from "drizzle-orm";
import { blocks, projectSelections } from "../drizzle/schema";
import { getDb } from "./db";
import type { BuildingAnalysis } from "./buildingAnalysis";

type Rgb = { r: number; g: number; b: number };
type CandidateCatalogBlock = { id: number; colorHex: string; description: string | null };

function toRgb(hex: string): Rgb {
  const matched = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!matched) return { r: 128, g: 128, b: 128 };
  const value = matched[1];
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

function colorDistance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/** 色近似の基本候補に、提供カタログ由来の質感候補を最大2件追加する。 */
export function selectCandidateBlockIds(targetColor: string, candidateCount: number, catalog: CandidateCatalogBlock[], previousSelectedBlockId?: number | null) {
  const target = toRgb(targetColor);
  const byDistance = [...catalog].sort((a, b) => colorDistance(target, toRgb(a.colorHex)) - colorDistance(target, toRgb(b.colorHex)));
  const nearest = byDistance.slice(0, candidateCount).map(block => block.id);
  const supplied = byDistance.filter(block => block.description?.startsWith("提供カタログキー:")).slice(0, 2).map(block => block.id);
  return Array.from(new Set([...nearest, ...supplied, ...(previousSelectedBlockId ? [previousSelectedBlockId] : [])]));
}

/** 部位の占有率・可視性に応じ、候補数を固定せず4〜7件で提示する。 */
export async function createProjectCandidates(projectId: number, analysis: BuildingAnalysis, options: { preserveExistingSelection?: boolean } = {}) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const catalog = await db.select({ id: blocks.id, colorHex: blocks.colorHex, description: blocks.description }).from(blocks).where(eq(blocks.isActive, true));
  if (!catalog.length) return;
  const previousSelections = options.preserveExistingSelection ? await db.select({ partId: projectSelections.partId, selectedBlockId: projectSelections.selectedBlockId }).from(projectSelections).where(eq(projectSelections.projectId, projectId)) : [];
  const selectedByPart = new Map(previousSelections.map(selection => [selection.partId, selection.selectedBlockId]));

  const rows = analysis.parts.map((part, index) => {
    const candidateCount = part.coveragePercent >= 30 ? 7 : part.visibility === "partial" ? 4 : 5;
    const previousSelectedBlockId = selectedByPart.get(part.id);
    const candidateBlockIds = selectCandidateBlockIds(part.dominantColor, candidateCount, catalog, previousSelectedBlockId);
    return {
      projectId,
      partId: part.id,
      partName: part.name,
      candidateBlockIds,
      selectedBlockId: previousSelectedBlockId ?? null,
      layer: part.layerId,
      sortOrder: index,
    };
  });
  if (rows.length) {
    await db.delete(projectSelections).where(eq(projectSelections.projectId, projectId));
    await db.insert(projectSelections).values(rows);
  }
}

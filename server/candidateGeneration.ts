import { eq } from "drizzle-orm";
import { blocks, projectSelections } from "../drizzle/schema";
import { getDb } from "./db";
import type { BuildingAnalysis } from "./buildingAnalysis";

type Rgb = { r: number; g: number; b: number };

function toRgb(hex: string): Rgb {
  const matched = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!matched) return { r: 128, g: 128, b: 128 };
  const value = matched[1];
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

function colorDistance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/** 部位の占有率・可視性に応じ、候補数を固定せず4〜7件で提示する。 */
export async function createProjectCandidates(projectId: number, analysis: BuildingAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const catalog = await db.select({ id: blocks.id, colorHex: blocks.colorHex }).from(blocks).where(eq(blocks.isActive, true));
  if (!catalog.length) return;

  const rows = analysis.parts.map((part, index) => {
    const target = toRgb(part.dominantColor);
    const candidateCount = part.coveragePercent >= 30 ? 7 : part.visibility === "partial" ? 4 : 5;
    const candidateBlockIds = catalog
      .map(block => ({ id: block.id, distance: colorDistance(target, toRgb(block.colorHex)) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, candidateCount)
      .map(block => block.id);
    return {
      projectId,
      partId: part.id,
      partName: part.name,
      candidateBlockIds,
      selectedBlockId: null,
      layer: part.layerId,
      sortOrder: index,
    };
  });
  if (rows.length) {
    await db.delete(projectSelections).where(eq(projectSelections.projectId, projectId));
    await db.insert(projectSelections).values(rows);
  }
}

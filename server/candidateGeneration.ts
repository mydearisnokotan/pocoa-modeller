import { eq } from "drizzle-orm";
import { blocks, projectSelections } from "../drizzle/schema";
import { getDb, memStore } from "./db";
import type { BuildingAnalysis } from "./buildingAnalysis";

type Rgb = { r: number; g: number; b: number };
type CandidateCatalogBlock = { id: number; colorHex: string; description: string | null; imageUrl?: string | null };

function toRgb(hex: string): Rgb {
  const matched = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!matched) return { r: 128, g: 128, b: 128 };
  const value = matched[1];
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

function colorDistance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/** 色近似の基本候補に、画像付き公式ブロックや提供カタログ由来の質感候補を追加する。 */
export function selectCandidateBlockIds(targetColor: string, candidateCount: number, catalog: CandidateCatalogBlock[], previousSelectedBlockId?: number | null) {
  const target = toRgb(targetColor);
  const byDistance = [...catalog].sort((a, b) => colorDistance(target, toRgb(a.colorHex)) - colorDistance(target, toRgb(b.colorHex)));
  const nearest = byDistance.slice(0, candidateCount).map(block => block.id);
  const supplied = byDistance.filter(block => Boolean(block.imageUrl && block.imageUrl.trim() !== "") || block.description?.startsWith("提供カタログキー:")).slice(0, 3).map(block => block.id);
  return Array.from(new Set([...nearest, ...supplied, ...(previousSelectedBlockId ? [previousSelectedBlockId] : [])]));
}

/** 部位の占有率・可視性に応じ、候補数を固定せず4〜7件で提示する。 */
export async function createProjectCandidates(projectId: number, analysis: BuildingAnalysis, options: { preserveExistingSelection?: boolean } = {}) {
  const db = await getDb();
  let catalog: CandidateCatalogBlock[] = [];
  let selectedByPart = new Map<string, number | null>();

  if (db) {
    try {
      catalog = await db.select({ id: blocks.id, colorHex: blocks.colorHex, description: blocks.description, imageUrl: blocks.imageUrl }).from(blocks).where(eq(blocks.isActive, true));
      if (options.preserveExistingSelection) {
        const previousSelections = await db.select({ partId: projectSelections.partId, selectedBlockId: projectSelections.selectedBlockId }).from(projectSelections).where(eq(projectSelections.projectId, projectId));
        selectedByPart = new Map(previousSelections.map(selection => [selection.partId, selection.selectedBlockId]));
      }
    } catch {
      catalog = Array.from(memStore.blocks.values()).filter(b => b.isActive).map(b => ({ id: b.id, colorHex: b.colorHex, description: b.description, imageUrl: b.imageUrl }));
      if (options.preserveExistingSelection) {
        const previous = Array.from(memStore.projectSelections.values()).filter(s => s.projectId === projectId);
        selectedByPart = new Map(previous.map(s => [s.partId, s.selectedBlockId]));
      }
    }
  } else {
    catalog = Array.from(memStore.blocks.values()).filter(b => b.isActive).map(b => ({ id: b.id, colorHex: b.colorHex, description: b.description, imageUrl: b.imageUrl }));
    if (options.preserveExistingSelection) {
      const previous = Array.from(memStore.projectSelections.values()).filter(s => s.projectId === projectId);
      selectedByPart = new Map(previous.map(s => [s.partId, s.selectedBlockId]));
    }
  }

  if (!catalog.length) return;

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
    if (db) {
      try {
        await db.delete(projectSelections).where(eq(projectSelections.projectId, projectId));
        await db.insert(projectSelections).values(rows);
        return;
      } catch (err) {
        console.warn("[Candidate] DB write failed, writing to memory:", err);
      }
    }

    // In-memory write
    for (const [id, s] of Array.from(memStore.projectSelections.entries())) {
      if (s.projectId === projectId) memStore.projectSelections.delete(id);
    }
    for (const row of rows) {
      const id = memStore.nextId.projectSelection++;
      memStore.projectSelections.set(id, {
        id,
        projectId: row.projectId,
        partId: row.partId,
        partName: row.partName,
        candidateBlockIds: row.candidateBlockIds,
        selectedBlockId: row.selectedBlockId,
        layer: row.layer,
        sortOrder: row.sortOrder,
      });
    }
  }
}

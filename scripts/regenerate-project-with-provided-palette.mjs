import { writeFile } from "node:fs/promises";
import { and, eq, inArray, like } from "drizzle-orm";
import { getDb, getRecipesForBlocks, saveProjectBlueprint } from "../server/db.ts";
import { generateBlueprint } from "../server/designGeneration.ts";
import { blocks, projectSelections, projects } from "../drizzle/schema.ts";

const projectId = 1;
const db = await getDb();
if (!db) throw new Error("データベースへ接続できません。");
const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
if (!project?.analysis) throw new Error("プロジェクト解析情報が見つかりません。");
const selections = await db.select().from(projectSelections).where(eq(projectSelections.projectId, projectId)).orderBy(projectSelections.sortOrder);
if (selections.some(selection => !selection.selectedBlockId)) throw new Error("選択済みブロックが不足しています。");
const selectedIds = selections.map(selection => selection.selectedBlockId).filter(Boolean);
const selectedBlocks = await db.select().from(blocks).where(inArray(blocks.id, selectedIds));
const selectedById = new Map(selectedBlocks.map(block => [block.id, block]));
const analysis = project.analysis;
const parts = selections.map(selection => {
  const block = selectedById.get(selection.selectedBlockId);
  if (!block) throw new Error(`選択ブロックが見つかりません: ${selection.partName}`);
  return {
    partId: selection.partId,
    partName: selection.partName,
    layer: selection.layer,
    blockId: block.id,
    blockName: block.name,
    colorHex: block.colorHex,
    coveragePercent: analysis.parts?.find(part => part.id === selection.partId)?.coveragePercent ?? 10,
  };
});
const palette = await db.select().from(blocks).where(eq(blocks.isActive, true));
const sideSilhouettes = analysis.silhouettes?.filter(item => ["left", "right", "back"].includes(item.view)).map(item => item.silhouette) ?? [];
const recipes = await getRecipesForBlocks(Array.from(new Set([...parts.map(part => part.blockId), ...palette.map(block => block.id)])));
const blueprint = generateBlueprint(project.buildingHeight, parts, recipes, analysis.silhouette, sideSilhouettes, palette);
await saveProjectBlueprint({ userId: project.userId, projectId, blueprint2d: { ...blueprint.blueprint2d, blockSummary: blueprint.blockSummary, materialSummary: blueprint.materialSummary, totalBlocks: blueprint.totalBlocks }, blueprint3d: blueprint.blueprint3d });
const providedIds = new Set((await db.select({ id: blocks.id }).from(blocks).where(like(blocks.description, "提供カタログキー:%"))).map(block => block.id));
const report = {
  projectId,
  twoDCells: blueprint.blueprint2d.cells.length,
  threeDVoxels: blueprint.blueprint3d.voxels.length,
  suppliedCatalogCells: blueprint.blueprint2d.cells.filter(cell => providedIds.has(cell.blockId)).length,
  suppliedCatalogVoxels: blueprint.blueprint3d.voxels.filter(voxel => providedIds.has(voxel.blockId)).length,
  suppliedCatalogBlocks: blueprint.blockSummary.filter(block => providedIds.has(block.blockId)).map(block => ({ name: block.blockName, count: block.count })),
};
await writeFile("/home/ubuntu/pocoa-modeller/verification-results/project-provided-palette-regeneration.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(0);

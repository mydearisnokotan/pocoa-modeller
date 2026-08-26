import { ENV } from "../server/_core/env.ts";
import { generateBlueprint } from "../server/designGeneration.ts";
import { getProjectDesignData, getRecipesForBlocks, getUserByOpenId, listCatalogBlocks, saveProjectBlueprint, saveProjectSelections } from "../server/db.ts";

const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const project = await getProjectDesignData(1, owner.id);
if (!project?.analysis) throw new Error("統合解析済みプロジェクトが見つかりません。");
const analysis = project.analysis;
const selected = project.selections.map(selection => ({ partId: selection.partId, blockId: selection.selectedBlockId ?? selection.candidateBlocks[0]?.id })).filter(item => Boolean(item.blockId));
await saveProjectSelections(project.id, selected);
const parts = project.selections.map(selection => {
  const selectedId = selected.find(item => item.partId === selection.partId)?.blockId;
  const block = selection.candidateBlocks.find(candidate => candidate?.id === selectedId);
  const sourcePart = analysis.parts.find(item => item.id === selection.partId);
  if (!block || !sourcePart) throw new Error(`部位「${selection.partName}」を再生成できません。`);
  return { partId: selection.partId, partName: selection.partName, layer: selection.layer, blockId: block.id, blockName: block.name, colorHex: block.colorHex, coveragePercent: sourcePart.coveragePercent };
});
const sideSilhouettes = analysis.silhouettes?.filter(item => item.view === "left" || item.view === "right" || item.view === "back").map(item => item.silhouette) ?? [];
const palette = await listCatalogBlocks({ limit: 300 });
const recipeBlocks = Array.from(new Set([...parts.map(part => part.blockId), ...palette.map(block => block.id)]));
const blueprint = generateBlueprint(project.buildingHeight, parts, await getRecipesForBlocks(recipeBlocks), analysis.silhouette, sideSilhouettes, palette);
await saveProjectBlueprint({ userId: owner.id, projectId: project.id, blueprint2d: { ...blueprint.blueprint2d, blockSummary: blueprint.blockSummary, materialSummary: blueprint.materialSummary, totalBlocks: blueprint.totalBlocks }, blueprint3d: blueprint.blueprint3d });
console.log(JSON.stringify({ projectId: project.id, gridSize: blueprint.blueprint2d.gridSize, cells: blueprint.blueprint2d.cells.length, voxels: blueprint.blueprint3d.voxels.length, sideViews: sideSilhouettes.length }));
process.exit(0);

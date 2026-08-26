import { readFile } from "node:fs/promises";
import { ENV } from "../server/_core/env.ts";
import { generateBlueprint } from "../server/designGeneration.ts";
import { getProjectDesignData, getRecipesForBlocks, getUserByOpenId, getUserProject, saveProjectAnalysis, saveProjectBlueprint } from "../server/db.ts";
import { extractSilhouette } from "../server/silhouette.ts";

const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const project = await getUserProject(1, owner.id);
if (!project?.analysis || !project.sourceImageKey || !project.sourceImageUrl) throw new Error("検証プロジェクトの解析データが見つかりません。");
const image = await readFile("/home/ubuntu/upload/アルセウス.jpeg");
const analysis = { ...project.analysis, silhouette: extractSilhouette(image, "image/jpeg") };
await saveProjectAnalysis({ userId: owner.id, projectId: project.id, sourceImageKey: project.sourceImageKey, sourceImageUrl: project.sourceImageUrl, analysis });

const designProject = await getProjectDesignData(project.id, owner.id);
if (!designProject) throw new Error("検証プロジェクトの設計データが見つかりません。");
const parts = designProject.selections.map(selection => {
  const selectedId = selection.selectedBlockId ?? selection.candidateBlocks[0]?.id;
  const block = selection.candidateBlocks.find(candidate => candidate?.id === selectedId);
  const sourcePart = analysis.parts.find(item => item.id === selection.partId);
  if (!block || !sourcePart) throw new Error(`部位「${selection.partName}」を再生成できません。`);
  return { partId: selection.partId, partName: selection.partName, layer: selection.layer, blockId: block.id, blockName: block.name, colorHex: block.colorHex, coveragePercent: sourcePart.coveragePercent };
});
const blueprint = generateBlueprint(designProject.buildingHeight, parts, await getRecipesForBlocks(parts.map(part => part.blockId)), analysis.silhouette);
await saveProjectBlueprint({ userId: owner.id, projectId: project.id, blueprint2d: { ...blueprint.blueprint2d, blockSummary: blueprint.blockSummary, materialSummary: blueprint.materialSummary, totalBlocks: blueprint.totalBlocks }, blueprint3d: blueprint.blueprint3d });
console.log(JSON.stringify({ projectId: project.id, silhouetteCells: analysis.silhouette.cells.length, gridSize: analysis.silhouette.gridSize, voxels: blueprint.blueprint3d.voxels.length }));
process.exit(0);

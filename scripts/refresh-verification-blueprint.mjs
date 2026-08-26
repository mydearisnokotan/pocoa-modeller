import { ENV } from "../server/_core/env.ts";
import { generateBlueprint } from "../server/designGeneration.ts";
import { getProjectDesignData, getRecipesForBlocks, getUserByOpenId, saveProjectBlueprint } from "../server/db.ts";

const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const project = await getProjectDesignData(1, owner.id);
if (!project) throw new Error("検証プロジェクトが見つかりません。");
const analysis = project.analysis;
const parts = project.selections.map(selection => {
  const selectedId = selection.selectedBlockId ?? selection.candidateBlocks[0]?.id;
  const block = selection.candidateBlocks.find(candidate => candidate?.id === selectedId);
  const sourcePart = analysis.parts.find(item => item.id === selection.partId);
  if (!block || !sourcePart) throw new Error(`部位「${selection.partName}」を再生成できません。`);
  return { partId: selection.partId, partName: selection.partName, layer: selection.layer, blockId: block.id, blockName: block.name, colorHex: block.colorHex, coveragePercent: sourcePart.coveragePercent };
});
const blueprint = generateBlueprint(project.buildingHeight, parts, await getRecipesForBlocks(parts.map(part => part.blockId)));
await saveProjectBlueprint({
  userId: owner.id,
  projectId: project.id,
  blueprint2d: { ...blueprint.blueprint2d, blockSummary: blueprint.blockSummary, materialSummary: blueprint.materialSummary, totalBlocks: blueprint.totalBlocks },
  blueprint3d: blueprint.blueprint3d,
});
console.log(JSON.stringify({ projectId: project.id, voxels: blueprint.blueprint3d.voxels.length, parts: [...new Set(blueprint.blueprint3d.voxels.map(voxel => voxel.partId))] }));
process.exit(0);

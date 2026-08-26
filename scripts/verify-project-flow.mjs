import { mkdir, readFile, writeFile } from "node:fs/promises";
import { ENV } from "../server/_core/env.ts";
import { createProjectCandidates } from "../server/candidateGeneration.ts";
import { generateBlueprint } from "../server/designGeneration.ts";
import * as db from "../server/db.ts";
import { storagePut } from "../server/storage.ts";

const resultsDir = "/home/ubuntu/pocoa-modeller/verification-results";
const analysis = JSON.parse(await readFile(`${resultsDir}/user-image-analysis.json`, "utf8"));
const sourceImage = await readFile("/home/ubuntu/upload/アルセウス.jpeg");
const owner = await db.getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用のログインユーザーが見つかりません。アプリで一度ログインしてください。");

const projectId = await db.createProject(owner.id, "通し検証：アルセウス（提供画像）", 100);
const storedSource = await storagePut(`projects/${owner.id}/source/project-${projectId}.jpeg`, sourceImage, "image/jpeg");
await db.saveProjectAnalysis({ userId: owner.id, projectId, sourceImageKey: storedSource.key, sourceImageUrl: storedSource.url, analysis });
await createProjectCandidates(projectId, analysis);

const projectData = await db.getProjectDesignData(projectId, owner.id);
if (!projectData?.selections.length) throw new Error("ブロック候補を生成できませんでした。");
const selections = projectData.selections.map(selection => {
  const candidate = selection.candidateBlocks[0];
  if (!candidate) throw new Error(`部位「${selection.partName}」の候補がありません。`);
  return { partId: selection.partId, blockId: candidate.id };
});
const selectedParts = projectData.selections.map(selection => {
  const blockId = selections.find(item => item.partId === selection.partId)?.blockId;
  const block = selection.candidateBlocks.find(candidate => candidate?.id === blockId);
  const part = analysis.parts.find(item => item.id === selection.partId);
  if (!block || !part) throw new Error(`部位「${selection.partName}」の設計データを準備できませんでした。`);
  return { partId: selection.partId, partName: selection.partName, layer: selection.layer, blockId: block.id, blockName: block.name, colorHex: block.colorHex, coveragePercent: part.coveragePercent };
});

await db.saveProjectSelections(projectId, selections);
const blueprint = generateBlueprint(projectData.buildingHeight, selectedParts, await db.getRecipesForBlocks(selectedParts.map(part => part.blockId)));
await db.saveProjectBlueprint({
  userId: owner.id,
  projectId,
  blueprint2d: { ...blueprint.blueprint2d, blockSummary: blueprint.blockSummary, materialSummary: blueprint.materialSummary, totalBlocks: blueprint.totalBlocks },
  blueprint3d: blueprint.blueprint3d,
});

const verificationPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9FhNQAAAAASUVORK5CYII=", "base64");
const [stored2d, stored3d] = await Promise.all([
  storagePut(`projects/${owner.id}/exports/project-${projectId}-2d-verification.png`, verificationPng, "image/png"),
  storagePut(`projects/${owner.id}/exports/project-${projectId}-3d-verification.png`, verificationPng, "image/png"),
]);
await db.saveProjectPngs({ userId: owner.id, projectId, blueprint2dImageKey: stored2d.key, blueprint2dImageUrl: stored2d.url, blueprint3dImageKey: stored3d.key, blueprint3dImageUrl: stored3d.url });

const reloaded = await db.getProjectDesignData(projectId, owner.id);
if (!reloaded?.blueprint2d || !reloaded.blueprint3d || !reloaded.blueprint2dImageUrl || !reloaded.blueprint3dImageUrl) {
  throw new Error("保存済みプロジェクトの再読み込み検証に失敗しました。");
}
const proof = { projectId, sourceImageUrl: reloaded.sourceImageUrl, selectedParts: selections.length, totalBlocks: blueprint.totalBlocks, materials: blueprint.materialSummary.length, blueprint2dImageUrl: reloaded.blueprint2dImageUrl, blueprint3dImageUrl: reloaded.blueprint3dImageUrl, status: reloaded.status };
await mkdir(resultsDir, { recursive: true });
await writeFile(`${resultsDir}/project-flow-result.json`, `${JSON.stringify(proof, null, 2)}\n`, "utf8");
console.log(JSON.stringify(proof, null, 2));

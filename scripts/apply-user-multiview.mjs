import { readFile } from "node:fs/promises";
import { ENV } from "../server/_core/env.ts";
import { analyzeBuildingImages } from "../server/buildingAnalysis.ts";
import { createProjectCandidates } from "../server/candidateGeneration.ts";
import { addProjectReference, getUserByOpenId, getUserProject, saveProjectAnalysis } from "../server/db.ts";
import { storagePut } from "../server/storage.ts";

const files = [
  { path: "/home/ubuntu/upload/Gemini_Generated_Image_cpc66zcpc66zcpc6.png", name: "アルセウス_左右比較.png", view: "left", mime: "image/png" },
  { path: "/home/ubuntu/upload/Gemini_Generated_Image_9dbbec9dbbec9dbb.jpeg", name: "アルセウス_側面資料.jpeg", view: "right", mime: "image/jpeg" },
];
const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const project = await getUserProject(1, owner.id);
if (!project?.sourceImageKey || !project.sourceImageUrl) throw new Error("対象プロジェクトが見つかりません。");
const references = [];
for (const [index, source] of files.entries()) {
  const bytes = await readFile(source.path);
  const dataUrl = `data:${source.mime};base64,${bytes.toString("base64")}`;
  const stored = await storagePut(`projects/${owner.id}/references/project-${project.id}-multiview-${index}.${source.mime.split("/")[1]}`, bytes, source.mime);
  await addProjectReference({ userId: owner.id, projectId: project.id, view: source.view, imageKey: stored.key, imageUrl: stored.url, originalName: source.name });
  references.push({ dataUrl, view: source.view });
}
const initial = await readFile("/home/ubuntu/upload/アルセウス.jpeg");
const analysis = await analyzeBuildingImages([{ dataUrl: `data:image/jpeg;base64,${initial.toString("base64")}`, view: "front" }, ...references]);
await saveProjectAnalysis({ userId: owner.id, projectId: project.id, sourceImageKey: project.sourceImageKey, sourceImageUrl: project.sourceImageUrl, analysis });
await createProjectCandidates(project.id, analysis);
console.log(JSON.stringify({ projectId: project.id, views: analysis.silhouettes?.map(item => item.view) ?? [], parts: analysis.parts.map(part => part.name) }));
process.exit(0);

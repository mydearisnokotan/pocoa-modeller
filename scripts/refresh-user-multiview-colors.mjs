import { readFile } from "node:fs/promises";
import { ENV } from "../server/_core/env.ts";
import { analyzeBuildingImages } from "../server/buildingAnalysis.ts";
import { createProjectCandidates } from "../server/candidateGeneration.ts";
import { getUserByOpenId, getUserProject, saveProjectAnalysis } from "../server/db.ts";

const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const project = await getUserProject(1, owner.id);
if (!project?.sourceImageKey || !project.sourceImageUrl) throw new Error("対象プロジェクトが見つかりません。");
const sources = [
  { path: "/home/ubuntu/upload/アルセウス.jpeg", view: "front", mime: "image/jpeg" },
  { path: "/home/ubuntu/upload/Gemini_Generated_Image_cpc66zcpc66zcpc6.png", view: "left", mime: "image/png" },
  { path: "/home/ubuntu/upload/Gemini_Generated_Image_9dbbec9dbbec9dbb.jpeg", view: "right", mime: "image/jpeg" },
];
const references = await Promise.all(sources.map(async source => ({ dataUrl: `data:${source.mime};base64,${(await readFile(source.path)).toString("base64")}`, view: source.view })));
const analysis = await analyzeBuildingImages(references);
await saveProjectAnalysis({ userId: owner.id, projectId: project.id, sourceImageKey: project.sourceImageKey, sourceImageUrl: project.sourceImageUrl, analysis });
await createProjectCandidates(project.id, analysis);
console.log(JSON.stringify({ projectId: project.id, colors: analysis.colorPalette, silhouettes: analysis.silhouettes?.map(item => item.view) }));
process.exit(0);

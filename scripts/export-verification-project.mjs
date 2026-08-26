import { writeFile } from "node:fs/promises";
import { ENV } from "../server/_core/env.ts";
import { getProjectDesignData, getUserByOpenId } from "../server/db.ts";

const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const project = await getProjectDesignData(1, owner.id);
if (!project?.blueprint2d || !project.blueprint3d) throw new Error("保存済み設計図が見つかりません。");
await writeFile("/home/ubuntu/pocoa-modeller/verification-results/project-1-design.json", `${JSON.stringify({ blueprint2d: project.blueprint2d, blueprint3d: project.blueprint3d }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ cells: project.blueprint2d.cells?.length ?? 0, voxels: project.blueprint3d.voxels?.length ?? 0 }));
process.exit(0);

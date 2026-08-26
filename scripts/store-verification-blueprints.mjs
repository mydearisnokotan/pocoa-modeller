import { readFile, writeFile } from "node:fs/promises";
import { ENV } from "../server/_core/env.ts";
import { getUserByOpenId, saveProjectPngs } from "../server/db.ts";
import { storagePut } from "../server/storage.ts";

const owner = await getUserByOpenId(ENV.ownerOpenId);
if (!owner) throw new Error("検証用ユーザーが見つかりません。");
const base = "/home/ubuntu/pocoa-modeller/verification-results";
const [png2d, png3d] = await Promise.all([readFile(`${base}/project-1-2d.png`), readFile(`${base}/project-1-3d.png`)]);
const [stored2d, stored3d] = await Promise.all([
  storagePut(`projects/${owner.id}/exports/project-1-2d.png`, png2d, "image/png"),
  storagePut(`projects/${owner.id}/exports/project-1-3d.png`, png3d, "image/png"),
]);
await saveProjectPngs({ userId: owner.id, projectId: 1, blueprint2dImageKey: stored2d.key, blueprint2dImageUrl: stored2d.url, blueprint3dImageKey: stored3d.key, blueprint3dImageUrl: stored3d.url });
await writeFile(`${base}/project-flow-result.json`, `${JSON.stringify({ projectId: 1, blueprint2dImageUrl: stored2d.url, blueprint3dImageUrl: stored3d.url, status: "designed" }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ blueprint2dImageUrl: stored2d.url, blueprint3dImageUrl: stored3d.url }));
process.exit(0);

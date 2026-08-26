import { readFile, writeFile } from "node:fs/promises";
import { getDb } from "../server/db.ts";
import { extractCatalogLocations } from "../server/providedCatalog.ts";

const catalog = JSON.parse(await readFile("/home/ubuntu/upload/block.json", "utf8"));
const db = await getDb();
if (!db) throw new Error("データベースへ接続できません。");

const blockRelatedLocations = new Map();
for (const block of catalog) {
  const locations = extractCatalogLocations(block);
  if (!locations.length) continue;
  blockRelatedLocations.set(block.block_key, { name: block.name, locations });
}

const report = { blockRelatedLocations: Object.fromEntries(blockRelatedLocations), note: "提供JSONの地点はブロック入手・レシピ解放の関連地点であり、素材の直接採取場所としては登録しません。" };
await writeFile("/home/ubuntu/pocoa-modeller/verification-results/provided-catalog-locations.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ blocksWithRelatedLocations: blockRelatedLocations.size }, null, 2));
process.exit(0);

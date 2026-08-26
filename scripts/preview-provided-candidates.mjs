import { readFile, writeFile } from "node:fs/promises";
import { and, eq, like } from "drizzle-orm";
import { getDb } from "../server/db.ts";
import { blocks, projects } from "../drizzle/schema.ts";

const projectId = 1;
const db = await getDb();
if (!db) throw new Error("データベースへ接続できません。");
const [project] = await db.select({ analysis: projects.analysis }).from(projects).where(eq(projects.id, projectId)).limit(1);
if (!project?.analysis) throw new Error("検証対象プロジェクトの解析結果が見つかりません。");
const providedBlocks = await db.select({ id: blocks.id, name: blocks.name, category: blocks.category, colorHex: blocks.colorHex, imageUrl: blocks.imageUrl }).from(blocks).where(and(eq(blocks.isActive, true), like(blocks.description, "提供カタログキー:%")));

function rgb(hex) {
  const match = hex.match(/^#?([0-9a-f]{6})$/i);
  const value = match?.[1] ?? "808080";
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}
function distance(a, b) {
  const [ar, ag, ab] = rgb(a); const [br, bg, bb] = rgb(b);
  return Math.hypot(ar - br, ag - bg, ab - bb);
}

const analysis = project.analysis;
const candidates = analysis.parts.map(part => ({
  partId: part.id,
  partName: part.name,
  targetColor: part.dominantColor,
  closestProvidedBlocks: providedBlocks.map(block => ({ ...block, distance: Number(distance(part.dominantColor, block.colorHex).toFixed(1)) })).sort((a, b) => a.distance - b.distance).slice(0, 5),
}));
const report = { projectId, providedCatalogBlocks: providedBlocks.length, parts: candidates };
await writeFile("/home/ubuntu/pocoa-modeller/verification-results/provided-catalog-candidate-preview.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(0);

import { writeFile } from "node:fs/promises";
import { eq, like } from "drizzle-orm";
import { getDb } from "../server/db.ts";
import { createProjectCandidates } from "../server/candidateGeneration.ts";
import { blocks, projectSelections, projects } from "../drizzle/schema.ts";

const projectId = 1;
const db = await getDb();
if (!db) throw new Error("データベースへ接続できません。");
const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
if (!project?.analysis) throw new Error("プロジェクト解析情報が見つかりません。");
const savedLegend = Array.isArray(project.blueprint2d?.legend) ? project.blueprint2d.legend : [];
const currentSelections = await db.select().from(projectSelections).where(eq(projectSelections.projectId, projectId));
for (const selection of currentSelections.filter(selection => !selection.selectedBlockId)) {
  const saved = savedLegend.find(item => item?.partId === selection.partId && typeof item.blockId === "number");
  if (saved) await db.update(projectSelections).set({ selectedBlockId: saved.blockId }).where(eq(projectSelections.id, selection.id));
}
await createProjectCandidates(projectId, project.analysis, { preserveExistingSelection: true });
const selections = await db.select().from(projectSelections).where(eq(projectSelections.projectId, projectId));
const providedBlocks = await db.select({ id: blocks.id }).from(blocks).where(like(blocks.description, "提供カタログキー:%"));
const providedIds = new Set(providedBlocks.map(block => block.id));
const report = {
  projectId,
  parts: selections.length,
  selectedPartsRetained: selections.filter(selection => selection.selectedBlockId).length,
  partsWithProvidedCatalogCandidate: selections.filter(selection => Array.isArray(selection.candidateBlockIds) && selection.candidateBlockIds.some(id => typeof id === "number" && providedIds.has(id))).length,
};
await writeFile("/home/ubuntu/pocoa-modeller/verification-results/project-provided-candidate-refresh.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(0);

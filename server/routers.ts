import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";
import { ensureCatalogSeeded } from "./catalogSeed";
import { analyzeBuildingImage, analyzeBuildingImages, parseImageDataUrl, type BuildingAnalysis } from "./buildingAnalysis";
import { createProjectCandidates } from "./candidateGeneration";
import { generateBlueprint, type DesignPart } from "./designGeneration";
import { storageGetSignedUrl, storagePut } from "./storage";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { canAddReferenceCount, collectReferencesForAnalysis, type ProjectReferenceView, type StoredReferenceForAnalysis } from "./projectReferenceAnalysis";

type ProjectWithReferences = {
  sourceImageKey: string | null;
  sourceImageUrl: string | null;
  references: StoredReferenceForAnalysis[];
};

async function analyzeStoredProjectReferences(project: ProjectWithReferences) {
  if (!project.sourceImageKey || !project.sourceImageUrl) throw new Error("初回参照画像が見つかりません。");
  const references = collectReferencesForAnalysis(project.references, { imageKey: project.sourceImageKey, imageUrl: project.sourceImageUrl, view: "front" });
  const inputs = await Promise.all(references.map(async reference => {
    const signedUrl = await storageGetSignedUrl(reference.imageKey);
    const response = await fetch(signedUrl);
    if (!response.ok) throw new Error("保存済みの参照画像を取得できませんでした。");
    const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
    return { dataUrl: `data:${mimeType};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`, view: reference.view as ProjectReferenceView };
  }));
  return analyzeBuildingImages(inputs);
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure
      .input(z.object({
        query: z.string().trim().max(80).optional(),
        category: z.string().trim().max(60).optional(),
        color: z.string().trim().max(80).optional(),
        limit: z.number().int().min(1).max(200).optional(),
      }).optional())
      .query(async ({ input }) => {
        await ensureCatalogSeeded();
        return db.listCatalogBlocks(input);
      }),
    filters: publicProcedure.query(async () => {
      await ensureCatalogSeeded();
      return { categories: await db.listCategories() };
    }),
    adminData: adminProcedure.query(async () => {
      await ensureCatalogSeeded();
      return db.getCatalogAdminData();
    }),
    saveBlock: adminProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        name: z.string().trim().min(1).max(140),
        colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        colorName: z.string().trim().min(1).max(80),
        category: z.string().trim().min(1).max(60),
        description: z.string().trim().max(1000).nullable().optional(),
        imageUrl: z.string().url().nullable().optional(),
        isActive: z.boolean().optional(),
        materials: z.array(z.object({ materialId: z.number().int().positive(), quantity: z.number().int().min(1).max(999) })).min(1).max(12),
      }))
      .mutation(async ({ input }) => {
        const id = await db.saveBlock(input);
        await db.replaceBlockMaterials(id, input.materials);
        return { id };
      }),
    archiveBlock: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.removeBlock(input.id);
        return { success: true };
      }),
    saveMiningLocation: adminProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        name: z.string().trim().min(1).max(120),
        description: z.string().trim().max(1000).nullable().optional(),
        imageUrl: z.string().url().nullable().optional(),
      }))
      .mutation(async ({ input }) => ({ id: await db.saveMiningLocation(input) })),
    saveMaterial: adminProcedure
      .input(z.object({
        id: z.number().int().positive().optional(),
        name: z.string().trim().min(1).max(120),
        description: z.string().trim().max(1000).nullable().optional(),
        imageUrl: z.string().url().nullable().optional(),
        miningLocationId: z.number().int().positive().nullable().optional(),
      }))
      .mutation(async ({ input }) => ({ id: await db.saveMaterial(input) })),
  }),
  workspace: router({
    analyze: protectedProcedure
      .input(z.object({
        title: z.string().trim().min(1).max(160),
        buildingHeight: z.number().int().min(20).max(500),
        fileName: z.string().trim().min(1).max(200),
        imageDataUrl: z.string().max(8_000_000),
      }))
      .mutation(async ({ ctx, input }) => {
        const image = parseImageDataUrl(input.imageDataUrl);
        const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType.split("/")[1];
        const projectId = await db.createProject(ctx.user.id, input.title, input.buildingHeight);
        const stored = await storagePut(`projects/${ctx.user.id}/references/project-${projectId}.${extension}`, image.bytes, image.mimeType);
        const analysis = await analyzeBuildingImage(input.imageDataUrl);
        await db.saveProjectAnalysis({ userId: ctx.user.id, projectId, sourceImageKey: stored.key, sourceImageUrl: stored.url, analysis });
        await db.addProjectReference({ userId: ctx.user.id, projectId, view: "front", imageKey: stored.key, imageUrl: stored.url, originalName: input.fileName });
        await createProjectCandidates(projectId, analysis);
        return { projectId, sourceImageUrl: stored.url, analysis };
      }),
  }),
  projects: router({
    list: protectedProcedure.query(({ ctx }) => db.listUserProjects(ctx.user.id)),
    get: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const project = await db.getUserProject(input.id, ctx.user.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        return project;
      }),
    designData: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const project = await db.getProjectDesignData(input.id, ctx.user.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        return project;
      }),
    addReferences: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive(),
        references: z.array(z.object({
          fileName: z.string().trim().min(1).max(200),
          view: z.enum(["front", "back", "left", "right", "top", "other"]),
          imageDataUrl: z.string().max(8_000_000),
        })).min(1).max(5),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getUserProject(input.projectId, ctx.user.id);
        if (!project || !project.sourceImageKey || !project.sourceImageUrl) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const currentReferences = collectReferencesForAnalysis(project.references, { imageKey: project.sourceImageKey, imageUrl: project.sourceImageUrl, view: "front" });
        if (!canAddReferenceCount(currentReferences.length, input.references.length)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "参照画像は初回画像を含めて最大6枚までです。追加数を減らしてください。" });
        }
        const uploads = await Promise.all(input.references.map(async (reference, index) => {
          const image = parseImageDataUrl(reference.imageDataUrl);
          const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType.split("/")[1];
          const stored = await storagePut(`projects/${ctx.user.id}/references/project-${input.projectId}-${Date.now()}-${index}.${extension}`, image.bytes, image.mimeType);
          await db.addProjectReference({ userId: ctx.user.id, projectId: input.projectId, view: reference.view, imageKey: stored.key, imageUrl: stored.url, originalName: reference.fileName });
          return reference;
        }));
        const updatedProject = await db.getUserProject(input.projectId, ctx.user.id);
        if (!updatedProject) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const analysis = await analyzeStoredProjectReferences(updatedProject);
        await db.saveProjectAnalysis({ userId: ctx.user.id, projectId: input.projectId, sourceImageKey: project.sourceImageKey, sourceImageUrl: project.sourceImageUrl, analysis });
        await createProjectCandidates(input.projectId, analysis);
        return { analysis, references: (await db.getUserProject(input.projectId, ctx.user.id))?.references ?? [] };
      }),
    removeReference: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), referenceId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getUserProject(input.projectId, ctx.user.id);
        if (!project || !project.sourceImageKey || !project.sourceImageUrl) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const target = project.references.find(reference => reference.id === input.referenceId);
        if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "参照画像が見つかりません。" });
        if (target.imageKey === project.sourceImageKey) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "初回参照画像は削除できません。新しいプロジェクトで画像を変更してください。" });
        }
        await db.removeProjectReference(ctx.user.id, input.projectId, input.referenceId);
        const updatedProject = await db.getUserProject(input.projectId, ctx.user.id);
        if (!updatedProject) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const analysis = await analyzeStoredProjectReferences(updatedProject);
        await db.saveProjectAnalysis({ userId: ctx.user.id, projectId: input.projectId, sourceImageKey: project.sourceImageKey, sourceImageUrl: project.sourceImageUrl, analysis });
        await createProjectCandidates(input.projectId, analysis);
        return { success: true, analysis };
      }),
    generateDesign: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), selections: z.array(z.object({ partId: z.string().min(1), blockId: z.number().int().positive() })).min(1).max(100) }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getProjectDesignData(input.projectId, ctx.user.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const picked = new Map(input.selections.map(item => [item.partId, item.blockId]));
        const analysis = project.analysis as BuildingAnalysis | null;
        const parts: DesignPart[] = project.selections.map(selection => {
          const blockId = picked.get(selection.partId);
          const allowed = selection.candidateBlocks.find(block => block?.id === blockId);
          if (!blockId || !allowed) throw new TRPCError({ code: "BAD_REQUEST", message: `部位「${selection.partName}」のブロック候補を選択してください。` });
          const coveragePercent = analysis?.parts?.find(part => part.id === selection.partId)?.coveragePercent ?? 10;
          return { partId: selection.partId, partName: selection.partName, layer: selection.layer, blockId: allowed.id, blockName: allowed.name, colorHex: allowed.colorHex, coveragePercent };
        });
        await db.saveProjectSelections(input.projectId, input.selections);
        const sideSilhouettes = analysis?.silhouettes?.filter(item => item.view === "left" || item.view === "right" || item.view === "back").map(item => item.silhouette) ?? [];
        const palette = await db.listCatalogBlocks({ limit: 600 });
        const recipeBlockIds = Array.from(new Set([...parts.map(part => part.blockId), ...palette.map(block => block.id)]));
        const blueprint = generateBlueprint(project.buildingHeight, parts, await db.getRecipesForBlocks(recipeBlockIds), analysis?.silhouette, sideSilhouettes, palette);
        await db.saveProjectBlueprint({
          userId: ctx.user.id,
          projectId: input.projectId,
          blueprint2d: { ...blueprint.blueprint2d, blockSummary: blueprint.blockSummary, materialSummary: blueprint.materialSummary, totalBlocks: blueprint.totalBlocks },
          blueprint3d: blueprint.blueprint3d,
        });
        return blueprint;
      }),
    savePngs: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), blueprint2dDataUrl: z.string().max(8_000_000), blueprint3dDataUrl: z.string().max(8_000_000) }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getUserProject(input.projectId, ctx.user.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const [image2d, image3d] = [parseImageDataUrl(input.blueprint2dDataUrl), parseImageDataUrl(input.blueprint3dDataUrl)];
        if (image2d.mimeType !== "image/png" || image3d.mimeType !== "image/png") throw new TRPCError({ code: "BAD_REQUEST", message: "PNG形式で出力してください。" });
        const [stored2d, stored3d] = await Promise.all([
          storagePut(`projects/${ctx.user.id}/exports/project-${input.projectId}-2d.png`, image2d.bytes, "image/png"),
          storagePut(`projects/${ctx.user.id}/exports/project-${input.projectId}-3d.png`, image3d.bytes, "image/png"),
        ]);
        await db.saveProjectPngs({ userId: ctx.user.id, projectId: input.projectId, blueprint2dImageKey: stored2d.key, blueprint2dImageUrl: stored2d.url, blueprint3dImageKey: stored3d.key, blueprint3dImageUrl: stored3d.url });
        return { blueprint2dImageUrl: stored2d.url, blueprint3dImageUrl: stored3d.url };
      }),
  }),
});

export type AppRouter = typeof appRouter;

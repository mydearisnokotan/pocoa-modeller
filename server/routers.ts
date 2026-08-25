import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";
import { ensureCatalogSeeded } from "./catalogSeed";
import { analyzeBuildingImage, parseImageDataUrl } from "./buildingAnalysis";
import { createProjectCandidates } from "./candidateGeneration";
import { generateBlueprint, type DesignPart } from "./designGeneration";
import { storagePut } from "./storage";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

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
    generateDesign: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), selections: z.array(z.object({ partId: z.string().min(1), blockId: z.number().int().positive() })).min(1).max(100) }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getProjectDesignData(input.projectId, ctx.user.id);
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "プロジェクトが見つかりません。" });
        const picked = new Map(input.selections.map(item => [item.partId, item.blockId]));
        const analysis = project.analysis as { parts?: Array<{ id: string; coveragePercent: number }> } | null;
        const parts: DesignPart[] = project.selections.map(selection => {
          const blockId = picked.get(selection.partId);
          const allowed = selection.candidateBlocks.find(block => block?.id === blockId);
          if (!blockId || !allowed) throw new TRPCError({ code: "BAD_REQUEST", message: `部位「${selection.partName}」のブロック候補を選択してください。` });
          const coveragePercent = analysis?.parts?.find(part => part.id === selection.partId)?.coveragePercent ?? 10;
          return { partId: selection.partId, partName: selection.partName, layer: selection.layer, blockId: allowed.id, blockName: allowed.name, colorHex: allowed.colorHex, coveragePercent };
        });
        await db.saveProjectSelections(input.projectId, input.selections);
        const blueprint = generateBlueprint(project.buildingHeight, parts, await db.getRecipesForBlocks(parts.map(part => part.blockId)));
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

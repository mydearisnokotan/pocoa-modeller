import { and, desc, eq, inArray, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, blockMaterials, blocks, materials, miningLocations, projectReferences, projects, projectSelections, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type CatalogFilters = { query?: string; category?: string; color?: string; limit?: number };

export async function listCatalogBlocks(filters: CatalogFilters = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(blocks.isActive, true)];
  if (filters.category && filters.category !== "すべて") conditions.push(eq(blocks.category, filters.category));
  if (filters.color) conditions.push(or(like(blocks.colorName, `%${filters.color}%`), like(blocks.colorHex, `%${filters.color}%`))!);
  if (filters.query) conditions.push(or(like(blocks.name, `%${filters.query}%`), like(blocks.category, `%${filters.query}%`), like(blocks.colorName, `%${filters.query}%`))!);
  return db.select().from(blocks).where(and(...conditions)).limit(filters.limit ?? 100);
}

export async function listCategories() {
  const db = await getDb();
  if (!db) return [];
  const results = await db.selectDistinct({ category: blocks.category }).from(blocks).where(eq(blocks.isActive, true));
  return results.map(row => row.category).sort();
}

export type BlockInput = {
  id?: number;
  name: string;
  colorHex: string;
  colorName: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

export async function saveBlock(input: BlockInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const values = {
    name: input.name,
    colorHex: input.colorHex,
    colorName: input.colorName,
    category: input.category,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    isActive: input.isActive ?? true,
  };
  if (input.id) {
    await db.update(blocks).set(values).where(eq(blocks.id, input.id));
    return input.id;
  }
  const result = await db.insert(blocks).values(values);
  return Number(result[0].insertId);
}

export async function removeBlock(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(blocks).set({ isActive: false }).where(eq(blocks.id, id));
}

export async function setBlockMaterial(blockId: number, materialId: number, quantity = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.insert(blockMaterials).values({ blockId, materialId, quantity }).onDuplicateKeyUpdate({
    set: { quantity },
  });
}

export async function replaceBlockMaterials(blockId: number, items: Array<{ materialId: number; quantity: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.delete(blockMaterials).where(eq(blockMaterials.blockId, blockId));
  await db.insert(blockMaterials).values(items.map(item => ({ blockId, materialId: item.materialId, quantity: item.quantity })));
}

export type MiningLocationInput = {
  id?: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export async function saveMiningLocation(input: MiningLocationInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const values = { name: input.name, description: input.description ?? null, imageUrl: input.imageUrl ?? null };
  if (input.id) {
    await db.update(miningLocations).set(values).where(eq(miningLocations.id, input.id));
    return input.id;
  }
  const result = await db.insert(miningLocations).values(values);
  return Number(result[0].insertId);
}

export type MaterialInput = {
  id?: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  miningLocationId?: number | null;
};

export async function saveMaterial(input: MaterialInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const values = {
    name: input.name,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    miningLocationId: input.miningLocationId ?? null,
  };
  if (input.id) {
    await db.update(materials).set(values).where(eq(materials.id, input.id));
    return input.id;
  }
  const result = await db.insert(materials).values(values);
  return Number(result[0].insertId);
}

export async function getCatalogAdminData() {
  const db = await getDb();
  if (!db) return { blocks: [], materials: [], locations: [], recipes: [] };
  const [allBlocks, allMaterials, allLocations, allRecipes] = await Promise.all([
    db.select().from(blocks).orderBy(blocks.category, blocks.name).limit(300),
    db.select().from(materials).orderBy(materials.name),
    db.select().from(miningLocations).orderBy(miningLocations.name),
    db.select({ blockId: blockMaterials.blockId, materialId: materials.id, materialName: materials.name, quantity: blockMaterials.quantity }).from(blockMaterials).innerJoin(materials, eq(blockMaterials.materialId, materials.id)),
  ]);
  return { blocks: allBlocks, materials: allMaterials, locations: allLocations, recipes: allRecipes };
}

export async function listUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
}

export async function getUserProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.userId, userId))).limit(1);
  if (!result[0]) return undefined;
  const [selections, references] = await Promise.all([
    db.select().from(projectSelections).where(eq(projectSelections.projectId, projectId)).orderBy(projectSelections.sortOrder),
    db.select().from(projectReferences).where(eq(projectReferences.projectId, projectId)).orderBy(projectReferences.sortOrder),
  ]);
  return { ...result[0], selections, references };
}

export type ProjectReferenceInput = {
  userId: number;
  projectId: number;
  view: "front" | "back" | "left" | "right" | "top" | "other";
  imageKey: string;
  imageUrl: string;
  originalName: string;
};

export async function addProjectReference(input: ProjectReferenceInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const owner = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId))).limit(1);
  if (!owner[0]) throw new Error("プロジェクトが見つかりません。");
  const existing = await db.select({ id: projectReferences.id }).from(projectReferences).where(eq(projectReferences.projectId, input.projectId));
  const result = await db.insert(projectReferences).values({ ...input, sortOrder: existing.length });
  return Number(result[0].insertId);
}

export async function removeProjectReference(userId: number, projectId: number, referenceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const owned = await db.select({ id: projectReferences.id }).from(projectReferences).innerJoin(projects, eq(projectReferences.projectId, projects.id)).where(and(eq(projectReferences.id, referenceId), eq(projectReferences.projectId, projectId), eq(projects.userId, userId))).limit(1);
  if (!owned[0]) throw new Error("参照画像が見つかりません。");
  await db.delete(projectReferences).where(eq(projectReferences.id, referenceId));
}

export async function createProject(userId: number, title: string, buildingHeight: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(projects).values({ userId, title, buildingHeight });
  return Number(result[0].insertId);
}

export async function saveProjectAnalysis(input: {
  userId: number;
  projectId: number;
  sourceImageKey: string;
  sourceImageUrl: string;
  analysis: unknown;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(projects).set({
    sourceImageKey: input.sourceImageKey,
    sourceImageUrl: input.sourceImageUrl,
    analysis: input.analysis,
    blueprint2d: null,
    blueprint3d: null,
    blueprint2dImageKey: null,
    blueprint2dImageUrl: null,
    blueprint3dImageKey: null,
    blueprint3dImageUrl: null,
    status: "analyzed",
  }).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)));
}

const numberList = (value: unknown) => Array.isArray(value) ? value.filter((item): item is number => typeof item === "number") : [];

export async function getProjectDesignData(projectId: number, userId: number) {
  const project = await getUserProject(projectId, userId);
  if (!project) return undefined;
  const candidateIds = Array.from(new Set(project.selections.flatMap(selection => numberList(selection.candidateBlockIds))));
  const db = await getDb();
  if (!db) return undefined;
  const candidateBlocks = candidateIds.length ? await db.select().from(blocks).where(inArray(blocks.id, candidateIds)) : [];
  const candidatesById = new Map(candidateBlocks.map(block => [block.id, block]));
  return {
    ...project,
    selections: project.selections.map(selection => ({
      ...selection,
      candidateBlocks: numberList(selection.candidateBlockIds).map(id => candidatesById.get(id)).filter(Boolean),
    })),
  };
}

export async function saveProjectSelections(projectId: number, selected: Array<{ partId: string; blockId: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  for (const item of selected) {
    await db.update(projectSelections).set({ selectedBlockId: item.blockId }).where(and(eq(projectSelections.projectId, projectId), eq(projectSelections.partId, item.partId)));
  }
}

export async function getRecipesForBlocks(blockIds: number[]) {
  const db = await getDb();
  if (!db || !blockIds.length) return [];
  return db.select({
    blockId: blockMaterials.blockId,
    materialId: materials.id,
    materialName: materials.name,
    quantity: blockMaterials.quantity,
    materialDescription: materials.description,
    locationName: miningLocations.name,
    locationDescription: miningLocations.description,
    locationImageUrl: miningLocations.imageUrl,
  }).from(blockMaterials).innerJoin(materials, eq(blockMaterials.materialId, materials.id)).leftJoin(miningLocations, eq(materials.miningLocationId, miningLocations.id)).where(inArray(blockMaterials.blockId, blockIds));
}

export async function saveProjectBlueprint(input: { userId: number; projectId: number; blueprint2d: unknown; blueprint3d: unknown }) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(projects).set({ blueprint2d: input.blueprint2d, blueprint3d: input.blueprint3d, status: "designed" }).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)));
}

export async function saveProjectPngs(input: { userId: number; projectId: number; blueprint2dImageKey: string; blueprint2dImageUrl: string; blueprint3dImageKey: string; blueprint3dImageUrl: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(projects).set({
    blueprint2dImageKey: input.blueprint2dImageKey, blueprint2dImageUrl: input.blueprint2dImageUrl,
    blueprint3dImageKey: input.blueprint3dImageKey, blueprint3dImageUrl: input.blueprint3dImageUrl,
  }).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)));
}

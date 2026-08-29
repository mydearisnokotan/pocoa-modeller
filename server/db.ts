import { and, desc, eq, inArray, isNotNull, isNull, like, ne, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  User,
  blockMaterials,
  blocks,
  materials,
  miningLocations,
  projectReferences,
  projects,
  projectSelections,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

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

// ---------------------------------------------------------------------------
// IN-MEMORY FALLBACK STORE (Used when DATABASE_URL is not provided or offline)
// ---------------------------------------------------------------------------
type MemoryUser = User;
type MemoryBlock = typeof blocks.$inferSelect;
type MemoryMaterial = typeof materials.$inferSelect;
type MemoryLocation = typeof miningLocations.$inferSelect;
type MemoryBlockMaterial = typeof blockMaterials.$inferSelect;
type MemoryProject = typeof projects.$inferSelect;
type MemoryProjectReference = typeof projectReferences.$inferSelect;
type MemoryProjectSelection = typeof projectSelections.$inferSelect;

export const memStore = {
  users: new Map<number, MemoryUser>(),
  usersByOpenId: new Map<string, MemoryUser>(),
  blocks: new Map<number, MemoryBlock>(),
  materials: new Map<number, MemoryMaterial>(),
  miningLocations: new Map<number, MemoryLocation>(),
  blockMaterials: [] as MemoryBlockMaterial[],
  projects: new Map<number, MemoryProject>(),
  projectReferences: new Map<number, MemoryProjectReference>(),
  projectSelections: new Map<number, MemoryProjectSelection>(),
  nextId: {
    user: 1,
    block: 1,
    material: 1,
    miningLocation: 1,
    blockMaterial: 1,
    project: 1,
    projectReference: 1,
    projectSelection: 1,
  },
};

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (db) {
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
        values.role = "admin";
        updateSet.role = "admin";
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
      return;
    } catch (error) {
      console.error("[Database] Failed to upsert user to MySQL:", error);
    }
  }

  // In-memory fallback
  let existing = memStore.usersByOpenId.get(user.openId);
  const now = new Date();
  if (!existing) {
    const id = memStore.nextId.user++;
    existing = {
      id,
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      role: (user.role as "admin" | "user") ?? (user.openId === ENV.ownerOpenId ? "admin" : "admin"),
      createdAt: now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn ?? now,
    };
    memStore.users.set(id, existing);
    memStore.usersByOpenId.set(user.openId, existing);
  } else {
    if (user.name !== undefined) existing.name = user.name ?? null;
    if (user.email !== undefined) existing.email = user.email ?? null;
    if (user.loginMethod !== undefined) existing.loginMethod = user.loginMethod ?? null;
    if (user.role !== undefined) existing.role = user.role as "admin" | "user";
    existing.lastSignedIn = user.lastSignedIn ?? now;
    existing.updatedAt = now;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
      if (result.length > 0) return result[0];
    } catch (error) {
      console.warn("[Database] Failed to get user from MySQL:", error);
    }
  }

  return memStore.usersByOpenId.get(openId);
}

export type CatalogFilters = {
  query?: string;
  category?: string;
  color?: string;
  blockType?: "all" | "image_only" | "virtual_only";
  limit?: number;
};

export async function listCatalogBlocks(filters: CatalogFilters = {}) {
  const db = await getDb();
  if (db) {
    try {
      const conditions = [eq(blocks.isActive, true)];
      if (filters.category && filters.category !== "すべて") conditions.push(eq(blocks.category, filters.category));
      if (filters.color) conditions.push(or(like(blocks.colorName, `%${filters.color}%`), like(blocks.colorHex, `%${filters.color}%`))!);
      if (filters.query) conditions.push(or(like(blocks.name, `%${filters.query}%`), like(blocks.category, `%${filters.query}%`), like(blocks.colorName, `%${filters.query}%`))!);
      if (filters.blockType === "image_only") {
        conditions.push(and(isNotNull(blocks.imageUrl), ne(blocks.imageUrl, ""))!);
      } else if (filters.blockType === "virtual_only") {
        conditions.push(or(isNull(blocks.imageUrl), eq(blocks.imageUrl, ""))!);
      }
      return await db.select().from(blocks).where(and(...conditions)).orderBy(desc(blocks.updatedAt)).limit(filters.limit ?? 1000);
    } catch (error) {
      console.warn("[Database] Falling back to memory for listCatalogBlocks:", error);
    }
  }

  let list = Array.from(memStore.blocks.values()).filter(b => b.isActive);
  if (filters.category && filters.category !== "すべて") {
    list = list.filter(b => b.category === filters.category);
  }
  if (filters.color) {
    const c = filters.color.toLowerCase();
    list = list.filter(b => b.colorName.toLowerCase().includes(c) || b.colorHex.toLowerCase().includes(c));
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.colorName.toLowerCase().includes(q));
  }
  if (filters.blockType === "image_only") {
    list = list.filter(b => Boolean(b.imageUrl && b.imageUrl.trim() !== ""));
  } else if (filters.blockType === "virtual_only") {
    list = list.filter(b => !b.imageUrl || b.imageUrl.trim() === "");
  }
  list.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return list.slice(0, filters.limit ?? 1000);
}

export async function listCategories() {
  const db = await getDb();
  if (db) {
    try {
      const results = await db.selectDistinct({ category: blocks.category }).from(blocks).where(eq(blocks.isActive, true));
      return results.map(row => row.category).sort();
    } catch (error) {
      console.warn("[Database] Falling back to memory for listCategories:", error);
    }
  }

  const set = new Set<string>();
  for (const b of Array.from(memStore.blocks.values())) {
    if (b.isActive) set.add(b.category);
  }
  return Array.from(set).sort();
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
  if (db) {
    try {
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
    } catch (error) {
      console.warn("[Database] saveBlock MySQL error, falling back to memory:", error);
    }
  }

  const now = new Date();
  if (input.id && memStore.blocks.has(input.id)) {
    const existing = memStore.blocks.get(input.id)!;
    existing.name = input.name;
    existing.colorHex = input.colorHex;
    existing.colorName = input.colorName;
    existing.category = input.category;
    existing.description = input.description ?? null;
    existing.imageUrl = input.imageUrl ?? null;
    existing.isActive = input.isActive ?? true;
    existing.updatedAt = now;
    return input.id;
  }

  const id = input.id ?? memStore.nextId.block++;
  const block: MemoryBlock = {
    id,
    name: input.name,
    colorHex: input.colorHex,
    colorName: input.colorName,
    category: input.category,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    isActive: input.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };
  memStore.blocks.set(id, block);
  return id;
}

export async function removeBlock(id: number) {
  const db = await getDb();
  if (db) {
    try {
      await db.update(blocks).set({ isActive: false }).where(eq(blocks.id, id));
      return;
    } catch (error) {
      console.warn("[Database] removeBlock MySQL error, falling back to memory:", error);
    }
  }

  const block = memStore.blocks.get(id);
  if (block) {
    block.isActive = false;
    block.updatedAt = new Date();
  }
}

export async function setBlockMaterial(blockId: number, materialId: number, quantity = 1) {
  const db = await getDb();
  if (db) {
    try {
      await db.insert(blockMaterials).values({ blockId, materialId, quantity }).onDuplicateKeyUpdate({
        set: { quantity },
      });
      return;
    } catch (error) {
      console.warn("[Database] setBlockMaterial MySQL error, falling back to memory:", error);
    }
  }

  const existing = memStore.blockMaterials.find(bm => bm.blockId === blockId && bm.materialId === materialId);
  if (existing) {
    existing.quantity = quantity;
  } else {
    memStore.blockMaterials.push({
      id: memStore.nextId.blockMaterial++,
      blockId,
      materialId,
      quantity,
    });
  }
}

export async function replaceBlockMaterials(blockId: number, items: Array<{ materialId: number; quantity: number }>) {
  const db = await getDb();
  if (db) {
    try {
      await db.delete(blockMaterials).where(eq(blockMaterials.blockId, blockId));
      if (items.length > 0) {
        await db.insert(blockMaterials).values(items.map(item => ({ blockId, materialId: item.materialId, quantity: item.quantity })));
      }
      return;
    } catch (error) {
      console.warn("[Database] replaceBlockMaterials MySQL error, falling back to memory:", error);
    }
  }

  memStore.blockMaterials = memStore.blockMaterials.filter(bm => bm.blockId !== blockId);
  for (const item of items) {
    memStore.blockMaterials.push({
      id: memStore.nextId.blockMaterial++,
      blockId,
      materialId: item.materialId,
      quantity: item.quantity,
    });
  }
}

export type MiningLocationInput = {
  id?: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export async function saveMiningLocation(input: MiningLocationInput) {
  const db = await getDb();
  if (db) {
    try {
      const values = { name: input.name, description: input.description ?? null, imageUrl: input.imageUrl ?? null };
      if (input.id) {
        await db.update(miningLocations).set(values).where(eq(miningLocations.id, input.id));
        return input.id;
      }
      const result = await db.insert(miningLocations).values(values);
      return Number(result[0].insertId);
    } catch (error) {
      console.warn("[Database] saveMiningLocation MySQL error, falling back to memory:", error);
    }
  }

  const now = new Date();
  if (input.id && memStore.miningLocations.has(input.id)) {
    const loc = memStore.miningLocations.get(input.id)!;
    loc.name = input.name;
    loc.description = input.description ?? null;
    loc.imageUrl = input.imageUrl ?? null;
    loc.updatedAt = now;
    return input.id;
  }

  const id = input.id ?? memStore.nextId.miningLocation++;
  const loc: MemoryLocation = {
    id,
    name: input.name,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };
  memStore.miningLocations.set(id, loc);
  return id;
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
  if (db) {
    try {
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
    } catch (error) {
      console.warn("[Database] saveMaterial MySQL error, falling back to memory:", error);
    }
  }

  const now = new Date();
  if (input.id && memStore.materials.has(input.id)) {
    const mat = memStore.materials.get(input.id)!;
    mat.name = input.name;
    mat.description = input.description ?? null;
    mat.imageUrl = input.imageUrl ?? null;
    mat.miningLocationId = input.miningLocationId ?? null;
    mat.updatedAt = now;
    return input.id;
  }

  const id = input.id ?? memStore.nextId.material++;
  const mat: MemoryMaterial = {
    id,
    name: input.name,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    miningLocationId: input.miningLocationId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  memStore.materials.set(id, mat);
  return id;
}

export async function getCatalogAdminData() {
  const db = await getDb();
  if (db) {
    try {
      const [allBlocks, allMaterials, allLocations, allRecipes] = await Promise.all([
        db.select().from(blocks).orderBy(blocks.category, blocks.name).limit(300),
        db.select().from(materials).orderBy(materials.name),
        db.select().from(miningLocations).orderBy(miningLocations.name),
        db.select({ blockId: blockMaterials.blockId, materialId: materials.id, materialName: materials.name, quantity: blockMaterials.quantity }).from(blockMaterials).innerJoin(materials, eq(blockMaterials.materialId, materials.id)),
      ]);
      return { blocks: allBlocks, materials: allMaterials, locations: allLocations, recipes: allRecipes };
    } catch (error) {
      console.warn("[Database] getCatalogAdminData MySQL error, falling back to memory:", error);
    }
  }

  const allBlocks = Array.from(memStore.blocks.values()).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  const allMaterials = Array.from(memStore.materials.values()).sort((a, b) => a.name.localeCompare(b.name));
  const allLocations = Array.from(memStore.miningLocations.values()).sort((a, b) => a.name.localeCompare(b.name));
  const allRecipes = memStore.blockMaterials.map(bm => {
    const mat = memStore.materials.get(bm.materialId);
    return {
      blockId: bm.blockId,
      materialId: bm.materialId,
      materialName: mat?.name ?? "未知素材",
      quantity: bm.quantity,
    };
  });

  return { blocks: allBlocks, materials: allMaterials, locations: allLocations, recipes: allRecipes };
}

export async function listUserProjects(userId: number) {
  const db = await getDb();
  if (db) {
    try {
      return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
    } catch (error) {
      console.warn("[Database] listUserProjects MySQL error, falling back to memory:", error);
    }
  }

  return Array.from(memStore.projects.values())
    .filter(p => p.userId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getUserProject(projectId: number, userId: number) {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.userId, userId))).limit(1);
      if (result[0]) {
        const [selections, references] = await Promise.all([
          db.select().from(projectSelections).where(eq(projectSelections.projectId, projectId)).orderBy(projectSelections.sortOrder),
          db.select().from(projectReferences).where(eq(projectReferences.projectId, projectId)).orderBy(projectReferences.sortOrder),
        ]);
        return { ...result[0], selections, references };
      }
    } catch (error) {
      console.warn("[Database] getUserProject MySQL error, falling back to memory:", error);
    }
  }

  const p = memStore.projects.get(projectId);
  if (!p || p.userId !== userId) return undefined;

  const selections = Array.from(memStore.projectSelections.values())
    .filter(s => s.projectId === projectId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const references = Array.from(memStore.projectReferences.values())
    .filter(r => r.projectId === projectId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return { ...p, selections, references };
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
  if (db) {
    try {
      const owner = await db.select({ id: projects.id }).from(projects).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId))).limit(1);
      if (owner[0]) {
        const existing = await db.select({ id: projectReferences.id }).from(projectReferences).where(eq(projectReferences.projectId, input.projectId));
        const result = await db.insert(projectReferences).values({ ...input, sortOrder: existing.length });
        return Number(result[0].insertId);
      }
    } catch (error) {
      console.warn("[Database] addProjectReference MySQL error, falling back to memory:", error);
    }
  }

  const p = memStore.projects.get(input.projectId);
  if (!p || p.userId !== input.userId) throw new Error("プロジェクトが見つかりません。");

  const existingCount = Array.from(memStore.projectReferences.values()).filter(r => r.projectId === input.projectId).length;
  const id = memStore.nextId.projectReference++;
  const ref: MemoryProjectReference = {
    id,
    projectId: input.projectId,
    view: input.view,
    imageKey: input.imageKey,
    imageUrl: input.imageUrl,
    originalName: input.originalName,
    sortOrder: existingCount,
    createdAt: new Date(),
  };
  memStore.projectReferences.set(id, ref);
  return id;
}

export async function removeProjectReference(userId: number, projectId: number, referenceId: number) {
  const db = await getDb();
  if (db) {
    try {
      const owned = await db.select({ id: projectReferences.id }).from(projectReferences).innerJoin(projects, eq(projectReferences.projectId, projects.id)).where(and(eq(projectReferences.id, referenceId), eq(projectReferences.projectId, projectId), eq(projects.userId, userId))).limit(1);
      if (owned[0]) {
        await db.delete(projectReferences).where(eq(projectReferences.id, referenceId));
        return;
      }
    } catch (error) {
      console.warn("[Database] removeProjectReference MySQL error, falling back to memory:", error);
    }
  }

  const p = memStore.projects.get(projectId);
  if (!p || p.userId !== userId) throw new Error("参照画像が見つかりません。");
  memStore.projectReferences.delete(referenceId);
}

export async function createProject(userId: number, title: string, buildingHeight: number) {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.insert(projects).values({ userId, title, buildingHeight });
      return Number(result[0].insertId);
    } catch (error) {
      console.warn("[Database] createProject MySQL error, falling back to memory:", error);
    }
  }

  const id = memStore.nextId.project++;
  const now = new Date();
  const proj: MemoryProject = {
    id,
    userId,
    title,
    buildingHeight,
    status: "draft",
    sourceImageKey: null,
    sourceImageUrl: null,
    analysis: null,
    blueprint2d: null,
    blueprint3d: null,
    blueprint2dImageKey: null,
    blueprint2dImageUrl: null,
    blueprint3dImageKey: null,
    blueprint3dImageUrl: null,
    createdAt: now,
    updatedAt: now,
  };
  memStore.projects.set(id, proj);
  return id;
}

export async function saveProjectAnalysis(input: {
  userId: number;
  projectId: number;
  sourceImageKey: string;
  sourceImageUrl: string;
  analysis: unknown;
}) {
  const db = await getDb();
  if (db) {
    try {
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
      return;
    } catch (error) {
      console.warn("[Database] saveProjectAnalysis MySQL error, falling back to memory:", error);
    }
  }

  const p = memStore.projects.get(input.projectId);
  if (!p || p.userId !== input.userId) throw new Error("プロジェクトが見つかりません。");

  p.sourceImageKey = input.sourceImageKey;
  p.sourceImageUrl = input.sourceImageUrl;
  p.analysis = input.analysis;
  p.blueprint2d = null;
  p.blueprint3d = null;
  p.blueprint2dImageKey = null;
  p.blueprint2dImageUrl = null;
  p.blueprint3dImageKey = null;
  p.blueprint3dImageUrl = null;
  p.status = "analyzed";
  p.updatedAt = new Date();
}

const numberList = (value: unknown) => Array.isArray(value) ? value.filter((item): item is number => typeof item === "number") : [];

export async function getProjectDesignData(projectId: number, userId: number) {
  const project = await getUserProject(projectId, userId);
  if (!project) return undefined;
  const candidateIds = Array.from(new Set(project.selections.flatMap(selection => numberList(selection.candidateBlockIds))));

  const db = await getDb();
  let candidateBlocks: MemoryBlock[] = [];
  if (db && candidateIds.length) {
    try {
      candidateBlocks = await db.select().from(blocks).where(inArray(blocks.id, candidateIds));
    } catch {
      candidateBlocks = candidateIds.map(id => memStore.blocks.get(id)).filter((b): b is MemoryBlock => Boolean(b));
    }
  } else {
    candidateBlocks = candidateIds.map(id => memStore.blocks.get(id)).filter((b): b is MemoryBlock => Boolean(b));
  }

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
  if (db) {
    try {
      for (const item of selected) {
        await db.update(projectSelections).set({ selectedBlockId: item.blockId }).where(and(eq(projectSelections.projectId, projectId), eq(projectSelections.partId, item.partId)));
      }
      return;
    } catch (error) {
      console.warn("[Database] saveProjectSelections MySQL error, falling back to memory:", error);
    }
  }

  for (const item of selected) {
    for (const s of Array.from(memStore.projectSelections.values())) {
      if (s.projectId === projectId && s.partId === item.partId) {
        s.selectedBlockId = item.blockId;
      }
    }
  }
}

export async function getRecipesForBlocks(blockIds: number[]) {
  if (!blockIds.length) return [];
  const db = await getDb();
  if (db) {
    try {
      return await db.select({
        blockId: blockMaterials.blockId,
        materialId: materials.id,
        materialName: materials.name,
        quantity: blockMaterials.quantity,
        materialDescription: materials.description,
        locationName: miningLocations.name,
        locationDescription: miningLocations.description,
        locationImageUrl: miningLocations.imageUrl,
      }).from(blockMaterials).innerJoin(materials, eq(blockMaterials.materialId, materials.id)).leftJoin(miningLocations, eq(materials.miningLocationId, miningLocations.id)).where(inArray(blockMaterials.blockId, blockIds));
    } catch (error) {
      console.warn("[Database] getRecipesForBlocks MySQL error, falling back to memory:", error);
    }
  }

  return memStore.blockMaterials
    .filter(bm => blockIds.includes(bm.blockId))
    .map(bm => {
      const mat = memStore.materials.get(bm.materialId);
      const loc = mat?.miningLocationId ? memStore.miningLocations.get(mat.miningLocationId) : null;
      return {
        blockId: bm.blockId,
        materialId: bm.materialId,
        materialName: mat?.name ?? "未知素材",
        quantity: bm.quantity,
        materialDescription: mat?.description ?? null,
        locationName: loc?.name ?? "採取地不明",
        locationDescription: loc?.description ?? null,
        locationImageUrl: loc?.imageUrl ?? null,
      };
    });
}

export async function saveProjectBlueprint(input: { userId: number; projectId: number; blueprint2d: unknown; blueprint3d: unknown }) {
  const db = await getDb();
  if (db) {
    try {
      await db.update(projects).set({ blueprint2d: input.blueprint2d, blueprint3d: input.blueprint3d, status: "designed" }).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)));
      return;
    } catch (error) {
      console.warn("[Database] saveProjectBlueprint MySQL error, falling back to memory:", error);
    }
  }

  const p = memStore.projects.get(input.projectId);
  if (!p || p.userId !== input.userId) throw new Error("プロジェクトが見つかりません。");

  p.blueprint2d = input.blueprint2d;
  p.blueprint3d = input.blueprint3d;
  p.status = "designed";
  p.updatedAt = new Date();
}

export async function saveProjectPngs(input: { userId: number; projectId: number; blueprint2dImageKey: string; blueprint2dImageUrl: string; blueprint3dImageKey: string; blueprint3dImageUrl: string }) {
  const db = await getDb();
  if (db) {
    try {
      await db.update(projects).set({
        blueprint2dImageKey: input.blueprint2dImageKey, blueprint2dImageUrl: input.blueprint2dImageUrl,
        blueprint3dImageKey: input.blueprint3dImageKey, blueprint3dImageUrl: input.blueprint3dImageUrl,
      }).where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)));
      return;
    } catch (error) {
      console.warn("[Database] saveProjectPngs MySQL error, falling back to memory:", error);
    }
  }

  const p = memStore.projects.get(input.projectId);
  if (!p || p.userId !== input.userId) throw new Error("プロジェクトが見つかりません。");

  p.blueprint2dImageKey = input.blueprint2dImageKey;
  p.blueprint2dImageUrl = input.blueprint2dImageUrl;
  p.blueprint3dImageKey = input.blueprint3dImageKey;
  p.blueprint3dImageUrl = input.blueprint3dImageUrl;
  p.updatedAt = new Date();
}

export async function getBlockById(id: number) {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(blocks).where(eq(blocks.id, id)).limit(1);
      if (result[0]) return result[0];
    } catch (error) {
      console.warn("[Database] getBlockById MySQL error, falling back to memory:", error);
    }
  }

  return memStore.blocks.get(id);
}

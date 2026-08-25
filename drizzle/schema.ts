import { boolean, index, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Manus OAuthで認証される利用者。 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const miningLocations = mysqlTable("miningLocations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  imageUrl: text("imageUrl"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("miningLocations_name_uq").on(table.name)]);

export const materials = mysqlTable("materials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  imageUrl: text("imageUrl"),
  description: text("description"),
  miningLocationId: int("miningLocationId").references(() => miningLocations.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("materials_name_uq").on(table.name), index("materials_location_idx").on(table.miningLocationId)]);

export const blocks = mysqlTable("blocks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  imageUrl: text("imageUrl"),
  colorHex: varchar("colorHex", { length: 9 }).notNull(),
  colorName: varchar("colorName", { length: 80 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("blocks_name_uq").on(table.name),
  index("blocks_category_idx").on(table.category),
  index("blocks_color_idx").on(table.colorHex),
]);

export const blockMaterials = mysqlTable("blockMaterials", {
  id: int("id").autoincrement().primaryKey(),
  blockId: int("blockId").notNull().references(() => blocks.id),
  materialId: int("materialId").notNull().references(() => materials.id),
  quantity: int("quantity").notNull().default(1),
}, table => [
  uniqueIndex("block_material_unique").on(table.blockId, table.materialId),
  index("blockMaterials_block_idx").on(table.blockId),
  index("blockMaterials_material_idx").on(table.materialId),
]);

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["draft", "analyzed", "designed"]).default("draft").notNull(),
  sourceImageKey: text("sourceImageKey"),
  sourceImageUrl: text("sourceImageUrl"),
  buildingHeight: int("buildingHeight").notNull().default(100),
  analysis: json("analysis"),
  blueprint2d: json("blueprint2d"),
  blueprint3d: json("blueprint3d"),
  blueprint2dImageKey: text("blueprint2dImageKey"),
  blueprint2dImageUrl: text("blueprint2dImageUrl"),
  blueprint3dImageKey: text("blueprint3dImageKey"),
  blueprint3dImageUrl: text("blueprint3dImageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("projects_user_updated_idx").on(table.userId, table.updatedAt)]);

export const projectSelections = mysqlTable("projectSelections", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id),
  partId: varchar("partId", { length: 100 }).notNull(),
  partName: varchar("partName", { length: 140 }).notNull(),
  candidateBlockIds: json("candidateBlockIds").notNull(),
  selectedBlockId: int("selectedBlockId").references(() => blocks.id),
  layer: varchar("layer", { length: 100 }).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
}, table => [
  uniqueIndex("projectSelections_part_unique").on(table.projectId, table.partId),
  index("projectSelections_project_idx").on(table.projectId),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Block = typeof blocks.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type MiningLocation = typeof miningLocations.$inferSelect;
export type Project = typeof projects.$inferSelect;

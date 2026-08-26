import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { blockMaterials, blocks, materials, miningLocations } from "../drizzle/schema";

const palette = [
  { name: "月光ホワイト", hex: "#F5F0D5" },
  { name: "ストーングレー", hex: "#8E98A8" },
  { name: "アンダーグレー", hex: "#31363B" },
  { name: "エメラルドグリーン", hex: "#0B8000" },
  { name: "ネオンライム", hex: "#C8FF00" },
  { name: "アーケードシアン", hex: "#29F4FF" },
  { name: "パルスマゼンタ", hex: "#FF3DBA" },
  { name: "サンシャインイエロー", hex: "#FFE45C" },
  { name: "ディープネイビー", hex: "#16213E" },
];

const families = [
  { category: "道路", material: "岩片", names: ["玉石舗装", "角石タイル", "発光ライン", "砂岩舗装", "レンガ道", "石畳", "橋床"] },
  { category: "壁", material: "石材", names: ["切石壁", "積石壁", "磨き石壁", "レンガ壁", "発光パネル", "装飾壁", "補強壁"] },
  { category: "床", material: "木材", names: ["木板床", "格子床", "石板床", "モザイク床", "発光床", "滑り止め床", "縁取り床"] },
  { category: "木", material: "木材", names: ["丸太", "梁", "支柱", "枝ブロック", "樹皮", "木格子", "葉ブロック"] },
  { category: "石", material: "石材", names: ["原石", "大理石", "花こう岩", "火山岩", "氷晶石", "結晶石", "苔石"] },
  { category: "装飾", material: "結晶片", names: ["結晶柱", "旗ブロック", "看板", "屋根飾り", "窓枠", "アーチ", "光源石"] },
];

const starterLocations = [
  { name: "月影鉱山", description: "石材・岩片を採掘できる深い坑道。" },
  { name: "ひかりの森", description: "木材と植物由来の素材を集められる森林地帯。" },
  { name: "プリズム洞窟", description: "結晶片と希少な発光素材が見つかる洞窟。" },
  { name: "きらめき海岸", description: "砂・貝殻・水辺の素材を収集できる海岸。" },
];

const starterMaterials = [
  { name: "石材", location: "月影鉱山", description: "壁と石ブロックの基礎素材。" },
  { name: "岩片", location: "月影鉱山", description: "道路や舗装に向く加工前の岩片。" },
  { name: "木材", location: "ひかりの森", description: "床・梁・装飾に使う基本の木材。" },
  { name: "結晶片", location: "プリズム洞窟", description: "発光装飾を作るための結晶素材。" },
  { name: "砂", location: "きらめき海岸", description: "砂岩系ブロックに加工できる粒状素材。" },
];

/** 初回だけ、検索・候補提示に使える252種類の基礎ブロックをDBに登録する。 */
export async function ensureCatalogSeeded() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ id: blocks.id }).from(blocks).limit(1);
  if (existing.length > 0) {
    const existingBlocks = await db.select({ id: blocks.id, name: blocks.name }).from(blocks);
    const existingNames = new Set(existingBlocks.map(block => block.name));
    const supplemental = palette.filter(color => color.name === "アンダーグレー" || color.name === "エメラルドグリーン").map(color => ({
      name: `${color.name} 基準石`, colorHex: color.hex, colorName: color.name, category: "石", description: `多色設計図の色近似に使える${color.name}の基準ブロック。`,
    })).filter(block => !existingNames.has(block.name));
    if (supplemental.length) {
      await db.insert(blocks).values(supplemental);
      const [storedBlocks, storedMaterials] = await Promise.all([db.select().from(blocks), db.select().from(materials)]);
      const stoneMaterial = storedMaterials.find(material => material.name === "石材");
      const createdBlocks = storedBlocks.filter(block => supplemental.some(item => item.name === block.name));
      if (stoneMaterial && createdBlocks.length) await db.insert(blockMaterials).values(createdBlocks.map(block => ({ blockId: block.id, materialId: stoneMaterial.id, quantity: 1 })));
    }
    return;
  }

  await db.insert(miningLocations).values(starterLocations);
  const storedLocations = await db.select().from(miningLocations);
  const locationIds = new Map(storedLocations.map(location => [location.name, location.id]));

  await db.insert(materials).values(starterMaterials.map(material => ({
    name: material.name,
    description: material.description,
    miningLocationId: locationIds.get(material.location) ?? null,
  })));
  const storedMaterials = await db.select().from(materials);
  const materialIds = new Map(storedMaterials.map(material => [material.name, material.id]));

  const entries = families.flatMap(family => family.names.flatMap(baseName => palette.map(color => ({
    name: `${color.name} ${baseName}`,
    colorHex: color.hex,
    colorName: color.name,
    category: family.category,
    description: `${family.category}に使える${color.name}の${baseName}。`,
  }))));
  await db.insert(blocks).values(entries);
  const storedBlocks = await db.select({ id: blocks.id, category: blocks.category }).from(blocks);
  const categoryMaterial = new Map(families.map(family => [family.category, family.material]));
  await db.insert(blockMaterials).values(storedBlocks.flatMap(block => {
    const materialId = materialIds.get(categoryMaterial.get(block.category) ?? "石材");
    return materialId ? [{ blockId: block.id, materialId, quantity: 1 }] : [];
  }));
}

export async function getBlockById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blocks).where(eq(blocks.id, id)).limit(1);
  return result[0];
}

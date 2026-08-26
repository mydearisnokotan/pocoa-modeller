import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import jpeg from "jpeg-js";
import { eq } from "drizzle-orm";
import { getDb } from "../server/db.ts";
import { storagePut } from "../server/storage.ts";
import { blockMaterials, blocks, materials } from "../drizzle/schema.ts";
import { imageBaseNameForBlock, isImportableProvidedBlock, providedBlockDescription } from "../server/providedCatalog.ts";
import { representativeHexFromPixels } from "../server/catalogImageColor.ts";

const uploadDir = "/home/ubuntu/upload";
const catalog = JSON.parse(await readFile(path.join(uploadDir, "block.json"), "utf8"));
const db = await getDb();
if (!db) throw new Error("データベースへ接続できません。");

const fileNames = await readdir(uploadDir);
const imageFiles = new Map(fileNames.filter(file => /\.jpe?g$/i.test(file)).map(file => [path.parse(file).name.normalize("NFC"), file]));
const allBlocks = await db.select().from(blocks);
const blockByName = new Map(allBlocks.map(block => [block.name, block]));
const allMaterials = await db.select().from(materials);
const materialByName = new Map(allMaterials.map(material => [material.name, material]));
const report = { imported: [], updated: [], skippedMissingImage: [], createdMaterials: [], imagesUploaded: 0 };

function representativeHex(bytes) {
  const { data, width, height } = jpeg.decode(bytes, { useTArray: true });
  const sampled = [];
  const stride = Math.max(1, Math.floor(Math.sqrt((width * height) / 2048)));
  for (let y = 0; y < height; y += stride) for (let x = 0; x < width; x += stride) {
    const offset = (y * width + x) * 4;
    sampled.push([data[offset], data[offset + 1], data[offset + 2]]);
  }
  return representativeHexFromPixels(sampled);
}

for (const item of catalog) {
  if (!isImportableProvidedBlock(item, new Set(imageFiles.keys()))) {
    report.skippedMissingImage.push({ block_key: item.block_key, name: item.name });
    continue;
  }
  const imageFile = imageFiles.get(imageBaseNameForBlock(item.name));
  const imageBytes = await readFile(path.join(uploadDir, imageFile));
  const existing = blockByName.get(item.name);
  const storedImage = existing?.imageUrl ? { url: existing.imageUrl } : await storagePut(`catalog/pokoa-blocks/${item.block_key}.jpg`, imageBytes, "image/jpeg");
  if (!existing?.imageUrl) report.imagesUploaded += 1;
  const values = {
    name: item.name,
    imageUrl: storedImage.url,
    colorHex: representativeHex(imageBytes),
    colorName: "画像代表色",
    category: item.category,
    description: providedBlockDescription(item),
    isActive: true,
  };
  let storedBlock = existing;
  if (storedBlock) {
    await db.update(blocks).set(values).where(eq(blocks.id, storedBlock.id));
    report.updated.push(item.name);
  } else {
    const inserted = await db.insert(blocks).values(values);
    storedBlock = { id: Number(inserted[0].insertId) };
    report.imported.push(item.name);
  }
  for (const [materialName, quantity] of Object.entries(item.required_materials ?? {})) {
    let storedMaterial = materialByName.get(materialName);
    if (!storedMaterial) {
      const inserted = await db.insert(materials).values({ name: materialName, description: "提供カタログのレシピ素材。", miningLocationId: null });
      storedMaterial = { id: Number(inserted[0].insertId), name: materialName };
      materialByName.set(materialName, storedMaterial);
      report.createdMaterials.push(materialName);
    }
    await db.insert(blockMaterials).values({ blockId: storedBlock.id, materialId: storedMaterial.id, quantity }).onDuplicateKeyUpdate({ set: { quantity } });
  }
}

await writeFile("/home/ubuntu/pocoa-modeller/verification-results/provided-catalog-import.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  imported: report.imported.length,
  updated: report.updated.length,
  skippedMissingImage: report.skippedMissingImage,
  createdMaterials: report.createdMaterials.length,
  imagesUploaded: report.imagesUploaded,
}, null, 2));

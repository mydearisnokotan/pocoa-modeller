import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadDir = "/home/ubuntu/upload";
const blocks = JSON.parse(await readFile(path.join(uploadDir, "block.json"), "utf8"));
const estimated = JSON.parse(await readFile(path.join(uploadDir, "estimated_block_counts.json"), "utf8"));
const files = await readdir(uploadDir);
const imageNames = new Set(files.filter(file => /\.(jpe?g|png)$/i.test(file)).map(file => path.parse(file).name.normalize("NFC")));
const requiredFields = ["block_key", "name", "category", "required_materials"];
const missingRequired = blocks.map(block => ({
  block_key: block.block_key,
  name: block.name,
  fields: requiredFields.filter(field => block[field] === undefined || block[field] === null),
})).filter(block => block.fields.length);
const duplicateKeys = blocks.filter((block, index) => blocks.findIndex(other => other.block_key === block.block_key) !== index).map(block => block.block_key);
const duplicateNames = blocks.filter((block, index) => blocks.findIndex(other => other.name === block.name) !== index).map(block => block.name);
const missingImages = blocks.filter(block => !imageNames.has(String(block.name).normalize("NFC"))).map(block => ({ block_key: block.block_key, name: block.name }));
const materials = [...new Set(blocks.flatMap(block => Object.keys(block.required_materials ?? {})))].sort((a, b) => a.localeCompare(b, "ja"));
const categories = [...new Set(blocks.map(block => block.category))].sort((a, b) => a.localeCompare(b, "ja"));
const catalogKeys = new Set(blocks.map(block => block.block_key));
const estimatedUnknownBlocks = estimated.block_counts.filter(block => !catalogKeys.has(block.block_key));

const report = {
  catalogBlocks: blocks.length,
  providedImages: imageNames.size,
  categories,
  uniqueMaterials: materials.length,
  requiredFieldViolations: missingRequired.length,
  blocksWithMissingRequiredFields: missingRequired,
  duplicateBlockKeys: [...new Set(duplicateKeys)],
  duplicateBlockNames: [...new Set(duplicateNames)],
  blocksWithoutMatchingImage: missingImages,
  estimatedBlockRows: estimated.block_counts.length,
  estimatedTotalBlocks: estimated.total_blocks,
  estimatedBlocksNotInCatalog: estimatedUnknownBlocks,
};

await writeFile("/home/ubuntu/pocoa-modeller/verification-results/provided-catalog-audit.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

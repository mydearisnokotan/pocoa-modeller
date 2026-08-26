import { mkdir, readFile, writeFile } from "node:fs/promises";
import { analyzeBuildingImage } from "../server/buildingAnalysis.ts";

const inputPath = "/home/ubuntu/upload/アルセウス.jpeg";
const imageBytes = await readFile(inputPath);
const dataUrl = `data:image/jpeg;base64,${imageBytes.toString("base64")}`;
const analysis = await analyzeBuildingImage(dataUrl);

await mkdir("/home/ubuntu/pocoa-modeller/verification-results", { recursive: true });
await writeFile(
  "/home/ubuntu/pocoa-modeller/verification-results/user-image-analysis.json",
  `${JSON.stringify(analysis, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({ suitability: analysis.suitability, parts: analysis.parts.length, layers: analysis.layers.length, cautions: analysis.cautions }, null, 2));

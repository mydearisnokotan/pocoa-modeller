import { describe, expect, it } from "vitest";
import { generateBlueprint } from "./designGeneration";

describe("generateBlueprint", () => {
  it("creates a 2D/3D blueprint and aggregates block materials", () => {
    const result = generateBlueprint(100, [
      { partId: "body", partName: "胴体", layer: "base", blockId: 10, blockName: "シアン石", colorHex: "#29F4FF", coveragePercent: 70 },
      { partId: "detail", partName: "装飾", layer: "detail", blockId: 11, blockName: "ライム結晶", colorHex: "#C8FF00", coveragePercent: 30 },
    ], [
      { blockId: 10, materialId: 1, materialName: "石材", quantity: 2, materialDescription: "基礎石材", locationName: "月影鉱山", locationDescription: "坑道", locationImageUrl: null },
      { blockId: 11, materialId: 2, materialName: "結晶片", quantity: 1, materialDescription: "発光素材", locationName: "プリズム洞窟", locationDescription: "洞窟", locationImageUrl: null },
    ]);

    expect(result.blueprint2d.cells.length).toBeGreaterThan(0);
    expect(result.blueprint3d.voxels.length).toBeGreaterThan(0);
    expect(result.blockSummary).toHaveLength(2);
    expect(result.materialSummary.map(item => item.name)).toEqual(expect.arrayContaining(["石材", "結晶片"]));
    expect(result.totalBlocks).toBeGreaterThan(0);
  });

  it("requires at least one selected part", () => {
    expect(() => generateBlueprint(100, [], [])).toThrow("少なくとも1つの部位");
  });
});

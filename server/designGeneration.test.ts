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

  it("uses an extracted silhouette for the 2D shape and creates an extruded 3D model", () => {
    const result = generateBlueprint(80, [{ partId: "torso", partName: "胴体", layer: "L1", blockId: 10, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 100 }], [], {
      gridSize: 6,
      cells: [
        { x: 1, y: 1, colorHex: "#F5F0D5" }, { x: 2, y: 1, colorHex: "#F5F0D5" }, { x: 3, y: 1, colorHex: "#F5F0D5" },
        { x: 1, y: 2, colorHex: "#F5F0D5" }, { x: 2, y: 2, colorHex: "#F5F0D5" }, { x: 3, y: 2, colorHex: "#F5F0D5" },
        { x: 1, y: 3, colorHex: "#F5F0D5" }, { x: 2, y: 3, colorHex: "#F5F0D5" }, { x: 3, y: 3, colorHex: "#F5F0D5" },
      ],
    });
    expect(result.blueprint2d.gridSize).toBe(6);
    expect(result.blueprint2d.cells.map(cell => `${cell.x}:${cell.y}`)).toEqual(expect.arrayContaining(["2:1", "3:2"]));
    expect(result.blueprint3d.voxels.length).toBeGreaterThan(result.blueprint2d.cells.length);
  });

  it("uses a side silhouette to constrain the generated 3D depth", () => {
    const parts = [{ partId: "torso", partName: "胴体", layer: "L1", blockId: 10, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 100 }];
    const front = { gridSize: 8, cells: Array.from({ length: 25 }, (_, index) => ({ x: 1 + (index % 5), y: 1 + Math.floor(index / 5), colorHex: "#F5F0D5" })) };
    const profile = { gridSize: 8, cells: Array.from({ length: 8 }, (_, y) => ({ x: 3, y, colorHex: "#F5F0D5" })) };
    const frontOnly = generateBlueprint(80, parts, [], front);
    const withProfile = generateBlueprint(80, parts, [], front, [profile]);
    expect(withProfile.blueprint3d.voxels.length).toBeLessThan(frontOnly.blueprint3d.voxels.length);
  });

  it("maps silhouette colors to multiple nearest catalog blocks", () => {
    const part = [{ partId: "torso", partName: "胴体", layer: "L1", blockId: 10, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 100 }];
    const silhouette = { gridSize: 4, cells: [{ x: 1, y: 1, colorHex: "#f6f4e8" }, { x: 2, y: 1, colorHex: "#d9ad25" }, { x: 1, y: 2, colorHex: "#52616a" }] };
    const palette = [{ id: 11, name: "白石", colorHex: "#f8f6ea" }, { id: 12, name: "金ブロック", colorHex: "#dcae22" }, { id: 13, name: "灰石", colorHex: "#53616a" }];
    const result = generateBlueprint(80, part, [], silhouette, [], palette);
    expect(new Set(result.blueprint2d.cells.map(cell => cell.blockId))).toEqual(new Set([11, 12, 13]));
    expect(new Set(result.blueprint3d.voxels.map(voxel => voxel.blockId))).toEqual(new Set([11, 12, 13]));
    expect(new Set(result.blueprint2d.cells.map(cell => cell.layer))).toEqual(new Set(["L1"]));
    expect(new Set(result.blueprint3d.voxels.map(voxel => voxel.layer))).toEqual(new Set(["L1"]));
  });

  it("builds recognizable 3D voxel groups for head, body, legs, tail, and ring parts", () => {
    const result = generateBlueprint(100, [
      { partId: "head_01", partName: "頭部・角", layer: "L3", blockId: 1, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 15 },
      { partId: "neck_01", partName: "首部", layer: "L2", blockId: 1, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 10 },
      { partId: "torso_01", partName: "胴体", layer: "L1", blockId: 1, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 35 },
      { partId: "legs_01", partName: "脚部（四肢）", layer: "L2", blockId: 1, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 20 },
      { partId: "wheel_01", partName: "手手（輪）", layer: "L3", blockId: 2, blockName: "金石", colorHex: "#FFE45C", coveragePercent: 10 },
      { partId: "tail_01", partName: "尾", layer: "L2", blockId: 1, blockName: "白石", colorHex: "#F5F0D5", coveragePercent: 10 },
    ], []);

    const voxelPartIds = new Set(result.blueprint3d.voxels.map(voxel => voxel.partId));
    expect(voxelPartIds).toEqual(expect.objectContaining({}));
    ["head_01", "torso_01", "legs_01", "wheel_01", "tail_01"].forEach(partId => expect(voxelPartIds.has(partId)).toBe(true));
    expect(result.blueprint3d.voxels.filter(voxel => voxel.partId === "legs_01").length).toBeGreaterThan(0);
    expect(result.blueprint3d.voxels.filter(voxel => voxel.partId === "wheel_01").length).toBeGreaterThan(0);
  });
});

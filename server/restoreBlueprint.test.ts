import { describe, expect, it } from "vitest";
import { restoreSavedBlueprint } from "../client/src/lib/restoreBlueprint";

describe("restoreSavedBlueprint", () => {
  it("restores JSON-stringified saved blueprints even when the 2D legend is absent", () => {
    const restored = restoreSavedBlueprint(
      JSON.stringify({ gridSize: 3, cells: [{ x: 0, y: 0, blockId: 1, blockName: "白石", colorHex: "#ffffff", partId: "head" }], totalBlocks: 1 }),
      JSON.stringify({ gridSize: 3, voxels: [{ x: 0, y: 0, z: 0, blockId: 1, colorHex: "#ffffff" }] }),
    );
    expect(restored?.blueprint2d.cells).toHaveLength(1);
    expect(restored?.blueprint2d.legend).toEqual([]);
    expect(restored?.blueprint3d.voxels).toHaveLength(1);
    expect(restored?.totalBlocks).toBe(1);
  });

  it("rejects incomplete saved blueprint data", () => {
    expect(restoreSavedBlueprint({ gridSize: 3, cells: [] }, null)).toBeNull();
  });
});

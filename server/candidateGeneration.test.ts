import { describe, expect, it } from "vitest";
import { selectCandidateBlockIds } from "./candidateGeneration";

describe("selectCandidateBlockIds", () => {
  it("keeps nearest color candidates while including near-color supplied catalog blocks", () => {
    const selected = selectCandidateBlockIds("#FFFFFF", 2, [
      { id: 1, colorHex: "#FFFFFF", description: null },
      { id: 2, colorHex: "#F6F6F6", description: null },
      { id: 3, colorHex: "#E9E7E0", description: "提供カタログキー: cloth_wall" },
      { id: 4, colorHex: "#AA0000", description: "提供カタログキー: red_rock" },
    ]);
    expect(selected).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  it("keeps the previously selected block even when the refreshed color candidates change", () => {
    expect(selectCandidateBlockIds("#FFFFFF", 1, [{ id: 1, colorHex: "#FFFFFF", description: null }], 99)).toEqual(expect.arrayContaining([1, 99]));
  });
});

import { describe, expect, it } from "vitest";
import { extractCatalogLocations, imageBaseNameForBlock, isImportableProvidedBlock, providedBlockDescription } from "./providedCatalog";

describe("providedCatalog", () => {
  const block = { block_key: "wood_wall", name: "木のカベ", category: "カベ", recipe_unlock: "ショップ解放", required_materials: { "ざいもく": 2 } };

  it("matches a provided block with an NFC-normalized image file name", () => {
    expect(isImportableProvidedBlock(block, new Set([imageBaseNameForBlock("木のカベ")]))).toBe(true);
  });

  it("does not import a block that has no corresponding supplied image", () => {
    expect(isImportableProvidedBlock(block, new Set())).toBe(false);
  });

  it("keeps source acquisition details in the block description", () => {
    expect(providedBlockDescription(block)).toContain("レシピ・解放条件: ショップ解放");
  });

  it("extracts documented towns without presenting them as direct material mining locations", () => {
    expect(extractCatalogLocations({ ...block, obtaining_method: "キラキラうきしまの街で入手 / 水面のキラキラから稀に入手" })).toEqual(["キラキラうきしまの街", "水面のキラキラ"]);
  });
});

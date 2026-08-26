import { canAddReferenceCount, collectReferencesForAnalysis, MAX_PROJECT_REFERENCES } from "./projectReferenceAnalysis";
import { describe, expect, it } from "vitest";

describe("projectReferenceAnalysis", () => {
  const front = { imageKey: "front.jpg", imageUrl: "https://example.test/front.jpg", view: "front" as const };

  it("keeps the initial reference and deduplicates it when stored references include it", () => {
    const references = collectReferencesForAnalysis([front, { imageKey: "left.png", imageUrl: "https://example.test/left.png", view: "left" }], front);
    expect(references.map(reference => reference.imageKey)).toEqual(["front.jpg", "left.png"]);
  });

  it("counts the initial reference toward the total image limit", () => {
    expect(canAddReferenceCount(MAX_PROJECT_REFERENCES - 1, 1)).toBe(true);
    expect(canAddReferenceCount(MAX_PROJECT_REFERENCES - 1, 2)).toBe(false);
  });
});

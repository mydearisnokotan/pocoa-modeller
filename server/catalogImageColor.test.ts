import { describe, expect, it } from "vitest";
import { representativeHexFromPixels } from "./catalogImageColor";

describe("representativeHexFromPixels", () => {
  it("excludes a white background when finding a block image representative color", () => {
    expect(representativeHexFromPixels([[255, 255, 255], [254, 254, 254], [190, 110, 50], [200, 120, 60], [180, 100, 40]])).toBe("#BE6E32");
  });

  it("falls back to all pixels when an image contains only a light color", () => {
    expect(representativeHexFromPixels([[250, 250, 250], [252, 252, 252]])).toBe("#FCFCFC");
  });
});

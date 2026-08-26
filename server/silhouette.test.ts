import { describe, expect, it } from "vitest";
import { PNG } from "pngjs";
import { extractSilhouette } from "./silhouette";

describe("extractSilhouette", () => {
  it("extracts a non-background shape from a simple PNG", () => {
    const image = new PNG({ width: 8, height: 8 });
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const offset = (y * 8 + x) * 4;
      const foreground = x >= 2 && x <= 5 && y >= 1 && y <= 6;
      image.data[offset] = foreground ? 30 : 255;
      image.data[offset + 1] = foreground ? 200 : 255;
      image.data[offset + 2] = foreground ? 80 : 255;
      image.data[offset + 3] = 255;
    }
    const silhouette = extractSilhouette(PNG.sync.write(image), "image/png", 8);
    expect(silhouette.cells).toEqual(expect.arrayContaining([expect.objectContaining({ x: 3, y: 3 })]));
    expect(silhouette.cells).not.toEqual(expect.arrayContaining([expect.objectContaining({ x: 0, y: 0 })]));
  });
});

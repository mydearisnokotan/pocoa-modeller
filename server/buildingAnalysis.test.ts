import { describe, expect, it } from "vitest";
import { parseImageDataUrl } from "./buildingAnalysis";

describe("parseImageDataUrl", () => {
  it("accepts a PNG data URL and returns its bytes", () => {
    const dataUrl = `data:image/png;base64,${Buffer.from([137, 80, 78, 71]).toString("base64")}`;
    const parsed = parseImageDataUrl(dataUrl);
    expect(parsed.mimeType).toBe("image/png");
    expect([...parsed.bytes]).toEqual([137, 80, 78, 71]);
  });

  it("rejects unsupported image data URLs", () => {
    expect(() => parseImageDataUrl("data:image/gif;base64,R0lGODlh")).toThrow("PNG、JPEG、またはWebP");
  });
});

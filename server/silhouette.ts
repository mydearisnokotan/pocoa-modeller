import { decode as decodeJpeg } from "jpeg-js";
import { PNG } from "pngjs";

export type SilhouetteCell = { x: number; y: number; colorHex: string };
export type Silhouette = { gridSize: number; cells: SilhouetteCell[] };
type DecodedImage = { width: number; height: number; data: Uint8Array };

function decodeImage(bytes: Buffer, mimeType: string): DecodedImage {
  if (mimeType === "image/jpeg") return decodeJpeg(bytes, { useTArray: true });
  if (mimeType === "image/png") return PNG.sync.read(bytes);
  throw new Error("輪郭抽出はPNGまたはJPEG画像に対応しています。");
}

function distance(red: number, green: number, blue: number, background: [number, number, number]) {
  return Math.sqrt((red - background[0]) ** 2 + (green - background[1]) ** 2 + (blue - background[2]) ** 2);
}

function toHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

/** 単色背景を四隅から推定し、低解像度の輪郭マスクに変換する。 */
export function extractSilhouette(bytes: Buffer, mimeType: string, gridSize = 32): Silhouette {
  const image = decodeImage(bytes, mimeType);
  const corners = [[0, 0], [image.width - 1, 0], [0, image.height - 1], [image.width - 1, image.height - 1]];
  const background = corners.reduce<[number, number, number]>((sum, [x, y]) => {
    const offset = (y * image.width + x) * 4;
    return [sum[0] + image.data[offset], sum[1] + image.data[offset + 1], sum[2] + image.data[offset + 2]];
  }, [0, 0, 0]).map(value => Math.round(value / corners.length)) as [number, number, number];
  const active = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => false));
  const colors = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => "#8e98a8"));

  for (let gridY = 0; gridY < gridSize; gridY++) {
    for (let gridX = 0; gridX < gridSize; gridX++) {
      const left = Math.floor((gridX * image.width) / gridSize);
      const right = Math.max(left + 1, Math.floor(((gridX + 1) * image.width) / gridSize));
      const top = Math.floor((gridY * image.height) / gridSize);
      const bottom = Math.max(top + 1, Math.floor(((gridY + 1) * image.height) / gridSize));
      let foreground = 0;
      let red = 0;
      let green = 0;
      let blue = 0;
      let vibrant: [number, number, number] | undefined;
      let vibrantScore = 0;
      for (let y = top; y < bottom; y++) {
        for (let x = left; x < right; x++) {
          const offset = (y * image.width + x) * 4;
          if (image.data[offset + 3] < 50 || distance(image.data[offset], image.data[offset + 1], image.data[offset + 2], background) < 42) continue;
          foreground++;
          red += image.data[offset];
          green += image.data[offset + 1];
          blue += image.data[offset + 2];
          const high = Math.max(image.data[offset], image.data[offset + 1], image.data[offset + 2]);
          const low = Math.min(image.data[offset], image.data[offset + 1], image.data[offset + 2]);
          const score = (high - low) * (high / 255);
          if (high > 80 && score > vibrantScore) {
            vibrant = [image.data[offset], image.data[offset + 1], image.data[offset + 2]];
            vibrantScore = score;
          }
        }
      }
      const sampleCount = Math.max(1, (right - left) * (bottom - top));
      if (foreground >= Math.max(1, Math.ceil(sampleCount * .05))) {
        active[gridY][gridX] = true;
        colors[gridY][gridX] = vibrantScore > 55 && vibrant ? toHex(...vibrant) : toHex(red / foreground, green / foreground, blue / foreground);
      }
    }
  }

  // 輪郭線に囲まれた白い部位を塗りつぶすため、外周から到達可能な空白を識別する。
  const outside = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => false));
  const queue: Array<[number, number]> = [];
  for (let index = 0; index < gridSize; index++) {
    [[index, 0], [index, gridSize - 1], [0, index], [gridSize - 1, index]].forEach(([x, y]) => {
      if (!active[y][x] && !outside[y][x]) { outside[y][x] = true; queue.push([x, y]); }
    });
  }
  while (queue.length) {
    const [x, y] = queue.shift()!;
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextY < 0 || nextX >= gridSize || nextY >= gridSize || active[nextY][nextX] || outside[nextY][nextX]) return;
      outside[nextY][nextX] = true;
      queue.push([nextX, nextY]);
    });
  }
  const cells: SilhouetteCell[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!active[y][x] && !outside[y][x]) active[y][x] = true;
      if (!active[y][x]) continue;
      const nearest = colors[y][x] === "#8e98a8" ? "#f2f0e5" : colors[y][x];
      cells.push({ x, y, colorHex: nearest });
    }
  }
  return { gridSize, cells };
}

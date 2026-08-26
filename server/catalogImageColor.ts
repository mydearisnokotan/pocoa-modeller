type RgbPixel = readonly [number, number, number];

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 128;
}

/** 白に近い無彩色背景を除外し、ブロック画像本体の中央値をHEXへ変換する。 */
export function representativeHexFromPixels(pixels: RgbPixel[]) {
  const foreground = pixels.filter(([red, green, blue]) => !(red > 238 && green > 238 && blue > 238 && Math.max(red, green, blue) - Math.min(red, green, blue) < 16));
  const source = foreground.length ? foreground : pixels;
  const channels = [0, 1, 2].map(channel => median(source.map(pixel => pixel[channel])));
  return `#${channels.map(value => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

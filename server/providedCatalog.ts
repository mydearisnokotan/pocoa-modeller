export type ProvidedCatalogBlock = {
  block_key: string;
  name: string;
  category: string;
  obtaining_method?: string | null;
  recipe_unlock?: string | null;
  required_materials?: Record<string, number>;
};

export const missingImageBlockKeys = new Set(["clay_block", "gold_ore", "ditto_pattern_dlc"]);

export function imageBaseNameForBlock(name: string) {
  return name.normalize("NFC");
}

export function isImportableProvidedBlock(block: ProvidedCatalogBlock, availableImageNames: Set<string>) {
  return Boolean(block.block_key && block.name && block.category && availableImageNames.has(imageBaseNameForBlock(block.name)));
}

export function providedBlockDescription(block: ProvidedCatalogBlock) {
  const lines = [`提供カタログキー: ${block.block_key}`];
  if (block.recipe_unlock) lines.push(`レシピ・解放条件: ${block.recipe_unlock}`);
  if (block.obtaining_method) lines.push(`入手方法: ${block.obtaining_method}`);
  if (!block.required_materials || Object.keys(block.required_materials).length === 0) lines.push("素材内訳: 未登録（地形・環境ブロック）");
  return lines.join("\n");
}

const locationPatterns = [
  /パサパサこうやの街/g,
  /ゴツゴツやまの街/g,
  /キラキラうきしまの街/g,
  /ドンヨリうみべの街/g,
  /まっさらな街/g,
  /ゆめしま/g,
  /ポケモンセンター/g,
  /水面のキラキラ/g,
];

/** 素材の直接採取地ではなく、提供JSONのブロック入手・解放情報に書かれた場所を抽出する。 */
export function extractCatalogLocations(block: ProvidedCatalogBlock) {
  const text = [block.obtaining_method, block.recipe_unlock].filter(Boolean).join(" ");
  return Array.from(new Set(locationPatterns.flatMap(pattern => Array.from(text.matchAll(pattern), match => match[0]))));
}

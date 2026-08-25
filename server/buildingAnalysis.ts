import { invokeLLM } from "./_core/llm";

export type BuildingAnalysis = {
  summary: string;
  suitability: {
    overallScore: number;
    backgroundScore: number;
    resolutionScore: number;
    partVisibilityScore: number;
    depthScore: number;
    verdict: "excellent" | "good" | "caution" | "poor";
  };
  assessments: Array<{
    criterion: "建築適性" | "背景" | "解像度" | "部位欠損" | "立体構造" | "色判定";
    score: number;
    status: "good" | "caution" | "poor";
    note: string;
  }>;
  parts: Array<{
    id: string;
    name: string;
    role: string;
    layerId: string;
    dominantColor: string;
    coveragePercent: number;
    visibility: "full" | "partial" | "hidden";
    notes: string;
  }>;
  layers: Array<{
    id: string;
    name: string;
    order: number;
    purpose: string;
  }>;
  colorPalette: Array<{
    name: string;
    hex: string;
    prominence: number;
  }>;
  cautions: string[];
};

const analysisSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    suitability: {
      type: "object",
      properties: {
        overallScore: { type: "integer", minimum: 0, maximum: 100 },
        backgroundScore: { type: "integer", minimum: 0, maximum: 100 },
        resolutionScore: { type: "integer", minimum: 0, maximum: 100 },
        partVisibilityScore: { type: "integer", minimum: 0, maximum: 100 },
        depthScore: { type: "integer", minimum: 0, maximum: 100 },
        verdict: { type: "string", enum: ["excellent", "good", "caution", "poor"] },
      },
      required: ["overallScore", "backgroundScore", "resolutionScore", "partVisibilityScore", "depthScore", "verdict"],
      additionalProperties: false,
    },
    assessments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          criterion: { type: "string", enum: ["建築適性", "背景", "解像度", "部位欠損", "立体構造", "色判定"] },
          score: { type: "integer", minimum: 0, maximum: 100 },
          status: { type: "string", enum: ["good", "caution", "poor"] },
          note: { type: "string" },
        },
        required: ["criterion", "score", "status", "note"],
        additionalProperties: false,
      },
    },
    parts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" }, name: { type: "string" }, role: { type: "string" }, layerId: { type: "string" },
          dominantColor: { type: "string" }, coveragePercent: { type: "integer", minimum: 1, maximum: 100 },
          visibility: { type: "string", enum: ["full", "partial", "hidden"] }, notes: { type: "string" },
        },
        required: ["id", "name", "role", "layerId", "dominantColor", "coveragePercent", "visibility", "notes"],
        additionalProperties: false,
      },
    },
    layers: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, name: { type: "string" }, order: { type: "integer", minimum: 1, maximum: 12 }, purpose: { type: "string" } },
        required: ["id", "name", "order", "purpose"], additionalProperties: false,
      },
    },
    colorPalette: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, hex: { type: "string" }, prominence: { type: "integer", minimum: 1, maximum: 100 } },
        required: ["name", "hex", "prominence"], additionalProperties: false,
      },
    },
    cautions: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "suitability", "assessments", "parts", "layers", "colorPalette", "cautions"],
  additionalProperties: false,
};

export function parseImageDataUrl(dataUrl: string) {
  const matched = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!matched) throw new Error("PNG、JPEG、またはWebP画像を選択してください。");
  const bytes = Buffer.from(matched[2].replace(/[\r\n]/g, ""), "base64");
  if (bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
    throw new Error("画像サイズは5MB以下にしてください。");
  }
  return { mimeType: matched[1], bytes };
}

export async function analyzeBuildingImage(dataUrl: string): Promise<BuildingAnalysis> {
  const response = await invokeLLM({
    model: "gemini-3-flash-preview",
    maxTokens: 4500,
    messages: [
      {
        role: "system",
        content: "あなたは画像をブロック建築の資料として評価する、慎重な建築設計アシスタントです。推測を事実のように断定せず、見えない・隠れた部位は必ず注意点として示してください。建築そのものを完成するのではなく、ユーザーが後でブロックを選ぶための構造化された資料を作ります。日本語で出力してください。",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "この参照画像を建築資料として解析してください。建築適性・背景・解像度・部位欠損・立体構造・色判定を0〜100で評価し、見えている部位と建築レイヤーを列挙してください。部位はブロック選定に使える粒度に分けます。色はおおまかなHEXコードにしてください。" },
          { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
        ],
      },
    ],
    response_format: { type: "json_schema", json_schema: { name: "building_image_analysis", strict: true, schema: analysisSchema } },
  });
  const content = response.choices[0]?.message.content;
  if (typeof content !== "string") throw new Error("AI解析結果を読み取れませんでした。");
  return JSON.parse(content) as BuildingAnalysis;
}

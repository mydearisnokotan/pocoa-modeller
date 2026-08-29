// Preconfigured storage helpers for Manus WebDev templates
// Uploads via Forge Server presigned URL to S3 (PUT direct) or fallback in-memory store.
// Downloads return /manus-storage/{key} paths served via 307 redirect or local buffer.

import { ENV } from "./_core/env";

export const inMemoryStorage = new Map<string, { buffer: Buffer; contentType: string }>();

function hasForgeConfig() {
  return Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
}

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
    );
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);

  if (!hasForgeConfig()) {
    inMemoryStorage.set(key, { buffer, contentType });
    return { key, url: `/manus-storage/${key}` };
  }

  try {
    const { forgeUrl, forgeKey } = getForgeConfig();

    // 1. Get presigned PUT URL from Forge
    const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
    presignUrl.searchParams.set("path", key);

    const presignResp = await fetch(presignUrl, {
      headers: { Authorization: `Bearer ${forgeKey}` },
    });

    if (!presignResp.ok) {
      inMemoryStorage.set(key, { buffer, contentType });
      return { key, url: `/manus-storage/${key}` };
    }

    const { url: s3Url } = (await presignResp.json()) as { url: string };
    if (!s3Url) {
      inMemoryStorage.set(key, { buffer, contentType });
      return { key, url: `/manus-storage/${key}` };
    }

    // 2. PUT file directly to S3
    const blob = new Blob([buffer], { type: contentType });

    const uploadResp = await fetch(s3Url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: blob,
    });

    if (!uploadResp.ok) {
      inMemoryStorage.set(key, { buffer, contentType });
      return { key, url: `/manus-storage/${key}` };
    }

    return { key, url: `/manus-storage/${key}` };
  } catch (err) {
    console.warn("[Storage] Forge upload fallback to memory:", err);
    inMemoryStorage.set(key, { buffer, contentType });
    return { key, url: `/manus-storage/${key}` };
  }
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/manus-storage/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const key = normalizeKey(relKey);

  const localItem = inMemoryStorage.get(key);
  if (localItem) {
    return `data:${localItem.contentType};base64,${localItem.buffer.toString("base64")}`;
  }

  if (!hasForgeConfig()) {
    return `/manus-storage/${key}`;
  }

  try {
    const { forgeUrl, forgeKey } = getForgeConfig();

    const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
    getUrl.searchParams.set("path", key);

    const resp = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${forgeKey}` },
    });

    if (!resp.ok) {
      return `/manus-storage/${key}`;
    }

    const { url } = (await resp.json()) as { url: string };
    return url || `/manus-storage/${key}`;
  } catch {
    return `/manus-storage/${key}`;
  }
}

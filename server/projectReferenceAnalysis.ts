export const MAX_PROJECT_REFERENCES = 6;

export type ProjectReferenceView = "front" | "back" | "left" | "right" | "top" | "other";

export type StoredReferenceForAnalysis = {
  imageKey: string;
  imageUrl: string;
  view: ProjectReferenceView;
};

/** 初回画像を必ず含め、同じストレージキーを重複してVision解析へ渡さない。 */
export function collectReferencesForAnalysis(
  references: StoredReferenceForAnalysis[],
  fallback: StoredReferenceForAnalysis,
) {
  const byKey = new Map<string, StoredReferenceForAnalysis>();
  [fallback, ...references].forEach(reference => {
    if (!byKey.has(reference.imageKey)) byKey.set(reference.imageKey, reference);
  });
  const collected = Array.from(byKey.values());
  if (collected.length > MAX_PROJECT_REFERENCES) {
    throw new Error(`参照画像は初回画像を含めて最大${MAX_PROJECT_REFERENCES}枚までです。`);
  }
  return collected;
}

export function canAddReferenceCount(currentReferences: number, pendingReferences: number) {
  return currentReferences + pendingReferences <= MAX_PROJECT_REFERENCES;
}

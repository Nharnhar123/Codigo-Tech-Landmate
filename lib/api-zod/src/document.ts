export type LandDocumentType =
  | "indenture"
  | "titleDeed"
  | "lease"
  | "glcForm"
  | "unknown";

const DOCUMENT_KEYWORDS: Record<Exclude<LandDocumentType, "unknown">, string[]> = {
  indenture: ["this indenture", "indenture", "vendor", "purchaser", "whereas", "now therefore"],
  titleDeed: ["land title", "land title registry", "certificate of title", "title deed"],
  lease: ["lease", "lessee", "lessor", "term of years", "rent", "leasehold"],
  glcForm: ["ghana lands commission", "form no", "application for", "lands commission form"],
};

export function classifyDocument(text: string): LandDocumentType {
  const normalizedText = text.toLowerCase();

  for (const type of ["indenture", "titleDeed", "lease", "glcForm"] as const) {
    const matches = DOCUMENT_KEYWORDS[type].filter((keyword) =>
      normalizedText.includes(keyword),
    );
    if (matches.length >= 2) {
      return type;
    }
  }

  return "unknown";
}

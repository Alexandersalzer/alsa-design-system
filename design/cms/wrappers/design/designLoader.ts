export interface DesignJson {
  globalStyles?: {
    radius?: string;
    accentColor?: string;
    isDark?: boolean;
    themeTone?: "mono" | "linen" | "ink" | "clay" | "slate" | "sage" | "frost" | "pearl" | "aqua";
    fontPrimary?: string;
    fontSecondary?: string;
    fontWeightScale?: "light" | "regular" | "strong" | "extraStrong";
    layoutContent?: string;
    layoutMedia?: string;
    sectionSpacing?: string;
    containerSpacing?: string;
    navbarSpacing?: string;
    formWidth?: string;         // ← NEW: xs | sm | md | lg | xl
    typographyScale?: "sm" | "md" | "lg";
  };
}

export async function getDesignConfig(): Promise<DesignJson> {
  if (typeof window !== "undefined") {
    throw new Error("getDesignConfig is only available on the server-side");
  }

  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const designPath = path.join(process.cwd(), "public", "design", "design.json");
    const file = await fs.readFile(designPath, "utf8");
    const json = JSON.parse(file);
    return json;
  } catch (error) {
    console.error("⚠️ Failed to load design.json from public/design:", error);
    return {
      globalStyles: {
        radius: "md",
        accentColor: "purple",
        isDark: false,
  themeTone: "mono", // Add "aqua" to enable for clients
        fontPrimary: "Sora",
        fontSecondary: "Inter",
        fontWeightScale: "regular",
        layoutContent: "md",
        layoutMedia: "xl",
        sectionSpacing: "md",
        containerSpacing: "md",
        navbarSpacing: "md",
        typographyScale: "md",
      },
    };
  }
}

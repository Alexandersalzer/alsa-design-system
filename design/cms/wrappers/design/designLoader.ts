export interface DesignJson {
  globalStyles?: {
    radius?: string;
    accentColor?: string;
    isDark?: boolean;
    fontPrimary?: string;
    layoutContent?: string;
    layoutMedia?: string;
    sectionSpacing?: string;
    containerSpacing?: string; // ✅ NEW
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
        fontPrimary: "Sora",
        layoutContent: "md",
        layoutMedia: "xl",
        sectionSpacing: "md",
        containerSpacing: "md" // ✅ NEW fallback
      } 
    };
  }
}
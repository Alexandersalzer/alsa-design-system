import type { DesignConfig } from "../types/design";
import { loadJsonFile } from "../utils/loaders";

const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  globalStyles: {
    radius: "md",
    accentColor: "purple",
    isDark: false,
    themeTone: "mono",
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

export async function getDesignConfig(): Promise<DesignConfig> {
  const config = await loadJsonFile<DesignConfig>(
    "design/design.json",
    undefined,
    DEFAULT_DESIGN_CONFIG
  );
  
  return config || DEFAULT_DESIGN_CONFIG;
}

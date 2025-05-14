import type { TextOverlay } from "../db/models/TextOverlay";

export interface projectDataTypes {
  name: string;
  orientation: string;
  screens: Array<string>;
  screenshots: File[];
  background?: {
    type: "color" | "image";
    // value: string;
    name?: string;
  };
  textOverlayDefaults?: Partial<TextOverlay>;
  dimensions?: { width: number; height: number };
}

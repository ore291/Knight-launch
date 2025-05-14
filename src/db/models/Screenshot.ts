import { type TextOverlay } from "./TextOverlay";
// Type for background (color or predefined image)
type Background =
  | { type: 'color'; value: string } // e.g., { type: 'color', value: '#ffffff' }
  | { type: 'image'; name: string }; // e.g., { type: 'image', name: 'gradient1' }
export interface Screenshot {
  id?: number; // Auto-incremented by Dexie
  projectId: number; // Foreign key referencing Project
  baseImage: string; // User-uploaded screenshot image
  textOverlays?: TextOverlay[]; // Array of text customizations
  background?: Background; // Background color or predefined image
  deviceFrame?: string; // Name of predefined device frame (e.g., 'iphone12')
}

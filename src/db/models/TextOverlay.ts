// Interface for text overlay customizations
export interface TextOverlay {
  text: string; // Text content
  x: number; // X-coordinate position
  y: number; // Y-coordinate position
  font: string; // Font family (e.g., 'Arial')
  color: string; // Text color (e.g., '#000000')
  size: number; // Font size in pixels
}
// Interface for Project entity
export interface Project {
  id?: number; // Auto-incremented by Dexie
  name: string; // Project name
  orientation?: string;
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last modification timestamp
}
